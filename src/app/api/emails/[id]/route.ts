import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status, notes, repliedAt } = body;

    const data: any = {};
    if (status) data.status = status;
    if (notes !== undefined) data.notes = notes;
    if (repliedAt) data.repliedAt = new Date(repliedAt);
    
    // Auto-set repliedAt if status changes to replied/interested
    if (status === "replied" || status === "interested") {
      data.repliedAt = new Date();
    }

    const email = await prisma.partnershipEmail.update({
      where: { id: params.id },
      data,
    });

    return NextResponse.json(email);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update email" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.partnershipEmail.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete email" },
      { status: 500 }
    );
  }
}
