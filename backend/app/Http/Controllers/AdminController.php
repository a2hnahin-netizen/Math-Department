<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function getLandingContent()
    {
        // Placeholder data for landing page
        return response()->json([
            'notices' => [],
            'gallery' => [],
            'faculty' => []
        ]);
    }

    public function dashboard()
    {
        return response()->json([
            'message' => 'Welcome to Super Admin Dashboard',
            'stats' => [
                'users' => 10,
                'posts' => 5
            ]
        ]);
    }

    public function login(Request $request)
    {
        // TODO: Implement login logic
        return response()->json(['token' => 'dummy-token']);
    }
}
