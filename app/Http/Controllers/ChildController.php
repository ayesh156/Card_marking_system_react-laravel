<?php

namespace App\Http\Controllers;

use App\Models\Child;
use App\Http\Requests\ChildRequest; // Import the ChildRequest
use Illuminate\Http\Request;

class ChildController extends Controller
{
    // Fetch all children
    public function index()
    {
        $children = Child::all();  // Get all children from the database
        return response()->json($children);  // Return them as a JSON response
    }

    public function store(ChildRequest $request) // Use ChildRequest here
    {
        // The validated data is automatically available via $request->validated()
        $child = Child::create($request->validated());

        return response()->json([
            'message' => 'Student created successfully!',
            'child' => $child
        ], 201);
    }

    public function update(ChildRequest $request, $id)
    {

        // Find the child by ID
        $child = Child::findOrFail($id);

        // Update the child with validated data
        $child->update($request->validated());

        return response()->json([
            'message' => 'Student updated successfully!',
            'child' => $child
        ], 200);
    }

    public function show($id)
    {
        // Find the child by ID or return a 404 error if not found
        $child = Child::findOrFail($id);

        // Return the child data as a JSON response
        return response()->json($child, 200);
    }

    public function destroy($id)
    {
        // Find the child by ID
        $child = Child::findOrFail($id);

        // Delete the child record
        $child->delete();

        return response()->json([
            'message' => 'Record deleted successfully!',
        ], 200);
    }
}
