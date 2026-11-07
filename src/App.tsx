import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/auth/AuthModal';
import { GuestLanding } from './components/home/GuestLanding';
import { StudentDashboard } from './components/student/StudentDashboard';
import { ShopModal } from './components/student/ShopModal';
import { LeaderboardView } from './components/student/LeaderboardView';
import { StudentProgressView } from './components/student/StudentProgressView';
import { GamesArenaView } from './components/games/GamesArenaView';
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { StudentUser } from './types';

function MainContent() {
  const { currentUser } = useApp();
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [authModal, setAuthModal] = useState<{
    isOpen: boolean;
    mode: 'login' | 'register' | 'admin' | 'teacher';
  }>({
    isOpen: false,
    mode: 'login',
  });

  const handleOpenAuth = (mode: 'login' | 'register' | 'admin' | 'teacher') => {
    setAuthModal({ isOpen: true, mode });
  };

  const student = currentUser?.role === 'student' ? (currentUser as StudentUser) : null;

  // Custom Theme styling
  const getThemeClass = () => {
    if (student?.theme === 'theme-cosmic') {
      return 'bg-gradient-to-b from-indigo-950 via-slate-900 to-purple-950 text-slate-100';
    }
    if (student?.theme === 'theme-island') {
      return 'bg-gradient-to-b from-amber-50/60 via-sky-50/30 to-amber-50/60 text-slate-800';
    }
    if (student?.theme === 'theme-emerald') {
      return 'bg-gradient-to-b from-emerald-50/50 via-teal-50/30 to-white text-slate-800';
    }
    return 'bg-gradient-to-b from-indigo-50/40 via-white to-purple-50/40 text-slate-800';
  };

  return (
    <div className={`min-h-screen flex flex-col font-['Plus_Jakarta_Sans'] transition-colors duration-300 ${getThemeClass()}`}>
      
      {/* Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenAuth={handleOpenAuth}
      />

      {/* Main Body Router */}
      <main className="flex-1 pb-16">
        {/* 1. GUEST VIEW */}
        {!currentUser && (
          <GuestLanding onOpenAuth={handleOpenAuth} />
        )}

        {/* 2. STUDENT VIEW */}
        {currentUser?.role === 'student' && (
          <>
            {(currentTab === 'home' || currentTab === 'subjects') && (
              <StudentDashboard onNavigateTab={setCurrentTab} />
            )}
            {currentTab === 'games' && <GamesArenaView />}
            {currentTab === 'shop' && <ShopModal />}
            {currentTab === 'leaderboard' && <LeaderboardView />}
            {currentTab === 'progress' && <StudentProgressView />}
          </>
        )}

        {/* 3. TEACHER VIEW */}
        {currentUser?.role === 'teacher' && (
          <TeacherDashboard initialTab={currentTab.startsWith('teacher-') ? currentTab : 'teacher-lessons'} />
        )}

        {/* 4. ADMIN VIEW */}
        {currentUser?.role === 'admin' && (
          <AdminDashboard initialTab={currentTab.startsWith('admin-') ? currentTab : 'admin-overview'} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white/80 backdrop-blur-md py-6 text-center text-xs text-slate-500 font-semibold">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">🚀</span>
            <span className="font-black text-slate-800 font-['Fredoka'] text-sm">BilimLand</span>
            <span>— Bolalar uchun milliy ta'lim portali</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold text-slate-600">
            <span>1–11 sinf fanlari</span>
            <span>•</span>
            <span>Interaktiv testlar</span>
            <span>•</span>
            <span>Fan o'yinlari</span>
            <span>•</span>
            <span>Sovg'alar do'koni</span>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModal.isOpen}
        initialMode={authModal.mode}
        onClose={() => setAuthModal({ ...authModal, isOpen: false })}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
