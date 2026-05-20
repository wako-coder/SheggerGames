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
        $validator = Validator::make($request->all(), [
            'phone_number'   => 'required|string',
            'password'       => 'required|string|min:6',
            'product_number' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $user = User::where('phone_number', $request->phone_number)->first();

        if ($user) {
            $user->update(['is_subscribed' => true]);
            return response()->json(['message' => 'User re-subscribed successfully', 'phone_number' => $user->phone_number, 'is_subscribed' => true], 200);
        }

        $user = User::create([
            'phone_number'   => $request->phone_number,
            'password'       => Hash::make($request->password),
            'product_number' => $request->product_number,
            'is_subscribed'  => true,
        ]);

        return response()->json(['message' => 'User registered successfully', 'phone_number' => $user->phone_number, 'is_subscribed' => true], 201);
    }

    public function delete(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'phone_number' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $user = User::where('phone_number', $request->phone_number)->first();

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $user->update(['is_subscribed' => false]);

        return response()->json(['message' => 'User unsubscribed successfully'], 200);
    }
}
