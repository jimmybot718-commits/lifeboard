import ProjectsManager from '@/components/ProjectsManager';

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Navigation */}
        <nav className="mb-8 flex gap-4 text-sm">
          <a href="/" className="text-slate-400 hover:text-white transition">
            Dashboard
          </a>
          <span className="text-slate-600">/</span>
          <a href="/schedule" className="text-slate-400 hover:text-white transition">
            Planning
          </a>
          <span className="text-slate-600">/</span>
          <span className="text-white font-medium">Projets</span>
          <span className="text-slate-600">/</span>
          <a href="/tasks" className="text-slate-400 hover:text-white transition">
            Tasks
          </a>
          <span className="text-slate-600">/</span>
          <a href="/videos" className="text-slate-400 hover:text-white transition">
            Vidéos
          </a>
          <span className="text-slate-600">/</span>
          <a href="/emails" className="text-slate-400 hover:text-white transition">
            Emails
          </a>
          <span className="text-slate-600">/</span>
          <a href="/stats" className="text-slate-400 hover:text-white transition">
            Stats
          </a>
        </nav>

        <ProjectsManager />
      </div>
    </div>
  );
}
