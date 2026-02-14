import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/videos - List videos with optional filters
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const forWhom = searchParams.get('forWhom');
  const status = searchParams.get('status');

  try {
    const videos = await prisma.instagramVideo.findMany({
      where: {
        ...(forWhom && { forWhom }),
        ...(status && { status }),
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(videos);
  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    );
  }
}

// POST /api/videos - Create a new video entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, title, description, forWhom, status, postedAt } = body;

    if (!url || !forWhom) {
      return NextResponse.json(
        { error: 'url and forWhom are required' },
        { status: 400 }
      );
    }

    const video = await prisma.instagramVideo.create({
      data: {
        url,
        title,
        description,
        forWhom,
        status: status || 'draft',
        postedAt: postedAt ? new Date(postedAt) : null,
      },
    });

    return NextResponse.json(video);
  } catch (error) {
    console.error('Error creating video:', error);
    return NextResponse.json(
      { error: 'Failed to create video' },
      { status: 500 }
    );
  }
}
