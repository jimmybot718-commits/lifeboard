import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// PATCH: Update a money entry
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { amount, description, date } = body;

    const updateData: any = {};
    if (amount !== undefined) updateData.amount = parseFloat(amount);
    if (description !== undefined) updateData.description = description;
    if (date) updateData.date = new Date(date);

    const moneyEntry = await prisma.moneyEntry.update({
      where: { id },
      data: updateData,
      include: {
        project: true,
      },
    });

    return NextResponse.json(moneyEntry);
  } catch (error) {
    console.error('Error updating money entry:', error);
    return NextResponse.json(
      { error: 'Failed to update money entry' },
      { status: 500 }
    );
  }
}

// DELETE: Remove a money entry
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await prisma.moneyEntry.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting money entry:', error);
    return NextResponse.json(
      { error: 'Failed to delete money entry' },
      { status: 500 }
    );
  }
}
