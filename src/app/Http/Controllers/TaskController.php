<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index($projectId)
    {
        $tasks = Task::where('project_id', $projectId) ->get();

        return response()->json($tasks);
    }

    public function store(Request $request)
    {
        $task = Task::create([
            'title' => $request->title,

            'description' =>
                trim((string) $request->description) !== ''
                    ? trim($request->description)
                    : null,

            'status' => 'todo',

            'project_id' => $request->project_id,

            'assigned_user_id' => $request->assigned_user_id
        ]);

        return response()->json($task);
    }
    
    public function update(Request $request, $id)
    {
        $task = Task::findOrFail($id);

        $task->update([
            'title' => $request->has('title')
                ? $request->title
                : $task->title,

            'description' => $request->has('description')
                ? (
                    $request->filled('description')
                        ? trim($request->description)
                        : null
                )
                : $task->description,

            'status' => $request->has('status')
                ? $request->status
                : $task->status,
        ]);

        return response()->json($task);
    }

    public function destroy($id)
    {
        $task = Task::findOrFail($id);

        $task->delete();

        return response()->json([
            'message' => '削除成功'
        ]);
    }    
}
