export type TaskStatus = "TODO" | "DOING" | "DONE";

export interface Member {
  id: string;
  name: string;
  email: string | null;
  projectId: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  order: number;
  dueDate: string | null;
  projectId: string;
  assigneeId: string | null;
  assignee: Member | null;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  inviteCode: string;
  createdAt: string;
  updatedAt: string;
  tasks?: Task[];
  members?: Member[];
}

export const STATUS_LABELS: Record<TaskStatus, string> = {
  TODO: "To Do",
  DOING: "Doing",
  DONE: "Done",
};

export const STATUS_COLORS: Record<TaskStatus, string> = {
  TODO: "bg-slate-100 border-slate-200",
  DOING: "bg-blue-50 border-blue-200",
  DONE: "bg-emerald-50 border-emerald-200",
};

export const STATUS_HEADER_COLORS: Record<TaskStatus, string> = {
  TODO: "bg-slate-200 text-slate-700",
  DOING: "bg-blue-200 text-blue-800",
  DONE: "bg-emerald-200 text-emerald-800",
};
