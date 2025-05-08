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
        Schema::create('students_has_tuitions', function (Blueprint $table) {
            $table->id(); // Auto-incrementing primary key
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade'); // Foreign key to students table
            $table->foreignId('tuition_id')->constrained('classes')->onDelete('cascade'); // Foreign key to classes table
            $table->boolean('status')->default(true); // Status column (TINYINT(1))
            $table->timestamps(); // Adds created_at and updated_at columns
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students_has_tuitions');
    }
};