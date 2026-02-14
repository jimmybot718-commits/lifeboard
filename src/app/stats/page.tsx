import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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

  // Calculate totals
  const totalHours = workLogs.reduce((sum, log) => sum + log.hours, 0);
  const totalMoney = moneyEntries.reduce((sum, entry) => sum + entry.amount, 0);

  // Group by actor
  const hoursByActor = workLogs.reduce((acc, log) => {
    const name = log.actor.name;
    acc[name] = (acc[name] || 0) + log.hours;
    return acc;
  }, {} as Record<string, number>);

  // Group by project
  const hoursByProject = workLogs.reduce((acc, log) => {
    if (log.project) {
      const name = log.project.name;
      acc[name] = (acc[name] || 0) + log.hours;
    }
    return acc;
  }, {} as Record<string, number>);

  const moneyByProject = moneyEntries.reduce((acc, entry) => {
    if (entry.project) {
      const name = entry.project.name;
      acc[name] = (acc[name] || 0) + entry.amount;
    }
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Statistiques & Historique</h1>
          <p className="text-slate-400">
            Vue complète des heures travaillées et revenus générés
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Total Heures</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-emerald-400">
                {totalHours.toFixed(1)}h
              </div>
              <div className="mt-4 space-y-2">
                {Object.entries(hoursByActor).map(([actor, hours]) => (
                  <div key={actor} className="flex justify-between text-sm">
                    <span className="text-slate-300">{actor}</span>
                    <span className="text-slate-400">{hours.toFixed(1)}h</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Total Argent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-emerald-400">
                {totalMoney.toFixed(2)} CHF
              </div>
              <div className="mt-4 space-y-2">
                {Object.entries(moneyByProject).map(([project, amount]) => (
                  <div key={project} className="flex justify-between text-sm">
                    <span className="text-slate-300">{project}</span>
                    <span className="text-slate-400">{amount.toFixed(2)} CHF</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Work Logs */}
        <Card className="bg-slate-900 border-slate-800 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Historique Heures</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {workLogs.length === 0 ? (
                <p className="text-slate-400 text-center py-8">
                  Aucune entrée pour le moment
                </p>
              ) : (
                workLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between p-4 bg-slate-800 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="bg-slate-700 text-white border-slate-600">
                          {log.actor.name}
                        </Badge>
                        {log.project && (
                          <Badge variant="outline" className="bg-slate-700 text-white border-slate-600">
                            {log.project.name}
                          </Badge>
                        )}
                      </div>
                      {log.description && (
                        <p className="text-sm text-slate-300">{log.description}</p>
                      )}
                      <p className="text-xs text-slate-500 mt-1">
                        {new Date(log.date).toLocaleDateString('fr-FR', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-emerald-400">
                        {log.hours}h
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Money Entries */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Historique Argent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {moneyEntries.length === 0 ? (
                <p className="text-slate-400 text-center py-8">
                  Aucune entrée pour le moment
                </p>
              ) : (
                moneyEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-4 bg-slate-800 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {entry.project && (
                          <Badge variant="outline" className="bg-slate-700 text-white border-slate-600">
                            {entry.project.name}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-300">{entry.description}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {new Date(entry.date).toLocaleDateString('fr-FR', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-emerald-400">
                        {entry.amount.toFixed(2)} CHF
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Back to Dashboard */}
        <div className="mt-8 text-center">
          <a
            href="/"
            className="text-slate-400 hover:text-white transition-colors"
          >
            ← Retour au Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
