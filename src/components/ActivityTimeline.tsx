'use client'

import { useMemo, useState } from 'react'

type Task = any
type WorkLog = any
type MoneyEntry = any
type Video = any
type Email = any

interface ActivityTimelineProps {
  tasks: Task[]
  workLogs: WorkLog[]
  moneyEntries: MoneyEntry[]
  videos: Video[]
  emails: Email[]
}

type Activity = {
  id: string
  type: 'task' | 'work' | 'money' | 'video' | 'email'
  timestamp: Date
  title: string
  description: string
  metadata?: Record<string, any>
  icon: string
  color: string
}

export default function ActivityTimeline({
  tasks,
  workLogs,
  moneyEntries,
  videos,
  emails,
}: ActivityTimelineProps) {
  const [filter, setFilter] = useState<'all' | 'task' | 'work' | 'money' | 'video' | 'email'>('all')

  // Merge all activities into a single timeline
  const allActivities = useMemo(() => {
    const activities: Activity[] = []

    // Tasks
    tasks.forEach((task) => {
      activities.push({
        id: `task-${task.id}`,
        type: 'task',
        timestamp: new Date(task.createdAt),
        title: `Tâche créée: ${task.title}`,
        description: `Par ${task.actor?.label || 'Unknown'} · ${task.status}`,
        metadata: { project: task.project?.name, type: task.type },
        icon: '✅',
        color: 'bg-blue-500',
      })
    })

    // Work Logs
    workLogs.forEach((log) => {
      activities.push({
        id: `work-${log.id}`,
        type: 'work',
        timestamp: new Date(log.date),
        title: `${log.hours}h de travail`,
        description: `${log.actor?.label || 'Unknown'} · ${log.project?.name || 'Sans projet'}`,
        metadata: { notes: log.notes },
        icon: '⏱️',
        color: 'bg-emerald-500',
      })
    })

    // Money Entries
    moneyEntries.forEach((entry) => {
      activities.push({
        id: `money-${entry.id}`,
        type: 'money',
        timestamp: new Date(entry.date),
        title: `${entry.amount} CHF gagné`,
        description: entry.description || entry.source || 'Revenu',
        metadata: { project: entry.project?.name },
        icon: '💰',
        color: 'bg-amber-500',
      })
    })

    // Videos
    videos.forEach((video) => {
      const action = video.status === 'posted' ? 'postée' : 'créée'
      activities.push({
        id: `video-${video.id}`,
        type: 'video',
        timestamp: new Date(video.createdAt),
        title: `Vidéo ${action}: ${video.title || 'Sans titre'}`,
        description: `Pour ${video.forWhom === 'nastia' ? 'Nastia' : 'Alex'} · ${video.status}`,
        metadata: { url: video.url },
        icon: '🎬',
        color: 'bg-purple-500',
      })
    })

    // Emails
    emails.forEach((email) => {
      activities.push({
        id: `email-${email.id}`,
        type: 'email',
        timestamp: new Date(email.sentAt),
        title: `Email envoyé: ${email.subject}`,
        description: `À ${email.recipient} · ${email.status}`,
        metadata: { notes: email.notes },
        icon: '📧',
        color: 'bg-cyan-500',
      })
    })

    // Sort by timestamp (most recent first)
    return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }, [tasks, workLogs, moneyEntries, videos, emails])

  // Filter activities
  const filteredActivities = useMemo(() => {
    if (filter === 'all') return allActivities
    return allActivities.filter((a) => a.type === filter)
  }, [allActivities, filter])

  // Format date
  const formatDate = (date: Date) => {
    const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
    const months = ['jan', 'fév', 'mar', 'avr', 'mai', 'jun', 'jul', 'aoû', 'sep', 'oct', 'nov', 'déc']
    
    const day = days[date.getDay()]
    const monthDay = date.getDate()
    const month = months[date.getMonth()]
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    
    return `${day} ${monthDay} ${month} · ${hours}:${minutes}`
  }

  // Stats
  const stats = {
    total: allActivities.length,
    tasks: allActivities.filter((a) => a.type === 'task').length,
    work: allActivities.filter((a) => a.type === 'work').length,
    money: allActivities.filter((a) => a.type === 'money').length,
    videos: allActivities.filter((a) => a.type === 'video').length,
    emails: allActivities.filter((a) => a.type === 'email').length,
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div
          onClick={() => setFilter('all')}
          className={`p-4 rounded-lg cursor-pointer transition-all ${
            filter === 'all' ? 'bg-slate-700 ring-2 ring-slate-500' : 'bg-slate-800 hover:bg-slate-700'
          }`}
        >
          <div className="text-2xl font-bold text-white">{stats.total}</div>
          <div className="text-sm text-slate-400">Total</div>
        </div>
        <div
          onClick={() => setFilter('task')}
          className={`p-4 rounded-lg cursor-pointer transition-all ${
            filter === 'task' ? 'bg-blue-700 ring-2 ring-blue-500' : 'bg-slate-800 hover:bg-slate-700'
          }`}
        >
          <div className="text-2xl font-bold text-white">{stats.tasks}</div>
          <div className="text-sm text-slate-400">Tâches</div>
        </div>
        <div
          onClick={() => setFilter('work')}
          className={`p-4 rounded-lg cursor-pointer transition-all ${
            filter === 'work' ? 'bg-emerald-700 ring-2 ring-emerald-500' : 'bg-slate-800 hover:bg-slate-700'
          }`}
        >
          <div className="text-2xl font-bold text-white">{stats.work}</div>
          <div className="text-sm text-slate-400">Heures</div>
        </div>
        <div
          onClick={() => setFilter('money')}
          className={`p-4 rounded-lg cursor-pointer transition-all ${
            filter === 'money' ? 'bg-amber-700 ring-2 ring-amber-500' : 'bg-slate-800 hover:bg-slate-700'
          }`}
        >
          <div className="text-2xl font-bold text-white">{stats.money}</div>
          <div className="text-sm text-slate-400">Revenus</div>
        </div>
        <div
          onClick={() => setFilter('video')}
          className={`p-4 rounded-lg cursor-pointer transition-all ${
            filter === 'video' ? 'bg-purple-700 ring-2 ring-purple-500' : 'bg-slate-800 hover:bg-slate-700'
          }`}
        >
          <div className="text-2xl font-bold text-white">{stats.videos}</div>
          <div className="text-sm text-slate-400">Vidéos</div>
        </div>
        <div
          onClick={() => setFilter('email')}
          className={`p-4 rounded-lg cursor-pointer transition-all ${
            filter === 'email' ? 'bg-cyan-700 ring-2 ring-cyan-500' : 'bg-slate-800 hover:bg-slate-700'
          }`}
        >
          <div className="text-2xl font-bold text-white">{stats.emails}</div>
          <div className="text-sm text-slate-400">Emails</div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-slate-800 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">
          {filter === 'all' ? 'Toutes les activités' : `Filtre: ${filter}`}
        </h2>

        {filteredActivities.length === 0 ? (
          <p className="text-slate-400">Aucune activité pour cette période.</p>
        ) : (
          <div className="space-y-4">
            {filteredActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex gap-4 p-4 bg-slate-900 rounded-lg hover:bg-slate-700 transition-colors"
              >
                {/* Icon */}
                <div className={`flex-shrink-0 w-10 h-10 ${activity.color} rounded-full flex items-center justify-center text-xl`}>
                  {activity.icon}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-white font-semibold">{activity.title}</h3>
                  <p className="text-slate-400 text-sm mt-1">{activity.description}</p>
                  
                  {/* Metadata */}
                  {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {Object.entries(activity.metadata).map(([key, value]) => {
                        if (!value) return null
                        return (
                          <span key={key} className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded">
                            {key}: {String(value)}
                          </span>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* Timestamp */}
                <div className="flex-shrink-0 text-xs text-slate-500">
                  {formatDate(activity.timestamp)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
