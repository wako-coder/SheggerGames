<!doctype html>
<html class="no-js" lang="en">


<!-- Mirrored from htmldemo.net/bonx/bonx/index.html by HTTrack Website Copier/3.x [XR&CO'2014], Tue, 24 Mar 2026 12:07:01 GMT -->
<head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>SheggerGames - Ethiopian Gaming Platform</title>
    <meta name="description" content="SheggerGames is Ethiopia's premier gaming platform connecting players across the country and beyond. Experience the best of gaming with our community-driven platform."/>
    <meta name="keywords" content="Ethiopian games, Ethiopian gaming, SheggerGames, Ethiopian gamers, gaming platform, esports Ethiopia, online games Ethiopia">
    <meta name="author" content="SheggerGames Team">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- Add site Favicon -->
    <link rel="shortcut icon" href="{{ asset('assets/img/logo/favicon.ico') }}" type="image/png">

    <!-- CSS 
    ========================= -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Exo:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&amp;family=Metal+Mania&amp;display=swap" rel="stylesheet">

    <link rel="stylesheet" href="{{ asset('assets/css/vendor/bootstrap.min.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/css/slick.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/css/icofont.min.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/css/animate.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/css/nice-select.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/css/magnific-popup.css') }}">
    <!-- Main Style CSS -->
    <link rel="stylesheet" href="{{ asset('assets/css/style.css') }}">
    <script>
    window.AppConfig = {
        prevArrow: "{{ asset('assets/img/icon/navigation-arrow2.webp') }}",
        nextArrow: "{{ asset('assets/img/icon/navigation-arrow1.webp') }}"
    };
</script>
    @yield('styles')
</head>

<body class="body__bg" data-bgimg="{{ asset('assets/img/bg/body-bg.webp') }}">

@include('layouts.header')
  <!--offcanvas menu area start-->
    <div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasMenu">
        <div class="offcanvas-header justify-content-end">
            <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body">
            <ul class="offcanvas_main_menu">
                <li class="menu-item-has-children active">
                    <a href="/">Home</a>
                </li>
             
                <li class="menu-item-has-children"><a href="/all-games">Games</a>
                  
                </li>
            
                <li class="menu-item-has-children"><a href="/contact">Contact Us</a></li>
                @auth
                    <li class="menu-item-has-children">
                        <span class="text-white">Welcome, {{ Auth::user()->name }}</span>
                    </li>
                    <li class="menu-item-has-children">
                        <form method="POST" action="{{ route('logout') }}">
                            @csrf
                            <button type="submit" class="btn btn-link text-white">Logout</button>
                        </form>
                    </li>
                @else
                    {{-- <li class="menu-item-has-children"><a href="{{ route('login') }}">Login</a></li> --}}
                @endauth
            </ul>
        </div>
    </div>
    <!--offcanvas menu area end-->
    @yield('content')

@include('layouts.footer')

  
   
<!-- JS
============================================ -->
<!--modernizr min js here-->
<script src="{{ asset('assets/js/vendor/modernizr-3.7.1.min.js') }}"></script>

<!-- Vendor JS -->
<script src="{{ asset('assets/js/vendor/jquery-3.6.0.min.js') }}"></script>
<script src="{{ asset('assets/js/vendor/jquery-migrate-3.3.2.min.js') }}"></script>
<script src="{{ asset('assets/js/vendor/popper.js') }}"></script>
<script src="{{ asset('assets/js/vendor/bootstrap.min.js') }}"></script>
<script src="{{ asset('assets/js/slick.min.js') }}"></script>
<script src="{{ asset('assets/js/wow.min.js') }}"></script>
<script src="{{ asset('assets/js/jquery.nice-select.js') }}"></script>
<script src="{{ asset('assets/js/jquery.magnific-popup.min.js') }}"></script>
<script src="{{ asset('assets/js/jquery.counterup.min.js') }}"></script>
<script src="{{ asset('assets/js/jquery-waypoints.js') }}"></script>

<!-- Main JS -->
<script src="{{ asset('assets/js/main.js') }}"></script>

@yield('scripts')

</body>


<!-- Mirrored from htmldemo.net/bonx/bonx/index.html by HTTrack Website Copier/3.x [XR&CO'2014], Tue, 24 Mar 2026 12:08:21 GMT -->
</html>