import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      {/* Header */}
      <header className="border-b border-slate-700 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">LifeBoard</h1>
          <nav className="flex gap-4">
            <Link href="/planning" className="hover:text-blue-400">Planning</Link>
            <Link href="/tasks" className="hover:text-blue-400">Tasks</Link>
            <Link href="/projects" className="hover:text-blue-400">Projects</Link>
            <Link href="/jimmy" className="hover:text-blue-400">Jimmy</Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto p-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard title="Today's Tasks" value="0" color="blue" />
          <StatCard title="Hours Worked" value="0h" color="green" />
          <StatCard title="Active Projects" value="4" color="purple" />
          <StatCard title="Money This Month" value="0 CHF" color="amber" />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Planning */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              📅 Planning Aujourd'hui
            </h2>
            <div className="space-y-3">
              <PlanningItem time="09:00" title="Réveil" actor="Alex" />
              <PlanningItem time="10:00" title="Travail" actor="Alex" />
              <PlanningItem time="15:00" title="Sport" actor="Alex" highlight />
              <PlanningItem time="18:00" title="Fin de journée" actor="Alex" />
            </div>
            <Link href="/planning" className="block mt-4 text-blue-400 hover:underline text-sm">
              Voir tout le planning →
            </Link>
          </div>

          {/* Tasks */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              ✅ Tasks Récentes
            </h2>
            <div className="space-y-3">
              <TaskItem title="Aucune tâche pour le moment" status="info" />
            </div>
            <Link href="/tasks" className="block mt-4 text-blue-400 hover:underline text-sm">
              Voir toutes les tasks →
            </Link>
          </div>

          {/* Jimmy's Work */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              🤖 Jimmy (Actions Auto)
            </h2>
            <div className="space-y-3">
              <JimmyAction time="04:00" action="LifeBoard dev session" status="running" />
              <JimmyAction time="03:30" action="TradePilot: Risk System" status="done" />
              <JimmyAction time="03:00" action="Academy: Advanced tutorial" status="done" />
            </div>
            <Link href="/jimmy" className="block mt-4 text-blue-400 hover:underline text-sm">
              Voir toutes mes actions →
            </Link>
          </div>
        </div>

        {/* Projects */}
        <div className="mt-6 bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            📊 Projets
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ProjectCard name="LifeBoard" progress={10} owner="Jimmy" />
            <ProjectCard name="TradePilot" progress={70} owner="Jimmy" />
            <ProjectCard name="OpenClaw Academy" progress={90} owner="Jimmy" />
            <ProjectCard name="Instagram" progress={0} owner="Alex" />
          </div>
        </div>

        {/* Nastia's Planning */}
        <div className="mt-6 bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            👧 Planning Nastia
          </h2>
          <div className="grid grid-cols-7 gap-2 text-center text-sm">
            <DayCard day="Lun" activity="Instagram" highlight />
            <DayCard day="Mar" activity="Instagram" highlight />
            <DayCard day="Mer" activity="OnlyFans" warning />
            <DayCard day="Jeu" activity="-" />
            <DayCard day="Ven" activity="Debrief" />
            <DayCard day="Sam" activity="-" />
            <DayCard day="Dim" activity="-" />
          </div>
        </div>
      </main>
    </div>
  )
}

function StatCard({ title, value, color }: { title: string; value: string; color: string }) {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
    green: 'bg-green-500/10 border-green-500/30 text-green-400',
    purple: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
    amber: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
  }
  return (
    <div className={`p-4 rounded-lg border ${colorClasses[color]}`}>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm opacity-80">{title}</div>
    </div>
  )
}

function PlanningItem({ time, title, actor, highlight }: { time: string; title: string; actor: string; highlight?: boolean }) {
  return (
    <div className={`flex items-center gap-3 p-2 rounded ${highlight ? 'bg-blue-500/20' : ''}`}>
      <span className="text-slate-400 font-mono text-sm w-14">{time}</span>
      <span className="flex-1">{title}</span>
      <span className="text-xs text-slate-500">{actor}</span>
    </div>
  )
}

function TaskItem({ title, status }: { title: string; status: string }) {
  return (
    <div className="flex items-center gap-3 p-2 rounded bg-slate-700/50">
      <span className="text-slate-400">○</span>
      <span className="flex-1 text-slate-400">{title}</span>
    </div>
  )
}

function JimmyAction({ time, action, status }: { time: string; action: string; status: string }) {
  const statusColors: Record<string, string> = {
    running: 'text-yellow-400',
    done: 'text-green-400',
    failed: 'text-red-400',
  }
  return (
    <div className="flex items-center gap-3 p-2 rounded bg-slate-700/50">
      <span className="text-slate-400 font-mono text-sm w-14">{time}</span>
      <span className="flex-1">{action}</span>
      <span className={`text-xs ${statusColors[status]}`}>{status}</span>
    </div>
  )
}

function ProjectCard({ name, progress, owner }: { name: string; progress: number; owner: string }) {
  return (
    <div className="bg-slate-700/50 rounded-lg p-4">
      <div className="flex justify-between items-start mb-2">
        <span className="font-medium">{name}</span>
        <span className="text-xs text-slate-400">{owner}</span>
      </div>
      <div className="w-full bg-slate-600 rounded-full h-2 mb-1">
        <div 
          className="bg-blue-500 h-2 rounded-full transition-all" 
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="text-xs text-slate-400">{progress}%</span>
    </div>
  )
}

function DayCard({ day, activity, highlight, warning }: { day: string; activity: string; highlight?: boolean; warning?: boolean }) {
  let bgClass = 'bg-slate-700/50'
  if (highlight) bgClass = 'bg-blue-500/20 border border-blue-500/30'
  if (warning) bgClass = 'bg-amber-500/20 border border-amber-500/30'
  
  return (
    <div className={`p-2 rounded ${bgClass}`}>
      <div className="font-medium">{day}</div>
      <div className="text-xs text-slate-400">{activity}</div>
    </div>
  )
}
