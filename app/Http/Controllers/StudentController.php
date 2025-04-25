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
        $student = Student::create($request->validated());

        return response()->json([
            'message' => 'Student created successfully!',
            'student' => $student
        ], 201);
    }

    // Update an existing student
    public function update(StudentRequest $request, $id)
    {
        $student = Student::findOrFail($id); // Find the student by ID
        $student->update($request->validated()); // Update with validated data

        return response()->json([
            'message' => 'Student updated successfully!',
            'student' => $student
        ], 200);
    }

    // Show a specific student
    public function show($id)
    {
        $student = Student::findOrFail($id); // Find the student by ID
        return response()->json($student, 200); // Return as JSON
    }

    // change status a student
    public function status($id)
    {
        $student = Student::findOrFail($id); // Find the student by ID
        $student->update(['status' => false]); // Set the status column to false

        return response()->json([
            'message' => 'Student deleted successfully!',
        ], 200);
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
            'status' => 'required|boolean',
        ]);

        // Find the student by sno
        $student = Student::where('sno', $sno)->first();

        if (!$student) {
            return response()->json(['message' => 'Student not found'], 404);
        }

        // Update the status
        $student->status = $request->status;
        $student->save();

        return response()->json(['message' => 'Student enabled successfully!'], 200);
    }
}
