<?php

use App\Http\Controllers\ChildController;
use App\Http\Controllers\MonthController;
use App\Http\Controllers\YearController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ChildReportController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::get('/children', [ChildController::class, 'index']);
Route::get('/months', [MonthController::class, 'getMonths']);
Route::get('/years', [YearController::class, 'getYears']);
Route::post('/save_report', [ChildReportController::class, 'store']);
Route::post('/update_paid_status', [ChildReportController::class, 'updatePaidStatus']);
// api.php
Route::get('/child_reports/{childId}', [ChildReportController::class, 'getChildReport']);
