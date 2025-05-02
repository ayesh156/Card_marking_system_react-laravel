<?php

namespace App\Http\Controllers;

use App\Models\StudentTuition;
use Illuminate\Http\Request;

class StudentTuitionController extends Controller
{
    // change status a student
    public function status($id, Request $request)
    {
        // Validate the request
        $request->validate([
            'tuitionId' => 'required|exists:tuitions,id', // Ensure tuitionId exists in the tuitions table
        ]);

        // Find the record in the students_has_tuitions table
        $studentTuition = StudentTuition::where('student_id', $id)
            ->where('tuition_id', $request->tuitionId)
            ->first();

        if (!$studentTuition) {
            return response()->json([
                'message' => 'Student tuition record not found!',
            ], 404);
        }

        // Toggle the status
        $studentTuition->status = !$studentTuition->status;
        $studentTuition->save();

        return response()->json([
            'message' => 'Student tuition status updated successfully!',
            'data' => $studentTuition,
        ], 200);
    }
}
