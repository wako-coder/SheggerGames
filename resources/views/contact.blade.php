@extends('layouts.app')

@section('styles')
<style>
    .map-responsive {
        overflow: hidden;
        padding-bottom: 56.25%; /* 16:9 aspect ratio */
        position: relative;
        height: 0;
    }
    .map-responsive iframe {
        left: 0;
        top: 0;
        height: 100%;
        width: 100%;
        position: absolute;
    }
</style>
@endsection


@section('content')
    

    <!-- breadcrumbs area start -->
    <div class="breadcrumbs_aree breadcrumbs_bg mb-140" data-bgimg="assets/img/bg/breadcrumbs-bg.webp">
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <div class="breadcrumbs_text text-center">
                        <h1>{{ __('messages.contact_title') }}</h1>
                        <ul class="d-flex justify-content-center">
                            <li><a href="/">{{ __('messages.home') }} </a></li>
                            <li> <span>//</span></li>
                            <li>  {{ __('messages.contact') }}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- breadcrumbs area end -->
    <!-- page wrapper start -->
    <div class="page_wrapper">
    
        <!-- contact section start -->
        <section class="contact_page_section mb-140">
            <div class="container">
                <div class="contact_info_area">
                    <div class="row">
                        <div class="col-lg-4 col-md-4 col-sm-6">
                            <div class="contact_info_list left wow fadeInUp" data-bgimg="assets/img/others/gaming-world-bg1.webp" data-wow-delay="0.1s" data-wow-duration="1.1s">
                                <div class="contact_info_thumb">
                                    <img width="115" height="115" src="assets/img/icon/email.webp" alt="">
                                </div>
                                <div class="contact_info_text">
                                <h3>{{ __('messages.contact_email_label') }}:</h3>
                                    <p>
                                        <a href="mailto:sheggergames@gmail.com">sheggergames@gmail.com</a>  <br>
                                        <a href="mailto:support@sheggergames.com">support@sheggergames.com</a>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-4 col-md-4 col-sm-6">
                            <div class="contact_info_list center wow fadeInUp" data-bgimg="assets/img/others/gaming-world-bg2.webp" data-wow-delay="0.2s" data-wow-duration="1.2s">
                                <div class="contact_info_thumb">
                                    <img width="115" height="115" src="assets/img/icon/location.webp" alt="">
                                </div>
                                <div class="contact_info_text">
                                <h3>{{ __('messages.location') }}:</h3>
                                    <p>{{ __('messages.contact_address') }}</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-4 col-md-4 col-sm-6">
                            <div class="contact_info_list right wow fadeInUp" data-bgimg="assets/img/others/gaming-world-bg3.webp" data-wow-delay="0.3s" data-wow-duration="1.3s">
                                <div class="contact_info_thumb">
                                    <img width="115" height="115" src="assets/img/icon/phone.webp" alt="">
                                </div>
                                <div class="contact_info_text">
                                <h3>{{ __('messages.phone') }}:</h3>
                                    <p> 
                                        <a href="tel:++251911248351"> +251 911 248 351</a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                
                <div class="contact_form_area">
                    <div class="section_title text-center mb-60">
                        <h2>{{ __('messages.get_in_touch') }}</h2>
                        <p>{{ __('messages.contact_form_subtitle') }}</p>
                    </div>
                    <div class="contact_form_inner">
                        <form method="POST" action="{{ route('contact.store') }}">
                        @csrf

                        @if (session('success'))
                            <div class="alert alert-success mb-3">
                                {{ session('success') }}
                            </div>
                        @endif

                        <div class="form_input mb-3">
                            <input name="name" placeholder="{{ __('messages.contact_name') }}" type="text" value="{{ old('name') }}">
                            @error('name')
                                <small class="text-danger">{{ $message }}</small>
                            @enderror
                        </div>
                        <div class="form_input mb-3">
                            <input name="email" placeholder="{{ __('messages.contact_email') }}" type="text" value="{{ old('email') }}">
                            @error('email')
                                <small class="text-danger">{{ $message }}</small>
                            @enderror
                        </div>
                        <div class="form_input mb-3">
                            <input name="subject" placeholder="{{ __('messages.contact_subject') }}" type="text" value="{{ old('subject') }}">
                            @error('subject')
                                <small class="text-danger">{{ $message }}</small>
                            @enderror
                        </div>
                        <div class="form_input mb-3">
                            <textarea name="message" placeholder="{{ __('messages.contact_message') }}">{{ old('message') }}</textarea>
                            @error('message')
                                <small class="text-danger">{{ $message }}</small>
                            @enderror
                        </div>
                        <div class="form_input_btn text-center">
                            <button type="submit" class="btn btn-link">{{ __('messages.send_message') }} <img width="20" height="20" src="assets/img/icon/arrrow-icon.webp" alt=""></button>
                        </div>
                    </form>
                    </div>
                </div>
            </div>
        </section>
        <!-- contact section end -->

        <!--contact map start-->
        <div class="contact_map mt-70">
            <div class="map-responsive">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.0000000000005!2d38.7578!3d9.0200!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85cef5ab402d%3A0x8467b6b037a24d49!2sAddis%20Ababa%2C%20Ethiopia!5e0!3m2!1sen!2sus!4v1678888888888!5m2!1sen!2sus"  style="border:0;" allowfullscreen="" loading="lazy"></iframe>
            </div>
        </div>
        <!--contact map end-->

        <!-- gaming update section start -->
        <section class="gaming_update_section contact_gaming_update">
            <div class="container">
                <div class="row">
                    <div class="col-12">
                        <div class="gaming_update_inner d-flex justify-content-between align-items-center" data-bgimg="assets/img/bg/gaming-update.webp">
                            <div class="gaming_update_text">
                                <h2>{{ __('messages.community_cta') }}</h2>
                            </div>
                            <div class="gaming_update_btn">
                                <a class="btn btn-link" href="/contact">{{ __('messages.join_now') }} <img width="20" height="20" src="assets/img/icon/arrrow-icon.webp" alt=""> </a>
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