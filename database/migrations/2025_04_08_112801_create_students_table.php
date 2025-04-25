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
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->string('sno', 20)->unique(); // varchar(20)
            $table->string('name', 100);         // varchar(100)
            $table->text('address1')->nullable(); // text
            $table->text('address2')->nullable(); // text
            $table->text('school')->nullable();   // text
            $table->string('g_name', 100)->nullable(); // varchar(100)
            $table->string('g_mobile', 10)->nullable(); // varchar(10)
            $table->string('g_whatsapp', 10)->nullable(); // varchar(10)
            $table->string('gender', 10)->nullable(); // varchar(10)
            $table->date('dob')->nullable(); // date
            $table->boolean('maths')->default(false); // Boolean column for maths
            $table->boolean('english')->default(false); // Boolean column for english
            $table->boolean('scholarship')->default(false); // Boolean column for scholarship
            $table->string('grade', 1)->nullable(); // Grade column with a maximum length of 1
            $table->boolean('status')->default(true); // Add status column with default value true
            $table->timestamps();
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
