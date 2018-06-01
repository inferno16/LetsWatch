<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ProfileTest extends TestCase
{
    use RefreshDatabase;
    
    public function testAccessProfileAsAuthenticatedUser() {
        $user = factory(\App\User::class)->create();
        $response = $this->actingAs($user)->get('/profile');
        $response->assertStatus(200);
        $response->assertViewIs('profile');
    }

    public function testAccessProfileAsGuest() {
        $this->expectException(\Illuminate\Auth\AuthenticationException::class);
        $response = $this->get('/profile');
        $response->assertStatus(302);
        $response->assertRedirect('/home');
    }
}
