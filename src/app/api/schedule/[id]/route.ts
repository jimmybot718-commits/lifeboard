import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PATCH /api/schedule/[id] - Update a schedule entry
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { title, startTime, endTime, date, description, projectId } = body;

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (startTime !== undefined) updateData.startTime = startTime;
    if (endTime !== undefined) updateData.endTime = endTime;
    if (date !== undefined) updateData.date = new Date(date);
    if (description !== undefined) updateData.description = description;
    if (projectId !== undefined) updateData.projectId = projectId || null;

    const entry = await prisma.scheduleEntry.update({
      where: { id: parseInt(params.id) },
      data: updateData,
      include: {
        actor: true,
        project: true
      }
    });

    return NextResponse.json(entry);
  } catch (error) {
    console.error('Error updating schedule entry:', error);
    return NextResponse.json(
      { error: 'Failed to update schedule entry' },
      { status: 500 }
    );
  }
}

// DELETE /api/schedule/[id] - Delete a schedule entry
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.scheduleEntry.delete({
      where: { id: parseInt(params.id) }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting schedule entry:', error);
    return NextResponse.json(
      { error: 'Failed to delete schedule entry' },
      { status: 500 }
    );
  }
}
