<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/{uri}', function () {
    return view('home');
})->where(['uri' => '(home)?']);

Route::post('/room', 'RoomsController@create');
Route::get('/room/{id}', 'RoomsController@join');

Auth::routes();

Route::get('/profile', 'ProfileController@index');
