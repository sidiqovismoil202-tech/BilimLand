import React from 'react';
import { playClickSound } from '../../utils/audio';
import { 
  Sparkles, 
  BookOpen, 
  Gamepad2, 
  ShoppingBag, 
  Trophy, 
  GraduationCap, 
  Shield, 
  ArrowRight, 
  CheckCircle2, 
  Coins,
  Smile
} from 'lucide-react';

interface GuestLandingProps {
  onOpenAuth: (mode: 'login' | 'register' | 'admin' | 'teacher') => void;
}

export const GuestLanding: React.FC<GuestLandingProps> = ({ onOpenAuth }) => {
  return (
    <div className="space-y-16 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-in fade-in">
      
      {/* 1. Hero Section */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white p-8 sm:p-12 md:p-16 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-6 text-center md:text-left">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-amber-300 font-black text-xs uppercase tracking-wider shadow-inner">
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
            <span>O'zbekistondagi eng quvnoq bolalar ta'lim portali</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black font-['Fredoka'] leading-tight">
            Bilimlar olamiga <br />
            <span className="text-amber-300">sehrli sayohat</span> boshlandi!
          </h1>

          <p className="text-base sm:text-lg text-white/90 font-medium leading-relaxed max-w-2xl">
            1–11 sinf o'quvchilari uchun har kungi qiziqarli darslar, bilimlarni sinovchi testlar, fan o'yinlari, tangalar to'plash va sovg'alar do'koni. Barchasi bir joyda!
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
            <button
              onClick={() => {
                playClickSound();
                onOpenAuth('register');
              }}
              className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-sm sm:text-base shadow-lg shadow-amber-500/40 transition duration-150 flex items-center gap-2 transform hover:scale-105 cursor-pointer"
            >
              <span>Ro'yxatdan o'tish (+50 Tanga bonus 🪙)</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => {
                playClickSound();
                onOpenAuth('login');
              }}
              className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-black text-sm sm:text-base border-2 border-white/40 transition duration-150 cursor-pointer"
            >
              O'quvchi sifatida kirish
            </button>
          </div>

          {/* Highlights pill */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-4 text-xs font-bold text-white/80">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>1–4 sinflar: 11 ta fan</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>5–11 sinflar: 18 ta fan</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Savollar takrorlanmaydi</span>
            </div>
          </div>
        </div>

        {/* Floating illustrations background */}
        <div className="hidden lg:block absolute right-12 bottom-8 text-8xl opacity-80 animate-bounce" style={{ animationDuration: '6s' }}>
          🚀
        </div>
      </div>

      {/* 2. Three Roles Showcase */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-black uppercase text-indigo-600 tracking-wider">
            Kimlar uchun mo'ljallangan?
          </span>
          <h2 className="text-3xl font-black text-slate-800 font-['Fredoka']">
            3 Ta Asosiy Foydalanuvchi Rolli
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* O'quvchi */}
          <div className="bg-white rounded-3xl p-6 border-2 border-indigo-100 hover:border-indigo-400 shadow-sm hover:shadow-xl transition flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-3xl">
                🎒
              </div>
              <h3 className="text-xl font-black text-slate-800 font-['Fredoka']">
                O'quvchi Portali
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                O'z sinfiga mos fanlar, ketma-ket ochiladigan har kungi darslar, variantli va yozma testlar, tangalar to'plash va sovrinlar xarid qilish.
              </p>
            </div>
            <button
              onClick={() => {
                playClickSound();
                onOpenAuth('login');
              }}
              className="mt-5 w-full py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-black text-xs transition cursor-pointer"
            >
              O'quvchi sifatida kirish →
            </button>
          </div>

          {/* O'qituvchi */}
          <div className="bg-white rounded-3xl p-6 border-2 border-blue-100 hover:border-blue-400 shadow-sm hover:shadow-xl transition flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-3xl">
                👨‍🏫
              </div>
              <h3 className="text-xl font-black text-slate-800 font-['Fredoka']">
                O'qituvchi Xonasi
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                O'z fani bo'yicha darslar va test savollarini kiritish, o'quvchilar yozma javoblarini ko'rib baholash, izoh yozish va tanga taqdim etish.
              </p>
            </div>
            <button
              onClick={() => {
                playClickSound();
                onOpenAuth('teacher');
              }}
              className="mt-5 w-full py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-black text-xs transition cursor-pointer"
            >
              O'qituvchi sifatida kirish →
            </button>
          </div>

          {/* Admin */}
          <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 hover:border-slate-800 shadow-sm hover:shadow-xl transition flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-3xl">
                🛡️
              </div>
              <h3 className="text-xl font-black text-slate-800 font-['Fredoka']">
                Administrator
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                O'quvchilar va o'qituvchilar hisoblarini yaratish/boshqarish, darslar va savollarni nazorat qilish, do'konga yangi narsalar qo'shish va statistika.
              </p>
            </div>
            <button
              onClick={() => {
                playClickSound();
                onOpenAuth('admin');
              }}
              className="mt-5 w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-black text-xs transition cursor-pointer"
            >
              Admin sifatida kirish →
            </button>
          </div>
        </div>
      </div>

      {/* 3. Core Features Showcase */}
      <div className="rounded-3xl bg-slate-50 border-2 border-slate-200 p-8 sm:p-12 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-black uppercase text-purple-600 tracking-wider">
            Nega BilimLand?
          </span>
          <h2 className="text-3xl font-black text-slate-800 font-['Fredoka']">
            Bolalar uchun Qiziqarli va Foydali Imkoniyatlar
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="text-3xl">📅</div>
            <h4 className="font-black text-slate-800 text-base font-['Fredoka']">Har kungi darslar</h4>
            <p className="text-xs text-slate-500 font-medium">
              1-kun, 2-kun, 3-kun... Darsni o'zlashtirgach, keyingi kun darsi avtomatik ochiladi.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="text-3xl">🧠</div>
            <h4 className="font-black text-slate-800 text-base font-['Fredoka']">Savollar takrorlanmaydi</h4>
            <p className="text-xs text-slate-500 font-medium">
              Bir marta yechilgan savol o'quvchiga qayta chiqmaydi. Har safar yangi bilimlar sinovi!
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="text-3xl">🎮</div>
            <h4 className="font-black text-slate-800 text-base font-['Fredoka']">Fan o'yinlari</h4>
            <p className="text-xs text-slate-500 font-medium">
              Tezkor viktorina, juftlikni top, so'z ustasi, hisob poygasi va to'g'ri/noto'g'ri o'yinlari.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="text-3xl">🪙</div>
            <h4 className="font-black text-slate-800 text-base font-['Fredoka']">Tangalar va Do'kon</h4>
            <p className="text-xs text-slate-500 font-medium">
              Har bir dars va g'alabaga tanga oling, qahramon avatarlari va a'lochi nishonlariga ega bo'ling.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
