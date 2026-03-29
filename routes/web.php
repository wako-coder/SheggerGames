<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GamesController;

Route::get('/', [GamesController::class, 'home'])->name('home');

// Route for game details page
Route::get('/game-details/{id?}', [GamesController::class, 'showGame'])->name('game.details');
Route::get('/games', [GamesController::class, 'allGames'])->name('games.all');


