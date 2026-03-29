<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class RegisterController extends Controller
{
    public function register(Request $request)
    {
        // Validate incoming request
        $validator = Validator::make($request->all(), [
            'phone_number' => 'required|string|unique:users,phone_number',
            'password' => 'required|string|min:6',
            'product_number' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        // Create user
        $user = User::create([
            'phone_number' => $request->phone_number,
            'password' => Hash::make($request->password),
            'product_number' => $request->product_number,
        ]);

        return response()->json(['message' => 'User registered successfully', 'user' => $user], 201);
    }







    public function delete(Request $request)
    {
        return $request->all();
        // Validate phone number
        $validator = Validator::make($request->all(), [
            'phone_number' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        // Find and delete the user
        $user = User::where('phone_number', $request->phone_number)->first();

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted successfully'], 200);
    }
}

