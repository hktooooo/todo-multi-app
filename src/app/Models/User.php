<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * 一括代入許可
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * APIレスポンスで非表示
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * 型変換
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * 所属プロジェクト
     */
    public function projects()
    {
        return $this->belongsToMany(Project::class);
    }

    /**
     * 担当タスク
     */
    public function assignedTasks()
    {
        return $this->hasMany(Task::class, 'assigned_user_id');
    }

    /**
     * 作成したプロジェクト
     */
    public function createdProjects()
    {
        return $this->hasMany(Project::class, 'created_by');
    }
}