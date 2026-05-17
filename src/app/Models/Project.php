<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable = [
        'name',
        'created_by'
    ];

    // プロジェクト作成者
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // タスク一覧
    public function tasks()
    {
        return $this->hasMany(Task::class);
    }

    // 所属メンバー
    public function users()
    {
        return $this->belongsToMany(User::class);
    }
}