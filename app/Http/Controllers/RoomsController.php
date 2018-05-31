<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Custom\Base64Url;
use App\Room;
use App\TempUser;
use Illuminate\Support\Facades\DB;

class RoomsController extends Controller
{
    public function create(Request $request) {
        $room = new Room;
        $user_id = auth()->id();
        if($user_id) {
            $room->guest_owner = 0;
            $room->owner = $user_id;
        }
        else {
            $room->guest_owner = 1;
        }
        $stream_key = '';
        $room_found = 0;
        do {
            // Generating unique room identifier
            $stream_key = Base64Url::generate(16);
            $room_found = Room::find($stream_key);
        } while($room_found);
        $room->stream_key = $stream_key;
        if($room->save())
            return redirect('/room/'.$room->stream_key);
        else
            return redirect('/')->with('errors', 'An unexpected error occured while creating the room.');
    }

    public function join($id, Request $request) {
        $room = Room::where('stream_key', $id)->first();
        if(!$room)
            return redirect('/');
        $tu = new TempUser;
        $ip = DB::connection()->getPdo()->quote($this->getIp());
        $tu->identifier = DB::raw("INET_ATON($ip)");
        $tu->username = (auth()->check()) ? auth()->user()->username : uniqid();
        $tu->save();
        return view('room')->with('info', [
            'stream_key' => $id,
            'username' => $tu->username
        ]);
    }

    private function getIp(){
        foreach (array('HTTP_CLIENT_IP', 'HTTP_X_FORWARDED_FOR', 'HTTP_X_FORWARDED', 'HTTP_X_CLUSTER_CLIENT_IP', 'HTTP_FORWARDED_FOR', 'HTTP_FORWARDED', 'REMOTE_ADDR') as $key){
            if (array_key_exists($key, $_SERVER) === true){
                foreach (explode(',', $_SERVER[$key]) as $ip){
                    $ip = trim($ip); // just to be safe
                    if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) !== false){
                        return $ip;
                    }
                }
            }
        }
    }
}
