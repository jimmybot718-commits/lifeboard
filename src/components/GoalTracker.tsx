'use client';

import { useState, useEffect } from 'react';
import { showToast } from '@/components/ui/toast';
import { LoadingCard } from '@/components/ui/loading';
import { ErrorCard } from '@/components/ui/error';

interface Actor {
  id: string;
  name: string;
  label: string;
}

interface Goal {
  id: string;
  actorId: string;
  actor: Actor;
  type: string; // 'work_hours' | 'revenue'
  target: number;
  period: string;
  startDate: string;
  endDate: string;
  status: string;
  title: string;
  description?: string;
  createdAt: string;
}

interface GoalProgress {
  current: number;
  percentage: number;
}

export default function GoalTracker() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('active');
  const [progress, setProgress] = useState<Map<string, GoalProgress>>(new Map());
  const [actors, setActors] = useState<Actor[]>([]);
  
  // Form state
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    actorId: '',
    type: 'work_hours',
    target: '',
    period: 'weekly',
    startDate: '',
    endDate: '',
    title: '',
    description: '',
  });

  const fetchGoals = async () => {
    try {
      setLoading(true);
      setError(null);
      const filterParam = filter !== 'all' ? `?status=${filter}` : '';
      const res = await fetch(`/api/goals${filterParam}`);
      if (!res.ok) throw new Error('Failed to fetch goals');
      const data = await res.json();
      setGoals(data);
      
      // Calculate progress for each goal
      await calculateProgress(data);
    } catch (err) {
      setError('Failed to load goals');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchActors = async () => {
    try {
      const res = await fetch('/api/actors');
      if (!res.ok) throw new Error('Failed to fetch actors');
      const data = await res.json();
      setActors(data);
    } catch (err) {
      console.error('Failed to load actors:', err);
    }
  };

  const calculateProgress = async (goalsList: Goal[]) => {
    const progressMap = new Map<string, GoalProgress>();
    
    for (const goal of goalsList) {
      let current = 0;
      
      if (goal.type === 'work_hours') {
        // Fetch work logs for this period and actor
        const res = await fetch(`/api/worklogs?actorId=${goal.actorId}&from=${goal.startDate}&to=${goal.endDate}`);
        if (res.ok) {
          const logs = await res.json();
          current = logs.reduce((sum: number, log: any) => sum + log.hours, 0);
        }
      } else if (goal.type === 'revenue') {
        // Fetch money entries for this period
        const res = await fetch(`/api/money?type=income&from=${goal.startDate}&to=${goal.endDate}`);
        if (res.ok) {
          const entries = await res.json();
          current = entries.reduce((sum: number, entry: any) => sum + entry.amount, 0);
        }
      }
      
      const percentage = goal.target > 0 ? Math.min((current / goal.target) * 100, 100) : 0;
      progressMap.set(goal.id, { current, percentage });
    }
    
    setProgress(progressMap);
  };

  useEffect(() => {
    fetchGoals();
    fetchActors();
  }, [filter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.actorId || !formData.target || !formData.startDate || !formData.endDate || !formData.title) {
      showToast('Please fill all required fields', 'error');
      return;
    }

    try {
      const res = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to create goal');
      
      showToast('Goal created successfully', 'success');
      setShowForm(false);
      setFormData({
        actorId: '',
        type: 'work_hours',
        target: '',
        period: 'weekly',
        startDate: '',
        endDate: '',
        title: '',
        description: '',
      });
      fetchGoals();
    } catch (err) {
      showToast('Failed to create goal', 'error');
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this goal?')) return;

    try {
      const res = await fetch(`/api/goals/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete goal');
      
      showToast('Goal deleted successfully', 'success');
      fetchGoals();
    } catch (err) {
      showToast('Failed to delete goal', 'error');
      console.error(err);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/goals/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Failed to update goal');
      
      showToast(`Goal marked as ${newStatus}`, 'success');
      fetchGoals();
    } catch (err) {
      showToast('Failed to update goal', 'error');
      console.error(err);
    }
  };

  if (loading) return <LoadingCard />;
  if (error) return <ErrorCard message={error} onRetry={fetchGoals} />;

  const filteredGoals = goals;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">🎯 Goals</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
        >
          {showForm ? 'Cancel' : '+ New Goal'}
        </button>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'active', 'achieved', 'paused'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg transition-colors capitalize ${
              filter === f
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="p-6 bg-slate-800 rounded-lg border border-slate-700">
          <h2 className="text-xl font-semibold text-white mb-4">Create New Goal</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Actor *
                </label>
                <select
                  value={formData.actorId}
                  onChange={(e) => setFormData({ ...formData, actorId: e.target.value })}
                  className="w-full bg-slate-700 text-white border border-slate-600 rounded px-3 py-2"
                  required
                >
                  <option value="">Select Actor</option>
                  {actors.map((actor) => (
                    <option key={actor.id} value={actor.id}>
                      {actor.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full bg-slate-700 text-white border border-slate-600 rounded px-3 py-2"
                  required
                >
                  <option value="work_hours">Work Hours</option>
                  <option value="revenue">Revenue (CHF)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Target {formData.type === 'work_hours' ? 'Hours' : 'CHF'} *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.target}
                  onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                  className="w-full bg-slate-700 text-white border border-slate-600 rounded px-3 py-2"
                  placeholder="e.g. 40"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Period *
                </label>
                <select
                  value={formData.period}
                  onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                  className="w-full bg-slate-700 text-white border border-slate-600 rounded px-3 py-2"
                  required
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full bg-slate-700 text-white border border-slate-600 rounded px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  End Date *
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full bg-slate-700 text-white border border-slate-600 rounded px-3 py-2"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-slate-700 text-white border border-slate-600 rounded px-3 py-2"
                placeholder="e.g. Sprint final LifeBoard"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-slate-700 text-white border border-slate-600 rounded px-3 py-2"
                rows={3}
                placeholder="Optional notes about this goal..."
              />
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
            >
              Create Goal
            </button>
          </form>
        </div>
      )}

      {/* Goals List */}
      {filteredGoals.length === 0 ? (
        <div className="p-8 text-center text-slate-400 bg-slate-800 rounded-lg border border-slate-700">
          No goals found. Create your first goal to start tracking progress!
        </div>
      ) : (
        <div className="space-y-4">
          {filteredGoals.map((goal) => {
            const prog = progress.get(goal.id) || { current: 0, percentage: 0 };
            const isAchieved = prog.percentage >= 100;

            return (
              <div
                key={goal.id}
                className="p-6 bg-slate-800 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white">{goal.title}</h3>
                    <p className="text-sm text-slate-400 mt-1">
                      {goal.actor.label} • {goal.period.charAt(0).toUpperCase() + goal.period.slice(1)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {goal.status === 'active' && isAchieved && (
                      <button
                        onClick={() => handleStatusChange(goal.id, 'achieved')}
                        className="px-3 py-1 text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors"
                      >
                        ✓ Mark Achieved
                      </button>
                    )}
                    {goal.status === 'active' && (
                      <button
                        onClick={() => handleStatusChange(goal.id, 'paused')}
                        className="px-3 py-1 text-sm bg-amber-600 hover:bg-amber-700 text-white rounded transition-colors"
                      >
                        Pause
                      </button>
                    )}
                    {goal.status === 'paused' && (
                      <button
                        onClick={() => handleStatusChange(goal.id, 'active')}
                        className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                      >
                        Resume
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(goal.id)}
                      className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Description */}
                {goal.description && (
                  <p className="text-slate-300 mb-4">{goal.description}</p>
                )}

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">
                      {goal.type === 'work_hours' ? 'Hours' : 'Revenue'}
                    </span>
                    <span className="text-white font-semibold">
                      {prog.current.toFixed(goal.type === 'revenue' ? 2 : 1)} / {goal.target.toFixed(goal.type === 'revenue' ? 2 : 0)} {goal.type === 'revenue' ? 'CHF' : 'h'}
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isAchieved ? 'bg-emerald-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${prog.percentage}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className={`font-semibold ${isAchieved ? 'text-emerald-500' : 'text-blue-500'}`}>
                      {prog.percentage.toFixed(1)}%
                    </span>
                    <span className="text-slate-400">
                      {new Date(goal.startDate).toLocaleDateString('fr-FR')} → {new Date(goal.endDate).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="mt-4">
                  <span
                    className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                      goal.status === 'active'
                        ? 'bg-emerald-900 text-emerald-300'
                        : goal.status === 'achieved'
                        ? 'bg-blue-900 text-blue-300'
                        : goal.status === 'paused'
                        ? 'bg-amber-900 text-amber-300'
                        : 'bg-red-900 text-red-300'
                    }`}
                  >
                    {goal.status.toUpperCase()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
