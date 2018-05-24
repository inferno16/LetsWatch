<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    /**
     * The the users inside the room
     */
    public function users() {
        return $this->belongsToMany('App\User');
    }
}
