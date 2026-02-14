'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import StatsCharts from '@/components/StatsCharts';
import DateRangeFilter from '@/components/DateRangeFilter';

type Actor = {
  id: string;
  name: string;
  label: string;
};

type Project = {
  id: string;
  name: string;
};

type WorkLog = {
  id: string;
  date: Date;
  hours: number;
  notes: string | null;
  actor: Actor;
  project: Project | null;
};

type MoneyEntry = {
  id: string;
  date: Date;
  amount: number;
  description: string | null;
  project: Project | null;
};

type StatsViewProps = {
  initialWorkLogs: WorkLog[];
  initialMoneyEntries: MoneyEntry[];
};

export default function StatsView({ initialWorkLogs, initialMoneyEntries }: StatsViewProps) {
  const [workLogs, setWorkLogs] = useState(initialWorkLogs);
  const [moneyEntries, setMoneyEntries] = useState(initialMoneyEntries);
  const [editingWork, setEditingWork] = useState<string | null>(null);
  const [editingMoney, setEditingMoney] = useState<string | null>(null);
  const [editHours, setEditHours] = useState<number>(0);
  const [editAmount, setEditAmount] = useState<number>(0);
  const [editDescription, setEditDescription] = useState<string>('');
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({
    from: null,
    to: null,
  });

  // Filter data based on date range
  const filterByDateRange = <T extends { date: Date }>(items: T[]): T[] => {
    if (!dateRange.from || !dateRange.to) return items;
    
    return items.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= dateRange.from! && itemDate <= dateRange.to!;
    });
  };

  const filteredWorkLogs = filterByDateRange(workLogs);
  const filteredMoneyEntries = filterByDateRange(moneyEntries);

  // Calculate totals (using filtered data)
  const totalHours = filteredWorkLogs.reduce((sum, log) => sum + log.hours, 0);
  const totalMoney = filteredMoneyEntries.reduce((sum, entry) => sum + entry.amount, 0);

  // Group by actor (using filtered data)
  const hoursByActor = filteredWorkLogs.reduce((acc, log) => {
    const name = log.actor.name;
    acc[name] = (acc[name] || 0) + log.hours;
    return acc;
  }, {} as Record<string, number>);

  // Group by project (using filtered data)
  const hoursByProject = filteredWorkLogs.reduce((acc, log) => {
    if (log.project) {
      const name = log.project.name;
      acc[name] = (acc[name] || 0) + log.hours;
    }
    return acc;
  }, {} as Record<string, number>);

  const moneyByProject = filteredMoneyEntries.reduce((acc, entry) => {
    if (entry.project) {
      const name = entry.project.name;
      acc[name] = (acc[name] || 0) + entry.amount;
    }
    return acc;
  }, {} as Record<string, number>);

  const handleDeleteWork = async (id: string) => {
    if (!confirm('Supprimer cette entrée ?')) return;
    
    try {
      const res = await fetch(`/api/worklogs/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      setWorkLogs(workLogs.filter(log => log.id !== id));
    } catch (error) {
      alert('Erreur lors de la suppression');
    }
  };

  const handleDeleteMoney = async (id: string) => {
    if (!confirm('Supprimer cette entrée ?')) return;
    
    try {
      const res = await fetch(`/api/money/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      setMoneyEntries(moneyEntries.filter(entry => entry.id !== id));
    } catch (error) {
      alert('Erreur lors de la suppression');
    }
  };

  const startEditWork = (log: WorkLog) => {
    setEditingWork(log.id);
    setEditHours(log.hours);
    setEditDescription(log.notes || '');
  };

  const startEditMoney = (entry: MoneyEntry) => {
    setEditingMoney(entry.id);
    setEditAmount(entry.amount);
    setEditDescription(entry.description || '');
  };

  const handleSaveWork = async (id: string) => {
    try {
      const res = await fetch(`/api/worklogs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hours: editHours,
          description: editDescription,
        }),
      });
      
      if (!res.ok) throw new Error('Failed to update');
      
      const updated = await res.json();
      setWorkLogs(workLogs.map(log => log.id === id ? updated : log));
      setEditingWork(null);
    } catch (error) {
      alert('Erreur lors de la mise à jour');
    }
  };

  const handleSaveMoney = async (id: string) => {
    try {
      const res = await fetch(`/api/money/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: editAmount,
          description: editDescription,
        }),
      });
      
      if (!res.ok) throw new Error('Failed to update');
      
      const updated = await res.json();
      setMoneyEntries(moneyEntries.map(entry => entry.id === id ? updated : entry));
      setEditingMoney(null);
    } catch (error) {
      alert('Erreur lors de la mise à jour');
    }
  };

  const handleExportCSV = () => {
    // Generate CSV content
    let csv = '';
    
    // Work Logs section
    csv += 'HEURES TRAVAILLÉES\n';
    csv += 'Date,Acteur,Projet,Heures,Notes\n';
    filteredWorkLogs.forEach(log => {
      const date = new Date(log.date).toLocaleDateString('fr-FR');
      const actor = log.actor.name;
      const project = log.project?.name || 'N/A';
      const hours = log.hours;
      const notes = (log.notes || '').replace(/,/g, ';'); // Replace commas to avoid CSV issues
      csv += `${date},${actor},${project},${hours},"${notes}"\n`;
    });
    
    csv += '\n';
    
    // Money Entries section
    csv += 'REVENUS\n';
    csv += 'Date,Projet,Montant (CHF),Description\n';
    filteredMoneyEntries.forEach(entry => {
      const date = new Date(entry.date).toLocaleDateString('fr-FR');
      const project = entry.project?.name || 'N/A';
      const amount = entry.amount.toFixed(2);
      const description = (entry.description || '').replace(/,/g, ';');
      csv += `${date},${project},${amount},"${description}"\n`;
    });
    
    csv += '\n';
    
    // Summary
    csv += 'RÉSUMÉ\n';
    csv += `Total Heures,${totalHours.toFixed(2)}\n`;
    csv += `Total Revenus (CHF),${totalMoney.toFixed(2)}\n`;
    
    // Create blob and download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    const fileName = `lifeboard-stats-${new Date().toISOString().split('T')[0]}.csv`;
    
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Statistiques & Historique</h1>
          <p className="text-slate-400">
            Vue complète des heures travaillées et revenus générés
          </p>
        </div>

        {/* Date Range Filter & Export */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="flex-1">
            <DateRangeFilter onRangeChange={setDateRange} />
          </div>
          <Button
            onClick={handleExportCSV}
            className="bg-emerald-600 hover:bg-emerald-700 text-white whitespace-nowrap"
          >
            📊 Export CSV
          </Button>
        </div>

        {/* Charts */}
        <StatsCharts workLogs={filteredWorkLogs} moneyEntries={filteredMoneyEntries} />

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Total Heures</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-emerald-400">
                {totalHours.toFixed(1)}h
              </div>
              <div className="mt-4 space-y-2">
                {Object.entries(hoursByActor).map(([actor, hours]) => (
                  <div key={actor} className="flex justify-between text-sm">
                    <span className="text-slate-300">{actor}</span>
                    <span className="text-slate-400">{hours.toFixed(1)}h</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Total Argent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-emerald-400">
                {totalMoney.toFixed(2)} CHF
              </div>
              <div className="mt-4 space-y-2">
                {Object.entries(moneyByProject).map(([project, amount]) => (
                  <div key={project} className="flex justify-between text-sm">
                    <span className="text-slate-300">{project}</span>
                    <span className="text-slate-400">{amount.toFixed(2)} CHF</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Work Logs */}
        <Card className="bg-slate-900 border-slate-800 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Historique Heures</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredWorkLogs.length === 0 ? (
                <p className="text-slate-400 text-center py-8">
                  Aucune entrée pour cette période
                </p>
              ) : (
                filteredWorkLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-4 bg-slate-800 rounded-lg"
                  >
                    {editingWork === log.id ? (
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            step="0.5"
                            value={editHours}
                            onChange={(e) => setEditHours(parseFloat(e.target.value))}
                            className="bg-slate-700 border-slate-600 text-white w-24"
                          />
                          <Input
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            placeholder="Description..."
                            className="bg-slate-700 border-slate-600 text-white flex-1"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleSaveWork(log.id)}
                            className="bg-emerald-600 hover:bg-emerald-700"
                          >
                            Sauvegarder
                          </Button>
                          <Button
                            onClick={() => setEditingWork(null)}
                            variant="outline"
                            className="border-slate-600 text-slate-300"
                          >
                            Annuler
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="bg-slate-700 text-white border-slate-600">
                              {log.actor.name}
                            </Badge>
                            {log.project && (
                              <Badge variant="outline" className="bg-slate-700 text-white border-slate-600">
                                {log.project.name}
                              </Badge>
                            )}
                          </div>
                          {log.notes && (
                            <p className="text-sm text-slate-300">{log.notes}</p>
                          )}
                          <p className="text-xs text-slate-500 mt-1">
                            {new Date(log.date).toLocaleDateString('fr-FR', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                        <div className="text-right flex items-center gap-3">
                          <div className="text-2xl font-bold text-emerald-400">
                            {log.hours}h
                          </div>
                          <div className="flex gap-1">
                            <Button
                              onClick={() => startEditWork(log)}
                              variant="outline"
                              size="sm"
                              className="border-slate-600 text-slate-300"
                            >
                              Éditer
                            </Button>
                            <Button
                              onClick={() => handleDeleteWork(log.id)}
                              variant="outline"
                              size="sm"
                              className="border-red-600 text-red-400 hover:bg-red-950"
                            >
                              Effacer
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Money Entries */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Historique Argent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredMoneyEntries.length === 0 ? (
                <p className="text-slate-400 text-center py-8">
                  Aucune entrée pour cette période
                </p>
              ) : (
                filteredMoneyEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-4 bg-slate-800 rounded-lg"
                  >
                    {editingMoney === entry.id ? (
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            step="0.01"
                            value={editAmount}
                            onChange={(e) => setEditAmount(parseFloat(e.target.value))}
                            className="bg-slate-700 border-slate-600 text-white w-32"
                          />
                          <Input
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            placeholder="Description..."
                            className="bg-slate-700 border-slate-600 text-white flex-1"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleSaveMoney(entry.id)}
                            className="bg-emerald-600 hover:bg-emerald-700"
                          >
                            Sauvegarder
                          </Button>
                          <Button
                            onClick={() => setEditingMoney(null)}
                            variant="outline"
                            className="border-slate-600 text-slate-300"
                          >
                            Annuler
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {entry.project && (
                              <Badge variant="outline" className="bg-slate-700 text-white border-slate-600">
                                {entry.project.name}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-300">{entry.description}</p>
                          <p className="text-xs text-slate-500 mt-1">
                            {new Date(entry.date).toLocaleDateString('fr-FR', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                        <div className="text-right flex items-center gap-3">
                          <div className="text-2xl font-bold text-emerald-400">
                            {entry.amount.toFixed(2)} CHF
                          </div>
                          <div className="flex gap-1">
                            <Button
                              onClick={() => startEditMoney(entry)}
                              variant="outline"
                              size="sm"
                              className="border-slate-600 text-slate-300"
                            >
                              Éditer
                            </Button>
                            <Button
                              onClick={() => handleDeleteMoney(entry.id)}
                              variant="outline"
                              size="sm"
                              className="border-red-600 text-red-400 hover:bg-red-950"
                            >
                              Effacer
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Back to Dashboard */}
        <div className="mt-8 text-center">
          <a
            href="/"
            className="text-slate-400 hover:text-white transition-colors"
          >
            ← Retour au Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
