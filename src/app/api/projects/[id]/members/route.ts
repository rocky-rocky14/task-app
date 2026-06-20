import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;

  const members = await prisma.member.findMany({
    where: { projectId: id },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(members);
}

export async function POST(request: Request, { params }: Params) {
  const { id } = await params;
  const body = await request.json();
  const { name, email } = body;

  if (!name?.trim()) {
    return NextResponse.json({ error: "名前は必須です" }, { status: 400 });
  }

  if (email) {
    const existing = await prisma.member.findFirst({
      where: { projectId: id, email: email.trim() },
    });
    if (existing) {
      return NextResponse.json({ error: "このメールアドレスは既に招待されています" }, { status: 409 });
    }
  }

  const member = await prisma.member.create({
    data: {
      name: name.trim(),
      email: email?.trim() || null,
      projectId: id,
    },
  });

  return NextResponse.json(member, { status: 201 });
}
