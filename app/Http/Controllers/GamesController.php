<?php
namespace App\Http\Controllers;

class GamesController extends Controller
{
    public function home()
    {
        // Create an array of all games from the public/games folder
        $popularGames = [];

        // Define all the games with their names, thumbnails, and local URLs
        $gameList = [
            [
                'name' => 'Cross Math Link',
                'thumbnail' => asset('games/cross math/image.png'),
                'url' => 'https://toolsorcerer.com/codecanyon/cross_math_link/index.html',
            ],
            [
                'name'      => 'Cricket Maths',
                'thumbnail' => 'https://market-resized.envatousercontent.com/previews/files/657803006/CodeCanyon_590x300.jpg?w=590&h=300&cf_fit=crop&crop=top&format=auto&q=85&s=8256b291dbae6f8f90ccb4960460d58ff251e002a05d2c5d45421326246edcae',
                'url'       => 'https://wandermindlabs.com/H5Games/CodeCanyon/CricketMaths/',
            ],
            [
                'name'      => 'Math Quiz Addition & Subtraction',
                'thumbnail' => asset('games/Math_Quiz_Addition_&_Subtraction/math-quiz-challenge.netlify.app/assets/math.png'),
                'url'       => asset('games/Math_Quiz_Addition_&_Subtraction/math-quiz-challenge.netlify.app/index.html'),
            ],
            [
                'name'      => 'Rocket Bot',
                'thumbnail' => asset('games/RocketBot/rocketbot.png'),

                'url'       => 'https://65ec9259899e16c3586e2681--superb-syrniki-9420d9.netlify.app/',

            ],
            [
                'name'      => 'Swiper Soccer 3D',
                'thumbnail' => asset('games/Swiper_Soccer_3D/swipesoccer-game.netlify.app/soccer.png'),
                'url'       => 'https://swipesoccer-game.netlify.app/',
            ],
            [
                'name'      => 'Checkers Master',
                'thumbnail' => asset('games/Checkers_Master/checkers-master-game-buy.netlify.app/img/logo.png'),
                'url'       => asset('games/Checkers_Master/checkers-master-game-buy.netlify.app/index.html'),
            ],
            // [
            //     'name'      => 'Chess Empire Online',
            //     'thumbnail' => asset('games/Chess_Empire_Online/chess-empire-game.netlify.app/assets/loading.png'),
            //     'url'       => asset('games/Chess_Empire_Online/chess-empire-game.netlify.app/index.index.html'),
            // ],
            [
                'name'      => 'Ball Master
',
                'thumbnail' => asset('games/Ball Master/ballmaster.png'),
                'url'       => 'https://ballmastergame.netlify.app/',
            ],
            [
                'name'      => 'Dimension Escape 3D',
                'thumbnail' => asset('games/Dimension_Escape_3D/dimension-escape.netlify.app/assets/main.avif'),
                'url'       => asset('games/Dimension_Escape_3D/dimension-escape.netlify.app/index.html'),
            ],
            [
                'name'      => 'Jewels Quest',
                'thumbnail' => asset('games/Jewels_Quest/jewelsquestup.netlify.app/assets/jewels.png'),
                'url'       => 'https://jewelsquestup.netlify.app/',
            ],
            [
                'name'      => 'Plinko Pro Casino',
                'thumbnail' => asset('games/Plinko_Pro_Casino/plinko-pro-game.netlify.app/plinko.jpg'),

                'url'       => asset('games/Plinko_Pro_Casino/plinko-pro-game.netlify.app/index.html'),
            ],

            [
                'name'      => 'Lights Out Puzzle',
                'thumbnail' => asset('games/Lights_Out_Puzzle/lights-out-html5-game.netlify.app/assets/logo.png'),
                'url'       => asset('games/Lights_Out_Puzzle/lights-out-html5-game.netlify.app/index.html'),
            ],
            [
                'name'      => 'Neon Bounce Casino',
                'thumbnail' => asset('games/Neon_Bounce_Casino/neon-bounce-game.netlify.app/neonbounce.png'),
                'url'       => asset('games/Neon_Bounce_Casino/neon-bounce-game.netlify.app/index.html'),
            ],
            [
                'name'      => 'Onet Animals',
                'thumbnail' => asset('games/Onet_Animals/onet-animals.netlify.app/img/game_title.png'),

                'url'       => 'https://onet-animals.netlify.app/',
            ],
            [
                'name'      => 'Panda Pop',
                'thumbnail' => asset('games/Panda_Pop/pandapopgameup.netlify.app/media/graphics/splash/mobile/cover-start.png'),

                'url'       => 'https://pandapopgameup.netlify.app/',
            ],

            [
                'name'      => 'Rolling Ball 3D',
                'thumbnail' => asset('games/Rolling_Ball_3D/rollingball3d.netlify.app/img/rb.png'),
                'url'       => 'https://rollingball3d.netlify.app/',
            ],
            [
                'name'      => 'Sport Quest',
                'thumbnail' => asset('games/Sport_Quest/sport-quest.netlify.app/assets/Sport Quest.png'),
                'url'       => 'https://sport-quest.netlify.app/',
            ],
            // [
            //     'name'      => 'Emoji Crushed',
            //     'thumbnail' => asset('games/other/ec.png'),
            //     'url'       => 'https://emoji-crushed.netlify.app/',
            // ],
            [
                'name'        => 'Bubble Shooter',
                'thumbnail'   => asset('games/other/bs.png'),
                'url'         => 'https://bubble-shoots.netlify.app/',
                'description' => 'Colorful bubble shooter game with various levels.',
                'details'     => 'Shoot bubbles to match colors and clear the board in this vibrant bubble shooter game. Complete levels with the fewest shots possible.',
            ],
            [
                'name'        => 'Pet Crush',
                'thumbnail'   => asset('games/other/pc.png'),
                'url'         => 'https://pet-crush.netlify.app/',
                'description' => 'A fun puzzle game where you match pets to clear the board.',
                'details'     => 'Match three or more pets of the same type to clear them from the board in this delightful puzzle game. Complete levels with the fewest moves possible.',
            ],
            [
                'name'        => 'Gun Bullets',
                'thumbnail'   => asset('games/other/gb.png'),
                'url'         => 'https://65eeee920045e641ae6f0c76--pocu.netlify.app/',
                'description' => 'A shooting game where you test your aim and reflexes.',
                'details'     => 'Gun Bullets is an exciting shooting game that challenges your aim and reflexes. Shoot targets as they appear on the screen and try to achieve the highest score possible.',
            ],
            [
                'name'        => 'Arya`s Adventure',
                'thumbnail'   => asset('games/other/thumb11.jpg'),
                'url'         => 'https://taupe-faloodeh-5a6a13.netlify.app/',
                'description' => 'Join Arya on an epic adventure through mystical lands.',
                'details'     => 'Embark on a thrilling journey with Arya as you explore mystical lands, solve puzzles, and battle enemies in this action-packed adventure game. Uncover secrets and become a hero in Aryas Adventure.',
            ],
            [
                'name'        => 'Block Vs Ball',
                'thumbnail'   => asset('games/other/bb.png'),
                'url'         => 'https://blockvsballgame.netlify.app/',
                'description' => 'A fun physics-based game where you control a ball to hit blocks.',
                'details'     => 'Block Vs Ball is an engaging physics-based game where you control a ball to hit blocks and clear the screen. Use your skills to achieve the highest score possible.',
            ],
        ];

        // Add more games to reach 38 total, reusing existing games
        $allGames = $gameList;
        while (count($allGames) < 38) {
            // Cycle through the existing games to fill up to 38
            $allGames = array_merge($allGames, $gameList);
        }

        // Trim to exactly 38 games
        $allGames = array_slice($allGames, 0, 20);

        foreach ($allGames as $index => $game) {
            $popularGames[] = [
                'name'         => $game['name'],
                'image_url'    => $game['thumbnail'],
                'external_url' => $game['url'],
                'description'  => 'Popular Ethiopian game ' . ($index + 1) . ' from the 38-games-bundle collection.',
            ];
        }

        return view('home', compact('popularGames'));
    }

