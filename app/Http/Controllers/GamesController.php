<?php
namespace App\Http\Controllers;

class GamesController extends Controller
{
    private function gameList(): array
    {
        return [
            [
                'slug'        => 'archers_ragdoll',
                'name'        => 'Archers Ragdoll Physics',
                'thumbnail'   => asset('games/other/arrow.png'),
                'url'         => 'https://neplingamestudio.github.io/Archers-Ragdoll-Physic/',
                'description' => 'A physics-based archery action game where players battle using ragdoll characters.',
                'details'     => 'Archers Ragdoll Physics is an entertaining game where you control an archer and shoot arrows at targets. The game features ragdoll physics, making it both challenging and amusing. Players can unlock 10 different characters and 12 unique arrows, including fire, poison, and rocket effects, while navigating environmental traps like electric cables and spinning gears.',
            ],
            [
                'slug'        => 'cross_math',
                'name'        => 'Cross Math Link',
                'thumbnail'   => asset('games/cross math/image.png'),
                'url'         => 'https://toolsorcerer.com/codecanyon/cross_math_link/index.html',
                'description' => 'A brain-teasing puzzle where you connect numbers and operators to solve mathematical equations.',
                'details'     => 'Cross Math Link is a challenging puzzle game that tests your math skills and strategic thinking. Connect numbers in a grid to reach the target sum while avoiding obstacles and maximizing your score.',
            ],
            [
                'slug'        => 'car_rush',
                'name'        => 'Car Rush',
                'thumbnail'   => asset('games/car_rush/sprites/200x200.png'),
                'url'         => asset('games/car_rush/index.html'),
                'description' => 'High-speed highway action! Weave through traffic, avoid crashes, and push your engine to the limit.',
                'details'     => 'Car Rush is a thrilling endless runner game that puts your reflexes to the test. Control your car as it speeds down the highway, dodging traffic and obstacles to achieve the highest score possible.',
            ],
            [
                'slug'        => 'cricket_maths',
                'name'        => 'Cricket Maths',
                'thumbnail'   => 'https://market-resized.envatousercontent.com/previews/files/657803006/CodeCanyon_590x300.jpg?w=590&h=300&cf_fit=crop&crop=top&format=auto&q=85&s=8256b291dbae6f8f90ccb4960460d58ff251e002a05d2c5d45421326246edcae',
                'url'         => 'https://wandermindlabs.com/H5Games/CodeCanyon/CricketMaths/',
                'description' => 'Combine the excitement of cricket with mental arithmetic. Solve quick math problems to score runs.',
                'details'     => 'Cricket Maths is a fun and interactive game that helps players improve their math skills while enjoying a cricket-themed gaming experience. Solve math problems to score runs and win matches against opponents.',
            ],
            [
                'slug'        => 'math_quiz',
                'name'        => 'Math Quiz Addition & Subtraction',
                'thumbnail'   => asset('games/Math_Quiz_Addition_&_Subtraction/math-quiz-challenge.netlify.app/assets/math.png'),
                'url'         => asset('games/Math_Quiz_Addition_&_Subtraction/math-quiz-challenge.netlify.app/index.html'),
                'description' => 'A fast-paced educational challenge. Test your speed and accuracy across various math categories.',
                'details'     => 'Test your math skills with this fun quiz game. Answer addition and subtraction problems as quickly as possible to earn points and improve your score in a race against the clock.',
            ],
            [
                'slug'        => 'spider_solitaire',
                'name'        => 'Spider Solitaire',
                'thumbnail'   => asset('games/Spider_Solitaire/images/image copy 2.png'),
                'url'         => asset('games/Spider_Solitaire/index.html'),
                'description' => 'The challenging version of the classic card game. Organize four suits and clear the board.',
                'details'     => 'Spider Solitaire is a challenging card game where you build sequences from King to Ace. Remove all cards from the tableau to win the game, requiring patience and careful strategy.',
            ],
            [
                'slug'        => 'rocket_bot',
                'name'        => 'Rocket Bot',
                'thumbnail'   => asset('games/RocketBot/rocketbot.png'),
                'url'         => 'https://65ec9259899e16c3586e2681--superb-syrniki-9420d9.netlify.app/',
                'description' => 'Pilot a high-tech robot through challenging obstacle courses. Use boosters and precision movement.',
                'details'     => 'Control your rocket-powered bot and navigate through challenging levels. Collect power-ups and avoid obstacles to achieve the highest score in this high-tech flight experience.',
            ],
            [
                'slug'        => 'royal_snooker',
                'name'        => 'Royal Snooker Championship',
                'thumbnail'   => asset('games/royal-snooker-championship/assets/images/image.png'),
                'url'         => asset('games/royal-snooker-championship/index.html'),
                'description' => 'Experience the prestige of professional snooker. Use precise cue control and strategic potting.',
                'details'     => 'Play the traditional snooker game with a royal twist. Score points by potting balls and try to win the championship by mastering precise cue control and strategic play.',
            ],
            [
                'slug'        => 'tripeaks',
                'name'        => 'Tripeaks Solitaire',
                'thumbnail'   => asset('games/Tripeaks/icons/image.png'),
                'url'         => asset('games/Tripeaks/index.html'),
                'description' => 'A fast-paced solitaire variant. Clear the three peaks of cards by matching them to the waste pile.',
                'details'     => 'Tripeaks Solitaire is a fun and addictive card game where you clear the board by selecting cards that are one rank higher or lower than the current card. Clear all cards to win the game.',
            ],
            [
                'slug'        => 'basketball_mania',
                'name'        => 'Basketball Mania',
                'thumbnail'   => asset('games/game34-basketball_mania/icons/image.png'),
                'url'         => asset('games/game34-basketball_mania/index.html'),
                'description' => 'Step onto the court and show off your skills. Aim for the perfect arc and sink three-pointers.',
                'details'     => 'Basketball Mania is a fast-paced basketball game where you shoot hoops and score points. Compete against the clock and aim for the highest score possible with your best shots.',
            ],
            [
                'slug'        => 'swiper_soccer',
                'name'        => 'Swiper Soccer 3D',
                'thumbnail'   => asset('games/Swiper_Soccer_3D/swipesoccer-game.netlify.app/soccer.png'),
                'url'         => 'https://swipesoccer-game.netlify.app/',
                'description' => 'A unique twist on football. Swipe to curve the ball around defenders and score goals.',
                'details'     => 'Swiper Soccer 3D is an engaging 3D soccer game where you control your player with swipe gestures. Score goals and win matches in this fun and addictive game set in a 3D arena.',
            ],
            [
                'slug'        => 'ball_master',
                'name'        => 'Ball Master',
                'thumbnail'   => asset('games/Ball Master/ballmaster.png'),
                'url'         => 'https://ballmastergame.netlify.app/',
                'description' => 'A physics-based skill game. Navigate a ball through intricate levels using gravity and timing.',
                'details'     => 'Roll the ball through the levels, avoiding obstacles and collecting coins. This game offers a fun and engaging experience with beautiful graphics and smooth gameplay.',
            ],
            [
                'slug'        => 'gun_bullets',
                'name'        => 'Gun Bullets',
                'thumbnail'   => asset('games/other/gb.png'),
                'url'         => 'https://65eeee920045e641ae6f0c76--pocu.netlify.app/',
                'description' => 'A precision shooting gallery. Test your reflexes and aim by hitting moving targets.',
                'details'     => 'Gun Bullets is an exciting shooting game that challenges your aim and reflexes. Shoot targets as they appear on the screen and try to achieve the highest score possible.',
            ],
            [
                'slug'        => 'checkers_master',
                'name'        => 'Checkers Master',
                'thumbnail'   => asset('games/Checkers_Master/checkers-master-game-buy.netlify.app/img/logo.png'),
                'url'         => asset('games/Checkers_Master/checkers-master-game-buy.netlify.app/index.html'),
                'description' => 'The timeless game of strategy. Outsmart your opponent by capturing their pieces.',
                'details'     => 'Checkers is a classic strategy game where players move their pieces diagonally across the board, capturing opponent pieces by jumping over them. The goal is to capture all of your opponent\'s pieces or block them.',
            ],
            [
                'slug'        => 'dimension_escape',
                'name'        => 'Dimension Escape 3D',
                'thumbnail'   => asset('games/Dimension_Escape_3D/dimension-escape.netlify.app/assets/main.avif'),
                'url'         => asset('games/Dimension_Escape_3D/dimension-escape.netlify.app/index.html'),
                'description' => 'A mind-bending puzzle-platformer. Navigate through shifting dimensions to find the exit.',
                'details'     => 'Experience an immersive 3D adventure as you solve puzzles and navigate through challenging environments. This game offers stunning visuals and engaging gameplay mechanics across shifting dimensions.',
            ],
            [
                'slug'        => 'jewels_quest',
                'name'        => 'Jewels Quest',
                'thumbnail'   => asset('games/Jewels_Quest/jewelsquestup.netlify.app/assets/jewels.png'),
                'url'         => 'https://jewelsquestup.netlify.app/',
                'description' => 'A classic match-3 adventure. Swap glittering gems to create combos and clear the board.',
                'details'     => 'Swap adjacent jewels to make sets of three or more of the same jewel. Complete objectives in each level while enjoying beautiful graphics and smooth gameplay.',
            ],
            [
                'slug'        => 'plinko',
                'name'        => 'Plinko Pro Casino',
                'thumbnail'   => asset('games/Plinko_Pro_Casino/plinko-pro-game.netlify.app/plinko.jpg'),
                'url'         => asset('games/Plinko_Pro_Casino/plinko-pro-game.netlify.app/index.html'),
                'description' => 'The thrill of the arcade! Drop the ball and watch it bounce through the pegs for a prize.',
                'details'     => 'Drop chips and watch them bounce off pegs in this classic Plinko game. Win prizes based on where your chip lands at the bottom of the board in this high-stakes arcade experience.',
            ],
            [
                'slug'        => 'park_your_car',
                'name'        => 'Park Your Car',
                'thumbnail'   => asset('games/park_your_car/sprites/200x200.jpg'),
                'url'         => asset('games/park_your_car/index.html'),
                'description' => 'A logic-based parking puzzle. Carefully maneuver your vehicle into tight spots.',
                'details'     => 'Drive your car around the parking lot and park it in the correct spots. Complete levels with the fewest moves possible while avoiding all obstacles.',
            ],
            [
                'slug'        => 'neon_bounce',
                'name'        => 'Neon Bounce Casino',
                'thumbnail'   => asset('games/Neon_Bounce_Casino/neon-bounce-game.netlify.app/neonbounce.png'),
                'url'         => asset('games/Neon_Bounce_Casino/neon-bounce-game.netlify.app/index.html'),
                'description' => 'A vibrant, neon-themed arcade experience. Bounce your way to big wins in this high-energy game.',
                'details'     => 'Control the bouncing ball through challenging obstacles in this visually striking neon-themed game. Avoid obstacles and collect power-ups to achieve high scores.',
            ],
            [
                'slug'        => 'onet_animals',
                'name'        => 'Onet Animals',
                'thumbnail'   => asset('games/Onet_Animals/onet-animals.netlify.app/img/game_title.png'),
                'url'         => 'https://onet-animals.netlify.app/',
                'description' => 'A relaxing tile-matching game. Find and connect pairs of identical cute animals.',
                'details'     => 'Find and connect pairs of matching animal tiles to remove them from the board. Clear all tiles to advance to the next level in this fun and relaxing puzzle game.',
            ],
            [
                'slug'        => 'rolling_ball',
                'name'        => 'Rolling Ball 3D',
                'thumbnail'   => asset('games/Rolling_Ball_3D/rollingball3d.netlify.app/img/rb.png'),
                'url'         => 'https://rollingball3d.netlify.app/',
                'description' => 'Challenging 3D maze game where you roll a ball to the exit by tilting the platform.',
                'details'     => 'Navigate the rolling ball through complex 3D mazes by tilting the platform. Avoid obstacles and reach the finish line in this physics-based puzzle game.',
            ],
            [
                'slug'        => 'sport_quest',
                'name'        => 'Sport Quest',
                'thumbnail'   => asset('games/Sport_Quest/sport-quest.netlify.app/assets/Sport Quest.png'),
                'url'         => 'https://sport-quest.netlify.app/',
                'description' => 'A multi-sport challenge. Compete in various athletic events to prove you are the ultimate athlete.',
                'details'     => 'Participate in various sports challenges and competitions in this diverse sports game. Test your skills in different athletic events and aim for the highest scores.',
            ],
            [
                'slug'        => 'bubble_shooter',
                'name'        => 'Bubble Shooter',
                'thumbnail'   => asset('games/other/bs.png'),
                'url'         => 'https://bubble-shoots.netlify.app/',
                'description' => 'The timeless classic! Aim and blast colorful bubbles to clear the screen.',
                'details'     => 'Shoot bubbles to match colors and clear the board in this vibrant bubble shooter game. Complete levels with the fewest shots possible.',
            ],
            [
                'slug'        => 'pet_crush',
                'name'        => 'Pet Crush',
                'thumbnail'   => asset('games/other/pc.png'),
                'url'         => 'https://pet-crush.netlify.app/',
                'description' => 'A colorful puzzle game where you match adorable pets to create explosive combos.',
                'details'     => 'Match three or more pets of the same type to clear them from the board in this delightful puzzle game. Complete levels with the fewest moves possible.',
            ],
            [
                'slug'        => 'pinball',
                'name'        => 'PinBall',
                'thumbnail'   => asset('games/other/extremepinball_bg.jpg'),
                'url'         => 'https://skinfosky.com/apps/html/pinball/',
                'description' => 'Classic arcade action. Use the flippers to keep the ball in play and chase the high score.',
                'details'     => 'PinBall is a nostalgic take on the classic pinball experience, featuring vibrant graphics and smooth gameplay. Test your skills as you aim to score the highest points possible.',
            ],
            [
                'slug'        => 'color_ball',
                'name'        => 'Color Ball Game',
                'thumbnail'   => asset('games/other/collor-ball.png'),
                'url'         => 'https://lukedev2.github.io/ColorBallGame/',
                'description' => 'A minimalist puzzle of colors. Match and merge balls of the same hue to unlock new levels.',
                'details'     => 'An engaging game where you control a ball that changes color. Collect the three stars and avoid the obstacles to advance to the next level.',
            ],
            [
                'slug'        => 'dron_rush',
                'name'        => 'Dron Rush',
                'thumbnail'   => asset('games/other/drone.png'),
                'url'         => 'https://neon-drone-rush.vercel.app/',
                'description' => 'Take to the skies in a high-speed drone race. Navigate tight corridors and avoid obstacles.',
                'details'     => 'Dron Rush is a thrilling drone racing game that combines fast-paced action with stunning neon visuals. Navigate through challenging courses, avoid obstacles, and compete for the best times.',
            ],
            [
                'slug'        => 'urban_ball_run',
                'name'        => 'Urban Ball Run',
                'thumbnail'   => asset('games/other/urban.png'),
                'url'         => asset('games/urban-ball-run/index.html'),
                'description' => 'Control a rolling sphere through a concrete jungle. Balance speed and precision.',
                'details'     => 'Urban Ball Run is an exciting game where you control a ball rolling through the streets of a vibrant city. Avoid obstacles, collect coins, and try to achieve the highest score possible.',
            ],
            [
                'slug'        => 'road_rush',
                'name'        => 'Road Rush Racer',
                'thumbnail'   => asset('games/other/race.png'),
                'url'         => 'https://road-rush-racer.vercel.app/',
                'description' => 'A gritty street racing game. Outrun your rivals and master the art of drifting.',
                'details'     => 'Road Rush Racer is an adrenaline-pumping racing game where you control a car speeding through busy streets. Avoid collisions, overtake other vehicles, and strive to achieve the fastest time.',
            ],
            [
                'slug'        => 'aryas_adventure',
                'name'        => "Arya's Adventure",
                'thumbnail'   => asset('games/other/thumb11.jpg'),
                'url'         => 'https://taupe-faloodeh-5a6a13.netlify.app/',
                'description' => 'Join Arya on an epic journey through a whimsical world. Solve puzzles and overcome challenges.',
                'details'     => 'Embark on a thrilling journey with Arya as you explore mystical lands, solve puzzles, and battle enemies in this action-packed adventure game. Uncover secrets and become a hero.',
            ],
        ];
    }

