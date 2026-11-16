export function getWeekStart(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

export function formatDay(date) {
  return new Date(date).toLocaleDateString("en-US", { day: "numeric", month: "short" });
}

export function formatTime(date) {
  return new Date(date).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export function groupByWeek(tasks) {
  const map = {};
  tasks.forEach((t) => {
    const start = getWeekStart(t.dueAt);
    const key = start.getTime();
    if (!map[key]) {
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      map[key] = { key, start, end, tasks: [] };
    }
    map[key].tasks.push(t);
  });
  return Object.values(map).sort((a, b) => a.start - b.start);
}

export function toInputValue(date) {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

export function sameDay(a, b) {
  const x = new Date(a);
  const y = new Date(b);
  return x.getFullYear() === y.getFullYear() && x.getMonth() === y.getMonth() && x.getDate() === y.getDate();
}

// Sunday-to-Saturday strip around the given date
export function weekDays(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay());
  return Array.from({ length: 7 }, (_, i) => {
    const x = new Date(d);
    x.setDate(d.getDate() + i);
    return x;
  });
}

export function toDateValue(date) {
  const d = new Date(date);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}
