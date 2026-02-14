import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, actorId, projectId, hours, amount, description } = body

    if (type === 'work') {
      // Log work hours
      if (!actorId || !projectId || !hours) {
        return NextResponse.json(
          { error: 'Missing required fields: actorId, projectId, hours' },
          { status: 400 }
        )
      }

      const workLog = await prisma.workLog.create({
        data: {
          actorId,
          projectId,
          hours: parseFloat(hours),
          description: description || '',
          date: new Date(),
        },
      })

      return NextResponse.json(workLog)
    }

    if (type === 'money') {
      // Log money
      if (!amount || !description) {
        return NextResponse.json(
          { error: 'Missing required fields: amount, description' },
          { status: 400 }
        )
      }

      const moneyEntry = await prisma.moneyEntry.create({
        data: {
          amount: parseFloat(amount),
          type: 'income', // Default to income
          description,
          date: new Date(),
          projectId: projectId || null,
        },
      })

      return NextResponse.json(moneyEntry)
    }

    return NextResponse.json(
      { error: 'Invalid type. Use "work" or "money"' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error logging:', error)
    return NextResponse.json(
      { error: 'Failed to log data' },
      { status: 500 }
    )
  }
}
