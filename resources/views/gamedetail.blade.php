@extends('layouts.app')


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
                            <div class="game_details_thumb_inner slick__activation slick_navigation" data-slick='{
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
                                <div class="game_details_thumb">
                                    <img width="1170" height="540" src="{{ asset('assets/img/others/game-details-thumb.webp') }}" alt="{{ $gameName ?? 'Game screenshot' }}">
                                </div>
                                <div class="game_details_thumb">
                                    <img width="1170" height="540" src="{{ asset('assets/img/others/game-details-thumb.webp') }}" alt="{{ $gameName ?? 'Game screenshot' }}">
                                </div>
                            </div>
                            <div class="start_now_btn">
                                <a class="btn btn-link" href="{{ $gameUrl ?? '#' }}">PLAY NOW <img width="20" height="20" src="{{ asset('assets/img/icon/arrrow-icon.webp') }}" alt=""> </a>
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