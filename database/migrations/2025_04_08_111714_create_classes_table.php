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
        Schema::create('classes', function (Blueprint $table) {
            $table->id(); // Auto-incrementing primary key
            $table->string('class_name', 1)->nullable(); // Revert class_name to not nullable
            $table->string('grade', 1)->nullable(); // Revert grade to not nullable
            $table->unsignedBigInteger('day_id'); // Foreign key to days table
            $table->timestamps(); // Adds created_at and updated_at columns

            // Add foreign key constraint
            $table->foreign('day_id')->references('id')->on('days')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('classes');
    }
};
