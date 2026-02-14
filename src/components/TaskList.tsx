'use client';

import { useState, useEffect } from 'react';
import { Check, X, Loader2, Clock, AlertCircle } from 'lucide-react';
import { ErrorCard } from './ui/error';
import { LoadingCard } from './ui/loading';

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
      fetchTasks();
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const deleteTask = async (id: string) => {
    if (!confirm('Effacer cette tâche?')) return;
    try {
      await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      fetchTasks();
    } catch (error) {
      console.error('Failed to delete task:', error);
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

  return (
    <div className="space-y-4">
      <div className="flex gap-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'all'
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Toutes
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'pending'
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          En cours
        </button>
        <button
          onClick={() => setFilter('done')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'done'
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Terminées
        </button>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          Aucune tâche {filter !== 'all' ? filter : ''}
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`border rounded-lg p-4 ${getStatusColor(task.status)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
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
