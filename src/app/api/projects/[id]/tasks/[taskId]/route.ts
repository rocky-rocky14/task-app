import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import type { TaskStatus } from "@/lib/types";

type Params = { params: Promise<{ id: string; taskId: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const { id, taskId } = await params;
  const body = await request.json();
  const { title, description, status, assigneeId, dueDate } = body;

  const existing = await prisma.task.findFirst({
    where: { id: taskId, projectId: id },
  });

  if (!existing) {
    return NextResponse.json({ error: "タスクが見つかりません" }, { status: 404 });
  }

  const data: Record<string, unknown> = {};
  if (title !== undefined) data.title = title.trim();
  if (description !== undefined) data.description = description?.trim() || null;
  if (assigneeId !== undefined) data.assigneeId = assigneeId || null;
  if (dueDate !== undefined) data.dueDate = dueDate ? new Date(dueDate) : null;

  if (status !== undefined && status !== existing.status) {
    const newStatus = status as TaskStatus;
    const maxOrder = await prisma.task.aggregate({
      where: { projectId: id, status: newStatus },
      _max: { order: true },
    });
    data.status = newStatus;
    data.order = (maxOrder._max.order ?? -1) + 1;
  }

  const task = await prisma.task.update({
    where: { id: taskId },
    data,
    include: { assignee: true },
  });

  await prisma.project.update({
    where: { id },
    data: { updatedAt: new Date() },
  });

  return NextResponse.json(task);
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id, taskId } = await params;

  const existing = await prisma.task.findFirst({
    where: { id: taskId, projectId: id },
  });

  if (!existing) {
    return NextResponse.json({ error: "タスクが見つかりません" }, { status: 404 });
  }

  await prisma.task.delete({ where: { id: taskId } });

  await prisma.project.update({
    where: { id },
    data: { updatedAt: new Date() },
  });

  return NextResponse.json({ ok: true });
}
