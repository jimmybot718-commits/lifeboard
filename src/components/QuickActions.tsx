'use client'

import { useState } from 'react'
import { LoadingSpinner } from './ui/loading'
import { showToast } from './ui/toast'

type Actor = { id: number; label: string }
type Project = { id: number; name: string }

interface QuickActionsProps {
  actors: Actor[]
  projects: Project[]
}

export default function QuickActions({ actors, projects }: QuickActionsProps) {
  const [activeTab, setActiveTab] = useState<'work' | 'money'>('work')
  const [loading, setLoading] = useState(false)

  // Work form state
  const [workForm, setWorkForm] = useState({
    actorId: '',
    projectId: '',
    hours: '',
    description: '',
  })

  // Money form state
  const [moneyForm, setMoneyForm] = useState({
    amount: '',
    description: '',
    projectId: '',
  })

  const handleWorkSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/quick-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'work', ...workForm }),
      })

      if (!res.ok) throw new Error('Failed to log work')

      showToast(`${workForm.hours}h loggées avec succès!`, 'success')
      setWorkForm({ actorId: workForm.actorId, projectId: workForm.projectId, hours: '', description: '' })
      
      // Refresh page after delay
      setTimeout(() => window.location.reload(), 1500)
    } catch (error) {
      showToast('Erreur lors du logging des heures', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleMoneySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/quick-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'money', ...moneyForm }),
      })

      if (!res.ok) throw new Error('Failed to log money')

      showToast(`${moneyForm.amount} CHF ajoutés avec succès!`, 'success')
      setMoneyForm({ amount: '', description: '', projectId: moneyForm.projectId })
      
      // Refresh page after delay
      setTimeout(() => window.location.reload(), 1500)
    } catch (error) {
      showToast('Erreur lors du logging de l\'argent', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <h2 className="text-xl font-semibold mb-4">⚡ Quick Actions</h2>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab('work')}
          className={`px-4 py-2 rounded transition ${
            activeTab === 'work'
              ? 'bg-blue-500 text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          Logger Heures
        </button>
        <button
          onClick={() => setActiveTab('money')}
          className={`px-4 py-2 rounded transition ${
            activeTab === 'money'
              ? 'bg-green-500 text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          Logger Argent
        </button>
      </div>

      {/* Work Form */}
      {activeTab === 'work' && (
        <form onSubmit={handleWorkSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Qui?</label>
            <select
              value={workForm.actorId}
              onChange={(e) => setWorkForm({ ...workForm, actorId: e.target.value })}
              className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
              required
            >
              <option value="">Sélectionner...</option>
              {actors.map((actor) => (
                <option key={actor.id} value={actor.id}>
                  {actor.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Projet</label>
            <select
              value={workForm.projectId}
              onChange={(e) => setWorkForm({ ...workForm, projectId: e.target.value })}
              className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
              required
            >
              <option value="">Sélectionner...</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Heures</label>
            <input
              type="number"
              step="0.5"
              min="0"
              value={workForm.hours}
              onChange={(e) => setWorkForm({ ...workForm, hours: e.target.value })}
              className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
              placeholder="2.5"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description (optionnel)</label>
            <input
              type="text"
              value={workForm.description}
              onChange={(e) => setWorkForm({ ...workForm, description: e.target.value })}
              className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
              placeholder="Développement frontend..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <LoadingSpinner size="sm" />}
            {loading ? 'En cours...' : 'Logger Heures'}
          </button>
        </form>
      )}

      {/* Money Form */}
      {activeTab === 'money' && (
        <form onSubmit={handleMoneySubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Montant (CHF)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={moneyForm.amount}
              onChange={(e) => setMoneyForm({ ...moneyForm, amount: e.target.value })}
              className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
              placeholder="500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <input
              type="text"
              value={moneyForm.description}
              onChange={(e) => setMoneyForm({ ...moneyForm, description: e.target.value })}
              className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
              placeholder="Paiement client..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Projet (optionnel)</label>
            <select
              value={moneyForm.projectId}
              onChange={(e) => setMoneyForm({ ...moneyForm, projectId: e.target.value })}
              className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
            >
              <option value="">Non lié à un projet</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <LoadingSpinner size="sm" />}
            {loading ? 'En cours...' : 'Logger Argent'}
          </button>
        </form>
      )}
    </div>
  )
}
