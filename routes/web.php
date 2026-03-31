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

// Protected game routes (require authentication)
Route::middleware(['auth'])->group(function () {
    });
    Route::get('/game-details/{id?}', [GamesController::class, 'showGame'])->name('game.details');
    Route::get('/all-games', [GamesController::class, 'allGames'])->name('games.all');
