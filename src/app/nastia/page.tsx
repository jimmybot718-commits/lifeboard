import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

async function getNastiaData() {
  const nastiaActor = await prisma.actor.findUnique({
    where: { name: 'Nastia' }
  });

  if (!nastiaActor) {
    return { schedule: [], videos: [], workLogs: [], totalHours: 0 };
  }

  // Get schedule for the next 7 days
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);

  const schedule = await prisma.scheduleEntry.findMany({
    where: {
      actorId: nastiaActor.id,
      date: {
        gte: today,
        lt: nextWeek
      }
    },
    include: {
      project: true
    },
    orderBy: {
      date: 'asc'
    }
  });

  // Get Nastia's videos
  const videos = await prisma.instagramVideo.findMany({
    where: {
      forWhom: 'nastia'
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  // Get Nastia's work logs (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const workLogs = await prisma.workLog.findMany({
    where: {
      actorId: nastiaActor.id,
      date: {
        gte: thirtyDaysAgo
      }
    },
    include: {
      project: true
    },
    orderBy: {
      date: 'desc'
    }
  });

  const totalHours = workLogs.reduce((sum, log) => sum + log.hours, 0);

  return { schedule, videos, workLogs, totalHours, nastiaActor };
}

export default async function NastiaPage() {
  const { schedule, videos, workLogs, totalHours, nastiaActor } = await getNastiaData();

  const draftVideos = videos.filter(v => v.status === 'draft').length;
  const postedVideos = videos.filter(v => v.status === 'posted').length;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">🎬 Nastia Dashboard</h1>
            <p className="text-slate-400 mt-1">
              Planning, vidéos et statistiques de Nastia
            </p>
          </div>
          <Link
            href="/"
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-md transition-colors"
          >
            ← Accueil
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="text-sm text-slate-400 mb-1">Total Heures (30j)</div>
            <div className="text-3xl font-bold text-purple-400">
              {totalHours.toFixed(1)}h
            </div>
          </div>
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="text-sm text-slate-400 mb-1">Vidéos Draft</div>
            <div className="text-3xl font-bold text-yellow-400">{draftVideos}</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="text-sm text-slate-400 mb-1">Vidéos Postées</div>
            <div className="text-3xl font-bold text-green-400">{postedVideos}</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="text-sm text-slate-400 mb-1">Total Vidéos</div>
            <div className="text-3xl font-bold text-blue-400">{videos.length}</div>
          </div>
        </div>

        {/* Planning de la semaine */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 mb-8">
          <h2 className="text-xl font-bold mb-4">📅 Planning cette semaine</h2>
          {schedule.length === 0 ? (
            <p className="text-slate-400">Aucun événement prévu cette semaine.</p>
          ) : (
            <div className="space-y-3">
              {schedule.map((entry) => {
                const entryDate = new Date(entry.date);
                const dayName = entryDate.toLocaleDateString('fr-FR', { weekday: 'long' });
                const dateStr = entryDate.toLocaleDateString('fr-FR', { 
                  day: 'numeric', 
                  month: 'long' 
                });

                return (
                  <div
                    key={entry.id}
                    className="flex items-start gap-4 p-4 bg-slate-700/50 rounded-md"
                  >
                    <div className="flex-shrink-0 w-32">
                      <div className="text-sm font-medium capitalize">{dayName}</div>
                      <div className="text-xs text-slate-400">{dateStr}</div>
                    </div>
                    <div className="flex-shrink-0 text-sm text-slate-300">
                      {entry.startTime} - {entry.endTime}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{entry.title}</div>
                      {entry.description && (
                        <div className="text-sm text-slate-400 mt-1">
                          {entry.description}
                        </div>
                      )}
                      {entry.project && (
                        <div className="text-xs text-purple-400 mt-1">
                          {entry.project.name}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div className="mt-4">
            <Link
              href="/schedule"
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              → Gérer le planning complet
            </Link>
          </div>
        </div>

        {/* Vidéos Instagram */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 mb-8">
          <h2 className="text-xl font-bold mb-4">🎥 Vidéos Instagram</h2>
          {videos.length === 0 ? (
            <p className="text-slate-400">Aucune vidéo enregistrée.</p>
          ) : (
            <div className="space-y-3">
              {videos.slice(0, 5).map((video) => (
                <div
                  key={video.id}
                  className="flex items-start gap-4 p-4 bg-slate-700/50 rounded-md"
                >
                  <div className="flex-1">
                    <div className="font-medium">{video.title || 'Sans titre'}</div>
                    {video.description && (
                      <div className="text-sm text-slate-400 mt-1">
                        {video.description}
                      </div>
                    )}
                    {video.url && (
                      <a
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-400 hover:text-blue-300 mt-1 inline-block"
                      >
                        {video.url}
                      </a>
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    {video.status === 'draft' && (
                      <span className="px-2 py-1 text-xs bg-yellow-500/20 text-yellow-400 rounded">
                        Draft
                      </span>
                    )}
                    {video.status === 'posted' && (
                      <span className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded">
                        Posté
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-4">
            <Link
              href="/videos"
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              → Gérer toutes les vidéos
            </Link>
          </div>
        </div>

        {/* Heures travaillées récentes */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h2 className="text-xl font-bold mb-4">⏱️ Heures récentes (30j)</h2>
          {workLogs.length === 0 ? (
            <p className="text-slate-400">Aucune heure enregistrée.</p>
          ) : (
            <div className="space-y-2">
              {workLogs.slice(0, 10).map((log) => {
                const logDate = new Date(log.date);
                const dateStr = logDate.toLocaleDateString('fr-FR', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short'
                });

                return (
                  <div
                    key={log.id}
                    className="flex items-center justify-between p-3 bg-slate-700/50 rounded-md"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-sm text-slate-400 w-24">{dateStr}</div>
                      <div className="text-sm">
                        {log.project?.name || 'Sans projet'}
                      </div>
                      {log.notes && (
                        <div className="text-xs text-slate-400">
                          {log.notes}
                        </div>
                      )}
                    </div>
                    <div className="text-sm font-medium text-purple-400">
                      {log.hours}h
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div className="mt-4">
            <Link
              href="/stats"
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              → Voir toutes les stats
            </Link>
          </div>
        </div>

        {/* Quick Action */}
        {nastiaActor && (
          <div className="mt-8 bg-purple-500/10 border border-purple-500/30 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">⚡ Quick Action</h3>
            <p className="text-sm text-slate-400 mb-4">
              Pour logger des heures ou ajouter des vidéos, utilisez les liens ci-dessus ou la page d'accueil.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
