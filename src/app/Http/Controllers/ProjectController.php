<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Project;

class ProjectController extends Controller
{
    public function index()
    {
        return response()->json(
            Project::all()
        );
    }

    public function store(Request $request)
    {
        $project = Project::create([
            'name' => trim($request->name),
            'created_by' => auth()->id(),
        ]);

        return response()->json($project);
    }

    public function update(Request $request, $id)
    {
        $project = Project::findOrFail($id);

        $project->update([
            'name' => trim($request->name),
        ]);

        return response()->json($project);
    }

    public function destroy($id)
    {
        $project = Project::findOrFail($id);

        $project->delete();

        return response()->json([
            'message' => '削除成功'
        ]);
    }
}