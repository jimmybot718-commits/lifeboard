'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function KeyboardShortcuts() {
  const router = useRouter();
  const pathname = usePathname();
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ignore si dans un input/textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      // ? - Show shortcuts help
      if (e.key === '?' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        setShowHelp(true);
        return;
      }

      // Escape - Close help
      if (e.key === 'Escape' && showHelp) {
        e.preventDefault();
        setShowHelp(false);
        return;
      }

      // g + h - Go home
      if (e.key === 'h' && e.ctrlKey) {
        e.preventDefault();
        router.push('/');
        return;
      }

      // g + t - Go tasks
      if (e.key === 't' && e.ctrlKey) {
        e.preventDefault();
        router.push('/tasks');
        return;
      }

      // g + v - Go videos
      if (e.key === 'v' && e.ctrlKey) {
        e.preventDefault();
        router.push('/videos');
        return;
      }

      // g + e - Go emails
      if (e.key === 'e' && e.ctrlKey) {
        e.preventDefault();
        router.push('/emails');
        return;
      }

      // g + s - Go stats
      if (e.key === 's' && e.ctrlKey) {
        e.preventDefault();
        router.push('/stats');
        return;
      }

      // g + p - Go projects
      if (e.key === 'p' && e.ctrlKey) {
        e.preventDefault();
        router.push('/projects');
        return;
      }

      // g + n - Go Nastia
      if (e.key === 'n' && e.ctrlKey) {
        e.preventDefault();
        router.push('/nastia');
        return;
      }

      // g + a - Go activity
      if (e.key === 'a' && e.ctrlKey) {
        e.preventDefault();
        router.push('/activity');
        return;
      }

      // g + c - Go schedule (calendar)
      if (e.key === 'c' && e.ctrlKey) {
        e.preventDefault();
        router.push('/schedule');
        return;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [router, showHelp]);

  if (!showHelp) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={() => setShowHelp(false)}
    >
      <div
        className="bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">⌨️ Keyboard Shortcuts</h2>
            <button
              onClick={() => setShowHelp(false)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Navigation */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Navigation</h3>
            <div className="space-y-2">
              <ShortcutItem shortcut="Ctrl + H" description="Homepage (Dashboard)" />
              <ShortcutItem shortcut="Ctrl + T" description="Tasks" />
              <ShortcutItem shortcut="Ctrl + V" description="Videos" />
              <ShortcutItem shortcut="Ctrl + E" description="Emails" />
              <ShortcutItem shortcut="Ctrl + S" description="Stats" />
              <ShortcutItem shortcut="Ctrl + P" description="Projects" />
              <ShortcutItem shortcut="Ctrl + N" description="Nastia Dashboard" />
              <ShortcutItem shortcut="Ctrl + A" description="Activity Timeline" />
              <ShortcutItem shortcut="Ctrl + C" description="Schedule (Calendar)" />
            </div>
          </div>

          {/* General */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">General</h3>
            <div className="space-y-2">
              <ShortcutItem shortcut="?" description="Show this help" />
              <ShortcutItem shortcut="Esc" description="Close modals / Clear focus" />
            </div>
          </div>

          {/* Tips */}
          <div className="bg-slate-700/50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-emerald-400 mb-2">💡 Pro Tips</h3>
            <ul className="text-sm text-slate-300 space-y-1">
              <li>• Shortcuts work globally except when typing in forms</li>
              <li>• Press <kbd className="px-2 py-1 bg-slate-900 rounded text-xs">?</kbd> anytime to see this help</li>
              <li>• On Mac: Use Cmd instead of Ctrl</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function ShortcutItem({ shortcut, description }: { shortcut: string; description: string }) {
  return (
    <div className="flex items-center justify-between py-2 px-3 bg-slate-700/30 rounded hover:bg-slate-700/50 transition-colors">
      <span className="text-slate-300">{description}</span>
      <kbd className="px-3 py-1 bg-slate-900 text-slate-300 rounded font-mono text-sm border border-slate-700">
        {shortcut}
      </kbd>
    </div>
  );
}
