<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('child_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('child_id')->constrained('child')->onDelete('cascade'); // Explicitly reference the 'child' table
            $table->foreignId('month_id')->constrained('months')->onDelete('cascade');
            $table->foreignId('year_id')->constrained('years')->onDelete('cascade');
            $table->boolean('week1')->default(false);
            $table->boolean('week2')->default(false);
            $table->boolean('week3')->default(false);
            $table->boolean('week4')->default(false);
            $table->boolean('week5')->default(false);
            $table->boolean('paid')->default(false);
            $table->timestamps();
        });
    }
    

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('child_reports');
    }
};
