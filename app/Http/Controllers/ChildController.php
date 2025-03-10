<?php

namespace App\Http\Controllers;

use App\Models\Child;

class ChildController extends Controller
{
    // Fetch all children
    public function index()
    {
        $children = Child::all();  // Get all children from the database
        return response()->json($children);  // Return them as a JSON response
    }
}
