window.onload = startGame;
var stageWidth;
var stageHeight;
var currentNavigator;

currentNavigator = 'desktop';
stageWidth = 768;
stageHeight = 1024;

var secretKey = "tetrisNilee";

var game = new Phaser.Game(stageWidth, stageHeight, Phaser.CANVAS, '');
var cache = new Phaser.Cache(game);
var customFontStyle1 = 'Source';
var customFontStyle2 = 'Exo';
var isSoundOn = true;
var score = 0;
var finalScore = 0;
var gamePaused = false;
var levelsUnlocked = 1;
var gameOverFlag = false;
var gameBeingPlayed = false;
var scorePerRow = 100;
var coinsPerRow = 5;
var scoreNum;
var initCoins = 20;
var prevScore;
var coins = initCoins;
var numCoins;
var scorePer3 = 50;
var bonusFor4 = 75;
var bonusFor5 = 100;
var chainBonus = 125;
var magicBonus = 100;
var scoreTxt;
var magicMode = false;
var availableMatches;

var chainLength = 0;

var introSound;
var buttonSound;
var magicSound;
var gameSound;

var shuffleCoins = 20;
var resizeCoins = 30;
var bombCoins = 40;





var tiles;
var activeTile1 = null;
var activeTile2 = null;
var canMove = false;
var numMoves;
var numMovesTxt;
var numMovesForShuffle = 1;
var curLevelTarget;
var tickImg;
var target;
var tileWidth;
var tileHeight;
var tileGrid = undefined;
var startPosY
var startPosX



var RIGHT = 0;
var LEFT = 1;
var firstRunLandscape;

var gameOverTweenBlack;
var gameOverBoard;
var gameOverTxt;
var distanceCoverTxt;
var finalscoreTxt;
var curleveltxt;
var youCompletedTxt
var replayBtn;
var nextLevelBtn;
var numCoinsTxtt;
var submitBtn;
var finalScore;


var levelButtonsArray = [];
var levelTextArray = [];
var currentLevel;

var timerEvents;
var leftKey;
var rightKey;
var upKey;
var downKey;
var touchX;
var touchY;
var touchId;
var levelGoals;

var curPieceImgArray = new Array();
var currentBoardImgArray = new Array();

var ROWS = 20;
var COLS = 10;
var SIZE = 64;
var curPiece;
var gameData;
var prevTime;
var curTime;
var lineSpan;
var curLines;


function mode(array) {
    if (array.length == 0)
        return null;
    var modeMap = {};
    var maxEl = array[0],
        maxCount = 1;
    for (var i = 0; i < array.length; i++) {
        var el = array[i];
        if (modeMap[el] == null)
            modeMap[el] = 1;
        else
            modeMap[el]++;
        if (modeMap[el] > maxCount) {
            maxEl = el;
            maxCount = modeMap[el];
        }
    }
    return maxEl;
}

function getRandom(arr) {
    var random1 = Math.floor((Math.random() * (arr.length)));
    return arr[random1][Math.floor((Math.random() * (arr[random1].length)))];
}

