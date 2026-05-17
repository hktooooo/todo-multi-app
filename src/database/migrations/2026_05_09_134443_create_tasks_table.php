<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();

            $table->string('title');

            $table->text('description')->nullable();

            // todo / doing / done
            $table->string('status')->default('todo');

            // 期限
            $table->date('due_date')->nullable();

            // プロジェクト所属
            $table->foreignId('project_id')
                ->constrained()
                ->onDelete('cascade');

            // 担当者
            $table->foreignId('assigned_user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
