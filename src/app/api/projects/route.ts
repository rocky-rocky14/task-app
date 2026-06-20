import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const projects = await prisma.project.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      _count: { select: { tasks: true, members: true } },
    },
  });
  return NextResponse.json(projects);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, description, creatorName } = body;

  if (!name?.trim()) {
    return NextResponse.json({ error: "プロジェクト名は必須です" }, { status: 400 });
  }

  const project = await prisma.project.create({
    data: {
      name: name.trim(),
      description: description?.trim() || null,
      members: creatorName
        ? { create: { name: creatorName.trim() } }
        : undefined,
    },
    include: { members: true },
  });

  return NextResponse.json(project, { status: 201 });
}
