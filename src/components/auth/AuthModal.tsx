import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GradeLevel } from '../../types';
import { playClickSound, playErrorSound } from '../../utils/audio';
import { X, User, Lock, Sparkles, GraduationCap, Shield, ArrowRight, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register' | 'admin' | 'teacher';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const { login, registerStudent, admin, teachers, students } = useApp();
  
  const [role, setRole] = useState<'student' | 'teacher' | 'admin'>(() => {
    if (initialMode === 'admin') return 'admin';
    if (initialMode === 'teacher') return 'teacher';
    return 'student';
  });
  
  const [isRegister, setIsRegister] = useState(initialMode === 'register');
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [grade, setGrade] = useState<GradeLevel>(2);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    playClickSound();

    if (isRegister && role === 'student') {
      if (!firstName.trim() || !lastName.trim()) {
        setError('Ism va familiyangizni to\'liq kiriting!');
        playErrorSound();
        return;
      }
      const res = registerStudent({
        firstName,
        lastName,
        grade,
        username,
        password,
      });
      if (res.success) {
        onClose();
      } else {
        setError(res.message || 'Xatolik yuz berdi');
        playErrorSound();
      }
    } else {
      const res = login(username, password, role);
      if (res.success) {
        onClose();
      } else {
        setError(res.message || 'Kirishda xatolik! Login yoki parolni tekshiring.');
        playErrorSound();
      }
    }
  };

  // Quick Demo fill buttons for smooth testing
  const handleDemoStudent = () => {
    const s = students[0];
    if (s) {
      setRole('student');
      setIsRegister(false);
      setUsername(s.username);
      setPassword(s.password || 'student123');
    }
  };

  const handleDemoTeacher = () => {
    const t = teachers[0];
    if (t) {
      setRole('teacher');
      setIsRegister(false);
      setUsername(t.username);
      setPassword(t.password || 'teacher123');
    }
  };

  const handleDemoAdmin = () => {
    setRole('admin');
    setIsRegister(false);
    setUsername(admin.username);
    setPassword(admin.password || 'admin123');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border-4 border-indigo-100 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className={`p-6 text-white text-center relative ${
          role === 'admin' 
            ? 'bg-gradient-to-r from-slate-900 to-indigo-950' 
            : role === 'teacher' 
            ? 'bg-gradient-to-r from-blue-600 to-indigo-700' 
            : 'bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600'
        }`}>
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md mx-auto flex items-center justify-center text-3xl shadow-inner mb-2">
            {role === 'student' ? (isRegister ? '🌟' : '🎒') : role === 'teacher' ? '👨‍🏫' : '🛡️'}
          </div>

          <h2 className="text-2xl font-black font-['Fredoka']">
            {role === 'admin'
              ? 'Admin Boshqaruviga Kirish'
              : role === 'teacher'
              ? 'O\'qituvchi Portali'
              : isRegister
              ? 'Yangi O\'quvchi Ro\'yxati'
              : 'BilimLandga Xush Kelibsiz!'}
          </h2>
          <p className="text-xs text-white/80 font-semibold mt-1">
            {role === 'admin'
              ? 'Tizimni to\'liq nazorat qilish xonasi'
              : role === 'teacher'
              ? 'Darslar qo\'shish va o\'quvchilarni baholash'
              : isRegister
              ? '1–11 sinf uchun barcha fanlar va qiziqarli o\'yinlar'
              : 'Darslarga sho\'ng\'ing va tangalar to\'plang!'}
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex gap-2">
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setRole('student');
              setError(null);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer ${
              role === 'student'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            O'quvchi
          </button>
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setRole('teacher');
              setIsRegister(false);
              setError(null);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer ${
              role === 'teacher'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <User className="w-4 h-4" />
            O'qituvchi
          </button>
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setRole('admin');
              setIsRegister(false);
              setError(null);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer ${
              role === 'admin'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Shield className="w-4 h-4" />
            Admin
          </button>
        </div>

        {/* Body Form */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Toggle Login / Register (Only for Student) */}
          {role === 'student' && (
            <div className="flex bg-slate-100 p-1 rounded-2xl mb-2">
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setIsRegister(false);
                  setError(null);
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                  !isRegister ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500'
                }`}
              >
                Kirish (Login)
              </button>
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setIsRegister(true);
                  setError(null);
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                  isRegister ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500'
                }`}
              >
                Ro'yxatdan o'tish
              </button>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold animate-shake">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Student Registration Fields */}
            {role === 'student' && isRegister && (
              <>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Ism</label>
                    <input
                      type="text"
                      required
                      placeholder="Masalan: Jasur"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:outline-none text-sm font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Familiya</label>
                    <input
                      type="text"
                      required
                      placeholder="Toshmatov"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:outline-none text-sm font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Sinfingizni tanlang (1–11):
                  </label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(Number(e.target.value) as GradeLevel)}
                    className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:outline-none text-sm font-black bg-white cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((g) => (
                      <option key={g} value={g}>
                        {g}-sinf {g <= 4 ? '(Boshlang\'ich - 11 ta fan)' : '(Yuqori - 18 ta fan)'}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {/* Username / Login */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {role === 'admin' ? 'Admin Login' : role === 'teacher' ? 'O\'qituvchi Logini' : 'Login (Foydalanuvchi nomi)'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder={role === 'admin' ? 'admin' : 'login123'}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:outline-none text-sm font-semibold"
                />
                <User className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Parol
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:outline-none text-sm font-semibold"
                />
                <Lock className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <button
              type="submit"
              className={`w-full py-3 rounded-2xl font-black text-white shadow-lg transition flex items-center justify-center gap-2 cursor-pointer ${
                role === 'admin'
                  ? 'bg-slate-900 hover:bg-slate-800 shadow-slate-300'
                  : role === 'teacher'
                  ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-300'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-indigo-300'
              }`}
            >
              <span>
                {role === 'admin'
                  ? 'Admin panelga kirish'
                  : role === 'teacher'
                  ? 'O\'qituvchi xonasiga kirish'
                  : isRegister
                  ? 'Ro\'yxatdan o\'tish va boshlash (+50 tanga! 🪙)'
                  : 'Darslarga kirish'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Logins Helper */}
          <div className="pt-3 border-t border-slate-100">
            <div className="text-[11px] font-bold text-slate-600 text-center uppercase tracking-wider mb-2">
              ⚡ Tezkor sinab ko'rish (Demo hisoblar)
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={handleDemoStudent}
                className="p-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold text-center cursor-pointer transition border border-indigo-200"
              >
                🎒 O'quvchi
                <span className="block text-[10px] text-slate-600 font-semibold">jasurbek</span>
              </button>
              <button
                type="button"
                onClick={handleDemoTeacher}
                className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold text-center cursor-pointer transition border border-blue-200"
              >
                👨‍🏫 O'qituvchi
                <span className="block text-[10px] text-slate-600 font-semibold">nodira_m</span>
              </button>
              <button
                type="button"
                onClick={handleDemoAdmin}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold text-center cursor-pointer transition border border-slate-300"
              >
                🛡️ Admin
                <span className="block text-[10px] text-slate-600 font-semibold">admin123</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
