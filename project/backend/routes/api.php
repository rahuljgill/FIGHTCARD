<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Mail;
use App\Http\Controllers\FightController;
use App\Http\Controllers\AuthController;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Support\Facades\URL;
use App\Models\User;
use Illuminate\Auth\Events\Verified;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/test', function () {
    return response()->json([
        'message' => 'Hello from Laravel!',
        'status' => 'success'
    ]);
});


Route::post('/auth/register', [AuthController::class, 'register']);

Route::get('/fights/{fightId}/comments', [FightController::class, 'comments']);

Route::get('/fights/{fightId}/predictions', [FightController::class, 'predictions']);

Route::post('/auth/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->post('/auth/logout', [AuthController::class, 'logout']);

Route::middleware('auth:sanctum')->delete('/auth/delete', [AuthController::class, 'delete']);

Route::get('/test-email', function () {
    Mail::raw(
        'This is a test email from Fight Card Boxing.',
        function ($message) {
            $message
                ->to('fightcardboxingproject@gmail.com')
                ->subject('FightCard Email Test');
        }
    );

    return response()->json([
        'message' => 'Test email sent',
    ]);
});


Route::middleware('auth:sanctum')->post(
    '/fights/{fightId}/comments',
    [FightController::class, 'storeComment']
);

Route::middleware('auth:sanctum')->put('/comments/{comment}', [FightController::class, 'updateComment']);

Route::middleware('auth:sanctum')->delete('/comments/{comment}', [FightController::class, 'deleteComment']);


Route::middleware('auth:sanctum')->patch(
    '/auth/password',
    [AuthController::class, 'changePassword']
);

Route::middleware('auth:sanctum')->post(
    '/fights/{fightId}/predictions',
    [FightController::class, 'storePrediction']
);

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
})->middleware('throttle:6,1');