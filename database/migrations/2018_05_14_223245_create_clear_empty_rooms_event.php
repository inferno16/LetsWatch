<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateClearEmptyRoomsEvent extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $file_path = '/sql/clean_empty_rooms.sql';
        $sql = file_get_contents(database_path().$file_path);
        DB::unprepared('SET @@global.event_scheduler = 1;'); // Enabling the event scheduler thread
        DB::unprepared($sql); // Creating events requires unprepared statement
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::unprepared('SET @@global.event_scheduler = 0;'); // Disabling the event scheduler thread
        DB::unprepared('DROP EVENT IF EXISTS `clean_empty_rooms`');
    }
}
