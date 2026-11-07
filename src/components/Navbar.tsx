import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StudentUser, TeacherUser } from '../types';
import { isSoundEnabled, toggleSound, playClickSound } from '../utils/audio';
import { 
  Sparkles, 
  Volume2, 
  VolumeX, 
  LogOut, 
  BookOpen, 
  Gamepad2, 
  ShoppingBag, 
  Trophy, 
  Award, 
  Shield, 
  GraduationCap, 
  Menu, 
  X,
  PlusCircle,
  FileCheck2
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenAuth: (mode: 'login' | 'register' | 'admin' | 'teacher') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, onOpenAuth }) => {
  const { currentUser, logout, allSubjects } = useApp();
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSoundToggle = () => {
    const newState = toggleSound();
    setSoundOn(newState);
    if (newState) {
      playClickSound();
    }
  };

  const handleTabChange = (tab: string) => {
    playClickSound();
    setCurrentTab(tab);
    setMobileMenuOpen(false);
  };

  const student = currentUser?.role === 'student' ? (currentUser as StudentUser) : null;
  const teacher = currentUser?.role === 'teacher' ? (currentUser as TeacherUser) : null;
  const teacherSubject = teacher ? allSubjects.find((s) => s.id === teacher.subjectId)?.name : null;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-indigo-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Logo */}
          <div 
            onClick={() => handleTabChange('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-300/40 group-hover:scale-105 transition-transform duration-200">
              <span className="text-2xl">🚀</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black bg-gradient-to-r from-indigo-700 via-purple-600 to-pink-600 bg-clip-text text-transparent font-['Fredoka']">
                  BilimLand
                </span>
                <Sparkles className="w-4 h-4 text-amber-500 animate-spin" style={{ animationDuration: '4s' }} />
              </div>
              <p className="text-[11px] font-bold text-indigo-400 tracking-wider uppercase">
                Bolalar ta'lim portali
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {/* Student Navigation */}
            {currentUser?.role === 'student' && (
              <>
                <button
                  onClick={() => handleTabChange('subjects')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-extrabold transition-all ${
                    currentTab === 'subjects' || currentTab === 'home'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-300'
                      : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-700'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  Fanlar & Darslar
                </button>
                <button
                  onClick={() => handleTabChange('games')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-extrabold transition-all ${
                    currentTab === 'games'
                      ? 'bg-amber-500 text-white shadow-md shadow-amber-300'
                      : 'text-slate-600 hover:bg-amber-50 hover:text-amber-700'
                  }`}
                >
                  <Gamepad2 className="w-4 h-4" />
                  O'yinlar
                </button>
                <button
                  onClick={() => handleTabChange('shop')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-extrabold transition-all ${
                    currentTab === 'shop'
                      ? 'bg-pink-500 text-white shadow-md shadow-pink-300'
                      : 'text-slate-600 hover:bg-pink-50 hover:text-pink-700'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  Do'kon
                </button>
                <button
                  onClick={() => handleTabChange('leaderboard')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-extrabold transition-all ${
                    currentTab === 'leaderboard'
                      ? 'bg-yellow-500 text-white shadow-md shadow-yellow-300'
                      : 'text-slate-600 hover:bg-yellow-50 hover:text-yellow-700'
                  }`}
                >
                  <Trophy className="w-4 h-4" />
                  Reyting
                </button>
                <button
                  onClick={() => handleTabChange('progress')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-extrabold transition-all ${
                    currentTab === 'progress'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-300'
                      : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  Natijalarim
                </button>
              </>
            )}

            {/* Teacher Navigation */}
            {currentUser?.role === 'teacher' && (
              <>
                <button
                  onClick={() => handleTabChange('teacher-lessons')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-extrabold transition-all ${
                    currentTab === 'teacher-lessons' || currentTab === 'home'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-300'
                      : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  Darslar & Mavzular
                </button>
                <button
                  onClick={() => handleTabChange('teacher-questions')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-extrabold transition-all ${
                    currentTab === 'teacher-questions'
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-300'
                      : 'text-slate-600 hover:bg-purple-50 hover:text-purple-700'
                  }`}
                >
                  <PlusCircle className="w-4 h-4" />
                  Savollar banki
                </button>
                <button
                  onClick={() => handleTabChange('teacher-submissions')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-extrabold transition-all ${
                    currentTab === 'teacher-submissions'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-300'
                      : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                  }`}
                >
                  <FileCheck2 className="w-4 h-4" />
                  Yozma ishlarni baholash
                </button>
              </>
            )}

            {/* Admin Navigation */}
            {currentUser?.role === 'admin' && (
              <>
                <button
                  onClick={() => handleTabChange('admin-overview')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-extrabold transition-all ${
                    currentTab === 'admin-overview' || currentTab === 'home'
                      ? 'bg-slate-900 text-white shadow-md shadow-slate-400'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  Boshqaruv & Statistika
                </button>
                <button
                  onClick={() => handleTabChange('admin-students')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-extrabold transition-all ${
                    currentTab === 'admin-students'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-700'
                  }`}
                >
                  O'quvchilar
                </button>
                <button
                  onClick={() => handleTabChange('admin-teachers')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-extrabold transition-all ${
                    currentTab === 'admin-teachers'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700'
                  }`}
                >
                  O'qituvchilar
                </button>
                <button
                  onClick={() => handleTabChange('admin-lessons')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-extrabold transition-all ${
                    currentTab === 'admin-lessons'
                      ? 'bg-purple-600 text-white'
                      : 'text-slate-600 hover:bg-purple-50 hover:text-purple-700'
                  }`}
                >
                  Darslar & Testlar
                </button>
                <button
                  onClick={() => handleTabChange('admin-shop')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-extrabold transition-all ${
                    currentTab === 'admin-shop'
                      ? 'bg-pink-600 text-white'
                      : 'text-slate-600 hover:bg-pink-50 hover:text-pink-700'
                  }`}
                >
                  Do'kon
                </button>
              </>
            )}
          </nav>

          {/* Right Action Icons & Auth Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Audio Toggle */}
            <button
              onClick={handleSoundToggle}
              title={soundOn ? 'Tovushni o\'chirish' : 'Tovushni yoqish'}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
            >
              {soundOn ? <Volume2 className="w-5 h-5 text-indigo-600" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
            </button>

            {/* Student Coin Counter */}
            {student && (
              <div 
                onClick={() => handleTabChange('shop')}
                className="flex items-center gap-2 bg-gradient-to-r from-amber-100 to-yellow-100 border-2 border-amber-300 px-3 py-1.5 rounded-full cursor-pointer hover:scale-105 transition shadow-sm"
              >
                <span className="text-xl animate-bounce">🪙</span>
                <span className="font-black text-amber-900 text-base font-['Fredoka']">
                  {student.coins}
                </span>
                <span className="hidden sm:inline text-xs font-bold text-amber-700">tanga</span>
              </div>
            )}

            {/* User Logged In Pill */}
            {currentUser ? (
              <div className="flex items-center gap-2 sm:gap-3">
                <div 
                  onClick={() => {
                    if (currentUser.role === 'student') handleTabChange('progress');
                  }}
                  className={`flex items-center gap-2 pl-2 pr-3 py-1 rounded-2xl bg-indigo-50 border border-indigo-200 ${currentUser.role === 'student' ? 'cursor-pointer hover:bg-indigo-100' : ''}`}
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-lg bg-white ${student?.frame || 'ring-2 ring-indigo-400'}`}>
                    {student ? student.avatar : currentUser.role === 'teacher' ? '👨‍🏫' : '🛡️'}
                  </div>
                  <div className="hidden lg:block text-left">
                    <div className="text-xs font-black text-slate-800 leading-tight">
                      {currentUser.firstName} {currentUser.lastName}
                    </div>
                    <div className="text-[10px] font-bold text-indigo-600 leading-tight">
                      {student ? `${student.grade}-sinf o'quvchisi` : teacher ? `Ustoz (${teacherSubject || 'Fan'})` : 'Bosh Administrator'}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    playClickSound();
                    logout();
                  }}
                  title="Tizimdan chiqish"
                  className="p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition cursor-pointer"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              /* Guest Actions */
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    playClickSound();
                    onOpenAuth('login');
                  }}
                  className="px-4 py-2 rounded-xl text-sm font-extrabold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition cursor-pointer"
                >
                  Kirish
                </button>
                <button
                  onClick={() => {
                    playClickSound();
                    onOpenAuth('register');
                  }}
                  className="px-4 py-2 rounded-xl text-sm font-black text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md shadow-indigo-300 transition cursor-pointer"
                >
                  Ro'yxatdan o'tish
                </button>
                <button
                  onClick={() => {
                    playClickSound();
                    onOpenAuth('admin');
                  }}
                  title="Admin yoki O'qituvchi kirishi"
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                >
                  <Shield className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-slate-100 text-slate-700 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b-2 border-indigo-100 px-4 pt-2 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-4">
          {currentUser?.role === 'student' && (
            <>
              <div className="p-3 bg-indigo-50 rounded-2xl flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{student?.avatar}</span>
                  <div>
                    <div className="font-black text-slate-800">{student?.firstName} {student?.lastName}</div>
                    <div className="text-xs text-indigo-600 font-bold">{student?.grade}-sinf o'quvchisi</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-amber-200/80 px-2.5 py-1 rounded-full font-black text-amber-900 text-xs">
                  🪙 {student?.coins}
                </div>
              </div>

              <button
                onClick={() => handleTabChange('subjects')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-bold ${currentTab === 'subjects' ? 'bg-indigo-600 text-white' : 'text-slate-700 hover:bg-indigo-50'}`}
              >
                <BookOpen className="w-5 h-5" />
                Fanlar & Darslar
              </button>
              <button
                onClick={() => handleTabChange('games')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-bold ${currentTab === 'games' ? 'bg-amber-500 text-white' : 'text-slate-700 hover:bg-amber-50'}`}
              >
                <Gamepad2 className="w-5 h-5" />
                Qiziqarli o'yinlar
              </button>
              <button
                onClick={() => handleTabChange('shop')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-bold ${currentTab === 'shop' ? 'bg-pink-500 text-white' : 'text-slate-700 hover:bg-pink-50'}`}
              >
                <ShoppingBag className="w-5 h-5" />
                Do'kon (Sovg'alar)
              </button>
              <button
                onClick={() => handleTabChange('leaderboard')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-bold ${currentTab === 'leaderboard' ? 'bg-yellow-500 text-white' : 'text-slate-700 hover:bg-yellow-50'}`}
              >
                <Trophy className="w-5 h-5" />
                Reyting & Peshqadamlar
              </button>
              <button
                onClick={() => handleTabChange('progress')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-bold ${currentTab === 'progress' ? 'bg-emerald-600 text-white' : 'text-slate-700 hover:bg-emerald-50'}`}
              >
                <Award className="w-5 h-5" />
                Mening natijalarim
              </button>
            </>
          )}

          {currentUser?.role === 'teacher' && (
            <>
              <button
                onClick={() => handleTabChange('teacher-lessons')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-bold ${currentTab === 'teacher-lessons' ? 'bg-blue-600 text-white' : 'text-slate-700'}`}
              >
                <BookOpen className="w-5 h-5" />
                Darslar & Mavzular
              </button>
              <button
                onClick={() => handleTabChange('teacher-questions')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-bold ${currentTab === 'teacher-questions' ? 'bg-purple-600 text-white' : 'text-slate-700'}`}
              >
                <PlusCircle className="w-5 h-5" />
                Savollar banki
              </button>
              <button
                onClick={() => handleTabChange('teacher-submissions')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-bold ${currentTab === 'teacher-submissions' ? 'bg-emerald-600 text-white' : 'text-slate-700'}`}
              >
                <FileCheck2 className="w-5 h-5" />
                Yozma ishlarni baholash
              </button>
            </>
          )}

          {currentUser?.role === 'admin' && (
            <>
              <button
                onClick={() => handleTabChange('admin-overview')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-bold bg-slate-900 text-white"
              >
                <Shield className="w-5 h-5" />
                Boshqaruv & Statistika
              </button>
              <button
                onClick={() => handleTabChange('admin-students')}
                className="w-full px-4 py-2.5 rounded-xl text-left font-bold text-slate-700 hover:bg-slate-100"
              >
                O'quvchilar
              </button>
              <button
                onClick={() => handleTabChange('admin-teachers')}
                className="w-full px-4 py-2.5 rounded-xl text-left font-bold text-slate-700 hover:bg-slate-100"
              >
                O'qituvchilar
              </button>
              <button
                onClick={() => handleTabChange('admin-lessons')}
                className="w-full px-4 py-2.5 rounded-xl text-left font-bold text-slate-700 hover:bg-slate-100"
              >
                Darslar & Testlar
              </button>
              <button
                onClick={() => handleTabChange('admin-shop')}
                className="w-full px-4 py-2.5 rounded-xl text-left font-bold text-slate-700 hover:bg-slate-100"
              >
                Do'kon
              </button>
            </>
          )}

          {!currentUser && (
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth('login');
                }}
                className="w-full py-3 rounded-xl font-black bg-indigo-600 text-white text-center shadow-md"
              >
                O'quvchi sifatida kirish
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth('register');
                }}
                className="w-full py-3 rounded-xl font-black bg-purple-100 text-purple-700 text-center"
              >
                Yangi ro'yxatdan o'tish
              </button>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('teacher');
                  }}
                  className="flex-1 py-2 text-xs font-bold bg-slate-100 text-slate-700 rounded-lg"
                >
                  👨‍🏫 O'qituvchi
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('admin');
                  }}
                  className="flex-1 py-2 text-xs font-bold bg-slate-800 text-white rounded-lg"
                >
                  🛡️ Admin
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
