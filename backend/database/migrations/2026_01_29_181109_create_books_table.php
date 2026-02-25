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
        Schema::create('books', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('author');
            $table->string('accession_number')->unique();
            $table->boolean('is_available')->default(true);

            // Borrower Details
            $table->string('borrower_name')->nullable();
            $table->string('borrower_roll')->nullable();
            $table->string('borrower_session')->nullable();
            $table->string('borrower_program')->nullable();
            $table->string('borrower_phone')->nullable();
            $table->timestamp('borrowed_at')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('books');
    }
};
