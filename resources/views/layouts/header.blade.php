      <!--header area start-->
    <header class="header_section header_transparent sticky-header">
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <div class="main_header d-flex justify-content-between align-items-center">
                        <div class="header_logo">
                            <a class="sticky_none" href="/"><img aria-label="logo" width="215" height="79" src="{{ asset('assets/img/logo/newlogo.png') }}" alt="SheggerGames Logo"></a>
                        </div>
                        <!--main menu start-->
                        <div class="main_menu d-none d-lg-block"> 
                            <nav>  
                                <ul class="d-flex">
                                    <li><a href="/">Home</a></li> 
                                    {{-- <li><a href="/matches">Matches</a>
                                        <ul class="sub_menu">
                                            <li><a href="/matches">Match Schedule</a></li>
                                            <li><a href="/match-details">Match Details</a></li>
                                        </ul>
                                    </li> --}}
                                    <li><a href="/all-games">Games</a>
                                        {{-- <ul class="sub_menu">
                                            <li><a href="/about">About Us</a></li>
                                            <li><a href="/games">Ethiopian Games</a></li>
                                            <li><a href="/game-details">Game Details</a></li>
                                            <li><a href="/faq">FAQ</a></li>
                                            <li><a href="/players">Players</a></li>
                                            <li><a href="/player-details">Player Details</a></li>
                                            <li><a href="/register">Sign Up</a></li>
                                            <li><a href="/login">Login</a></li>
                                            <li><a href="/support">Support</a></li>
                                        </ul> --}}
                                    </li>
                                    {{-- <li><a href="/blog">Blog</a>
                                        <ul class="sub_menu">
                                            <li><a href="/blog">Gaming News</a></li>
                                            <li><a href="/blog">Ethiopian Gaming Stories</a></li>
                                            <li><a href="/blog">Tournament Updates</a></li>
                                        </ul>
                                    </li> --}}
                                    <li><a href="/contact">Contact</a></li>
                                </ul>  
                            </nav>
                        </div>
                        <!--main menu end-->
                        <div class="header_right_sidebar d-flex align-items-center">
                            @auth
                                <div class="sing_up_btn">
                                    <span class="text-white me-3">Welcome, {{ Auth::user()->name }}</span>
                                    <form method="POST" action="{{ route('logout') }}" class="d-inline">
                                        @csrf
                                        <button type="submit" class="btn btn-link">Logout <img width="15" height="15" src="{{ asset('assets/img/icon/arrrow-icon2.webp') }}" alt=""></button>
                                    </form>
                                </div>
                            @else
                                <div class="sing_up_btn">
                                    <a class="btn btn-link" href="{{ route('login') }}">Login <img width="15" height="15" src="{{ asset('assets/img/icon/arrrow-icon2.webp') }}" alt=""> </a>
                                </div>
                            @endauth
                            <div class="canvas_open">
                                <button type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasMenu"><i class="icofont-navigation-menu"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </header>
    <!--header area end-->
