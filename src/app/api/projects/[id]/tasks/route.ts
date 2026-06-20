import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import type { TaskStatus } from "@/lib/types";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;

  const tasks = await prisma.task.findMany({
    where: { projectId: id },
    orderBy: [{ status: "asc" }, { order: "asc" }],
    include: { assignee: true },
  });

  return NextResponse.json(tasks);
}

export async function POST(request: Request, { params }: Params) {
  const { id } = await params;
  const body = await request.json();
  const { title, description, status, assigneeId, dueDate } = body;

  if (!title?.trim()) {
    return NextResponse.json({ error: "タイトルは必須です" }, { status: 400 });
  }

  const taskStatus: TaskStatus = status ?? "TODO";

  const maxOrder = await prisma.task.aggregate({
    where: { projectId: id, status: taskStatus },
    _max: { order: true },
  });

  const task = await prisma.task.create({
    data: {
      title: title.trim(),
      description: description?.trim() || null,
      status: taskStatus,
      order: (maxOrder._max.order ?? -1) + 1,
      assigneeId: assigneeId || null,
      dueDate: dueDate ? new Date(dueDate) : null,
      projectId: id,
    },
    include: { assignee: true },
  });

  await prisma.project.update({
    where: { id },
    data: { updatedAt: new Date() },
  });

  return NextResponse.json(task, { status: 201 });
}
