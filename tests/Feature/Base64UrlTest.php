<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Custom\Base64Url;

class Base64UrlTest extends TestCase
{
    public function testEncodeAndDecode()
    {
        $testString = 'base64 test string 123';
        $encoded = Base64Url::encode($testString);
        $this->assertEquals($testString, Base64Url::decode($encoded));
    }
    public function testGenerateUnderLimit() {
        $this->expectException('InvalidArgumentException');
        Base64Url::generate(5);
    }
    public function testGenerateOverLimit() {
        $this->expectException('InvalidArgumentException');
        Base64Url::generate(17);
    }
    public function testGenerateWrongType() {
        $this->expectException('InvalidArgumentException');
        Base64Url::generate('teststring123');
    }
}
