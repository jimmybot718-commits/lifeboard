import Header from '@/components/Header'

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold text-white mb-2">Guide d'utilisation</h1>
        <p className="text-slate-400 mb-8">Tout ce que vous devez savoir sur LifeBoard</p>

        {/* Quick Start */}
        <section className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-emerald-400 mb-4 flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Démarrage Rapide
          </h2>
          <div className="space-y-3 text-slate-300">
            <p><strong className="text-white">1. Dashboard</strong> - Vue d'ensemble de votre journée (planning, stats, projets)</p>
            <p><strong className="text-white">2. Quick Actions</strong> - Loggez vos heures et revenus en 2 clics depuis le dashboard</p>
            <p><strong className="text-white">3. Navigation</strong> - Utilisez les raccourcis clavier (appuyez sur <kbd className="px-2 py-1 bg-slate-700 rounded text-xs">?</kbd>) ou le menu</p>
            <p><strong className="text-white">4. Mobile</strong> - Installez l'app sur votre téléphone (menu → "Ajouter à l'écran d'accueil")</p>
          </div>
        </section>

        {/* Features Overview */}
        <section className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-blue-400 mb-4 flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Fonctionnalités Principales
          </h2>
          
          <div className="space-y-4">
            {/* Planning */}
            <div className="border-l-4 border-emerald-500 pl-4">
              <h3 className="text-lg font-semibold text-white mb-2">📅 Planning</h3>
              <p className="text-slate-300 text-sm mb-2">Gérez votre emploi du temps et celui de Nastia.</p>
              <ul className="text-slate-400 text-sm space-y-1 ml-4">
                <li>• Créez des entrées avec acteur, projet, heures, description</li>
                <li>• Éditez inline directement depuis la liste</li>
                <li>• Vue quotidienne sur le dashboard</li>
              </ul>
            </div>

            {/* Tasks */}
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-lg font-semibold text-white mb-2">✅ Tâches</h3>
              <p className="text-slate-300 text-sm mb-2">Suivez vos actions et leur progression.</p>
              <ul className="text-slate-400 text-sm space-y-1 ml-4">
                <li>• États: En attente, En cours, Terminé, Échoué</li>
                <li>• Filtres: Toutes / En cours / Terminées</li>
                <li>• Recherche par titre, description, acteur, projet</li>
                <li>• Bulk delete: sélection multiple et suppression en masse</li>
              </ul>
            </div>

            {/* Videos */}
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="text-lg font-semibold text-white mb-2">🎬 Vidéos Instagram</h3>
              <p className="text-slate-300 text-sm mb-2">Organisez vos vidéos pour Alex et Nastia.</p>
              <ul className="text-slate-400 text-sm space-y-1 ml-4">
                <li>• Stockez URLs, titres, descriptions</li>
                <li>• Status: Draft (brouillon) ou Posted (publié)</li>
                <li>• Filtres: Toutes / Nastia / Alex</li>
                <li>• Bulk delete: suppression multiple</li>
              </ul>
            </div>

            {/* Emails */}
            <div className="border-l-4 border-cyan-500 pl-4">
              <h3 className="text-lg font-semibold text-white mb-2">📧 Emails Partenariats</h3>
              <p className="text-slate-300 text-sm mb-2">Trackez vos emails de prospection.</p>
              <ul className="text-slate-400 text-sm space-y-1 ml-4">
                <li>• Log: destinataire, sujet, corps, notes</li>
                <li>• Status: Envoyé, Répondu, Intéressé, Rejeté, En attente</li>
                <li>• Stats: compteurs par status</li>
                <li>• Bulk delete: nettoyage rapide</li>
              </ul>
            </div>

            {/* Stats */}
            <div className="border-l-4 border-amber-500 pl-4">
              <h3 className="text-lg font-semibold text-white mb-2">📊 Statistiques</h3>
              <p className="text-slate-300 text-sm mb-2">Analysez votre temps et vos revenus.</p>
              <ul className="text-slate-400 text-sm space-y-1 ml-4">
                <li>• Charts: évolution heures et argent par jour</li>
                <li>• Filtres date: 7j, 30j, 90j, ou personnalisé</li>
                <li>• Breakdown: par acteur et par projet</li>
                <li>• Export CSV: pour comptabilité externe</li>
                <li>• Édition/suppression des entrées</li>
              </ul>
            </div>

            {/* Projects */}
            <div className="border-l-4 border-rose-500 pl-4">
              <h3 className="text-lg font-semibold text-white mb-2">🔨 Projets</h3>
              <p className="text-slate-300 text-sm mb-2">Gérez vos projets avec suivi de progression.</p>
              <ul className="text-slate-400 text-sm space-y-1 ml-4">
                <li>• Créez: nom, description, progress %, status</li>
                <li>• Status: Actif, En pause, Terminé</li>
                <li>• Progress bar visuelle</li>
                <li>• Édition inline complète</li>
              </ul>
            </div>

            {/* Goals */}
            <div className="border-l-4 border-yellow-500 pl-4">
              <h3 className="text-lg font-semibold text-white mb-2">🎯 Objectifs</h3>
              <p className="text-slate-300 text-sm mb-2">Définissez et suivez vos objectifs.</p>
              <ul className="text-slate-400 text-sm space-y-1 ml-4">
                <li>• Types: Heures de travail ou Revenus</li>
                <li>• Périodes: Quotidien, Hebdomadaire, Mensuel</li>
                <li>• Progress temps réel: calcul automatique</li>
                <li>• Actions: Pause, Resume, Mark achieved</li>
              </ul>
            </div>

            {/* Nastia */}
            <div className="border-l-4 border-pink-500 pl-4">
              <h3 className="text-lg font-semibold text-white mb-2">🎬 Nastia Dashboard</h3>
              <p className="text-slate-300 text-sm mb-2">Vue centralisée pour gérer Nastia.</p>
              <ul className="text-slate-400 text-sm space-y-1 ml-4">
                <li>• Planning de la semaine (filtré Nastia)</li>
                <li>• Vidéos récentes avec status</li>
                <li>• Heures de travail (30 derniers jours)</li>
                <li>• Accès rapide à toutes les ressources</li>
              </ul>
            </div>

            {/* Activity */}
            <div className="border-l-4 border-indigo-500 pl-4">
              <h3 className="text-lg font-semibold text-white mb-2">📜 Activity Timeline</h3>
              <p className="text-slate-300 text-sm mb-2">Fil d'actualité unifié de toutes vos activités.</p>
              <ul className="text-slate-400 text-sm space-y-1 ml-4">
                <li>• Vue chronologique: 7 derniers jours</li>
                <li>• Toutes activités: tasks, heures, revenus, vidéos, emails</li>
                <li>• Filtres par type (cliquable depuis les stats cards)</li>
                <li>• Quick recap quotidien ou hebdomadaire</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Keyboard Shortcuts */}
        <section className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-purple-400 mb-4 flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            Raccourcis Clavier
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-white font-semibold mb-3">Navigation</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Dashboard</span>
                  <kbd className="px-2 py-1 bg-slate-700 rounded text-slate-300">Ctrl + H</kbd>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Tasks</span>
                  <kbd className="px-2 py-1 bg-slate-700 rounded text-slate-300">Ctrl + T</kbd>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Videos</span>
                  <kbd className="px-2 py-1 bg-slate-700 rounded text-slate-300">Ctrl + V</kbd>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Emails</span>
                  <kbd className="px-2 py-1 bg-slate-700 rounded text-slate-300">Ctrl + E</kbd>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Stats</span>
                  <kbd className="px-2 py-1 bg-slate-700 rounded text-slate-300">Ctrl + S</kbd>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-3">Plus</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Projects</span>
                  <kbd className="px-2 py-1 bg-slate-700 rounded text-slate-300">Ctrl + P</kbd>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Nastia</span>
                  <kbd className="px-2 py-1 bg-slate-700 rounded text-slate-300">Ctrl + N</kbd>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Activity</span>
                  <kbd className="px-2 py-1 bg-slate-700 rounded text-slate-300">Ctrl + A</kbd>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Schedule</span>
                  <kbd className="px-2 py-1 bg-slate-700 rounded text-slate-300">Ctrl + C</kbd>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Goals</span>
                  <kbd className="px-2 py-1 bg-slate-700 rounded text-slate-300">Ctrl + G</kbd>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-slate-900/50 rounded border border-slate-700">
            <p className="text-sm text-slate-400">
              💡 <strong className="text-white">Astuce:</strong> Appuyez sur <kbd className="px-2 py-1 bg-slate-700 rounded text-xs">?</kbd> n'importe où pour voir la liste complète des raccourcis.
            </p>
          </div>
        </section>

        {/* PWA Installation */}
        <section className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-pink-400 mb-4 flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Installer l'App Mobile
          </h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-white font-semibold mb-2">📱 iOS (Safari)</h3>
              <ol className="text-slate-300 text-sm space-y-1 ml-4 list-decimal">
                <li>Ouvrez LifeBoard dans Safari</li>
                <li>Appuyez sur le bouton "Partager" (carré avec flèche vers le haut)</li>
                <li>Scroll down et sélectionnez "Sur l'écran d'accueil"</li>
                <li>Confirmez - l'icône LifeBoard apparaît sur votre écran d'accueil!</li>
              </ol>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-2">🤖 Android (Chrome)</h3>
              <ol className="text-slate-300 text-sm space-y-1 ml-4 list-decimal">
                <li>Ouvrez LifeBoard dans Chrome</li>
                <li>Appuyez sur le menu (3 points verticaux)</li>
                <li>Sélectionnez "Ajouter à l'écran d'accueil" ou "Installer l'application"</li>
                <li>Confirmez - l'app LifeBoard est installée!</li>
              </ol>
            </div>

            <div className="p-3 bg-emerald-900/20 border border-emerald-700 rounded">
              <p className="text-sm text-emerald-300">
                ✨ <strong>Avantages PWA:</strong> Mode fullscreen (pas de barre navigateur), support offline, icône personnalisée, expérience native!
              </p>
            </div>
          </div>
        </section>

        {/* Tips & Tricks */}
        <section className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-amber-400 mb-4 flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Astuces & Conseils
          </h2>
          
          <div className="space-y-3 text-sm text-slate-300">
            <div className="flex gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <strong className="text-white">Quick Actions = Gain de temps</strong>
                <p className="text-slate-400 mt-1">Loggez vos heures et revenus directement depuis le dashboard. Plus besoin d'aller dans Stats!</p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="text-2xl">🔍</span>
              <div>
                <strong className="text-white">Utilisez la recherche</strong>
                <p className="text-slate-400 mt-1">Toutes les listes (Tasks, Videos, Emails) ont une barre de recherche. Gagnez du temps au lieu de scroller!</p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="text-2xl">🗑️</span>
              <div>
                <strong className="text-white">Bulk Delete = Nettoyage rapide</strong>
                <p className="text-slate-400 mt-1">Cochez plusieurs items et supprimez-les en 1 clic. Parfait pour nettoyer les anciennes données.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="text-2xl">📊</span>
              <div>
                <strong className="text-white">Export CSV pour comptabilité</strong>
                <p className="text-slate-400 mt-1">Depuis Stats, exportez vos données en CSV pour Excel/Google Sheets. Idéal pour rapports mensuels.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="text-2xl">🎯</span>
              <div>
                <strong className="text-white">Définissez des objectifs</strong>
                <p className="text-slate-400 mt-1">Créez des goals (40h/semaine, 5000 CHF/mois) et suivez votre progression en temps réel!</p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="text-2xl">⌨️</span>
              <div>
                <strong className="text-white">Master des raccourcis clavier</strong>
                <p className="text-slate-400 mt-1">Naviguer avec Ctrl+H, Ctrl+T, etc. est 10x plus rapide que cliquer. Devenez un power user!</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-cyan-400 mb-4 flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            FAQ
          </h2>
          
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="text-white font-semibold mb-1">Comment éditer une entrée de travail ou d'argent?</h3>
              <p className="text-slate-400">Allez dans Stats, trouvez l'entrée, cliquez sur "Éditer", modifiez, puis "Sauvegarder".</p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-1">Comment supprimer plusieurs tâches d'un coup?</h3>
              <p className="text-slate-400">Dans Tasks, cochez les cases à côté des tâches, puis cliquez "Supprimer (N)" en haut.</p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-1">Les raccourcis clavier ne fonctionnent pas?</h3>
              <p className="text-slate-400">Assurez-vous de ne pas être en train de taper dans un champ de formulaire. Les shortcuts sont désactivés pendant la saisie.</p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-1">Comment voir les stats d'une période précise?</h3>
              <p className="text-slate-400">Dans Stats, utilisez le filtre de date en haut (7j, 30j, 90j ou Personnalisé avec from/to).</p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-1">Comment fonctionne le Goal Tracking?</h3>
              <p className="text-slate-400">Créez un goal (ex: "40h cette semaine"), le système calcule automatiquement votre progression en temps réel depuis vos work logs.</p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-1">L'app fonctionne hors ligne?</h3>
              <p className="text-slate-400">Partiellement. Les pages cachées (tasks, videos, stats) sont accessibles offline, mais les données nécessitent une connexion pour se mettre à jour.</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="mt-8 text-center text-slate-500 text-sm">
          <p>LifeBoard v1.0 - Built with ❤️ by Jimmy & Alex</p>
          <p className="mt-1">Deadline: 15 fév 2026, 9h Thaïlande ✅</p>
        </div>
      </div>
    </div>
  )
}
