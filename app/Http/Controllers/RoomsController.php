<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Custom\Base64Url;
use App\Room;

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

    public function join($id) {
        $room = Room::where('stream_key', $id)->first();
        if(!$room)
            return redirect('/');
        return view('room')->with('roomID', $id);
    }
}
