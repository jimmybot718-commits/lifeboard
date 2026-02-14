"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Mail, Trash2, MessageCircle, ThumbsUp, ThumbsDown, Send } from "lucide-react";

type Email = {
  id: string;
  recipient: string;
  subject: string;
  body?: string;
  status: string;
  sentAt: string;
  repliedAt?: string;
  notes?: string;
};

type Stats = {
  total: number;
  sent: number;
  replied: number;
  interested: number;
  rejected: number;
};

export default function EmailList() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    sent: 0,
    replied: 0,
    interested: 0,
    rejected: 0,
  });
  const [filter, setFilter] = useState<string>("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEmail, setNewEmail] = useState({
    recipient: "",
    subject: "",
    body: "",
    notes: "",
  });

  const fetchEmails = async () => {
    const params = filter !== "all" ? `?status=${filter}` : "";
    const res = await fetch(`/api/emails${params}`);
    const data = await res.json();
    setEmails(data.emails || []);
    setStats(data.stats || stats);
  };

  useEffect(() => {
    fetchEmails();
  }, [filter]);

  const handleAddEmail = async () => {
    if (!newEmail.recipient || !newEmail.subject) return;

    await fetch("/api/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEmail),
    });

    setNewEmail({ recipient: "", subject: "", body: "", notes: "" });
    setShowAddForm(false);
    fetchEmails();
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    await fetch(`/api/emails/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchEmails();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Effacer cet email ?")) return;
    await fetch(`/api/emails/${id}`, { method: "DELETE" });
    fetchEmails();
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; label: string }> = {
      sent: { variant: "secondary", label: "Envoyé" },
      replied: { variant: "default", label: "Répondu" },
      interested: { variant: "default", label: "Intéressé" },
      rejected: { variant: "destructive", label: "Rejeté" },
      pending: { variant: "outline", label: "En attente" },
    };
    const config = variants[status] || variants.sent;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{stats.total}</CardTitle>
            <CardDescription>Total</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{stats.sent}</CardTitle>
            <CardDescription>Envoyés</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{stats.replied}</CardTitle>
            <CardDescription>Répondus</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{stats.interested}</CardTitle>
            <CardDescription>Intéressés</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{stats.rejected}</CardTitle>
            <CardDescription>Rejetés</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Filters & Add Button */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          onClick={() => setFilter("all")}
        >
          Tous
        </Button>
        <Button
          variant={filter === "sent" ? "default" : "outline"}
          onClick={() => setFilter("sent")}
        >
          Envoyés
        </Button>
        <Button
          variant={filter === "replied" ? "default" : "outline"}
          onClick={() => setFilter("replied")}
        >
          Répondus
        </Button>
        <Button
          variant={filter === "interested" ? "default" : "outline"}
          onClick={() => setFilter("interested")}
        >
          Intéressés
        </Button>
        <Button
          variant={filter === "rejected" ? "default" : "outline"}
          onClick={() => setFilter("rejected")}
        >
          Rejetés
        </Button>
        <div className="flex-1" />
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Mail className="w-4 h-4 mr-2" />
          Ajouter email
        </Button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Nouvel email partenariat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Destinataire *</Label>
              <Input
                placeholder="contact@entreprise.com ou Nom Entreprise"
                value={newEmail.recipient}
                onChange={(e) =>
                  setNewEmail({ ...newEmail, recipient: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Sujet *</Label>
              <Input
                placeholder="Partenariat - ..."
                value={newEmail.subject}
                onChange={(e) =>
                  setNewEmail({ ...newEmail, subject: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Corps de l'email</Label>
              <Textarea
                placeholder="Contenu de l'email..."
                value={newEmail.body}
                onChange={(e) =>
                  setNewEmail({ ...newEmail, body: e.target.value })
                }
                rows={4}
              />
            </div>
            <div>
              <Label>Notes</Label>
              <Input
                placeholder="Notes internes..."
                value={newEmail.notes}
                onChange={(e) =>
                  setNewEmail({ ...newEmail, notes: e.target.value })
                }
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddEmail}>
                <Send className="w-4 h-4 mr-2" />
                Enregistrer
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Annuler
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Email List */}
      <div className="space-y-4">
        {emails.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              Aucun email pour le moment
            </CardContent>
          </Card>
        ) : (
          emails.map((email) => (
            <Card key={email.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-lg">{email.recipient}</CardTitle>
                      {getStatusBadge(email.status)}
                    </div>
                    <CardDescription className="font-medium">
                      {email.subject}
                    </CardDescription>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(email.sentAt).toLocaleString("fr-FR")}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {email.body && (
                  <div className="text-sm whitespace-pre-wrap bg-muted/50 p-3 rounded">
                    {email.body}
                  </div>
                )}
                {email.notes && (
                  <div className="text-sm text-muted-foreground italic">
                    📝 {email.notes}
                  </div>
                )}
                {email.repliedAt && (
                  <div className="text-sm text-muted-foreground">
                    ✅ Répondu le {new Date(email.repliedAt).toLocaleString("fr-FR")}
                  </div>
                )}
                <div className="flex gap-2 flex-wrap">
                  {email.status !== "replied" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpdateStatus(email.id, "replied")}
                    >
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Répondu
                    </Button>
                  )}
                  {email.status !== "interested" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpdateStatus(email.id, "interested")}
                    >
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      Intéressé
                    </Button>
                  )}
                  {email.status !== "rejected" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpdateStatus(email.id, "rejected")}
                    >
                      <ThumbsDown className="w-4 h-4 mr-1" />
                      Rejeté
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(email.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Effacer
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
