'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type Actor = {
  id: number;
  name: string;
};

type Project = {
  id: number;
  name: string;
};

type ScheduleEntry = {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  date: Date;
  description: string | null;
  actor: Actor;
  project: Project | null;
};

type Props = {
  initialEntries: ScheduleEntry[];
  actors: Actor[];
  projects: Project[];
  selectedDate: string;
};

export function ScheduleEditor({ initialEntries, actors, projects, selectedDate }: Props) {
  const [entries, setEntries] = useState<ScheduleEntry[]>(initialEntries);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    actorId: '',
    projectId: '',
    title: '',
    startTime: '',
    endTime: '',
    description: ''
  });

  const resetForm = () => {
    setFormData({
      actorId: '',
      projectId: '',
      title: '',
      startTime: '',
      endTime: '',
      description: ''
    });
    setEditingId(null);
    setShowAddForm(false);
  };

  const handleAdd = async () => {
    if (!formData.actorId || !formData.title || !formData.startTime || !formData.endTime) {
      setMessage({ type: 'error', text: 'Remplis au moins: Acteur, Titre, Début, Fin' });
      return;
    }

    try {
      const res = await fetch('/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actorId: parseInt(formData.actorId),
          projectId: formData.projectId ? parseInt(formData.projectId) : null,
          title: formData.title,
          startTime: formData.startTime,
          endTime: formData.endTime,
          date: selectedDate,
          description: formData.description || null
        })
      });

      if (!res.ok) throw new Error('Failed to create entry');

      const newEntry = await res.json();
      setEntries([...entries, newEntry]);
      setMessage({ type: 'success', text: 'Entrée créée!' });
      resetForm();
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la création' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleEdit = (entry: ScheduleEntry) => {
    setEditingId(entry.id);
    setFormData({
      actorId: entry.actor.id.toString(),
      projectId: entry.project?.id.toString() || '',
      title: entry.title,
      startTime: entry.startTime,
      endTime: entry.endTime,
      description: entry.description || ''
    });
    setShowAddForm(false);
  };

  const handleUpdate = async (id: number) => {
    try {
      const res = await fetch(`/api/schedule/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          startTime: formData.startTime,
          endTime: formData.endTime,
          description: formData.description || null,
          projectId: formData.projectId ? parseInt(formData.projectId) : null
        })
      });

      if (!res.ok) throw new Error('Failed to update entry');

      const updatedEntry = await res.json();
      setEntries(entries.map(e => e.id === id ? updatedEntry : e));
      setMessage({ type: 'success', text: 'Entrée mise à jour!' });
      resetForm();
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la mise à jour' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cette entrée du planning?')) return;

    try {
      const res = await fetch(`/api/schedule/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete entry');

      setEntries(entries.filter(e => e.id !== id));
      setMessage({ type: 'success', text: 'Entrée supprimée!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la suppression' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Planning - {new Date(selectedDate).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</h2>
          <p className="text-slate-400 text-sm mt-1">Gérer le planning du jour</p>
        </div>
        {!showAddForm && !editingId && (
          <Button onClick={() => setShowAddForm(true)} className="bg-blue-600 hover:bg-blue-700">
            ➕ Nouvelle entrée
          </Button>
        )}
      </div>

      {/* Messages */}
      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-900/20 text-green-400' : 'bg-red-900/20 text-red-400'}`}>
          {message.text}
        </div>
      )}

      {/* Add/Edit Form */}
      {(showAddForm || editingId) && (
        <Card className="p-6 bg-slate-800 border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">
            {editingId ? 'Éditer l\'entrée' : 'Nouvelle entrée'}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Acteur *
              </label>
              <select
                value={formData.actorId}
                onChange={(e) => setFormData({ ...formData, actorId: e.target.value })}
                disabled={!!editingId}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none disabled:opacity-50"
              >
                <option value="">Choisir...</option>
                {actors.map(a => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Projet (optionnel)
              </label>
              <select
                value={formData.projectId}
                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="">Aucun projet</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Titre *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: Réunion client, Sport, Pause déjeuner..."
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Heure début *
              </label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Heure fin *
              </label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Description (optionnel)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Notes supplémentaires..."
                rows={2}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            {editingId ? (
              <>
                <Button
                  onClick={() => handleUpdate(editingId)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  💾 Sauvegarder
                </Button>
                <Button
                  onClick={resetForm}
                  className="bg-slate-600 hover:bg-slate-700"
                >
                  Annuler
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={handleAdd}
                  className="bg-green-600 hover:bg-green-700"
                >
                  ✅ Créer
                </Button>
                <Button
                  onClick={resetForm}
                  className="bg-slate-600 hover:bg-slate-700"
                >
                  Annuler
                </Button>
              </>
            )}
          </div>
        </Card>
      )}

      {/* Entries List */}
      <div className="space-y-3">
        {entries.length === 0 ? (
          <Card className="p-6 bg-slate-800 border-slate-700 text-center">
            <p className="text-slate-400">Aucune entrée pour cette date. Clique sur "Nouvelle entrée" pour en ajouter une.</p>
          </Card>
        ) : (
          entries.map(entry => (
            <Card key={entry.id} className="p-4 bg-slate-800 border-slate-700">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-blue-400 font-mono font-semibold">
                      {entry.startTime} - {entry.endTime}
                    </span>
                    <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">
                      {entry.actor.name}
                    </span>
                    {entry.project && (
                      <span className="text-xs bg-blue-900/30 text-blue-400 px-2 py-1 rounded">
                        {entry.project.name}
                      </span>
                    )}
                  </div>
                  <h3 className="text-white font-medium mb-1">{entry.title}</h3>
                  {entry.description && (
                    <p className="text-slate-400 text-sm">{entry.description}</p>
                  )}
                </div>

                <div className="flex gap-2 ml-4">
                  <Button
                    onClick={() => handleEdit(entry)}
                    className="bg-slate-600 hover:bg-slate-700 text-sm px-3 py-1"
                  >
                    ✏️ Éditer
                  </Button>
                  <Button
                    onClick={() => handleDelete(entry.id)}
                    className="bg-red-900/30 hover:bg-red-900/50 text-red-400 text-sm px-3 py-1"
                  >
                    🗑️
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
