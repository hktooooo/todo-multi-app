import {
    useEffect,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import {
    DndContext,
    useDraggable,
    useDroppable,
} from "@dnd-kit/core";

import type {
    DragEndEvent,
} from "@dnd-kit/core";

import "./TaskList.css";

function TaskCard({
    task,
    updateStatus,
    openEditModal,
    deleteTask,
}: any) {

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
    } = useDraggable({
        id: task.id.toString(),
    });

    const style = transform
        ? {
            transform: `translate3d(
                ${transform.x}px,
                ${transform.y}px,
                0
            )`,
        }
        : undefined;

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="task-card"
        >
            <div
                className="drag-handle"
                {...listeners}
                {...attributes}
            >
                ☰
            </div>

            <h3>{task.title}</h3>

            <p>{task.description}</p>

            <span>{task.status}</span>

            <button
                className="edit-button"
                onClick={() =>
                    openEditModal(task)
                }
            >
                編集
            </button>

            <button
                className="delete-button"
                onClick={() =>
                    deleteTask(task.id)
                }
            >
                削除
            </button>
        </div>
    );
}

function KanbanColumn({
    id,
    title,
    children,
}: any) {

    const { setNodeRef } = useDroppable({
        id,
    });

    return (
        <div
            ref={setNodeRef}
            className="kanban-column"
        >
            <h2>{title}</h2>

            {children}
        </div>
    );
}

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
            if (
                currentProjectId === null &&
                data.length > 0
            ) {
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
    // project追加
    // -------------------------

    const [projectName, setProjectName]
        = useState("");

    const addProject = async () => {

        if (!projectName.trim()) {
            alert("project名を入力してください");

            return;
        }

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost/api/projects",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        name: projectName,
                    }),
                }
            );

            const data = await response.json();

            console.log(data);

            if (!response.ok) {
                alert("project追加失敗");

                return;
            }

            setProjectName("");

            fetchProjects();

        } catch (error) {
            console.error(error);

            alert("通信エラー");
        }
    };

    // -------------------------
    // project削除
    // -------------------------

    const deleteProject = async (
        projectId: number
    ) => {

        const ok = confirm("削除しますか？");

        if (!ok) {
            return;
        }

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `http://localhost/api/projects/${projectId}`,
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
                alert("project削除失敗");

                return;
            }

            fetchProjects();

        } catch (error) {
            console.error(error);

            alert("通信エラー");
        }
    };

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

    const handleDragEnd = async (
        event: DragEndEvent
    ) => {

        const { active, over } = event;

        if (!over) {
            return;
        }

        const taskId = Number(active.id);

        const newStatus = over.id.toString();

        if (
            newStatus !== "todo" &&
            newStatus !== "doing" &&
            newStatus !== "done"
        ) {
            return;
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
    // render
    // -------------------------

    return (
        <>
            {/* project追加フォーム */}
            <div className="project-form">
                <input
                    type="text"
                    placeholder="project名"
                    value={projectName}
                    onChange={(e) =>
                        setProjectName(e.target.value)
                    }
                />

                <button onClick={addProject}>
                    追加
                </button>
            </div>

            {/* project一覧 */}
            <div className="project-list">
                {projects.map((project) => (
                    <div
                        key={project.id}
                        className="project-item"
                    >
                        <button
                            onClick={() =>
                                setCurrentProjectId(project.id)
                            }
                        >
                            {project.name}
                        </button>

                        <button
                            onClick={() =>
                                deleteProject(project.id)
                            }
                        >
                            削除
                        </button>
                    </div>
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
                <DndContext onDragEnd={handleDragEnd}>
                    <div className="kanban-board">

                        <KanbanColumn
                            id="todo"
                            title="TODO"
                        >
                            {todoTasks.map((task) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    updateStatus={updateStatus}
                                    openEditModal={openEditModal}
                                    deleteTask={deleteTask}
                                />
                            ))}
                        </KanbanColumn>

                        <KanbanColumn
                            id="doing"
                            title="DOING"
                        >
                            {doingTasks.map((task) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    updateStatus={updateStatus}
                                    openEditModal={openEditModal}
                                    deleteTask={deleteTask}
                                />
                            ))}
                        </KanbanColumn>

                        <KanbanColumn
                            id="done"
                            title="DONE"
                        >
                            {doneTasks.map((task) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    updateStatus={updateStatus}
                                    openEditModal={openEditModal}
                                    deleteTask={deleteTask}
                                />
                            ))}
                        </KanbanColumn>

                    </div>
                </DndContext>
            </div >

            {/* モーダル */}
            {
                editingTask && (

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
                )
            }
        </>
    );
}

export default TaskList;