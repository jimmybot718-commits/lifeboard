'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

type DateRange = {
  from: Date | null;
  to: Date | null;
};

type Preset = 'all' | '7d' | '30d' | '90d' | 'custom';

type DateRangeFilterProps = {
  onRangeChange: (range: DateRange) => void;
};

export default function DateRangeFilter({ onRangeChange }: DateRangeFilterProps) {
  const [preset, setPreset] = useState<Preset>('all');
  const [customFrom, setCustomFrom] = useState<string>('');
  const [customTo, setCustomTo] = useState<string>('');

  const handlePresetChange = (newPreset: Preset) => {
    setPreset(newPreset);

    if (newPreset === 'all') {
      onRangeChange({ from: null, to: null });
    } else if (newPreset === '7d') {
      const from = new Date();
      from.setDate(from.getDate() - 7);
      onRangeChange({ from, to: new Date() });
    } else if (newPreset === '30d') {
      const from = new Date();
      from.setDate(from.getDate() - 30);
      onRangeChange({ from, to: new Date() });
    } else if (newPreset === '90d') {
      const from = new Date();
      from.setDate(from.getDate() - 90);
      onRangeChange({ from, to: new Date() });
    }
  };

  const handleCustomApply = () => {
    if (!customFrom || !customTo) {
      alert('Veuillez sélectionner les deux dates');
      return;
    }

    const from = new Date(customFrom);
    const to = new Date(customTo);

    if (from > to) {
      alert('La date de début doit être avant la date de fin');
      return;
    }

    onRangeChange({ from, to });
  };

  return (
    <Card className="bg-slate-900 border-slate-800 mb-6">
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4">
          {/* Preset Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => handlePresetChange('all')}
              className={`${
                preset === 'all'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-slate-700 hover:bg-slate-600'
              }`}
            >
              Tout
            </Button>
            <Button
              onClick={() => handlePresetChange('7d')}
              className={`${
                preset === '7d'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-slate-700 hover:bg-slate-600'
              }`}
            >
              7 derniers jours
            </Button>
            <Button
              onClick={() => handlePresetChange('30d')}
              className={`${
                preset === '30d'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-slate-700 hover:bg-slate-600'
              }`}
            >
              30 derniers jours
            </Button>
            <Button
              onClick={() => handlePresetChange('90d')}
              className={`${
                preset === '90d'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-slate-700 hover:bg-slate-600'
              }`}
            >
              90 derniers jours
            </Button>
            <Button
              onClick={() => handlePresetChange('custom')}
              className={`${
                preset === 'custom'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-slate-700 hover:bg-slate-600'
              }`}
            >
              Personnalisé
            </Button>
          </div>

          {/* Custom Date Inputs */}
          {preset === 'custom' && (
            <div className="flex flex-wrap gap-2 items-end">
              <div className="flex-1 min-w-[150px]">
                <label className="text-sm text-slate-400 block mb-1">
                  Date de début
                </label>
                <Input
                  type="date"
                  value={customFrom}
                  onChange={(e) => setCustomFrom(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="text-sm text-slate-400 block mb-1">
                  Date de fin
                </label>
                <Input
                  type="date"
                  value={customTo}
                  onChange={(e) => setCustomTo(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <Button
                onClick={handleCustomApply}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Appliquer
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
