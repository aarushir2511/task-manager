"use client";

import { useEffect, useState } from "react";

type Task = {
  id: number;
  title: string;
  completed: boolean;
};

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // 🔹 GET TASKS
  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:5000/tasks", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setTasks(Array.isArray(data) ? data : []);
      });
  }, [token]);

  // 🔹 CREATE TASK
  const createTask = async () => {
    const res = await fetch("http://localhost:5000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title }),
    });

    const newTask = await res.json();
    setTasks([...tasks, newTask]);
    setTitle("");
  };

  // 🔹 DELETE
  const deleteTask = async (id: number) => {
    await fetch(`http://localhost:5000/tasks/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setTasks(tasks.filter((t) => t.id !== id));
  };

  // 🔹 TOGGLE
  const toggleTask = async (id: number) => {
    const res = await fetch(`http://localhost:5000/tasks/${id}/toggle`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const updated = await res.json();
    setTasks(tasks.map((t) => (t.id === id ? updated : t)));
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {/* CREATE */}
      <div className="flex gap-2 mb-5">
        <input
          className="border p-2"
          placeholder="New Task"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <button
          className="bg-blue-500 text-white px-4"
          onClick={createTask}
        >
          Add
        </button>
      </div>

      {/* TASK LIST */}
      {tasks.map((t) => (
        <div
          key={t.id}
          className="flex justify-between border p-2 mb-2"
        >
          <span className={t.completed ? "line-through" : ""}>
            {t.title}
          </span>

          <div className="flex gap-2">
            <button
              className="bg-yellow-400 px-2"
              onClick={() => toggleTask(t.id)}
            >
              {t.completed ? "Undo" : "Done"}
            </button>

            <button
              className="bg-red-500 text-white px-2"
              onClick={() => deleteTask(t.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}