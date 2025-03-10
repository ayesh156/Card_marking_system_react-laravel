<?php

namespace App\Http\Controllers;

use App\Models\Month;
use Illuminate\Http\Request;

class MonthController extends Controller
{
    // Get all months
    public function getMonths()
    {
        try {
            $months = Month::all();
            return response()->json($months);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch months: ' . $e->getMessage()], 500);
        }
    }
}