    /** Resolve localized fields for a game using its slug key. */
    private function localize(array $game): array
    {
        $slug = $game['slug'];
        $game['name']        = trans("games.{$slug}.name")        !== "games.{$slug}.name"        ? trans("games.{$slug}.name")        : $game['name'];
        $game['description'] = trans("games.{$slug}.description") !== "games.{$slug}.description" ? trans("games.{$slug}.description") : $game['description'];
        $game['details']     = trans("games.{$slug}.details")     !== "games.{$slug}.details"     ? trans("games.{$slug}.details")     : $game['details'];
        return $game;
    }

    public function home()
    {
        $popularGames = array_map(
            fn($g) => array_merge($this->localize($g), ['image_url' => $g['thumbnail']]),
            array_slice($this->gameList(), 0, 30)
        );

        return view('home', compact('popularGames'));
    }

    public function showGame($id = null)
    {
        $allGames  = $this->gameList();
        $gameIndex = max(0, min(($id ?? 1) - 1, count($allGames) - 1));
        $game      = $this->localize($allGames[$gameIndex]);

        return view('gamedetail', [
            'gameName'        => $game['name'],
            'gameDescription' => $game['description'],
            'gameDetails'     => $game['details'],
            'gameUrl'         => $game['url'],
        ]);
    }

    public function allGames()
    {
        $allGames = array_map([$this, 'localize'], array_slice($this->gameList(), 0, 30));

        return view('allgames', compact('allGames'));
    }
}
