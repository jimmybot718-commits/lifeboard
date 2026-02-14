import Link from 'next/link';
import VideoList from '@/components/VideoList';
import Header from '@/components/Header';

export default function VideosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <Header />

      <main className="container mx-auto p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Vidéos Instagram</h1>
            <p className="text-slate-400">
              Gestion des vidéos pour Alex et Nastia
            </p>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <VideoList />
          </div>
        </div>
      </main>
    </div>
  );
}
