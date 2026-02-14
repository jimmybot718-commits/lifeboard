'use client';

import { useState, useEffect } from 'react';
import { Check, X, Loader2, Clock, AlertCircle, Trash2 } from 'lucide-react';
import { ErrorCard } from './ui/error';
import { LoadingCard } from './ui/loading';
import { showToast } from './ui/toast';

type Task = {
  id: string;
  type: string;
  title: string;
  description?: string;
  result?: string;
  status: string;
  actor: {
    label: string;
  };
  project?: {
    name: string;
  };
  createdAt: string;
  completedAt?: string;
};

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'done'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const url = filter === 'all' 
        ? '/api/tasks'
        : `/api/tasks?status=${filter}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch tasks');
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filter]);

  const updateTaskStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      showToast('Statut de la tâche mis à jour', 'success');
      fetchTasks();
    } catch (error) {
      console.error('Failed to update task:', error);
      showToast('Erreur lors de la mise à jour', 'error');
    }
  };

  const deleteTask = async (id: string) => {
    if (!confirm('Effacer cette tâche?')) return;
    try {
      await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      showToast('Tâche supprimée', 'success');
      fetchTasks();
    } catch (error) {
      console.error('Failed to delete task:', error);
      showToast('Erreur lors de la suppression', 'error');
    }
  };

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredTasks.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredTasks.map(t => t.id)));
    }
  };

  const deleteSelected = async () => {
    const count = selectedIds.size;
    if (count === 0) return;
    
    if (!confirm(`Supprimer ${count} tâche${count > 1 ? 's' : ''} sélectionnée${count > 1 ? 's' : ''}?`)) return;

    setIsDeleting(true);
    try {
      await Promise.all(
        Array.from(selectedIds).map(id =>
          fetch(`/api/tasks/${id}`, { method: 'DELETE' })
        )
      );
      showToast(`${count} tâche${count > 1 ? 's' : ''} supprimée${count > 1 ? 's' : ''}`, 'success');
      setSelectedIds(new Set());
      fetchTasks();
    } catch (error) {
      console.error('Failed to delete tasks:', error);
      showToast('Erreur lors de la suppression', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done':
        return <Check className="w-5 h-5 text-green-500" />;
      case 'in_progress':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done':
        return 'bg-green-100 border-green-300';
      case 'in_progress':
        return 'bg-blue-100 border-blue-300';
      case 'failed':
        return 'bg-red-100 border-red-300';
      default:
        return 'bg-gray-100 border-gray-300';
    }
  };

  if (loading) {
    return <LoadingCard title="Chargement des tâches..." />;
  }

  if (error) {
    return <ErrorCard message={error} retry={fetchTasks} />;
  }

  // Client-side filtering by search query
  const filteredTasks = tasks.filter((task) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      task.title.toLowerCase().includes(query) ||
      task.description?.toLowerCase().includes(query) ||
      task.actor.label.toLowerCase().includes(query) ||
      task.project?.name.toLowerCase().includes(query) ||
      task.type.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Rechercher par titre, description, acteur, projet..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 pl-10 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
        />
        <svg
          className="absolute left-3 top-2.5 w-5 h-5 text-slate-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between border-b border-slate-700 pb-2">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-slate-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Toutes
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'pending'
                ? 'bg-slate-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            En cours
          </button>
          <button
            onClick={() => setFilter('done')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'done'
                ? 'bg-slate-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Terminées
          </button>
        </div>

        {/* Bulk actions */}
        {filteredTasks.length > 0 && (
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedIds.size === filteredTasks.length && filteredTasks.length > 0}
                onChange={toggleSelectAll}
                className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-2 focus:ring-blue-500"
              />
              <span>Tout sélectionner</span>
            </label>
            
            {selectedIds.size > 0 && (
              <button
                onClick={deleteSelected}
                disabled={isDeleting}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isDeleting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                <span>Supprimer ({selectedIds.size})</span>
              </button>
            )}
          </div>
        )}
      </div>

      {filteredTasks.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          {searchQuery ? `Aucune tâche trouvée pour "${searchQuery}"` : `Aucune tâche ${filter !== 'all' ? filter : ''}`}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`border rounded-lg p-4 ${getStatusColor(task.status)} ${
                selectedIds.has(task.id) ? 'ring-2 ring-blue-500' : ''
              } transition-all`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(task.id)}
                    onChange={() => toggleSelection(task.id)}
                    className="mt-1 w-4 h-4 rounded border-gray-400 text-blue-500 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  />
                  {getStatusIcon(task.status)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{task.title}</h3>
                      <span className="text-xs px-2 py-1 bg-white rounded-full">
                        {task.type}
                      </span>
                    </div>
                    {task.description && (
                      <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                    )}
                    {task.result && (
                      <p className="text-sm text-gray-700 bg-white p-2 rounded mt-2">
                        <strong>Résultat:</strong> {task.result}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>{task.actor.label}</span>
                      {task.project && <span>• {task.project.name}</span>}
                      <span>• {new Date(task.createdAt).toLocaleString('fr-FR')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  {task.status === 'pending' && (
                    <button
                      onClick={() => updateTaskStatus(task.id, 'in_progress')}
                      className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Démarrer
                    </button>
                  )}
                  {task.status === 'in_progress' && (
                    <button
                      onClick={() => updateTaskStatus(task.id, 'done')}
                      className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Terminer
                    </button>
                  )}
                  {task.status !== 'done' && (
                    <button
                      onClick={() => updateTaskStatus(task.id, 'failed')}
                      className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Échoué
                    </button>
                  )}
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
