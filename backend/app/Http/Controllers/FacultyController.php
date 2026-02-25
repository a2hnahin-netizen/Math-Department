<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Faculty;
use Illuminate\Support\Facades\Storage;

class FacultyController extends Controller
{
    // GET /api/faculty - List all faculty members
    public function index()
    {
        $faculty = Faculty::where('is_active', true)
            ->orderBy('order', 'asc')
            ->orderBy('name', 'asc')
            ->get();
        return response()->json($faculty);
    }

    // GET /api/faculty/all - List all faculty members (including inactive) for admin
    public function all()
    {
        $faculty = Faculty::orderBy('order', 'asc')
            ->orderBy('name', 'asc')
            ->get();
        return response()->json($faculty);
    }

    // GET /api/faculty/{id} - Get single faculty member
    public function show($id)
    {
        $faculty = Faculty::find($id);
        if (!$faculty) {
            return response()->json(['message' => 'Faculty not found'], 404);
        }
        return response()->json($faculty);
    }

    // POST /api/faculty - Create new faculty member
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'designation' => 'required|string|max:255',
            'qualification' => 'nullable|string|max:255',
            'specialization' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'image' => 'nullable', // Allow file or string URL
            'order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('public/faculty');
            $imagePath = str_replace('public/', 'storage/', $path);
        } elseif ($request->filled('image') && is_string($request->input('image'))) {
            $imagePath = $request->input('image');
        }

        $faculty = Faculty::create([
            'name' => $validated['name'],
            'designation' => $validated['designation'],
            'qualification' => $validated['qualification'] ?? null,
            'specialization' => $validated['specialization'] ?? null,
            'email' => $validated['email'] ?? null,
            'phone' => $validated['phone'] ?? null,
            'image_path' => $imagePath,
            'order' => $validated['order'] ?? 0,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return response()->json([
            'message' => 'Faculty member created successfully',
            'faculty' => $faculty
        ], 201);
    }

    // PUT /api/faculty/{id} - Update faculty member
    public function update(Request $request, $id)
    {
        $faculty = Faculty::find($id);
        if (!$faculty) {
            return response()->json(['message' => 'Faculty not found'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'designation' => 'sometimes|required|string|max:255',
            'qualification' => 'nullable|string|max:255',
            'specialization' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'image' => 'nullable', // Allow file or string URL
            'order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        if ($request->hasFile('image')) {
            // Delete old image if exists and is local (not a URL)
            if ($faculty->image_path && !filter_var($faculty->image_path, FILTER_VALIDATE_URL)) {
                $oldPath = str_replace('storage/', 'public/', $faculty->image_path);
                Storage::delete($oldPath);
            }
            $path = $request->file('image')->store('public/faculty');
            $validated['image_path'] = str_replace('public/', 'storage/', $path);
        } elseif ($request->filled('image') && is_string($request->input('image'))) {
            // If it's a URL, just update the path. No need to delete old local file mechanically unless we want to clean up.
            // Let's keep it simple and just update the reference.
            $validated['image_path'] = $request->input('image');
        }

        $faculty->update($validated);

        return response()->json([
            'message' => 'Faculty member updated successfully',
            'faculty' => $faculty
        ]);
    }

    // DELETE /api/faculty/{id} - Delete faculty member
    public function destroy($id)
    {
        $faculty = Faculty::find($id);
        if (!$faculty) {
            return response()->json(['message' => 'Faculty not found'], 404);
        }

        // Delete image if exists
        if ($faculty->image_path) {
            $oldPath = str_replace('storage/', 'public/', $faculty->image_path);
            Storage::delete($oldPath);
        }

        $faculty->delete();

        return response()->json(['message' => 'Faculty member deleted successfully']);
    }
}
