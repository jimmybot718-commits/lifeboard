import ProjectsManager from '@/components/ProjectsManager';
import Header from '@/components/Header';

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <Header />
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <ProjectsManager />
        </div>
      </div>
    </div>
  );
}
