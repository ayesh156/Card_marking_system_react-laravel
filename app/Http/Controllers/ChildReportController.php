<?php

namespace App\Http\Controllers;

use App\Models\ChildReport;
use App\Models\Month;
use App\Models\Year;
use Illuminate\Http\Request;
use Carbon\Carbon;

class ChildReportController extends Controller
{
    /**
     * Get current year_id and month_id dynamically.
     */
    private function getCurrentYearAndMonthId()
    {
        $currentYear = Carbon::now()->year;
        $currentMonth = Carbon::now()->format('F'); // Full month name (e.g., "March")

        // Check if year exists, if not, insert it
        $yearRecord = Year::firstOrCreate(['year' => $currentYear]);
        $yearId = $yearRecord->id;

        // Fetch month_id
        $monthRecord = Month::where('name', $currentMonth)->first();
        if (!$monthRecord) {
            return response()->json(['message' => 'Month not found'], 404);
        }
        $monthId = $monthRecord->id;

        return [
            'year_id' => $yearId,
            'month_id' => $monthId,
            'year' => $currentYear,
            'month' => $currentMonth
        ];
    }

    /**
     * Store child report using current year_id and month_id.
     */
    public function store(Request $request)
    {
        // Validate incoming request data
        $request->validate([
            'child_id' => 'required|exists:child,id',
            'weeks' => 'required|array',
            'weeks.week1' => 'boolean',
            'weeks.week2' => 'boolean',
            'weeks.week3' => 'boolean',
            'weeks.week4' => 'boolean',
            'weeks.week5' => 'boolean',
        ]);

        // Get the current year_id and month_id
        $currentYearMonth = $this->getCurrentYearAndMonthId();
        if (isset($currentYearMonth['message'])) {
            return response()->json($currentYearMonth, 404);
        }
        $yearId = $currentYearMonth['year_id'];
        $monthId = $currentYearMonth['month_id'];

        // Check if a report for the same child, year, and month already exists
        $existingReport = ChildReport::where('child_id', $request->child_id)
            ->where('year_id', $yearId)
            ->where('month_id', $monthId)
            ->first();

        if ($existingReport) {
            // Update the existing report
            $existingReport->update([
                'week1' => $request->weeks['week1'] ?? false,
                'week2' => $request->weeks['week2'] ?? false,
                'week3' => $request->weeks['week3'] ?? false,
                'week4' => $request->weeks['week4'] ?? false,
                'week5' => $request->weeks['week5'] ?? false,
            ]);

            return response()->json([
                'message' => 'Child report updated successfully!',
                'data' => $existingReport
            ], 200);
        } else {
            // Create a new report
            $childReport = ChildReport::create([
                'child_id' => $request->child_id,
                'year_id' => $yearId,
                'month_id' => $monthId,
                'week1' => $request->weeks['week1'] ?? false,
                'week2' => $request->weeks['week2'] ?? false,
                'week3' => $request->weeks['week3'] ?? false,
                'week4' => $request->weeks['week4'] ?? false,
                'week5' => $request->weeks['week5'] ?? false,
            ]);

            return response()->json([
                'message' => 'Child report created successfully!',
                'data' => $childReport
            ], 201);
        }
    }

    /**
     * Get child report for a specific child, using dynamic year and month.
     */
    public function getChildReport($childId)
    {
        // Get current year_id and month_id
        $currentYearMonth = $this->getCurrentYearAndMonthId();
        if (isset($currentYearMonth['message'])) {
            return response()->json($currentYearMonth, 404);
        }
        $yearId = $currentYearMonth['year_id'];
        $monthId = $currentYearMonth['month_id'];

        // Fetch child report
        $childReport = ChildReport::where('child_id', $childId)
            ->where('year_id', $yearId)
            ->where('month_id', $monthId)
            ->first();

        if ($childReport) {
            return response()->json([
                'week1' => $childReport->week1,
                'week2' => $childReport->week2,
                'week3' => $childReport->week3,
                'week4' => $childReport->week4,
                'week5' => $childReport->week5,
                'paid' => $childReport->paid,
                'year' => $yearId,
                'month' => $monthId,

            ]);
        }

        return response()->json([]);  // Return an empty object if no report exists
    }


    public function updatePaidStatus(Request $request)
    {
        // Validate that paid status is provided and is a boolean
        $request->validate([
            'paid' => 'required|boolean',
        ]);

        // Get current year_id and month_id
        $currentYearMonth = $this->getCurrentYearAndMonthId();
        if (isset($currentYearMonth['message'])) {
            return response()->json($currentYearMonth, 404);
        }
        $yearId = $currentYearMonth['year_id'];
        $monthId = $currentYearMonth['month_id'];

        // Find the existing child report
        $childReport = ChildReport::where('child_id', $request->child_id)
            ->where('year_id', $yearId)
            ->where('month_id', $monthId)
            ->first();

        if (!$childReport) {
            // If no report exists, create a new one
            $childReport = ChildReport::create([
                'child_id' => $request->child_id,
                'year_id' => $yearId,
                'month_id' => $monthId,
                'paid' => $request->paid,
                'week1' => false,  // Default to false or whatever default you want
                'week2' => false,
                'week3' => false,
                'week4' => false,
                'week5' => false,
            ]);

            return response()->json([
                'message' => 'Child report created and paid status updated successfully!',
                'data' => $childReport
            ], 201); // 201 Created
        }

        // If the report exists, just update the paid status
        $childReport->update([
            'paid' => $request->paid,
        ]);

        return response()->json([
            'message' => 'Paid status updated successfully!',
            'data' => $childReport
        ], 200);
    }

}
