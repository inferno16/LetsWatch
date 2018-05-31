<!DOCTYPE html>
<!--[if lt IE 9 ]>    <html class="ie ie-9 ie-lt-9" lang="{{ app()->getLocale() }}"> <![endif]-->
<!--[if IE 9 ]>       <html class="ie ie-9" lang="{{ app()->getLocale() }}"> <![endif]-->
<!--[if gt IE 9]><!--><html lang="{{ app()->getLocale() }}"><!--<![endif]-->
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta property="og:title" content="{{ config('app.name', 'Laravel') }}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="{{ config('app.url', 'http://localhost') }}" />
    <meta property="og:image" content="{{ config('app.url', 'http://localhost') }}/storage/images/logo-big.png" />
    <meta property="og:description" content="{{__('Watch videos and listen music with your friends.')}}" />
    @yield('meta')

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'Laravel') }}</title>

    <!-- Scripts -->
    <script src="{{ mix('js/app.js') }}"></script>
    @yield('script')

    <link rel="icon" href="{{ asset('favicon.ico') }}">

    <!-- Fonts -->
    <link rel="dns-prefetch" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css?family=Raleway:300,400,600" rel="stylesheet" type="text/css">
    @yield('font')

    <!-- Styles -->
    <link href="{{ mix('css/app.css') }}" rel="stylesheet">
    @yield('style')
</head>
<body>
    <div id="app">
        @include('includes.navbar')
        <main id="main" class="py-4">
            <div class="container-fluid">
                @yield('content')
            </div>
        </main>
    </div>
    @yield('body-end')
</body>
</html>
