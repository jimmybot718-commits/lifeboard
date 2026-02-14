import Link from 'next/link';
import EmailList from '@/components/EmailList';

export default function EmailsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      {/* Header */}
      <header className="border-b border-slate-700 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">LifeBoard</h1>
          <nav className="flex gap-4">
            <Link href="/" className="hover:text-blue-400">Dashboard</Link>
            <Link href="/planning" className="hover:text-blue-400">Planning</Link>
            <Link href="/tasks" className="hover:text-blue-400">Tasks</Link>
            <Link href="/videos" className="hover:text-blue-400">Videos</Link>
            <Link href="/emails" className="text-blue-400">Emails</Link>
            <Link href="/projects" className="hover:text-blue-400">Projects</Link>
            <Link href="/jimmy" className="hover:text-blue-400">Jimmy</Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Emails Partenariats</h1>
            <p className="text-slate-400">
              Suivi des emails envoyés pour les partenariats
            </p>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <EmailList />
          </div>
        </div>
      </main>
    </div>
  );
}