function isStock() {
    var matches = window.navigator.userAgent.match(/Android.*AppleWebKit\/([\d.]+)/);
    return matches && matches[1] < 537;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function handleIncorrect() {
    if (!game.device.desktop) {
        document.getElementById("turn").style.display = "block";
    }
}


function handleCorrect() {
    if (!game.device.desktop) {
        if (firstRunLandscape) {
            gameRatio = window.innerWidth / window.innerHeight;
            game.width = Math.ceil(768 * gameRatio);
            game.height = 1024;
            game.renderer.resize(game.width, game.height);
            game.state.start("preloader");
        }
        document.getElementById("turn").style.display = "none";
    }
}



function replayGame() {
    gameOverFlag = false;
    gameBeingPlayed = false;

    // var tweenBlack = this.game.add.graphics(0,0);
    // tweenBlack.beginFill("#000000");
    // tweenBlack.drawRect(0, 0, stageWidth+1, stageHeight);
    // tweenBlack.alpha = 0;
    // 
    // var stateTween = game.add.tween(tweenBlack).to({alpha:1},200,Phaser.Easing.Linear.None);
    // stateTween.start();
    // stateTween.onComplete.add(function(){
    // game.state.start("inGame");
    // }, this);

    //FOR API
    updatePlayAgain();
}

function goToNextLevel() {

    localStorage['finalScore'] = CryptoJS.AES.encrypt(finalScore + "", secretKey);

    currentLevel += 1;

    gameOverFlag = false;
    gameBeingPlayed = false;

    var tweenBlack = this.game.add.graphics(0, 0);
    tweenBlack.beginFill("#000000");
    tweenBlack.drawRect(0, 0, stageWidth + 1, stageHeight);
    tweenBlack.alpha = 0;

    var stateTween = game.add.tween(tweenBlack).to({
        alpha: 1
    }, 200, Phaser.Easing.Linear.None);
    stateTween.start();
    stateTween.onComplete.add(function() {
        game.state.start("inGame");
    }, this);
}

function submitUserScore() {
    console.log(finalScore);
    var submit_score = finalScore;
    submit_on_game_click(submit_score);
}

var ua = navigator.userAgent.toLowerCase();
var isSharpMiniStock = ((/SHL24/i).test(ua)) && isStock();
var isXperiaAStock = ((/SO-04E/i).test(ua)) && isStock();
var isFujitsu = ((/F-01F/i).test(ua)) && isStock();
var isSharp = ((/SH-01F/i).test(ua)) && isStock();

function addBonusTile(x, y, bonusTileType, bonusTileRowCount) {
    //Choose a random tile to add 

    console.log(bonusTileType)
    //Add the tile at the correct x position, but add it to the top of the game (so we can slide it in)
    var tile = tiles.create(xpos + (x * tileWidth) + tileWidth / 2, 0, bonusTileType + "" + bonusTileRowCount);

    //Animate the tile into the correct vertical position
    this.game.add.tween(tile).to({
        y: ypos + (y * tileHeight) + (tileHeight / 2)
    }, 500, Phaser.Easing.Back.Out, true)

    //Set the tiles anchor point to the center
    tile.anchor.setTo(0.5, 0.5);

    //Enable input on the tile
    tile.inputEnabled = true;

    //Keep track of the type of tile that was added
    tile.tileType = bonusTileType;

    tile.bonusRowCount = bonusTileRowCount;

    //Trigger the tileDown function whenever the user clicks or taps on this tile
    tile.events.onInputDown.add(tileDown, this);

    return tile;
}

function addTile(x, y) {

    //Choose a random tile to add
    var tileToAdd = tileTypes[getRandomInt(0, tileTypes.length - 1)];

    //Add the tile at the correct x position, but add it to the top of the game (so we can slide it in)
    var tile = tiles.create(xpos + (x * tileWidth) + tileWidth / 2, 0, tileToAdd);

    //Animate the tile into the correct vertical position
    this.game.add.tween(tile).to({
        y: ypos + (y * tileHeight) + (tileHeight / 2)
    }, 500, Phaser.Easing.Back.Out, true)

    //Set the tiles anchor point to the center
    tile.anchor.setTo(0.5, 0.5);

    //Enable input on the tile
    tile.inputEnabled = true;

    //Keep track of the type of tile that was added
    tile.tileType = tileToAdd;

    //Trigger the tileDown function whenever the user clicks or taps on this tile
    tile.events.onInputDown.add(tileDown, this);

    return tile;

}


function shuffleGrid() {

    activeTile1 = undefined;
    activeTile2 = undefined;
    canMove = false;

    numMoves -= numMovesForShuffle;

    numMovesTxt.setText(numMoves);


    for (var i = 0; i < tileGrid.length; i++) {
        k = tileGrid[i].length;
        while (k--) {
            j = Math.floor(Math.random() * (tileGrid.length - 1));
            tempk = tileGrid[i][k];
            tempj = tileGrid[i][j];
            tileGrid[i][k] = tempj;
            tileGrid[i][j] = tempk;
        }
    }

    tempGrid = [];

    for (var i = 0; i < tileGrid.length; i++) {

        tmpArray = [];
        for (var j = 0; j < tileGrid[i].length; j++) {

            tmpArray.push(tileGrid[i][j].key);
        }
        tempGrid.push(tmpArray);
    }



    for (var i = 0; i < tileGrid.length; i++) {

        for (var j = 0; j < tileGrid[i].length; j++) {

            tileGrid[i][j].destroy();
            tileGrid[i][j] = null;
        }
    }



    for (var i = 0; i < tileGrid.length; i++) {

        for (var j = 0; j < tileGrid[i].length; j++) {

            if (tileGrid[i][j] == null) {

                //Add the tile at the correct x position, but add it to the top of the game (so we can slide it in)
                var tile = tiles.create(xpos + (i * tileWidth) + tileWidth / 2, ypos + (j * tileHeight) + (tileHeight / 2), tempGrid[i][j]);

                //Animate the tile into the correct vertical position
                //this.game.add.tween(tile).to({y:200+(j*tileHeight)+(tileHeight/2)}, 500, Phaser.Easing.Back.Out, true)

                //Set the tiles anchor point to the center
                tile.anchor.setTo(0.5, 0.5);

                //Enable input on the tile
                tile.inputEnabled = true;

                //Keep track of the type of tile that was added
                tile.tileType = tempGrid[i][j];

                //Trigger the tileDown function whenever the user clicks or taps on this tile
                tile.events.onInputDown.add(tileDown, this);

                tileGrid[i][j] = tile;
            }

        }
    }

    checkMatch();

}


function checkMatch() {

    //Call the getMatches function to check for spots where there is
    //a run of three or more tiles in a row
    var matches = getMatches(tileGrid);

    //If there are matches, remove them
    if (matches.length > 0) {

        if (activeTile1 != null) {
            numMoves--;
            numMovesTxt.setText(numMoves);
        }
        //Remove the tiles
        removeTileGroup(matches);

        //Move the tiles currently on the board into their new positions
        resetTile();

        //Fill the board with new tiles wherever there is an empty spot
        fillTile();

        //Trigger the tileUp event to reset the active tiles
        game.time.events.add(500, tileUp);

        //Check again to see if the repositioning of tiles caused any new matches
        game.time.events.add(600, checkMatch);

    } else {

        //No match so just swap the tiles back to their original position and reset
        swapTiles();
        game.time.events.add(500, function() {
            tileUp();
            canMove = true;
        });


        if ((score >= target) && (numMoves > 0)) {
            magicMode = true;

            game.add.tween(game.add.text(170, -300, 'MAGIC MODE', {
                    'font': '65px Exo',
                    'strokeThickness': '0',
                    'stroke': 'black',
                    'fill': 'white'
                }))
                .to({
                    y: 350
                }, 200, Phaser.Easing.Back.Out).delay(200)
                .to({
                    y: 1200
                }, 1000, Phaser.Easing.Back.In).start();

            for (x = 0; x < numMoves; x++) {
                randTile = getRandom(tileGrid);

                if (randTile != null) {
                    explosion = game.add.emitter(randTile.x, randTile.y, 10);

                    randomInt = getRandomInt(1, 10);
                    explosion.makeParticles('trailImg');
                    explosion.width = 1;
                    explosion.setAlpha(1, 0.1, 1000);
                    explosion.setScale(1, 0.15, 1, 0.15, 1000, Phaser.Easing.Quintic.Out);
                    explosion.start(true, randomInt * 100, null, 10);

                    explosion.forEach(function(particle) {
                        // tint every particle red
                        arrColor = [0xffff00, 0xffffff, 0x00ff00]
                        randColr = arrColor[Math.floor(Math.random() * arrColor.length)];

                        particle.tint = randColr;
                    });

                    randTile.destroy();
                }

                score += magicBonus;
                scoreTxt.setText(score);

            }

            numMoves = 0;
            numMovesTxt.setText("0");

            gameWon();
        } else if ((score < target) && (numMoves == 0)) {
            levelLost();
        }
    }

}


function gameWon() {

    var tweenBlack = this.game.add.graphics(0, 0);
    tweenBlack.beginFill("#000000");
    tweenBlack.drawRect(0, 0, stageWidth + 1, stageHeight);
    tweenBlack.alpha = 0;

    var stateTween = game.add.tween(tweenBlack).to({
        alpha: 1
    }, 500, Phaser.Easing.Linear.None).delay(2000);
    stateTween.start();
    stateTween.onComplete.add(function() {
        game.state.start("gameWon");
    }, this);

    var fake = this.game.add.sprite(0, 0, '');
}

function levelLost() {
    var tweenBlack = this.game.add.graphics(0, 0);
    tweenBlack.beginFill("#000000");
    tweenBlack.drawRect(0, 0, stageWidth + 1, stageHeight);
    tweenBlack.alpha = 0;

    var stateTween = game.add.tween(tweenBlack).to({
        alpha: 1
    }, 500, Phaser.Easing.Linear.None);
    stateTween.start();
    stateTween.onComplete.add(function() {
        game.state.start("gameLost");
    }, this);

    var fake = this.game.add.sprite(0, 0, '');
}


function swapTiles() {
    //If there are two active tiles, swap their positions
    if (activeTile1 && activeTile2) {

        var tile1Pos = {
            x: ((activeTile1.x - tileWidth / 2) - xpos) / tileWidth,
            y: ((activeTile1.y - tileHeight / 2) - ypos) / tileHeight
        };
        var tile2Pos = {
            x: ((activeTile2.x - tileWidth / 2) - xpos) / tileWidth,
            y: ((activeTile2.y - tileHeight / 2) - ypos) / tileHeight
        };

        //Swap them in our "theoretical" grid
        tileGrid[tile1Pos.x][tile1Pos.y] = activeTile2;
        tileGrid[tile2Pos.x][tile2Pos.y] = activeTile1;

        //Actually move them on the screen
        this.game.add.tween(activeTile1).to({
            x: xpos + tile2Pos.x * tileWidth + (tileWidth / 2),
            y: ypos + tile2Pos.y * tileHeight + (tileHeight / 2)
        }, 200, Phaser.Easing.Linear.In, true);
        this.game.add.tween(activeTile2).to({
            x: xpos + tile1Pos.x * tileWidth + (tileWidth / 2),
            y: ypos + tile1Pos.y * tileHeight + (tileHeight / 2)
        }, 200, Phaser.Easing.Linear.In, true);

        activeTile1 = tileGrid[tile1Pos.x][tile1Pos.y];
        activeTile2 = tileGrid[tile2Pos.x][tile2Pos.y];

    }

}

function tileUp() {

    //Reset the active tiles
    activeTile1 = null;
    activeTile2 = null;

}


function tileDown(tile, pointer) {

    if (magicMode == false) {
        chainLength = 0;
        //Keep track of where the user originally clicked
        if (canMove) {
            activeTile1 = tile;

            startPosX = ((tile.x - tileWidth / 2) - xpos) / tileWidth;

            startPosY = ((tile.y - tileHeight / 2) - ypos) / tileHeight;

            console.log(startPosX + ":" + startPosY);
        }
    }
}


function sampleSwap(x1, y1, x2, y2) {
    var typeswap = tileGrid[x1][y1].tileType;
    tileGrid[x1][y1].tileType = tileGrid[x2][y2].tileType;
    tileGrid[x2][y2].tileType = typeswap;
}

function findMoves() {

    if (gameBeingPlayed == true) {
        availableMatches = [];
        swapPositions = [];
        // Check horizontal swaps
        for (var j = 0; j < tileGrid[0].length; j++) {
            var tempArr = tileGrid;
            for (var i = 0; i < tempArr.length; i++) {

                if (i < tempArr.length - 1) {
                    sampleSwap(i, j, i + 1, j);
                    availableMatches = getMatches(tileGrid);
                    sampleSwap(i, j, i + 1, j);


                    if (availableMatches.length > 0) {
                        tmpObj1 = {
                            x: i,
                            y: j
                        };
                        tmpObj2 = {
                            x: i + 1,
                            y: j
                        };
                        swapPositions.push(tmpObj1);
                        swapPositions.push(tmpObj2);
                        break;
                    }
                }
            }
            if (availableMatches.length > 0) {
                console.log("Match FOund");
                break;
            }
        }


        var tileTypeValues = [];

        for (x = 0; x < availableMatches.length; x++) {
            console.log(availableMatches[x].length);
            for (y = 0; y < availableMatches[x].length; y++) {
                tileTypeValues.push(availableMatches[x][y].tileType);
            }
        }

        console.log(swapPositions);
        if (tileGrid[swapPositions[0]['x']][swapPositions[0]['y']].tileType == mode(tileTypeValues)) {
            // tileGrid[swapPositions[0]['x']][swapPositions[0]['y']].alpha = 0.3;
            game.add.tween(tileGrid[swapPositions[0]['x']][swapPositions[0]['y']]).to({
                    angle: 30
                }, 100, Phaser.Easing.Linear.None)
                .to({
                    angle: -30
                }, 100, Phaser.Easing.Linear.None)
                .to({
                    angle: 30
                }, 100, Phaser.Easing.Linear.None)
                .to({
                    angle: -30
                }, 100, Phaser.Easing.Linear.None)
                .to({
                    angle: 0
                }, 100, Phaser.Easing.Linear.None).start();
        } else {
            // tileGrid[swapPositions[1]['x']][swapPositions[1]['y']].alpha = 0.3;
            game.add.tween(tileGrid[swapPositions[1]['x']][swapPositions[1]['y']]).to({
                    angle: 30
                }, 100, Phaser.Easing.Linear.None)
                .to({
                    angle: -30
                }, 100, Phaser.Easing.Linear.None)
                .to({
                    angle: 30
                }, 100, Phaser.Easing.Linear.None)
                .to({
                    angle: -30
                }, 100, Phaser.Easing.Linear.None)
                .to({
                    angle: 0
                }, 100, Phaser.Easing.Linear.None).start();
        }

        for (x = 0; x < availableMatches.length; x++) {
            for (y = 0; y < availableMatches[x].length; y++) {
                if (availableMatches[x][y].tileType == mode(tileTypeValues)) {
                    // availableMatches[x][y].alpha = 0.3;
                    game.add.tween(availableMatches[x][y]).to({
                            angle: 30
                        }, 100, Phaser.Easing.Linear.None)
                        .to({
                            angle: -30
                        }, 100, Phaser.Easing.Linear.None)
                        .to({
                            angle: 30
                        }, 100, Phaser.Easing.Linear.None)
                        .to({
                            angle: -30
                        }, 100, Phaser.Easing.Linear.None)
                        .to({
                            angle: 0
                        }, 100, Phaser.Easing.Linear.None).start();
                }
            }
        }



        // CHECK FOR VERTICAL SWAPS IF THERE ARE NO HORIZONTAL SWAPS AVAILABLE

        if (availableMatches.length == 0) {
            //Check Vertical swaps
            for (i = 0; i < tileGrid.length; i++) {
                var tempArr = tileGrid[i];

                for (j = 0; j < tempArr.length; j++) {

                    if (j < tempArr.length - 1) {
                        sampleSwap(i, j, i, j + 1);
                        availableMatches = getMatches(tileGrid);
                        sampleSwap(i, j, i, j + 1);

                        if (availableMatches.length > 0) {
                            tmpObj1 = {
                                x: i,
                                y: j
                            };
                            tmpObj2 = {
                                x: i,
                                y: j + 1
                            };
                            swapPositions.push(tmpObj1);
                            swapPositions.push(tmpObj2);
                            break;
                        }
                    }
                }
                if (availableMatches.length > 0) {
                    console.log("Match FOund");
                    break;
                }
            }



            var tileTypeValues = [];

            for (x = 0; x < availableMatches.length; x++) {
                console.log(availableMatches[x].length);
                for (y = 0; y < availableMatches[x].length; y++) {
                    tileTypeValues.push(availableMatches[x][y].tileType);
                }
            }

            console.log(swapPositions);
            if (tileGrid[swapPositions[0]['x']][swapPositions[0]['y']].tileType == mode(tileTypeValues)) {
                // tileGrid[swapPositions[0]['x']][swapPositions[0]['y']].alpha = 0.3;
                game.add.tween(tileGrid[swapPositions[0]['x']][swapPositions[0]['y']]).to({
                        angle: 30
                    }, 100, Phaser.Easing.Linear.None)
                    .to({
                        angle: -30
                    }, 100, Phaser.Easing.Linear.None)
                    .to({
                        angle: 30
                    }, 100, Phaser.Easing.Linear.None)
                    .to({
                        angle: -30
                    }, 100, Phaser.Easing.Linear.None)
                    .to({
                        angle: 0
                    }, 100, Phaser.Easing.Linear.None).start();
            } else {
                // tileGrid[swapPositions[1]['x']][swapPositions[1]['y']].alpha = 0.3;
                game.add.tween(tileGrid[swapPositions[1]['x']][swapPositions[1]['y']]).to({
                        angle: 30
                    }, 100, Phaser.Easing.Linear.None)
                    .to({
                        angle: -30
                    }, 100, Phaser.Easing.Linear.None)
                    .to({
                        angle: 30
                    }, 100, Phaser.Easing.Linear.None)
                    .to({
                        angle: -30
                    }, 100, Phaser.Easing.Linear.None)
                    .to({
                        angle: 0
                    }, 100, Phaser.Easing.Linear.None).start();
            }

            for (x = 0; x < availableMatches.length; x++) {
                for (y = 0; y < availableMatches[x].length; y++) {
                    if (availableMatches[x][y].tileType == mode(tileTypeValues)) {
                        // availableMatches[x][y].alpha = 0.3;
                        game.add.tween(availableMatches[x][y]).to({
                                angle: 30
                            }, 100, Phaser.Easing.Linear.None)
                            .to({
                                angle: -30
                            }, 100, Phaser.Easing.Linear.None)
                            .to({
                                angle: 30
                            }, 100, Phaser.Easing.Linear.None)
                            .to({
                                angle: -30
                            }, 100, Phaser.Easing.Linear.None)
                            .to({
                                angle: 0
                            }, 100, Phaser.Easing.Linear.None).start();
                    }
                }
            }


            // end of vertical swaps


        }



    }

}


function getMatches(tileGrid) {

    var matches = [];
    var groups = [];

    //Check for horizontal matches
    for (var i = 0; i < tileGrid.length; i++) {
        var tempArr = tileGrid[i];
        groups = [];
        for (var j = 0; j < tempArr.length; j++) {
            //console.log(i+":"+j);
            if (j < tempArr.length - 2)
                if (tileGrid[i][j] && tileGrid[i][j + 1] && tileGrid[i][j + 2]) {
                    if (tileGrid[i][j].tileType == tileGrid[i][j + 1].tileType && tileGrid[i][j + 1].tileType == tileGrid[i][j + 2].tileType) {
                        if (groups.length > 0) {
                            if (groups.indexOf(tileGrid[i][j]) == -1) {
                                matches.push(groups);
                                groups = [];
                            }
                        }

                        if (groups.indexOf(tileGrid[i][j]) == -1) {
                            groups.push(tileGrid[i][j]);
                        }
                        if (groups.indexOf(tileGrid[i][j + 1]) == -1) {
                            groups.push(tileGrid[i][j + 1]);
                        }
                        if (groups.indexOf(tileGrid[i][j + 2]) == -1) {
                            groups.push(tileGrid[i][j + 2]);
                        }
                    }
                }
        }
        if (groups.length > 0) matches.push(groups);
    }

    //console.log("***********************************************");
    //Check for vertical matches
    for (j = 0; j < tileGrid[0].length; j++) {
        var tempArr = tileGrid;

        groups = [];
        for (i = 0; i < tempArr.length; i++) {
            //console.log(i+":"+j);
            if (i < tempArr.length - 2)
                if (tileGrid[i][j] && tileGrid[i + 1][j] && tileGrid[i + 2][j]) {
                    if (tileGrid[i][j].tileType == tileGrid[i + 1][j].tileType && tileGrid[i + 1][j].tileType == tileGrid[i + 2][j].tileType) {
                        if (groups.length > 0) {
                            if (groups.indexOf(tileGrid[i][j]) == -1) {
                                matches.push(groups);
                                groups = [];
                            }
                        }

                        if (groups.indexOf(tileGrid[i][j]) == -1) {
                            groups.push(tileGrid[i][j]);
                        }
                        if (groups.indexOf(tileGrid[i + 1][j]) == -1) {
                            groups.push(tileGrid[i + 1][j]);
                        }
                        if (groups.indexOf(tileGrid[i + 2][j]) == -1) {
                            groups.push(tileGrid[i + 2][j]);
                        }
                    }
                }
        }
        if (groups.length > 0) matches.push(groups);
    }

    return matches;

}



function removeTileGroup(matches) {

    chainLength++;
    //Loop through all the matches and remove the associated tiles

    if (chainLength > 1) {
        game.add.tween(game.add.text(120, -300, 'Chain Bonus: +' + chainBonus, {
                'font': '55px Exo',
                'strokeThickness': '10',
                'stroke': 'black',
                'fill': 'white'
            }))
            .to({
                y: 300
            }, 600, Phaser.Easing.Back.Out).delay(400)
            .to({
                y: 1200
            }, 600, Phaser.Easing.Back.In).start();

        chainLength = 0;
        score += chainBonus;
        scoreTxt.setText(score);
    }


    for (var i = 0; i < matches.length; i++) {
        var tempArr = matches[i];

        magicSound.play();

        if (tempArr.length >= 5) {
            game.add.tween(game.add.text(120, -300, 'Marvellous! +' + bonusFor5, {
                    'font': '65px Exo',
                    'strokeThickness': '10',
                    'stroke': 'black',
                    'fill': 'yellow'
                }))
                .to({
                    y: 350
                }, 600, Phaser.Easing.Back.Out)
                .to({
                    y: 1200
                }, 600, Phaser.Easing.Back.In).start();
            score += bonusFor5;
            scoreTxt.setText(score);
        } else if (tempArr.length == 4) {
            game.add.tween(game.add.text(140, -300, 'Charming! +' + bonusFor4, {
                    'font': '55px Exo',
                    'strokeThickness': '10',
                    'stroke': 'black',
                    'fill': 'yellow'
                }))
                .to({
                    y: 450
                }, 600, Phaser.Easing.Back.Out)
                .to({
                    y: 1200
                }, 600, Phaser.Easing.Back.In).start();

            score += bonusFor4;
            scoreTxt.setText(score);
        } else {
            game.add.tween(game.add.text(300, -300, '+' + scorePer3, {
                    'font': '55px Exo',
                    'strokeThickness': '0',
                    'stroke': 'black',
                    'fill': 'yellow'
                }))
                .to({
                    y: 400
                }, 600, Phaser.Easing.Back.Out)
                .to({
                    y: 1200
                }, 600, Phaser.Easing.Back.In).start();

            score += scorePer3;
            scoreTxt.setText(score);
        }

        var temp4InaRow;
        var tileType4InARow;

        for (var j = 0; j < tempArr.length; j++) {

            var tile = tempArr[j];
            //Find where this tile lives in the theoretical grid
            var tilePos = getTilePos(tileGrid, tile);

            explosion = game.add.emitter(tile.x, tile.y, 10);

            explosion.makeParticles('trailImg');
            explosion.width = 1;
            // explosion.setXSpeed(-200,200);
            //explosion.setYSpeed(-200,200);
            //explosion.setRotation(-1000,-1000);
            explosion.setAlpha(1, 0.1, 800);
            explosion.setScale(1, 0.1, 1, 0.1, 500, Phaser.Easing.Quintic.Out);
            explosion.start(true, 500, null, 30);

            explosion.forEach(function(particle) {
                // tint every particle red
                arrColor = [0xffff00, 0xffffff, 0x0000ff, 0x00ff00]
                randColr = arrColor[Math.floor(Math.random() * arrColor.length)];

                particle.tint = randColr;
            });

            // If a bonus is involved
            if (tile.bonusRowCount != undefined) {

                console.log("A Bonus is involved in " + tilePos.x + ":" + tilePos.y);
                for (k = 0; k < tileGrid.length; k++) {
                    var tileBonusDelPos = getTilePos(tileGrid, tileGrid[k][tilePos.y]);

                    if (tileGrid[k][tilePos.y] != null) {
                        explosion = game.add.emitter(0, tileGrid[k][tilePos.y].y, 350);
                        explosion.makeParticles('trailImg');
                        explosion.width = 10;
                        explosion.setAlpha(1, 0.1, 1000);
                        explosion.setScale(0.5, 0.1, 0.5, 0.1, 1000, Phaser.Easing.Quintic.Out);
                        explosion.start(false, 1000, 50);


                        explosion.emitX = 0;

                        //game.add.tween(explosion).to( { emitX: 1000 }, 1000, Phaser.Easing.Linear.None, true, 0, Number.MAX_VALUE, true);
                        game.add.tween(explosion).to({
                            emitX: 1000
                        }, 1000, Phaser.Easing.Linear.None).start();
                        tiles.remove(tileGrid[k][tilePos.y]);

                        //Remove the tile from the theoretical grid
                        if (tileBonusDelPos.x != -1 && tileBonusDelPos.y != -1) {
                            tileGrid[tileBonusDelPos.x][tileBonusDelPos.y] = null;
                        }
                    }

                }
            } else if (tempArr.length == 4) {
                temp4InaRow = tilePos;
                tileType4InARow = tile.tileType;
            }

            //Remove the tile from the screen
            tiles.remove(tile);


            //Remove the tile from the theoretical grid
            if (tilePos.x != -1 && tilePos.y != -1) {
                tileGrid[tilePos.x][tilePos.y] = null;
            }



        }


        if (tempArr.length == 4) {
            console.log(temp4InaRow + ":" + tileType4InARow);
            tileGrid[temp4InaRow['x']][temp4InaRow['y']] = tileType4InARow + ' 4';
        }
    }

    // check if target reached
    if (score >= target) {
        console.log(score);
        curLevelTarget.destroy();

        tickImg = game.add.sprite(130, 60, 'tickImg');
        tickImg.scale.x = 0.4;
        tickImg.scale.y = 0.4;
    }
}


function getTilePos(tileGrid, tile) {
    var pos = {
        x: -1,
        y: -1
    };

    //Find the position of a specific tile in the grid
    for (var i = 0; i < tileGrid.length; i++) {
        for (var j = 0; j < tileGrid[i].length; j++) {
            //There is a match at this position so return the grid coords
            if (tile == tileGrid[i][j]) {
                pos.x = i;
                pos.y = j;
                break;
            }
        }
    }

    return pos;
}


function resetTile() {

    //Loop through each column starting from the left
    for (var i = 0; i < tileGrid.length; i++) {

        //Loop through each tile in column from bottom to top
        for (var j = tileGrid[i].length - 1; j > 0; j--) {

            //If this space is blank, but the one above it is not, move the one above down
            if (tileGrid[i][j] == null && tileGrid[i][j - 1] != null) {
                //Move the tile above down one
                var tempTile = tileGrid[i][j - 1];
                tileGrid[i][j] = tempTile;
                tileGrid[i][j - 1] = null;

                this.game.add.tween(tempTile).to({
                    y: ypos + (tileHeight * j) + (tileHeight / 2)
                }, 500, Phaser.Easing.Back.Out, true);

                //The positions have changed so start this process again from the bottom
                //NOTE: This is not set to me.tileGrid[i].length - 1 because it will immediately be decremented as
                //we are at the end of the loop.
                j = tileGrid[i].length;
            }
        }
    }

}


function fillTile() {


    //Check for blank spaces in the grid and add new tiles at that position
    for (var i = 0; i < tileGrid.length; i++) {

        for (var j = 0; j < tileGrid[i].length; j++) {

            if (tileGrid[i][j] == null) {
                //Found a blank spot so lets add animate a tile there
                var tile = addTile(i, j);

                //And also update our "theoretical" grid
                tileGrid[i][j] = tile;
            }
            //BONUS TILE
            else if ((tileGrid[i][j] != null) && (typeof tileGrid[i][j] == 'string')) {

                bonusType = tileGrid[i][j].split(" ");

                var tile = addBonusTile(i, j, bonusType[0], bonusType[1]);
                tileGrid[i][j] = tile;
            }

        }
    }

}


function startGame() {

    var stockAndroid = window.navigator && window.navigator.userAgent.indexOf('534.30') > 0 && window.navigator.userAgent.toLowerCase().match(/android/);

    if (stockAndroid) {}


    var gameWon = {

        preload: function() {

            gameBeingPlayed = false;
            game.time.events.remove(timerEvents);
            timerEvents = undefined;

            if (levelsUnlocked > currentLevel + 1) {

            } else if (levelsUnlocked == 30) {

            } else {
                levelsUnlocked = currentLevel + 1;
                localStorage['levelsUnlocked'] = CryptoJS.AES.encrypt(levelsUnlocked + "", secretKey);
            }
        },

        create: function() {
            this.preloadBackground = this.game.add.sprite(0, 0, 'gameWonBgImg');
            this.preloadBackground.scale.x = stageWidth / this.preloadBackground.width;
            this.preloadBackground.scale.y = stageHeight / this.preloadBackground.height;

            youCompletedTxt = game.add.text(190, 240, "You completed");
            youCompletedTxt.fill = "white";
            youCompletedTxt.font = customFontStyle2;
            youCompletedTxt.fontSize = 50;

            curleveltxt = game.add.text(265, 310, "Level " + currentLevel);
            curleveltxt.fill = "orange";
            curleveltxt.font = customFontStyle2;
            curleveltxt.fontSize = 50;

            curScore = game.add.text(410, 530, score);
            curScore.fill = "white";
            curScore.font = customFontStyle2;
            curScore.fontSize = 40;

            finalScore += score;
            totalScore = game.add.text(410, 620, finalScore);
            totalScore.fill = "yellow";
            totalScore.font = customFontStyle2;
            totalScore.fontSize = 40;


            replayBtn = game.add.button(220, 900, 'replayImg', replayGame, this);

            if (currentLevel + 1 <= numLevels) {
                nextLevelBtn = game.add.button(420, 900, 'nextLevelImg', goToNextLevel, this);
            }

            if (currentLevel == 30) {
                submitBtn = game.add.button(420, 900, 'submitImg', submitUserScore, this);
            }
        },

        update: function() {
            if (!introSound.isPlaying) {
                introSound.stop();
                introSound.play();
            }
            gameSound.stop();
        },

    }

    var gameLost = {
        preload: function() {
            gameBeingPlayed = false;
            game.time.events.remove(timerEvents);
            timerEvents = undefined;
        },


        create: function() {
            this.preloadBackground = this.game.add.sprite(0, 0, 'gameLostBgImg');
            this.preloadBackground.scale.x = stageWidth / this.preloadBackground.width;
            this.preloadBackground.scale.y = stageHeight / this.preloadBackground.height;

            curScore = game.add.text(410, 530, score);
            curScore.fill = "white";
            curScore.font = customFontStyle2;
            curScore.fontSize = 40;

            finalScore += score;
            totalScore = game.add.text(410, 620, finalScore);
            totalScore.fill = "yellow";
            totalScore.font = customFontStyle2;
            totalScore.fontSize = 40;


            menuBtn = game.add.button(220, 900, 'menuBtn', this.goToMainMenu, this);
            submitBtn = game.add.button(420, 900, 'submitImg', submitUserScore, this);

        },

        goToMainMenu: function() {
            var tweenBlack = this.game.add.graphics(0, 0);
            tweenBlack.beginFill("#000000");
            tweenBlack.drawRect(0, 0, stageWidth + 1, stageHeight);
            tweenBlack.alpha = 0;

            var stateTween = game.add.tween(tweenBlack).to({
                alpha: 1
            }, 500, Phaser.Easing.Linear.None);
            stateTween.start();
            stateTween.onComplete.add(function() {
                game.state.start("preloader");
            }, this);

            var fake = this.game.add.sprite(0, 0, '');
        },

        update: function() {
            if (!introSound.isPlaying) {
                introSound.stop();
                introSound.play();
            }
            gameSound.stop();
        },
    }

    /*GAME SCENE*/
    var gameScene = {

        preload: function() {

            if (tileGrid != undefined) {
                for (i = 0; i < tileGrid.length; i++) {
                    for (j = 0; j < tileGrid[i].length; j++) {
                        if (tileGrid[i][j] != null) {
                            tileGrid[i][j].destroy();
                        }
                    }
                }
            }

            tileGrid = undefined;

            localStorage['finalScore'] = CryptoJS.AES.encrypt(finalScore + "", secretKey);

            if (tickImg != undefined) {
                tickImg.destroy();
                tickImg = undefined;
            }
            magicMode = false;
            gameBeingPlayed = true;
            gameOverFlag = false;
            prevTime = 0;
            score = 0;
            curTime = 0;
            prevScore = score;
            if (currentLevel == 1)
                score = 0;
            curLines = 0;
            numMoves = levelData[currentLevel]['moves'];
            target = levelData[currentLevel]['target'];
            timerEvents = undefined;
            timerEvents2 = undefined;

        },

        create: function() {
            this.preloadBackground = this.game.add.sprite(0, 0, 'gameBgImg');
            this.preloadBackground.scale.x = stageWidth / this.preloadBackground.width;
            this.preloadBackground.scale.y = stageHeight / this.preloadBackground.height;

            this.scoreBoardimg = this.game.add.sprite(0, 0, 'scoreBoardImg');
            this.scoreBoardimg.scale.x = stageWidth / this.scoreBoardimg.width;
            this.scoreBoardimg.scale.y = 0.6;

            this.movesBg = this.game.add.sprite(315, 0, 'movesBgImg');
            this.movesBg.scale.x = 1.2;
            this.movesBg.scale.y = 1.2;

            this.movesIcon = this.game.add.sprite(360, 30, 'movesIconImg');
            this.movesIcon.scale.x = 0.7;
            this.movesIcon.scale.y = 0.7;

            numMovesTxt = game.add.text(360, 70, numMoves);
            numMovesTxt.fill = "yellow";
            numMovesTxt.font = customFontStyle2;
            numMovesTxt.fontSize = 35;

            this.gemsImg = this.game.add.sprite(50, 50, 'gemsImg');
            this.gemsImg.scale.x = 0.5;
            this.gemsImg.scale.y = 0.5;

            this.targetText = game.add.text(100, 25, "TARGET");
            this.targetText.fill = "black";
            this.targetText.font = customFontStyle2;
            this.targetText.fontSize = 30;

            this.scoreText = game.add.text(550, 25, "SCORE");
            this.scoreText.fill = "black";
            this.scoreText.font = customFontStyle2;
            this.scoreText.fontSize = 30;

            this.levelBoardimg = this.game.add.sprite(0, 935, 'scoreBoardImg');
            this.levelBoardimg.scale.x = stageWidth / this.levelBoardimg.width;
            this.levelBoardimg.scale.y = 0.4;

            this.currentLevelText = game.add.text(270, 960, "LEVEL  " + currentLevel + "/" + numLevels);
            this.currentLevelText.fill = "yellow";
            this.currentLevelText.font = customFontStyle2;
            this.currentLevelText.fontSize = 40;
            this.currentLevelText.addColor('#ffffff', 5)

            curLevelTarget = game.add.text(120, 65, target);
            curLevelTarget.fill = "white";
            curLevelTarget.font = customFontStyle2;
            curLevelTarget.fontSize = 32;

            scoreTxt = game.add.text(550, 65, "" + score);
            scoreTxt.fill = "white";
            scoreTxt.font = customFontStyle2;
            scoreTxt.fontSize = 35;

            this.muteBtn = game.add.button(100, 945, 'muteBtn', this.toggleSound, this);
            if (isSoundOn == true)
                this.muteBtn.frame = 1;
            else
                this.muteBtn.frame = 0;

            this.shuffleBtn = game.add.button(570, 940, 'shuffleBtnImg', shuffleGrid, this);
            this.shuffleBtn.onDownSound = buttonSound;
            this.shuffleBtn.scale.x = 0.6;
            this.shuffleBtn.scale.y = 0.6;

            numMovesForShuffleTxt = game.add.text(660, 950, numMovesForShuffle);
            numMovesForShuffleTxt.fill = "white";
            numMovesForShuffleTxt.font = customFontStyle2;
            numMovesForShuffleTxt.fontSize = 30;

            this.shufflemovesIcon = this.game.add.sprite(650, 980, 'movesIconImg');
            this.shufflemovesIcon.scale.x = 0.7;
            this.shufflemovesIcon.scale.y = 0.7;

            tiles = game.add.group();

            var seed = Date.now();
            this.random = new Phaser.RandomDataGenerator([seed]);

            this.initTiles();
        },

        initTiles: function() {
            timerEvents = game.time.events.loop(Phaser.Timer.SECOND * 7, findMoves, this);

            tileTypes = levelData[currentLevel]['tileTypes'];
            tileWidth = this.game.cache.getImage('gem1').width;
            tileHeight = this.game.cache.getImage('gem1').height;
            xpos = levelData[currentLevel]['xoffset'];
            ypos = levelData[currentLevel]['yoffset'];
            tileGrid = levelData[currentLevel]['tileGrid'];



            for (var i = 0; i < tileGrid.length; i++) {
                for (var j = 0; j < tileGrid[i].length; j++) {
                    if (tileGrid[i][j] == null) {
                        var tile = addTile(i, j);
                        tileGrid[i][j] = tile;
                    }
                }
            }

            this.game.time.events.add(600, checkMatch);

        },


        toggleSound: function() {
            if (currentNavigator == 'desktop') {

                if (isSoundOn == true) {
                    this.muteBtn.frame = 0;
                    game.sound.mute = true;
                    isSoundOn = false;
                } else if (isSoundOn == false) {
                    this.muteBtn.frame = 1;
                    game.sound.mute = false;
                    isSoundOn = true;
                }
            }

            var fake = this.game.add.sprite(0, 0, '');
        },

        render: function() {

        },

        update: function() {

            //The user is currently dragging from a tile, so let's see if they have dragged
            //over the top of an adjacent tile
            if (activeTile1 && !activeTile2) {

                //Get the location of where the pointer is currently
                var hoverX = this.game.input.x;
                var hoverY = this.game.input.y;

                //Figure out what position on the grid that translates to
                var hoverPosX = Math.floor((hoverX - xpos) / tileWidth);

                var hoverPosY = Math.floor((hoverY - ypos) / tileHeight);

                console.log(hoverPosX + ":" + hoverPosY);
                //See if the user had dragged over to another position on the grid
                var difX = (hoverPosX - startPosX);
                var difY = (hoverPosY - startPosY);


                //Make sure we are within the bounds of the grid
                if (!(hoverPosY > tileGrid[0].length - 1 || hoverPosY < 0) && !(hoverPosX > tileGrid.length - 1 || hoverPosX < 0)) {

                    //If the user has dragged an entire tiles width or height in the x or y direction
                    //trigger a tile swap
                    if ((Math.abs(difY) == 1 && difX == 0) || (Math.abs(difX) == 1 && difY == 0)) {

                        //Prevent the player from making more moves whilst checking is in progress
                        canMove = false;

                        //Set the second active tile (the one where the user dragged to)
                        activeTile2 = tileGrid[hoverPosX][hoverPosY];

                        //Swap the two active tiles
                        swapTiles();

                        //After the swap has occurred, check the grid for any matches
                        this.game.time.events.add(500, checkMatch);
                    }

                }

            }

            introSound.stop();
            if (!gameSound.isPlaying) {
                gameSound.stop();
                gameSound.play();
            }

        },

    }


    /*LEVELS SCENE*/
    var levelsScene = {

        preload: function() {

            for (i = 0; i < levelButtonsArray.length; i++) {
                levelButtonsArray[i].destroy();
            }

            levelButtonsArray = [];


            for (i = 0; i < levelTextArray.length; i++) {
                levelTextArray[i].destroy();
            }

            levelTextArray = [];
        },


        create: function() {
            this.preloadBackground = this.game.add.sprite(0, 0, 'levelsBg');
            this.preloadBackground.scale.x = stageWidth / this.preloadBackground.width;
            this.preloadBackground.scale.y = stageHeight / this.preloadBackground.height;

            this.menuBtn = game.add.button(220, 1300, 'menuBtn', this.goToMenu, this);
            this.menuBtn.onDownSound = buttonSound;
            game.add.tween(this.menuBtn).to({
                y: 900
            }, 400, Phaser.Easing.Back.Out).start();

            this.nextLevelBtn = game.add.button(425, 1300, 'nextLevelImg', this.startLastLevel, this);
            this.nextLevelBtn.onDownSound = buttonSound;
            game.add.tween(this.nextLevelBtn).to({
                y: 900
            }, 400, Phaser.Easing.Back.Out).start();

            this.loadLevelButtons();
        },


        startLastLevel: function() {
            currentLevel = levelsUnlocked;
            var tweenBlack = this.game.add.graphics(0, 0);
            tweenBlack.beginFill("#000000");
            tweenBlack.drawRect(0, 0, stageWidth + 1, stageHeight);
            tweenBlack.alpha = 0;

            var stateTween = game.add.tween(tweenBlack).to({
                alpha: 1
            }, 200, Phaser.Easing.Linear.None);
            stateTween.start();
            stateTween.onComplete.add(function() {
                game.state.start("inGame");
            }, this);
        },

        goToMenu: function() {
            var tweenBlack = this.game.add.graphics(0, 0);
            tweenBlack.beginFill("#000000");
            tweenBlack.drawRect(0, 0, stageWidth + 1, stageHeight);
            tweenBlack.alpha = 0;

            var stateTween = game.add.tween(tweenBlack).to({
                alpha: 1
            }, 200, Phaser.Easing.Linear.None);
            stateTween.start();
            stateTween.onComplete.add(function() {
                game.state.start("preloader");
            }, this);
        },

        loadLevelButtons: function() {

            for (i = 0; i < numLevels; i++) {

                levelButtonsArray.push(game.add.button(150 + ((i % numLevelRows) * 100), 1500 + ((Math.floor(i / numLevelRows)) * 105), 'levelsBtn', this.startLevel, this));
                levelButtonsArray[i].name = i + 1;
                levelButtonsArray[i].onDownSound = buttonSound;

                game.add.tween(levelButtonsArray[i]).to({
                    y: 175 + ((Math.floor(i / numLevelRows)) * 100)
                }, 400, Phaser.Easing.Back.Out).delay(i * 50).start();


                if (i < 9)
                    levelTextArray.push(game.add.text(172 + ((i % numLevelRows) * 100), 1500 + ((Math.floor(i / numLevelRows)) * 105), i + 1));
                else
                    levelTextArray.push(game.add.text(162 + ((i % numLevelRows) * 100), 1500 + ((Math.floor(i / numLevelRows)) * 105), i + 1));
                levelTextArray[i].fill = "black";
                levelTextArray[i].font = customFontStyle2;
                levelTextArray[i].fontSize = 35;

                game.add.tween(levelTextArray[i]).to({
                    y: 195 + ((Math.floor(i / numLevelRows)) * 100)
                }, 400, Phaser.Easing.Back.Out).delay(i * 50).start();


                if ((i + 1) > parseInt(levelsUnlocked)) {
                    levelButtonsArray[i].alpha = 0.3;
                    levelTextArray[i].fill = "white";
                    levelTextArray[i].alpha = 0.25;
                }

            }

        },

        startLevel: function(evt) {

            if (evt.name <= parseInt(levelsUnlocked)) {

                if (evt.name == 1) {
                    score = 0;
                    finalScore = 0;
                    localStorage['finalScore'] = CryptoJS.AES.encrypt("0", secretKey);
                } else if (evt.name < levelsUnlocked) {
                    score = 0;
                    finalScore = 0;
                    localStorage['finalScore'] = CryptoJS.AES.encrypt("0", secretKey);
                }

                currentLevel = evt.name;
                var tweenBlack = this.game.add.graphics(0, 0);
                tweenBlack.beginFill("#000000");
                tweenBlack.drawRect(0, 0, stageWidth + 1, stageHeight);
                tweenBlack.alpha = 0;

                var stateTween = game.add.tween(tweenBlack).to({
                    alpha: 1
                }, 200, Phaser.Easing.Linear.None);
                stateTween.start();
                stateTween.onComplete.add(function() {
                    game.state.start("inGame");
                }, this);
            }

        },

        update: function() {
            if (!introSound.isPlaying) {
                introSound.stop();
                introSound.play();
            }
            gameSound.stop();
        },
    }

    /* STORY MODE*/
    var showStory = {

        preload: function() {

        },


        create: function() {

            this.storyBg = this.game.add.sprite(0, 0, 'storyImg');
            this.storyBg.scale.x = stageWidth / this.storyBg.width;
            this.storyBg.scale.y = stageHeight / this.storyBg.height;

            this.menuBtn = game.add.button(-200, 880, 'menuBtn', this.goToMenu, this);
            this.menuBtn.onDownSound = buttonSound;

            game.add.tween(this.menuBtn).to({
                x: 200,
                y: 870
            }, 400, Phaser.Easing.Back.Out).start();


            this.nextBtn = game.add.button(860, 880, 'nextBtn', this.goToHelp, this);
            this.nextBtn.onDownSound = buttonSound;

            game.add.tween(this.nextBtn).to({
                x: 440,
                y: 870
            }, 400, Phaser.Easing.Back.Out).start();

        },

        transitionToHowToPlay: function() {
            var tweenBlack = this.game.add.graphics(0, 0);
            tweenBlack.beginFill("#000000");
            tweenBlack.drawRect(0, 0, stageWidth + 1, stageHeight);
            tweenBlack.alpha = 0;

            var stateTween = game.add.tween(tweenBlack).to({
                alpha: 1
            }, 200, Phaser.Easing.Linear.None);
            stateTween.start();
            stateTween.onComplete.add(this.showHowToPlay, this);
        },


        goToMenu: function() {
            var tweenBlack = this.game.add.graphics(0, 0);
            tweenBlack.beginFill("#000000");
            tweenBlack.drawRect(0, 0, stageWidth + 1, stageHeight);
            tweenBlack.alpha = 0;

            var stateTween = game.add.tween(tweenBlack).to({
                alpha: 1
            }, 200, Phaser.Easing.Linear.None);
            stateTween.start();
            stateTween.onComplete.add(function() {
                game.state.start("preloader");
            }, this);
        },

        goToHelp: function() {
            var tweenBlack = this.game.add.graphics(0, 0);
            tweenBlack.beginFill("#000000");
            tweenBlack.drawRect(0, 0, stageWidth + 1, stageHeight);
            tweenBlack.alpha = 0;

            var stateTween = game.add.tween(tweenBlack).to({
                alpha: 1
            }, 200, Phaser.Easing.Linear.None);
            stateTween.start();
            stateTween.onComplete.add(function() {
                game.state.start("help");
            }, this);
        },

        update: function() {
            if (!introSound.isPlaying) {
                introSound.stop();
                introSound.play();
            }
            gameSound.stop();
        },

    }



    /* HELP MODE*/
    var showTutorial = {

        preload: function() {

        },


        create: function() {

            this.helpBg = this.game.add.sprite(0, 0, 'howtoplayImg');
            this.helpBg.scale.x = stageWidth / this.helpBg.width;
            this.helpBg.scale.y = stageHeight / this.helpBg.height;

            this.menuBtn = game.add.button(-200, 880, 'menuBtn', this.goToMenu, this);
            this.menuBtn.onDownSound = buttonSound;

            game.add.tween(this.menuBtn).to({
                x: 200,
                y: 870
            }, 400, Phaser.Easing.Back.Out).start();


            this.nextBtn = game.add.button(860, 880, 'nextBtn', this.goToLevels, this);
            this.nextBtn.onDownSound = buttonSound;

            game.add.tween(this.nextBtn).to({
                x: 440,
                y: 870
            }, 400, Phaser.Easing.Back.Out).start();

        },

        transitionToHowToPlay: function() {
            var tweenBlack = this.game.add.graphics(0, 0);
            tweenBlack.beginFill("#000000");
            tweenBlack.drawRect(0, 0, stageWidth + 1, stageHeight);
            tweenBlack.alpha = 0;

            var stateTween = game.add.tween(tweenBlack).to({
                alpha: 1
            }, 200, Phaser.Easing.Linear.None);
            stateTween.start();
            stateTween.onComplete.add(this.showHowToPlay, this);
        },


        goToMenu: function() {
            var tweenBlack = this.game.add.graphics(0, 0);
            tweenBlack.beginFill("#000000");
            tweenBlack.drawRect(0, 0, stageWidth + 1, stageHeight);
            tweenBlack.alpha = 0;

            var stateTween = game.add.tween(tweenBlack).to({
                alpha: 1
            }, 200, Phaser.Easing.Linear.None);
            stateTween.start();
            stateTween.onComplete.add(function() {
                game.state.start("preloader");
            }, this);
        },

        goToLevels: function() {
            var tweenBlack = this.game.add.graphics(0, 0);
            tweenBlack.beginFill("#000000");
            tweenBlack.drawRect(0, 0, stageWidth + 1, stageHeight);
            tweenBlack.alpha = 0;

            var stateTween = game.add.tween(tweenBlack).to({
                alpha: 1
            }, 200, Phaser.Easing.Linear.None);
            stateTween.start();
            stateTween.onComplete.add(function() {
                game.state.start("levels");
            }, this);
        },

        update: function() {
            if (!introSound.isPlaying) {
                introSound.stop();
                introSound.play();
            }
            gameSound.stop();
        },

    }


    /*PRELOAD ASSETS AND LOAD MAIN MENU*/
    var preloader = {

        preloadBar: Phaser.Sprite,

        preload: function() {

            if (isSharpMiniStock) {
                game.sound.mute = true;
            }
            if (isXperiaAStock) {
                game.sound.mute = true;
            }
            if (isFujitsu) {
                game.sound.mute = true;
            }
            if (isSharp) {
                game.sound.mute = true;
            }
            if (stockAndroid) {
                game.sound.mute = true;
            }


            //this.game.physics.p2.gravity.y = 100;

            this.preloadBackground = this.game.add.sprite(0, 0, 'loadingBgImg');
            this.preloadBackground.scale.x = stageWidth / this.preloadBackground.width;
            this.preloadBackground.scale.y = stageHeight / this.preloadBackground.height;

            if (currentNavigator == 'desktop') {

                this.loadingTxt = game.add.text(280, 860, "Loading..");
                this.loadingTxt.fill = "white";
                this.loadingTxt.font = customFontStyle2;
                this.loadingTxt.fontSize = 40;

                this.preloadBar = this.game.add.sprite(150, 910, 'preloadBar');
            }

            game.load.setPreloadSprite(this.preloadBar, 0);


            if (localStorage['levelsUnlocked'] != undefined) {
                var decryptLevelsUnlocked = CryptoJS.AES.decrypt(localStorage['levelsUnlocked'], secretKey);
                levelsUnlocked = parseInt(decryptLevelsUnlocked.toString(CryptoJS.enc.Utf8));

                if (isNaN(levelsUnlocked)) {
                    levelsUnlocked = 1;
                    localStorage['levelsUnlocked'] = CryptoJS.AES.encrypt("1", secretKey);
                }
            }


            if (localStorage['finalScore'] != undefined) {
                var decryptScore = CryptoJS.AES.decrypt(localStorage['finalScore'], secretKey);
                finalScore = parseInt(decryptScore.toString(CryptoJS.enc.Utf8));

                if (isNaN(score)) {
                    finalScore = 0;
                    localStorage['finalScore'] = CryptoJS.AES.encrypt("0", secretKey);
                }
            }

            if (localStorage['coins'] != undefined) {
                var decryptCoins = CryptoJS.AES.decrypt(localStorage['coins'], secretKey);
                coins = parseInt(decryptCoins.toString(CryptoJS.enc.Utf8));

                if (isNaN(coins)) {
                    coins = initCoins;
                    localStorage['coins'] = CryptoJS.AES.encrypt(initCoins + "", secretKey);
                }

                if (coins == 0) {
                    coins = initCoins;
                    localStorage['coins'] = CryptoJS.AES.encrypt(initCoins + "", secretKey);
                }
            }

            //STORY MODE
            game.load.image('storyImg', 'assets/story/' + currentNavigator + '/story.png');
            game.load.image('howtoplayImg', 'assets/story/' + currentNavigator + '/howtoplay.png');
            game.load.image('menuBtn', 'assets/story/' + currentNavigator + '/menu_btn.png');
            game.load.image('nextBtn', 'assets/story/' + currentNavigator + '/next_btn.png');


            //LEVEL WON/LOst
            game.load.image('gameWonBgImg', 'assets/gameWon/' + currentNavigator + '/game_won_bg.png');
            game.load.image('gameLostBgImg', 'assets/gameover/' + currentNavigator + '/game_lost_bg.png');

            //IN GAME
            game.load.image('tickImg', 'assets/ingame/' + currentNavigator + '/tick.png');
            game.load.image('gameBgImg', 'assets/ingame/' + currentNavigator + '/gameBgImg.jpg');
            game.load.image('scoreBoardImg', 'assets/ingame/' + currentNavigator + '/score_board.png');
            game.load.image('shuffleBtnImg', 'assets/ingame/' + currentNavigator + '/shuffle_btn.png');
            game.load.image('movesBgImg', 'assets/ingame/' + currentNavigator + '/moves_bg.png');
            game.load.image('movesIconImg', 'assets/ingame/' + currentNavigator + '/moves_icon.png');
            game.load.image('gemsImg', 'assets/ingame/' + currentNavigator + '/gems.png');
            game.load.image('trailImg', 'assets/ingame/' + currentNavigator + '/trail_1.png');

            //gems
            game.load.image('gem1', 'assets/ingame/' + currentNavigator + '/jewel_1.png');
            game.load.image('gem2', 'assets/ingame/' + currentNavigator + '/jewel_2.png');
            game.load.image('gem3', 'assets/ingame/' + currentNavigator + '/jewel_3.png');
            game.load.image('gem4', 'assets/ingame/' + currentNavigator + '/jewel_4.png');
            game.load.image('gem5', 'assets/ingame/' + currentNavigator + '/jewel_5.png');
            game.load.image('gem6', 'assets/ingame/' + currentNavigator + '/jewel_6.png');
            game.load.image('gem7', 'assets/ingame/' + currentNavigator + '/jewel_7.png');
            game.load.image('gem8', 'assets/ingame/' + currentNavigator + '/jewel_8.png');

            game.load.image('gem14', 'assets/ingame/' + currentNavigator + '/jewel_1_4.png');
            game.load.image('gem24', 'assets/ingame/' + currentNavigator + '/jewel_2_4.png');
            game.load.image('gem34', 'assets/ingame/' + currentNavigator + '/jewel_3_4.png');
            game.load.image('gem44', 'assets/ingame/' + currentNavigator + '/jewel_4_4.png');
            game.load.image('gem54', 'assets/ingame/' + currentNavigator + '/jewel_5_4.png');
            game.load.image('gem64', 'assets/ingame/' + currentNavigator + '/jewel_6_4.png');
            game.load.image('gem74', 'assets/ingame/' + currentNavigator + '/jewel_7_4.png');
            game.load.image('gem84', 'assets/ingame/' + currentNavigator + '/jewel_8_4.png');


            game.load.image('starImg', 'assets/ingame/' + currentNavigator + '/star.png');

            game.load.image('replayImg', 'assets/ingame/' + currentNavigator + '/replay.png');
            game.load.image('submitImg', 'assets/ingame/' + currentNavigator + '/submit.png');
            game.load.image('nextLevelImg', 'assets/ingame/' + currentNavigator + '/next_level.png');

            this.load.spritesheet('livesImg', 'assets/ingame/' + currentNavigator + '/lives.png', 199, 65, 4);
            this.load.spritesheet('starsGameImg', 'assets/ingame/' + currentNavigator + '/stars.png', 80, 65, 2);

            //TITLE SCREEN
            this.load.spritesheet('muteBtn', 'assets/title/' + currentNavigator + '/mute_unmute.png', 66, 66, 2);


            //TITLE SCREEN
            game.load.image('levelsBtn', 'assets/levels/' + currentNavigator + '/level_btn.png');
            game.load.image('levelsBg', 'assets/levels/' + currentNavigator + '/level_bg.png');

            //SOUNDS
            game.load.audio('intro', ['sounds/bgmusic.mp3']);
            game.load.audio('button', ['sounds/button.mp3', 'sounds/button.ogg']);
            game.load.audio('magic', ['sounds/score.mp3', 'sounds/score.ogg']);
            game.load.audio('game', ['sounds/gameplay_bg.mp3']);


            if (localStorage['topScore'] != undefined)
                topScore = localStorage['topScore'];

            var fake = this.game.add.sprite(0, 0, '');
        },

        create: function() {

            if (introSound == undefined) {
                introSound = this.game.add.audio('intro', 0.4, false);
                buttonSound = this.game.add.audio('button', 0.3, false);
                magicSound = this.game.add.audio('magic', 0.7, false);
                gameSound = this.game.add.audio('game', 0.7, false);


                // introSound = this.game.add.audio('intro', 0, false);
                // buttonSound = this.game.add.audio('button', 0, false);
                // magicSound = this.game.add.audio('magic', 0, false);
            }

            var fake = this.game.add.sprite(0, 0, '');
            this.loadStartBtn();

        },

        loadStartBtn: function() {
            this.preloadBar.destroy();
            this.loadingTxt.destroy();

            if (currentNavigator == 'desktop') {
                this.startMenuButton = game.add.button(295, 1300, 'startMenuBtn', this.startGamePlay, this);
                this.startMenuButton.onDownSound = buttonSound;
                game.add.tween(this.startMenuButton).to({
                    y: 850
                }, 400, Phaser.Easing.Back.Out).start();

                game.add.tween(this.startMenuButton.scale).to({
                        y: 1.1,
                        x: 1.1
                    }, 400, Phaser.Easing.Linear.None)
                    .to({
                        y: 1,
                        x: 1
                    }, 400, Phaser.Easing.Linear.None).start().loop();

                game.add.tween(this.startMenuButton).to({
                        x: 290,
                        y: 845
                    }, 400, Phaser.Easing.Linear.None)
                    .to({
                        y: 850,
                        x: 295
                    }, 400, Phaser.Easing.Linear.None).start().loop();

                this.storyBtn = game.add.button(150, 1300, 'storyBtn', this.goToStoryState, this);
                this.storyBtn.onDownSound = buttonSound;
                game.add.tween(this.storyBtn).to({
                    y: 890
                }, 400, Phaser.Easing.Back.Out).delay(300).start();

                this.helpBtn = game.add.button(520, 1300, 'helpBtn', this.goToHelp, this);
                this.helpBtn.onDownSound = buttonSound;
                game.add.tween(this.helpBtn).to({
                    y: 890
                }, 400, Phaser.Easing.Back.Out).delay(600).start();

                this.muteBtn = game.add.button(670, 20, 'muteBtn', this.toggleSound, this);
                if (isSoundOn == true)
                    this.muteBtn.frame = 1;
                else
                    this.muteBtn.frame = 0;
            }
        },


        toggleSound: function() {
            if (currentNavigator == 'desktop') {

                if (isSoundOn == true) {
                    this.muteBtn.frame = 0;
                    game.sound.mute = true;
                    isSoundOn = false;
                } else if (isSoundOn == false) {
                    this.muteBtn.frame = 1;
                    game.sound.mute = false;
                    isSoundOn = true;
                }
            }

            var fake = this.game.add.sprite(0, 0, '');
        },

        startGamePlay: function() {

            var tweenBlack = this.game.add.graphics(0, 0);
            tweenBlack.beginFill("#000000");
            tweenBlack.drawRect(0, 0, stageWidth + 1, stageHeight);
            tweenBlack.alpha = 0;

            var stateTween = game.add.tween(tweenBlack).to({
                alpha: 1
            }, 200, Phaser.Easing.Linear.None);
            stateTween.start();
            stateTween.onComplete.add(function() {
                game.state.start("levels");
            }, this);

            var fake = this.game.add.sprite(0, 0, '');
        },


        goToHelp: function() {
            var tweenBlack = this.game.add.graphics(0, 0);
            tweenBlack.beginFill("#000000");
            tweenBlack.drawRect(0, 0, stageWidth + 1, stageHeight);
            tweenBlack.alpha = 0;

            var stateTween = game.add.tween(tweenBlack).to({
                alpha: 1
            }, 200, Phaser.Easing.Linear.None);
            stateTween.start();
            stateTween.onComplete.add(function() {
                game.state.start("help");
            }, this);
        },

        goToStoryState: function() {

            var tweenBlack = this.game.add.graphics(0, 0);
            tweenBlack.beginFill("#000000");
            tweenBlack.drawRect(0, 0, stageWidth + 1, stageHeight);
            tweenBlack.alpha = 0;

            var stateTween = game.add.tween(tweenBlack).to({
                alpha: 1
            }, 200, Phaser.Easing.Linear.None);
            stateTween.start();
            stateTween.onComplete.add(function() {
                game.state.start("story");
            }, this);

            var fake = this.game.add.sprite(0, 0, '');
        },

        update: function() {
            if (!introSound.isPlaying) {
                introSound.stop();
                introSound.play();
            }
            gameSound.stop();
        },

        shutdown: function() {}
    }

    /*BOOTING GAME*/
    var bootstate = {
        preload: function() {

            game.load.image('loadingBgImg', 'assets/title/' + currentNavigator + '/title_bg.png');
            game.load.image('preloadBar', 'assets/loader/' + currentNavigator + '/lineFill.png');
            game.load.image('startMenuBtn', 'assets/loader/' + currentNavigator + '/startMenu.png');
            game.load.image('storyBtn', 'assets/loader/' + currentNavigator + '/story_btn.png');
            game.load.image('helpBtn', 'assets/loader/' + currentNavigator + '/help_btn.png');

            var fake = this.game.add.sprite(0, 0, '');
        },
        create: function() {

            firstRunLandscape = game.scale.isGameLandscape;

            this.game.stage.disableVisibilityChange = false;

            this.game.stage.backgroundColor = '#000000';


            this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.game.scale.setShowAll();
            game.scale.forceOrientation(false, true);
            game.scale.enterIncorrectOrientation.add(handleIncorrect);
            game.scale.leaveIncorrectOrientation.add(handleCorrect);

            this.game.scale.pageAlignHorizontally = true;
            this.game.scale.pageAlignVertically = true;

            this.game.scale.refresh();

            var tweenBlack = this.game.add.graphics(0, 0);
            tweenBlack.beginFill("#000000");
            tweenBlack.drawRect(0, 0, stageWidth + 1, stageHeight);
            tweenBlack.alpha = 1;

            this.game.state.start('preloader');

            var fake = this.game.add.sprite(0, 0, '');


        },
    }

    game.state.add("boot", bootstate);
    game.state.add("preloader", preloader);
    game.state.add("story", showStory);
    game.state.add("help", showTutorial);
    game.state.add("inGame", gameScene);
    game.state.add("gameLost", gameLost);
    game.state.add("gameWon", gameWon);
    game.state.add("levels", levelsScene);
    game.state.start("boot");
}