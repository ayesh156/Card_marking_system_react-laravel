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
        Schema::create('student_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade'); // Foreign key to students table
            $table->foreignId('class_id')->constrained('classes')->onDelete('cascade'); // Foreign key to classes table
            $table->foreignId('month_id')->constrained('months')->onDelete('cascade');
            $table->foreignId('year_id')->constrained('years')->onDelete('cascade');
            $table->boolean('week1')->default(false); // Boolean column for week 1
            $table->boolean('week2')->default(false); // Boolean column for week 2
            $table->boolean('week3')->default(false); // Boolean column for week 3
            $table->boolean('week4')->default(false); // Boolean column for week 4
            $table->boolean('week5')->default(false); // Boolean column for week 5
            $table->boolean('paid')->default(false); // Boolean column for paid status
            $table->timestamps(); // Adds created_at and updated_at columns
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_reports');
    }
};
