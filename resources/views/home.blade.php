@extends('layouts.app')

@section('content')
<form action="/room" method="POST">
@csrf
<input type="submit" name="submit" value="Create Room">
</form>
@endsection