<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Notice;

class NoticeController extends Controller
{
    // GET /api/notices - List all notices
    public function index()
    {
        $notices = Notice::orderBy('published_at', 'desc')->get();
        return response()->json($notices);
    }

    // POST /api/notices - Create new notice
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|in:HSC,Honours,Masters',
            'description' => 'required|string',
            'file' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120', // Optional, max 5MB
        ]);

        $path = null;
        if ($request->hasFile('file')) {
            $path = $request->file('file')->store('public/notices');
        }

        $notice = Notice::create([
            'title' => $validated['title'],
            'category' => $validated['category'],
            'description' => $validated['description'],
            'file_path' => $path ? str_replace('public/', 'storage/', $path) : null,
            'published_at' => now(),
        ]);

        return response()->json([
            'message' => 'Notice created successfully',
            'notice' => $notice
        ], 201);
    }

    // DELETE /api/notices/{id} - Delete notice
    public function destroy($id)
    {
        // Logic:
        // 1. Find notice by ID
        // 2. Delete file from storage
        // 3. Delete record from DB
        return response()->json(['message' => 'Notice deleted successfully']);
    }
}
