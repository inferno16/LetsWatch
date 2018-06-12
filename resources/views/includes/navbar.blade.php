<nav class="navbar navbar-expand-sm navbar-dark bg-dark">
    <div class="container">
        <a class="navbar-brand" href="{{ url('/') }}">
            <img src="/storage/images/logo-small.png" alt="logo">
            {{ config('app.name', 'Laravel') }}
        </a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <!-- Left Side Of Navbar -->
            <ul class="navbar-nav mr-auto">
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" id="dropdown-community" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {{__('Community')}}
                        </a>
                        <div class="dropdown-menu" aria-labelledby="dropdown-community">
                                <a class="dropdown-item" href="/forum">{{__('Forum')}}</a>
                                <a class="dropdown-item" href="/about">{{__('About')}}</a>
                        </div>
                    </li>
            </ul>

            <!-- Right Side Of Navbar -->
            <ul class="navbar-nav ml-auto">
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="http://example.com" id="dropdown-locale" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <img src="/storage/images/blank.gif" class="flag flag-{{\APP::getLocale()}}"> {{strtoupper(\App::getLocale())}}
                        </a>
                        <div class="dropdown-menu" aria-labelledby="dropdown-locale">
                            <a class="dropdown-item" href="#" onclick="LW.ChangeLocale(0)">EN</a>
                            <a class="dropdown-item" href="#" onclick="LW.ChangeLocale(1)">BG</a>
                        </div>
                    </li>
                @include('includes.locale')
                @guest
                    <li><a class="nav-link" href="{{ route('login') }}">{{ __('Login') }}</a></li>
                    <li><a class="nav-link" href="{{ route('register') }}">{{ __('Register') }}</a></li>
                @else
                    <li class="nav-item dropdown">
                        <a id="navbarDropdown" class="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" v-pre>
                            {{ Auth::user()->name }} <span class="caret"></span>
                        </a>

                        <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                            <a class="dropdown-item" href="/profile">{{ __('Profile') }}</a>
                            <a class="dropdown-item" href="{{ route('logout') }}"
                               onclick="event.preventDefault();
                                             document.getElementById('logout-form').submit();">
                                {{ __('Logout') }}
                            </a>

                            <form id="logout-form" action="{{ route('logout') }}" method="POST" style="display: none;">
                                @csrf
                            </form>
                        </div>
                    </li>
                @endguest
            </ul>
        </div>
    </div>
</nav>
