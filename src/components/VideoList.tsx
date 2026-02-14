'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// Removed complex Select components - using native HTML select instead
import { Trash2, ExternalLink, Plus } from 'lucide-react';

interface InstagramVideo {
  id: string;
  url: string;
  title?: string;
  description?: string;
  forWhom: string;
  status: string;
  postedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export default function VideoList() {
  const [videos, setVideos] = useState<InstagramVideo[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newVideo, setNewVideo] = useState({
    url: '',
    title: '',
    description: '',
    forWhom: 'nastia',
    status: 'draft',
  });

  useEffect(() => {
    fetchVideos();
  }, [filter]);

  const fetchVideos = async () => {
    try {
      const params = new URLSearchParams();
      if (filter !== 'all') {
        params.append('forWhom', filter);
      }
      
      const res = await fetch(`/api/videos?${params.toString()}`);
      const data = await res.json();
      setVideos(data);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const addVideo = async () => {
    if (!newVideo.url) return;

    try {
      const res = await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVideo),
      });

      if (res.ok) {
        setNewVideo({
          url: '',
          title: '',
          description: '',
          forWhom: 'nastia',
          status: 'draft',
        });
        setShowAddForm(false);
        fetchVideos();
      }
    } catch (error) {
      console.error('Error adding video:', error);
    }
  };

  const deleteVideo = async (id: string) => {
    if (!confirm('Supprimer cette vidéo ?')) return;

    try {
      await fetch(`/api/videos/${id}`, {
        method: 'DELETE',
      });
      fetchVideos();
    } catch (error) {
      console.error('Error deleting video:', error);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/videos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          ...(status === 'posted' && { postedAt: new Date().toISOString() }),
        }),
      });
      fetchVideos();
    } catch (error) {
      console.error('Error updating video:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      draft: 'bg-gray-500',
      posted: 'bg-green-500',
      deleted: 'bg-red-500',
    };

    return (
      <Badge className={variants[status] || 'bg-gray-500'}>
        {status}
      </Badge>
    );
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="space-y-4">
      {/* Header + Filters */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            size="sm"
          >
            Toutes
          </Button>
          <Button
            variant={filter === 'nastia' ? 'default' : 'outline'}
            onClick={() => setFilter('nastia')}
            size="sm"
          >
            Nastia
          </Button>
          <Button
            variant={filter === 'alex' ? 'default' : 'outline'}
            onClick={() => setFilter('alex')}
            size="sm"
          >
            Alex
          </Button>
        </div>

        <Button onClick={() => setShowAddForm(!showAddForm)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter
        </Button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Nouvelle vidéo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>URL ou référence</Label>
              <Input
                value={newVideo.url}
                onChange={(e) => setNewVideo({ ...newVideo, url: e.target.value })}
                placeholder="https://instagram.com/..."
              />
            </div>
            <div>
              <Label>Titre (optionnel)</Label>
              <Input
                value={newVideo.title}
                onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                placeholder="Titre de la vidéo"
              />
            </div>
            <div>
              <Label>Description (optionnel)</Label>
              <Input
                value={newVideo.description}
                onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
                placeholder="Notes..."
              />
            </div>
            <div>
              <Label>Pour qui</Label>
              <select
                value={newVideo.forWhom}
                onChange={(e) => setNewVideo({ ...newVideo, forWhom: e.target.value })}
                className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="nastia">Nastia</option>
                <option value="alex">Alex</option>
              </select>
            </div>
            <div className="flex gap-2">
              <Button onClick={addVideo}>Ajouter</Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Annuler
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Videos List */}
      <div className="space-y-2">
        {videos.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Aucune vidéo
            </CardContent>
          </Card>
        ) : (
          videos.map((video) => (
            <Card key={video.id}>
              <CardContent className="py-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      {video.title ? (
                        <span className="font-medium">{video.title}</span>
                      ) : (
                        <span className="text-muted-foreground">Sans titre</span>
                      )}
                      {getStatusBadge(video.status)}
                      <Badge variant="outline">
                        {video.forWhom === 'nastia' ? 'Nastia' : 'Alex'}
                      </Badge>
                    </div>

                    {video.description && (
                      <p className="text-sm text-muted-foreground">{video.description}</p>
                    )}

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <a
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:underline"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Lien
                      </a>
                      <span>
                        Créé: {new Date(video.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                      {video.postedAt && (
                        <span>
                          Posté: {new Date(video.postedAt).toLocaleDateString('fr-FR')}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {video.status === 'draft' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStatus(video.id, 'posted')}
                      >
                        Marquer posté
                      </Button>
                    )}
                    {video.status === 'posted' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStatus(video.id, 'draft')}
                      >
                        Remettre en draft
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteVideo(video.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Stats */}
      <Card>
        <CardContent className="py-4">
          <div className="flex gap-8 text-sm">
            <div>
              <span className="text-muted-foreground">Total:</span>{' '}
              <span className="font-medium">{videos.length}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Draft:</span>{' '}
              <span className="font-medium">
                {videos.filter((v) => v.status === 'draft').length}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Postées:</span>{' '}
              <span className="font-medium">
                {videos.filter((v) => v.status === 'posted').length}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
