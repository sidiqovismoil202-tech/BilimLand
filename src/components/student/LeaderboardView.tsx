import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StudentUser } from '../../types';
import { playClickSound } from '../../utils/audio';
import { Trophy, Medal, Star, Flame, Award, Users } from 'lucide-react';

export const LeaderboardView: React.FC = () => {
  const { students, currentUser } = useApp();
  const currentStudent = currentUser?.role === 'student' ? (currentUser as StudentUser) : null;
  const [filter, setFilter] = useState<'class' | 'all'>('class');

  // Filter students
  const filteredStudents = [...students]
    .filter((s) => (filter === 'class' && currentStudent ? s.grade === currentStudent.grade : true))
    .sort((a, b) => b.coins - a.coins);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <Trophy className="w-8 h-8 text-amber-200 fill-amber-300" />
            <h2 className="text-2xl sm:text-3xl font-black font-['Fredoka']">
              BilimLand Peshqadamlari
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-white/90 font-semibold mt-1">
            Eng ko'p tanga to'plagan va darslarni mukammal o'zlashtirgan zukko o'quvchilar
          </p>
        </div>

        {/* Filter Switcher */}
        <div className="flex bg-black/20 p-1.5 rounded-2xl backdrop-blur-md">
          <button
            onClick={() => {
              playClickSound();
              setFilter('class');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
              filter === 'class' ? 'bg-white text-amber-900 shadow' : 'text-white/80 hover:text-white'
            }`}
          >
            {currentStudent ? `${currentStudent.grade}-sinf bo'yicha` : 'Mening sinfim'}
          </button>
          <button
            onClick={() => {
              playClickSound();
              setFilter('all');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
              filter === 'all' ? 'bg-white text-amber-900 shadow' : 'text-white/80 hover:text-white'
            }`}
          >
            Umumiy maktab
          </button>
        </div>
      </div>

      {/* Top 3 Podium (if at least 3 students) */}
      {filteredStudents.length >= 3 && (
        <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 items-end max-w-lg mx-auto">
          {/* 2nd place */}
          <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-3 sm:p-4 text-center space-y-2 shadow-xs">
            <div className="text-2xl">🥈</div>
            <div className={`w-14 h-14 mx-auto rounded-full bg-white flex items-center justify-center text-3xl shadow ${filteredStudents[1]?.frame}`}>
              {filteredStudents[1]?.avatar || '🦉'}
            </div>
            <div className="font-black text-xs sm:text-sm text-slate-800 truncate">
              {filteredStudents[1]?.firstName}
            </div>
            <div className="text-xs font-black text-amber-700 bg-amber-100 rounded-full py-0.5">
              🪙 {filteredStudents[1]?.coins}
            </div>
          </div>

          {/* 1st place */}
          <div className="bg-gradient-to-b from-amber-100 to-yellow-50 border-2 border-amber-300 rounded-3xl p-4 sm:p-5 text-center space-y-2 shadow-md transform -translate-y-3">
            <div className="text-3xl animate-bounce">👑</div>
            <div className={`w-16 h-16 mx-auto rounded-full bg-white flex items-center justify-center text-4xl shadow-md ring-4 ring-amber-400 ${filteredStudents[0]?.frame}`}>
              {filteredStudents[0]?.avatar || '🦉'}
            </div>
            <div className="font-black text-sm sm:text-base text-amber-950 truncate">
              {filteredStudents[0]?.firstName}
            </div>
            <div className="text-xs font-black text-white bg-amber-500 rounded-full py-1">
              🪙 {filteredStudents[0]?.coins}
            </div>
          </div>

          {/* 3rd place */}
          <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-3 sm:p-4 text-center space-y-2 shadow-xs">
            <div className="text-2xl">🥉</div>
            <div className={`w-14 h-14 mx-auto rounded-full bg-white flex items-center justify-center text-3xl shadow ${filteredStudents[2]?.frame}`}>
              {filteredStudents[2]?.avatar || '🦉'}
            </div>
            <div className="font-black text-xs sm:text-sm text-slate-800 truncate">
              {filteredStudents[2]?.firstName}
            </div>
            <div className="text-xs font-black text-amber-700 bg-amber-100 rounded-full py-0.5">
              🪙 {filteredStudents[2]?.coins}
            </div>
          </div>
        </div>
      )}

      {/* List */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 bg-slate-50 border-b border-slate-200 text-xs font-black text-slate-500 uppercase tracking-wider flex justify-between">
          <span>O'quvchi</span>
          <span>Tangalar & Yutuqlar</span>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredStudents.map((s, idx) => {
            const isMe = s.id === currentStudent?.id;

            return (
              <div
                key={s.id}
                className={`p-4 flex items-center justify-between transition ${
                  isMe ? 'bg-indigo-50/80 font-bold' : 'hover:bg-slate-50/70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black ${
                    idx === 0
                      ? 'bg-amber-400 text-amber-950 font-black'
                      : idx === 1
                      ? 'bg-slate-300 text-slate-800'
                      : idx === 2
                      ? 'bg-amber-700 text-white'
                      : 'bg-slate-100 text-slate-500'
                  }`}>
                    {idx + 1}
                  </span>

                  <div className={`w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center text-2xl ${s.frame}`}>
                    {s.avatar || '🦉'}
                  </div>

                  <div>
                    <div className="text-sm font-black text-slate-800 flex items-center gap-2">
                      <span>{s.firstName} {s.lastName}</span>
                      {isMe && (
                        <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-full font-bold">
                          Siz
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 font-semibold flex items-center gap-2 mt-0.5">
                      <span>{s.grade}-sinf</span>
                      <span>•</span>
                      <span>{s.badge || '⭐ Bilimdon'}</span>
                      <span>•</span>
                      <span>{s.completedLessons.length} ta dars</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-black text-amber-700 flex items-center justify-end gap-1">
                    <span>{s.coins}</span>
                    <span>🪙</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
