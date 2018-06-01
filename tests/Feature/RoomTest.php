<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Http\Request;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class RoomTest extends TestCase
{
    use RefreshDatabase;

    public function testCreateRoom()
    {
        $response = $this->post('room');
        $response->assertStatus(302);
        $location = $response->headers->get('Location');
        $this->assertTrue(preg_match('/\/room\/[A-Za-z0-9_\-]{16}$/', $location) === 1);
    }

    public function testCreateRoomAsUser()
    {
        $user = factory(\App\User::class)->create();
        $response = $this->actingAs($user)->post('room');
        $response->assertStatus(302);
        $location = $response->headers->get('Location');
        $this->assertTrue(preg_match('/\/room\/[A-Za-z0-9_\-]{16}$/', $location) === 1);
        $this->testCreateRoom();
    }

    public function testJoinRoom()
    {
        $location = $this->post('room')->headers->get('Location');

        $response = $this->get($location);

        $response->assertStatus(200);
        $response->assertViewIs('room');
    }

    public function testJoinRoomWithInvalidID() {
        $response = $this->get('/room/InvalidID123');
        $response->assertStatus(302);
        $response->assertRedirect('/');
    }
}
