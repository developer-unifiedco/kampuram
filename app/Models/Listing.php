<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Listing extends Model
{
    use HasFactory;

    public const SECTION_MEDIA = 1;

    public const SECTION_CARDS = 2;

    public const SECTION_BOOKS = 3;

    public const SECTION_DIGI_WORLD = 4;

    public const MEDIA_IMAGE = 1;

    public const MEDIA_VIDEO = 2;

    public const STATUS_HIDDEN = 0;

    public const STATUS_PUBLISHED = 1;

    public const SECTIONS = [
        'media' => self::SECTION_MEDIA,
        'cards' => self::SECTION_CARDS,
        'books' => self::SECTION_BOOKS,
        'digi-world' => self::SECTION_DIGI_WORLD,
    ];

    public const SECTION_SLUGS = [
        self::SECTION_MEDIA => 'media',
        self::SECTION_CARDS => 'cards',
        self::SECTION_BOOKS => 'books',
        self::SECTION_DIGI_WORLD => 'digi-world',
    ];

    public const SECTION_LABELS = [
        self::SECTION_MEDIA => 'Kampuram Media',
        self::SECTION_CARDS => 'Cards Kendra',
        self::SECTION_BOOKS => 'Kampuram Books',
        self::SECTION_DIGI_WORLD => 'Kampuram Digi World',
    ];

    public const SECTION_ITEM_NAMES = [
        self::SECTION_MEDIA => 'creative',
        self::SECTION_CARDS => 'card',
        self::SECTION_BOOKS => 'book',
        self::SECTION_DIGI_WORLD => 'service',
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'section',
        'title',
        'description',
        'service_formats',
        'price',
        'media_type',
        'media_path',
        'media_original_name',
        'media_mime_type',
        'media_size_bytes',
        'poster_path',
        'status',
        'sort_order',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'section' => 'integer',
            'media_type' => 'integer',
            'status' => 'integer',
            'sort_order' => 'integer',
            'price' => 'decimal:2',
            'media_size_bytes' => 'integer',
        ];
    }

    public static function sectionIdFromSlug(?string $slug): ?int
    {
        return self::SECTIONS[$slug] ?? null;
    }

    public static function slugFromSectionId(int $sectionId): ?string
    {
        return self::SECTION_SLUGS[$sectionId] ?? null;
    }

    public function getSectionSlugAttribute(): string
    {
        return self::SECTION_SLUGS[$this->section] ?? 'unknown';
    }

    public function isPublished(): bool
    {
        return $this->status === self::STATUS_PUBLISHED;
    }

    public function isHidden(): bool
    {
        return $this->status === self::STATUS_HIDDEN;
    }

    public function isVideo(): bool
    {
        return $this->media_type === self::MEDIA_VIDEO;
    }

    public function isImage(): bool
    {
        return $this->media_type === self::MEDIA_IMAGE;
    }

    /**
     * Scope query to published listings only.
     */
    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_PUBLISHED);
    }

    /**
     * Scope query to a specific section by ID or slug.
     */
    public function scopeSection(Builder $query, int|string $section): Builder
    {
        $id = is_string($section) ? (self::SECTIONS[$section] ?? null) : $section;

        return $query->where('section', $id);
    }

    /**
     * Scope query to deterministic total ordering: sort_order ASC, created_at DESC, id ASC.
     */
    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order', 'asc')
            ->orderBy('created_at', 'desc')
            ->orderBy('id', 'asc');
    }
}
