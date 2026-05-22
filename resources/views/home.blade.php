@extends('layouts.app')

@section('styles')
<style>
    .game-card {
        position: relative;
        border-radius: 14px;
        overflow: hidden;
        margin-bottom: 24px;
        background: #0a0a14;
        transition: transform 0.3s cubic-bezier(.25,.8,.25,1), box-shadow 0.3s ease;
        box-shadow: 0 2px 12px rgba(0,0,0,0.5);
    }

    .game-card:hover {
        transform: translateY(-8px) scale(1.02);
        box-shadow: 0 20px 45px rgba(0,0,0,0.7), 0 0 0 1.5px rgba(232,25,44,0.5);
        z-index: 2;
    }

    .game-card-img-wrap { overflow: hidden; line-height: 0; }

    .game-card img {
        width: 100%;
        aspect-ratio: 16/10;
        object-fit: cover;
        display: block;
        transition: transform 0.45s ease;
    }

    .game-card:hover img { transform: scale(1.1); }

    .game-card-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(to top,
            rgba(5,5,18,0.97) 0%,
            rgba(5,5,18,0.45) 40%,
            transparent 70%
        );
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        padding: 14px 12px 12px;
    }

    .game-card-name {
        color: #f0f0f0;
        font-size: 0.82rem;
        font-weight: 700;
        margin: 0 0 8px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-shadow: 0 1px 6px rgba(0,0,0,0.9);
    }

    .game-card-play {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        background: linear-gradient(135deg, #e8192c 0%, #ff4e2a 100%);
        color: #fff;
        font-size: 0.65rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 1.2px;
        padding: 5px 13px;
        border-radius: 20px;
        text-decoration: none;
        align-self: flex-start;
        opacity: 0;
        transform: translateY(6px);
        transition: opacity 0.2s ease, transform 0.2s ease;
        box-shadow: 0 3px 12px rgba(232,25,44,0.5);
    }

    .game-card:hover .game-card-play {
        opacity: 1;
        transform: translateY(0);
    }

    .game-card-num {
        position: absolute;
        top: 8px;
        right: 9px;
        background: rgba(0,0,0,0.55);
        backdrop-filter: blur(4px);
        color: rgba(255,255,255,0.75);
        font-size: 0.6rem;
        font-weight: 700;
        padding: 2px 7px;
        border-radius: 10px;
        letter-spacing: 0.5px;
    }
</style>
@endsection

@section('content')
  
  

    <!-- page wrapper start -->
    <div class="page_wrapper">

        <!--slide banner section start-->
        <section class="hero_banner_section d-flex align-items-center mb-130" data-bgimg="{{ asset('assets/img/bg/hero-bg1.webp') }}">
            <div class="container">
                <div class="hero_banner_inner">
                    <div class="row align-items-center">
                        <div class="col-12">
                            <div class="hero_content">
                                <h1 class="wow fadeInUp" data-wow-delay="0.1s" data-wow-duration="1.1s">{!! __('messages.hero_title') !!}</h1>
                                <p class="wow fadeInUp" data-wow-delay="0.2s" data-wow-duration="1.2s">{{ __('messages.hero_desc') }}</p>
                                <a class="btn btn-link wow fadeInUp" data-wow-delay="0.3s" data-wow-duration="1.3s" href="/all-games">{{ __('messages.play_now') }} <img width="20" height="20" src="{{ asset('assets/img/icon/arrrow-icon.webp') }}" alt=""> </a>
                            </div>
                        </div>
                    </div>
                </div>    
            </div>
            <div class="hero_position_img">
                <img width="926" height="772" src="{{ asset('assets/img/bg/hero-position-img.webp') }}" alt="Ethiopian gamers playing together">
            </div>
        </section>
        <!--slider area end-->

        <!-- counterup section start -->
        {{-- <section class="gaming_world_section mb-140">
            <div class="container">
                <div class="section_title text-center wow fadeInUp mb-60" data-wow-delay="0.1s" data-wow-duration="1.1s">
                    <h2>WELCOME TO <br>
                        SHEGGERGAMES.</h2>
                </div>
                <div class="gaming_world_inner">
                    <div class="row">
                        <div class="col-lg-4 col-md-4 col-sm-6">
                            <div class="single_gaming_world wow fadeInUp" data-bgimg="{{ asset('assets/img/others/gaming-world-bg1.webp') }}" data-wow-delay="0.1s" data-wow-duration="1.1s">
                                <div class="gaming_world_thumb">
                                    <img width="141" height="157" src="{{ asset('assets/img/others/gaming-world1.webp') }}" alt="Ethiopian gamers streaming">
                                </div>
                                <div class="gaming_world_text">
                                    <h3>Ethiopian Live Streams</h3>
                                    <p>Watch your favorite Ethiopian gamers stream the latest games and tournaments on SheggerGames.</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-4 col-md-4 col-sm-6">
                            <div class="single_gaming_world wow fadeInUp" data-bgimg="{{ asset('assets/img/others/gaming-world-bg2.webp') }}" data-wow-delay="0.2s" data-wow-duration="1.2s">
                                <div class="gaming_world_thumb">
                                    <img width="156" height="157" src="{{ asset('assets/img/others/gaming-world2.webp') }}" alt="Gaming news from Ethiopia">
                                </div>
                                <div class="gaming_world_text">
                                    <h3>Gaming News</h3>
                                    <p>Stay updated with the latest gaming news from Ethiopia and around the world, curated for our community.</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-4 col-md-4 col-sm-6">
                            <div class="single_gaming_world wow fadeInUp" data-bgimg="{{ asset('assets/img/others/gaming-world-bg3.webp') }}" data-wow-delay="0.3s" data-wow-duration="1.3s">
                                <div class="gaming_world_thumb">
                                    <img width="151" height="156" src="{{ asset('assets/img/others/gaming-world3.webp') }}" alt="Ethiopian gaming tournaments">
                                </div>
                                <div class="gaming_world_text">
                                    <h3>Tournaments</h3>
                                    <p>Compete in exciting tournaments featuring Ethiopian gamers from across the country and diaspora.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section> --}}
        <!-- gaming  world section end -->

        <!-- gaming video section start -->
        {{-- <section class="gaming_video_section mb-118 wow fadeInUp" data-wow-delay="0.1s" data-wow-duration="1.1s">
            <div class="container">
                <div class="row">
                    <div class="col-12">
                        <div class="gaming_video_inner slick_navigation slick__activation" data-slick='{
                            "slidesToShow": 1,
                            "slidesToScroll": 1,
                            "arrows": true,
                            "dots": false,
                            "autoplay": false,
                            "speed": 300,
                            "infinite": true ,  
                            "responsive":[ 
                            {"breakpoint":500, "settings": { "slidesToShow": 1 } }  
                            ]                                                     
                        }'>
                            <div class="gaming_video_thumb">
                                <img width="1170" height="540" src="{{ asset('assets/img/bg/gaming-bg1.webp') }}" alt="Ethiopian gamers in action">
                                <div class="gaming_video_paly_icon">
                                    <a class="video_popup" href="https://www.youtube.com/watch?v=eS9Qm4AOOBY"><img width="134" height="140" src="{{ asset('assets/img/others/play-btn.webp') }}" alt="Play video"></a>
                                </div>
                                <div class="live_streaming_text">
                                    <h3>Watch Ethiopian Gamers</h3>
                                </div>
                            </div>
                            <div class="gaming_video_thumb">
                                <img width="1170" height="540" src="{{ asset('assets/img/bg/gaming-bg1.webp') }}" alt="SheggerGames tournament highlights">
                                <div class="gaming_video_paly_icon">
                                    <a class="video_popup" href="https://www.youtube.com/watch?v=eS9Qm4AOOBY"><img width="134" height="140" src="{{ asset('assets/img/others/play-btn.webp') }}" alt="Play video"></a>
                                </div>
                                <div class="live_streaming_text">
                                    <h3>Tournament Highlights</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section> --}}
        <!-- gaming video section end -->

        <!-- upcoming gaming section start -->
        {{-- <section class="upcoming_gaming_section mb-125">
            <div class="container">
                <div class="section_title text-center wow fadeInUp mb-60" data-wow-delay="0.1s" data-wow-duration="1.1s">
                    <h2>Upcoming Ethiopian Tournaments</h2>
                    <p>Join the most exciting gaming tournaments happening across Ethiopia <br>
                        on SheggerGames platform.</p>
                </div>
                <div class="upcoming_gaming_inner">
                    <div class="upcoming_gaming_list wow fadeInUp d-flex justify-content-between align-items-center mb-30" data-wow-delay="0.1s" data-wow-duration="1.1s">
                        <div class="upcoming_gaming_text">
                            <p>20 August 2021  -  09:00 PM</p>
                            <h3><a href="match-details.html">Roar Spring Game 2021</a></h3>
                            <span>08 Teams Registered</span>
                        </div>
                        <div class="upcoming_play_video text-center">
                            <a class="video_popup" href="https://www.youtube.com/watch?v=eS9Qm4AOOBY"><img width="53" height="44" src="assets/img/others/play-btn2.webp" alt=""></a> <br>
                            <span>Live Stream</span>
                        </div>
                        <div class="upcoming_gaming_thumb d-flex align-items-center">
                            <div class="single_upcoming_thumb">
                                <img width="97" height="119" src="assets/img/others/upcoming-game-thumb1.webp" alt="">
                            </div>
                            <div class="single_upcoming_thumb">
                                <img width="87" height="87" src="assets/img/others/game-vs1.webp" alt="">
                            </div>
                            <div class="single_upcoming_thumb">
                                <img width="93" height="120" src="assets/img/others/upcoming-game-thumb2.webp" alt="">
                            </div>
                        </div>
                    </div> 
                    <div class="upcoming_gaming_list wow fadeInUp d-flex justify-content-between align-items-center mb-30" data-wow-delay="0.2s" data-wow-duration="1.2s">
                        <div class="upcoming_gaming_text">
                            <p>20 August 2021  -  09:00 PM</p>
                            <h3><a href="match-details.html">Skrit tournament 2021</a></h3>
                            <span>08 Teams Registered</span>
                        </div>
                        <div class="upcoming_play_video text-center">
                            <a class="video_popup" href="https://www.youtube.com/watch?v=eS9Qm4AOOBY"><img width="53" height="44" src="assets/img/others/play-btn2.webp" alt=""></a> <br>
                            <span>Youtube Stream</span>
                        </div>
                        <div class="upcoming_gaming_thumb d-flex align-items-center">
                            <div class="single_upcoming_thumb">
                                <img width="102" height="119" src="assets/img/others/upcoming-game-thumb3.webp" alt="">
                            </div>
                            <div class="single_upcoming_thumb">
                                <img width="87" height="87" src="assets/img/others/game-vs2.webp" alt="">
                            </div>
                            <div class="single_upcoming_thumb">
                                <img width="105" height="119" src="assets/img/others/upcoming-game-thumb4.webp" alt="">
                            </div>
                        </div>
                    </div> 
                    <div class="upcoming_gaming_list wow fadeInUp d-flex justify-content-between align-items-center" data-wow-delay="0.3s" data-wow-duration="1.3s">
                        <div class="upcoming_gaming_text">
                            <p>20 August 2021  -  09:00 PM</p>
                            <h3><a href="match-details.html">Ninja 360 Game 2021</a></h3>
                            <span>08 Teams Registered</span>
                        </div>
                        <div class="upcoming_play_video text-center">
                            <a class="video_popup" href="https://www.youtube.com/watch?v=eS9Qm4AOOBY"><img width="53" height="44" src="assets/img/others/play-btn2.webp" alt=""></a> <br>
                            <span>Twitch Stream</span>
                        </div>
                        <div class="upcoming_gaming_thumb d-flex align-items-center">
                            <div class="single_upcoming_thumb">
                                <img width="118" height="119" src="assets/img/others/upcoming-game-thumb5.webp" alt="">
                            </div>
                            <div class="single_upcoming_thumb">
                                <img width="87" height="87" src="assets/img/others/game-vs3.webp" alt="">
                            </div>
                            <div class="single_upcoming_thumb">
                                <img width="100" height="119" src="assets/img/others/upcoming-game-thumb6.webp" alt="">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="others_match_btn text-center">
                    <a class="btn btn-link" href="match.html">Other’s Match </a>
                </div>
            </div>
        </section> --}}
        <!-- upcoming gaming section end -->

        <!-- counterup section start -->
        <section class="counterup_section mb-115 wow fadeInUp" data-wow-delay="0.1s" data-wow-duration="1.1s">
            <div class="container">
                <div class="row">
                    <div class="col-12">
                        <div class="counterup_inner d-flex justify-content-center">
                            <div class="single_counterup one">
                                <div class="counterup_text">
                                    <h2 class="counterup color1">30</h2> 
                                    <span>{{ __('messages.stat_games') }}</span>
                                </div>
                            </div>
                            <div class="single_counterup two">
                                <div class="counterup_text">
                                    <h2 class="counterup color2">12</h2>
                                    <span>{{ __('messages.stat_local') }}</span>
                                </div>
                            </div>
                            <div class="single_counterup three">
                                <div class="counterup_text">
                                    <h2 class="counterup color3">1240</h2>
                                    <span>{{ __('messages.stat_played') }}</span>
                                </div>
                            </div>
                            <div class="single_counterup four">
                                <div class="counterup_text">
                                    <h2 class="counterup color4">689</h2>
                                    <span>{{ __('messages.stat_gamers') }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <!-- counterup section end -->

        <!-- about section start -->
        <section class="mb-140">
            <div class="container">
                <div class="row align-items-center g-5">
                    <div class="col-lg-6 wow fadeInLeft" data-wow-delay="0.1s" data-wow-duration="1.1s">
                        <div class="section_title mb-30">
                            <h2 style="font-size:2rem; line-height:1.3;">{{ __('messages.about_heading') }}</h2>
                            <p class="mt-20" style="color:#b0b0c0; line-height:1.8;">{{ __('messages.about_desc') }}</p>
                            <a class="btn btn-link mt-30 d-inline-flex align-items-center gap-2" href="/all-games">
                                {{ __('messages.play_now') }} 
                            </a>
                        </div>
                    </div>
                    <div class="col-lg-6 wow fadeInRight" data-wow-delay="0.2s" data-wow-duration="1.2s">
                        <div class="row g-3">
                            @foreach([
                                ['icon'=>'🎮', 'title'=>__('messages.feature_variety_title'), 'desc'=>__('messages.feature_variety_desc')],
                                ['icon'=>'🔑', 'title'=>__('messages.feature_free_title'),    'desc'=>__('messages.feature_free_desc')],
                                ['icon'=>'⚡', 'title'=>__('messages.feature_instant_title'), 'desc'=>__('messages.feature_instant_desc')],
                                ['icon'=>'🌍', 'title'=>__('messages.feature_local_title'),   'desc'=>__('messages.feature_local_desc')],
                            ] as $f)
                            <div class="col-6">
                                <div style="background:#0d0d1f; border:1px solid rgba(232,25,44,0.2); border-radius:12px; padding:20px 16px;">
                                    <div style="font-size:1.8rem; margin-bottom:10px;">{{ $f['icon'] }}</div>
                                    <h5 style="color:#fff; font-size:0.9rem; font-weight:700; margin-bottom:6px;">{{ $f['title'] }}</h5>
                                    <p style="color:#8888a0; font-size:0.78rem; margin:0; line-height:1.6;">{{ $f['desc'] }}</p>
                                </div>
                            </div>
                            @endforeach
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <!-- about section end -->
       <!-- how it works section start -->
        <section class="mb-140 wow fadeInUp" data-wow-delay="0.1s" data-wow-duration="1.1s">
            <div style="background: linear-gradient(135deg, #0d0d1f 0%, #12001a 100%); border-top: 1px solid rgba(232,25,44,0.2); border-bottom: 1px solid rgba(232,25,44,0.2); padding: 70px 0;">
                <div class="container">
                    <div class="section_title text-center mb-60">
                        <h2>{{ __('messages.how_title') }}</h2>
                        <p style="color:#8888a0;">{{ __('messages.how_subtitle') }}</p>
                    </div>
                    <div class="row g-4 justify-content-center">
                        @foreach([
                            ['step'=>'01', 'title'=>__('messages.how_step1_title'), 'desc'=>__('messages.how_step1_desc'), 'icon'=>'📱'],
                            ['step'=>'02', 'title'=>__('messages.how_step2_title'), 'desc'=>__('messages.how_step2_desc'), 'icon'=>'🔐'],
                            ['step'=>'03', 'title'=>__('messages.how_step3_title'), 'desc'=>__('messages.how_step3_desc'), 'icon'=>'🎮'],
                        ] as $s)
                        <div class="col-lg-4 col-md-6 text-center">
                            <div style="position:relative; padding: 36px 28px; background: rgba(255,255,255,0.03); border: 1px solid rgba(232,25,44,0.15); border-radius: 16px; height:100%;">
                                <div style="position:absolute; top:-18px; left:50%; transform:translateX(-50%); background:linear-gradient(135deg,#e8192c,#ff4e2a); color:#fff; font-size:0.7rem; font-weight:900; letter-spacing:2px; padding:4px 16px; border-radius:20px;">
                                    {{ $s['step'] }}
                                </div>
                                <div style="font-size:2.5rem; margin: 16px 0 14px;">{{ $s['icon'] }}</div>
                                <h4 style="color:#fff; font-weight:700; margin-bottom:10px; font-size:1rem;">{{ $s['title'] }}</h4>
                                <p style="color:#8888a0; font-size:0.82rem; line-height:1.7; margin:0;">{{ $s['desc'] }}</p>
                            </div>
                        </div>
                        @endforeach
                    </div>
                    <div class="text-center mt-50">
                        <a class="btn btn-link" href="/all-games">{{ __('messages.play_now') }} <img width="18" height="18" src="{{ asset('assets/img/icon/arrrow-icon.webp') }}" alt=""></a>
                    </div>
                </div>
            </div>
        </section>
        <!-- how it works section end -->

        <!-- popular gaming  section start -->
        <section class="popular_gaming_section mb-140">
            <div class="container">
                <div class="section_title text-center wow fadeInUp mb-60" data-wow-delay="0.1s" data-wow-duration="1.1s">
                    <h2>{{ __('messages.featured_games') }}</h2>
                </div>
                <div class="popular_gaming_inner wow fadeInUp" data-wow-delay="0.2s" data-wow-duration="1.2s">
                    <div class="row">
                        @if(isset($popularGames) && count($popularGames) > 0)
                            @foreach($popularGames as $index => $game)
                                <div class="col-xl-3 col-lg-4 col-md-6 col-6">
                                    <div class="game-card">
                                        <span class="game-card-num">#{{ $index + 1 }}</span>
                                        <div class="game-card-img-wrap">
                                            <a href="{{ route('game.details', ['id' => $index + 1]) }}">
                                                <img src="{{ $game['image_url'] }}" alt="{{ $game['name'] }}" loading="lazy">
                                            </a>
                                        </div>
                                        <div class="game-card-overlay">
                                            <p class="game-card-name">{{ $game['name'] }}</p>
                                            <a class="game-card-play" href="{{ route('game.details', ['id' => $index + 1]) }}">▶ {{ __('messages.play_now') }}</a>
                                        </div>
                                    </div>
                                </div>
                            @endforeach
                        @else
                            <!-- Fallback static content if no dynamic games are available -->
                            <div class="col-xl-3 col-lg-4 col-md-6">
                                <div class="popular_gaming_thumb">
                                <a href="https://38-games-bundle.netlify.app/" target="_blank"><img width="570" height="330" src="{{ asset('assets/img/others/popular-game-thumb1.webp') }}" alt="Popular Ethiopian game 1"></a>
                                <div class="gaming_details_btn">
                                        <a class="btn btn-link" href="https://38-games-bundle.netlify.app/" target="_blank">Play Now <img width="20" height="20" src="{{ asset('assets/img/icon/arrrow-icon.webp') }}" alt=""> </a>
                                </div>
                                </div>
                            </div>
                            <div class="col-xl-3 col-lg-4 col-md-6">
                                <div class="popular_gaming_thumb">
                                <a href="https://38-games-bundle.netlify.app/" target="_blank"><img src="{{ asset('assets/img/others/popular-game-thumb2.webp') }}" alt="Popular Ethiopian game 2"></a>
                                <div class="gaming_details_btn">
                                        <a class="btn btn-link" href="https://38-games-bundle.netlify.app/" target="_blank">Play Now <img width="20" height="20" src="{{ asset('assets/img/icon/arrrow-icon.webp') }}" alt=""> </a>
                                </div>
                                </div>
                            </div>
                            <div class="col-xl-3 col-lg-4 col-md-6">
                                <div class="popular_gaming_thumb">
                                <a href="https://38-games-bundle.netlify.app/" target="_blank"><img src="{{ asset('assets/img/others/popular-game-thumb3.webp') }}" alt="Popular Ethiopian game 3"></a>
                                    <div class="gaming_details_btn">
                                        <a class="btn btn-link" href="https://38-games-bundle.netlify.app/" target="_blank">Play Now <img width="20" height="20" src="{{ asset('assets/img/icon/arrrow-icon.webp') }}" alt=""> </a>
                                    </div>
                                </div>
                            </div>
                            <div class="col-xl-3 col-lg-4 col-md-6">
                                <div class="popular_gaming_thumb">
                                <a href="https://38-games-bundle.netlify.app/" target="_blank"><img src="{{ asset('assets/img/others/popular-game-thumb4.webp') }}" alt="Popular Ethiopian game 4"></a>
                                    <div class="gaming_details_btn">
                                        <a class="btn btn-link" href="https://38-games-bundle.netlify.app/" target="_blank">Play Now <img width="20" height="20" src="{{ asset('assets/img/icon/arrrow-icon.webp') }}" alt=""> </a>
                                    </div>
                                </div>
                            </div>
                        @endif
                    </div>
                </div>
            </div>
        </section>
        <!-- popular gaming section end -->

 
        <!-- testimonial section start -->
        {{-- <section class="testimonial_section wow fadeInUp" data-bgimg="assets/img/others/testimonial-bg-fullwidth.webp" data-wow-delay="0.1s" data-wow-duration="1.1s">
            <div class="container">
                <div class="row">
                    <div class="col-12">
                        <div class="section_title mb-60">
                            <h2>What people’s say <br>
                                ABOUT <span>game studio.</span></h2>
                        </div>
                        <div class="testimonial_inner slick__activation slick_navigation" data-slick='{
                            "slidesToShow": 1,
                            "slidesToScroll": 1,
                            "arrows": true,
                            "dots": false,
                            "autoplay": false,
                            "speed": 300,
                            "infinite": true ,  
                            "responsive":[  
                            {"breakpoint":576, "settings": { "slidesToShow": 1 } }  
                            ]                                                     
                        }' data-bgimg="assets/img/others/testimonial-bg.webp">
                            <div class="testimonial_list d-flex align-items-center">
                                <div class="testimonial_thumb">
                                    <img width="270" height="319" src="assets/img/others/testimonial-thumb.webp" alt="">
                                </div>
                                <div class="testimonial_content">
                                    <div class="testimonial_desc">
                                        <p>It is a long established fact that a reader will be distracted the
                                        readable content of page when looking at it layout the point using
                                        lorem Ipsum is that it has a more-or-less normal distribution lette
                                        as opposed to using making it look like readable english,
                                        many desktop publishing packages and web page now editors.</p>
                                    </div>
                                    <div class="testimonial_author">
                                        <h3>Randolph Frazier</h3>
                                        <span>Top Rated Gamer</span>
                                    </div>
                                </div>
                            </div>
                            <div class="testimonial_list d-flex align-items-center">
                                <div class="testimonial_thumb">
                                    <img width="270" height="319" src="assets/img/others/testimonial-thumb.webp" alt="">
                                </div>
                                <div class="testimonial_content">
                                    <div class="testimonial_desc">
                                        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Natus quos consectetur amet blanditiis, facilis esse illo unde saepe facere dolore porro asperiores ducimus, inventore voluptate doloribus odio fugit magnam voluptatum perferendis? Sit quisquam labore adipisci doloremque! Aperiam voluptate modi quasi are nobis.</p>
                                    </div>
                                    <div class="testimonial_author">
                                        <h3>Roar Spring</h3>
                                        <span>Top Rated Gamer</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section> --}}
        <!-- testimonial section end -->

        <!-- blog section start -->
        {{-- <section class="blog_section mb-90">
            <div class="container">
                <div class="section_title text-center wow fadeInUp mb-70" data-wow-delay="0.1s" data-wow-duration="1.1s">
                    <h2>Latest Blog</h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod <br> tempor incididunt ut labore et dolore magna</p>
                </div>
                <div class="row blog_inner">
                    <div class="col-lg-6">
                        <div class="single_blog d-flex align-items-center wow fadeInUp" data-wow-delay="0.1s" data-wow-duration="1.1s">
                            <div class="blog_thumb">
                                <a href="blog-details.html"><img width="200" height="200" src="assets/img/blog/blog1.webp" alt=""></a>
                            </div>
                            <div class="blog_content">
                                <div class="blog_date">
                                    <span><i class="icofont-calendar"></i>  20 January 2021</span>
                                </div>
                                <h3><a href="blog-details.html">if you have seen Apple's
                                    recent jabs.</a></h3>
                                <a href="blog-details.html">READ MORE</a>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="single_blog d-flex align-items-center wow fadeInUp" data-wow-delay="0.1s" data-wow-duration="1.1s">
                            <div class="blog_thumb">
                                <a href="blog-details.html"><img width="200" height="200" src="assets/img/blog/blog2.webp" alt=""></a>
                            </div>
                            <div class="blog_content">
                                <div class="blog_date">
                                    <span><i class="icofont-calendar"></i>  20 January 2021</span>
                                </div>
                                <h3><a href="blog-details.html">Lorem ipsum dolor sit amet, adipisicing elit.</a></h3>
                                <a href="blog-details.html">READ MORE</a>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="single_blog d-flex align-items-center wow fadeInUp" data-wow-delay="0.1s" data-wow-duration="1.1s">
                            <div class="blog_thumb">
                                <a href="blog-details.html"><img width="200" height="200" src="assets/img/blog/blog3.webp" alt=""></a>
                            </div>
                            <div class="blog_content">
                                <div class="blog_date">
                                    <span><i class="icofont-calendar"></i>  20 January 2021</span>
                                </div>
                                <h3><a href="blog-details.html"> Perferendis hic sint are rem, incidunt vitae.</a></h3>
                                <a href="blog-details.html">READ MORE</a>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="single_blog d-flex align-items-center wow fadeInUp" data-wow-delay="0.1s" data-wow-duration="1.1s">
                            <div class="blog_thumb">
                                <a href="blog-details.html"><img width="200" height="200" src="assets/img/blog/blog4.webp" alt=""></a>
                            </div>
                            <div class="blog_content">
                                <div class="blog_date">
                                    <span><i class="icofont-calendar"></i>  20 January 2021</span>
                                </div>
                                <h3><a href="blog-details.html">if you have seen Apple's
                                    recent jabs.</a></h3>
                                <a href="blog-details.html">READ MORE</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section> --}}
        <!-- blog section end -->

        <!-- gaming update section start -->
        <section class="gaming_update_section">
            <div class="container">
                <div class="row">
                    <div class="col-12">
                        <div class="gaming_update_inner d-flex justify-content-between align-items-center" data-bgimg="{{ asset('assets/img/bg/gaming-update.webp') }}">
                            <div class="gaming_update_text">
                                <h2>{{ __('messages.community_cta') }}</h2>
                            </div>
                            <div class="gaming_update_btn">
                                <a class="btn btn-link" href="/contact">{{ __('messages.join_now') }} <img width="20" height="20" src="{{ asset('assets/img/icon/arrrow-icon.webp') }}" alt=""> </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <!-- gaming update section end -->

    </div>
    <!-- page wrapper end -->

@endsection