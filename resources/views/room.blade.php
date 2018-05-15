@extends('layouts.app')

@section('script')
    
@endsection

@section('content')
<div class="row">
    <div id="room-users" class="col-lg-12 card">
        Room users go here.
    </div>
</div>

<div class="row">
    <div id="player-wrapper" class="col-lg-6">
        <div class="content">
            @include('includes.player')
        </div>
    </div>
    <div id="chat-wrapper" class="col-lg-6">
        <div class="content">
            @include('includes.chat')
        </div>
    </div>
</div>
@endsection