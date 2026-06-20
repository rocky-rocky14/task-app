"use client";

import { KanbanColumn } from "@/components/KanbanColumn";
import { TaskCardOverlay } from "@/components/TaskCardOverlay";
import type { Task, TaskStatus } from "@/lib/types";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useCallback, useEffect, useState } from "react";

const STATUSES: TaskStatus[] = ["TODO", "DOING", "DONE"];

interface KanbanBoardProps {
  tasks: Task[];
  onTasksChange: (tasks: Task[]) => void;
  onTaskClick: (task: Task) => void;
  onAddTask: (status: TaskStatus) => void;
  projectId: string;
}

function groupByStatus(tasks: Task[]): Record<TaskStatus, Task[]> {
  const grouped: Record<TaskStatus, Task[]> = { TODO: [], DOING: [], DONE: [] };
  for (const task of tasks) {
    grouped[task.status].push(task);
  }
  for (const status of STATUSES) {
    grouped[status].sort((a, b) => a.order - b.order);
  }
  return grouped;
}

export function KanbanBoard({
  tasks,
  onTasksChange,
  onTaskClick,
  onAddTask,
  projectId,
}: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [localTasks, setLocalTasks] = useState(tasks);

  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const grouped = groupByStatus(localTasks);

  const findContainer = (id: string): TaskStatus | null => {
    if (STATUSES.includes(id as TaskStatus)) return id as TaskStatus;
    const task = localTasks.find((t) => t.id === id);
    return task?.status ?? null;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const task = localTasks.find((t) => t.id === event.active.id);
    if (task) setActiveTask(task);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    if (!activeContainer || !overContainer || activeContainer === overContainer) return;

    setLocalTasks((prev) => {
      const activeIndex = prev.findIndex((t) => t.id === activeId);
      const activeItem = prev[activeIndex];
      if (!activeItem) return prev;

      const overIndex = prev.findIndex((t) => t.id === overId);
      const newTasks = [...prev];
      newTasks[activeIndex] = { ...activeItem, status: overContainer };

      if (overIndex >= 0) {
        newTasks.splice(activeIndex, 1);
        newTasks.splice(overIndex, 0, { ...activeItem, status: overContainer });
      }

      return newTasks;
    });
  };

  const persistReorder = useCallback(
    async (updatedTasks: Task[]) => {
      const payload = STATUSES.flatMap((status) =>
        updatedTasks
          .filter((t) => t.status === status)
          .map((t, index) => ({ id: t.id, status, order: index }))
      );

      try {
        const res = await fetch(`/api/projects/${projectId}/tasks/reorder`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tasks: payload }),
        });
        if (res.ok) {
          const data = await res.json();
          onTasksChange(data);
        } else {
          setLocalTasks(tasks);
        }
      } catch {
        setLocalTasks(tasks);
      }
    },
    [projectId, onTasksChange, tasks]
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) {
      setLocalTasks(tasks);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    if (!activeContainer || !overContainer) {
      setLocalTasks(tasks);
      return;
    }

    let updated = [...localTasks];

    if (activeContainer === overContainer) {
      const containerTasks = updated.filter((t) => t.status === activeContainer);
      const oldIndex = containerTasks.findIndex((t) => t.id === activeId);
      const newIndex = containerTasks.findIndex((t) => t.id === overId);

      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        const reordered = arrayMove(containerTasks, oldIndex, newIndex);
        updated = [
          ...updated.filter((t) => t.status !== activeContainer),
          ...reordered.map((t, i) => ({ ...t, order: i })),
        ];
      }
    }

    setLocalTasks(updated);
    persistReorder(updated);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {STATUSES.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={grouped[status]}
            onTaskClick={onTaskClick}
            onAddTask={onAddTask}
          />
        ))}
      </div>
      <DragOverlay>
        {activeTask ? <TaskCardOverlay task={activeTask} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
