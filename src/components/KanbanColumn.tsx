"use client";

import { TaskCard } from "@/components/TaskCard";
import type { Task, TaskStatus } from "@/lib/types";
import { STATUS_HEADER_COLORS, STATUS_LABELS } from "@/lib/types";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onAddTask: (status: TaskStatus) => void;
}

export function KanbanColumn({ status, tasks, onTaskClick, onAddTask }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status, data: { type: "column", status } });

  return (
    <div className="flex w-72 shrink-0 flex-col rounded-xl border border-slate-200 bg-slate-50/80">
      <div
        className={`flex items-center justify-between rounded-t-xl px-4 py-3 ${STATUS_HEADER_COLORS[status]}`}
      >
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold">{STATUS_LABELS[status]}</h3>
          <span className="rounded-full bg-white/60 px-2 py-0.5 text-xs font-medium">
            {tasks.length}
          </span>
        </div>
      </div>

      <div
        ref={setNodeRef}
        className={`flex min-h-[200px] flex-1 flex-col gap-2 p-3 transition ${
          isOver ? "bg-indigo-50/50 ring-2 ring-inset ring-indigo-200" : ""
        }`}
      >
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} />
          ))}
        </SortableContext>

        <button
          onClick={() => onAddTask(status)}
          className="mt-1 flex items-center gap-1.5 rounded-lg px-2 py-2 text-sm text-slate-500 transition hover:bg-white hover:text-indigo-600"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          タスクを追加
        </button>
      </div>
    </div>
  );
}
