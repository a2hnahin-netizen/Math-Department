<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ResourceController extends Controller
{
    public function index()
    {
        return \App\Models\Resource::where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required',
            'category' => 'required',
            'file' => 'required|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:10240'
        ]);

        $resource = new \App\Models\Resource();
        $resource->title = $request->title;
        $resource->description = $request->description;
        $resource->category = $request->category;

        if ($request->hasFile('file')) {
            $path = $request->file('file')->store('resources', 'public');
            $resource->file_path = 'storage/' . $path;
        }

        $resource->save();
        return response()->json(['message' => 'Resource created', 'resource' => $resource]);
    }

    public function destroy($id)
    {
        $resource = \App\Models\Resource::find($id);
        if ($resource) {
            $resource->delete();
            return response()->json(['message' => 'Resource deleted']);
        }
        return response()->json(['message' => 'Resource not found'], 404);
    }
}
