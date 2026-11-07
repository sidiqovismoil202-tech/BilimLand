import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StudentUser, Subject, Lesson } from '../../types';
import { PRIMARY_SUBJECTS, SECONDARY_SUBJECTS } from '../../data/initialData';
import { LessonViewerModal } from './LessonViewerModal';
import { SubjectGamesEngine } from '../games/SubjectGamesEngine';
import { playClickSound } from '../../utils/audio';
import { 
  BookOpen, 
  Sparkles, 
  Lock, 
  CheckCircle2, 
  Gamepad2, 
  Trophy, 
  ArrowRight, 
  GraduationCap, 
  ChevronRight,
  Flame,
  Star
} from 'lucide-react';

interface StudentDashboardProps {
  onNavigateTab: (tab: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onNavigateTab }) => {
  const { currentUser, lessons, allSubjects } = useApp();
  const student = currentUser?.role === 'student' ? (currentUser as StudentUser) : null;

  // Selected subject for viewing lessons
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  // Active lesson to view
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  // Game modal open state
  const [gameModalSubject, setGameModalSubject] = useState<Subject | null>(null);

  if (!student) return null;

  // Filter subjects based strictly on student grade:
  // 1-4: PRIMARY_SUBJECTS (11 ta fan)
  // 5-11: SECONDARY_SUBJECTS (18 ta fan)
  const isPrimary = student.grade <= 4;
  const gradeSubjects = isPrimary ? PRIMARY_SUBJECTS : SECONDARY_SUBJECTS;

  // Lessons for the currently selected subject
  const subjectLessons = selectedSubject
    ? lessons
        .filter((l) => l.subjectId === selectedSubject.id)
        .sort((a, b) => a.dayNumber - b.dayNumber)
    : [];

  // Determine which lessons are unlocked:
  // Day 1 is always unlocked. Day N is unlocked if Day N-1 is in completedLessons.
  const isLessonUnlocked = (lesson: Lesson, idx: number) => {
    if (idx === 0) return true; // Day 1 always open
    const prevLesson = subjectLessons[idx - 1];
    return prevLesson ? student.completedLessons.includes(prevLesson.id) : true;
  };

  const calculateSubjectProgress = (subjId: string) => {
    const sLessons = lessons.filter((l) => l.subjectId === subjId);
    if (sLessons.length === 0) return 0;
    const completedCount = sLessons.filter((l) => student.completedLessons.includes(l.id)).length;
    return Math.round((completedCount / sLessons.length) * 100);
  };

  // Find next lesson to study
  const getSubjectNextLesson = (subjId: string) => {
    const sLessons = lessons
      .filter((l) => l.subjectId === subjId)
      .sort((a, b) => a.dayNumber - b.dayNumber);
    const uncompleted = sLessons.find((l) => !student.completedLessons.includes(l.id));
    return uncompleted || sLessons[0];
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-in fade-in">
      
      {/* 1. Student Hero Greeting Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-700 via-purple-600 to-pink-500 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
            {/* Custom Avatar with Equipped Frame */}
            <div className="relative">
              <div className={`w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-4xl shadow-inner ${student.frame}`}>
                {student.avatar || '🦉'}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-amber-400 text-amber-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow">
                {student.grade}-sinf
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-black font-['Fredoka']">
                  Salom, {student.firstName}!
                </h1>
                <span className="text-xl">👋</span>
              </div>
              <p className="text-sm text-white/90 font-medium">
                Bugun qaysi yangi darsni kashf qilamiz? BilimLandda yangi cho'qqilarni zabt eting!
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1">
                <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-xs flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
                  {student.badge || '⭐ Bilimdon'}
                </span>
                <span className="bg-amber-400/90 text-amber-950 px-3 py-1 rounded-full text-xs font-black flex items-center gap-1">
                  🪙 {student.coins} Tanga
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Badges */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                playClickSound();
                onNavigateTab('games');
              }}
              className="px-4 py-3 rounded-2xl font-black text-xs sm:text-sm bg-amber-400 text-amber-950 hover:bg-amber-300 shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <Gamepad2 className="w-4 h-4" />
              <span>O'yinlar maydoni</span>
            </button>
            <button
              onClick={() => {
                playClickSound();
                onNavigateTab('shop');
              }}
              className="px-4 py-3 rounded-2xl font-black text-xs sm:text-sm bg-pink-500 text-white hover:bg-pink-400 shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <span>Do'konga o'tish</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. SUBJECT DETAILS VIEW (When student clicked on a subject) */}
      {selectedSubject ? (
        <div className="space-y-6 animate-in slide-in-from-right-4">
          
          {/* Breadcrumb / Back button */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                playClickSound();
                setSelectedSubject(null);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-black transition cursor-pointer"
            >
              <span>← Barcha fanlarga qaytish</span>
            </button>

            <button
              onClick={() => {
                playClickSound();
                setGameModalSubject(selectedSubject);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs sm:text-sm font-black shadow-md hover:from-amber-600 hover:to-orange-600 transition cursor-pointer"
            >
              <Gamepad2 className="w-4 h-4" />
              <span>Ushbu fan o'yinlari 🎮</span>
            </button>
          </div>

          {/* Subject Header Card */}
          <div className={`p-6 sm:p-8 rounded-3xl text-white shadow-lg ${selectedSubject.bgGradient}`}>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-4xl shadow-inner">
                {selectedSubject.icon}
              </div>
              <div>
                <span className="text-xs font-black uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
                  {student.grade}-sinf darsliklari
                </span>
                <h2 className="text-2xl sm:text-3xl font-black font-['Fredoka'] mt-1">
                  {selectedSubject.name}
                </h2>
                <p className="text-xs sm:text-sm text-white/90 font-medium max-w-xl mt-0.5">
                  {selectedSubject.description}
                </p>
              </div>
            </div>
          </div>

          {/* Daily Lessons Journey Timeline */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-800 font-['Fredoka']">
                📅 Har kungi darslar ketma-ketligi
              </h3>
              <span className="text-xs font-bold text-slate-500">
                (Oldingi kun darsi tugagach, keyingisi ochiladi)
              </span>
            </div>

            {subjectLessons.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200">
                <p className="text-slate-500 font-bold text-sm">
                  Ushbu fan uchun darslar tez orada ustozlar tomonidan yuklanadi.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {subjectLessons.map((lesson, idx) => {
                  const unlocked = isLessonUnlocked(lesson, idx);
                  const completed = student.completedLessons.includes(lesson.id);

                  return (
                    <div
                      key={lesson.id}
                      onClick={() => {
                        if (unlocked) {
                          playClickSound();
                          setActiveLesson(lesson);
                        }
                      }}
                      className={`rounded-3xl p-5 border-2 transition duration-200 flex flex-col justify-between ${
                        completed
                          ? 'bg-emerald-50/50 border-emerald-300 shadow-sm hover:shadow-md cursor-pointer'
                          : unlocked
                          ? 'bg-white border-indigo-200 hover:border-indigo-400 shadow-sm hover:shadow-lg cursor-pointer transform hover:-translate-y-0.5'
                          : 'bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed'
                      }`}
                    >
                      <div>
                        {/* Day & Status header */}
                        <div className="flex items-center justify-between mb-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${
                            completed 
                              ? 'bg-emerald-200 text-emerald-900' 
                              : unlocked 
                              ? 'bg-indigo-100 text-indigo-700' 
                              : 'bg-slate-200 text-slate-600'
                          }`}>
                            {lesson.dayNumber}-kun
                          </span>

                          <div>
                            {completed ? (
                              <span className="flex items-center gap-1 text-xs font-black text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                                <CheckCircle2 className="w-3.5 h-3.5" /> O'zlashtirildi
                              </span>
                            ) : unlocked ? (
                              <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                                Ochiq
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
                                <Lock className="w-3.5 h-3.5" /> Qulflangan
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Title */}
                        <h4 className="text-base font-black text-slate-800 font-['Fredoka'] line-clamp-1">
                          {lesson.title}
                        </h4>
                        <p className="text-xs text-slate-500 font-medium mt-1 line-clamp-2">
                          {lesson.summary}
                        </p>
                      </div>

                      {/* Footer */}
                      <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-700">
                          🪙 +{lesson.coinsReward} tanga
                        </span>

                        {unlocked ? (
                          <span className="text-xs font-black text-indigo-600 flex items-center gap-1">
                            {completed ? 'Qayta ko\'rish' : 'Darsni boshlash'} →
                          </span>
                        ) : (
                          <span className="text-[11px] font-semibold text-slate-400">
                            Oldingi darsni o'ting
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* 3. MAIN SUBJECTS GRID (1-4: 11 subjects, 5-11: 18 subjects) */
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-indigo-600" />
                <h2 className="text-2xl font-black text-slate-800 font-['Fredoka']">
                  {student.grade}-sinf Fanlari ({gradeSubjects.length} ta fan)
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-0.5">
                {isPrimary
                  ? 'Boshlang\'ich sinflar uchun 11 ta asosiy qiziqarli fan'
                  : 'Yuqori sinflar uchun 18 ta chuqurlashtirilgan fan'}
              </p>
            </div>

            {/* Quick stats indicator */}
            <div className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-200">
              O'zlashtirilgan darslar: {student.completedLessons.length} ta
            </div>
          </div>

          {/* Subjects Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {gradeSubjects.map((subject) => {
              const progress = calculateSubjectProgress(subject.id);
              const subjectLessonsCount = lessons.filter((l) => l.subjectId === subject.id).length;

              return (
                <div
                  key={subject.id}
                  onClick={() => {
                    playClickSound();
                    setSelectedSubject(subject);
                  }}
                  className="bg-white rounded-3xl p-5 border-2 border-slate-200 hover:border-indigo-400 hover:shadow-xl transition-all duration-200 cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    {/* Top Icon & Tag */}
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-md ${subject.bgGradient} text-white group-hover:scale-110 transition-transform duration-200`}>
                        {subject.icon}
                      </div>

                      <span className="text-[11px] font-black text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                        {subjectLessonsCount} ta dars
                      </span>
                    </div>

                    {/* Subject Name */}
                    <h3 className="text-lg font-black text-slate-800 font-['Fredoka'] group-hover:text-indigo-600 transition-colors">
                      {subject.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-1 line-clamp-2">
                      {subject.description}
                    </p>
                  </div>

                  {/* Progress bar */}
                  <div className="pt-4 mt-3 border-t border-slate-100 space-y-1.5">
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-slate-600">O'zlashtirish</span>
                      <span className="text-indigo-600">{progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Active Lesson Viewer Modal */}
      {activeLesson && selectedSubject && (
        <LessonViewerModal
          lesson={activeLesson}
          subject={selectedSubject}
          isOpen={!!activeLesson}
          onClose={() => setActiveLesson(null)}
          onNextLesson={() => {
            const next = subjectLessons.find((l) => l.dayNumber === activeLesson.dayNumber + 1);
            if (next) setActiveLesson(next);
          }}
        />
      )}

      {/* 5. Subject Games Modal */}
      {gameModalSubject && (
        <SubjectGamesEngine
          subject={gameModalSubject}
          isOpen={!!gameModalSubject}
          onClose={() => setGameModalSubject(null)}
        />
      )}
    </div>
  );
};
