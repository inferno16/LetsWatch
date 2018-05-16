<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Custom\Base64Url;
use App\Room;

class RoomsController extends Controller
{
    public function create(Request $request) {
        $room = new Room;
        $room->name = 'Temporary room';
        $user_id = auth()->id();
        if($user_id) {
            $room->guest_owner = 0;
            $room->owner = $user_id;
        }
        else {
            $room->guest_owner = 1;
        }
        $room->save();
        $data = $this->encodeID($room->id);
        return redirect('/room/'.$data['id']);
    }
    public function join($id) {
        $data = $this->getRoomIdFromUri($id);
        if(!$data)
            return redirect('/');
        $room = Room::find($data['id']);
        if(!$room)
            return redirect('/');
        return view('room');
    }


    // The code below is a temporary solution

    private function encodeID($id) {
        $idb64 = Base64Url::encode($id);
        $token = Base64Url::generate(6);
        $uri = Base64Url::encode($token.$idb64.'c'.strlen($idb64));
        return ['token'=>$token, 'id'=>$uri];
    }

    private function getRoomIdFromUri($uri) {
        $str = Base64Url::decode($uri);
        $data;
        if(!preg_match("/^([A-Za-z0-9_\-]+)c(\d+)$/", $str, $data))
            return 0;
        if(count($data) !== 3)
            return 0;
        $token = substr($data[1], 0, -$data[2]);
        $id = Base64Url::decode(substr($data[1], -$data[2]));
        if(!ctype_digit($id))
            return 0;
        return ['token'=>$token, 'id'=>$id];
    }
}
