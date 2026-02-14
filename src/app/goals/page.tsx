import GoalTracker from '@/components/GoalTracker';

export const dynamic = 'force-dynamic';

export default function GoalsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <GoalTracker />
      </div>
    </div>
  );
}
