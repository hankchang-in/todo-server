import { useEffect, useState } from "react";
import { getTasks, createTask, updateTask, deleteTask } from "./api";
import { sameDay, weekDays } from "./utils";
import TaskItem, { Checkbox } from "./components/TaskItem";
import TaskForm from "./components/TaskForm";
import { SearchIcon, BackIcon, PlusIcon, CheckIcon, CloseIcon } from "./components/Icons";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function seenOnboarding() {
  try {
    return localStorage.getItem("onboarded") === "1";
  } catch {
    return false;
  }
}

function Onboarding({ onStart }) {
  return (
    <div className="flex flex-col h-full">
      <div className="relative flex-1 bg-brand overflow-hidden">
        <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full border-[14px] border-white/20" />
        <svg className="absolute left-0 top-24 text-white/40" width="95" height="90" viewBox="0 0 95 90" fill="none" stroke="currentColor" strokeWidth="2">
          {[0, 24, 48, 72].map((y) => (
            <polyline key={y} points={`0,${y + 14} 12,${y} 24,${y + 14} 36,${y} 48,${y + 14} 60,${y} 72,${y + 14} 84,${y} 95,${y + 14}`} />
          ))}
        </svg>
        <svg className="absolute right-0 bottom-6 text-white/40" width="95" height="90" viewBox="0 0 95 90" fill="none" stroke="currentColor" strokeWidth="2">
          {[0, 24, 48, 72].map((y) => (
            <polyline key={y} points={`0,${y + 14} 12,${y} 24,${y + 14} 36,${y} 48,${y + 14} 60,${y} 72,${y + 14} 84,${y} 95,${y + 14}`} />
          ))}
        </svg>
      </div>
      <div className="bg-white px-6 pt-6 pb-8">
        <h1 className="text-[22px] font-semibold">Manage What To Do</h1>
        <p className="text-[11px] text-gray-500 mt-3 w-52 leading-relaxed">
          The best way to manage what you have to do, don't forget your plans
        </p>
        <button onClick={onStart} className="w-full mt-20 py-3 bg-brand text-white text-[13px] font-medium">
          Get Started
        </button>
      </div>
    </div>
  );
}

function SearchBar({ value, onChange, onFocus, readOnly, onClear }) {
  return (
    <div className="flex items-center border border-gray-200 bg-white px-3 h-11">
      <input
        value={value}
        readOnly={readOnly}
        onFocus={onFocus}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search for a task"
        className="flex-1 min-w-0 text-[12px] outline-none bg-transparent"
      />
      {value && onClear ? (
        <button onClick={onClear} aria-label="clear">
          <CloseIcon />
        </button>
      ) : (
        <SearchIcon />
      )}
    </div>
  );
}

