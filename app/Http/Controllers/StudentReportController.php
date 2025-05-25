<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\ClassModel;
use App\Models\Day;
use App\Models\Grade;
use App\Models\Month;
use App\Models\Student;
use App\Models\StudentReport;
use App\Models\StudentTuition;
use App\Models\Tuition;
use App\Models\User;
use App\Models\Year;
use Carbon\Carbon;
use Illuminate\Http\Request;
use PHPUnit\Framework\MockObject\Builder\Stub;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Schema;


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
        $monthRecord = Month::firstOrCreate(['month' => $currentMonth]);
        $monthId = $monthRecord->id;

        return [
            'year_id' => $yearId,
            'month_id' => $monthId,
            'year' => $currentYear,
            'month' => $currentMonth
        ];
    }

    public function dashboardStats(Request $request)
    {
        // Map class codes to their names
        $classMap = [
            'E' => 'English',
            'S' => 'Scholarship',
            'M' => 'Mathematics',
        ];

        // Get the selected class from the request
        $selectedClass = $request->input('selectedClass');

        // If selectedClass is provided as a code, map it to the class name
        if (isset($classMap[$selectedClass])) {
            $selectedClassName = $classMap[$selectedClass];
        } else {
            $selectedClassName = $selectedClass; // fallback if already a name or null
        }

        // If selectedClass is provided, filter by class
        if ($selectedClassName) {
            $class = ClassModel::where('class_name', $selectedClassName)->first();
            if (!$class) {
                return response()->json([
                    'totalActiveStudents' => 0,
                    'totalPaidStudents' => 0,
                ]);
            }
            $classId = $class->id;

            // Get all tuition IDs for this class
            $tuitionIds = Tuition::where('class_id', $classId)->pluck('id');

            // Total active students for this class
            $totalActiveStudents = StudentTuition::whereIn('tuition_id', $tuitionIds)
                ->where('status', 1)
                ->distinct('student_id')
                ->count('student_id');

            // Get current year and month
            $now = Carbon::now();
            $year = Year::where('year', $now->year)->first();
            $month = Month::where('month', $now->format('F'))->first();

            $totalPaidStudents = 0;
            if ($year && $month) {
                $totalPaidStudents = StudentReport::whereIn('tuition_id', $tuitionIds)
                    ->where('year_id', $year->id)
                    ->where('month_id', $month->id)
                    ->where('paid', true)
                    ->distinct('student_id')
                    ->count('student_id');
            }

            return response()->json([
                'totalActiveStudents' => $totalActiveStudents,
                'totalPaidStudents' => $totalPaidStudents,
            ]);
        }
        // Optionally, handle the case where no class is selected (return all students)
        return response()->json([
            'totalActiveStudents' => 0,
            'totalPaidStudents' => 0,
        ]);
    }

    public function weekStatus(Request $request)
    {
        // Validate incoming request data
        $request->validate([
            'child_id' => 'required|exists:students,id', // Ensure child_id exists in the students table
            'tuition_id' => 'required|exists:tuitions,id', // Ensure tuition_id exists in the tuitions table
            'weeks' => 'required|array',
            'weeks.week1' => 'boolean',
            'weeks.week2' => 'boolean',
            'weeks.week3' => 'boolean',
            'weeks.week4' => 'boolean',
            'weeks.week5' => 'boolean',
        ]);

        $studentId = $request->child_id;
        $tuitionId = $request->tuition_id;

        // Get the current year_id and month_id
        $currentYearMonth = $this->getCurrentYearAndMonthId();
        if (isset($currentYearMonth['message'])) {
            return response()->json($currentYearMonth, 404);
        }
        $yearId = $currentYearMonth['year_id'];
        $monthId = $currentYearMonth['month_id'];

        // Check if a report for the same student, tuition, year, and month already exists
        $existingReport = StudentReport::where('student_id', $studentId)
            ->where('tuition_id', $tuitionId)
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
                'data' => $existingReport,
            ], 200);
        } else {
            // Create a new report
            $childReport = StudentReport::create([
                'student_id' => $studentId,
                'tuition_id' => $tuitionId,
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
                'data' => $childReport,
            ], 201);
        }
    }

    public function paidStatus(Request $request)
    {
        // Validate incoming request data
        $request->validate([
            'child_id' => 'required|exists:students,id', // Ensure child_id exists in the students table
            'tuition_id' => 'required|exists:tuitions,id', // Ensure tuition_id exists in the tuitions table
            'paid' => 'required|boolean', // Ensure paid status is provided and is a boolean
        ]);

        // **Check for Internet Connection**
        try {
            Http::withOptions(['verify' => false])->get('https://www.google.com');
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'No internet connection. Please check your connection and try again.',
                'error' => $e->getMessage(),
            ], 500);
        }

        $studentId = $request->child_id;
        $tuitionId = $request->tuition_id;
        $email = $request->email;

        if (!$email) {
            return response()->json(['message' => 'User email is required.'], 400);
        }

        // Get the current year_id and month_id
        $currentYearMonth = $this->getCurrentYearAndMonthId();
        if (isset($currentYearMonth['message'])) {
            return response()->json($currentYearMonth, 404);
        }
        $yearId = $currentYearMonth['year_id'];
        $monthId = $currentYearMonth['month_id'];

        // Retrieve the student and their guardian's WhatsApp numbers
        $student = Student::find($studentId);
        if (!$student || (!$student->g_whatsapp && !$student->g_whatsapp2)) {
            return response()->json(['Student or WhatsApp number not found for student ID: ' . $studentId], 400);
        }

        // --- NEW LOGIC: Get the student's grade ---
        $grade = null;
        $tuition = Tuition::with(['grades', 'category'])->find($tuitionId);

        $categoryName = null;
        if ($tuition && $tuition->category) {
            $categoryName = strtolower($tuition->category->category_name);
        }

        if ($tuition && $tuition->grades->count() > 0) {
            $gradeRow = $tuition->grades->first();
            $grade = $gradeRow->grade_name;
        }

        $templateColumn = null;

        // Adjusted logic for Theory and Spoken categories
        if ($categoryName === 'theory' && in_array($tuitionId, array_merge([1], range(20, 31)))) {
            if ($grade) {
                $gradeLower = strtolower($grade);
                if ($gradeLower === 'nursery') {
                    $templateColumn = 'after_payment_nursery_template';
                } elseif (preg_match('/^grade\s*([1-9]|1[0-1])([ -]?[a-zA-Z])?$/i', $gradeLower, $matches)) {
                    $gradeNum = $matches[1];
                    $templateColumn = 'after_payment_grade' . $gradeNum . '_template';
                }
            }
        } elseif ($categoryName === 'spoken') { // <-- Adjust this range as needed
            $templateColumn = 'after_payment_spoken_template';
        }

        // Fetch the template from the user table
        if ($templateColumn && Schema::hasColumn('users', $templateColumn)) {
            $afterPaymentTemplate = User::where('email', $email)->value($templateColumn);
        } else {
            // For tuition IDs outside 1 and 20–30, or if no grade-specific template found, always use after_payment_template
            $afterPaymentTemplate = User::where('email', $email)->value('after_payment_template');
        }

        if (!$afterPaymentTemplate) {
            return response()->json(['After payment template not found for user email: $email'], 400);
        }

        // Check if the tuition is for an English class by directly querying the class_id
        $isEnglishClass = Tuition::where('id', $tuitionId)
            ->where('class_id', function ($query) {
                $query->select('id')
                    ->from('classes')
                    ->where('class_name', 'English')
                    ->limit(1);
            })
            ->exists();

        // Find the existing child report
        $childReport = StudentReport::where('student_id', $studentId)
            ->where('tuition_id', $tuitionId)
            ->where('year_id', $yearId)
            ->where('month_id', $monthId)
            ->first();

        // Helper: collect all unique WhatsApp numbers (not null, not empty, not duplicate)
        $numbers = [];
        if (!empty($student->g_whatsapp)) {
            $numbers[] = $student->g_whatsapp;
        }
        if (!empty($student->g_whatsapp2)) {
            $numbers[] = $student->g_whatsapp2;
        }

        if (!$childReport) {
            // If no report exists, create a new one
            $childReport = StudentReport::create([
                'student_id' => $studentId,
                'tuition_id' => $tuitionId,
                'year_id' => $yearId,
                'month_id' => $monthId,
                'paid' => $request->paid,
                'week1' => false,  // Default to false or whatever default you want
                'week2' => false,
                'week3' => false,
                'week4' => false,
                'week5' => false,
            ]);

            // Send WhatsApp reminder if paid status is true and it's an English class
            if ($request->paid && $isEnglishClass) {
                foreach ($numbers as $number) {
                    $this->sendWhatsAppReminder($number, $afterPaymentTemplate);
                }
            }

            return response()->json([
                'message' => 'Paid status updated successfully!',
                'data' => $childReport
            ], 201); // 201 Created
        }

        // If the report exists, just update the paid status
        $childReport->update([
            'paid' => $request->paid,
        ]);

        // Send WhatsApp reminder if paid status is true and it's an English class
        if ($request->paid && $isEnglishClass) {
            foreach ($numbers as $number) {
                $this->sendWhatsAppReminder($number, $afterPaymentTemplate);
            }
        }

        return response()->json([
            'message' => 'Paid status updated successfully!',
            'data' => $childReport
        ], 200);
    }


    public function sendWhatsAppMessages(Request $request)
    {
        // Validate the incoming request
        $request->validate([
            'message' => 'required|string', // The message to send
        ]);

        // **Check for Internet Connection**
        try {
            Http::withOptions(['verify' => false])->get('https://www.google.com');
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'No internet connection. Please check your connection and try again.',
                'error' => $e->getMessage(),
            ], 500);
        }

        $messageTemplate = $request->input('message');

        // Retrieve students with status = 1 from the students_has_tuitions table
        $activeStudents = StudentTuition::where('status', 1)
            ->with('student') // Eager load the related student
            ->get();

        if ($activeStudents->isEmpty()) {
            return response()->json(['message' => 'No active students found.'], 404);
        }

        // Filter unique WhatsApp numbers from the students
        $uniqueNumbers = collect();
        foreach ($activeStudents as $studentTuition) {
            $student = $studentTuition->student;
            if ($student) {
                if ($student->g_whatsapp) $uniqueNumbers->push($student->g_whatsapp);
                if ($student->g_whatsapp2) $uniqueNumbers->push($student->g_whatsapp2);
            }
        }
        $uniqueNumbers = $uniqueNumbers->unique()->filter();

        $responses = [];
        foreach ($uniqueNumbers as $whatsappNumber) {
            $formattedPhoneNumber = $this->formatPhoneNumber($whatsappNumber);
            $response = $this->sendWhatsAppReminder($formattedPhoneNumber, $messageTemplate);
            $responses[] = [
                'phone' => $formattedPhoneNumber,
                'response' => $response,
            ];
        }

        // Return the responses
        return response()->json([
            'message' => 'Messages sent successfully.',
            'responses' => $responses,
        ]);
    }

    public function sendMessageToTuitions(Request $request)
    {
        // Validate the incoming request
        $request->validate([
            'message' => 'required|string', // The message to send
            'tuition_id' => 'required|exists:tuitions,id', // Ensure tuition_id exists in the tuitions table
            'child_ids' => 'nullable|array', // Optional array of child IDs
            'child_ids.*' => 'exists:students,id', // Ensure each child ID exists in the students table
        ]);

        // **Check for Internet Connection**
        try {
            Http::withOptions(['verify' => false])->get('https://www.google.com');
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'No internet connection. Please check your connection and try again.',
                'error' => $e->getMessage(),
            ], 500);
        }

        $message = $request->input('message');
        $tuitionId = $request->input('tuition_id');
        $childIds = $request->input('child_ids', []); // Default to an empty array if not provided

        // If child_ids is provided, filter students based on their status
        if (!empty($childIds)) {
            $activeStudents = StudentTuition::where('tuition_id', $tuitionId)
                ->whereIn('student_id', $childIds) // Filter by provided child IDs
                ->where('status', 1) // Only active students
                ->pluck('student_id'); // Get only the student IDs
        } else {
            // If no child_ids are provided, retrieve all active students for the tuition
            $activeStudents = StudentTuition::where('tuition_id', $tuitionId)
                ->where('status', 1) // Only active students
                ->pluck('student_id'); // Get only the student IDs
        }

        if ($activeStudents->isEmpty()) {
            return response()->json(['message' => 'No active students found for this tuition.'], 404);
        }

        // Retrieve unique WhatsApp numbers from the students table based on the filtered student IDs
        $students = Student::whereIn('id', $activeStudents)->get();

        $uniqueNumbers = collect();
        foreach ($students as $student) {
            if ($student->g_whatsapp) $uniqueNumbers->push($student->g_whatsapp);
            if ($student->g_whatsapp2) $uniqueNumbers->push($student->g_whatsapp2);
        }
        $uniqueNumbers = $uniqueNumbers->unique()->filter();

        $responses = [];
        foreach ($uniqueNumbers as $whatsappNumber) {
            $formattedPhoneNumber = $this->formatPhoneNumber($whatsappNumber);
            $this->sendWhatsAppReminder($formattedPhoneNumber, $message);
            $responses[] = [
                'phone' => $formattedPhoneNumber,
            ];
        }

        // Return the responses
        return response()->json([
            'message' => 'Messages sent successfully.',
            'responses' => $responses,
        ]);
    }

    /**
     * Helper function to send WhatsApp reminders.
     */
    private function sendWhatsAppReminder($phoneNumber, $message)
    {
        // Format the phone number (if needed)
        $phoneNumber = $this->formatPhoneNumber($phoneNumber);

        // WhatsApp API credentials from .env
        $whatsappApiUrl = env('WHATSAPP_API_URL', 'https://graph.facebook.com/v22.0/587101311164351/messages'); // Default value if not set
        $accessToken = env('WHATSAPP_ACCESS_TOKEN', ''); // Default to empty if not set

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



    public function sendPaymentReminders(Request $request)
    {
        // Retrieve the userEmail from the request
        $email = $request->query('email');

        if (!$email) {
            return response()->json(['message' => 'User email is required.'], 400);
        }

        // **Check for Internet Connection**
        try {
            Http::withOptions(['verify' => false])->get('https://www.google.com');
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'No internet connection. Please check your connection and try again.',
                'error' => $e->getMessage(),
            ], 500);
        }

        // Retrieve the before_payment_template value from the users table
        $beforePaymentWeek3 = User::where('email', $email)->value('before_payment_week3');
        $beforePaymentWeek4 = User::where('email', $email)->value('before_payment_week4');

        if (!$beforePaymentWeek3) {
            return response()->json(['message' => 'No Before payment template Week 3 found for the provided email.'], 404);
        }

        if (!$beforePaymentWeek4) {
            return response()->json(['message' => 'No Before payment template Week 4 found for the provided email.'], 404);
        }

        // Assign a custom date for testing purposes
        // $customDate = '2025-05-18'; // Replace this with your desired date
        // $now = Carbon::parse($customDate); // Parse the custom date
        // $today = $now->startOfDay(); // Use this for today's date

        $now = Carbon::now(); // Use the current date
        $today = $now->startOfDay(); // Start of the current day

        // Get the current year and month based on the custom date
        $currentYear = $now->year;
        $currentMonth = $now->month;

        $year = Year::where('year', $currentYear)->first();
        $month = Month::where('id', $currentMonth)->first();

        if (!$year || !$month) {
            return response()->json(['message' => 'Year or month not found.'], 404);
        }

        $yearId = $year->id;
        $monthId = $month->id;

        // Get the class_id for English classes
        $englishClassId = ClassModel::where('class_name', 'English')->value('id');
        if (!$englishClassId) {
            return response()->json(['message' => 'English class not found.'], 404);
        }

        // Get all tuitions for English classes
        $tuitions = Tuition::where('class_id', $englishClassId)->get();


        // --- INSERT student_reports for all active students on the 1st day of the month ---
        foreach ($tuitions as $tuition) {
            $activeStudentIds = StudentTuition::where('tuition_id', $tuition->id)
                ->where('status', 1)
                ->pluck('student_id');

            foreach ($activeStudentIds as $studentId) {
                $reportExists = StudentReport::where('student_id', $studentId)
                    ->where('tuition_id', $tuition->id)
                    ->where('year_id', $yearId)
                    ->where('month_id', $monthId)
                    ->exists();

                if (!$reportExists) {
                    StudentReport::create([
                        'student_id' => $studentId,
                        'tuition_id' => $tuition->id,
                        'year_id' => $yearId,
                        'month_id' => $monthId,
                        'paid' => false,
                        'week1' => false,
                        'week2' => false,
                        'week3' => false,
                        'week4' => false,
                        'week5' => false,
                        'reminder_week3' => false,
                        'reminder_week4' => false,
                    ]);
                }
            }
        }

        // -------------------------------------------------------------------------------


        // Array to store IDs of students who received messages
        $messagedStudentIds = [];
        // $uniqueWhatsAppNumbers = collect(); // To store unique WhatsApp numbers

        // Process reminders for each tuition
        foreach ($tuitions as $tuition) {
            $dayId = $tuition->day_id; // 0=Sunday, 1=Monday, etc.

            // Find all class days for this tuition in the current month
            $classDays = [];
            $daysInMonth = $now->daysInMonth;
            for ($d = 1; $d <= $daysInMonth; $d++) {
                $date = Carbon::create($now->year, $now->month, $d);
                if ($date->dayOfWeek == $dayId) {
                    $classDays[] = $date;
                }
            }

            // For each class day, check if today is the day before
            foreach ($classDays as $index => $classDay) {
                $weekNumber = $index + 1; // Week 1-based (first occurrence is week 1)
                $dayBefore = $classDay->copy()->subDay();

                if ($today->equalTo($dayBefore)) {
                    $reminderField = null;
                    $template = null;
                    if ($weekNumber == 3) {
                        $reminderField = 'reminder_week3';
                        $template = $beforePaymentWeek3;
                    } elseif ($weekNumber == 4) {
                        $reminderField = 'reminder_week4';
                        $template = $beforePaymentWeek4;
                    }

                    if ($reminderField && $template) {
                        $studentsToRemind = StudentReport::where('tuition_id', $tuition->id)
                            ->where('year_id', $yearId)
                            ->where('month_id', $monthId)
                            ->where('paid', false)
                            ->where($reminderField, false)
                            ->with('student')
                            ->get();

                        $numbersToMessage = collect();

                        foreach ($studentsToRemind as $studentReport) {
                            $student = $studentReport->student;
                            if ($student) {
                                if ($student->g_whatsapp) $numbersToMessage->push($student->g_whatsapp);
                                if ($student->g_whatsapp2) $numbersToMessage->push($student->g_whatsapp2);

                                // Mark the reminder as sent
                                $studentReport->$reminderField = true;
                                $studentReport->save();

                                $messagedStudentIds[] = $student->id;
                            }
                        }

                        // Send the template to unique numbers only
                        foreach ($numbersToMessage->unique() as $whatsappNumber) {
                            $this->sendWhatsAppReminder($whatsappNumber, $template);
                        }
                    }
                }
            }
        }

        // Return the response with the list of messaged student IDs
        if (count($messagedStudentIds) > 0) {
            return response()->json([
                'message' => 'Payment reminders processed successfully.',
                'messagedStudentIds' => $messagedStudentIds,
            ]);
        } else {
            return response()->json([
                'message' => 'No reminders sent.',
            ]);
        }
    }

    public function fetchStudentData(Request $request)
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

        $selectedClassName = $classMap[$selectedClass]; // Map the class code to its name

        // Validate the incoming request
        $request->validate([
            'grades' => 'required|array',
            'grades.*' => 'string', // Ensure each grade is a string
            'category' => 'required|string',
        ]);

        $grades = $request->input('grades');
        $category = $request->input('category');

        // Step 1: Search the 'categories' table
        $categoryRecord = Category::where('category_name', $category)->first();
        if (!$categoryRecord) {
            return response()->json(['message' => 'Category not found'], 404);
        }
        $categoryId = $categoryRecord->id;

        // Step 2: Search the 'classes' table
        $classRecord = ClassModel::where('class_name', $selectedClassName)->first();
        if (!$classRecord) {
            return response()->json(['message' => 'Class not found'], 404);
        }
        $classId = $classRecord->id;

        // Step 3: Find the 'category_id' and 'class_id' in the 'tuitions' table
        $tuitionRecords = Tuition::where('category_id', $categoryId)
            ->where('class_id', $classId)
            ->get();

        if ($tuitionRecords->isEmpty()) {
            return response()->json([
                'students' => null,
                'tuitionId' => null, // Send null if no tuitions are found
            ]);
        }

        // Step 4: Search the 'tuitions_has_grades' table
        $tuitionIds = $tuitionRecords->pluck('id')->toArray();
        $gradeIds = Grade::whereIn('grade_name', $grades)->pluck('id')->toArray();

        $matchingTuitions = Tuition::whereIn('id', $tuitionIds)
            ->whereHas('grades', function ($query) use ($gradeIds) {
                $query->whereIn('grade_id', $gradeIds);
            })
            ->get();

        // Filter tuitions to match exactly the incoming grades
        $exactMatchingTuitions = $matchingTuitions->filter(function ($tuition) use ($grades) {
            $tuitionGrades = $tuition->grades->pluck('grade_name')->sort()->values()->toArray();
            $incomingGrades = collect($grades)->sort()->values()->toArray();
            return $tuitionGrades === $incomingGrades; // Ensure exact match
        });

        if ($exactMatchingTuitions->isEmpty()) {
            return response()->json([
                'students' => null,
                'tuitionId' => $tuitionRecords->pluck('id')->first(), // Send the first tuitionId
            ]);
        }

        // Step 5: Fetch students from the 'students_has_tuitions' table
        $studentTuitions = StudentTuition::whereIn('tuition_id', $exactMatchingTuitions->pluck('id'))
            ->with('student') // Eager load the related student
            ->get();

        $studentIds = $studentTuitions->pluck('student_id')->toArray();
        $students = Student::whereIn('id', $studentIds)->get();

        // Step 6: Identify duplicate g_whatsapp numbers globally
        $globalWhatsappCounts = Student::groupBy('g_whatsapp')
            ->havingRaw('COUNT(*) >= 3')
            ->pluck('g_whatsapp')
            ->toArray();

        // **Updated Logic: Update Student Tuition Statuses**
        // Get the date two months ago
        $twoMonthsAgo = Carbon::now()->subMonths(2)->startOfMonth();
        $currentMonth = Carbon::now()->startOfMonth();

        // Fetch records from students_has_tuitions where created_at is two months prior to the current month
        $studentTuitionsToUpdate = StudentTuition::where('created_at', '<=', $twoMonthsAgo)
            ->where('status', 1) // Only check active records
            ->get();

        foreach ($studentTuitionsToUpdate as $studentTuition) {
            $studentId = $studentTuition->student_id;
            $tuitionId = $studentTuition->tuition_id;

            // Check if there are any reports for this student and tuition in the last two months up to the current month
            $hasReports = StudentReport::where('student_id', $studentId)
                ->where('tuition_id', $tuitionId)
                ->whereBetween('created_at', [$twoMonthsAgo, $currentMonth])
                ->exists();

            // If no reports exist, update the status to 0
            if (!$hasReports) {
                $studentTuition->status = 0;
                $studentTuition->save();

                // Log the update for debugging purposes
                // \Log::info("Updated status to 0 for student ID: $studentId, tuition ID: $tuitionId");
            }
        }

        // Step 7: Check for data in the 'students_has_tuitions' table and determine registration and special status
        $studentData = $studentTuitions->map(function ($studentTuition) use ($exactMatchingTuitions, $globalWhatsappCounts) {
            $student = $studentTuition->student;
            $report = StudentReport::where('student_id', $student->id)
                ->whereIn('tuition_id', $exactMatchingTuitions->pluck('id'))
                ->first();

            // Check if any of the specified fields are null
            $fieldsToCheck = ['address1', 'school', 'g_name', 'g_mobile', 'dob'];
            $isRegistered = true;

            foreach ($fieldsToCheck as $field) {
                if (is_null($student->$field)) {
                    $isRegistered = false;
                    break;
                }
            }

            // Determine if the student is special based on global g_whatsapp counts
            $isSpecial = in_array($student->g_whatsapp, $globalWhatsappCounts) && $studentTuition->status == 1;

            return [
                'child_id' => $student->id,
                'sno' => $student->sno,
                'child_name' => $student->name,
                'gWhatsapp' => $student->g_whatsapp,
                'gWhatsapp2' => $student->g_whatsapp2,
                'week1' => boolval($report->week1 ?? false),
                'week2' => boolval($report->week2 ?? false),
                'week3' => boolval($report->week3 ?? false),
                'week4' => boolval($report->week4 ?? false),
                'week5' => boolval($report->week5 ?? false),
                'paid' => boolval($report->paid ?? false),
                'status' => boolval($studentTuition->status), // Use status from students_has_tuitions
                'register' => $isRegistered, // Add registration status
                'special' => $isSpecial, // Add special status
            ];
        });

        return response()->json([
            'tuitionId' => $exactMatchingTuitions->pluck('id')->first(), // Send the first tuitionId
            'students' => $studentData, // Send the students data
        ]);
    }

    public function history(Request $request)
    {
        $tuitionId = $request->query('tuitionId'); // Get tuitionId from the request
        $year = $request->query('year'); // Get year from the request
        $month = $request->query('month'); // Get month from the request

        // Validate the year and month
        $yearRecord = Year::where('year', $year)->first();
        $monthRecord = Month::where('id', $month)->first();

        if (!$yearRecord || !$monthRecord) {
            return response()->json(['message' => 'Invalid year or month.'], 404);
        }

        $yearId = $yearRecord->id;
        $monthId = $monthRecord->id;

        // Fetch the day_id associated with the tuition_id
        $tuition = Tuition::find($tuitionId);
        if (!$tuition) {
            return response()->json(['message' => 'Tuition not found.'], 404);
        }

        $dayId = $tuition->day_id;

        // Generate the dayHeaders object with week numbers and the specific day number of the month
        $currentMonth = Carbon::createFromDate($year, $month, 1);
        $dayHeaders = [];
        for ($week = 1; $week <= 5; $week++) {
            $date = $currentMonth->copy()->addWeeks($week - 1)->startOfWeek($dayId); // Start from the specific day of the week
            if ($date->month == $month) {
                $formattedDate = $date->format('m/d'); // Format as MM/DD
                $dayHeaders[] = "$formattedDate"; // Add week number and date
            }
        }

        // Step 1: Fetch students from the 'students_has_tuitions' table for the given tuitionId
        $studentTuitions = StudentTuition::where('tuition_id', $tuitionId)
            ->with('student') // Eager load the related student
            ->get();

        if ($studentTuitions->isEmpty()) {
            return response()->json([
                'students' => null,
                'dayHeaders' => $dayHeaders, // Include the dayHeaders object in the response
            ]);
        }

        // Map student statuses from the 'students_has_tuitions' table
        $studentStatuses = $studentTuitions->pluck('status', 'student_id');

        // Step 2: Fetch student reports from the 'student_reports' table for the given tuitionId, year, and month
        $studentReports = StudentReport::where('tuition_id', $tuitionId)
            ->where('year_id', $yearId)
            ->where('month_id', $monthId)
            ->get();

        // Map reports by student_id for easier access
        $reportsByStudentId = $studentReports->keyBy('student_id');

        // Step 3: Fetch attendance and payment data for the previous month
        $previousMonth = Carbon::createFromDate($year, $month, 1)->subMonth();
        $previousMonthId = Month::where('month', $previousMonth->format('F'))->value('id');
        $previousYearId = Year::where('year', $previousMonth->year)->value('id');

        $previousMonthReports = StudentReport::where('tuition_id', $tuitionId)
            ->where('year_id', $previousYearId)
            ->where('month_id', $previousMonthId)
            ->get();

        $attendanceByStudentId = $previousMonthReports->mapWithKeys(function ($report) {
            $weeksAttended = collect([
                $report->week1,
                $report->week2,
                $report->week3,
                $report->week4,
                $report->week5,
            ])->filter()->count(); // Count the number of weeks attended
            return [$report->student_id => $weeksAttended];
        });

        $paymentByStudentId = $previousMonthReports->mapWithKeys(function ($report) {
            return [$report->student_id => $report->paid];
        });

        // Step 4: Identify duplicate WhatsApp numbers globally
        $globalWhatsappCounts = Student::select('g_whatsapp')
            ->groupBy('g_whatsapp')
            ->havingRaw('COUNT(*) >= 3') // Only include WhatsApp numbers with 3 or more occurrences
            ->pluck('g_whatsapp')
            ->toArray();

        // Step 5: Format the response
        $formattedData = $studentTuitions->map(function ($studentTuition) use ($reportsByStudentId, $studentStatuses, $attendanceByStudentId, $paymentByStudentId, $globalWhatsappCounts) {
            $student = $studentTuition->student;
            $report = $reportsByStudentId->get($student->id); // Get the report for the student, if it exists

            // Check if any of the specified fields are null
            $fieldsToCheck = ['address1', 'school', 'g_name', 'g_mobile', 'gender', 'dob', 'created_at'];
            $isRegistered = true;

            foreach ($fieldsToCheck as $field) {
                if (is_null($student->$field)) {
                    $isRegistered = false;
                    break;
                }
            }

            // Check if the student has valid data for the previous month
            $weeksAttended = $attendanceByStudentId[$student->id] ?? null;
            $hasPaid = $paymentByStudentId[$student->id] ?? null;

            // Determine the 'notPaid' value
            $notPaid = false;
            if (!is_null($weeksAttended) && !is_null($hasPaid)) {
                $notPaid = $weeksAttended >= 2 && !$hasPaid;
            }

            // Determine if the student is special based on global WhatsApp counts
            $isSpecial = in_array($student->g_whatsapp, $globalWhatsappCounts);

            return [
                'child_id' => $student->id,
                'child_name' => $student->name,
                'sno' => $student->sno,
                'gWhatsapp' => $student->g_whatsapp,
                'created_at' => $student->created_at,
                'week1' => boolval($report->week1 ?? false), // Cast to boolean
                'week2' => boolval($report->week2 ?? false), // Cast to boolean
                'week3' => boolval($report->week3 ?? false), // Cast to boolean
                'week4' => boolval($report->week4 ?? false), // Cast to boolean
                'week5' => boolval($report->week5 ?? false), // Cast to boolean
                'paid' => boolval($report->paid ?? false),   // Cast to boolean
                'register' => $isRegistered,                // Add register status
                'status' => $studentStatuses[$student->id] ?? null, // Fetch the status from 'students_has_tuitions'
                'notpaid' => $notPaid,                      // Add notpaid status
                'special' => $isSpecial,                    // Add special status
            ];
        });

        return response()->json([
            'students' => $formattedData,
            'dayHeaders' => $dayHeaders, // Include the dayHeaders object in the response
        ]);
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
}
