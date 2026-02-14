import Link from 'next/link';
import EmailList from '@/components/EmailList';
import Header from '@/components/Header';

export default function EmailsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <Header />

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
