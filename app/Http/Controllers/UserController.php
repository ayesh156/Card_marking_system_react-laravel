<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage; // Import Storage facade
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\Facades\JWTAuth;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    public function login(Request $request)
    {
        // Validate the incoming request
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // Retrieve the user by email
        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'Invalid email or password'], 401);
        }

        // Check if the user is blocked (status = false)
        if (!$user->status) {
            return response()->json([
                'message' => 'Your account has been blocked. Please contact the administrator for assistance.',
            ], 403); // 403 Forbidden
        }

        // Compare the plain-text password directly (not recommended)
        if ($request->password !== $user->password) {
            return response()->json(['message' => 'Invalid email or password'], 401);
        }

        // Generate a JWT token for the user
        $token = JWTAuth::fromUser($user);

        // Set the email in a cookie for 30 days
        $cookie = cookie('user_email', $user->email, 43200); // 43200 minutes = 30 days

        return response()->json([
            'message' => 'Login successful',
            'token' => $token,
            'user' => $user,
        ])->withCookie($cookie);
    }

    public function logout()
    {
        Auth::logout();

        // Clear the email cookie
        $cookie = cookie()->forget('user_email');

        return response()->json(['message' => 'Logout successful'])->withCookie($cookie);
    }

    public function updateMode(Request $request, string $email)
    {
        $request->validate([
            'mode' => 'required|in:L,D',
        ]);

        $user = User::where('email', $email)->first();
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user->mode = $request->mode;
        $user->save();

        return response()->json(['message' => 'Mode updated successfully', 'mode' => $user->mode]);
    }

    public function getMode(string $email)
    {
        $user = User::where('email', $email)->first();
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json(['mode' => $user->mode]);
    }

    public function updateStatus(Request $request, string $email)
    {
        $request->validate([
            'status' => 'required|boolean',
        ]);

        $user = User::where('email', $email)->first();
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user->status = $request->status;
        $user->save();

        return response()->json(['message' => 'User status updated successfully']);
    }

    public function getAllUsers()
    {
        try {
            // Fetch all users except admin@gmail.com
            $users = User::select('id', 'name', 'email', 'status')
                ->where('email', '!=', 'admin@gmail.com')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $users,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch users',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    /**
     * Store a newly created resource in storage.
     */

    public function update(UserRequest $request, string $email)
    {
        try {
            // Find the user by email
            $user = User::where('email', $email)->first();
            if (!$user) {
                return response()->json(['message' => 'User not found'], 404);
            }

            // Handle image upload (base64 string)
            $imagePath = $user->image_path;
            if ($request->has('image') && preg_match('/^data:image\/(\w+);base64,/', $request->image, $matches)) {
                $imageData = substr($request->image, strpos($request->image, ',') + 1);
                $imageData = base64_decode($imageData);
                if ($imageData === false) {
                    return response()->json(['message' => 'Invalid base64 image data'], 400);
                }
                $extension = strtolower($matches[1]);
                if (!in_array($extension, ['jpeg', 'jpg', 'png'])) {
                    return response()->json(['message' => 'Unsupported image format'], 400);
                }
                $sanitizedName = preg_replace('/[^A-Za-z0-9_\-]/', '', strtolower($request->name));
                $randomCode = mt_rand(100000, 999999);
                $fileName = $sanitizedName . '_' . $randomCode . '.' . $extension;
                $imagePath = 'uploads/users/' . $fileName;
                if ($user->image_path && Storage::disk('public')->exists($user->image_path)) {
                    Storage::disk('public')->delete($user->image_path);
                }
                Storage::disk('public')->put($imagePath, $imageData);
            }

            // Prepare update data
            $updateData = [
                'name' => $request->name,
                'email' => $request->email,
                'before_payment_week3' => $request->beforePaymentWeek3,
                'before_payment_week4' => $request->beforePaymentWeek4,
                'after_payment_template' => $request->afterPaymentTemplate,
                'after_payment_spoken_template' => $request->afterSpokenPaymentTemplate,
                'image_path' => $imagePath,
                'status' => 1,
                'mode' => 'D',
            ];

            // Add all after_payment_*_template fields from the request
            foreach ($request->all() as $key => $value) {
                if (preg_match('/^after_payment_(nursery|grade\d+)_template$/', $key)) {
                    $updateData[$key] = $value;
                }
            }

            // Update user
            $user->update($updateData);

            return response()->json([
                'message' => 'User updated successfully',
                'user' => $user,
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error updating user: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to update user: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $email)
    {
        $user = User::where('email', $email)->first();
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }
        return response()->json($user);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
