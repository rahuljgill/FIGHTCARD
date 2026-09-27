<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Mail;
use App\Http\Controllers\FightController;
use App\Http\Controllers\AuthController;

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