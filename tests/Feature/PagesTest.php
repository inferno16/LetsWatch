<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class PagesTest extends TestCase
{
    public function testIndex()
    {
        $response = $this->get('/');
        $response->assertStatus(200);
        $response->assertViewIs('home');
        $response = $this->get('/home');
        $response->assertStatus(200);
        $response->assertViewIs('home');
    }

    public function testAbout() {
        $response = $this->get('/about');
        $response->assertStatus(200);
        $response->assertViewIs('about');
    }
}
