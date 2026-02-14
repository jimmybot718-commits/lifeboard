import { prisma } from '@/lib/prisma';
import { ScheduleEditor } from '@/components/ScheduleEditor';
import Header from '@/components/Header';

export default async function SchedulePage() {
  // Default to today in UTC
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().split('T')[0];

  // Fetch today's schedule entries
  const entries = await prisma.scheduleEntry.findMany({
    where: {
      date: today
    },
    include: {
      actor: true,
      project: true
    },
    orderBy: {
      startTime: 'asc'
    }
  });

  // Fetch actors and projects for the form
  const actors = await prisma.actor.findMany({
    orderBy: { name: 'asc' }
  });

  const projects = await prisma.project.findMany({
    where: { status: 'active' },
    orderBy: { name: 'asc' }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <Header />
      <div className="p-8">
        <ScheduleEditor
          initialEntries={entries}
          actors={actors}
          projects={projects}
          selectedDate={todayStr}
        />
      </div>
    </div>
  );
}
