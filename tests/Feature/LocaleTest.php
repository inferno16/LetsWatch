<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class LocaleTest extends TestCase
{
    public function testChangeLocale()
    {
        $response = $this->post('changelocale', [
            'locale' => 'en'
        ]);
        $this->assertTrue(session()->has('locale'));
        $response->assertStatus(302);
        $this->get('/');
    }

    public function testChangeLocaleToInvalid()
    {
        $this->expectException(\Illuminate\Validation\ValidationException::class);
        $response = $this->post('changelocale', [
            'locale' => 'tr'
        ]);
        $response->assertSessionHasErrors();
    }

    public function testLocaleIsInvalid()
    {
        session()->put('locale', 'tr');
        $this->get('/');
        $this->assertEquals('en', \App::getLocale());
    }
}
