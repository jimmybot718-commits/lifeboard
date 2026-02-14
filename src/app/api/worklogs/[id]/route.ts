import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// PATCH: Update a work log
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { hours, description, date } = body;

    const updateData: any = {};
    if (hours !== undefined) updateData.hours = parseFloat(hours);
    if (description !== undefined) updateData.notes = description;
    if (date) updateData.date = new Date(date);

    const workLog = await prisma.workLog.update({
      where: { id },
      data: updateData,
      include: {
        actor: true,
        project: true,
      },
    });

    return NextResponse.json(workLog);
  } catch (error) {
    console.error('Error updating work log:', error);
    return NextResponse.json(
      { error: 'Failed to update work log' },
      { status: 500 }
    );
  }
}

// DELETE: Remove a work log
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await prisma.workLog.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting work log:', error);
    return NextResponse.json(
      { error: 'Failed to delete work log' },
      { status: 500 }
    );
  }
}