export default function App() {
  const [started, setStarted] = useState(seenOnboarding());
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState("");

  async function load() {
    try {
      setError("");
      setTasks(await getTasks(""));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function start() {
    try {
      localStorage.setItem("onboarded", "1");
    } catch {
      // storage unavailable, fine
    }
    setStarted(true);
  }

  async function run(fn) {
    try {
      await fn();
      load();
    } catch (e) {
      alert(e.message);
    }
  }

  async function handleSave(data) {
    await run(() => (editing ? updateTask(editing.id, data) : createTask(data)));
    closeForm();
  }

  const handleDelete = (id) => run(() => deleteTask(id));
  const handleToggle = (task) =>
    run(() => updateTask(task.id, { status: task.status === "Completed" ? "In Progress" : "Completed" }));

  function openEdit(task) {
    setEditing(task);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditing(null);
  }

  function closeSearch() {
    setSearching(false);
    setQuery("");
  }

  const days = weekDays(selected);
  const weekTasks = tasks.filter((t) => days.some((d) => sameDay(d, t.dueAt)));
  const done = weekTasks.filter((t) => t.status === "Completed").length;
  const pending = weekTasks.length - done;
  const percent = weekTasks.length ? Math.round((done / weekTasks.length) * 100) : 0;
  const todayTasks = tasks
    .filter((t) => sameDay(t.dueAt, selected))
    .sort((a, b) => new Date(a.dueAt) - new Date(b.dueAt));
  const results = tasks.filter((t) => t.title.toLowerCase().includes(query.trim().toLowerCase()));

  let screen;

  if (!started) {
    screen = <Onboarding onStart={start} />;
  } else if (searching) {
    screen = (
      <div className="px-5 pt-5">
        <button onClick={closeSearch} aria-label="back" className="mb-5">
          <BackIcon />
        </button>
        <SearchBar value={query} onChange={setQuery} onClear={() => setQuery("")} />
        <div className="mt-4">
          {query.trim() && results.length === 0 && (
            <p className="text-center text-xs text-gray-400 mt-10">No tasks found</p>
          )}
          {query.trim() &&
            results.map((t) => (
              <div key={t.id} className="flex items-center gap-3 py-4 border-b border-gray-200">
                <Checkbox checked={t.status === "Completed"} onChange={() => handleToggle(t)} />
                <span className={"text-[13px] " + (t.status === "Completed" ? "line-through" : "")}>{t.title}</span>
              </div>
            ))}
        </div>
      </div>
    );
  } else {
    screen = (
      <div className="px-5 pt-5 pb-32">
        <SearchBar value="" readOnly onFocus={() => setSearching(true)} onChange={() => {}} />

        <div className="grid grid-cols-7 mt-5 text-center">
          {days.map((d) => {
            const active = sameDay(d, selected);
            return (
              <button
                key={d.toISOString()}
                onClick={() => setSelected(d)}
                className={"py-2 flex flex-col items-center gap-1 " + (active ? "bg-brand text-white" : "text-gray-400")}
              >
                <span className="text-[8px]">{DAY_NAMES[d.getDay()]}</span>
                <span className={"text-[11px] " + (active ? "font-medium" : "")}>{String(d.getDate()).padStart(2, "0")}</span>
                <span className={"w-1 h-1 rounded-full " + (active ? "bg-white" : "bg-transparent")} />
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-3 mt-5">
          <div className="bg-[#eef1fd] p-3.5">
            <span className="inline-flex w-7 h-7 items-center justify-center bg-brand/30 text-brand">
              <CheckIcon />
            </span>
            <p className="text-[10px] mt-1">Task Complete</p>
            <p className="text-[22px] font-semibold leading-tight">
              {done} <span className="text-[8px] font-normal text-gray-500">This Week</span>
            </p>
          </div>
          <div className="bg-[#fdeaea] p-3.5">
            <span className="inline-flex w-7 h-7 items-center justify-center bg-red-300/60 text-red-500">
              <CloseIcon />
            </span>
            <p className="text-[10px] mt-1">Task Pending</p>
            <p className="text-[22px] font-semibold leading-tight">
              {String(pending).padStart(2, "0")} <span className="text-[8px] font-normal text-gray-500">This Week</span>
            </p>
          </div>
        </div>

        <h2 className="text-[15px] font-semibold mt-8">Weekly Progress</h2>
        <div className="h-4 bg-mist mt-3">
          <div className="h-4 bg-navy transition-all" style={{ width: percent + "%" }} />
        </div>

        <div className="flex items-baseline justify-between mt-8">
          <h2 className="text-[15px] font-semibold">Tasks Today</h2>
          <span className="text-[11px] text-brand">View All</span>
        </div>

        {loading && <p className="text-center text-xs text-gray-400 mt-8">Loading...</p>}
        {error && <p className="text-center text-xs text-red-500 mt-8">{error}</p>}
        {!loading && !error && todayTasks.length === 0 && (
          <p className="text-center text-xs text-gray-400 mt-8">Nothing planned for this day</p>
        )}

        <div className="mt-2">
          {todayTasks.map((t) => (
            <TaskItem key={t.id} task={t} onEdit={openEdit} onDelete={handleDelete} onToggleStatus={handleToggle} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center">
      <div className="relative w-full max-w-[380px] min-h-screen bg-[#fcfcff] shadow-sm">
        <div className={!started ? "h-screen" : ""}>{screen}</div>

        {started && !searching && (
          <button
            onClick={() => setShowForm(true)}
            aria-label="add task"
            className="fixed bottom-6 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-brand text-white shadow-lg flex items-center justify-center"
          >
            <PlusIcon />
          </button>
        )}

        {showForm && <TaskForm task={editing} defaultDate={selected} onSave={handleSave} onClose={closeForm} />}
      </div>
    </div>
  );
}
