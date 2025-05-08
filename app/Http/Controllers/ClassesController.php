<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Classes;
use App\Models\ClassModel;
use App\Models\Day;
use App\Models\Tuition;
use Illuminate\Http\Request;

class ClassesController extends Controller
{
    public function updateDay(Request $request)
    {
        $id = $request->input('id');
        $dayId = $request->input('day_id');

        // Validate the inputs
        if (!$id || !$dayId) {
            return response()->json(['error' => 'Grade ID and Day ID are required'], 400);
        }

        // Find the tuition record by grade ID
        $tuition = Tuition::find($id);

        if (!$tuition) {
            return response()->json(['error' => 'Tuition record not found'], 404);
        }

        // Update the day_id
        $tuition->day_id = $dayId;
        $tuition->save();

        return response()->json(['message' => 'Day updated successfully'], 200);
    }

    public function getGradesAndDays(Request $request)
    {
        // Map class codes to their names
        $classMap = [
            'E' => 'English',
            'S' => 'Scholarship',
            'M' => 'Mathematics',
        ];

        // Get the selected class from the request
        $selectedClass = $request->input('selectedClass'); // 'E', 'S', or 'M'

        // Validate the selected class
        if (!array_key_exists($selectedClass, $classMap)) {
            return response()->json(['error' => 'Invalid class selected'], 400);
        }

        // Find the class name from the map
        $className = $classMap[$selectedClass];

        // Find the class in the 'classes' table
        $class = ClassModel::where('class_name', $className)->first();

        if (!$class) {
            return response()->json(['message' => 'Class not found in classes table'], 404);
        }

        // Use the class ID to find all tuition records in the 'tuition' table
        $tuitions = Tuition::where('class_id', $class->id)->get();

        if ($tuitions->isEmpty()) {
            return response()->json(['message' => 'No tuition records found for the selected class'], 404);
        }

        // Format the response to include tuition data, concatenated grades, and day IDs
        $result = $tuitions->map(function ($tuition) {
            // Fetch related grades from the 'tuitions_has_grades' table
            $grades = $tuition->grades()->get();

            // Group grades by their prefix (e.g., "Grade")
            $groupedGrades = [];
            foreach ($grades as $grade) {
                if (preg_match('/^(Grade|Nursery)/', $grade->grade_name, $matches)) {
                    $prefix = $matches[1]; // Extract the prefix (e.g., "Grade")
                    $groupedGrades[$prefix][] = preg_replace('/^(Grade|Nursery)\s*/', '', $grade->grade_name); // Remove the prefix
                }
            }

            // Format grouped grades into a single string
            $formattedGrades = collect($groupedGrades)->map(function ($values, $prefix) {
                return $prefix . ' ' . implode(', ', $values);
            })->join(' ');

            // Fetch the category name from the tuition's category relationship
            $categoryName = $tuition->category->category_name ?? '';

            return [
                'id' => $tuition->id,
                'grade' => trim("{$formattedGrades} {$categoryName}"), // Concatenate grades and category
                'day_id' => $tuition->day_id, // Assuming 'day_id' is the column for the day
            ];
        });

        return response()->json([
            'data' => $result,
        ]);
    }

    public function getGrades(Request $request)
    {
        // Map class codes to their names
        $classMap = [
            'E' => 'English',
            'S' => 'Scholarship',
            'M' => 'Mathematics',
        ];

        // Get the selected class from the request
        $selectedClass = $request->input('selectedClass'); // 'E', 'S', or 'M'

        // Validate the selected class
        if (!array_key_exists($selectedClass, $classMap)) {
            return response()->json(['error' => 'Invalid class selected'], 400);
        }

        // Find the class name from the map
        $className = $classMap[$selectedClass];

        // Find the class in the 'classes' table
        $class = ClassModel::where('class_name', $className)->first();

        if (!$class) {
            return response()->json(['message' => 'Class not found in classes table'], 404);
        }

        // Use the class ID to find all tuition records in the 'tuition' table
        $tuitions = Tuition::where('class_id', $class->id)->get();

        if ($tuitions->isEmpty()) {
            return response()->json(['message' => 'No tuition records found for the selected class'], 404);
        }

        // Format the response to include tuition data and concatenated grades

        $result = $tuitions->map(function ($tuition) {
            // Fetch related grades from the 'tuitions_has_grades' table
            $grades = $tuition->grades()->get();

            // Group grades by their prefix (e.g., "Grade")
            $groupedGrades = [];
            foreach ($grades as $grade) {
                if (preg_match('/^(Grade|Nursery)/', $grade->grade_name, $matches)) {
                    $prefix = $matches[1]; // Extract the prefix (e.g., "Nursery")
                    $groupedGrades[$prefix][] = preg_replace('/^(Grade|Nursery)\s*/', '', $grade->grade_name); // Remove the prefix
                }
            }

            // Format grouped grades into a single string
            $formattedGrades = collect($groupedGrades)->map(function ($values, $prefix) {
                $formatted = $prefix . ' ' . implode(', ', $values);
                // Remove unnecessary spaces and ensure only one space between words
                return preg_replace('/\s+/', ' ', trim($formatted));
            })->join(' ');

            // Fetch the category name from the tuition's category relationship
            $categoryName = $tuition->category->category_name ?? '';

            return [
                'id' => $tuition->id,
                'grade' => trim("{$formattedGrades} {$categoryName}"), // Concatenate grades and category
            ];
        });

        return response()->json([
            'data' => $result,
        ]);
    }


    public function getDashboardData(Request $request)
    {
        // Map class codes to their names
        $classMap = [
            'E' => 'English',
            'S' => 'Scholarship',
            'M' => 'Mathematics',
        ];

        // Get the selected class from the request
        $selectedClass = $request->input('selectedClass'); // 'E', 'S', or 'M'

        // Validate the selected class
        if (!array_key_exists($selectedClass, $classMap)) {
            return response()->json(['error' => 'Invalid class selected'], 400);
        }

        // Find the class name from the map
        $className = $classMap[$selectedClass];

        // Find the class in the 'classes' table
        $class = ClassModel::where('class_name', $className)->first();

        if (!$class) {
            return response()->json(['message' => 'Class not found in classes table'], 404);
        }

        // Get the current day name
        $currentDayName = now()->format('l'); // e.g., 'Monday', 'Tuesday'

        // Find the day ID corresponding to the current day name
        $day = Day::where('day_name', $currentDayName)->first();

        if (!$day) {
            return response()->json(['message' => 'Day not found in days table'], 404);
        }

        // Use the class ID and day ID to find all tuition records in the 'tuition' table
        $tuitions = Tuition::where('class_id', $class->id)
            ->where('day_id', $day->id)
            ->get();

        if ($tuitions->isEmpty()) {
            return response()->json(['message' => 'No tuition records found for the selected class and day'], 404);
        }

        // Format the response to include tuition data, category name, grade, and student count
        $result = $tuitions->map(function ($tuition) {
            // Fetch related grades from the 'tuitions_has_grades' table
            $grades = $tuition->grades()->pluck('grade_name')->toArray();
            $formattedGrades = implode(', ', $grades);

            // Fetch the category name from the tuition's category relationship
            $categoryName = $tuition->category->category_name ?? '';

            // Count the number of students in the students_has_tuitions table
            $studentCount = $tuition->studentTuitions()->count();

            return [
                'id' => $tuition->id,
                'category' => $categoryName,
                'grade' => $formattedGrades,
                'student_count' => $studentCount,
            ];
        });

        return response()->json([
            'data' => $result,
        ]);
    }
}
