<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SiteSetting extends Model
{
    use HasFactory;

    public const SITE_SETTINGS_ID = 1;

    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $primaryKey = 'id';

    /**
     * Indicates if the IDs are auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = false;

    /**
     * The "type" of the auto-incrementing ID.
     *
     * @var string
     */
    protected $keyType = 'int';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'id',
        'whatsapp_number',
    ];

    /**
     * Get or create the singleton instance.
     */
    public static function current(): self
    {
        return static::firstOrCreate(
            ['id' => self::SITE_SETTINGS_ID],
            ['whatsapp_number' => '919388002975']
        );
    }

    /**
     * Normalize a phone number to pure digits.
     */
    public static function normalizeNumber(?string $raw): ?string
    {
        if ($raw === null) {
            return null;
        }

        $digits = preg_replace('/\D+/', '', $raw);

        return $digits !== '' ? $digits : null;
    }
}
