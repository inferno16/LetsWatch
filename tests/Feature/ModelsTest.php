<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ModelsTest extends TestCase
{
    use RefreshDatabase;

    public function testUser()
    {
        $user = factory(\App\User::class)->create();
        for ($i=0; $i < 5; $i++) { 
            $room = factory(\App\Room::class)->create();
            $user->rooms()->attach($room->id);
        }
        $this->assertEquals(5, $user->rooms()->count());
    }

    public function testRoom()
    {
        $room = factory(\App\Room::class)->create();
        for ($i=0; $i < 5; $i++) { 
            $user = factory(\App\User::class)->create();
            $room->users()->attach($user->id);
        }
        $this->assertEquals(5, $room->users()->count());
    }
}
