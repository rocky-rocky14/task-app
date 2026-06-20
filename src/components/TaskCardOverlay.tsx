"use client";

import type { Task } from "@/lib/types";
import { formatDate, getInitials, isOverdue } from "@/lib/user";

interface TaskCardOverlayProps {
  task: Task;
}

export function TaskCardOverlay({ task }: TaskCardOverlayProps) {
  const overdue = isOverdue(task.dueDate);

  return (
    <div className="w-64 rotate-2 rounded-lg border border-indigo-300 bg-white p-3 shadow-xl">
      <p className="text-sm font-medium text-slate-800">{task.title}</p>
      {task.description && (
        <p className="mt-1 line-clamp-2 text-xs text-slate-500">{task.description}</p>
      )}
      <div className="mt-2 flex flex-wrap items-center gap-2">
        {task.dueDate && (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${
              overdue ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-600"
            }`}
          >
            {formatDate(task.dueDate)}
          </span>
        )}
        {task.assignee && (
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-xs font-medium text-indigo-700">
            {getInitials(task.assignee.name)}
          </span>
        )}
      </div>
    </div>
  );
}
