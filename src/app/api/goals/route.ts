import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

// GET /api/goals - Get all goals (with optional filters)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const actorId = searchParams.get('actorId');

    const where: any = {};
    if (status) where.status = status;
    if (actorId) where.actorId = actorId;

    const goals = await prisma.goal.findMany({
      where,
      include: {
        actor: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(goals);
  } catch (error) {
    console.error('GET /api/goals error:', error);
    return NextResponse.json({ error: 'Failed to fetch goals' }, { status: 500 });
  }
}

// POST /api/goals - Create a new goal
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { actorId, type, target, period, startDate, endDate, title, description } = body;

    if (!actorId || !type || !target || !period || !startDate || !endDate || !title) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const goal = await prisma.goal.create({
      data: {
        actorId,
        type,
        target: parseFloat(target),
        period,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        title,
        description: description || null,
        status: 'active',
      },
      include: {
        actor: true,
      },
    });

    return NextResponse.json(goal, { status: 201 });
  } catch (error) {
    console.error('POST /api/goals error:', error);
    return NextResponse.json({ error: 'Failed to create goal' }, { status: 500 });
  }
}
