<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Prediction;
use Illuminate\Http\Request;

class FightController extends Controller
{
    public function comments(string $fightId)
    {
        $comments = Comment::with([
            'user',
            'replies.user',
        ])
            ->where('fight_id', $fightId)
            ->whereNull('parent_id')
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json(
            $comments->map(fn ($comment) => $this->formatComment($comment))
        );
    }

    private function formatComment(Comment $comment): array
    {
        return [
    'id' => $comment->id,
    'userId' => $comment->user_id,
    'username' => $comment->user->name,
    'timeAgo' => $comment->created_at->diffForHumans(),
    'message' => $comment->body,

    'replies' => $comment->replies
        ->sortBy('created_at')
        ->map(fn ($reply) => $this->formatComment($reply))
        ->values(),
];
    }

   public function predictions(Request $request, string $fightId)
{
    $fighter1Id = $request->query('fighter1');
    $fighter2Id = $request->query('fighter2');

    $predictions = Prediction::where('fight_id', $fightId)->get();

    $totalVotes = $predictions->count();

    $fighter1Votes = $predictions
        ->where('fighter_id', $fighter1Id)
        ->count();

    $fighter2Votes = $predictions
        ->where('fighter_id', $fighter2Id)
        ->count();

    $fighter1Percentage = $totalVotes > 0
        ? round(($fighter1Votes / $totalVotes) * 100)
        : 0;

    $fighter2Percentage = $totalVotes > 0
        ? 100 - $fighter1Percentage
        : 0;

    $userVote = null;

    if ($request->user()) {
        $userPrediction = $predictions
            ->where('user_id', $request->user()->id)
            ->first();

        $userVote = $userPrediction?->fighter_id;
    }

    return response()->json([
        'totalVotes' => $totalVotes,

        'fighter1' => [
            'fighterId' => $fighter1Id,
            'votes' => $fighter1Votes,
            'percentage' => $fighter1Percentage,
        ],

        'fighter2' => [
            'fighterId' => $fighter2Id,
            'votes' => $fighter2Votes,
            'percentage' => $fighter2Percentage,
        ],

        'userVote' => $userVote,
       
    ]);
}


public function storeComment(Request $request, string $fightId)
{
    $validated = $request->validate([
        'body' => ['required', 'string', 'max:2000'],
        'parent_id' => ['nullable', 'integer', 'exists:comments,id'],
    ]);

    if (!empty($validated['parent_id'])) {
        $parentComment = Comment::where('id', $validated['parent_id'])
            ->where('fight_id', $fightId)
            ->first();

        if (!$parentComment) {
            return response()->json([
                'message' => 'The parent comment does not belong to this fight.',
            ], 422);
        }
    }

    $comment = Comment::create([
        'user_id' => $request->user()->id,
        'fight_id' => $fightId,
        'parent_id' => $validated['parent_id'] ?? null,
        'body' => $validated['body'],
    ]);

    $comment->load('user');

    return response()->json([
        'comment' => $comment,
    ], 201);
}

public function deleteComment(Request $request, Comment $comment)
{
    if ($comment->user_id !== $request->user()->id) {
        return response()->json([
            'message' => 'You are not allowed to delete this comment.',
        ], 403);
    }

    $comment->delete();

    return response()->json([
        'message' => 'Comment deleted successfully.',
    ]);
}

public function updateComment(Request $request, Comment $comment)
{
    if ($comment->user_id !== $request->user()->id) {
        return response()->json([
            'message' => 'You are not allowed to edit this comment.',
        ], 403);
    }

    $validated = $request->validate([
        'body' => ['required', 'string', 'max:2000'],
    ]);

    $comment->update([
        'body' => $validated['body'],
    ]);

    return response()->json([
        'message' => 'Comment updated successfully.',
    ]);
}

public function storePrediction(Request $request, string $fightId)
{
    $validated = $request->validate([
        'fighter_id' => ['required', 'string'],
    ]);

    $existingPrediction = Prediction::where('fight_id', $fightId)
        ->where('user_id', $request->user()->id)
        ->first();

    if ($existingPrediction) {
        return response()->json([
            'message' => 'You have already voted on this fight.',
        ], 409);
    }

    $prediction = Prediction::create([
        'user_id' => $request->user()->id,
        'fight_id' => $fightId,
        'fighter_id' => $validated['fighter_id'],
    ]);

    return response()->json([
        'message' => 'Prediction submitted successfully.',
        'prediction' => $prediction,
    ], 201);
}
}

