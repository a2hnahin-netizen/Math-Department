<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\NoticeController;
use App\Http\Controllers\FacultyController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::get('/landing-content', [AdminController::class, 'getLandingContent']);

Route::prefix('admin')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard']);
    Route::post('/login', [AdminController::class, 'login']);
});

// Notice Board Routes
Route::get('/notices', [NoticeController::class, 'index']);
Route::post('/notices', [NoticeController::class, 'store']);
Route::delete('/notices/{id}', [NoticeController::class, 'destroy']);

// Faculty Routes
Route::get('/faculty', [FacultyController::class, 'index']);
Route::get('/faculty/all', [FacultyController::class, 'all']);
Route::get('/faculty/{id}', [FacultyController::class, 'show']);
Route::post('/faculty', [FacultyController::class, 'store']);
Route::put('/faculty/{id}', [FacultyController::class, 'update']);
Route::post('/faculty/{id}', [FacultyController::class, 'update']); // For form-data updates
Route::delete('/faculty/{id}', [FacultyController::class, 'destroy']);

// Resource Routes
use App\Http\Controllers\ResourceController;
Route::get('/resources', [ResourceController::class, 'index']);
Route::post('/resources', [ResourceController::class, 'store']);
Route::delete('/resources/{id}', [ResourceController::class, 'destroy']);

// Seminar Library Book Routes
use App\Http\Controllers\BookController;
Route::get('/books/available', [BookController::class, 'available']);
Route::get('/books', [BookController::class, 'index']);
Route::post('/books', [BookController::class, 'store']);
Route::delete('/books/{id}', [BookController::class, 'destroy']);
Route::post('/books/{id}/lend', [BookController::class, 'lend']);
Route::post('/books/{id}/return', [BookController::class, 'returnBook']);

// Contact Message Routes
use App\Http\Controllers\ContactController;
Route::post('/contact', [ContactController::class, 'store']);
Route::get('/admin/messages', [ContactController::class, 'index']);
Route::get('/admin/messages/unread-count', [ContactController::class, 'unreadCount']);
Route::post('/admin/messages/{id}/read', [ContactController::class, 'markAsRead']);
Route::delete('/admin/messages/{id}', [ContactController::class, 'destroy']);
