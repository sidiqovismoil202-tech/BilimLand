import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Subject, GameType, StudentUser } from '../../types';
import { PRIMARY_SUBJECTS, SECONDARY_SUBJECTS, INITIAL_GAMES } from '../../data/initialData';
import { SubjectGamesEngine } from './SubjectGamesEngine';
import { playClickSound } from '../../utils/audio';
import { Gamepad2, Sparkles, Trophy, Zap, Clock, Star, Play } from 'lucide-react';

export const GamesArenaView: React.FC = () => {
  const { currentUser } = useApp();
  const student = currentUser?.role === 'student' ? (currentUser as StudentUser) : null;

  const isPrimary = (student?.grade || 2) <= 4;
  const subjects = isPrimary ? PRIMARY_SUBJECTS : SECONDARY_SUBJECTS;

  const [selectedSubject, setSelectedSubject] = useState<Subject>(subjects[0]);
  const [activeGameType, setActiveGameType] = useState<GameType | null>(null);

  const handleStartGame = (type: GameType) => {
    playClickSound();
    setActiveGameType(type);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-in fade-in">
      
      {/* Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left space-y-2">
          <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-black uppercase tracking-wider backdrop-blur-md">
            O'yinlar Maydoni 🎮
          </span>
          <h2 className="text-3xl sm:text-4xl font-black font-['Fredoka']">
            Bilimlar Janggi & Quvnoq O'yinlar
          </h2>
          <p className="text-sm sm:text-base text-white/90 max-w-lg font-medium">
            Fanlarni o'yin orqali tez va oson o'zlashtiring. Har bir g'alaba sizga qimmatbaho tangalar keltiradi!
          </p>
        </div>

        {student && (
          <div className="bg-white/10 backdrop-blur-md border-2 border-white/30 rounded-3xl p-5 text-center shadow-lg min-w-52">
            <span className="text-xs font-black uppercase text-amber-200">
              Mavjud Tangalar:
            </span>
            <div className="text-3xl font-black text-amber-300 font-['Fredoka'] flex items-center justify-center gap-2 mt-1">
              <span>{student.coins}</span>
              <span className="text-2xl animate-bounce">🪙</span>
            </div>
            <p className="text-[11px] text-white/80 font-bold mt-1">
              O'yinda yutib yangi buyumlar oling!
            </p>
          </div>
        )}
      </div>

      {/* 1. Subject Selector Bar */}
      <div className="space-y-3">
        <h3 className="text-base font-black text-slate-800 font-['Fredoka'] flex items-center gap-2">
          <span>1. O'ynamoqchi bo'lgan faningizni tanlang:</span>
          <span className="text-xs text-indigo-600 font-bold">({selectedSubject.name} tanlandi)</span>
        </h3>

        <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          {subjects.map((sub) => {
            const isSelected = selectedSubject.id === sub.id;
            return (
              <button
                key={sub.id}
                onClick={() => {
                  playClickSound();
                  setSelectedSubject(sub);
                }}
                className={`p-3 rounded-2xl flex items-center gap-2.5 transition whitespace-nowrap cursor-pointer border-2 shrink-0 ${
                  isSelected
                    ? `${sub.bgGradient} text-white border-transparent shadow-lg scale-105 font-black`
                    : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300 font-bold'
                }`}
              >
                <span className="text-xl">{sub.icon}</span>
                <span className="text-xs sm:text-sm">{sub.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Game Modes Cards */}
      <div className="space-y-3">
        <h3 className="text-base font-black text-slate-800 font-['Fredoka']">
          2. O'yin turini tanlang:
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {INITIAL_GAMES.map((game) => (
            <div
              key={game.id}
              className="bg-white rounded-3xl p-6 border-2 border-slate-200 hover:border-amber-400 hover:shadow-xl transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center text-3xl shadow-xs group-hover:scale-110 transition-transform">
                    {game.icon}
                  </div>
                  <span className="bg-amber-100 text-amber-900 font-black text-xs px-3 py-1 rounded-full flex items-center gap-1">
                    🪙 +{game.coinReward} tanga
                  </span>
                </div>

                <h4 className="text-lg font-black text-slate-800 font-['Fredoka'] group-hover:text-amber-600 transition-colors">
                  {game.title}
                </h4>
                <p className="text-xs text-slate-500 font-medium mt-1.5 leading-relaxed">
                  {game.description}
                </p>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-100">
                <button
                  onClick={() => handleStartGame(game.type)}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>{selectedSubject.name} bilan o'ynash</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Game Modal */}
      {activeGameType && (
        <SubjectGamesEngine
          subject={selectedSubject}
          gameType={activeGameType}
          isOpen={!!activeGameType}
          onClose={() => setActiveGameType(null)}
        />
      )}
    </div>
  );
};
