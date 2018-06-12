@extends('layouts.app')

@section('content')
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">{{__('About')}}</div>
                <div class="card-body">
                        <h4>{{__('Project information')}}</h4>

                        <b>{{__('This applications is a diploma project')}}</b><br>
                        {{__('Author: Ivan Krasimirov Angelov')}}<br>
                        {{__('University: Technical University of Varna')}}<br>
                        {{__('Specialty: CST (Computer Science and Technologies)')}}<br>
                        {{__('Group: 3b')}}<br>
                        {{__('Faculty №')}}: 61460111<br>
                        <hr>
                        <h4>{{__('Source code repositories')}}</h4>
                        SlimSlidy: <a href="http://github.com/inferno16/SlimSlidy">http://github.com/inferno16/SlimSlidy</a><br>
                        SlimPlayer: <a href="http://github.com/inferno16/SlimPlayer">http://github.com/inferno16/SlimPlayer</a><br>
                        uServer: <a href="http://github.com/inferno16/uServer">http://github.com/inferno16/uServer</a><br>
                        LetsWatch: <a href="http://github.com/inferno16/LetsWatch">http://github.com/inferno16/LetsWatch</a><br>
                </div>
            </div>
        </div>
    </div>
@endsection