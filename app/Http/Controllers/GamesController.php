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
                'name'      => 'Chicken Cross Road Casino',
                'thumbnail' => asset('games/Chicken_Cross_Road_Casino/chicken-cross-game.netlify.app/assets/chicken.png'),
                'url'       => 'https://chicken-cross-game.netlify.app/',
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
                'name'      => 'Math Quiz Addition & Subtraction',
                'thumbnail' => asset('games/Math_Quiz_Addition_&_Subtraction/math-quiz-challenge.netlify.app/assets/logo.png'),
                'url'       => asset('games/Math_Quiz_Addition_&_Subtraction/math-quiz-challenge.netlify.app/index.html'),
            ],
            [
                'name'      => 'Neon Bounce Casino',
                'thumbnail' => asset('games/Neon_Bounce_Casino/neon-bounce-game.netlify.app/neonbounce.png'),
                'url'       => asset('games/Neon_Bounce_Casino/neon-bounce-game.netlify.app/index.html'),
            ],
            [
                'name'      => 'Onet Animals',
                'thumbnail' => asset('assets/img/others/popular-game-thumb5.webp'),
                'url'       => asset('games/Onet_Animals/onet-animals.netlify.app/index.html'),
            ],
            [
                'name'      => 'Panda Pop',
                'thumbnail' => asset('assets/img/others/popular-game-thumb6.webp'),
                'url'       => asset('games/Panda_Pop/pandapopgameup.netlify.app/index.html'),
            ],

            [
                'name'      => 'Rolling Ball 3D',
                'thumbnail' => asset('assets/img/others/popular-game-thumb2.webp'),
                'url'       => asset('games/Rolling_Ball_3D/rollingball3d.netlify.app/index.html'),
            ],
            [
                'name'      => 'Sport Quest',
                'thumbnail' => asset('assets/img/others/popular-game-thumb3.webp'),
                'url'       => asset('games/Sport_Quest/sport-quest.netlify.app/index.html'),
            ],
            [
                'name'      => 'Swiper Soccer 3D',
                'thumbnail' => asset('assets/img/others/popular-game-thumb4.webp'),
                'url'       => asset('games/Swiper_Soccer_3D/swipesoccer-game.netlify.app/index.html'),
            ],
            [
                'name'      => 'Cloned Website',
                'thumbnail' => asset('assets/img/others/popular-game-thumb5.webp'),
                'url'       => asset('games/cloned_website/index.html'),
            ],
            [
                'name'      => 'Taupe Faloodeh',
                'thumbnail' => asset('assets/img/others/popular-game-thumb6.webp'),
                'url'       => asset('games/taupe-faloodeh-5a6a13.netlify.app/taupe-faloodeh-5a6a13.netlify.app/index.html'),
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
            [
                'name'        => 'Chess Empire Online',
                'thumbnail'   => asset('games/Chess_Empire_Online/chess-empire-game.netlify.app/assets/loading.png'),
                'url'         => asset('games/Chess_Empire_Online/chess-empire-game.netlify.app/index.html'),
                'description' => 'Strategic board game played between two players, simulating medieval warfare.',
                'details'     => 'Chess is a recreational and competitive board game played between two players. It is sometimes called international or Western chess to distinguish it from related games such as xiangqi and shogi.',
            ],
            [
                'name'        => 'Chicken Cross Road Casino',
                'thumbnail'   => asset('games/Chicken_Cross_Road_Casino/chicken-cross-game.netlify.app/assets/chicken.png'),
                'url'         => 'https://chicken-cross-game.netlify.app/',
                'description' => 'Fun variation of the classic crossing game with casino elements.',
                'details'     => 'Help the chicken cross the road while avoiding traffic and collecting coins. This game combines the classic gameplay with casino-style rewards and challenges.',
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
                'name'        => 'Math Quiz Addition & Subtraction',
                'thumbnail'   => asset('assets/img/others/popular-game-thumb3.webp'),
                'url'         => asset('games/Math_Quiz_Addition_&_Subtraction/math-quiz-challenge.netlify.app/index.html'),
                'description' => 'Educational game to practice addition and subtraction skills.',
                'details'     => 'Test your math skills with this fun quiz game. Answer addition and subtraction problems as quickly as possible to earn points and improve your score.',
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
                'thumbnail'   => asset('assets/img/others/popular-game-thumb5.webp'),
                'url'         => asset('games/Onet_Animals/onet-animals.netlify.app/index.html'),
                'description' => 'Connect matching animal tiles to clear the board.',
                'details'     => 'Find and connect pairs of matching animal tiles to remove them from the board. Clear all tiles to advance to the next level in this fun puzzle game.',
            ],
            [
                'name'        => 'Panda Pop',
                'thumbnail'   => asset('assets/img/others/popular-game-thumb6.webp'),
                'url'         => asset('games/Panda_Pop/pandapopgameup.netlify.app/index.html'),
                'description' => 'Colorful bubble shooter game with pandas.',
                'details'     => 'Shoot bubbles to match colors and clear the board in this adorable panda-themed bubble shooter game. Complete levels with the fewest shots possible.',
            ],

            [
                'name'        => 'Rolling Ball 3D',
                'thumbnail'   => asset('assets/img/others/popular-game-thumb2.webp'),
                'url'         => asset('games/Rolling_Ball_3D/rollingball3d.netlify.app/index.html'),
                'description' => 'Challenging 3D maze game where you roll a ball to the exit.',
                'details'     => 'Navigate the rolling ball through complex 3D mazes by tilting the platform. Avoid obstacles and reach the finish line in this physics-based puzzle game.',
            ],
            [
                'name'        => 'Sport Quest',
                'thumbnail'   => asset('assets/img/others/popular-game-thumb3.webp'),
                'url'         => asset('games/Sport_Quest/sport-quest.netlify.app/index.html'),
                'description' => 'Multi-sports challenge game with various athletic events.',
                'details'     => 'Participate in various sports challenges and competitions in this diverse sports game. Test your skills in different athletic events and aim for the highest scores.',
            ],
            [
                'name'        => 'Swiper Soccer 3D',
                'thumbnail'   => asset('assets/img/others/popular-game-thumb4.webp'),
                'url'         => asset('games/Swiper_Soccer_3D/swipesoccer-game.netlify.app/index.html'),
                'description' => 'Another version of the popular 3D soccer game.',
                'details'     => 'Enjoy another variant of the popular 3D soccer game with swipe controls. Compete in matches and tournaments to become the ultimate soccer champion.',
            ],
            [
                'name'        => 'Cloned Website',
                'thumbnail'   => asset('assets/img/others/popular-game-thumb5.webp'),
                'url'         => asset('games/cloned_website/index.html'),
                'description' => 'A cloned website demonstration project.',
                'details'     => 'This project showcases a cloned website with various features and functionalities. Explore the interface and interact with different elements.',
            ],
            [
                'name'        => 'Taupe Faloodeh',
                'thumbnail'   => asset('assets/img/others/popular-game-thumb6.webp'),
                'url'         => asset('games/taupe-faloodeh-5a6a13.netlify.app/taupe-faloodeh-5a6a13.netlify.app/index.html'),
                'description' => 'Unique game with creative gameplay mechanics.',
                'details'     => 'Experience this unique game with innovative mechanics and engaging gameplay. Discover new challenges and adventures in this creative title.',
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
                'name'      => '2048 Game',
                'thumbnail' => asset('assets/img/others/popular-game-thumb1.webp'),
                'url'       => asset('games/2048_Game/2048-game.netlify.app/index.html'),
            ],
            [
                'name'      => 'Checkers Master',
                'thumbnail' => asset('assets/img/others/popular-game-thumb2.webp'),
                'url'       => asset('games/Checkers_Master/checkers-master-game-buy.netlify.app/index.html'),
            ],
            [
                'name'      => 'Chess Empire Online',
                'thumbnail' => asset('assets/img/others/popular-game-thumb3.webp'),
                'url'       => asset('games/Chess_Empire_Online/chess-empire-game.netlify.app/index.html'),
            ],
            [
                'name'      => 'Chicken Cross Road Casino',
                'thumbnail' => asset('assets/img/others/popular-game-thumb4.webp'),
                'url'       => asset('games/Chicken_Cross_Road_Casino/chicken-cross-game.netlify.app/index.html'),
            ],
            [
                'name'      => 'Dimension Escape 3D',
                'thumbnail' => asset('assets/img/others/popular-game-thumb5.webp'),
                'url'       => asset('games/Dimension_Escape_3D/dimension-escape.netlify.app/index.html'),
            ],
            [
                'name'      => 'Jewels Quest',
                'thumbnail' => asset('assets/img/others/popular-game-thumb6.webp'),
                'url'       => asset('games/Jewels_Quest/jewelsquestup.netlify.app/index.html'),
            ],
        
            [
                'name'      => 'Lights Out Puzzle',
                'thumbnail' => asset('games/Lights_Out_Puzzle/lights-out-html5-game.netlify.app/assets/logo.png'),
                'url'       => asset('games/Lights_Out_Puzzle/lights-out-html5-game.netlify.app/index.html'),
            ],
            [
                'name'      => 'Math Quiz Addition & Subtraction',
                'thumbnail' => asset('assets/img/others/popular-game-thumb3.webp'),
                'url'       => asset('games/Math_Quiz_Addition_&_Subtraction/math-quiz-challenge.netlify.app/index.html'),
            ],
            [
                'name'      => 'Neon Bounce Casino',
                'thumbnail' => asset('assets/img/others/popular-game-thumb4.webp'),
                'url'       => asset('games/Neon_Bounce_Casino/neon-bounce-game.netlify.app/index.html'),
            ],
            [
                'name'      => 'Onet Animals',
                'thumbnail' => asset('assets/img/others/popular-game-thumb5.webp'),
                'url'       => asset('games/Onet_Animals/onet-animals.netlify.app/index.html'),
            ],
            [
                'name'      => 'Panda Pop',
                'thumbnail' => asset('assets/img/others/popular-game-thumb6.webp'),
                'url'       => asset('games/Panda_Pop/pandapopgameup.netlify.app/index.html'),
            ],
            [
                'name'      => 'Plinko Pro Casino',
                'thumbnail' => asset('assets/img/others/popular-game-thumb1.webp'),
                'url'       => asset('games/Plinko_Pro_Casino/plinko-pro-game.netlify.app/index.html'),
            ],
            [
                'name'      => 'Rolling Ball 3D',
                'thumbnail' => asset('assets/img/others/popular-game-thumb2.webp'),
                'url'       => asset('games/Rolling_Ball_3D/rollingball3d.netlify.app/index.html'),
            ],
            [
                'name'      => 'Sport Quest',
                'thumbnail' => asset('assets/img/others/popular-game-thumb3.webp'),
                'url'       => asset('games/Sport_Quest/sport-quest.netlify.app/index.html'),
            ],
            [
                'name'      => 'Swiper Soccer 3D',
                'thumbnail' => asset('assets/img/others/popular-game-thumb4.webp'),
                'url'       => asset('games/Swiper_Soccer_3D/swipesoccer-game.netlify.app/index.html'),
            ],
            [
                'name'      => 'Cloned Website',
                'thumbnail' => asset('assets/img/others/popular-game-thumb5.webp'),
                'url'       => asset('games/cloned_website/index.html'),
            ],
            [
                'name'      => 'Taupe Faloodeh',
                'thumbnail' => asset('assets/img/others/popular-game-thumb6.webp'),
                'url'       => asset('games/taupe-faloodeh-5a6a13.netlify.app/taupe-faloodeh-5a6a13.netlify.app/index.html'),
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

        return view('allgames', compact('allGames'));
    }
}
