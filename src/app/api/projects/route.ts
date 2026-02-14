import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/projects - List all projects
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // active, paused, completed

    const where: any = {};
    if (status) {
      where.status = status;
    }

    const projects = await prisma.project.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error('GET /api/projects error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create a new project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, progress, status } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Project name is required' },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        name,
        description: description || null,
        progress: progress || 0,
        status: status || 'active',
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error('POST /api/projects error:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
