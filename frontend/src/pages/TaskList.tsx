import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./TaskList.css";

function TaskList() {
    const navigate = useNavigate();

    // -------------------------
    // state
    // -------------------------

    // タスク一覧
    const [tasks, setTasks] = useState<any[]>([]);

    // project一覧
    const [projects, setProjects] = useState<any[]>([]);

    // 現在のproject
    const [currentProjectId, setCurrentProjectId]
        = useState<number | null>(null);

    // 追加フォーム
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    // 編集モーダル
    const [editingTask, setEditingTask]
        = useState<any | null>(null);

    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription]
        = useState("");

    // -------------------------
    // logout
    // -------------------------

    const logout = () => {
        localStorage.removeItem("token");

        navigate("/login");
    };

    // -------------------------
    // project取得
    // -------------------------

    const fetchProjects = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost/api/projects",
                {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            console.log(data);

            if (!response.ok) {
                alert("project取得失敗");

                return;
            }

            setProjects(data);

            // 初回project自動選択
            if (data.length > 0) {
                setCurrentProjectId(data[0].id);
            }

        } catch (error) {
            console.error(error);

            alert("通信エラー");
        }
    };

    // -------------------------
    // task取得
    // -------------------------

    const fetchTasks = async () => {

        // 未選択なら取得しない
        if (!currentProjectId) {
            return;
        }

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `http://localhost/api/projects/${currentProjectId}/tasks`,
                {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            console.log(data);

            if (!response.ok) {
                alert("タスク取得失敗");

                return;
            }

            setTasks(data);

        } catch (error) {
            console.error(error);

            alert("通信エラー");
        }
    };

    // -------------------------
    // 初回
    // -------------------------

    useEffect(() => {
        fetchProjects();
    }, []);

    // -------------------------
    // project変更時
    // -------------------------

    useEffect(() => {

        if (currentProjectId) {
            fetchTasks();
        }

    }, [currentProjectId]);

    // -------------------------
    // タスク追加
    // -------------------------

    const addTask = async () => {

        // project未選択
        if (!currentProjectId) {
            alert("projectを選択してください");

            return;
        }

        // 空入力
        if (!title.trim()) {
            alert("タスク名を入力してください");

            return;
        }

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost/api/tasks",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        title: title,
                        description: description,
                        project_id: currentProjectId,
                    }),
                }
            );

            const data = await response.json();

            console.log(data);

            if (!response.ok) {
                alert("タスク追加失敗");

                return;
            }

            // リセット
            setTitle("");
            setDescription("");

            // 再取得
            fetchTasks();

        } catch (error) {
            console.error(error);

            alert("通信エラー");
        }
    };

    // -------------------------
    // タスク削除
    // -------------------------

    const deleteTask = async (taskId: number) => {

        const ok = confirm("削除しますか？");

        if (!ok) {
            return;
        }

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `http://localhost/api/tasks/${taskId}`,
                {
                    method: "DELETE",
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            console.log(data);

            if (!response.ok) {
                alert("削除失敗");

                return;
            }

            fetchTasks();

        } catch (error) {
            console.error(error);

            alert("通信エラー");
        }
    };

    // -------------------------
    // status更新
    // -------------------------

    const updateStatus = async (
        taskId: number,
        currentStatus: string
    ) => {

        let newStatus = "todo";

        if (currentStatus === "todo") {
            newStatus = "doing";
        } else if (currentStatus === "doing") {
            newStatus = "done";
        }

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `http://localhost/api/tasks/${taskId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        status: newStatus,
                    }),
                }
            );

            const data = await response.json();

            console.log(data);

            if (!response.ok) {
                alert("status更新失敗");

                return;
            }

            fetchTasks();

        } catch (error) {
            console.error(error);

            alert("通信エラー");
        }
    };

    // -------------------------
    // 編集開始
    // -------------------------

    const openEditModal = (task: any) => {

        setEditingTask(task);

        setEditTitle(task.title);

        setEditDescription(task.description ?? "");
    };

    // -------------------------
    // 保存
    // -------------------------

    const saveTask = async () => {

        if (!editingTask) {
            return;
        }

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `http://localhost/api/tasks/${editingTask.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        title: editTitle,
                        description: editDescription,
                    }),
                }
            );

            const data = await response.json();

            console.log(data);

            if (!response.ok) {
                alert("更新失敗");

                return;
            }

            // 閉じる
            setEditingTask(null);

            // 再取得
            fetchTasks();

        } catch (error) {
            console.error(error);

            alert("通信エラー");
        }
    };

    const todoTasks = tasks.filter(
        (task) => task.status === "todo"
    );

    const doingTasks = tasks.filter(
        (task) => task.status === "doing"
    );

    const doneTasks = tasks.filter(
        (task) => task.status === "done"
    );

    // -------------------------
    // render
    // -------------------------

    return (
        <>
            {/* project一覧 */}
            <div className="project-list">
                {projects.map((project) => (
                    <button
                        key={project.id}
                        onClick={() =>
                            setCurrentProjectId(project.id)
                        }
                    >
                        {project.name}
                    </button>
                ))}
            </div>

            {/* main */}
            <div className="task-container">

                {/* 追加フォーム */}
                <div className="task-form">

                    <input
                        className="task-input"
                        type="text"
                        placeholder="タスク名"
                        value={title}
                        onChange={(e) =>
                            setTitle(e.target.value)
                        }
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                addTask();
                            }
                        }}
                    />

                    <textarea
                        className="task-textarea"
                        placeholder="説明"
                        value={description}
                        onChange={(e) =>
                            setDescription(e.target.value)
                        }
                    />

                    <button
                        className="add-button"
                        onClick={addTask}
                    >
                        追加
                    </button>
                </div>

                {/* header */}
                <div className="header">
                    <h1>タスク一覧</h1>

                    <button
                        className="logout-button"
                        onClick={logout}
                    >
                        ログアウト
                    </button>
                </div>

                {/* task一覧 */}
                <div className="kanban-board">

                    {/* TODO */}
                    <div className="kanban-column">
                        <h2>TODO</h2>

                        {todoTasks.map((task) => (
                            <div className="task-card" key={task.id}>
                                <h3>{task.title}</h3>

                                <p>{task.description}</p>

                                <button
                                    className="status-button"
                                    onClick={() =>
                                        updateStatus(task.id, task.status)
                                    }
                                >
                                    status変更
                                </button>

                                <button
                                    className="edit-button"
                                    onClick={() => openEditModal(task)}
                                >
                                    編集
                                </button>

                                <button
                                    className="delete-button"
                                    onClick={() => deleteTask(task.id)}
                                >
                                    削除
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* DOING */}
                    <div className="kanban-column">
                        <h2>DOING</h2>

                        {doingTasks.map((task) => (
                            <div className="task-card" key={task.id}>
                                <h3>{task.title}</h3>

                                <p>{task.description}</p>

                                <button
                                    className="status-button"
                                    onClick={() =>
                                        updateStatus(task.id, task.status)
                                    }
                                >
                                    status変更
                                </button>

                                <button
                                    className="edit-button"
                                    onClick={() => openEditModal(task)}
                                >
                                    編集
                                </button>

                                <button
                                    className="delete-button"
                                    onClick={() => deleteTask(task.id)}
                                >
                                    削除
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* DONE */}
                    <div className="kanban-column">
                        <h2>DONE</h2>

                        {doneTasks.map((task) => (
                            <div className="task-card" key={task.id}>
                                <h3>{task.title}</h3>

                                <p>{task.description}</p>

                                <button
                                    className="status-button"
                                    onClick={() =>
                                        updateStatus(task.id, task.status)
                                    }
                                >
                                    status変更
                                </button>

                                <button
                                    className="edit-button"
                                    onClick={() => openEditModal(task)}
                                >
                                    編集
                                </button>

                                <button
                                    className="delete-button"
                                    onClick={() => deleteTask(task.id)}
                                >
                                    削除
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* モーダル */}
            {editingTask && (

                <div className="modal-overlay">

                    <div className="modal">

                        <h2>タスク編集</h2>

                        <input
                            className="task-input"
                            type="text"
                            value={editTitle}
                            onChange={(e) =>
                                setEditTitle(
                                    e.target.value
                                )
                            }
                        />

                        <textarea
                            className="task-textarea"
                            value={editDescription}
                            onChange={(e) =>
                                setEditDescription(
                                    e.target.value
                                )
                            }
                        />

                        <div className="modal-buttons">

                            <button onClick={saveTask}>
                                保存
                            </button>

                            <button
                                onClick={() =>
                                    setEditingTask(null)
                                }
                            >
                                キャンセル
                            </button>

                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default TaskList;