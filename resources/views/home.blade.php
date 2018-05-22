@extends('layouts.app')

@section('content')
<form action="/room" method="POST">
@csrf
<input type="submit" name="submit" value="{{ __('Create Room') }}">
</form>
@endsection