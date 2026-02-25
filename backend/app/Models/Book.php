<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    protected $fillable = [
        'title',
        'author',
        'accession_number',
        'quantity',
        'is_available',
        'borrower_name',
        'borrower_roll',
        'borrower_session',
        'borrower_program',
        'borrower_phone',
        'borrowed_at'
    ];
}
