@extends('layouts.app')

@section('content')
    <!-- breadcrumbs area start -->
    <div class="breadcrumbs_aree breadcrumbs_bg mb-140" data-bgimg="{{ asset('assets/img/bg/breadcrumbs-bg.webp') }}">
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <div class="breadcrumbs_text text-center">
                        <h1>{{ __('messages.about_us_title') }}</h1>
                        <ul class="d-flex justify-content-center">
                            <li><a href="/">{{ __('messages.home') }} </a></li>
                            <li> <span>//</span></li>
                            <li> {{ __('messages.about_us') }}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- breadcrumbs area end -->

    <!-- page wrapper start -->
    <div class="page_wrapper">
        <!-- about section start -->
        <section class="about_section mb-140">
            <div class="container">
                <div class="row align-items-center">
                    <div class="col-lg-6">
                        <div class="about_content">
                            <h2 class="about_content__title">{{ __('messages.about_us_welcome') }}</h2>
                            <p class="about_content__desc">{{ __('messages.about_us_desc1') }}</p>
                            <p class="about_content__desc">{{ __('messages.about_us_desc2') }}</p>
                            <a class="btn btn-link" href="/all-games">{{ __('messages.explore_games') }} <img width="20" height="20" src="{{ asset('assets/img/icon/arrrow-icon.webp') }}" alt=""></a>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="about_thumb">
                            <img width="570" height="570" src="{{ asset('assets/img/others/about-thumb.webp') }}" alt="About Us Image">
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <!-- about section end -->
    </div>
    <!-- page wrapper end -->
@endsection
