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
        <div class="search-wrapper">
            <div class="toggle-form lw-btn">🔍</div>
            <div class="media-form">
                <input type="text" id="media-url" placeholder="Paste video URL here"><!--
                --><div id="load-btn" class="lw-btn">🔍</div>
            </div>
            <div class="user-list">
                <div class="prev-btn lw-btn">&lt;</div>
                <div class="users">
                    <div class="user-card"></div>
                    <div class="user-card"></div>
                    <div class="user-card"></div>
                    <div class="user-card"></div>
                    <div class="user-card"></div>
                    <div class="user-card"></div>
                    <div class="user-card"></div>
                    <div class="user-card"></div>
                    <div class="user-card"></div>
                    <div class="user-card"></div>
                    <div class="user-card"></div>
                    <div class="user-card"></div>
                    <div class="user-card"></div>
                    <div class="user-card"></div>
                </div>
                <div class="next-btn lw-btn">&gt;</div>
            </div>
        </div>
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
    LW.CreateEventHandlers('{{$roomID}}');
</script>
@endsection