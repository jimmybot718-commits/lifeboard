import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

// GET /api/worklogs - Get work logs with filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const actorId = searchParams.get('actorId');
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    const where: any = {};
    if (actorId) where.actorId = actorId;
    if (from || to) {
      where.date = {};
      if (from) where.date.gte = new Date(from);
      if (to) where.date.lte = new Date(to);
    }

    const workLogs = await prisma.workLog.findMany({
      where,
      include: {
        actor: true,
        project: true,
      },
      orderBy: {
        date: 'desc',
      },
    });

    return NextResponse.json(workLogs);
  } catch (error) {
    console.error('GET /api/worklogs error:', error);
    return NextResponse.json({ error: 'Failed to fetch work logs' }, { status: 500 });
  }
}
