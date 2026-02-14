import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/schedule - Get schedule entries (optionally filtered by date)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    const where = date ? {
      date: new Date(date)
    } : {};

    const entries = await prisma.scheduleEntry.findMany({
      where,
      include: {
        actor: true,
        project: true
      },
      orderBy: {
        startTime: 'asc'
      }
    });

    return NextResponse.json(entries);
  } catch (error) {
    console.error('Error fetching schedule entries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch schedule entries' },
      { status: 500 }
    );
  }
}

// POST /api/schedule - Create a new schedule entry
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { actorId, projectId, title, startTime, endTime, date, description } = body;

    // Validate required fields
    if (!actorId || !title || !startTime || !endTime || !date) {
      return NextResponse.json(
        { error: 'Missing required fields: actorId, title, startTime, endTime, date' },
        { status: 400 }
      );
    }

    const entry = await prisma.scheduleEntry.create({
      data: {
        actorId,
        projectId: projectId || null,
        title,
        startTime,
        endTime,
        date: new Date(date),
        description: description || null
      },
      include: {
        actor: true,
        project: true
      }
    });

    return NextResponse.json(entry);
  } catch (error) {
    console.error('Error creating schedule entry:', error);
    return NextResponse.json(
      { error: 'Failed to create schedule entry' },
      { status: 500 }
    );
  }
}
