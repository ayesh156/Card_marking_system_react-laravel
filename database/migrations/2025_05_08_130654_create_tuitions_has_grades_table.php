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
        Schema::create('tuitions_has_grades', function (Blueprint $table) {
            $table->id(); // Auto-incrementing primary key
            $table->foreignId('tuition_id')->constrained('tuitions')->onDelete('cascade'); // Foreign key to tuitions table
            $table->foreignId('grade_id')->constrained('grades')->onDelete('cascade'); // Foreign key to grades table
            $table->timestamps(); // Adds created_at and updated_at columns
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tuitions_has_grades');
    }
};