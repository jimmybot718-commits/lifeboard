import { prisma } from '@/lib/prisma';
import StatsView from '@/components/StatsView';

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
    <StatsView
      initialWorkLogs={workLogs}
      initialMoneyEntries={moneyEntries}
    />
  );
}
