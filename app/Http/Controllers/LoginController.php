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

    // Handle login submission
    public function authenticate(Request $request)
    {
        // Validate input
    
$request->validate([
    'phone_number' => [
        'required', 
        'string',
        // Matches exactly 251 followed by exactly 9 digits
        'regex:/^251\d{9}$/' 
    ],
    'password' => 'required',
], [
    // Custom error message so the user knows exactly what went wrong
    'phone_number.regex' => 'The phone number must start with 251 followed by exactly 9 digits.',
]);

        // Attempt login
        if (Auth::attempt(['phone_number' => $request->phone_number, 'password' => $request->password])) {
            // Redirect to dashboard on success
            return redirect()->intended('/');
        }

        // Return back with error if login fails
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
