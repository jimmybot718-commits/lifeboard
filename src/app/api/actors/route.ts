import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/actors - Get all actors
export async function GET(request: NextRequest) {
  try {
    const actors = await prisma.actor.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(actors);
  } catch (error) {
    console.error('GET /api/actors error:', error);
    return NextResponse.json({ error: 'Failed to fetch actors' }, { status: 500 });
  }
}
