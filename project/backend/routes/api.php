<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FightController;
use App\Http\Controllers\AuthController;
use App\Models\User;
use Illuminate\Auth\Events\Verified;

// Get the authenticated user and their email verification status
Route::get('/user', function (Request $request) {
    $user = $request->user();

    return response()->json(array_merge(
        $user->toArray(),
        [
            'email_verified' => $user->hasVerifiedEmail(),
        ]
    ));
})->middleware('auth:sanctum');

// Authentication
Route::post('/auth/register', [AuthController::class, 'register'])
    ->middleware('throttle:3,1');

Route::post('/auth/login', [AuthController::class, 'login'])
    ->middleware('throttle:3,1');

Route::middleware('auth:sanctum')->post('/auth/logout', [AuthController::class, 'logout']);

Route::middleware('auth:sanctum')->delete('/auth/delete', [AuthController::class, 'delete']);

Route::middleware('auth:sanctum')->patch(
    '/auth/password',
    [AuthController::class, 'changePassword']
);

// Public fight comments and predictions
Route::get('/fights/{fightId}/comments', [FightController::class, 'comments']);

Route::get('/fights/{fightId}/predictions', [FightController::class, 'predictions']);

// Protected actions requiring authentication AND verified email
Route::middleware(['auth:sanctum', 'verified'])->group(function () {
    // Create a comment
    Route::post(
        '/fights/{fightId}/comments',
        [FightController::class, 'storeComment']
    );

    // Update a comment
    Route::put('/comments/{comment}', [FightController::class, 'updateComment']);

    // Delete a comment
    Route::delete('/comments/{comment}', [FightController::class, 'deleteComment']);

    // Submit a prediction
    Route::post(
        '/fights/{fightId}/predictions',
        [FightController::class, 'storePrediction']
    );
});

// Email verification
Route::get('/email/verify/{id}/{hash}', function (Request $request, string $id, string $hash) {
    $user = User::findOrFail($id);

    // Confirm the hash matches the user's email address
    if (! hash_equals($hash, sha1($user->getEmailForVerification()))) {
        abort(403, 'Invalid verification link.');
    }

    // Only verify once
    if (! $user->hasVerifiedEmail()) {
        $user->markEmailAsVerified();

        event(new Verified($user));
    }

    return redirect('https://fightcard.win/email-verified?status=success');
})
    ->middleware('signed')
    ->name('verification.verify');

// Resend verification email
Route::middleware('auth:sanctum')->post('/email/verification-notification', function (Request $request) {
    if ($request->user()->hasVerifiedEmail()) {
        return response()->json([
            'message' => 'Email already verified.',
        ], 400);
    }

    $request->user()->sendEmailVerificationNotification();

    return response()->json([
        'message' => 'Verification link sent.',
    ]);
})->middleware('throttle:3,1');