<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    // Show login form
    public function showLoginForm()
    {
        return view('auth.login');
    }

    public function authenticate(Request $request)
    {
        $request->validate([
            'phone_number' => ['required', 'string', 'regex:/^(251\d{9}|09\d{8}|9\d{8})$/'],
            'password'     => 'required',
        ], [
            'phone_number.regex' => 'Enter a valid Ethiopian phone number (e.g. 251912345678, 0912345678, or 912345678).',
        ]);

        // Normalize to 251 format
        $phone = $request->phone_number;
        if (str_starts_with($phone, '09')) {
            $phone = '251' . substr($phone, 1);
        } elseif (str_starts_with($phone, '9') && strlen($phone) === 9) {
            $phone = '251' . $phone;
        }

        if (Auth::attempt(['phone_number' => $phone, 'password' => $request->password, 'is_subscribed' => true])) {
            return redirect()->intended('/');
        }

        $user = \App\Models\User::where('phone_number', $phone)->first();
        if ($user && !$user->is_subscribed) {
            return back()->withErrors([
                'phone_number' => 'Your account is not subscribed. Please send OK to 6462 to activate your subscription.',
            ])->withInput();
        }

        return back()->withErrors([
            'phone_number' => 'Invalid phone number or password.',
        ])->onlyInput('phone_number');
    }

    // Handle logout
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        
        return redirect('/');
    }
}
