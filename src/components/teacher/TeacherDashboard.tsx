import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TeacherUser, Lesson, Question, GradeLevel, WrittenSubmission } from '../../types';
import { playClickSound, playSuccessSound } from '../../utils/audio';
import { 
  BookOpen, 
  PlusCircle, 
  FileCheck2, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Star, 
  Clock, 
  User, 
  Send,
  Sparkles,
  HelpCircle,
  GraduationCap
} from 'lucide-react';

interface TeacherDashboardProps {
  initialTab?: string;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ initialTab = 'teacher-lessons' }) => {
  const { 
    currentUser, 
    allSubjects, 
    lessons, 
    questions, 
    writtenSubmissions, 
    addLesson, 
    updateLesson, 
    deleteLesson, 
    addQuestion, 
    deleteQuestion, 
    gradeWrittenSubmission 
  } = useApp();

  const teacher = currentUser?.role === 'teacher' ? (currentUser as TeacherUser) : null;
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  // Subject taught by this teacher
  const subject = allSubjects.find((s) => s.id === teacher?.subjectId) || allSubjects[0];

  // Modals for adding / editing
  const [showAddLessonModal, setShowAddLessonModal] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
  const [gradingSubmission, setGradingSubmission] = useState<WrittenSubmission | null>(null);

  // Grading form state
  const [gradeInput, setGradeInput] = useState<number>(5);
  const [feedbackInput, setFeedbackInput] = useState<string>('Juda yaxshi javob, barakalla!');
  const [bonusCoinsInput, setBonusCoinsInput] = useState<number>(15);

  if (!teacher) return null;

  // Filter lessons and questions for this teacher's subject
  const teacherLessons = lessons
    .filter((l) => l.subjectId === subject.id)
    .sort((a, b) => a.grade - b.grade || a.dayNumber - b.dayNumber);

  const teacherQuestions = questions.filter((q) => q.subjectId === subject.id);
  const teacherSubmissions = writtenSubmissions.filter((sub) => sub.subjectId === subject.id);

  const handleSaveGrading = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingSubmission) return;

    gradeWrittenSubmission(gradingSubmission.id, gradeInput, feedbackInput, bonusCoinsInput);
    playSuccessSound();
    setGradingSubmission(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-in fade-in">
      
      {/* Teacher Profile Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
          <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-4xl shadow-inner">
            👨‍🏫
          </div>
          <div>
            <span className="text-xs font-black uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
              O'qituvchi Xonasi
            </span>
            <h1 className="text-2xl sm:text-3xl font-black font-['Fredoka'] mt-1">
              Ustoz {teacher.firstName} {teacher.lastName}
            </h1>
            <p className="text-xs sm:text-sm text-white/90 font-medium">
              Fan: <span className="font-black text-amber-300">{subject.name}</span> ({subject.category === 'primary' ? '1–4 sinflar' : '5–11 sinflar'})
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-3 text-center">
          <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20">
            <div className="text-2xl font-black">{teacherLessons.length}</div>
            <div className="text-[11px] text-white/80 font-bold">Darslar</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20">
            <div className="text-2xl font-black">{teacherQuestions.length}</div>
            <div className="text-[11px] text-white/80 font-bold">Savollar</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20">
            <div className="text-2xl font-black text-amber-300">
              {teacherSubmissions.filter((s) => s.status === 'pending').length}
            </div>
            <div className="text-[11px] text-white/80 font-bold">Tekshirishda</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-2 overflow-x-auto">
        <button
          onClick={() => {
            playClickSound();
            setActiveTab('teacher-lessons');
          }}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'teacher-lessons' ? 'bg-white text-blue-700 shadow' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Darslar & Mavzular ({teacherLessons.length})</span>
        </button>

        <button
          onClick={() => {
            playClickSound();
            setActiveTab('teacher-questions');
          }}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'teacher-questions' ? 'bg-white text-purple-700 shadow' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Savollar banki ({teacherQuestions.length})</span>
        </button>

        <button
          onClick={() => {
            playClickSound();
            setActiveTab('teacher-submissions');
          }}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'teacher-submissions' ? 'bg-white text-emerald-700 shadow' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          <span>Yozma ishlarni baholash ({teacherSubmissions.length})</span>
        </button>
      </div>

      {/* 1. LESSONS MANAGEMENT */}
      {activeTab === 'teacher-lessons' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-black text-slate-800 font-['Fredoka']">
              {subject.name} Fani Darslari
            </h3>
            <button
              onClick={() => {
                playClickSound();
                setEditingLesson(null);
                setShowAddLessonModal(true);
              }}
              className="px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs sm:text-sm shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Yangi dars qo'shish</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teacherLessons.map((l) => (
              <div
                key={l.id}
                className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-blue-100 text-blue-800 font-black text-xs px-2.5 py-0.5 rounded-full">
                      {l.grade}-sinf • {l.dayNumber}-kun
                    </span>
                    <span className="text-xs font-bold text-amber-700">🪙 +{l.coinsReward} tanga</span>
                  </div>

                  <h4 className="text-base font-black text-slate-800 font-['Fredoka'] mt-1">
                    {l.title}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium mt-1 line-clamp-3">
                    {l.content}
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-100 flex justify-end gap-2">
                  <button
                    onClick={() => {
                      playClickSound();
                      setEditingLesson(l);
                      setShowAddLessonModal(true);
                    }}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-blue-50 text-blue-600 transition cursor-pointer"
                    title="Tahrirlash"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      playClickSound();
                      if (confirm('Ushbu darsni o\'chirmoqchimisiz?')) {
                        deleteLesson(l.id);
                      }
                    }}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-rose-600 transition cursor-pointer"
                    title="O'chirish"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. QUESTIONS BANK */}
      {activeTab === 'teacher-questions' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-black text-slate-800 font-['Fredoka']">
                {subject.name} Savollar Banki
              </h3>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                O'quvchi bir savolni yechgach, unga bu savol qayta berilmaydi!
              </p>
            </div>
            <button
              onClick={() => {
                playClickSound();
                setShowAddQuestionModal(true);
              }}
              className="px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs sm:text-sm shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Yangi savol qo'shish</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border-2 border-slate-200 overflow-hidden shadow-sm divide-y divide-slate-100">
            {teacherQuestions.map((q) => (
              <div key={q.id} className="p-4 sm:p-5 flex items-start justify-between gap-4 hover:bg-slate-50/60">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                      q.type === 'choice' ? 'bg-purple-100 text-purple-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {q.type === 'choice' ? 'Variantli Test (4 ta javob)' : 'Yozma savol'}
                    </span>
                    <span className="text-xs text-slate-500 font-bold">
                      {q.gradeRange[0]}–{q.gradeRange[1]}-sinflar
                    </span>
                  </div>

                  <h4 className="text-sm sm:text-base font-bold text-slate-800">
                    {q.prompt}
                  </h4>

                  {q.type === 'choice' && q.options && (
                    <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                      {q.options.map((opt, i) => (
                        <div
                          key={i}
                          className={`p-2 rounded-xl font-semibold border ${
                            opt === q.correctAnswer
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold'
                              : 'bg-slate-50 border-slate-200 text-slate-600'
                          }`}
                        >
                          {String.fromCharCode(65 + i)}) {opt}
                        </div>
                      ))}
                    </div>
                  )}

                  {q.type === 'written' && (
                    <div className="text-xs font-semibold text-slate-600 bg-amber-50/50 p-2 rounded-xl border border-amber-200">
                      To'g'ri javob namunasi: <span className="font-bold text-amber-900">{q.correctAnswer}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => {
                    playClickSound();
                    deleteQuestion(q.id);
                  }}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-rose-600 transition cursor-pointer"
                  title="O'chirish"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. WRITTEN SUBMISSIONS REVIEW */}
      {activeTab === 'teacher-submissions' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-black text-slate-800 font-['Fredoka']">
              O'quvchilar Yozma Ishlarini Baholash
            </h3>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              O'quvchilar javoblarini ko'rib, ball qo'ying, fikr-mulohaza yozing va bonus tangalar taqdim eting.
            </p>
          </div>

          {teacherSubmissions.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border-2 border-dashed border-slate-200">
              <p className="text-slate-500 font-bold text-sm">
                Hozircha tekshirilishi kerak bo'lgan yozma topshiriqlar mavjud emas.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {teacherSubmissions.map((sub) => (
                <div
                  key={sub.id}
                  className={`bg-white rounded-3xl p-5 border-2 transition ${
                    sub.status === 'graded' ? 'border-slate-200' : 'border-amber-300 ring-2 ring-amber-100 shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-xs">
                        🎒
                      </span>
                      <div>
                        <div className="text-sm font-black text-slate-800">
                          {sub.studentName} ({sub.studentGrade}-sinf)
                        </div>
                        <div className="text-[11px] text-slate-400 font-semibold">
                          Yuborilgan vaqt: {sub.submittedAt}
                        </div>
                      </div>
                    </div>

                    {sub.status === 'graded' ? (
                      <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-3 py-1 rounded-full flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Baholangan: {sub.teacherGrade} ball
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          playClickSound();
                          setGradingSubmission(sub);
                        }}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs shadow-md transition cursor-pointer"
                      >
                        Baholash & Fikr bildirish
                      </button>
                    )}
                  </div>

                  {/* Question */}
                  <div className="text-sm font-bold text-slate-700 bg-slate-50 p-3 rounded-2xl border border-slate-200 mb-2">
                    <span className="text-xs font-black text-indigo-600 block">Savol:</span>
                    {sub.questionPrompt}
                  </div>

                  {/* Student Answer */}
                  <div className="p-3 bg-indigo-50/50 rounded-2xl border border-indigo-100 text-sm font-medium text-slate-800">
                    <span className="text-xs font-bold text-slate-500 block mb-0.5">O'quvchi javobi:</span>
                    "{sub.studentAnswer}"
                  </div>

                  {/* Reference */}
                  <div className="text-xs font-semibold text-slate-500 mt-2">
                    Namunaviy to'g'ri javob: <span className="font-bold text-slate-700">{sub.correctAnswerReference}</span>
                  </div>

                  {/* If graded */}
                  {sub.status === 'graded' && (
                    <div className="mt-3 p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 font-medium">
                      <span className="font-black text-emerald-800 block">Ustoz bahosi: {sub.teacherGrade} ball (+{sub.coinsAwarded} tanga)</span>
                      Izoh: {sub.teacherFeedback}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL: ADD / EDIT LESSON */}
      {showAddLessonModal && (
        <LessonFormModal
          subject={subject}
          initialLesson={editingLesson}
          onClose={() => setShowAddLessonModal(false)}
          onSave={(data) => {
            if (editingLesson) {
              updateLesson({ ...data, id: editingLesson.id });
            } else {
              addLesson(data);
            }
            setShowAddLessonModal(false);
            playSuccessSound();
          }}
        />
      )}

      {/* MODAL: ADD QUESTION */}
      {showAddQuestionModal && (
        <QuestionFormModal
          subject={subject}
          onClose={() => setShowAddQuestionModal(false)}
          onSave={(data) => {
            addQuestion(data);
            setShowAddQuestionModal(false);
            playSuccessSound();
          }}
        />
      )}

      {/* MODAL: GRADE WRITTEN SUBMISSION */}
      {gradingSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border-4 border-emerald-100 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-800 font-['Fredoka']">
                Yozma Ishni Baholash
              </h3>
              <button
                onClick={() => setGradingSubmission(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl text-xs font-semibold text-slate-700">
              O'quvchi: <span className="font-bold text-slate-900">{gradingSubmission.studentName}</span>
              <p className="mt-1 text-slate-800 italic">"{gradingSubmission.studentAnswer}"</p>
            </div>

            <form onSubmit={handleSaveGrading} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Baho (1 dan 5 gacha yoki foiz):
                </label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={gradeInput}
                  onChange={(e) => setGradeInput(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 font-black text-lg focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Bonus tangalar (O'quvchiga beriladi):
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={bonusCoinsInput}
                  onChange={(e) => setBonusCoinsInput(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ustoz fikr-mulohazasi (Komment):
                </label>
                <textarea
                  rows={3}
                  value={feedbackInput}
                  onChange={(e) => setFeedbackInput(e.target.value)}
                  placeholder="Masalan: Barakalla, qoidani to'g'ri tushuntiribsan!"
                  className="w-full p-2.5 rounded-xl border-2 border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-md transition cursor-pointer"
              >
                Bahoni saqlash va tangani o'quvchiga yuborish 🪙
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

/* --- Lesson Form Modal --- */
function LessonFormModal({
  subject,
  initialLesson,
  onClose,
  onSave,
}: {
  subject: { id: string; name: string };
  initialLesson: Lesson | null;
  onClose: () => void;
  onSave: (data: Omit<Lesson, 'id'>) => void;
}) {
  const [grade, setGrade] = useState<GradeLevel>(initialLesson?.grade || 2);
  const [dayNumber, setDayNumber] = useState<number>(initialLesson?.dayNumber || 1);
  const [title, setTitle] = useState(initialLesson?.title || '');
  const [summary, setSummary] = useState(initialLesson?.summary || '');
  const [content, setContent] = useState(initialLesson?.content || '');
  const [examplesText, setExamplesText] = useState(initialLesson?.examples.join('\n') || '');
  const [keyTakeawaysText, setKeyTakeawaysText] = useState(initialLesson?.keyTakeaways.join('\n') || '');
  const [coinsReward, setCoinsReward] = useState(initialLesson?.coinsReward || 10);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      subjectId: subject.id,
      grade,
      dayNumber,
      title: title.trim(),
      summary: summary.trim(),
      content: content.trim(),
      examples: examplesText.split('\n').filter((x) => x.trim().length > 0),
      keyTakeaways: keyTakeawaysText.split('\n').filter((x) => x.trim().length > 0),
      coinsReward,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl p-6 max-w-xl w-full border-4 border-blue-100 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-black text-slate-800 font-['Fredoka']">
            {initialLesson ? 'Darsni Tahrirlash' : 'Yangi Dars Qo\'shish'} ({subject.name})
          </h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Sinf (1–11):</label>
              <select
                value={grade}
                onChange={(e) => setGrade(Number(e.target.value) as GradeLevel)}
                className="w-full p-2.5 rounded-xl border-2 border-slate-200 text-xs font-bold"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((g) => (
                  <option key={g} value={g}>{g}-sinf</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Kun raqami:</label>
              <input
                type="number"
                min={1}
                required
                value={dayNumber}
                onChange={(e) => setDayNumber(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border-2 border-slate-200 text-xs font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Dars mavzusi:</label>
            <input
              type="text"
              required
              placeholder="Masalan: So'z turkumlari"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 rounded-xl border-2 border-slate-200 text-xs font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Qisqa mazmuni:</label>
            <input
              type="text"
              required
              placeholder="Darsning bir jumladagi xulosasi"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full p-2.5 rounded-xl border-2 border-slate-200 text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Darsning to'liq matni:</label>
            <textarea
              required
              rows={4}
              placeholder="Dars tushuntirishi, qoidalar va matn..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2.5 rounded-xl border-2 border-slate-200 text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Amaliy misollar (Har bir misolni yangi qatordan yozing):
            </label>
            <textarea
              rows={2}
              placeholder="1-misol&#10;2-misol"
              value={examplesText}
              onChange={(e) => setExamplesText(e.target.value)}
              className="w-full p-2.5 rounded-xl border-2 border-slate-200 text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Asosiy qoidalar (Har birini yangi qatordan yozing):
            </label>
            <textarea
              rows={2}
              placeholder="Qoida 1&#10;Qoida 2"
              value={keyTakeawaysText}
              onChange={(e) => setKeyTakeawaysText(e.target.value)}
              className="w-full p-2.5 rounded-xl border-2 border-slate-200 text-xs font-medium"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm shadow-md transition cursor-pointer"
          >
            Darsni saqlash
          </button>
        </form>
      </div>
    </div>
  );
}

/* --- Question Form Modal --- */
function QuestionFormModal({
  subject,
  onClose,
  onSave,
}: {
  subject: { id: string; name: string };
  onClose: () => void;
  onSave: (data: Omit<Question, 'id'>) => void;
}) {
  const [type, setType] = useState<'choice' | 'written'>('choice');
  const [prompt, setPrompt] = useState('');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [gradeMin, setGradeMin] = useState(1);
  const [gradeMax, setGradeMax] = useState(4);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (type === 'choice') {
      onSave({
        subjectId: subject.id,
        gradeRange: [gradeMin, gradeMax],
        type: 'choice',
        prompt: prompt.trim(),
        options: [optA.trim(), optB.trim(), optC.trim(), optD.trim()],
        correctAnswer: correctAnswer.trim(),
      });
    } else {
      onSave({
        subjectId: subject.id,
        gradeRange: [gradeMin, gradeMax],
        type: 'written',
        prompt: prompt.trim(),
        correctAnswer: correctAnswer.trim(),
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl p-6 max-w-lg w-full border-4 border-purple-100 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-black text-slate-800 font-['Fredoka']">
            Yangi Savol Qo'shish ({subject.name})
          </h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex bg-slate-100 p-1 rounded-2xl">
            <button
              type="button"
              onClick={() => setType('choice')}
              className={`flex-1 py-2 rounded-xl text-xs font-black transition ${
                type === 'choice' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-500'
              }`}
            >
              Variantli Test (4 ta javob)
            </button>
            <button
              type="button"
              onClick={() => setType('written')}
              className={`flex-1 py-2 rounded-xl text-xs font-black transition ${
                type === 'written' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-500'
              }`}
            >
              Yozma javobli savol
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Savol matni:</label>
            <textarea
              required
              rows={2}
              placeholder="Savolni kiriting..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full p-2.5 rounded-xl border-2 border-slate-200 text-xs font-bold"
            />
          </div>

          {type === 'choice' ? (
            <>
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">4 ta variant:</label>
                <input
                  type="text"
                  required
                  placeholder="Variant A"
                  value={optA}
                  onChange={(e) => setOptA(e.target.value)}
                  className="w-full p-2 rounded-xl border-2 border-slate-200 text-xs"
                />
                <input
                  type="text"
                  required
                  placeholder="Variant B"
                  value={optB}
                  onChange={(e) => setOptB(e.target.value)}
                  className="w-full p-2 rounded-xl border-2 border-slate-200 text-xs"
                />
                <input
                  type="text"
                  required
                  placeholder="Variant C"
                  value={optC}
                  onChange={(e) => setOptC(e.target.value)}
                  className="w-full p-2 rounded-xl border-2 border-slate-200 text-xs"
                />
                <input
                  type="text"
                  required
                  placeholder="Variant D"
                  value={optD}
                  onChange={(e) => setOptD(e.target.value)}
                  className="w-full p-2 rounded-xl border-2 border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  To'g'ri javob (Yuqoridagi variantlardan birining aynan o'zi):
                </label>
                <input
                  type="text"
                  required
                  placeholder="To'g'ri variant matnini nusxalang"
                  value={correctAnswer}
                  onChange={(e) => setCorrectAnswer(e.target.value)}
                  className="w-full p-2.5 rounded-xl border-2 border-slate-200 text-xs font-bold text-emerald-700"
                />
              </div>
            </>
          ) : (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Namunaviy to'g'ri javob:
              </label>
              <textarea
                required
                rows={2}
                placeholder="To'g'ri javob namunasi..."
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value)}
                className="w-full p-2.5 rounded-xl border-2 border-slate-200 text-xs font-medium"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black text-sm shadow-md transition cursor-pointer"
          >
            Savolni bankka qo'shish
          </button>
        </form>
      </div>
    </div>
  );
}
