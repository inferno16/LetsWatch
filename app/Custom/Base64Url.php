<?php
    namespace App\Custom;

    class Base64Url {
        static function encode($data) {
            return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
        }
        static function decode($data) {
            return base64_decode(str_pad(strtr($data, '-_', '+/'), strlen($data) % 4, '=', STR_PAD_RIGHT));
        }
        static function generate($length) {
            if(!is_int($length) || $length > 16 || $length < 6)
                throw new \InvalidArgumentException('Expected argument is Integer (min:6 max:16). Input was: '.$length);
            $str = "";
            $alphabet = array_merge(range('A','Z'), range('a', 'z'), range('0', '9'), ['-', '_']);
            $max = count($alphabet) - 1;
            for($i=0; $i < $length; $i++) {
                $rand = mt_rand(0, $max);
                
                $str .= $alphabet[$rand];
            }
            return $str;
        }
    }
?>