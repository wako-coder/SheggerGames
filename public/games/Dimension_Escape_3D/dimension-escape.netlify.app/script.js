const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        
        function playSound(type, vol = 1.0) {
            if (audioCtx.state === 'suspended') audioCtx.resume();
            
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            
            const t = audioCtx.currentTime;
            
            // Heartbeat Effect (Thump-Thump)
            if (type === 'heartbeat') {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(60, t);
                osc.frequency.exponentialRampToValueAtTime(40, t + 0.1);
                gain.gain.setValueAtTime(vol, t);
                gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
                osc.start(t);
                osc.stop(t + 0.15);
                
                // Second beat
                const osc2 = audioCtx.createOscillator();
                const gain2 = audioCtx.createGain();
                osc2.connect(gain2); gain2.connect(audioCtx.destination);
                osc2.type = 'triangle';
                osc2.frequency.setValueAtTime(60, t + 0.2);
                osc2.frequency.exponentialRampToValueAtTime(40, t + 0.3);
                gain2.gain.setValueAtTime(vol * 0.8, t + 0.2);
                gain2.gain.exponentialRampToValueAtTime(0.01, t + 0.35);
                osc2.start(t + 0.2);
                osc2.stop(t + 0.35);
            } 
            // Key Collection Sound
            else if (type === 'key') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(800, t);
                osc.frequency.exponentialRampToValueAtTime(1200, t+0.1);
                gain.gain.setValueAtTime(0.3, t);
                gain.gain.exponentialRampToValueAtTime(0.01, t+0.3);
                osc.start();
                osc.stop(t+0.3);
            } 
            // Power Up Sound
            else if (type === 'powerup') {
                osc.type = 'square';
                osc.frequency.setValueAtTime(200, t);
                osc.frequency.linearRampToValueAtTime(600, t+0.2);
                gain.gain.setValueAtTime(0.2, t);
                gain.gain.exponentialRampToValueAtTime(0.01, t+0.4);
                osc.start();
                osc.stop(t+0.4);
            } 
            // Footstep Sound
            else if (type === 'footstep') {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(50, t);
                gain.gain.setValueAtTime(0.1, t);
                gain.gain.exponentialRampToValueAtTime(0.01, t+0.05);
                osc.start();
                osc.stop(t+0.05);
            } 
            // Ghost Scream
            else if (type === 'ghost_scream') {
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(200, t);
                osc.frequency.linearRampToValueAtTime(800, t+0.5);
                gain.gain.setValueAtTime(0.0, t);
                gain.gain.linearRampToValueAtTime(0.2, t+0.1);
                gain.gain.linearRampToValueAtTime(0.0, t+0.8);
                osc.start();
                osc.stop(t+0.8);
            } 
            // Win Sound
            else if (type === 'win') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(400, t);
                osc.frequency.linearRampToValueAtTime(800, t+0.5);
                gain.gain.setValueAtTime(0.3, t);
                gain.gain.exponentialRampToValueAtTime(0.01, t+2);
                osc.start();
                osc.stop(t+2);
            }
        }

        // ==========================================
        // GAME CONFIG & STATE MANAGEMENT
        // ==========================================
        const config = {
            tileSize: 4,
            mapSize: 21,
            totalLevels: 20 // Full 20 Levels loop logic
        };

        const gameState = { 
            level: 1,
            unlockedLevels: 1,
            mode: 'normal', // 'normal' or 'ghost'
            keys: 0,
            totalKeys: 3,
            battery: 100,
            isPlaying: false,
            isGameOver: false,
            items: [],
            pathMarkers: [],
            pathShown: false,
            infiniteLight: false,
            lightTimer: 0,
            walls: [],
            grid: [],
            powers: {
                speed: false,
                battery: false,
                speedUsed: false,
                batteryUsed: false
            },
            enemy: null,
            enemyActive: false,
            enemyTimer: 0,
            lastHeartbeat: 0
        };
        
        // Restore progress from local storage
        if(localStorage.getItem('hauntedHallsUnlock')) {
            gameState.unlockedLevels = parseInt(localStorage.getItem('hauntedHallsUnlock'));
        }

        // ==========================================
        // ENEMY SYSTEM (THE PHANTOM)
        // ==========================================
        function spawnEnemy(pos) {
            // Create a scary dark phantom
            const geo = new THREE.IcosahedronGeometry(1, 0); // Jagged shape
            const mat = new THREE.MeshStandardMaterial({ 
                color: 0x000000, 
                emissive: 0x110000, 
                roughness: 0.9, 
                metalness: 0.1 
            });
            const enemy = new THREE.Mesh(geo, mat);
            
            // Glowing Red Eyes
            const eyeGeo = new THREE.SphereGeometry(0.15); 
            const eyeMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
            
            const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
            leftEye.position.set(-0.3, 0.1, 0.8);
            
            const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
            rightEye.position.set(0.3, 0.1, 0.8);
            
            enemy.add(leftEye);
            enemy.add(rightEye);
            
            // Red Aura Light
            enemy.add(new THREE.PointLight(0xff0000, 1.5, 8));

            // Floating dark particles around ghost
            for(let i=0; i<5; i++) {
                const p = new THREE.Mesh(
                    new THREE.BoxGeometry(0.2,0.2,0.2), 
                    new THREE.MeshBasicMaterial({color:0x330000})
                );
                p.position.set((Math.random()-0.5)*2, (Math.random()-0.5)*2, (Math.random()-0.5)*2);
                enemy.add(p);
            }

            enemy.position.copy(pos);
            enemy.position.y = 1.5;
            scene.add(enemy);
            
            gameState.enemy = enemy;
            gameState.enemyActive = true;
            
            playSound('ghost_scream');
            
            // Show warning
            document.getElementById('enemy-warning').style.display = 'block';
            setTimeout(() => {
                document.getElementById('enemy-warning').style.display = 'none';
            }, 4000);
        }

        // ==========================================
        // MENU & NAVIGATION SYSTEM
        // ==========================================
        function selectMode(mode) {
            gameState.mode = mode;
            document.getElementById('main-menu').style.display = 'none';
            document.getElementById('level-select').style.display = 'flex';
            
            // Update Level Grid styling based on mode
            const title = document.getElementById('mode-title');
            title.innerText = mode === 'ghost' ? "NIGHTMARE LEVELS" : "NORMAL LEVELS";
            title.style.color = mode === 'ghost' ? "#ff0000" : "#fff";
            
            renderLevelGrid();
        }

        function renderLevelGrid() {
            const grid = document.getElementById('level-grid');
            grid.innerHTML = '';
            for(let i=1; i<=config.totalLevels; i++) {
                const btn = document.createElement('div');
                btn.className = 'level-btn';
                btn.innerText = i;
                
                if(i <= gameState.unlockedLevels) { 
                    btn.classList.add('unlocked'); 
                    if(gameState.mode === 'ghost') {
                        btn.style.borderColor = '#b71c1c';
                    }
                    btn.onclick = () => startGame(i); 
                }
                grid.appendChild(btn);
            }
        }

        function initMainMenu() {
            document.exitPointerLock();
            gameState.isPlaying = false;
            
            // Hide In-Game UI
            document.getElementById('hud').style.display = 'none';
            document.getElementById('powers-container').style.display = 'none';
            document.getElementById('instructions').style.display = 'none';
            document.getElementById('crosshair').style.display = 'none';
            document.getElementById('level-indicator').style.display = 'none';
            
            // Hide Modals
            document.getElementById('game-over-screen').style.display = 'none';
            document.getElementById('win-screen').style.display = 'none';
            document.getElementById('ad-modal').style.display = 'none';
            document.getElementById('level-select').style.display = 'none';
            document.getElementById('how-to-play-modal').style.display = 'none'; // Close Instruction Modal
            
            // Show Main Menu
            document.getElementById('main-menu').style.display = 'flex';
            
            // Reset Overlay
            document.getElementById('danger-overlay').style.opacity = 0;
        }

        function showHowToPlay() {
            document.getElementById('how-to-play-modal').style.display = 'flex';
        }

        function closeHowToPlay() {
            document.getElementById('how-to-play-modal').style.display = 'none';
        }

        function startGame(level) {
            if (audioCtx.state === 'suspended') audioCtx.resume();
            
            gameState.level = level;
            
            // Hide Menus
            document.getElementById('level-select').style.display = 'none';
            document.getElementById('game-over-screen').style.display = 'none';
            document.getElementById('win-screen').style.display = 'none';
            
            // Show HUD
            document.getElementById('hud').style.display = 'flex';
            document.getElementById('powers-container').style.display = 'flex';
            document.getElementById('instructions').style.display = 'block';
            document.getElementById('crosshair').style.display = 'block';
            document.getElementById('level-indicator').style.display = 'block';
            
            buildLevel();
            
            document.body.requestPointerLock();
            gameState.isPlaying = true;
            gameState.isGameOver = false;
        }

        // ==========================================
        // ADVERTISEMENT SYSTEM (Simulation)
        // ==========================================
        let adInterval, pendingPower;
        
        function requestAd(t) {
            if(gameState.powers[t+'Used']) return;
            
            gameState.isPlaying = false;
            document.exitPointerLock();
            
            document.getElementById('ad-modal').style.display = 'flex';
            document.getElementById('ad-close-btn').style.display = 'none';
            
            pendingPower = t;
            let time = 10;
            const el = document.getElementById('ad-timer');
            el.innerText = `Reward in ${time}s...`;
            
            if(adInterval) clearInterval(adInterval);
            
            adInterval = setInterval(() => {
                time--;
                el.innerText = `Reward in ${time}s...`;
                if(time <= 0) {
                    clearInterval(adInterval);
                    el.innerText = "Claim Reward!";
                    document.getElementById('ad-close-btn').style.display = 'block';
                }
            }, 1000);
        }

        function closeAd() {
            document.getElementById('ad-modal').style.display = 'none';
            activatePower(pendingPower);
            document.body.requestPointerLock();
            gameState.isPlaying = true;
        }

        function activatePower(t) {
            playSound('powerup');
            if(t==='speed') {
                gameState.powers.speed = true;
                gameState.powers.speedUsed = true;
                document.getElementById('btn-power-speed').classList.add('used');
                document.getElementById('btn-power-speed').innerHTML = '⚡ SPEED ACTIVE';
                showNotify("SPEED BOOST ACTIVATED!", "#0ff");
            } else {
                gameState.battery = 100;
                gameState.powers.batteryUsed = true;
                document.getElementById('btn-power-battery').classList.add('used');
                document.getElementById('btn-power-battery').innerHTML = '🔋 RECHARGED';
                showNotify("BATTERY RECHARGED!", "#0f0");
            }
        }

        function showNotify(msg, c) {
            const el = document.getElementById('notify');
            el.innerText = msg;
            el.style.color = c;
            el.style.opacity = 1;
            setTimeout(() => {
                if(!gameState.pathShown) el.style.opacity = 0;
                else {
                    el.innerText = "PORTAL OPEN! FOLLOW THE PATH!";
                    el.style.color = "#0f0";
                }
            }, 3000);
        }

        function resetPowersUI() {
            gameState.powers.speed = false;
            gameState.powers.speedUsed = false;
            gameState.powers.batteryUsed = false;
            
            const btnSpeed = document.getElementById('btn-power-speed');
            btnSpeed.className = 'power-btn';
            btnSpeed.innerHTML = '<span class="lock-icon">🔒</span> ⚡ Run Fast';
            
            const btnBat = document.getElementById('btn-power-battery');
            btnBat.className = 'power-btn';
            btnBat.innerHTML = '<span class="lock-icon">🔒</span> 🔋 Full Battery';
        }
        
        function restartCurrentLevel() {
            startGame(gameState.level);
        }

        function loadNextLevel() {
            if (gameState.level >= config.totalLevels) {
                // Game Completed, go to Home
                goToHome();
            } else {
                gameState.level++;
                startGame(gameState.level);
            }
        }

        function goToHome() {
            initMainMenu();
        }

        // ==========================================
        // 3D GRAPHICS & SCENE (THREE.JS)
        // ==========================================
        
        // UPGRADED THEMES with Unique Visual Properties
        const themes = [ 
            // Level 1: Old Dungeon (Classic Brick)
            { name: "Old Dungeon", wall: '#555', floor: '#222', sky: '#050505', fog: 0.08, wallType: 'brick', glow: 0 }, 
            // Level 2: Neon City (Glowing Grid)
            { name: "Neon City", wall: '#000', floor: '#001', sky: '#000033', fog: 0.03, wallType: 'grid', glow: 1 }, 
            // Level 3: Horror Hall (Blood Splatters)
            { name: "Horror Hall", wall: '#ccc', floor: '#300', sky: '#200000', fog: 0.1, wallType: 'horror', glow: 0 }, 
            // Level 4: War Zone (Hazard Stripes)
            { name: "War Zone", wall: '#333', floor: '#221', sky: '#111', fog: 0.06, wallType: 'hazard', glow: 0 }, 
            // Level 5: Alien Ship (Tech Circuits)
            { name: "Alien Ship", wall: '#020', floor: '#010', sky: '#001100', fog: 0.04, wallType: 'tech', glow: 1 }, 
            // Level 6: Magma Chamber (Lava Cracks)
            { name: "Magma Chamber", wall: '#200', floor: '#100', sky: '#330000', fog: 0.07, wallType: 'lava', glow: 0.5 }, 
            // Level 7: Heavy Fog (Whiteout)
            { name: "Silent Fog", wall: '#888', floor: '#666', sky: '#ccc', fog: 0.25, wallType: 'noise', glow: 0 }, 
            // Level 8: Red Smoke (Dark & Ominous)
            { name: "Red Smoke", wall: '#111', floor: '#000', sky: '#400', fog: 0.15, wallType: 'grunge', glow: 0 }, 
            // Level 9: Thunder Storm (Dark with Flashes - simulated by sky color)
            { name: "Thunder Storm", wall: '#001', floor: '#112', sky: '#000044', fog: 0.05, wallType: 'noise', glow: 0.2 }, 
            // Level 10: Toxic Sewers (Slime)
            { name: "Toxic Sewers", wall: '#121', floor: '#010', sky: '#002200', fog: 0.08, wallType: 'slime', glow: 0.3 }
        ];

        function getCurrentTheme() {
            // Cycle through the new 10 themes array
            return themes[(gameState.level - 1) % themes.length];
        }

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        document.body.appendChild(renderer.domElement);
        
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
        scene.add(ambientLight);

        // ADVANCED TEXTURE GENERATOR
        function generateTexture(type, theme) {
            const c = document.createElement('canvas');
            c.width = 512; c.height = 512;
            const ctx = c.getContext('2d');
            
            // 1. Fill Background
            ctx.fillStyle = type === 'wall' ? theme.wall : theme.floor;
            if(type === 'ceiling') ctx.fillStyle = '#050505'; // Dark ceiling usually
            ctx.fillRect(0,0,512,512);
            
            // 2. Add Base Noise (Universal for texture)
            if(theme.wallType !== 'grid' && theme.wallType !== 'tech') {
                const d = ctx.getImageData(0,0,512,512);
                for(let i=0; i<d.data.length; i+=4) {
                    const n = (Math.random()-0.5) * 20;
                    d.data[i]+=n; d.data[i+1]+=n; d.data[i+2]+=n;
                }
                ctx.putImageData(d,0,0);
            }

            // 3. Specific Pattern Logic
            if(type === 'wall') {
                
                // BRICK (Old Dungeon)
                if(theme.wallType === 'brick') {
                    ctx.strokeStyle = '#000'; ctx.lineWidth = 4;
                    for(let y=0; y<512; y+=64) {
                        ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(512,y); ctx.stroke();
                        for(let x=(y%128?32:0); x<512; x+=64) {
                            ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x,y+64); ctx.stroke();
                        }
                    }
                }
                
                // GRID (Neon City)
                else if(theme.wallType === 'grid') {
                    ctx.strokeStyle = '#0ff'; ctx.lineWidth = 4;
                    ctx.shadowBlur = 10; ctx.shadowColor = '#0ff';
                    for(let i=0; i<=512; i+=64) {
                        ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,512); ctx.stroke();
                        ctx.beginPath(); ctx.moveTo(0,i); ctx.lineTo(512,i); ctx.stroke();
                    }
                }
                
                // HORROR (Blood Splatters)
                else if(theme.wallType === 'horror') {
                    // Draw random blood stains
                    for(let i=0; i<5; i++) {
                        ctx.fillStyle = `rgba(${150+Math.random()*50}, 0, 0, 0.8)`;
                        ctx.beginPath();
                        let rx = Math.random()*512, ry = Math.random()*512;
                        ctx.arc(rx, ry, 20 + Math.random()*60, 0, Math.PI*2);
                        ctx.fill();
                        // Drips
                        ctx.fillRect(rx, ry, 4, 100+Math.random()*100);
                    }
                }

                // HAZARD (War Zone)
                else if(theme.wallType === 'hazard') {
                    ctx.fillStyle = '#aa0'; // Yellow
                    for(let i=-512; i<1024; i+=64) {
                        ctx.beginPath();
                        ctx.moveTo(i, 0);
                        ctx.lineTo(i+32, 0);
                        ctx.lineTo(i-32+512, 512);
                        ctx.lineTo(i-64+512, 512);
                        ctx.fill();
                    }
                }

                // TECH (Alien)
                else if(theme.wallType === 'tech') {
                    ctx.strokeStyle = '#0f0'; ctx.lineWidth = 3;
                    ctx.shadowBlur = 5; ctx.shadowColor = '#0f0';
                    for(let i=0; i<10; i++) {
                        ctx.strokeRect(Math.random()*400, Math.random()*400, 50, 50);
                        ctx.beginPath(); 
                        ctx.moveTo(Math.random()*512, Math.random()*512);
                        ctx.lineTo(Math.random()*512, Math.random()*512);
                        ctx.stroke();
                    }
                }

                // LAVA (Cracks)
                else if(theme.wallType === 'lava') {
                    ctx.strokeStyle = '#f50'; ctx.lineWidth = 3;
                    ctx.shadowBlur = 10; ctx.shadowColor = '#f00';
                    for(let i=0; i<8; i++) {
                        ctx.beginPath();
                        let cx = Math.random()*512;
                        let cy = Math.random()*512;
                        ctx.moveTo(cx, cy);
                        for(let j=0; j<5; j++) {
                            cx += (Math.random()-0.5)*100;
                            cy += (Math.random()-0.5)*100;
                            ctx.lineTo(cx, cy);
                        }
                        ctx.stroke();
                    }
                }
                
                // SLIME (Toxic)
                else if(theme.wallType === 'slime') {
                    ctx.fillStyle = '#0f0';
                    ctx.beginPath();
                    ctx.moveTo(0,0);
                    for(let x=0; x<=512; x+=30) {
                        ctx.lineTo(x, 50 + Math.sin(x*0.05)*30);
                    }
                    ctx.lineTo(512,0);
                    ctx.fill();
                }
            }
            
            // Ceiling Pattern (Simple light for some)
            if(type === 'ceiling') {
                if(theme.wallType === 'grid' || theme.wallType === 'tech') {
                     ctx.strokeStyle = theme.wallType==='grid'?'#00f':'#0f0';
                     ctx.lineWidth = 2;
                     ctx.strokeRect(100,100,312,312);
                }
            }
            
            const t = new THREE.CanvasTexture(c);
            t.wrapS = t.wrapT = THREE.RepeatWrapping;
            return t;
        }

        // Emoji Sprite Generator for Items
        function createEmojiSprite(e, s=1) {
            const c = document.createElement('canvas');
            c.width = 128; c.height = 128;
            const ctx = c.getContext('2d');
            ctx.font = '100px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(e, 64, 64);
            
            const m = new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), transparent: true });
            const sp = new THREE.Sprite(m);
            sp.scale.set(s,s,1);
            return sp;
        }

        // ==========================================
        // MAP GENERATION (DFS Maze)
        // ==========================================
        let doorMesh, doorLoc, spawnPoint = new THREE.Vector3();
        
        function generateMapLayout() {
            const size = config.mapSize;
            const map = Array(size).fill().map(() => Array(size).fill(1));
            
            const stack = [{x:1, z:1}];
            map[1][1] = 0;
            const dirs = [[0,-2],[2,0],[0,2],[-2,0]];
            
            while (stack.length) {
                const cur = stack[stack.length - 1];
                const neighbors = [];
                for(let d of dirs) {
                    const nx=cur.x+d[0], nz=cur.z+d[1];
                    if(nx>0 && nx<size-1 && nz>0 && nz<size-1 && map[nz][nx]===1) {
                        neighbors.push({x:nx, z:nz, dx:d[0]/2, dz:d[1]/2});
                    }
                }
                
                if(neighbors.length) {
                    const next = neighbors[Math.floor(Math.random()*neighbors.length)];
                    map[cur.z+next.dz][cur.x+next.dx] = 0;
                    map[next.z][next.x] = 0;
                    stack.push({x:next.x, z:next.z});
                } else {
                    stack.pop();
                }
            }
            
            // Set Start
            map[1][1] = 9;
            
            // Find Exit
            for(let z=size-2; z>0; z--) {
                for(let x=size-2; x>0; x--) {
                    if(map[z][x]===0) {
                        map[z][x]=3; 
                        z=0; break;
                    }
                }
            }
            
            // Braid Maze (Reduce Dead Ends)
            for(let i=0; i<size*3; i++) {
                const rx = Math.floor(Math.random()*(size-2))+1;
                const rz = Math.floor(Math.random()*(size-2))+1;
                if(map[rz][rx]===1) {
                    let f=0;
                    if(map[rz+1][rx]!==1)f++;
                    if(map[rz-1][rx]!==1)f++;
                    if(map[rz][rx+1]!==1)f++;
                    if(map[rz][rx-1]!==1)f++;
                    if(f>=2) map[rz][rx]=0;
                }
            }
            return map;
        }

        // NEW HELPER: Check which tiles are reachable from start without passing through locked door
        function getReachableTiles(map, startPos) {
            const tiles = [];
            const visited = new Set();
            const queue = [startPos];
            visited.add(`${startPos.x},${startPos.z}`);
            
            const size = map.length;
            
            while(queue.length > 0) {
                const {x,z} = queue.shift();
                
                // Add to valid list
                tiles.push({x,z});
                
                const dirs = [[0,1],[0,-1],[1,0],[-1,0]];
                for(let d of dirs) {
                    const nx = x + d[0];
                    const nz = z + d[1];
                    
                    if(nx > 0 && nx < size-1 && nz > 0 && nz < size-1) {
                        const cell = map[nz][nx];
                        // 1 is WALL, 3 is DOOR (Locked). 
                        // Do NOT traverse through 3 to find item spots, effectively isolating blocked areas.
                        if(cell !== 1 && cell !== 3 && !visited.has(`${nx},${nz}`)) {
                            visited.add(`${nx},${nz}`);
                            queue.push({x:nx, z:nz});
                        }
                    }
                }
            }
            return tiles;
        }

        // ==========================================
        // BUILD LEVEL
        // ==========================================
        const playerGroup = new THREE.Group();
        const torch = new THREE.SpotLight(0xffffff, 2);
        torch.position.set(0.2, -0.1, 0);
        torch.target.position.set(0, 0, -1);
        torch.angle = Math.PI/5;
        torch.penumbra = 0.3;
        torch.distance = 30;
        torch.castShadow = true;
        playerGroup.add(torch);
        playerGroup.add(torch.target);
        playerGroup.add(camera);

        function buildLevel() {
            // Clean Scene
            scene.remove(playerGroup);
            scene.remove(ambientLight);
            while(scene.children.length > 0) {
                const o = scene.children[0];
                scene.remove(o);
                if(o.geometry) o.geometry.dispose();
            }
            
            // Reset State
            gameState.walls = [];
            gameState.items = [];
            gameState.pathMarkers = [];
            gameState.enemy = null;
            gameState.enemyActive = false;
            gameState.enemyTimer = 0;
            resetPowersUI();
            document.getElementById('danger-overlay').style.opacity = 0;

            const theme = getCurrentTheme();
            scene.fog = new THREE.FogExp2(theme.sky, theme.fog);
            scene.background = new THREE.Color(theme.sky);
            
            ambientLight.intensity = 0.2;
            scene.add(ambientLight);
            scene.add(playerGroup);

            const wallTex = generateTexture('wall', theme);
            const floorTex = generateTexture('floor', theme);
            const ceilTex = generateTexture('ceiling', theme);
            
            // Adjust materials based on theme properties
            const wallMat = new THREE.MeshStandardMaterial({ 
                map: wallTex, 
                roughness: 0.9, // Fixed: Increased roughness to prevent "white spot" reflection
                metalness: 0.1, // Low metalness
                emissive: theme.glow > 0 ? theme.wall : 0x000000,
                emissiveIntensity: theme.glow > 0 ? 0.5 : 0
            });
            const floorMat = new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.8 });
            const ceilMat = new THREE.MeshStandardMaterial({ map: ceilTex, emissive: 0x222222 });

            // --- GUARANTEE MAP VALIDITY & ITEM COUNTS ---
            let map, reachableTiles;
            let attempts = 0;
            do {
                map = generateMapLayout();
                reachableTiles = getReachableTiles(map, {x:1, z:1});
                attempts++;
                // Require at least 15 safe tiles to ensure we can spawn all 8 items (3 keys + 4 batt + 1 bulb) + Player
            } while (reachableTiles.length < 15 && attempts < 100);

            gameState.grid = map;
            
            // Build Map Mesh
            for(let z=0; z<config.mapSize; z++) {
                for(let x=0; x<config.mapSize; x++) {
                    const t = map[z][x], px = x * config.tileSize, pz = z * config.tileSize;
                    
                    if(t === 1) {
                        const m = new THREE.Mesh(new THREE.BoxGeometry(config.tileSize, config.tileSize*1.5, config.tileSize), wallMat);
                        m.position.set(px, config.tileSize*0.75, pz);
                        m.castShadow = m.receiveShadow = true;
                        scene.add(m);
                        gameState.walls.push(m);
                    } else if(t === 3) {
                        doorMesh = new THREE.Mesh(new THREE.BoxGeometry(config.tileSize, config.tileSize*1.2, config.tileSize/4), new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0x330000 }));
                        doorMesh.position.set(px, config.tileSize*0.6, pz);
                        doorMesh.userData = { isDoor: true };
                        scene.add(doorMesh);
                        gameState.walls.push(doorMesh);
                        doorLoc = new THREE.Vector3(px, 0, pz);
                    } else if(t === 9) {
                        spawnPoint.set(px, config.tileSize*0.8, pz);
                    } 
                }
            }

            // Floor & Ceiling
            const mapW = config.mapSize*config.tileSize;
            const floor = new THREE.Mesh(new THREE.PlaneGeometry(mapW, mapW), floorMat);
            floor.rotation.x = -Math.PI/2;
            floor.position.set(mapW/2-config.tileSize/2, 0, mapW/2-config.tileSize/2);
            floor.receiveShadow = true;
            scene.add(floor);
            
            const ceil = new THREE.Mesh(new THREE.PlaneGeometry(mapW, mapW), ceilMat);
            ceil.rotation.x = Math.PI/2;
            ceil.position.set(mapW/2-config.tileSize/2, config.tileSize*1.5, mapW/2-config.tileSize/2);
            scene.add(ceil);

            // --- SPAWN ITEMS GUARANTEED ---
            // Shuffle coordinates to randomize item locations
            reachableTiles.sort(() => Math.random() - 0.5);
            
            // Remove start pos from potential spawn points to avoid instant pickup
            const safeTiles = reachableTiles.filter(t => t.x !== 1 || t.z !== 1);
            
            // Force spawn exact counts using safeTiles loop
            // NOTE: We don't check length because map generation guarantees enough spots
            for(let i=0; i<3; i++) spawnItem('key', safeTiles.pop()); 
            for(let i=0; i<4; i++) spawnItem('battery', safeTiles.pop());
            spawnItem('bulb', safeTiles.pop());

            // Player Init
            playerGroup.position.copy(spawnPoint);
            playerGroup.rotation.y = 0;
            gameState.pathShown = false;
            gameState.keys = 0;
            gameState.battery = 100;
            gameState.lightTimer = 0;
            gameState.infiniteLight = false;
            
            document.getElementById('level-indicator').innerText = `LEVEL ${gameState.level} - ${theme.name}`;
            document.getElementById('notify').style.opacity = 0;
        }
        
        // Item Spawning Helper
        function spawnItem(type, pos) {
             let icon = type==='key' ? '🔑' : (type==='battery' ? '🔋' : '💡');
             const sprite = createEmojiSprite(icon);
             sprite.position.set(pos.x*config.tileSize, config.tileSize*0.4, pos.z*config.tileSize);
             sprite.userData = { type: type, active: true, offset: Math.random()*100 };
             scene.add(sprite);
             gameState.items.push(sprite);
             
             // Add Point Light for visibility
             const pl = new THREE.PointLight(type==='key'?0xffff00:0x00ff00, 1, 5);
             sprite.add(pl);
        }

        // ==========================================
        // GAME LOGIC & ANIMATION LOOP
        // ==========================================
        const keys = { w:false, a:false, s:false, d:false, shift:false };
        
        document.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
        document.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);
        
        let yaw=0, pitch=0;
        document.addEventListener('mousemove', e => {
            if(document.pointerLockElement !== document.body) return;
            yaw -= e.movementX*0.002;
            pitch -= e.movementY*0.002;
            pitch = Math.max(-1.5, Math.min(1.5, pitch));
            playerGroup.rotation.y = yaw;
            camera.rotation.x = pitch;
        });

        const clock = new THREE.Clock();
        
        function updateGameLogic(dt) {
            // --- GHOST LOGIC (NIGHTMARE MODE ONLY) ---
            if(gameState.mode === 'ghost' && gameState.isPlaying && !gameState.isGameOver) {
                if(!gameState.enemyActive) {
                    gameState.enemyTimer += dt;
                    if(gameState.enemyTimer > 8) { // Spawn after 8 seconds
                        spawnEnemy(doorLoc || new THREE.Vector3(10,0,10));
                    }
                } else if (gameState.enemy) {
                    // Chase Logic
                    const dir = new THREE.Vector3().subVectors(playerGroup.position, gameState.enemy.position).normalize();
                    const dist = gameState.enemy.position.distanceTo(playerGroup.position);
                    
                    // Move Ghost (Faster than normal)
                    gameState.enemy.position.add(dir.multiplyScalar(2.2 * dt)); 
                    gameState.enemy.lookAt(playerGroup.position);
                    
                    // Proximity Horror Effects
                    if(dist < 15) {
                        const intensity = 1 - (dist / 15);
                        document.getElementById('danger-overlay').style.opacity = intensity;
                        
                        // Dynamic Heartbeat
                        if(audioCtx.currentTime - gameState.lastHeartbeat > (dist * 0.05 + 0.3)) {
                            playSound('heartbeat', intensity);
                            gameState.lastHeartbeat = audioCtx.currentTime;
                        }
                    } else {
                        document.getElementById('danger-overlay').style.opacity = 0;
                    }

                    // Catch Player
                    if(dist < 1.2) triggerGameOver("The Phantom Caught You!");
                }
            }

            // --- BATTERY & LIGHT ---
            if(gameState.infiniteLight) {
                gameState.lightTimer -= dt;
                document.getElementById('light-timer').innerText = Math.ceil(gameState.lightTimer) + 's';
                if(gameState.lightTimer <= 0) {
                    gameState.infiniteLight = false;
                    document.getElementById('light-timer-box').style.display = 'none';
                    const theme = getCurrentTheme();
                    scene.fog.density = theme.fog;
                    ambientLight.intensity = 0.2;
                }
            } else {
                gameState.battery -= 1.5 * dt;
                if(gameState.battery <= 0 && !gameState.isGameOver) {
                    triggerGameOver("Darkness Consumed You");
                }
            }
            
            if(gameState.battery > 0 && !gameState.infiniteLight) {
                torch.intensity = gameState.battery < 20 ? (Math.random()>0.5?0.5:0.1) : 2.0;
            } else if (gameState.infiniteLight) {
                torch.intensity = 0;
            }

            // --- PORTAL OPEN CHECK ---
            if(gameState.keys >= 3 && doorMesh && doorMesh.material.color.getHex() !== 0x00ff00) {
                doorMesh.material.color.setHex(0x00ff00);
                doorMesh.material.emissive.setHex(0x00ff00);
                doorMesh.material.emissiveIntensity = 2;
                
                const note = document.getElementById('notify');
                note.innerText = "PORTAL OPEN! FOLLOW THE PATH!";
                note.style.opacity = 1;
                
                if(!gameState.pathShown) {
                    gameState.pathShown = true;
                    createPath();
                }
            }
        }

        function triggerGameOver(reason) {
            gameState.battery = 0;
            torch.intensity = 0;
            gameState.isGameOver = true;
            gameState.isPlaying = false;
            document.exitPointerLock();
            document.getElementById('danger-overlay').style.opacity = 0;
            document.getElementById('death-reason').innerText = reason;
            document.getElementById('game-over-screen').style.display = 'flex';
        }

        function createPath() {
            if(!doorLoc) return;
            // BFS Pathfinding
            const startX = Math.round(playerGroup.position.x/config.tileSize);
            const startZ = Math.round(playerGroup.position.z/config.tileSize);
            const endX = Math.round(doorLoc.x/config.tileSize);
            const endZ = Math.round(doorLoc.z/config.tileSize);
            
            const queue = [{x:startX, z:startZ, path:[]}];
            const visited = new Set();
            visited.add(`${startX},${startZ}`);
            
            let finalPath = null;
            
            while(queue.length > 0) {
                const curr = queue.shift();
                if(curr.x===endX && curr.z===endZ) { finalPath=curr.path; break; }
                const neighbors = [{x:curr.x+1,z:curr.z},{x:curr.x-1,z:curr.z},{x:curr.x,z:curr.z+1},{x:curr.x,z:curr.z-1}];
                
                for(let n of neighbors) {
                    if(n.x>=0 && n.x<config.mapSize && n.z>=0 && n.z<config.mapSize) {
                        // Is walkable?
                        if(gameState.grid[n.z][n.x]!==1 && !visited.has(`${n.x},${n.z}`)) {
                            visited.add(`${n.x},${n.z}`);
                            queue.push({x:n.x, z:n.z, path:[...curr.path, {x:n.x, z:n.z}]});
                        }
                    }
                }
            }
            
            if(finalPath) {
                finalPath.forEach(pt => {
                    const m = new THREE.Mesh(
                        new THREE.SphereGeometry(0.3), 
                        new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent:true, opacity:0.8 })
                    );
                    m.position.set(pt.x*config.tileSize, 0.5, pt.z*config.tileSize);
                    scene.add(m);
                });
            }
        }

        function checkCollisions(newPos) {
            for(let w of gameState.walls) {
                if(w.userData.isDoor) {
                    // Check if player is near door and has keys (INCREASED RANGE TO 5.0)
                    if(newPos.distanceTo(w.position) < 5.0 && gameState.keys >= 3) {
                        gameState.isPlaying = false;
                        document.exitPointerLock();
                        playSound('win');
                        
                        document.getElementById('win-screen').style.display = 'flex';
                        
                        if(gameState.level === gameState.unlockedLevels && gameState.level < config.totalLevels) {
                            gameState.unlockedLevels++;
                            localStorage.setItem('hauntedHallsUnlock', gameState.unlockedLevels);
                        }
                        return true; 
                    }
                }
                const dx = Math.abs(newPos.x-w.position.x);
                const dz = Math.abs(newPos.z-w.position.z);
                
                if(dx < config.tileSize/2 + 0.3 && dz < config.tileSize/2 + 0.3) return true;
            }
            return false;
        }

        let stepTimer = 0;
        
        function animate() {
            requestAnimationFrame(animate);
            if(!gameState.isPlaying) {
                renderer.render(scene, camera);
                return;
            }
            
            const dt = clock.getDelta();
            updateGameLogic(dt);

            // Movement Physics
            let baseSpeed = gameState.powers.speed ? 10 : 4;
            let currentSpeed = keys.shift ? baseSpeed * 2.5 : baseSpeed;
            
            const dir = new THREE.Vector3();
            camera.getWorldDirection(dir); dir.y=0; dir.normalize();
            const right = new THREE.Vector3().crossVectors(dir, new THREE.Vector3(0,1,0)).normalize();
            
            const move = new THREE.Vector3();
            if(keys.w) move.add(dir);
            if(keys.s) move.sub(dir);
            if(keys.d) move.add(right);
            if(keys.a) move.sub(right);

            if(move.lengthSq() > 0) {
                move.normalize().multiplyScalar(currentSpeed * dt);
                const next = playerGroup.position.clone().add(move);
                
                if(!checkCollisions(new THREE.Vector3(next.x, 0, playerGroup.position.z))) 
                    playerGroup.position.x = next.x;
                if(!checkCollisions(new THREE.Vector3(playerGroup.position.x, 0, next.z))) 
                    playerGroup.position.z = next.z;
                
                camera.position.y = Math.sin(Date.now()*0.015) * 0.1;
                
                stepTimer += dt * (keys.shift ? 2 : 1);
                if(stepTimer > 0.5) {
                    playSound('footstep');
                    stepTimer = 0;
                }
            }

            // Item Pickup
            gameState.items.forEach(item => {
                if(!item.userData.active) return;
                item.position.y = (config.tileSize*0.4) + Math.sin(Date.now()*0.003 + item.userData.offset)*0.1;
                
                if(playerGroup.position.distanceTo(item.position) < 2.5) {
                    item.userData.active = false;
                    item.visible = false;
                    item.children[0].visible = false; 
                    
                    if(item.userData.type === 'key') {
                        gameState.keys++;
                        playSound('key');
                    }
                    else if(item.userData.type === 'battery') {
                        gameState.battery = Math.min(100, gameState.battery + 40);
                        playSound('powerup');
                    }
                    else if(item.userData.type === 'bulb') {
                        gameState.infiniteLight = true;
                        gameState.lightTimer = 60;
                        playSound('powerup');
                        document.getElementById('light-timer-box').style.display = 'flex';
                        ambientLight.intensity = 1.2;
                        scene.fog.density = 0.005; 
                    }
                }
            });

            // UI Update
            document.getElementById('keys-count').innerText = `${gameState.keys} / 3`;
            const bf = document.getElementById('battery-fill');
            bf.style.width = gameState.battery + '%';
            bf.style.background = gameState.battery > 50 ? '#0f0' : (gameState.battery > 20 ? '#ff0' : '#f00');
            
            // Ghost Particle Animation
            if(gameState.enemy) {
                gameState.enemy.children.forEach(c => {
                    if(c.isMesh && c.geometry.type === 'BoxGeometry') {
                        c.rotation.x += dt;
                        c.rotation.y += dt;
                        c.position.y = Math.sin(Date.now()*0.005 + c.position.x)*0.5;
                    }
                });
            }
            
            renderer.render(scene, camera);
        }

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth/window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // Initialize
        initMainMenu();
        animate();