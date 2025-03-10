<?php

namespace App\Http\Controllers;

use App\Models\Year;
use Illuminate\Http\Request;

class YearController extends Controller
{
    public function getYears()
    {
        $years = Year::all();
        return response()->json($years);
    }
}
