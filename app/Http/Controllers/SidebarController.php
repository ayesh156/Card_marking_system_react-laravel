<?php

namespace App\Http\Controllers;

use App\Models\ClassModel;
use App\Models\Tuition;
use Illuminate\Http\Request;

class SidebarController extends Controller
{
    public function getCategoryWithGrades(Request $request)
{
    // Map class codes to their names
    $classMap = [
        'E' => 'English',
        'S' => 'Scholarship',
        'M' => 'Mathematics',
    ];

    // Get the selected class from the request
    $selectedClass = $request->input('class'); // 'E', 'S', or 'M'

    // Validate the selected class
    if (!array_key_exists($selectedClass, $classMap)) {
        return response()->json(['error' => 'Invalid class selected'], 400);
    }

    // Step 1: Get the class ID for the selected class
    $class = ClassModel::where('class_name', $classMap[$selectedClass])->first();

    if (!$class) {
        return response()->json(['error' => 'Class not found'], 404);
    }

    // Step 2: Get the tuitions for the selected class
    $tuitions = Tuition::where('class_id', $class->id)->with('grades', 'category')->get();

    if ($tuitions->isEmpty()) {
        return response()->json(['error' => 'No tuitions found for the selected class'], 404);
    }

    // Step 3: Group grades by category and day
    $categoriesWithGrades = $tuitions->groupBy(function ($tuition) {
        return $tuition->category->category_name ?? 'Uncategorized';
    })->map(function ($tuitions, $categoryName) {
        $processedGrades = [];

        // Group tuitions by day
        $tuitionsByDay = $tuitions->groupBy('day_id');

        foreach ($tuitionsByDay as $dayId => $dayTuitions) {
            foreach ($dayTuitions as $tuition) {
                $grades = $tuition->grades->pluck('grade_name');

                // Combine grades into a single string if there are multiple grades for the same tuition_id
                if ($grades->count() > 1) {
                    $processedGrades[] = preg_replace_callback(
                        '/(Grade\s)(\d+)((?:,\sGrade\s\d+)*)/i',
                        function ($matches) {
                            // $matches[1] is "Grade ", $matches[2] is the first number, $matches[3] contains the rest
                            $numbers = array_filter(array_merge([$matches[2]], preg_split('/,\sGrade\s/', $matches[3])), function ($value) {
                                return !empty($value); // Remove empty values
                            });
                            return $matches[1] . implode(', ', $numbers);
                        },
                        $grades->unique()->join(', ')
                    );
                } else {
                    $processedGrades = array_merge($processedGrades, $grades->unique()->toArray()); // Add normal grades
                }
            }
        }

        // Sort grades in ascending order
        $processedGrades = collect($processedGrades)->sort(function ($a, $b) {
            // Extract numeric values from grade strings for comparison
            preg_match('/\d+/', $a, $aMatches);
            preg_match('/\d+/', $b, $bMatches);

            $aNumber = $aMatches[0] ?? 0;
            $bNumber = $bMatches[0] ?? 0;

            return $aNumber - $bNumber;
        })->values()->toArray();

        return [
            'category_name' => $categoryName,
            'grades' => array_unique($processedGrades), // Ensure unique grades
        ];
    })->values();

    // Return the response
    return response()->json($categoriesWithGrades);
}
}