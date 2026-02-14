import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const where: any = {};
    if (status) {
      where.status = status;
    }

    const emails = await prisma.partnershipEmail.findMany({
      where,
      orderBy: { sentAt: "desc" },
    });

    const stats = {
      total: emails.length,
      sent: emails.filter((e) => e.status === "sent").length,
      replied: emails.filter((e) => e.status === "replied").length,
      interested: emails.filter((e) => e.status === "interested").length,
      rejected: emails.filter((e) => e.status === "rejected").length,
    };

    return NextResponse.json({ emails, stats });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch emails" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { recipient, subject, body: emailBody, status, notes } = body;

    if (!recipient || !subject) {
      return NextResponse.json(
        { error: "Recipient and subject are required" },
        { status: 400 }
      );
    }

    const email = await prisma.partnershipEmail.create({
      data: {
        recipient,
        subject,
        body: emailBody,
        status: status || "sent",
        notes,
      },
    });

    return NextResponse.json(email);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create email" },
      { status: 500 }
    );
  }
}
