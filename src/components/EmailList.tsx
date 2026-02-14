'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Mail, Send, CheckCircle2, Star, X, Trash2 } from 'lucide-react'
import { showToast } from './ui/toast'

type EmailStatus = 'sent' | 'replied' | 'interested' | 'rejected' | 'pending'

interface PartnershipEmail {
  id: string
  recipient: string
  subject: string
  body: string
  notes: string | null
  status: EmailStatus
  sentAt: string
  repliedAt: string | null
  createdAt: string
}

const statusLabels: Record<EmailStatus, string> = {
  sent: 'Envoyé',
  replied: 'Répondu',
  interested: 'Intéressé',
  rejected: 'Rejeté',
  pending: 'En attente'
}

const statusColors: Record<EmailStatus, string> = {
  sent: 'bg-blue-100 text-blue-800',
  replied: 'bg-green-100 text-green-800',
  interested: 'bg-purple-100 text-purple-800',
  rejected: 'bg-red-100 text-red-800',
  pending: 'bg-gray-100 text-gray-800'
}

export default function EmailList() {
  const [emails, setEmails] = useState<PartnershipEmail[]>([])
  const [filter, setFilter] = useState<EmailStatus | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  
  // Form state
  const [recipient, setRecipient] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [notes, setNotes] = useState('')

  const fetchEmails = async () => {
    const url = filter === 'all' ? '/api/emails' : `/api/emails?status=${filter}`
    const res = await fetch(url)
    const data = await res.json()
    setEmails(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchEmails()
  }, [filter])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await fetch('/api/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipient, subject, body, notes: notes || null })
      })
      showToast('Email ajouté avec succès', 'success')
      setRecipient('')
      setSubject('')
      setBody('')
      setNotes('')
      fetchEmails()
    } catch (error) {
      showToast('Erreur lors de l\'ajout de l\'email', 'error')
    }
  }

  const updateStatus = async (id: string, status: EmailStatus) => {
    try {
      await fetch(`/api/emails/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      showToast('Statut de l\'email mis à jour', 'success')
      fetchEmails()
    } catch (error) {
      showToast('Erreur lors de la mise à jour', 'error')
    }
  }

  const deleteEmail = async (id: string) => {
    try {
      await fetch(`/api/emails/${id}`, { method: 'DELETE' })
      showToast('Email supprimé', 'success')
      fetchEmails()
    } catch (error) {
      showToast('Erreur lors de la suppression', 'error')
    }
  }

  // Client-side filtering by search query
  const filteredEmails = emails.filter((email) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      email.recipient.toLowerCase().includes(query) ||
      email.subject.toLowerCase().includes(query) ||
      email.body.toLowerCase().includes(query) ||
      email.notes?.toLowerCase().includes(query)
    );
  });

  const stats = {
    total: filteredEmails.length,
    sent: filteredEmails.filter(e => e.status === 'sent').length,
    replied: filteredEmails.filter(e => e.status === 'replied').length,
    interested: filteredEmails.filter(e => e.status === 'interested').length,
    rejected: filteredEmails.filter(e => e.status === 'rejected').length
  }

  if (loading) return <div>Chargement...</div>

  return (
    <div className="space-y-6">
      {/* Search bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Rechercher par destinataire, sujet, message, notes..."
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

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-gray-500">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{stats.sent}</div>
            <div className="text-sm text-gray-500">Envoyés</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{stats.replied}</div>
            <div className="text-sm text-gray-500">Répondus</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-purple-600">{stats.interested}</div>
            <div className="text-sm text-gray-500">Intéressés</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            <div className="text-sm text-gray-500">Rejetés</div>
          </CardContent>
        </Card>
      </div>

      {/* Add Email Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="w-5 h-5" />
            Nouvel Email Partenariat
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="recipient">Destinataire</Label>
                <Input
                  id="recipient"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="nom@entreprise.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Sujet</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Proposition de partenariat..."
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="body">Message</Label>
              <textarea
                id="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="flex min-h-[100px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Corps du message..."
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optionnel)</Label>
              <Input
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notes privées..."
              />
            </div>
            <Button type="submit">
              <Send className="w-4 h-4 mr-2" />
              Enregistrer l'email
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2">
            <Label>Filtrer:</Label>
            <Select value={filter} onChange={(e) => setFilter(e.target.value as EmailStatus | 'all')}>
              <option value="all">Tous</option>
              <option value="sent">Envoyés</option>
              <option value="replied">Répondus</option>
              <option value="interested">Intéressés</option>
              <option value="rejected">Rejetés</option>
              <option value="pending">En attente</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Email List */}
      <div className="space-y-4">
        {filteredEmails.map((email) => (
          <Card key={email.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="font-semibold">{email.recipient}</span>
                    <Badge className={statusColors[email.status]}>
                      {statusLabels[email.status]}
                    </Badge>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">{email.subject}</div>
                    <div className="text-gray-600 mt-1 whitespace-pre-wrap">{email.body}</div>
                    {email.notes && (
                      <div className="mt-2 text-gray-500 italic">Notes: {email.notes}</div>
                    )}
                  </div>
                  <div className="text-xs text-gray-400">
                    Envoyé: {new Date(email.sentAt).toLocaleDateString('fr-FR')}
                    {email.repliedAt && ` • Répondu: ${new Date(email.repliedAt).toLocaleDateString('fr-FR')}`}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {email.status === 'sent' && (
                    <>
                      <Button size="sm" variant="outline" onClick={() => updateStatus(email.id, 'replied')}>
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        Répondu
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => updateStatus(email.id, 'interested')}>
                        <Star className="w-4 h-4 mr-1" />
                        Intéressé
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => updateStatus(email.id, 'rejected')}>
                        <X className="w-4 h-4 mr-1" />
                        Rejeté
                      </Button>
                    </>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteEmail(email.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Effacer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredEmails.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center text-gray-500">
              {searchQuery ? `Aucun email trouvé pour "${searchQuery}"` : 'Aucun email trouvé'}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
