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
            $table->id(); // Auto-increment ID
            $table->string('sno', 20)->unique(); // Student number (varchar(20))
            $table->string('name', 100); // Student name (varchar(100))
            $table->text('address1')->nullable(); // Address line 1 (text)
            $table->text('address2')->nullable(); // Address line 2 (text)
            $table->text('school')->nullable(); // School name (text)
            $table->string('g_name', 100)->nullable(); // Guardian name (varchar(100))
            $table->string('g_mobile', 10)->nullable(); // Guardian mobile (varchar(10))
            $table->string('g_whatsapp', 10)->nullable(); // Guardian WhatsApp (varchar(10))
            $table->string('gender', 10)->nullable(); // Gender (varchar(10))
            $table->date('dob')->nullable(); // Date of birth (date)
            $table->timestamps(); // Created_at and Updated_at
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