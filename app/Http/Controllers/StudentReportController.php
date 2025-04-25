<?php

namespace App\Http\Controllers;

use App\Models\Classes;
use App\Models\Days;
use App\Models\Month;
use App\Models\Student;
use App\Models\StudentReport;
use App\Models\Year;
use Carbon\Carbon;
use Illuminate\Http\Request;
use PHPUnit\Framework\MockObject\Builder\Stub;
use Illuminate\Support\Facades\Http;


class StudentReportController extends Controller
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

        // Check if month exists, if not, create it
        $monthRecord = Month::firstOrCreate(['name' => $currentMonth]);
        $monthId = $monthRecord->id;

        return [
            'year_id' => $yearId,
            'month_id' => $monthId,
            'year' => $currentYear,
            'month' => $currentMonth
        ];
    }


    public function store(Request $request)
    {
        // Validate incoming request data
        $request->validate([
            'child_id' => 'required|exists:students,id', // Ensure child_id exists in the students table
            'class' => 'required|string', // Ensure class is provided as a string
            'grade' => 'required|string', // Ensure grade is provided as a string
            'weeks' => 'required|array',
            'weeks.week1' => 'boolean',
            'weeks.week2' => 'boolean',
            'weeks.week3' => 'boolean',
            'weeks.week4' => 'boolean',
            'weeks.week5' => 'boolean',
        ]);

        // Find the class_id based on the class_name and grade in the classes table
        $classRecord = Classes::where('class_name', $request->class)
            ->where('grade', $request->grade)
            ->first();

        if (!$classRecord) {
            // If not found, create a new class record
            $today = Carbon::now()->format('l'); // Get today's day name (e.g., "Monday")
            $dayRecord = Days::where('day_name', $today)->first();

            if (!$dayRecord) {
                return response()->json([
                    'message' => 'Day not found in the days table.',
                ], 404);
            }

            $classRecord = Classes::create([
                'class_name' => $request->class,
                'grade' => $request->grade,
                'day_id' => $dayRecord->id, // Set the day_id based on today's day
            ]);
        }

        $classId = $classRecord->id;

        // Get the current year_id and month_id
        $currentYearMonth = $this->getCurrentYearAndMonthId();
        if (isset($currentYearMonth['message'])) {
            return response()->json($currentYearMonth, 404);
        }
        $yearId = $currentYearMonth['year_id'];
        $monthId = $currentYearMonth['month_id'];

        // Check if a report for the same student, year, month, and class already exists
        $existingReport = StudentReport::where('student_id', $request->child_id)
            ->where('class_id', $classId)
            ->where('year_id', $yearId)
            ->where('month_id', $monthId)
            ->first();

        if ($existingReport) {
            // Update only the week values provided in the request
            $updateData = [];
            foreach ($request->weeks as $key => $value) {
                $updateData[$key] = $value;
            }

            $existingReport->update($updateData);

            return response()->json([
                'message' => 'Student report updated successfully!',
                'data' => $existingReport
            ], 200);
        } else {
            // Create a new report
            $childReport = StudentReport::create([
                'student_id' => $request->child_id,
                'class_id' => $classId,
                'year_id' => $yearId,
                'month_id' => $monthId,
                'week1' => $request->weeks['week1'] ?? false,
                'week2' => $request->weeks['week2'] ?? false,
                'week3' => $request->weeks['week3'] ?? false,
                'week4' => $request->weeks['week4'] ?? false,
                'week5' => $request->weeks['week5'] ?? false,
            ]);

            return response()->json([
                'message' => 'Student report created successfully!',
                'data' => $childReport
            ], 201);
        }
    }

    public function paid(Request $request)
    {
        // Validate incoming request data
        $request->validate([
            'child_id' => 'required|exists:students,id', // Ensure child_id exists in the students table
            'class' => 'required|string', // Ensure class is provided as a string
            'grade' => 'required|string', // Ensure grade is provided as a string
            'paid' => 'required|boolean', // Ensure paid status is provided and is a boolean
        ]);

        // Find the class_id based on the class_name and grade in the classes table
        $classRecord = Classes::where('class_name', $request->class)
            ->where('grade', $request->grade)
            ->first();

        if (!$classRecord) {
            // If not found, create a new class record
            $today = Carbon::now()->format('l'); // Get today's day name (e.g., "Monday")
            $dayRecord = Days::where('day_name', $today)->first();

            if (!$dayRecord) {
                return response()->json([
                    'message' => 'Day not found in the days table.',
                ], 404);
            }

            $classRecord = Classes::create([
                'class_name' => $request->class,
                'grade' => $request->grade,
                'day_id' => $dayRecord->id, // Set the day_id based on today's day
            ]);
        }

        $classId = $classRecord->id;

        // Get the current year_id and month_id
        $currentYearMonth = $this->getCurrentYearAndMonthId();
        if (isset($currentYearMonth['message'])) {
            return response()->json($currentYearMonth, 404);
        }
        $yearId = $currentYearMonth['year_id'];
        $monthId = $currentYearMonth['month_id'];

        // Find the existing child report
        $childReport = StudentReport::where('student_id', $request->child_id)
            ->where('class_id', $classId)
            ->where('year_id', $yearId)
            ->where('month_id', $monthId)
            ->first();

        if (!$childReport) {
            // If no report exists, create a new one
            $childReport = StudentReport::create([
                'student_id' => $request->child_id,
                'class_id' => $classId,
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
                'message' => 'Paid status updated successfully!',
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

    public function reports($grade)
    {
        // Get current year_id and month_id
        $currentYearMonth = $this->getCurrentYearAndMonthId();
        if (isset($currentYearMonth['message'])) {
            return response()->json($currentYearMonth, 404);
        }
        $yearId = $currentYearMonth['year_id'];
        $monthId = $currentYearMonth['month_id'];

        // Calculate the previous month and handle year transitions
        $previousMonthId = $monthId - 1;
        $previousYearId = $yearId;

        if ($previousMonthId < 1) {
            $previousMonthId = 12; // Wrap around to December
            $previousYearRecord = Year::where('id', '<', $yearId)->orderBy('id', 'desc')->first();
            $previousYearId = $previousYearRecord ? $previousYearRecord->id : $yearId;
        }

        // Fetch all students with their reports for the current year and month
        $studentsQuery = Student::with(['reports' => function ($query) use ($yearId, $monthId) {
            $query->where('year_id', $yearId)
                ->where('month_id', $monthId);
        }]);

        // Filter by grade if provided
        if ($grade) {
            $studentsQuery->where('grade', $grade);
        }

        $students = $studentsQuery->get();

        // Format the response
        $formattedData = $students->map(function ($student) use ($previousYearId, $previousMonthId) {
            $report = $student->reports->first(); // Get the report for the current year and month, if it exists

            // Check if any of the specified fields are null
            $fieldsToCheck = ['address1', 'school', 'g_name', 'g_mobile', 'gender', 'dob'];
            $isRegistered = true;

            foreach ($fieldsToCheck as $field) {
                if (is_null($student->$field)) {
                    $isRegistered = false;
                    break;
                }
            }

            // Check for previous month's attendance and payment status
            $previousReport = StudentReport::where('student_id', $student->id)
                ->where('year_id', $previousYearId)
                ->where('month_id', $previousMonthId)
                ->first();

            $notPaidStatus = false;
            if ($previousReport) {
                $weeksTrueCount = [
                    $previousReport->week1,
                    $previousReport->week2,
                    $previousReport->week3,
                    $previousReport->week4,
                    $previousReport->week5,
                ];
                // Count the number of truthy values (e.g., true, 1) in the weeks array
                $weeksAttended = array_filter($weeksTrueCount, fn($week) => !empty($week));

                // Set notPaidStatus to true if 2 or more weeks are attended and paid is false
                if (count($weeksAttended) >= 2 && !$previousReport->paid) {
                    $notPaidStatus = true;
                }
            }

            return [
                'child_id' => $student->id,
                'child_name' => $student->name,
                'sno' => $student->sno,
                'gWhatsapp' => $student->g_whatsapp,
                'week1' => boolval($report->week1 ?? false), // Cast to boolean
                'week2' => boolval($report->week2 ?? false), // Cast to boolean
                'week3' => boolval($report->week3 ?? false), // Cast to boolean
                'week4' => boolval($report->week4 ?? false), // Cast to boolean
                'week5' => boolval($report->week5 ?? false), // Cast to boolean
                'paid' => boolval($report->paid ?? false),   // Cast to boolean
                'register' => $isRegistered,                // Add register status
                'maths' => boolval($student->maths),         // Get maths value from students table
                'english' => boolval($student->english),     // Get english value from students table
                'scholarship' => boolval($student->scholarship), // Get scholarship value from students table
                'grade' => $student->grade,                 // Get grade value from students table
                'status' => boolval($student->status),
                'notpaid' => $notPaidStatus                 // Add notpaid status
            ];
        });

        return response()->json($formattedData);
    }

    public function history(Request $request)
    {
        $grade = $request->query('grade');
        $year = $request->query('year');
        $month = $request->query('month');
        $class = $request->query('class'); // Assuming 'class' is passed as a query parameter

        // Get the year_id and month_id based on the provided year and month
        $yearRecord = Year::where('year', $year)->first();
        $monthRecord = Month::where('id', $month)->first();

        if (!$yearRecord || !$monthRecord) {
            return response()->json(['message' => 'Invalid year or month.'], 404);
        }

        $yearId = $yearRecord->id;
        $monthId = $monthRecord->id;

        // Calculate the previous month and handle year transitions
        $previousMonthId = $month - 1;
        $previousYearId = $yearId;

        if ($previousMonthId < 1) {
            $previousMonthId = 12; // Wrap around to December
            $previousYearRecord = Year::where('id', '<', $yearId)->orderBy('id', 'desc')->first();
            $previousYearId = $previousYearRecord ? $previousYearRecord->id : $yearId;
        }

        // Fetch all students with their reports for the specified year, month, and grade
        $studentsQuery = Student::with(['reports' => function ($query) use ($yearId, $monthId) {
            $query->where('year_id', $yearId)
                ->where('month_id', $monthId);
        }]);

        // Filter by grade if provided
        if ($grade) {
            $studentsQuery->where('grade', $grade);
        }

        // Apply filters based on the class value
        if ($class === 'M') {
            $studentsQuery->where('maths', true); // Filter students with maths = true
        } elseif ($class === 'E') {
            $studentsQuery->where('english', true); // Filter students with english = true
        } elseif ($class === 'S') {
            $studentsQuery->where('scholarship', true); // Filter students with scholarship = true
        }

        $students = $studentsQuery->get();

        // Format the response
        $formattedData = $students->map(function ($student) use ($yearId, $monthId, $previousYearId, $previousMonthId) {
            $report = $student->reports->first(); // Get the report for the specified year and month, if it exists

            // Check if any of the specified fields are null
            $fieldsToCheck = ['address1', 'school', 'g_name', 'g_mobile', 'gender', 'dob'];
            $isRegistered = true;

            foreach ($fieldsToCheck as $field) {
                if (is_null($student->$field)) {
                    $isRegistered = false;
                    break;
                }
            }

            // Check for previous month's attendance and payment status
            $previousReport = StudentReport::where('student_id', $student->id)
                ->where('year_id', $previousYearId)
                ->where('month_id', $previousMonthId)
                ->first();

            $notPaidStatus = false;
            if ($previousReport) {
                $weeksTrueCount = [
                    $previousReport->week1,
                    $previousReport->week2,
                    $previousReport->week3,
                    $previousReport->week4,
                    $previousReport->week5,
                ];
                // Count the number of truthy values (e.g., true, 1) in the weeks array
                $weeksAttended = array_filter($weeksTrueCount, fn($week) => !empty($week));

                // Set notPaidStatus to true if 2 or more weeks are attended and paid is false
                if (count($weeksAttended) >= 2 && !$previousReport->paid) {
                    $notPaidStatus = true;
                }
            }

            return [
                'child_id' => $student->id,
                'child_name' => $student->name,
                'sno' => $student->sno,
                'gWhatsapp' => $student->g_whatsapp,
                'week1' => boolval($report->week1 ?? false), // Cast to boolean
                'week2' => boolval($report->week2 ?? false), // Cast to boolean
                'week3' => boolval($report->week3 ?? false), // Cast to boolean
                'week4' => boolval($report->week4 ?? false), // Cast to boolean
                'week5' => boolval($report->week5 ?? false), // Cast to boolean
                'paid' => boolval($report->paid ?? false),   // Cast to boolean
                'register' => $isRegistered,                // Add register status
                'maths' => boolval($student->maths),         // Get maths value from students table
                'english' => boolval($student->english),     // Get english value from students table
                'scholarship' => boolval($student->scholarship), // Get scholarship value from students table
                'grade' => $student->grade,                 // Get grade value from students table
                'status' => boolval($student->status),
                'notpaid' => $notPaidStatus                 // Add notpaid status
            ];
        });

        return response()->json($formattedData);
    }

    /**
     * Helper function to format phone numbers.
     */
    private function formatPhoneNumber($phoneNumber)
    {
        // Remove all non-numeric characters
        $phoneNumber = preg_replace('/\D/', '', $phoneNumber);

        // Check if the number starts with "0" and replace it with "94"
        if (substr($phoneNumber, 0, 1) === '0') {
            $phoneNumber = '94' . substr($phoneNumber, 1);
        }

        return $phoneNumber;
    }

    public function sendWhatsAppMessages(Request $request)
    {
        // Validate the incoming request
        $request->validate([
            'message' => 'required|string', // The message to send
        ]);

        $message = $request->input('message');

        // WhatsApp API credentials from .env
        $whatsappApiUrl = env('WHATSAPP_API_URL', 'https://graph.facebook.com/v22.0/627382673793771/messages'); // Default value if not set
        $accessToken = env('WHATSAPP_ACCESS_TOKEN', ''); // Default to empty if not set

        // List of phone numbers to send the message to
        $phoneNumbers = Student::whereNotNull('g_whatsapp')->pluck('g_whatsapp')->toArray();

        $responses = []; // To store responses for each phone number
     

        // foreach ($phoneNumbers as $phoneNumber) {
        //     // Format the phone number (if needed)
        //     $phoneNumber = $this->formatPhoneNumber($phoneNumber);

        //     // Send the message using the Meta API
        //     $response = Http::withToken($accessToken)
        //         ->withOptions(['verify' => false]) // Disable SSL verification for development
        //         ->post($whatsappApiUrl, [
        //             'messaging_product' => 'whatsapp',
        //             'recipient_type' => 'individual',
        //             'to' => $phoneNumber,
        //             'type' => 'text',
        //             'text' => [
        //                 'preview_url' => false,
        //                 'body' => $message,
        //             ],
        //         ]);

        //     // Add the response to the responses array
        //     $responses[] = [
        //         'phone' => $phoneNumber,
        //         'response' => $response->json(),
        //     ];
        // }

        foreach ($phoneNumbers as $phoneNumber) {
            // Format the phone number (if needed)
            $phoneNumber = $this->formatPhoneNumber($phoneNumber);
            // Send the message using the Meta API
            $response = Http::withToken($accessToken)
                ->withOptions(['verify' => false]) // Disable SSL verification for development
                ->post($whatsappApiUrl, [
                    'messaging_product' => 'whatsapp',
                    'to' => $phoneNumber,
                    'type' => 'template',
                    'template' => [
                        'name' => $message, // Replace with your approved template name
                        'language' => [
                            'code' => 'en_US', // Replace with the template's language code
                        ],
                    ],
                ]);

            // Add the response to the responses array
            $responses[] = [
                'phone' => $phoneNumber,
                'response' => $response->json(),
            ];
        }

        // Return the responses
        return response()->json([
            'message' => 'Messages sent successfully.',
            'responses' => $responses,
        ]);
    }
}
