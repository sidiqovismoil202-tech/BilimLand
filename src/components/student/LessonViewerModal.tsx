import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Lesson, Question, Subject, StudentUser } from '../../types';
import { playClickSound, playSuccessSound, playErrorSound, playCoinSound } from '../../utils/audio';
import { fireSchoolConfetti, fireCoinShower } from '../../utils/confetti';
import { 
  X, 
  BookOpen, 
  CheckCircle, 
  HelpCircle, 
  Award, 
  ArrowRight, 
  Send, 
  Sparkles, 
  Check, 
  Lightbulb,
  FileEdit,
  AlertCircle
} from 'lucide-react';

interface LessonViewerModalProps {
  lesson: Lesson;
  subject: Subject;
  isOpen: boolean;
  onClose: () => void;
  onNextLesson?: () => void;
}

export const LessonViewerModal: React.FC<LessonViewerModalProps> = ({
  lesson,
  subject,
  isOpen,
  onClose,
  onNextLesson,
}) => {
  const { 
    currentUser, 
    completeLesson, 
    submitTestResult, 
    submitWrittenAnswer, 
    getQuestionsForLesson,
    getAvailableSubjectQuestions
  } = useApp();

  const student = currentUser?.role === 'student' ? (currentUser as StudentUser) : null;
  const isCompleted = student?.completedLessons.includes(lesson.id);

  // View modes: 'lesson' | 'test_choice' | 'test_written' | 'result'
  const [mode, setMode] = useState<'lesson' | 'test_choice' | 'test_written' | 'result'>('lesson');

  // Load fresh questions (excluding already asked ones!)
  const availableQuestions = student 
    ? getQuestionsForLesson(lesson.id, student.id)
    : [];

  // Choice test questions (filter for type === 'choice')
  const choiceQuestions = availableQuestions.filter((q) => q.type === 'choice');
  // Written questions
  const writtenQuestions = availableQuestions.filter((q) => q.type === 'written');

  // Choice quiz states
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [choiceScore, setChoiceScore] = useState(0);

  // Written submission states
  const [writtenAnswerText, setWrittenAnswerText] = useState('');
  const [writtenSubmitted, setWrittenSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleFinishLessonReading = () => {
    playSuccessSound();
    if (student && !isCompleted) {
      completeLesson(lesson.id);
      fireCoinShower();
    }
    // Check if test questions exist
    if (choiceQuestions.length > 0) {
      setMode('test_choice');
    } else if (writtenQuestions.length > 0) {
      setMode('test_written');
    } else {
      setMode('result');
    }
  };

  const handleSelectChoiceOption = (option: string) => {
    playClickSound();
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQIndex]: option,
    }));
  };

  const handleNextChoiceQuestion = () => {
    playClickSound();
    if (currentQIndex + 1 < choiceQuestions.length) {
      setCurrentQIndex((i) => i + 1);
    } else {
      // Evaluate test results
      let correct = 0;
      const usedIds: string[] = [];
      choiceQuestions.forEach((q, idx) => {
        usedIds.push(q.id);
        if (selectedAnswers[idx] === q.correctAnswer) {
          correct += 1;
        }
      });

      const total = choiceQuestions.length;
      const percentage = Math.round((correct / total) * 100);
      const earnedCoins = correct * 10;

      setChoiceScore(correct);
      submitTestResult(lesson.id, subject.id, correct, total, earnedCoins, usedIds);

      if (percentage >= 60) {
        fireSchoolConfetti();
      }

      setMode('result');
    }
  };

  const handleSubmitWritten = (e: React.FormEvent) => {
    e.preventDefault();
    if (!writtenAnswerText.trim() || !writtenQuestions[0]) return;

    const q = writtenQuestions[0];
    submitWrittenAnswer({
      subjectId: subject.id,
      lessonId: lesson.id,
      questionId: q.id,
      questionPrompt: q.prompt,
      studentAnswer: writtenAnswerText.trim(),
      correctAnswerReference: q.correctAnswer,
    });

    setWrittenSubmitted(true);
    fireCoinShower();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border-4 border-indigo-100 flex flex-col max-h-[92vh]">
        
        {/* Modal Top Header */}
        <div className={`p-5 text-white flex items-center justify-between ${subject.bgGradient}`}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shadow-inner">
              {subject.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-white/20 text-white font-black text-xs px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {lesson.dayNumber}-kun darsi
                </span>
                {isCompleted && (
                  <span className="bg-emerald-400 text-emerald-950 font-black text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Check className="w-3 h-3" /> O'zlashtirilgan
                  </span>
                )}
              </div>
              <h3 className="text-xl font-black font-['Fredoka'] mt-0.5">
                {lesson.title}
              </h3>
            </div>
          </div>

          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Mode Switcher Header */}
        <div className="bg-slate-50 border-b border-slate-200 p-2 flex gap-2">
          <button
            onClick={() => {
              playClickSound();
              setMode('lesson');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer ${
              mode === 'lesson'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Dars mavzusi
          </button>

          <button
            onClick={() => {
              playClickSound();
              setMode('test_choice');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer ${
              mode === 'test_choice'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            Test savollari ({choiceQuestions.length})
          </button>

          {writtenQuestions.length > 0 && (
            <button
              onClick={() => {
                playClickSound();
                setMode('test_written');
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === 'test_written'
                  ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              <FileEdit className="w-4 h-4" />
              Yozma javob
            </button>
          )}
        </div>

        {/* Modal Main Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* MODE: LESSON READING */}
          {mode === 'lesson' && (
            <div className="space-y-5 animate-in fade-in">
              {/* Summary Callout */}
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-900 flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-black text-indigo-600 uppercase">Qisqa mazmuni</div>
                  <div className="text-sm font-semibold mt-0.5">{lesson.summary}</div>
                </div>
              </div>

              {/* Rich Lesson Content */}
              <div className="prose max-w-none text-slate-800 leading-relaxed text-base font-medium space-y-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
                <p className="whitespace-pre-line">{lesson.content}</p>
              </div>

              {/* Examples Section */}
              {lesson.examples && lesson.examples.length > 0 && (
                <div className="space-y-2.5">
                  <h4 className="text-sm font-black text-slate-800 flex items-center gap-2">
                    <span className="text-lg">💡</span> Amaliy misollar va namunalar:
                  </h4>
                  <div className="space-y-2">
                    {lesson.examples.map((ex, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm font-semibold flex items-center gap-2.5"
                      >
                        <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-black flex items-center justify-center shrink-0">
                          {i + 1}
                        </span>
                        <span>{ex}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Takeaways */}
              {lesson.keyTakeaways && lesson.keyTakeaways.length > 0 && (
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
                  <h4 className="text-xs font-black uppercase text-amber-800 tracking-wider mb-2">
                    📌 Asosiy qoidalar va esda saqlang:
                  </h4>
                  <ul className="space-y-1.5 text-sm font-bold text-amber-950">
                    {lesson.keyTakeaways.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Bottom Action */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-amber-600 font-black text-sm">
                  <span>🪙 Dars mukofoti: +{lesson.coinsReward} tanga</span>
                </div>

                <button
                  onClick={handleFinishLessonReading}
                  className="px-6 py-3 rounded-2xl font-black text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md shadow-indigo-300 transition flex items-center gap-2 cursor-pointer"
                >
                  <span>Darsni o'qib bo'ldim & Testga o'tish</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* MODE: CHOICE TEST */}
          {mode === 'test_choice' && (
            <div className="space-y-5 animate-in fade-in">
              {choiceQuestions.length === 0 ? (
                /* No questions available (Never repeats rule!) */
                <div className="text-center py-8 space-y-3">
                  <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-3xl">
                    🎉
                  </div>
                  <h4 className="text-lg font-black text-slate-800">
                    Bu dars bo'yicha barcha savollarni yechib bo'lgansiz!
                  </h4>
                  <p className="text-sm text-slate-500 font-semibold max-w-sm mx-auto">
                    Yangi savollar tez orada qo'shiladi. Siz boshqa fan darslarida yoki o'yinlarda qatnashishingiz mumkin!
                  </p>
                  <button
                    onClick={() => setMode('lesson')}
                    className="px-5 py-2.5 rounded-xl font-bold bg-indigo-50 text-indigo-700 cursor-pointer"
                  >
                    Dars matniga qaytish
                  </button>
                </div>
              ) : (
                /* Active Question */
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-black text-slate-500">
                    <span>Savol #{currentQIndex + 1} / {choiceQuestions.length}</span>
                    <span className="text-purple-600 font-bold">Har bir to'g'ri javobga +10 tanga 🪙</span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-purple-600 h-full transition-all duration-300"
                      style={{ width: `${((currentQIndex + 1) / choiceQuestions.length) * 100}%` }}
                    />
                  </div>

                  <div className="p-5 rounded-3xl bg-purple-50/60 border-2 border-purple-200 text-slate-800 text-base font-bold">
                    {choiceQuestions[currentQIndex].prompt}
                  </div>

                  {/* 4 Options Grid */}
                  <div className="space-y-2.5">
                    {choiceQuestions[currentQIndex].options?.map((opt, i) => {
                      const isSelected = selectedAnswers[currentQIndex] === opt;
                      return (
                        <button
                          key={i}
                          onClick={() => handleSelectChoiceOption(opt)}
                          className={`w-full p-4 rounded-2xl text-left font-bold text-sm transition border-2 flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-purple-600 text-white border-purple-700 shadow-md'
                              : 'bg-white border-slate-200 text-slate-700 hover:border-purple-300 hover:bg-purple-50/30'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black ${
                              isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {String.fromCharCode(65 + i)}
                            </span>
                            <span>{opt}</span>
                          </div>
                          {isSelected && <Check className="w-5 h-5 text-white" />}
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={handleNextChoiceQuestion}
                      disabled={!selectedAnswers[currentQIndex]}
                      className="px-6 py-3 rounded-2xl font-black text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-40 shadow-md transition flex items-center gap-2 cursor-pointer"
                    >
                      <span>
                        {currentQIndex + 1 === choiceQuestions.length ? 'Testni yakunlash' : 'Keyingi savol'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MODE: WRITTEN TEST */}
          {mode === 'test_written' && (
            <div className="space-y-4 animate-in fade-in">
              {writtenQuestions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm font-semibold text-slate-500">
                    Yangi savollar tez orada qo'shiladi.
                  </p>
                </div>
              ) : writtenSubmitted ? (
                <div className="p-6 rounded-3xl bg-emerald-50 border-2 border-emerald-200 text-center space-y-3">
                  <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl">
                    ✅
                  </div>
                  <h4 className="text-lg font-black text-emerald-900">
                    Javobingiz qabul qilindi!
                  </h4>
                  <p className="text-xs text-emerald-700 font-semibold max-w-sm mx-auto">
                    Javobingiz o'qituvchiga yuborildi. O'qituvchi tekshirib, baho va qo'shimcha bonus tangalar beradi!
                  </p>
                  <button
                    onClick={() => setMode('lesson')}
                    className="px-5 py-2 rounded-xl text-xs font-black bg-emerald-600 text-white cursor-pointer"
                  >
                    Darsga qaytish
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitWritten} className="space-y-4">
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                    <div className="text-xs font-black uppercase text-amber-700">Yozma topshiriq:</div>
                    <div className="text-base font-bold text-slate-800 mt-1">
                      {writtenQuestions[0].prompt}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">
                      O'z javobingizni batafsil yozing:
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={writtenAnswerText}
                      onChange={(e) => setWrittenAnswerText(e.target.value)}
                      placeholder="Javobingizni shu yerga yozing..."
                      className="w-full p-3 rounded-2xl border-2 border-slate-200 focus:border-indigo-500 focus:outline-none text-sm font-semibold"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl font-black text-white bg-amber-600 hover:bg-amber-700 shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>O'qituvchiga yuborish</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* MODE: RESULT SUMMARY */}
          {mode === 'result' && (
            <div className="text-center py-6 space-y-4 animate-in zoom-in-95">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-100 border-4 border-amber-300 flex items-center justify-center text-4xl shadow-md">
                ⭐
              </div>
              <div>
                <h4 className="text-2xl font-black text-slate-800 font-['Fredoka']">
                  Dars muvaffaqiyatli yakunlandi!
                </h4>
                <p className="text-slate-500 font-semibold text-sm mt-1">
                  Bilimingiz yanada boyidi va yangi kun darsi ochildi!
                </p>
              </div>

              {choiceQuestions.length > 0 && (
                <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 max-w-sm mx-auto">
                  <div className="text-xs font-bold text-purple-700 uppercase">Test natijasi</div>
                  <div className="text-2xl font-black text-purple-900 mt-0.5">
                    {choiceScore} / {choiceQuestions.length} ta to'g'ri
                  </div>
                  <div className="text-xs font-bold text-purple-600 mt-1">
                    To'g'rilik ko'rsatkichi: {Math.round((choiceScore / choiceQuestions.length) * 100)}%
                  </div>
                </div>
              )}

              <div className="flex justify-center gap-3 pt-3">
                <button
                  onClick={() => {
                    playClickSound();
                    onClose();
                  }}
                  className="px-6 py-3 rounded-2xl font-black bg-indigo-600 text-white hover:bg-indigo-700 shadow-md transition cursor-pointer"
                >
                  Fanlar ro'yxatiga qaytish
                </button>
                {onNextLesson && (
                  <button
                    onClick={() => {
                      playClickSound();
                      onNextLesson();
                      setMode('lesson');
                    }}
                    className="px-6 py-3 rounded-2xl font-black bg-emerald-600 text-white hover:bg-emerald-700 shadow-md transition flex items-center gap-2 cursor-pointer"
                  >
                    <span>Keyingi kun darsi</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
