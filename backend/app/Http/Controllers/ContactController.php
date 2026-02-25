<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    // Public: Store a new message
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'email' => 'required|email',
            'message' => 'required'
        ]);

        ContactMessage::create($request->all());

        return response()->json(['message' => 'Message sent successfully']);
    }

    // Admin: Get all messages
    public function index()
    {
        return ContactMessage::orderBy('created_at', 'desc')->get();
    }

    // Admin: Mark message as read
    public function markAsRead($id)
    {
        $msg = ContactMessage::find($id);
        if ($msg) {
            $msg->update(['is_read' => true]);
        }
        return response()->json(['message' => 'Marked as read']);
    }

    // Admin: Delete message
    public function destroy($id)
    {
        ContactMessage::destroy($id);
        return response()->json(['message' => 'Message deleted']);
    }

    // Admin: Get unread count
    public function unreadCount()
    {
        return response()->json(['count' => ContactMessage::where('is_read', false)->count()]);
    }
}
