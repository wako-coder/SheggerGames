<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GamesController;
use App\Http\Controllers\LoginController;

// Public routes
Route::get('/', [GamesController::class, 'home'])->name('home');

// Auth routes
Route::get('/login', [LoginController::class, 'showLoginForm'])->name('login');
Route::post('/login', [LoginController::class, 'authenticate'])->name('login-form');
Route::post('/logout', [LoginController::class, 'logout'])->name('logout');
Route::get('/contact', [App\Http\Controllers\ContactController::class, 'show'])->name('contact');
Route::post('/contact', [App\Http\Controllers\ContactController::class, 'store'])->name('contact.store');
Route::view('/about', 'pages.about')->name('about');
Route::view('/terms-and-conditions', 'pages.terms')->name('terms');

// Game routes (public)
Route::get('/game-details/{id?}', [GamesController::class, 'showGame'])->name('game.details');
Route::middleware(['auth', ])->group(function () {
    
    });
Route::get('/all-games', [GamesController::class, 'allGames'])->name('games.all');

Route::get('/locale/{locale}', function ($locale) {
    if (in_array($locale, ['en', 'am', 'om'])) {
        session(['locale' => $locale]);
    }
    return redirect()->back();
})->name('locale.switch');
