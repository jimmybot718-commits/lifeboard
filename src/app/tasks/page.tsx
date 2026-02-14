import Link from 'next/link';
import TaskList from '@/components/TaskList';
import Header from '@/components/Header';

export default function TasksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <Header />

      <main className="container mx-auto p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Tasks & Actions</h1>
            <p className="text-slate-400">
              Toutes les tâches et actions effectuées par Jimmy et l'équipe.
            </p>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <TaskList />
          </div>
        </div>
      </main>
    </div>
  );
}
