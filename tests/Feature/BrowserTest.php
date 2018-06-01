<?php

namespace Tests\Feature;

use App\User;
use Tests\BrowserKitTestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class BrowserTest extends BrowserKitTestCase
{
    use RefreshDatabase;
    
    public function testLoginInteraction()
    {
        $user = new \App\User([
            'name' => 'test',
            'email' => 'foo@bar.baz',
            'password' => bcrypt('123456')
        ]);
        $user->save();
        $this->visit('/login')
         ->type('foo@bar.baz', 'email')
         ->type('123456', 'password')
         ->press('Login')
         ->seePageIs('/');
    }
}
