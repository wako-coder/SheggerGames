@extends('layouts.app')


@section('content')
    
    <!-- breadcrumbs area start -->
    <div class="breadcrumbs_aree breadcrumbs_bg mb-140" data-bgimg="{{ asset('assets/img/bg/breadcrumbs-bg.webp') }}">
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <div class="breadcrumbs_text text-center">
                        <h1>All Games</h1>
                        <ul class="d-flex justify-content-center">
                            <li><a href="/">Home </a></li>
                            <li> <span>//</span></li>
                            <li>  Games</li>
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
                    <h2>Ethiopian Games Collection</h2>
                    <p>Explore our collection of 38 amazing games for Ethiopian gamers <br>
                        platform.</p>
                </div>
                <div class="all_games_inner">
                    <div class="row">
                        @if(isset($allGames) && count($allGames) > 0)
                            @foreach($allGames as $game)
                                <div class="col-xl-3 col-lg-4 col-md-6">
                                    <div class="popular_gaming_thumb">
                                        <a href="{{ $game['url'] }}" target="_blank">
                                            <img width="570" height="330" src="{{ $game['thumbnail'] }}" alt="{{ $game['name'] }}">
                                        </a>
                                        <div class="gaming_details_btn">
                                            <a class="btn btn-link" href="{{ $game['url'] }}" target="_blank">
                                                Play Now <img width="20" height="20" src="{{ asset('assets/img/icon/arrrow-icon.webp') }}" alt=""> 
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            @endforeach
                        @else
                            <div class="col-12">
                                <p>No games available at the moment.</p>
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