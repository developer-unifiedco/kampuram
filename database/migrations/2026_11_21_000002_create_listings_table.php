<?php

use App\Models\Listing;
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
        Schema::create('listings', function (Blueprint $table) {
            $table->id();
            $table->unsignedTinyInteger('section');
            $table->string('title', 255);
            $table->text('description')->nullable();
            $table->text('service_formats')->nullable();
            $table->decimal('price', 10, 2)->nullable();
            $table->unsignedTinyInteger('media_type')->nullable();
            $table->string('media_path', 255)->nullable();
            $table->string('media_original_name', 255)->nullable();
            $table->string('media_mime_type', 127)->nullable();
            $table->unsignedInteger('media_size_bytes')->nullable();
            $table->string('poster_path', 255)->nullable();
            $table->unsignedTinyInteger('status')->default(Listing::STATUS_HIDDEN);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->index(['section', 'status', 'sort_order']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('listings');
    }
};
