import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type Params = { params: Promise<{ id: string; memberId: string }> };

export async function DELETE(_request: Request, { params }: Params) {
  const { id, memberId } = await params;

  const existing = await prisma.member.findFirst({
    where: { id: memberId, projectId: id },
  });

  if (!existing) {
    return NextResponse.json({ error: "メンバーが見つかりません" }, { status: 404 });
  }

  await prisma.member.delete({ where: { id: memberId } });

  return NextResponse.json({ ok: true });
}
