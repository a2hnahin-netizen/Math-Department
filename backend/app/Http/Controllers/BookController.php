<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class BookController extends Controller
{
    // Public: Get only available books
    public function available()
    {
        return \App\Models\Book::where('is_available', true)
            ->select('title', 'author', 'accession_number')
            ->orderBy('title')
            ->get();
    }

    // Admin: Get all books
    public function index()
    {
        return \App\Models\Book::orderBy('created_at', 'desc')->get();
    }

    // Admin: Add new book
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required',
            'author' => 'required',
            'accession_number' => 'required|unique:books',
            'quantity' => 'required|integer|min:1'
        ]);

        $book = \App\Models\Book::create($request->all());
        return response()->json(['message' => 'Book added', 'book' => $book]);
    }

    // Admin: Lend book
    public function lend(Request $request, $id)
    {
        $request->validate([
            'borrower_name' => 'required',
            'borrower_roll' => 'required',
            'borrower_session' => 'required',
            'borrower_program' => 'required',
            'borrower_phone' => 'required'
        ]);

        $book = \App\Models\Book::find($id);
        if (!$book || !$book->is_available) {
            return response()->json(['message' => 'Book not available'], 400);
        }

        $book->update([
            'is_available' => false,
            'borrower_name' => $request->borrower_name,
            'borrower_roll' => $request->borrower_roll,
            'borrower_session' => $request->borrower_session,
            'borrower_program' => $request->borrower_program,
            'borrower_phone' => $request->borrower_phone,
            'borrowed_at' => now()
        ]);

        return response()->json(['message' => 'Book lent successfully', 'book' => $book]);
    }

    // Admin: Return book
    public function returnBook($id)
    {
        $book = \App\Models\Book::find($id);
        if (!$book || $book->is_available) {
            return response()->json(['message' => 'Book is already available'], 400);
        }

        $book->update([
            'is_available' => true,
            'borrower_name' => null,
            'borrower_roll' => null,
            'borrower_session' => null,
            'borrower_program' => null,
            'borrower_phone' => null,
            'borrowed_at' => null
        ]);

        return response()->json(['message' => 'Book returned successfully', 'book' => $book]);
    }

    public function destroy($id)
    {
        \App\Models\Book::destroy($id);
        return response()->json(['message' => 'Book deleted']);
    }
}
