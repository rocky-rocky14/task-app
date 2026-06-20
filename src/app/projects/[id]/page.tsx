"use client";

import { KanbanBoard } from "@/components/KanbanBoard";
import { MemberPanel } from "@/components/MemberPanel";
import { TaskModal } from "@/components/TaskModal";
import type { Member, Project, Task, TaskStatus } from "@/lib/types";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function ProjectPage() {
  const params = useParams();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>("TODO");

  const fetchProject = useCallback(async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}`);
      if (res.ok) {
        const data = await res.json();
        setProject(data);
        setTasks(data.tasks ?? []);
        setMembers(data.members ?? []);
      }
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  const handleAddTask = (status: TaskStatus) => {
    setSelectedTask(null);
    setDefaultStatus(status);
    setModalOpen(true);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setModalOpen(true);
  };

  const handleTaskSave = (task: Task) => {
    setTasks((prev) => {
      const exists = prev.find((t) => t.id === task.id);
      if (exists) {
        return prev.map((t) => (t.id === task.id ? task : t));
      }
      return [...prev, task];
    });
  };

  const handleTaskDelete = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50">
        <p className="text-slate-500">プロジェクトが見つかりません</p>
        <Link href="/" className="mt-4 text-sm text-indigo-600 hover:text-indigo-700">
          ← プロジェクト一覧に戻る
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-indigo-50">
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-lg font-bold text-slate-800">{project.name}</h1>
              {project.description && (
                <p className="text-sm text-slate-500">{project.description}</p>
              )}
            </div>
          </div>
          <MemberPanel
            members={members}
            inviteCode={project.inviteCode}
            projectId={projectId}
            onMembersChange={setMembers}
          />
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-6">
        <KanbanBoard
          tasks={tasks}
          onTasksChange={setTasks}
          onTaskClick={handleTaskClick}
          onAddTask={handleAddTask}
          projectId={projectId}
        />
      </main>

      {modalOpen && (
        <TaskModal
          task={selectedTask}
          defaultStatus={defaultStatus}
          members={members}
          projectId={projectId}
          onClose={() => setModalOpen(false)}
          onSave={handleTaskSave}
          onDelete={selectedTask ? handleTaskDelete : undefined}
        />
      )}
    </div>
  );
}
