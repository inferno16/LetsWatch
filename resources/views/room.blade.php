@extends('layouts.app')

@section('script')
<script id="facebook-jssdk" src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&amp;version=v2.6"></script>
<script src="https://www.youtube.com/iframe_api"></script>
@endsection

@section('style')
<link rel="stylesheet" href="{{mix('css/SlimPlayer.css')}}">
@endsection

@section('content')
<div class="row">
    <div id="room-users" class="col-lg-12 card">
        @include('includes/users')
    </div>
</div>

<div class="row">
    <div id="player-wrapper" class="col-lg-8">
        <div class="content">
            @include('includes.player')
        </div>
    </div>
    <div id="chat-wrapper" class="col-lg-4">
        @include('includes.chat')
    </div>
</div>
@endsection

@section('body-end')
<script>
    LW.CreateEventHandlers('{!!json_encode($info)!!}');
</script>
@endsection