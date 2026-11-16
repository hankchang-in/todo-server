import { useState } from "react";
import { toInputValue, toDateValue } from "../utils";
import { CloseIcon } from "./Icons";

const label = "block text-[11px] text-gray-500 mb-1.5";
const field = "w-full px-3 py-2.5 text-[13px] border border-gray-200 bg-white outline-none focus:border-brand";

export default function TaskForm({ task, defaultDate, onSave, onClose }) {
  const [title, setTitle] = useState(task ? task.title : "");
  const [description, setDescription] = useState(task ? task.description || "" : "");
  const [date, setDate] = useState(task ? toInputValue(task.dueAt).slice(0, 10) : toDateValue(defaultDate));
  const [time, setTime] = useState(task ? toInputValue(task.dueAt).slice(11, 16) : "09:00");
  const [error, setError] = useState("");

  function submit(e) {
    e.preventDefault();
    if (!title.trim() || !date || !time) {
      setError("Please add a title, date and time");
      return;
    }
    onSave({
      title: title.trim(),
      description,
      dueAt: new Date(`${date}T${time}`).toISOString(),
      priority: task ? task.priority : "Low",
    });
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end justify-center z-20" onClick={onClose}>
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-[380px] px-5 pt-5 pb-6 max-h-[92vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[15px] font-medium">{task ? "Edit Task" : "Add New Task"}</h2>
          <button type="button" onClick={onClose} aria-label="close">
            <CloseIcon />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className={label}>Task title</label>
            <input className={field} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Doing Homework" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={label}>Set Date</label>
              <input type="date" className={field} value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div>
              <label className={label}>Set Time</label>
              <input type="time" className={field} value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
          </div>

          <div>
            <label className={label}>Description</label>
            <textarea
              rows={4}
              className={field + " resize-none"}
              placeholder="Add Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        {error && <p className="text-red-500 text-xs mt-3">{error}</p>}

        <button type="submit" className="w-full mt-5 py-3 bg-brand text-white text-[13px] font-medium">
          {task ? "Save changes" : "Create task"}
        </button>
      </form>
    </div>
  );
}
