import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type Params = { params: Promise<{ code: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { code } = await params;

  const project = await prisma.project.findUnique({
    where: { inviteCode: code },
    select: { id: true, name: true, description: true, inviteCode: true },
  });

  if (!project) {
    return NextResponse.json({ error: "招待リンクが無効です" }, { status: 404 });
  }

  return NextResponse.json(project);
}

export async function POST(request: Request, { params }: Params) {
  const { code } = await params;
  const body = await request.json();
  const { name, email } = body;

  if (!name?.trim()) {
    return NextResponse.json({ error: "名前は必須です" }, { status: 400 });
  }

  const project = await prisma.project.findUnique({
    where: { inviteCode: code },
  });

  if (!project) {
    return NextResponse.json({ error: "招待リンクが無効です" }, { status: 404 });
  }

  if (email) {
    const existing = await prisma.member.findFirst({
      where: { projectId: project.id, email: email.trim() },
    });
    if (existing) {
      return NextResponse.json(existing);
    }
  }

  const member = await prisma.member.create({
    data: {
      name: name.trim(),
      email: email?.trim() || null,
      projectId: project.id,
    },
  });

  return NextResponse.json({ member, projectId: project.id }, { status: 201 });
}
