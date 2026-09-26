<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // --------------------------------------------------
        // MOCK USERS
        // --------------------------------------------------

        $alex = User::create([
            'name' => 'Alex Johnson',
            'email' => 'alex@example.com',
            'password' => Hash::make('password'),
        ]);

        $mike = User::create([
            'name' => 'Mike Thompson',
            'email' => 'mike@example.com',
            'password' => Hash::make('password'),
        ]);

        $sarah = User::create([
            'name' => 'Sarah Williams',
            'email' => 'sarah@example.com',
            'password' => Hash::make('password'),
        ]);


        // --------------------------------------------------
        // COMMENTS
        // --------------------------------------------------

        $alexComment = DB::table('comments')->insertGetId([
            'user_id' => $alex->id,
            'fight_id' => 'isaac-cruz-vs-nestor-bravo',
            'parent_id' => null,
            'body' => "I've got Cruz winning this one. His pressure should be too much.",
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $mikeComment = DB::table('comments')->insertGetId([
            'user_id' => $mike->id,
            'fight_id' => 'isaac-cruz-vs-nestor-bravo',
            'parent_id' => null,
            'body' => "Not convinced. Bravo has the tools to make this competitive.",
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Sarah replies to Mike
        $sarahReply = DB::table('comments')->insertGetId([
            'user_id' => $sarah->id,
            'fight_id' => 'isaac-cruz-vs-nestor-bravo',
            'parent_id' => $mikeComment,
            'body' => "Agreed. I think Bravo could surprise people here.",
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Alex replies to Sarah's reply
        DB::table('comments')->insert([
            'user_id' => $alex->id,
            'fight_id' => 'isaac-cruz-vs-nestor-bravo',
            'parent_id' => $sarahReply,
            'body' => "I can see that, but Cruz's pace over 12 rounds is the deciding factor for me.",
            'created_at' => now(),
            'updated_at' => now(),
        ]);


        // --------------------------------------------------
        // PREDICTIONS
        // --------------------------------------------------

        DB::table('predictions')->insert([
            [
                'user_id' => $alex->id,
                'fight_id' => 'isaac-cruz-vs-nestor-bravo',
                'fighter_id' => 'isaac-cruz',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => $mike->id,
                'fight_id' => 'isaac-cruz-vs-nestor-bravo',
                'fighter_id' => 'nestor-bravo',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => $sarah->id,
                'fight_id' => 'isaac-cruz-vs-nestor-bravo',
                'fighter_id' => 'isaac-cruz',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}