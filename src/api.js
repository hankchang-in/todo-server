const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, options) {
  const res = await fetch(BASE + path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Something went wrong");
  return data;
}

export const getTasks = (q = "") => request("/tasks?q=" + encodeURIComponent(q));

export const createTask = (task) =>
  request("/tasks", { method: "POST", body: JSON.stringify(task) });

export const updateTask = (id, task) =>
  request("/tasks/" + id, { method: "PUT", body: JSON.stringify(task) });

export const deleteTask = (id) => request("/tasks/" + id, { method: "DELETE" });
