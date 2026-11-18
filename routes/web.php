<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ReportController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::view('/ingresar','login')->name('login');
    Route::post('/ingresar',[AuthController::class,'login'])->middleware('throttle:8,1')->name('login.submit');
});

Route::middleware('auth')->group(function () {
    Route::view('/','app')->name('inicio');
    Route::post('/salir',[AuthController::class,'logout'])->name('logout');
    // API interna protegida por sesión de usuario + token CSRF.
    Route::get('/api/reportes',[ReportController::class,'index']);
    Route::post('/api/reportes',[ReportController::class,'store']);
    Route::put('/api/reportes/{report}',[ReportController::class,'update']);
    Route::patch('/api/reportes/{report}/estado',[ReportController::class,'changeStatus']);
    Route::delete('/api/reportes/{report}',[ReportController::class,'destroy']);
    Route::post('/api/reportes/importar',[ReportController::class,'importBackup']);
});