    public function showGame($id = null)
    {
        // Define all the games with their names, thumbnails, and local URLs
        $gameList = [
            [
                'name' => 'Cross Math Link',
                'thumbnail' => asset('games/cross math/image.png'),
                'url' => 'https://toolsorcerer.com/codecanyon/cross_math_link/index.html',
                'description' => 'A fun and addictive math puzzle game where you connect numbers to reach a target sum.',
                'details' => 'Cross Math Link is a challenging puzzle game that tests your math skills and strategic thinking. Connect numbers in a grid to reach the target sum while avoiding obstacles and maximizing your score.',
            ],

        [
            'name'        => 'Cricket Maths',
            'thumbnail'   => asset('assets/img/others/popular-game-thumb1.webp'),
            'url'         => 'https://wandermindlabs.com/H5Games/CodeCanyon/CricketMaths/',
            'description' => 'Educational game to practice math skills with a cricket theme.',
            'details'     => 'Cricket Maths is a fun and interactive game that helps players improve their math skills while enjoying a cricket-themed gaming experience. Solve math problems to score runs and win matches against opponents.',
        ],
            [
                'name'        => 'Math Quiz Addition & Subtraction',
                'thumbnail'   => asset('assets/img/others/popular-game-thumb3.webp'),
                'url'         => asset('games/Math_Quiz_Addition_&_Subtraction/math-quiz-challenge.netlify.app/index.html'),
                'description' => 'Educational game to practice addition and subtraction skills.',
                'details'     => 'Test your math skills with this fun quiz game. Answer addition and subtraction problems as quickly as possible to earn points and improve your score.',
            ],
            [
                'name'        => 'Rocket Bot',
                'thumbnail'   => asset('games/RocketBot/rocke-bot.png'),
                'url'         => 'https://65ec9259899e16c3586e2681--superb-syrniki-9420d9.netlify.app/',
                'description' => 'A fast-paced action game with rocket-powered characters.',
                'details'     => 'Control your rocket-powered bot and navigate through challenging levels. Collect power-ups and avoid obstacles to achieve the highest score.',
            ],
            [
                'name'        => 'Swiper Soccer 3D',
                'thumbnail'   => asset('games/Swiper_Soccer_3D/swipesoccer-game.netlify.app/soccer.png'),
                'url'         => 'https://swipesoccer-game.netlify.app/',
                'description' => 'An exciting 3D soccer game with swipe controls.',
                'details'     => 'Swiper Soccer 3D is an engaging 3D soccer game where you control your player with swipe gestures. Score goals and win matches in this fun and addictive game.',
            ],
            [
                'name'        => 'Checkers Master',
                'thumbnail'   => asset('games/Checkers_Master/checkers-master-game-buy.netlify.app/img/logo.png'),
                'url'         => asset('games/Checkers_Master/checkers-master-game-buy.netlify.app/index.html'),
                'description' => 'Traditional board game played between two players on an 8×8 checkerboard.',
                'details'     => 'Checkers is a classic strategy game where players move their pieces diagonally across the board, capturing opponent pieces by jumping over them. The goal is to capture all of your opponent\'s pieces or block them so they cannot move.',
            ],
            // [
            //     'name'        => 'Chess Empire Online',
            //     'thumbnail'   => asset('games/Chess_Empire_Online/chess-empire-game.netlify.app/assets/loading.png'),
            //     'url'         => asset('games/Chess_Empire_Online/chess-empire-game.netlify.app/index.html'),
            //     'description' => 'Strategic board game played between two players, simulating medieval warfare.',
            //     'details'     => 'Chess is a recreational and competitive board game played between two players. It is sometimes called international or Western chess to distinguish it from related games such as xiangqi and shogi.',
            // ],
            [
                'name'        => 'Ball Master',
                'thumbnail'   => asset('games/Ball_Master/ball-master-game.netlify.app/assets/ball.png'),
                'url'         => 'https://ballmastergame.netlify.app/',
                'description' => 'Exciting ball rolling game with challenging levels.',
                'details'     => 'Roll the ball through the levels, avoiding obstacles and collecting coins. This game offers a fun and engaging experience with beautiful graphics and smooth gameplay.',
            ],
            [
                'name'        => 'Dimension Escape 3D',
                'thumbnail'   => asset('games/Dimension_Escape_3D/dimension-escape.netlify.app/assets/main.avif'),
                'url'         => asset('games/Dimension_Escape_3D/dimension-escape.netlify.app/index.html'),
                'description' => 'Immersive 3D puzzle game where you navigate through challenging levels.',
                'details'     => 'Experience an immersive 3D adventure as you solve puzzles and navigate through challenging environments. This game offers stunning visuals and engaging gameplay mechanics.',
            ],
            [
                'name'        => 'Jewels Quest',
                'thumbnail'   => asset('games/Jewels_Quest/jewelsquestup.netlify.app/assets/jewels.png'),
                'url'         => 'https://jewelsquestup.netlify.app/',
                'description' => 'Match-3 puzzle game with beautiful jewels and challenging levels.',
                'details'     => 'Swap adjacent jewels to make sets of three or more of the same jewel. Complete objectives in each level while enjoying beautiful graphics and smooth gameplay.',
            ],
            [
                'name'        => 'Plinko Pro Casino',
                'thumbnail'   => asset('games/Plinko_Pro_Casino/plinko-pro-game.netlify.app/plinko.jpg'),
                'url'         => asset('games/Plinko_Pro_Casino/plinko-pro-game.netlify.app/index.html'),
                'description' => 'Casino-style Plinko game with realistic physics.',
                'details'     => 'Drop chips and watch them bounce off pegs in this classic Plinko game. Win prizes based on where your chip lands at the bottom of the board.',
            ],

            [
                'name'        => 'Lights Out Puzzle',
                'thumbnail'   => asset('games/Lights_Out_Puzzle/lights-out-html5-game.netlify.app/assets/logo.png'),
                'url'         => asset('games/Lights_Out_Puzzle/lights-out-html5-game.netlify.app/index.html'),
                'description' => 'Classic puzzle game where you toggle lights to turn them all off.',
                'details'     => 'The objective of the game is to turn off all the lights on the grid. When you press a button, it toggles the light in that cell and its adjacent cells.',
            ],
            [
                'name'        => 'Neon Bounce Casino',
                'thumbnail'   => asset('assets/img/others/popular-game-thumb4.webp'),
                'url'         => asset('games/Neon_Bounce_Casino/neon-bounce-game.netlify.app/index.html'),
                'description' => 'Addictive ball bouncing game with neon aesthetics.',
                'details'     => 'Control the bouncing ball through challenging obstacles in this visually striking neon-themed game. Avoid obstacles and collect power-ups to achieve high scores.',
            ],
            [
                'name'        => 'Onet Animals',
                'thumbnail'   => asset('games/Onet_Animals/onet-animals.netlify.app/assets/img/game_title.png'),
                'url'         => 'https://onet-animals.netlify.app/',
                'description' => 'Connect matching animal tiles to clear the board.',
                'details'     => 'Find and connect pairs of matching animal tiles to remove them from the board. Clear all tiles to advance to the next level in this fun puzzle game.',
            ],
            [
                'name'        => 'Panda Pop',
                'thumbnail'   => asset('games/Panda_Pop/pandapopgameup.netlify.app/media/graphics/splash/mobile/cover-start.png'),
                'url'         => 'https://pandapopgameup.netlify.app/',
                'description' => 'Colorful bubble shooter game with pandas.',
                'details'     => 'Shoot bubbles to match colors and clear the board in this adorable panda-themed bubble shooter game. Complete levels with the fewest shots possible.',
            ],

            [
                'name'        => 'Rolling Ball 3D',
                'thumbnail'   => asset('games/Rolling_Ball_3D/rollingball3d.netlify.app/img/rb.png'),
                'url'         => 'https://rollingball3d.netlify.app/',
                'description' => 'Challenging 3D maze game where you roll a ball to the exit.',
                'details'     => 'Navigate the rolling ball through complex 3D mazes by tilting the platform. Avoid obstacles and reach the finish line in this physics-based puzzle game.',
            ],
            [
                'name'        => 'Sport Quest',
                'thumbnail'   => asset('assets/img/others/popular-game-thumb3.webp'),
                'url'         => 'https://sport-quest.netlify.app/',
                'description' => 'Multi-sports challenge game with various athletic events.',
                'details'     => 'Participate in various sports challenges and competitions in this diverse sports game. Test your skills in different athletic events and aim for the highest scores.',
            ],

            // [
            //     'name'        => 'Emoji Crushed',
            //     'thumbnail'   => asset('games/other/ec.png'),
            //     'url'         => 'https://emoji-crushed.netlify.app/',
            //     'description' => 'Fun match-3 game with cute emojis.',
            //     'details'     => 'Match three or more of the same emojis to clear them from the board. Enjoy colorful graphics and addictive gameplay in this charming emoji-themed puzzle game.',
            // ],
            [
                'name'        => 'Bubble Shooter',
                'thumbnail'   => asset('games/other/bs.png'),
                'url'         => 'https://bubble-shoots.netlify.app/',
                'description' => 'Colorful bubble shooter game with various levels.',
                'details'     => 'Shoot bubbles to match colors and clear the board in this vibrant bubble shooter game. Complete levels with the fewest shots possible.',
            ],
            [
                'name'        => 'Pet Crush',
                'thumbnail'   => asset('games/other/pc.png'),
                'url'         => 'https://pet-crush.netlify.app/',
                'description' => 'A fun puzzle game where you match pets to clear the board.',
                'details'     => 'Match three or more pets of the same type to clear them from the board in this delightful puzzle game. Complete levels with the fewest moves possible.',
            ],
            [
                'name'        => 'Gun Bullets',
                'thumbnail'   => asset('games/other/gb.png'),
                'url'         => 'https://65eeee920045e641ae6f0c76--pocu.netlify.app/',
                'description' => 'A shooting game where you test your aim and reflexes.',
                'details'     => 'Gun Bullets is an exciting shooting game that challenges your aim and reflexes. Shoot targets as they appear on the screen and try to achieve the highest score possible.',
            ],
            [
                'name'        => 'Aryas Adventure',
                'thumbnail'   => asset('games/other/aa.png'),
                'url'         => 'https://taupe-faloodeh-5a6a13.netlify.app/',
                'description' => 'Join Arya on an epic adventure through mystical lands.',
                'details'     => 'Embark on a thrilling journey with Arya as you explore mystical lands, solve puzzles, and battle enemies in this action-packed adventure game. Uncover secrets and become a hero in Arya\'s Adventure.',
            ],
        ];

        // Add more games to reach 38 total, reusing existing games
        $allGames = $gameList;
        while (count($allGames) < 38) {
            // Cycle through the existing games to fill up to 38
            $allGames = array_merge($allGames, $gameList);
        }

        // Trim to exactly 38 games
        $allGames = array_slice($allGames, 0, 38);

                                        // If no ID is provided or the ID doesn't exist, use the first game (index 0)
        $gameIndex = $id ? $id - 1 : 0; // Convert to 0-based index

        if ($gameIndex < 0 || $gameIndex >= count($allGames)) {
            $gameIndex = 0; // Default to first game if invalid ID
        }

        $game = $allGames[$gameIndex];

        return view('gamedetail', [
            'gameName'        => $game['name'],
            'gameDescription' => $game['description'],
            'gameDetails'     => $game['details'],
            'gameUrl'         => $game['url'],
        ]);
    }

