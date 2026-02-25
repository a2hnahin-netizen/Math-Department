<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('faculty', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('designation'); // e.g., Professor, Associate Professor, Lecturer
            $table->string('qualification')->nullable(); // e.g., PhD, M.Sc.
            $table->string('specialization')->nullable(); // e.g., Abstract Algebra, Number Theory
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('image_path')->nullable(); // Profile picture
            $table->integer('order')->default(0); // For sorting display order
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('faculty');
    }
};
