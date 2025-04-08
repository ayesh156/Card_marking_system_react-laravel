<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('child', function (Blueprint $table) {
            $table->id();
            $table->string('sno', 20)->unique(); // varchar(20)
            $table->string('name', 100);         // varchar(100)
            $table->text('address1')->nullable();      // varchar(10)
            $table->text('address2')->nullable();      // varchar(10)
            $table->text('school')->nullable();        // varchar(10)
            $table->string('gName', 100)->nullable();
            $table->string('gMobile', 10)->nullable();       // varchar(10)
            $table->string('gWhatsapp', 10)->nullable();     // varchar(10)
            $table->string('gender', 10)->nullable();       
            $table->date('dob')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('child');
    }
};
