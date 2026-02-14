import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const actorId = searchParams.get('actorId');

  try {
    const tasks = await prisma.task.findMany({
      where: {
        ...(status && { status }),
        ...(actorId && { actorId }),
      },
      include: {
        actor: true,
        project: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { actorId, type, title, description, projectId } = body;

    // Validate required fields
    if (!actorId || !type || !title) {
      return NextResponse.json(
        { error: 'Missing required fields: actorId, type, title' },
        { status: 400 }
      );
    }

    const task = await prisma.task.create({
      data: {
        actorId,
        type,
        title,
        description,
        projectId,
        status: 'pending',
      },
      include: {
        actor: true,
        project: true,
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}
