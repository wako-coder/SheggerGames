@extends('layouts.app')


@section('styles')
<style>
    @media (min-width: 768px) {
        .col-game-5 { flex: 0 0 20%; max-width: 20%; }
    }

    .all_games_section { padding-top: 20px; }

    .games-grid { gap: 0; }

    .game-card {
        position: relative;
        border-radius: 12px;
        overflow: hidden;
        margin-bottom: 16px;
        background: #0a0a14;
        transition: transform 0.3s cubic-bezier(.25,.8,.25,1), box-shadow 0.3s ease;
        box-shadow: 0 2px 10px rgba(0,0,0,0.5);
    }

    .game-card:hover {
        transform: translateY(-7px) scale(1.02);
        box-shadow: 0 16px 40px rgba(0,0,0,0.7), 0 0 0 1.5px rgba(232,25,44,0.5);
        z-index: 2;
    }

    .game-card-img-wrap {
        overflow: hidden;
        line-height: 0;
    }

    .game-card img {
        width: 100%;
        aspect-ratio: 16/11;
        object-fit: cover;
        display: block;
        transition: transform 0.45s ease;
    }

    .game-card:hover img {
        transform: scale(1.1);
    }

    .game-card-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(to top,
            rgba(5,5,18,0.97) 0%,
            rgba(5,5,18,0.5) 40%,
            transparent 70%
        );
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        padding: 12px 10px 10px;
    }

    .game-card-name {
        color: #f0f0f0;
        font-size: 0.75rem;
        font-weight: 700;
        margin: 0 0 7px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        letter-spacing: 0.2px;
        text-shadow: 0 1px 6px rgba(0,0,0,0.9);
    }

    .game-card-play {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        background: linear-gradient(135deg, #e8192c 0%, #ff4e2a 100%);
        color: #fff;
        font-size: 0.62rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 1.2px;
        padding: 4px 11px;
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

    /* number label top-right */
    .game-card-num {
        position: absolute;
        top: 7px;
        right: 8px;
        background: rgba(0,0,0,0.55);
        backdrop-filter: blur(4px);
        color: rgba(255,255,255,0.7);
        font-size: 0.6rem;
        font-weight: 700;
        padding: 2px 7px;
        border-radius: 10px;
        letter-spacing: 0.5px;
    }
</style>
@endsection

@section('content')
    
    <!-- breadcrumbs area start -->
    <div class="breadcrumbs_aree breadcrumbs_bg mb-140" data-bgimg="{{ asset('assets/img/bg/breadcrumbs-bg.webp') }}">
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <div class="breadcrumbs_text text-center">
                        <h1>{{ __('messages.all_games') }}</h1>
                        <ul class="d-flex justify-content-center">
                            <li><a href="/">{{ __('messages.home') }} </a></li>
                            <li> <span>//</span></li>
                            <li>  {{ __('messages.games') }}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- breadcrumbs area end -->
    
    <!-- page wrapper start -->
    <div class="page_wrapper">

        <!--all games section area start-->
        <section class="all_games_section mb-125">
            <div class="container">
                <div class="section_title text-center wow fadeInUp mb-60" data-wow-delay="0.1s" data-wow-duration="1.1s">
                    <h2>{{ __('messages.all_games') }}</h2>
                </div>
                <div class="all_games_inner">
                    <div class="row">
                        @if(isset($allGames) && count($allGames) > 0)
                            @foreach($allGames as $game)
                                <div class="col-game-5 col-sm-4 col-6">
                                    <div class="game-card">
                                        <span class="game-card-num">#{{ $loop->index + 1 }}</span>
                                        <div class="game-card-img-wrap">
                                            <a href="{{ route('game.details', ['id' => $loop->index + 1]) }}">
                                                <img src="{{ $game['thumbnail'] }}" alt="{{ $game['name'] }}" loading="lazy">
                                            </a>
                                        </div>
                                        <div class="game-card-overlay">
                                            <p class="game-card-name">{{ $game['name'] }}</p>
                                            <a class="game-card-play" href="{{ route('game.details', ['id' => $loop->index + 1]) }}">▶ {{ __('messages.play_now') }}</a>
                                        </div>
                                    </div>
                                </div>
                            @endforeach
                        @else
                            <div class="col-12">
                                <p>{{ __('messages.no_games') }}</p>
                            </div>
                        @endif
                    </div>
                </div>
            </div>
        </section>
        <!--all games section area end-->

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