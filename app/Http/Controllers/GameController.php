<?php

namespace App\Http\Controllers;

use App\Models\Game;
use Illuminate\Http\Request;

class GameController extends Controller
{
    public function storeGameStats(Request $request)
    {
        $this->validate($request, [
            'state' => 'required|json'
        ]);

        $game = Game::create([
            'state' => $request->state,
            'request' => json_encode($request->server())
        ]);

        return response()->json(['message' => 'success'], 200); 

    }
}
