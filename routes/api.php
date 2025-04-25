<?php

use App\Http\Controllers\MonthController;
use App\Http\Controllers\YearController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ClassesController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\StudentReportController;
use App\Http\Controllers\UserController;
use App\Models\Classes;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/dashboard-stats', [StudentReportController::class, 'dashboardStats']);
Route::get('/monthly-attendance-stats', [StudentReportController::class, 'monthlyAttendanceStats']);
Route::get('/classes-count', function () {
    return response()->json(['count' => Classes::count()]);
});
Route::get('/recent-payments', [StudentReportController::class, 'recentPayments']);

Route::put('/users/{email}', [UserController::class, 'update']);
Route::get('/users/{email}', [UserController::class, 'show']);
Route::put('/mode/{email}', [UserController::class, 'updateMode']);
Route::get('/mode/{email}', [UserController::class, 'getMode']);

Route::get('/student', [StudentController::class, 'index']);
Route::post('/student', [StudentController::class, 'store']);
Route::put('/student/{id}', [StudentController::class, 'update']);
Route::put('/status/{id}', [StudentController::class, 'status']);
Route::get('/student/{id}', [StudentController::class, 'show']);
Route::get('/students/search', [StudentController::class, 'search']);
Route::put('/student/status/{sno}', [StudentController::class, 'updateStatus']);
Route::post('/reports', [StudentReportController::class, 'store']);
Route::post('/paid', [StudentReportController::class, 'paid']);
Route::get('/reports/{grade}', [StudentReportController::class, 'reports']);
Route::get('/history', [StudentReportController::class, 'history']);

Route::post('/send-whatsapp-messages', [StudentReportController::class, 'sendWhatsAppMessages']);
Route::post('/days', [ClassesController::class, 'days']);
Route::post('/get-day', [ClassesController::class, 'getDay']);

Route::get('/months', [MonthController::class, 'getMonths']);
Route::get('/years', [YearController::class, 'getYears']);


