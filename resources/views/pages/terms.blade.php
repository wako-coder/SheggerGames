@extends('layouts.app')

@section('content')
    <!-- breadcrumbs area start -->
    <div class="breadcrumbs_aree breadcrumbs_bg mb-140" data-bgimg="{{ asset('assets/img/bg/breadcrumbs-bg.webp') }}">
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <div class="breadcrumbs_text text-center">
                        <h1>{{ __('messages.terms') }}</h1>
                        <ul class="d-flex justify-content-center">
                            <li><a href="/">{{ __('messages.home') }} </a></li>
                            <li> <span>//</span></li>
                            <li> {{ __('messages.terms') }}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- breadcrumbs area end -->

    <!-- page wrapper start -->
    <div class="page_wrapper">
        <!-- terms and conditions section start -->
        <section class="terms_conditions_section mb-140">
            <div class="container">
                <div class="row">
                    <div class="col-12">
                        <div class="terms_conditions_content">
                            <h2>{{ __('messages.terms_1_title') }}</h2>
                            <p>{{ __('messages.terms_1_body') }}</p>

                            <h2>{{ __('messages.terms_2_title') }}</h2>
                            <p>{{ __('messages.terms_2_body') }}</p>
                            <ul>
                                <li>{{ __('messages.terms_2_li1') }}</li>
                                <li>{{ __('messages.terms_2_li2') }}</li>
                                <li>{{ __('messages.terms_2_li3') }}</li>
                                <li>{{ __('messages.terms_2_li4') }}</li>
                                <li>{{ __('messages.terms_2_li5') }}</li>
                            </ul>
                            <p>{{ __('messages.terms_2_footer') }}</p>

                            <h2>{{ __('messages.terms_3_title') }}</h2>
                            <p>{{ __('messages.terms_3_body') }}</p>

                            <h2>{{ __('messages.terms_4_title') }}</h2>
                            <p>{{ __('messages.terms_4_body') }}</p>

                            <h2>{{ __('messages.terms_5_title') }}</h2>
                            <p>{{ __('messages.terms_5_body') }}</p>

                            <h2>{{ __('messages.terms_6_title') }}</h2>
                            <p>{{ __('messages.terms_6_body') }}</p>

                            <h2>{{ __('messages.terms_7_title') }}</h2>
                            <p>{{ __('messages.terms_7_body') }}</p>

                            <h2>{{ __('messages.terms_8_title') }}</h2>
                            <p>{{ __('messages.terms_8_body') }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <!-- terms and conditions section end -->
    </div>
    <!-- page wrapper end -->
@endsection
