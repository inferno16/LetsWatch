@extends('layouts.app')

@section('content')
<ul class="cb-slideshow">
    <li><div><h3>{{__('Feeling lonely?')}}</h3></div></li>
    <li><div><h3>{{__('Don\'t have time for your friends?')}}</h3></div></li>
    <li><div><h3>{{__('Maybe they live far from you?')}}</h3></div></li>
    <li><div><h3>{{__('Or you are just not in a mood?')}}</h3></div></li>
    <li><div><h3>{{__('You can spend time with your friends NOW!')}}</h3></div></li>
</ul>
<form action="/room" method="POST">
    @csrf
    <input type="submit" name="submit" class="new-room-btn lw-btn" value="{{ __('Create Room') }}">
</form>
@endsection