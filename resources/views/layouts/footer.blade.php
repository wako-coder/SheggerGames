<!--footer area start-->
<footer class="footer_widgets">
    <div class="main_footer">
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <div class="main_footer_inner d-flex">
                        <div class="footer_widget_list">
                            <div class="footer_logo">
                                <a href="#"><img aria-label="logo" width="215" height="79"
                                        src="{{ asset('assets/img/logo/newlogo.png') }}" alt="SheggerGames Logo"></a>
                            </div>
                            <div class="footer_contact_desc">
                                <p>{{ __('messages.footer_desc') }}</p>
                            </div>
                            <div class="footer_social">
                                <ul class="d-flex">
                                    <li><a aria-label="facebook" class="facebook"
                                            href="#"><i
                                                class="icofont-facebook"></i></a></li>
                                    <li><a aria-label="twitter" class="twitter"
                                            href="https://twitter.com/sheggergames"><i class="icofont-twitter"></i></a>
                                    </li>
                                    <li><a aria-label="youtube" class="youtube"
                                            href="https://www.youtube.com/sheggergames"><i
                                                class="icofont-youtube-play"></i></a></li>
                                    <li><a aria-label="instagram" class="instagram"
                                            href="https://www.instagram.com/sheggergames"><i
                                                class="icofont-instagram"></i></a></li>
                                </ul>
                            </div>
                        </div>
                        <div class="footer_widget_list contact">
                            <h3>{{ __('messages.footer_contact') }}</h3>
                            <div class="footer_contact_info">
                                <div class="footer_contact_info_list">
                                    <span>{{ __('messages.contact_hq') }}:</span>
                                    <p>{{ __('messages.contact_address') }}</p>
                                </div>
                                <div class="footer_contact_info_list">
                                    <span>{{ __('messages.contact_email_label') }}:</span>
                                    <p><a href="mailto:info@sheggergames.com">info@sheggergames.com</a></p>
                                </div>
                            </div>
                        </div>
                        <div class="footer_widget_list">
                            <h3>{{ __('messages.footer_champions') }}</h3>
                            <div class="footer_winners_gallery">
                                <div class="footer_winners_list d-flex">
                                    <div class="footer_winners_thumb">
                                        <a href="/all-games"><img aria-label="game-team" width="75" height="75"
                                                src="{{ asset('assets/img/others/winners1.webp') }}"
                                                alt="Ethiopian Gaming Champion"></a>
                                    </div>
                                    <div class="footer_winners_thumb">
                                        <a href="/all-games"><img aria-label="game-team" width="75" height="75"
                                                src="{{ asset('assets/img/others/winners2.webp') }}"
                                                alt="Ethiopian Gaming Champion"></a>
                                    </div>
                                    <div class="footer_winners_thumb">
                                        <a href="/all-games"><img aria-label="game-team" width="75" height="75"
                                                src="{{ asset('assets/img/others/winners3.webp') }}"
                                                alt="Ethiopian Gaming Champion"></a>
                                    </div>
                                </div>
                                <div class="footer_winners_list d-flex">
                                    <div class="footer_winners_thumb">
                                        <a href="/all-games"><img aria-label="game-team" width="75" height="75"
                                                src="{{ asset('assets/img/others/winners4.webp') }}"
                                                alt="Ethiopian Gaming Champion"></a>
                                    </div>
                                    <div class="footer_winners_thumb">
                                        <a href="/all-games"><img aria-label="game-team" width="75" height="75"
                                                src="{{ asset('assets/img/others/winners5.webp') }}"
                                                alt="Ethiopian Gaming Champion"></a>
                                    </div>
                                    <div class="footer_winners_thumb">
                                        <a href="/all-games"><img aria-label="game-team" width="75" height="75"
                                                src="{{ asset('assets/img/others/winners6.webp') }}"
                                                alt="Ethiopian Gaming Champion"></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="footer_widget_list footer_list_menu">
                            <h3>{{ __('messages.footer_quick_links') }}</h3>
                            <div class="footer_menu">
                                <ul>
                                    <li><a href="{{ route('about') }}"> {{ __('messages.about_us') }}</a></li>
                                    <li><a href="{{ route('games.all') }}"> {{ __('messages.all_games') }}</a></li>
                                    <li><a href="{{ url('/contact') }}"> {{ __('messages.contact') }}</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="footer_bottom">
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <div class="footer_bottom_inner d-flex justify-content-between">
                        <div class="copyright_right">
                            <p>{{ __('messages.copyright', ['year' => date('Y')]) }}</p>
                        </div>
                        <div class="footer_bottom_link_menu">
                            <ul class="d-flex">
                                <li><a href="{{ route('terms') }}">{{ __('messages.terms') }}</a></li>
                                {{-- <li><a href="#">{{ __('messages.privacy') }}</a></li> --}}
                            </ul>
                        </div>

                        <div class="scroll__top_icon">
                            <a id="scroll-top" href="#"><img aria-label="scroll-top" width="46" height="40"
                                    src="{{ asset('assets/img/icon/scroll-top.webp') }}" alt=""></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</footer>
<!--footer area end-->