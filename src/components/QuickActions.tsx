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
  const [isExpanded, setIsExpanded] = useState(false)

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

      showToast(`${workForm.hours}h logged successfully!`, 'success')
      setWorkForm({ actorId: workForm.actorId, projectId: workForm.projectId, hours: '', description: '' })

      setTimeout(() => window.location.reload(), 1500)
    } catch {
      showToast('Error logging hours', 'error')
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

      showToast(`${moneyForm.amount} CHF added successfully!`, 'success')
      setMoneyForm({ amount: '', description: '', projectId: moneyForm.projectId })

      setTimeout(() => window.location.reload(), 1500)
    } catch {
      showToast('Error logging money', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass-card overflow-hidden">
      {/* Header - Always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-cyan/20 to-neon-blue/20 border border-neon-cyan/30 flex items-center justify-center">
            <span className="text-neon-cyan">⚡</span>
          </div>
          <div className="text-left">
            <h2 className="text-lg font-semibold">Quick Actions</h2>
            <p className="text-sm text-white/40">Log hours or income</p>
          </div>
        </div>
        <div className={`w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
          <svg className="w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Expandable Content */}
      <div className={`transition-all duration-300 ease-out ${isExpanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="px-5 pb-5 border-t border-white/[0.05]">
          {/* Tabs */}
          <div className="flex gap-2 py-4">
            <button
              onClick={() => setActiveTab('work')}
              className={`
                flex-1 py-3 rounded-xl font-medium text-sm transition-all
                ${activeTab === 'work'
                  ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30'
                  : 'bg-white/[0.03] text-white/50 border border-white/[0.05] hover:bg-white/[0.05]'
                }
              `}
            >
              Log Hours
            </button>
            <button
              onClick={() => setActiveTab('money')}
              className={`
                flex-1 py-3 rounded-xl font-medium text-sm transition-all
                ${activeTab === 'money'
                  ? 'bg-neon-green/20 text-neon-green border border-neon-green/30'
                  : 'bg-white/[0.03] text-white/50 border border-white/[0.05] hover:bg-white/[0.05]'
                }
              `}
            >
              Log Income
            </button>
          </div>

          {/* Work Form */}
          {activeTab === 'work' && (
            <form onSubmit={handleWorkSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2">
                    Who
                  </label>
                  <select
                    value={workForm.actorId}
                    onChange={(e) => setWorkForm({ ...workForm, actorId: e.target.value })}
                    className="input-dark w-full"
                    required
                  >
                    <option value="">Select...</option>
                    {actors.map((actor) => (
                      <option key={actor.id} value={actor.id}>
                        {actor.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2">
                    Project
                  </label>
                  <select
                    value={workForm.projectId}
                    onChange={(e) => setWorkForm({ ...workForm, projectId: e.target.value })}
                    className="input-dark w-full"
                    required
                  >
                    <option value="">Select...</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2">
                    Hours
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={workForm.hours}
                    onChange={(e) => setWorkForm({ ...workForm, hours: e.target.value })}
                    className="input-dark w-full"
                    placeholder="2.5"
                    required
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2">
                    Description (optional)
                  </label>
                  <input
                    type="text"
                    value={workForm.description}
                    onChange={(e) => setWorkForm({ ...workForm, description: e.target.value })}
                    className="input-dark w-full"
                    placeholder="What did you work on?"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-solid-cyan w-full flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading && <LoadingSpinner size="sm" />}
                {loading ? 'Logging...' : 'Log Hours'}
              </button>
            </form>
          )}

          {/* Money Form */}
          {activeTab === 'money' && (
            <form onSubmit={handleMoneySubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2">
                    Amount (CHF)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={moneyForm.amount}
                    onChange={(e) => setMoneyForm({ ...moneyForm, amount: e.target.value })}
                    className="input-dark w-full"
                    placeholder="500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2">
                    Project (optional)
                  </label>
                  <select
                    value={moneyForm.projectId}
                    onChange={(e) => setMoneyForm({ ...moneyForm, projectId: e.target.value })}
                    className="input-dark w-full"
                  >
                    <option value="">Not linked</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2">
                  Description
                </label>
                <input
                  type="text"
                  value={moneyForm.description}
                  onChange={(e) => setMoneyForm({ ...moneyForm, description: e.target.value })}
                  className="input-dark w-full"
                  placeholder="Client payment, sponsorship..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-semibold text-sm transition-all bg-gradient-to-r from-neon-green to-neon-cyan text-carbon-950 hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <LoadingSpinner size="sm" />}
                {loading ? 'Logging...' : 'Log Income'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
