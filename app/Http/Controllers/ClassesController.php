<?php

namespace App\Http\Controllers;

use App\Models\Classes;
use Illuminate\Http\Request;

class ClassesController extends Controller
{
    public function days(Request $request)
    {
        $grade = $request->input('grade');
        $class = $request->input('class');
        $dayId = $request->input('day_id');

        // Check if a record already exists for the given grade and class
        $existingRecord = Classes::where('grade', $grade)
            ->where('class_name', $class)
            ->first();

        if ($existingRecord) {
            // Update the existing record
            $existingRecord->day_id = $dayId;
            $existingRecord->save();

            return response()->json(['message' => 'Record updated successfully']);
        } else {
            // Create a new record
            Classes::create([
                'grade' => $grade,
                'class_name' => $class,
                'day_id' => $dayId,
            ]);

            return response()->json(['message' => 'Record created successfully']);
        }
    }

    public function getDay(Request $request)
    {
        $grade = $request->input('grade');
        $class = $request->input('class');

        // Query the "classes" table for a matching grade and class
        $result = Classes::where('grade', $grade)
            ->where('class_name', $class)
            ->first();

        if ($result) {
            return response()->json(['day' => $result->day_id]); // Return the day_id
        }

        return response()->json(['day' => '']); // Return empty if no match is found
    }
}
