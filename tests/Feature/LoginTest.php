<?php

namespace Tests\Feature;

use App\User;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class LoginTest extends TestCase
{
    use RefreshDatabase;

    public function testLoginFormDisplayed()
    {
        $response = $this->get('/login');
        $response->assertStatus(200);
    }

    public function testLoginAValidUser()
    {
        $user = factory(User::class)->create();
        $response = $this->post('/login', [
            'email' => $user->email,
            'password' => 'secret'
        ]);
        $response->assertStatus(302);
        $this->assertAuthenticatedAs($user);
    }

    public function testDoesNotLoginAnInvalidUser()
    {
        $user = factory(User::class)->create();

        $this->expectException(\Illuminate\Validation\ValidationException::class);
        $response = $this->post('/login', [
            'email' => $user->email,
            'password' => 'invalid'
        ]);
        $response->assertSessionHasErrors();
        $this->assertGuest();
    }

    public function testLogoutAnAuthenticatedUser()
    {
        $user = factory(User::class)->create();
        $response = $this->actingAs($user)->post('/logout');
        $response->assertStatus(302);
        $this->assertGuest();
    }

    public function testVisitLoginAsAuthenticatedUser() {
        $user = factory(User::class)->create();
        $response = $this->actingAs($user)->get('/login');
        $response->assertStatus(302);
        $response->assertRedirect('/home');
    }

    public function testVisitRegisterAsAuthenticatedUser() {
        $user = factory(User::class)->create();
        $response = $this->actingAs($user)->get('/register');
        $response->assertStatus(302);
        $response->assertRedirect('/home');
    }
}
