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
        Schema::create('users', function (Blueprint $table) {
            $table->id(); // Auto-increment ID
            $table->string('name', 50);
            $table->string('email', 100)->unique();
            $table->string('password', 100)->nullable(); // Updated length to match the schema
            $table->string('before_payment_week3', 100)->nullable(); // Added this column
            $table->string('before_payment_week4', 100)->nullable(); // Added this column
            $table->string('after_payment_template', 100)->nullable(); // Updated column name
            $table->boolean('status')->default(true); // Default value is true
            $table->string('mode', 1);
            $table->text('image_path')->nullable();
            $table->timestamps(); // Created_at and Updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};