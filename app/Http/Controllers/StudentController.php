<?php

namespace App\Http\Controllers;

use App\Http\Requests\StudentRequest;
use App\Models\Student;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    public function index()
    {
        $children = Student::all();
        return response()->json($children);
    }

    /**
     * Store a newly created student in storage.
     */
    public function store(StudentRequest $request)
    {
        // Create a new student entry in the students table
        $student = Student::create($request->validated());

        // Add the student to the students_has_tuitions table with status = 1
        $student->studentTuitions()->create([
            'tuition_id' => $request->tuitionId, // Ensure tuitionId is passed in the request
            'status' => 1, // Set status to 1
        ]);

        return response()->json([
            'message' => 'Student created successfully!',
            'student' => $student,
        ], 201);
    }

    // Update an existing student
    public function update(StudentRequest $request, $id)
    {
        // Find the student by ID
        $student = Student::findOrFail($id);

        // Update the student record in the students table
        $student->update($request->validated());

        return response()->json([
            'message' => 'Student updated successfully!',
            'student' => $student,
        ], 200);
    }

    // Show a specific student
    public function show($id)
    {
        $student = Student::findOrFail($id); // Find the student by ID
        return response()->json($student, 200); // Return as JSON
    }


    public function search(Request $request)
    {
        $name = $request->query('name');
        $students = Student::where('name', 'LIKE', "%$name%")->get();
        return response()->json($students);
    }

    public function updateStatus($sno, Request $request)
    {
        // Validate the request
        $request->validate([
            'tuitionId' => 'required|exists:tuitions,id', // Ensure tuitionId exists in the tuitions table
        ]);
    
        // Find the student by sno
        $student = Student::where('sno', $sno)->first();
    
        if (!$student) {
            return response()->json(['message' => 'Student not found'], 404);
        }
    
        // Check if a record exists in the students_has_tuitions table
        $studentTuition = $student->studentTuitions()
            ->where('tuition_id', $request->tuitionId)
            ->first();
    
        if (!$studentTuition) {
            // If no record exists, create a new one with status = 1
            $student->studentTuitions()->create([
                'tuition_id' => $request->tuitionId,
                'status' => 1,
            ]);
        } elseif ($studentTuition->status === 0) {
            // If a record exists and its status is 0, update the status to 1
            $studentTuition->update(['status' => 1]);
        }
    
        return response()->json(['message' => 'Student status updated successfully!'], 200);
    }
}
