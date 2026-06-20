import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import type { TaskStatus } from "@/lib/types";

type Params = { params: Promise<{ id: string }> };

interface ReorderItem {
  id: string;
  status: TaskStatus;
  order: number;
}

export async function POST(request: Request, { params }: Params) {
  const { id } = await params;
  const body = await request.json();
  const { tasks } = body as { tasks: ReorderItem[] };

  if (!Array.isArray(tasks)) {
    return NextResponse.json({ error: "不正なリクエストです" }, { status: 400 });
  }

  await prisma.$transaction(
    tasks.map((task) =>
      prisma.task.updateMany({
        where: { id: task.id, projectId: id },
        data: { status: task.status, order: task.order },
      })
    )
  );

  await prisma.project.update({
    where: { id },
    data: { updatedAt: new Date() },
  });

  const updated = await prisma.task.findMany({
    where: { projectId: id },
    orderBy: [{ status: "asc" }, { order: "asc" }],
    include: { assignee: true },
  });

  return NextResponse.json(updated);
}
