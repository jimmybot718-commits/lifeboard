import { prisma } from '@/lib/prisma';
import StatsView from '@/components/StatsView';
import Header from '@/components/Header';

export const dynamic = 'force-dynamic';

export default async function StatsPage() {
  // Fetch work logs with relations
  const workLogs = await prisma.workLog.findMany({
    include: {
      actor: true,
      project: true,
    },
    orderBy: {
      date: 'desc',
    },
    take: 100, // Last 100 entries
  });

  // Fetch money entries with relations
  const moneyEntries = await prisma.moneyEntry.findMany({
    include: {
      project: true,
    },
    orderBy: {
      date: 'desc',
    },
    take: 100, // Last 100 entries
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <Header />
      <StatsView
        initialWorkLogs={workLogs}
        initialMoneyEntries={moneyEntries}
      />
    </div>
  );
}
