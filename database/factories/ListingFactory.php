<?php

namespace Database\Factories;

use App\Models\Listing;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Listing>
 */
class ListingFactory extends Factory
{
    protected $model = Listing::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'section' => Listing::SECTION_MEDIA,
            'title' => fake()->sentence(3),
            'description' => fake()->paragraph(),
            'service_formats' => null,
            'price' => fake()->randomFloat(2, 50, 5000),
            'media_type' => Listing::MEDIA_IMAGE,
            'media_path' => 'uploads/sample.jpg',
            'media_original_name' => 'sample.jpg',
            'media_mime_type' => 'image/jpeg',
            'media_size_bytes' => 102400,
            'poster_path' => null,
            'status' => Listing::STATUS_HIDDEN,
            'sort_order' => 0,
        ];
    }

    public function published(): static
    {
        return $this->state(fn () => [
            'status' => Listing::STATUS_PUBLISHED,
        ]);
    }

    public function hidden(): static
    {
        return $this->state(fn () => [
            'status' => Listing::STATUS_HIDDEN,
        ]);
    }

    public function media(): static
    {
        return $this->state(fn () => [
            'section' => Listing::SECTION_MEDIA,
            'service_formats' => null,
        ]);
    }

    public function cards(): static
    {
        return $this->state(fn () => [
            'section' => Listing::SECTION_CARDS,
            'media_type' => Listing::MEDIA_IMAGE,
            'poster_path' => null,
            'service_formats' => null,
        ]);
    }

    public function books(): static
    {
        return $this->state(fn () => [
            'section' => Listing::SECTION_BOOKS,
            'media_type' => Listing::MEDIA_IMAGE,
            'poster_path' => null,
            'service_formats' => null,
        ]);
    }

    public function digiWorld(): static
    {
        return $this->state(fn () => [
            'section' => Listing::SECTION_DIGI_WORLD,
            'price' => null,
            'service_formats' => "Promotional posts\nEvent announcements\nSocial media creatives",
        ]);
    }

    public function video(): static
    {
        return $this->state(fn () => [
            'media_type' => Listing::MEDIA_VIDEO,
            'media_path' => 'uploads/sample.mp4',
            'media_original_name' => 'sample.mp4',
            'media_mime_type' => 'video/mp4',
            'media_size_bytes' => 1048576,
            'poster_path' => 'posters/sample.jpg',
        ]);
    }
}
