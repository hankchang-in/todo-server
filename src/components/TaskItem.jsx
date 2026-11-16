import { CheckIcon, EditIcon, TrashIcon } from "./Icons";
import { formatTime } from "../utils";

export function Checkbox({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={onChange}
      aria-label="toggle task"
      className={
        "w-[18px] h-[18px] shrink-0 border flex items-center justify-center rounded-[3px] " +
        (checked ? "border-brand text-brand bg-brand/10" : "border-brand bg-white")
      }
    >
      {checked && <CheckIcon />}
    </button>
  );
}

export default function TaskItem({ task, onEdit, onDelete, onToggleStatus, showActions = true }) {
  const completed = task.status === "Completed";

  return (
    <div className="flex items-center gap-3 py-3.5 border-b border-gray-200">
      <Checkbox checked={completed} onChange={() => onToggleStatus(task)} />
      <div className="flex-1 min-w-0">
        <p className={"text-[13px] truncate " + (completed ? "line-through text-gray-700" : "text-gray-800")}>
          {task.title}
        </p>
        <p className="text-[10px] text-gray-400">{formatTime(task.dueAt)}</p>
      </div>
      {showActions && (
        <div className="flex items-center gap-2 text-gray-300">
          <button onClick={() => onDelete(task.id)} aria-label="delete" className="hover:text-red-400">
            <TrashIcon />
          </button>
          <button onClick={() => onEdit(task)} aria-label="edit" className="hover:text-brand">
            <EditIcon />
          </button>
        </div>
      )}
    </div>
  );
}