    public function allGames()
    {
        // Create an array of all games to display on the games page
        $allGames = [];

        // Define all the games with their names, thumbnails, and local URLs
        $gameList = [
            [
                'name'      => 'Math Quiz Addition & Subtraction',
                'thumbnail' => asset('games/Math_Quiz_Addition_&_Subtraction/math-quiz-challenge.netlify.app/assets/logo.png'),
                'url'       => asset('games/Math_Quiz_Addition_&_Subtraction/math-quiz-challenge.netlify.app/index.html'),
            ],
            [
                'name'      => 'Swiper Soccer 3D',
                'thumbnail' => asset('games/Swiper_Soccer_3D/swipesoccer-game.netlify.app/soccer.png'),
                'url'       => 'https://swipesoccer-game.netlify.app/',
            ],
            [
                'name'      => 'Checkers Master',
                'thumbnail' => asset('games/Checkers_Master/checkers-master-game-buy.netlify.app/img/logo.png'),
                'url'       => asset('games/Checkers_Master/checkers-master-game-buy.netlify.app/index.html'),
            ],
            [
                'name'      => 'Chess Empire Online',
                'thumbnail' => asset('games/Chess_Empire_Online/chess-empire-game.netlify.app/assets/loading.png'),
                'url'       => asset('games/Chess_Empire_Online/chess-empire-game.netlify.app/index.html'),
            ],
            [
                'name'      => 'Ball Master',
                'thumbnail' => asset('games/Ball Master/ballmaster.png'),
                'url'       => 'https://ballmastergame.netlify.app/',

            ],
            [
                'name'      => 'Dimension Escape 3D',
                'thumbnail' => asset('games/Dimension_Escape_3D/dimension-escape.netlify.app/assets/main.avif'),
                'url'       => asset('games/Dimension_Escape_3D/dimension-escape.netlify.app/index.html'),
            ],
            [
                'name'      => 'Jewels Quest',
                'thumbnail' => asset('games/Jewels_Quest/jewelsquestup.netlify.app/assets/jewels.png'),
                'url'       => 'https://jewelsquestup.netlify.app/',
            ],
            [
                'name'      => 'Plinko Pro Casino',
                'thumbnail' => asset('games/Plinko_Pro_Casino/plinko-pro-game.netlify.app/plinko.jpg'),

                'url'       => asset('games/Plinko_Pro_Casino/plinko-pro-game.netlify.app/index.html'),
            ],

            [
                'name'      => 'Lights Out Puzzle',
                'thumbnail' => asset('games/Lights_Out_Puzzle/lights-out-html5-game.netlify.app/assets/logo.png'),
                'url'       => asset('games/Lights_Out_Puzzle/lights-out-html5-game.netlify.app/index.html'),
            ],
            [
                'name'      => 'Neon Bounce Casino',
                'thumbnail' => asset('games/Neon_Bounce_Casino/neon-bounce-game.netlify.app/neonbounce.png'),
                'url'       => asset('games/Neon_Bounce_Casino/neon-bounce-game.netlify.app/index.html'),
            ],
            [
                'name'      => 'Onet Animals',
                'thumbnail' => asset('games/Onet_Animals/onet-animals.netlify.app/img/game_title.png'),

                'url'       => 'https://onet-animals.netlify.app/',
            ],
            [
                'name'      => 'Panda Pop',
                'thumbnail' => asset('games/Panda_Pop/pandapopgameup.netlify.app/media/graphics/splash/mobile/cover-start.png'),

                'url'       => 'https://pandapopgameup.netlify.app/',
            ],

            [
                'name'      => 'Rolling Ball 3D',
                'thumbnail' => asset('games/Rolling_Ball_3D/rollingball3d.netlify.app/img/rb.png'),
                'url'       => 'https://rollingball3d.netlify.app/',
            ],
            [
                'name'      => 'Sport Quest',
                'thumbnail' => asset('games/Sport_Quest/sport-quest.netlify.app/assets/Sport Quest.png'),
                'url'       => 'https://sport-quest.netlify.app/',
            ],
            // [
            //     'name'      => 'Emoji Crushed',
            //     'thumbnail' => asset('games/other/ec.png'),
            //     'url'       => 'https://emoji-crushed.netlify.app/',
            // ],
            [
                'name'        => 'Bubble Shooter',
                'thumbnail'   => asset('games/other/bs.png'),
                'url'         => 'https://bubble-shoots.netlify.app/',
                'description' => 'Colorful bubble shooter game with various levels.',
                'details'     => 'Shoot bubbles to match colors and clear the board in this vibrant bubble shooter game. Complete levels with the fewest shots possible.',
            ],
            [
                'name'        => 'Pet Crush',
                'thumbnail'   => asset('games/other/pc.png'),
                'url'         => 'https://pet-crush.netlify.app/',
                'description' => 'A fun puzzle game where you match pets to clear the board.',
                'details'     => 'Match three or more pets of the same type to clear them from the board in this delightful puzzle game. Complete levels with the fewest moves possible.',
            ],
            [
                'name'        => 'Gun Bullets',
                'thumbnail'   => asset('games/other/gb.png'),
                'url'         => 'https://65eeee920045e641ae6f0c76--pocu.netlify.app/',
                'description' => 'A shooting game where you test your aim and reflexes.',
                'details'     => 'Gun Bullets is an exciting shooting game that challenges your aim and reflexes. Shoot targets as they appear on the screen and try to achieve the highest score possible.',
            ],
            [
                'name'        => 'Arya`s Adventure',
                'thumbnail'   => asset('games/other/thumb11.jpg'),
                'url'         => 'https://taupe-faloodeh-5a6a13.netlify.app/',
                'description' => 'Join Arya on an epic adventure through mystical lands.',
                'details'     => 'Embark on a thrilling journey with Arya as you explore mystical lands, solve puzzles, and battle enemies in this action-packed adventure game. Uncover secrets and become a hero in Arya\'s Adventure.',
            ],
            [
                'name'        => 'Block Vs Ball',
                'thumbnail'   => asset('games/other/bb.png'),
                'url'         => 'https://blockvsballgame.netlify.app/',
                'description' => 'A fun physics-based game where you control a ball to hit blocks.',
                'details'     => 'Block Vs Ball is an engaging physics-based game where you control a ball to hit blocks and clear the screen. Use your skills to achieve the highest score possible.',
            ],
        ];

        // Add more games to reach 38 total, reusing existing games
        $allGames = $gameList;
        while (count($allGames) < 20) {
            // Cycle through the existing games to fill up to 38
            $allGames = array_merge($allGames, $gameList);
        }

        // Trim to exactly 38 games
        $allGames = array_slice($allGames, 0, 20);
        // shuffle($allGames);

        return view('allgames', compact('allGames'));
    }
}
