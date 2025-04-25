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
            $table->string('password', 20)->nullable();
            $table->string('Before_Payment_Template', 100)->nullable();
            $table->string('After_Payment_Template', 100)->nullable();
            $table->boolean('status')->default(true);
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