import VideoList from '@/components/VideoList';

export default function VideosPage() {
  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">📹 Vidéos Instagram</h1>
          <p className="text-muted-foreground">
            Gestion des vidéos pour Alex et Nastia
          </p>
        </div>

        <VideoList />
      </div>
    </div>
  );
}
