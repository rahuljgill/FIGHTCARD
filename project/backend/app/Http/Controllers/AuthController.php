<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => [
    'required',
    'string',
    'confirmed',
    Password::min(8)
        ->letters()
        ->numbers()
        ->symbols()
        ->uncompromised(),
],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        Auth::login($user);

        return response()->json([
            'user' => $user,
        ], 201);
    }

    public function login(Request $request)
{
    $credentials = $request->validate([
        'email' => ['required', 'email'],
        'password' => ['required'],
    ]);

    if (!Auth::attempt($credentials)) {
        return response()->json([
            'message' => 'The provided credentials are incorrect.',
        ], 401);
    }

    $request->session()->regenerate();

    return response()->json([
        'user' => $request->user(),
    ]);
}

public function logout(Request $request)
{
    Auth::guard('web')->logout();

    $request->session()->invalidate();
    $request->session()->regenerateToken();

    return response()->json([
        'message' => 'Logged out successfully',
    ]);
}

public function delete(Request $request)
{
    $user = $request->user();

    Auth::guard('web')->logout();

    $request->session()->invalidate();
    $request->session()->regenerateToken();

    $user->delete();

    return response()->json([
        'message' => 'Account deleted successfully',
    ]);
}


public function changePassword(Request $request)
{
    $user = $request->user();

    $validated = $request->validate([
        'current_password' => ['required', 'current_password'],
        'password' => [
            'required',
            'string',
            'confirmed',
            Password::min(8)
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised(),
        ],
    ]);

    $user->update([
        'password' => Hash::make($validated['password']),
    ]);

    return response()->json([
        'message' => 'Password changed successfully.',
    ]);
}
}