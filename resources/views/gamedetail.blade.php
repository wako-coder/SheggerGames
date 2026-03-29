@extends('layouts.app')

@section('styles')
<style>
    .game-frame-container {
        position: relative;
    }
    
    .fullscreen-btn {
        position: absolute;
        top: 15px;
        right: 15px;
        z-index: 10;
        background: rgba(0, 0, 0, 0.7);
        border: none;
        border-radius: 8px;
        padding: 10px 12px;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .fullscreen-btn:hover {
        background: rgba(0, 0, 0, 0.9);
        transform: scale(1.1);
    }
    
    .fullscreen-icon {
        width: 24px;
        height: 24px;
        color: #fff;
    }
    
    .game-frame-container:-webkit-full-screen {
        width: 100%;
        height: 100vh;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 9999;
        background: #000;
    }
    
    .game-frame-container:-webkit-full-screen iframe {
        width: 100%;
        height: 100%;
    }
    
    .game-frame-container:-moz-full-screen {
        width: 100%;
        height: 100vh;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 9999;
        background: #000;
    }
    
    .game-frame-container:-moz-full-screen iframe {
        width: 100%;
        height: 100%;
    }
    
    .game-frame-container:-ms-fullscreen {
        width: 100%;
        height: 100vh;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 9999;
        background: #000;
    }
    
    .game-frame-container:-ms-fullscreen iframe {
        width: 100%;
        height: 100%;
    }
    
    .game-frame-container:fullscreen {
        width: 100%;
        height: 100vh;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 9999;
        background: #000;
    }
    
    .game-frame-container:fullscreen iframe {
        width: 100%;
        height: 100%;
    }
</style>
@endsection

@section('scripts')
<script>
    function toggleFullscreen() {
        const container = document.querySelector('.game-frame-container');
        
        if (!document.fullscreenElement && 
            !document.mozFullScreenElement && 
            !document.webkitFullscreenElement && 
            !document.msFullscreenElement) {
            // Enter fullscreen
            if (container.requestFullscreen) {
                container.requestFullscreen();
            } else if (container.mozRequestFullScreen) {
                container.mozRequestFullScreen();
            } else if (container.webkitRequestFullscreen) {
                container.webkitRequestFullscreen();
            } else if (container.msRequestFullscreen) {
                container.msRequestFullscreen();
            }
        } else {
            // Exit fullscreen
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    }
    
    // Update icon when fullscreen state changes
    document.addEventListener('fullscreenchange', updateFullscreenIcon);
    document.addEventListener('webkitfullscreenchange', updateFullscreenIcon);
    document.addEventListener('mozfullscreenchange', updateFullscreenIcon);
    document.addEventListener('MSFullscreenChange', updateFullscreenIcon);
    
    function updateFullscreenIcon() {
        const icons = document.querySelectorAll('.fullscreen-icon');
        const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
        
        icons.forEach(icon => {
            if (isFullscreen) {
                // Show exit fullscreen icon
                icon.innerHTML = '<path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>';
            } else {
                // Show enter fullscreen icon
                icon.innerHTML = '<path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>';
            }
        });
    }
</script>
@endsection

@section('content')
    
    <!-- breadcrumbs area start -->
    <div class="breadcrumbs_aree breadcrumbs_bg mb-140" data-bgimg="{{ asset('assets/img/bg/breadcrumbs-bg.webp') }}">
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <div class="breadcrumbs_text text-center">
                        <h1>Game Details</h1>
                        <ul class="d-flex justify-content-center">
                            <li><a href="/">Home </a></li>
                            <li> <span>//</span></li>
                            <li>  Game</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- breadcrumbs area end -->
    
    <!-- page wrapper start -->
    <div class="page_wrapper">

        <!--game details section area start-->
        <section class="game_details_section mb-125">
            <div class="container">
                <div class="row">
                    <div class="col-12">
                        <div class="game_details_inner">
                            <div class="game_details_content top">
                                <span>SheggerGames Studio</span>
                                <h2 class="game_details_title">{{ $gameName ?? 'Ethiopian Game Title' }}</h2>
                                <div class="game_details_desc">
                                    <p>{{ $gameDescription ?? 'This is a popular Ethiopian game from our 38-games bundle collection. Experience the thrill and excitement of this amazing game that has been enjoyed by thousands of Ethiopian gamers.' }}
                                        {{ $gameDetails ?? 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500
                                        when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap electro
                                        typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more
                                        recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.' }}</p>
                                
                                </div>
                            </div>
                            <div class="game_details_thumb_inner slick__activation slick_navigation position-relative" data-slick='{
                                "slidesToShow": 1,
                                "slidesToScroll": 1,
                                "arrows": true,
                                "dots": false,
                                "autoplay": false,
                                "speed": 300,
                                "infinite": true ,
                                "responsive\":[
                                {"breakpoint":576, "settings": { "slidesToShow": 1 } }
                                ]
                            }'>
                                <div class="game_details_thumb position-relative game-frame-container">
                                    <iframe id="gameFrame" src="{{ $gameUrl ?? '#' }}" width="1170" height="540" frameborder="0" allowfullscreen title="{{ $gameName ?? 'Game' }}"></iframe>
                                    <button class="fullscreen-btn" onclick="toggleFullscreen()" title="Toggle Fullscreen">
                                        <svg class="fullscreen-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
                                        </svg>
                                    </button>
                                </div>
                                <div class="game_details_thumb position-relative game-frame-container">
                                    <iframe id="gameFrame2" src="{{ $gameUrl ?? '#' }}" width="1170" height="540" frameborder="0" allowfullscreen title="{{ $gameName ?? 'Game' }}"></iframe>
                                    <button class="fullscreen-btn" onclick="toggleFullscreen()" title="Toggle Fullscreen">
                                        <svg class="fullscreen-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>

                          
                        </div>
                      
                    </div>
                </div>
            </div>
        </section>
        <!--game details section area end-->

        <!-- gaming update section start -->
        <section class="gaming_update_section">
            <div class="container">
                <div class="row">
                    <div class="col-12">
                        <div class="gaming_update_inner d-flex justify-content-between align-items-center" data-bgimg="{{ asset('assets/img/bg/gaming-update.webp') }}">
                            <div class="gaming_update_text">
                                <h2>Connect with the <br>
                                    Ethiopian Gaming Community.</h2>
                            </div>
                            <div class="gaming_update_btn">
                                <a class="btn btn-link" href="/contact">JOIN NOW <img width="20" height="20" src="{{ asset('assets/img/icon/arrrow-icon.webp') }}" alt=""> </a>
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