<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage; // Import Storage facade

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
                // Extract base64 data and extension
                $imageData = substr($request->image, strpos($request->image, ',') + 1);
                $imageData = base64_decode($imageData);
                if ($imageData === false) {
                    return response()->json(['message' => 'Invalid base64 image data'], 400);
                }
                $extension = strtolower($matches[1]); // e.g., jpeg, png
                if (!in_array($extension, ['jpeg', 'jpg', 'png'])) {
                    return response()->json(['message' => 'Unsupported image format'], 400);
                }

                // Generate a unique filename: username_XXXXXX.ext
                $sanitizedName = preg_replace('/[^A-Za-z0-9_\-]/', '', strtolower($request->name));
                $randomCode = mt_rand(100000, 999999);
                $fileName = $sanitizedName . '_' . $randomCode . '.' . $extension;
                $imagePath = 'uploads/users/' . $fileName;

                // Delete old image if exists
                if ($user->image_path && Storage::disk('public')->exists($user->image_path)) {
                    Storage::disk('public')->delete($user->image_path);
                }

                // Save the decoded image
                Storage::disk('public')->put($imagePath, $imageData);
            }

            // Prepare update data
            $updateData = [
                'name' => $request->name,
                'email' => $request->email,
                'password' => $request->password,
                'Before_Payment_Template' => $request->beforePaymentTemplate,
                'After_Payment_Template' => $request->afterPaymentTemplate,
                'image_path' => $imagePath,
                'status' => 1, // Hardcoded as per original logic
                'mode' => 'D', // Hardcoded as per original logic
            ];

            // Hash password if provided
            if ($request->filled('password')) {
                $updateData['password'] = Hash::make($request->password);
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
