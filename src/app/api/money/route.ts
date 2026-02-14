import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

// GET /api/money - Get money entries with filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type'); // income or expense
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    const where: any = {};
    if (type) where.type = type;
    if (from || to) {
      where.date = {};
      if (from) where.date.gte = new Date(from);
      if (to) where.date.lte = new Date(to);
    }

    const moneyEntries = await prisma.moneyEntry.findMany({
      where,
      include: {
        project: true,
      },
      orderBy: {
        date: 'desc',
      },
    });

    return NextResponse.json(moneyEntries);
  } catch (error) {
    console.error('GET /api/money error:', error);
    return NextResponse.json({ error: 'Failed to fetch money entries' }, { status: 500 });
  }
}
