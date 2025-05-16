<?php

use App\Http\Controllers\MonthController;
use App\Http\Controllers\YearController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ClassesController;
use App\Http\Controllers\SidebarController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\StudentReportController;
use App\Http\Controllers\StudentTuitionController;
use App\Http\Controllers\UserController;
use App\Models\ClassModel;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');
Route::post('/login', [UserController::class, 'login']);
Route::post('/logout', [UserController::class, 'logout']);

Route::put('/users/{email}/status', [UserController::class, 'updateStatus']);
Route::get('/users', [UserController::class, 'getAllUsers']);

Route::get('/user/{email}', [UserController::class, 'show']);
Route::put('/users/{email}', [UserController::class, 'update']);
Route::get('/users/{email}', [UserController::class, 'show']);
Route::put('/mode/{email}', [UserController::class, 'updateMode']);
Route::get('/mode/{email}', [UserController::class, 'getMode']);

Route::get('/student', [StudentController::class, 'index']);
Route::post('/student', [StudentController::class, 'store']);
Route::put('/student/{id}', [StudentController::class, 'update']);

Route::get('/student/{id}', [StudentController::class, 'show']);
Route::get('/students/search', [StudentController::class, 'search']);
Route::put('/student/status/{sno}', [StudentController::class, 'updateStatus']);
Route::get('/history', [StudentReportController::class, 'history']);
Route::post('/send-whatsapp-messages', [StudentReportController::class, 'sendWhatsAppMessages']);
Route::post('/update-day', [ClassesController::class, 'updateDay']);
Route::get('/classes', [ClassesController::class, 'getAllClasses']);
Route::post('/gradesAndDays', [ClassesController::class, 'getGradesAndDays']);
Route::post('/grades', [ClassesController::class, 'getGrades']);

Route::post('/dashboard-stats', [StudentReportController::class, 'dashboardStats']);
Route::post('/get-dashboard-data', [ClassesController::class, 'getDashboardData']);
Route::get('/months', [MonthController::class, 'getMonths']);
Route::get('/years', [YearController::class, 'getYears']);

// after adding new structure
Route::get('/category-with-grades', [SidebarController::class, 'getCategoryWithGrades']);
Route::post('/fetch-student-data', [StudentReportController::class, 'fetchStudentData']);
Route::post('/reports', [StudentReportController::class, 'weekStatus']);
Route::post('/paid', [StudentReportController::class, 'paidStatus']);
Route::put('/status/{id}', [StudentTuitionController::class, 'status']);
Route::post('/send-message-to-tuitions', [StudentReportController::class, 'sendMessageToTuitions']);
Route::get('/send-payment-reminders', [StudentReportController::class, 'sendPaymentReminders']);


