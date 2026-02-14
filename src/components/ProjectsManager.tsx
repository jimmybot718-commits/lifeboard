'use client';

import { useState, useEffect } from 'react';

type Project = {
  id: number;
  name: string;
  description: string | null;
  progress: number;
  status: string;
  createdAt: string;
};

export default function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    progress: 0,
    status: 'active',
  });

  // Edit state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<{
    name: string;
    description: string;
    progress: number;
    status: string;
  } | null>(null);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      if (!res.ok) throw new Error('Failed to fetch projects');
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to create project');

      setSuccess('Projet créé!');
      setFormData({ name: '', description: '', progress: 0, status: 'active' });
      setShowForm(false);
      fetchProjects();
    } catch (err) {
      setError('Erreur lors de la création');
    }
  };

  const startEdit = (project: Project) => {
    setEditingId(project.id);
    setEditData({
      name: project.name,
      description: project.description || '',
      progress: project.progress,
      status: project.status,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData(null);
  };

  const handleUpdate = async (id: number) => {
    if (!editData) return;
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });

      if (!res.ok) throw new Error('Failed to update project');

      setSuccess('Projet mis à jour!');
      setEditingId(null);
      setEditData(null);
      fetchProjects();
    } catch (err) {
      setError('Erreur lors de la mise à jour');
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Supprimer le projet "${name}" ?`)) return;
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete project');

      setSuccess('Projet supprimé!');
      fetchProjects();
    } catch (err) {
      setError('Erreur lors de la suppression');
    }
  };

  if (loading) return <div className="text-slate-400">Chargement...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Projets</h1>
          <p className="text-slate-400 mt-1">
            Gérer vos projets actifs et archivés
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          {showForm ? 'Annuler' : '+ Nouveau Projet'}
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div className="p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-300">
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 bg-green-900/30 border border-green-700 rounded-lg text-green-300">
          {success}
        </div>
      )}

      {/* Create Form */}
      {showForm && (
        <form onSubmit={handleCreate} className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Nom du projet *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="ex: TradePilot"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Description du projet..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Progression (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.progress}
                onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Statut
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Actif</option>
                <option value="paused">En pause</option>
                <option value="completed">Terminé</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Créer le projet
          </button>
        </form>
      )}

      {/* Projects List */}
      <div className="space-y-4">
        {projects.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            Aucun projet. Créez-en un pour commencer!
          </div>
        ) : (
          projects.map((project) => (
            <div
              key={project.id}
              className="bg-slate-800/50 p-6 rounded-lg border border-slate-700"
            >
              {editingId === project.id && editData ? (
                // Edit Mode
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Nom
                    </label>
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={editData.description}
                      onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Progression (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={editData.progress}
                        onChange={(e) => setEditData({ ...editData, progress: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Statut
                      </label>
                      <select
                        value={editData.status}
                        onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="active">Actif</option>
                        <option value="paused">En pause</option>
                        <option value="completed">Terminé</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdate(project.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                      Sauvegarder
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">{project.name}</h3>
                      {project.description && (
                        <p className="text-slate-400 mt-1">{project.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(project)}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
                      >
                        Éditer
                      </button>
                      <button
                        onClick={() => handleDelete(project.id, project.name)}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Progression</span>
                      <span className="text-white font-medium">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-sm mt-4">
                      <span className="text-slate-400">Statut</span>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          project.status === 'active'
                            ? 'bg-green-900/30 text-green-400'
                            : project.status === 'paused'
                            ? 'bg-yellow-900/30 text-yellow-400'
                            : 'bg-blue-900/30 text-blue-400'
                        }`}
                      >
                        {project.status === 'active' ? 'Actif' : project.status === 'paused' ? 'En pause' : 'Terminé'}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 mt-2">
                      Créé le {new Date(project.createdAt).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
