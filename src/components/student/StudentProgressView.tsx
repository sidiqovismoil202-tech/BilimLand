import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StudentUser } from '../../types';
import { playClickSound } from '../../utils/audio';
import { 
  Award, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  FileCheck2, 
  Sparkles, 
  Star, 
  TrendingUp,
  MessageSquare
} from 'lucide-react';

export const StudentProgressView: React.FC = () => {
  const { currentUser, lessons, allSubjects, writtenSubmissions } = useApp();
  const student = currentUser?.role === 'student' ? (currentUser as StudentUser) : null;
  const [activeTab, setActiveTab] = useState<'tests' | 'written'>('tests');

  if (!student) return null;

  // Student's written submissions
  const mySubmissions = writtenSubmissions.filter((sub) => sub.studentId === student.id);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 animate-in fade-in">
      
      {/* Profile Summary Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-6">
        <div className={`w-24 h-24 rounded-full bg-indigo-50 flex items-center justify-center text-5xl shadow-md ${student.frame}`}>
          {student.avatar || '🦉'}
        </div>

        <div className="space-y-2 text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-2xl font-black text-slate-800 font-['Fredoka']">
              {student.firstName} {student.lastName}
            </h2>
            <span className="text-xs font-black bg-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-full">
              {student.grade}-sinf
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Hisob yaratilgan sana: {student.createdAt} • Login: @{student.username}
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
            <span className="bg-amber-100 text-amber-900 font-black text-xs px-3 py-1 rounded-full flex items-center gap-1">
              🪙 {student.coins} tanga
            </span>
            <span className="bg-purple-100 text-purple-900 font-black text-xs px-3 py-1 rounded-full flex items-center gap-1">
              <Star className="w-3.5 h-3.5" />
              {student.badge || '⭐ Bilimdon'}
            </span>
            <span className="bg-emerald-100 text-emerald-900 font-black text-xs px-3 py-1 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {student.completedLessons.length} dars tugatilgan
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl">
        <button
          onClick={() => {
            playClickSound();
            setActiveTab('tests');
          }}
          className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'tests' ? 'bg-white text-indigo-700 shadow' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Yechilgan Testlar ({student.testResults.length})</span>
        </button>

        <button
          onClick={() => {
            playClickSound();
            setActiveTab('written');
          }}
          className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'written' ? 'bg-white text-indigo-700 shadow' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          <span>Yozma Ishlar va Baholar ({mySubmissions.length})</span>
        </button>
      </div>

      {/* Content */}
      {activeTab === 'tests' ? (
        <div className="space-y-3">
          {student.testResults.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border-2 border-dashed border-slate-200">
              <p className="text-slate-500 font-bold text-sm">
                Siz hali birorta ham test yechmadingiz. Darslarga kiring va testlarni bajaring!
              </p>
            </div>
          ) : (
            student.testResults.map((t, idx) => {
              const subj = allSubjects.find((s) => s.id === t.subjectId);
              const lesson = lessons.find((l) => l.id === t.lessonId);

              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-4 border-2 border-slate-200 flex items-center justify-between shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{subj?.icon || '📚'}</div>
                    <div>
                      <div className="font-black text-slate-800 text-sm">
                        {subj?.name} — {lesson?.title || `${lesson?.dayNumber || 1}-kun darsi`}
                      </div>
                      <div className="text-xs text-slate-400 font-semibold mt-0.5">
                        Sana: {t.date}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-black text-indigo-600 text-base">
                      {t.score} / {t.total} ({t.percentage}%)
                    </div>
                    <div className="text-xs font-bold text-amber-700">
                      +{t.coinsEarned} tanga 🪙
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* Written Submissions */
        <div className="space-y-4">
          {mySubmissions.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border-2 border-dashed border-slate-200">
              <p className="text-slate-500 font-bold text-sm">
                Hali yozma topshiriq topshirmagansiz. Darslardagi yozma savollarga javob yozing!
              </p>
            </div>
          ) : (
            mySubmissions.map((sub) => {
              const subj = allSubjects.find((s) => s.id === sub.subjectId);

              return (
                <div
                  key={sub.id}
                  className="bg-white rounded-3xl p-5 border-2 border-slate-200 space-y-3 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <span>{subj?.icon}</span>
                      <span>{subj?.name}</span>
                    </span>

                    {sub.status === 'graded' ? (
                      <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Baholandi: {sub.teacherGrade} ball
                      </span>
                    ) : (
                      <span className="bg-amber-100 text-amber-800 text-xs font-black px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> Ustoz tekshiruvida
                      </span>
                    )}
                  </div>

                  {/* Question Prompt */}
                  <div className="text-sm font-bold text-slate-800">
                    "{sub.questionPrompt}"
                  </div>

                  {/* Student Answer */}
                  <div className="p-3 bg-slate-50 rounded-2xl text-xs sm:text-sm font-medium text-slate-700 border border-slate-200">
                    <span className="font-bold text-indigo-700 block mb-0.5">Sizning javobingiz:</span>
                    {sub.studentAnswer}
                  </div>

                  {/* Teacher Feedback if graded */}
                  {sub.status === 'graded' && (
                    <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-black text-emerald-800">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Ustozning izohi va bahosi:</span>
                      </div>
                      <p className="text-xs text-emerald-950 font-medium">
                        {sub.teacherFeedback || 'Barakalla, javob to\'g\'ri yozilgan!'}
                      </p>
                      {sub.coinsAwarded && sub.coinsAwarded > 0 && (
                        <div className="text-xs font-black text-amber-700">
                          Qo'shimcha mukofot: +{sub.coinsAwarded} tanga 🪙
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
