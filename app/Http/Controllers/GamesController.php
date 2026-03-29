<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class GamesController extends Controller
{
    public function home()
    {
        // Create an array of all games from the public/games folder
        $popularGames = [];
        
        // Define all the games with their names, thumbnails, and local URLs
        $gameList = [
            [
                'name' => '2048 Game',
                'thumbnail' => asset('assets/img/others/popular-game-thumb1.webp'),
                'url' => asset('games/2048_Game/2048-game.netlify.app/index.html')
            ],
            [
                'name' => 'Checkers Master',
                'thumbnail' => asset('assets/img/others/popular-game-thumb2.webp'),
                'url' => asset('games/Checkers_Master/checkers-master-game-buy.netlify.app/index.html')
            ],
            [
                'name' => 'Chess Empire Online',
                'thumbnail' => asset('assets/img/others/popular-game-thumb3.webp'),
                'url' => asset('games/Chess_Empire_Online/chess-empire-game.netlify.app/index.html')
            ],
            [
                'name' => 'Chicken Cross Road Casino',
                'thumbnail' => asset('assets/img/others/popular-game-thumb4.webp'),
                'url' => asset('games/Chicken_Cross_Road_Casino/chicken-cross-game.netlify.app/index.html')
            ],
            [
                'name' => 'Dimension Escape 3D',
                'thumbnail' => asset('assets/img/others/popular-game-thumb5.webp'),
                'url' => asset('games/Dimension_Escape_3D/dimension-escape.netlify.app/index.html')
            ],
            [
                'name' => 'Jewels Quest',
                'thumbnail' => asset('assets/img/others/popular-game-thumb6.webp'),
                'url' => asset('games/Jewels_Quest/jewelsquestup.netlify.app/index.html')
            ],
            [
                'name' => 'Knit Rescue',
                'thumbnail' => asset('assets/img/others/popular-game-thumb1.webp'),
                'url' => asset('games/Knit_Rescue/knit-rescue-c3p.netlify.app/index.html')
            ],
            [
                'name' => 'Lights Out Puzzle',
                'thumbnail' => asset('assets/img/others/popular-game-thumb2.webp'),
                'url' => asset('games/Lights_Out_Puzzle/lights-out-html5-game.netlify.app/index.html')
            ],
            [
                'name' => 'Math Quiz Addition & Subtraction',
                'thumbnail' => asset('assets/img/others/popular-game-thumb3.webp'),
                'url' => asset('games/Math_Quiz_Addition_&_Subtraction/math-quiz-challenge.netlify.app/index.html')
            ],
            [
                'name' => 'Neon Bounce Casino',
                'thumbnail' => asset('assets/img/others/popular-game-thumb4.webp'),
                'url' => asset('games/Neon_Bounce_Casino/neon-bounce-game.netlify.app/index.html')
            ],
            [
                'name' => 'Onet Animals',
                'thumbnail' => asset('assets/img/others/popular-game-thumb5.webp'),
                'url' => asset('games/Onet_Animals/onet-animals.netlify.app/index.html')
            ],
            [
                'name' => 'Panda Pop',
                'thumbnail' => asset('assets/img/others/popular-game-thumb6.webp'),
                'url' => asset('games/Panda_Pop/pandapopgameup.netlify.app/index.html')
            ],
            [
                'name' => 'Plinko Pro Casino',
                'thumbnail' => asset('assets/img/others/popular-game-thumb1.webp'),
                'url' => asset('games/Plinko_Pro_Casino/plinko-pro-game.netlify.app/index.html')
            ],
            [
                'name' => 'Rolling Ball 3D',
                'thumbnail' => asset('assets/img/others/popular-game-thumb2.webp'),
                'url' => asset('games/Rolling_Ball_3D/rollingball3d.netlify.app/index.html')
            ],
            [
                'name' => 'Sport Quest',
                'thumbnail' => asset('assets/img/others/popular-game-thumb3.webp'),
                'url' => asset('games/Sport_Quest/sport-quest.netlify.app/index.html')
            ],
            [
                'name' => 'Swiper Soccer 3D',
                'thumbnail' => asset('assets/img/others/popular-game-thumb4.webp'),
                'url' => asset('games/Swiper_Soccer_3D/swipesoccer-game.netlify.app/index.html')
            ],
            [
                'name' => 'Cloned Website',
                'thumbnail' => asset('assets/img/others/popular-game-thumb5.webp'),
                'url' => asset('games/cloned_website/index.html')
            ],
            [
                'name' => 'Taupe Faloodeh',
                'thumbnail' => asset('assets/img/others/popular-game-thumb6.webp'),
                'url' => asset('games/taupe-faloodeh-5a6a13.netlify.app/taupe-faloodeh-5a6a13.netlify.app/index.html')
            ]
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
                'name' => $game['name'],
                'image_url' => $game['thumbnail'],
                'external_url' => $game['url'],
                'description' => 'Popular Ethiopian game ' . ($index + 1) . ' from the 38-games-bundle collection.'
            ];
        }

        return view('home', compact('popularGames'));
    }

    public function showGame($id = null)
    {
        // Get the game details based on ID or show a default game
        $gameList = [
            1 => [
                'name' => '2048 Game',
                'description' => 'Classic puzzle game where you combine tiles with the same numbers to reach the 2048 tile.',
                'details' => 'The 2048 game is a math puzzle where players slide numbered tiles on a grid to combine them to create a tile with the number 2048. It is played on a 4×4 grid, with numbered tiles that slide smoothly when a player moves them using the four arrow keys.',
                'url' => asset('games/2048_Game/2048-game.netlify.app/index.html'),
                'image' => asset('assets/img/others/popular-game-thumb1.webp')
            ],
            2 => [
                'name' => 'Checkers Master',
                'description' => 'Traditional board game played between two players on an 8×8 checkerboard.',
                'details' => 'Checkers is a classic strategy game where players move their pieces diagonally across the board, capturing opponent pieces by jumping over them. The goal is to capture all of your opponent\'s pieces or block them so they cannot move.',
                'url' => asset('games/Checkers_Master/checkers-master-game-buy.netlify.app/index.html'),
                'image' => asset('assets/img/others/popular-game-thumb2.webp')
            ],
            3 => [
                'name' => 'Chess Empire Online',
                'description' => 'Strategic board game played between two players, simulating medieval warfare.',
                'details' => 'Chess is a recreational and competitive board game played between two players. It is sometimes called international or Western chess to distinguish it from related games such as xiangqi and shogi.',
                'url' => asset('games/Chess_Empire_Online/chess-empire-game.netlify.app/index.html'),
                'image' => asset('assets/img/others/popular-game-thumb3.webp')
            ],
            4 => [
                'name' => 'Chicken Cross Road Casino',
                'description' => 'Fun variation of the classic crossing game with casino elements.',
                'details' => 'Help the chicken cross the road while avoiding traffic and collecting coins. This game combines the classic gameplay with casino-style rewards and challenges.',
                'url' => asset('games/Chicken_Cross_Road_Casino/chicken-cross-game.netlify.app/index.html'),
                'image' => asset('assets/img/others/popular-game-thumb4.webp')
            ],
            5 => [
                'name' => 'Dimension Escape 3D',
                'description' => 'Immersive 3D puzzle game where you navigate through challenging levels.',
                'details' => 'Experience an immersive 3D adventure as you solve puzzles and navigate through challenging environments. This game offers stunning visuals and engaging gameplay mechanics.',
                'url' => asset('games/Dimension_Escape_3D/dimension-escape.netlify.app/index.html'),
                'image' => asset('assets/img/others/popular-game-thumb5.webp')
            ],
            6 => [
                'name' => 'Jewels Quest',
                'description' => 'Match-3 puzzle game with beautiful jewels and challenging levels.',
                'details' => 'Swap adjacent jewels to make sets of three or more of the same jewel. Complete objectives in each level while enjoying beautiful graphics and smooth gameplay.',
                'url' => asset('games/Jewels_Quest/jewelsquestup.netlify.app/index.html'),
                'image' => asset('assets/img/others/popular-game-thumb6.webp')
            ]
        ];

        // If no ID is provided or the ID doesn't exist, use the first game
        $game = $gameList[$id] ?? $gameList[1];

        return view('gamedetail', [
            'gameName' => $game['name'],
            'gameDescription' => $game['description'],
            'gameDetails' => $game['details'],
            'gameUrl' => $game['url']
        ]);
    }

    public function allGames()
    {
        // Create an array of all games to display on the games page
        $allGames = [];
        
        // Define all the games with their names, thumbnails, and local URLs
        $gameList = [
            [
                'name' => '2048 Game',
                'thumbnail' => asset('assets/img/others/popular-game-thumb1.webp'),
                'url' => asset('games/2048_Game/2048-game.netlify.app/index.html')
            ],
            [
                'name' => 'Checkers Master',
                'thumbnail' => asset('assets/img/others/popular-game-thumb2.webp'),
                'url' => asset('games/Checkers_Master/checkers-master-game-buy.netlify.app/index.html')
            ],
            [
                'name' => 'Chess Empire Online',
                'thumbnail' => asset('assets/img/others/popular-game-thumb3.webp'),
                'url' => asset('games/Chess_Empire_Online/chess-empire-game.netlify.app/index.html')
            ],
            [
                'name' => 'Chicken Cross Road Casino',
                'thumbnail' => asset('assets/img/others/popular-game-thumb4.webp'),
                'url' => asset('games/Chicken_Cross_Road_Casino/chicken-cross-game.netlify.app/index.html')
            ],
            [
                'name' => 'Dimension Escape 3D',
                'thumbnail' => asset('assets/img/others/popular-game-thumb5.webp'),
                'url' => asset('games/Dimension_Escape_3D/dimension-escape.netlify.app/index.html')
            ],
            [
                'name' => 'Jewels Quest',
                'thumbnail' => asset('assets/img/others/popular-game-thumb6.webp'),
                'url' => asset('games/Jewels_Quest/jewelsquestup.netlify.app/index.html')
            ],
            [
                'name' => 'Knit Rescue',
                'thumbnail' => asset('assets/img/others/popular-game-thumb1.webp'),
                'url' => asset('games/Knit_Rescue/knit-rescue-c3p.netlify.app/index.html')
            ],
            [
                'name' => 'Lights Out Puzzle',
                'thumbnail' => asset('assets/img/others/popular-game-thumb2.webp'),
                'url' => asset('games/Lights_Out_Puzzle/lights-out-html5-game.netlify.app/index.html')
            ],
            [
                'name' => 'Math Quiz Addition & Subtraction',
                'thumbnail' => asset('assets/img/others/popular-game-thumb3.webp'),
                'url' => asset('games/Math_Quiz_Addition_&_Subtraction/math-quiz-challenge.netlify.app/index.html')
            ],
            [
                'name' => 'Neon Bounce Casino',
                'thumbnail' => asset('assets/img/others/popular-game-thumb4.webp'),
                'url' => asset('games/Neon_Bounce_Casino/neon-bounce-game.netlify.app/index.html')
            ],
            [
                'name' => 'Onet Animals',
                'thumbnail' => asset('assets/img/others/popular-game-thumb5.webp'),
                'url' => asset('games/Onet_Animals/onet-animals.netlify.app/index.html')
            ],
            [
                'name' => 'Panda Pop',
                'thumbnail' => asset('assets/img/others/popular-game-thumb6.webp'),
                'url' => asset('games/Panda_Pop/pandapopgameup.netlify.app/index.html')
            ],
            [
                'name' => 'Plinko Pro Casino',
                'thumbnail' => asset('assets/img/others/popular-game-thumb1.webp'),
                'url' => asset('games/Plinko_Pro_Casino/plinko-pro-game.netlify.app/index.html')
            ],
            [
                'name' => 'Rolling Ball 3D',
                'thumbnail' => asset('assets/img/others/popular-game-thumb2.webp'),
                'url' => asset('games/Rolling_Ball_3D/rollingball3d.netlify.app/index.html')
            ],
            [
                'name' => 'Sport Quest',
                'thumbnail' => asset('assets/img/others/popular-game-thumb3.webp'),
                'url' => asset('games/Sport_Quest/sport-quest.netlify.app/index.html')
            ],
            [
                'name' => 'Swiper Soccer 3D',
                'thumbnail' => asset('assets/img/others/popular-game-thumb4.webp'),
                'url' => asset('games/Swiper_Soccer_3D/swipesoccer-game.netlify.app/index.html')
            ],
            [
                'name' => 'Cloned Website',
                'thumbnail' => asset('assets/img/others/popular-game-thumb5.webp'),
                'url' => asset('games/cloned_website/index.html')
            ],
            [
                'name' => 'Taupe Faloodeh',
                'thumbnail' => asset('assets/img/others/popular-game-thumb6.webp'),
                'url' => asset('games/taupe-faloodeh-5a6a13.netlify.app/taupe-faloodeh-5a6a13.netlify.app/index.html')
            ]
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