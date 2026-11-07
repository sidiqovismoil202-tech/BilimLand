import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StudentUser, TeacherUser, GradeLevel, Lesson, Question, ShopItem } from '../../types';
import { playClickSound, playSuccessSound, playErrorSound } from '../../utils/audio';
import { 
  Shield, 
  Users, 
  UserCheck, 
  BookOpen, 
  ShoppingBag, 
  BarChart3, 
  PlusCircle, 
  Trash2, 
  Edit3, 
  Key, 
  Check, 
  X, 
  Coins, 
  GraduationCap, 
  Sparkles,
  RefreshCw,
  Search
} from 'lucide-react';

interface AdminDashboardProps {
  initialTab?: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ initialTab = 'admin-overview' }) => {
  const {
    admin,
    students,
    teachers,
    lessons,
    questions,
    shopItems,
    allSubjects,
    updateAdminPassword,
    addStudentByAdmin,
    updateStudent,
    deleteStudent,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    deleteLesson,
    deleteQuestion,
    addShopItem,
    updateShopItem,
    deleteShopItem,
    resetAllData,
  } = useApp();

  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [searchTerm, setSearchTerm] = useState('');
  const [notice, setNotice] = useState<string | null>(null);

  // Admin password change form
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [adminPassSuccess, setAdminPassSuccess] = useState(false);

  // Student Add / Edit state
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentUser | null>(null);
  const [studentForm, setStudentForm] = useState({
    firstName: '',
    lastName: '',
    grade: 2 as GradeLevel,
    username: '',
    password: '',
  });

  // Teacher Add / Edit state
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<TeacherUser | null>(null);
  const [teacherForm, setTeacherForm] = useState({
    firstName: '',
    lastName: '',
    subjectId: allSubjects[0]?.id || '',
    phone: '',
    username: '',
    password: '',
  });

  // Shop item Add state
  const [showShopModal, setShowShopModal] = useState(false);
  const [shopForm, setShopForm] = useState({
    name: '',
    category: 'avatar' as const,
    price: 30,
    preview: '🌟',
    cssValue: '🌟',
    description: '',
  });

  const showNotification = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3000);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAdminPassword.length < 4) {
      alert('Parol kamida 4 belgidan iborat bo\'lsin!');
      return;
    }
    const ok = updateAdminPassword(newAdminPassword);
    if (ok) {
      setAdminPassSuccess(true);
      setNewAdminPassword('');
      playSuccessSound();
      showNotification('Admin paroli muvaffaqiyatli yangilandi!');
      setTimeout(() => setAdminPassSuccess(false), 3000);
    }
  };

  // Student operations
  const handleOpenStudentModal = (st?: StudentUser) => {
    playClickSound();
    if (st) {
      setEditingStudent(st);
      setStudentForm({
        firstName: st.firstName,
        lastName: st.lastName,
        grade: st.grade,
        username: st.username,
        password: st.password || '',
      });
    } else {
      setEditingStudent(null);
      setStudentForm({
        firstName: '',
        lastName: '',
        grade: 2,
        username: '',
        password: '',
      });
    }
    setShowStudentModal(true);
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStudent) {
      updateStudent({
        ...editingStudent,
        firstName: studentForm.firstName.trim(),
        lastName: studentForm.lastName.trim(),
        grade: studentForm.grade,
        username: studentForm.username.trim().toLowerCase(),
        password: studentForm.password.trim(),
      });
      showNotification('O\'quvchi ma\'lumotlari yangilandi!');
    } else {
      addStudentByAdmin({
        firstName: studentForm.firstName.trim(),
        lastName: studentForm.lastName.trim(),
        grade: studentForm.grade,
        username: studentForm.username.trim().toLowerCase(),
        password: studentForm.password.trim(),
      });
      showNotification('Yangi o\'quvchi muvaffaqiyatli qo\'shildi!');
    }
    setShowStudentModal(false);
    playSuccessSound();
  };

  // Teacher operations
  const handleOpenTeacherModal = (tc?: TeacherUser) => {
    playClickSound();
    if (tc) {
      setEditingTeacher(tc);
      setTeacherForm({
        firstName: tc.firstName,
        lastName: tc.lastName,
        subjectId: tc.subjectId,
        phone: tc.phone || '',
        username: tc.username,
        password: tc.password || '',
      });
    } else {
      setEditingTeacher(null);
      setTeacherForm({
        firstName: '',
        lastName: '',
        subjectId: allSubjects[0]?.id || '',
        phone: '+998 90 ',
        username: '',
        password: 'teacher123',
      });
    }
    setShowTeacherModal(true);
  };

  const handleSaveTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTeacher) {
      updateTeacher({
        ...editingTeacher,
        firstName: teacherForm.firstName.trim(),
        lastName: teacherForm.lastName.trim(),
        subjectId: teacherForm.subjectId,
        phone: teacherForm.phone.trim(),
        username: teacherForm.username.trim().toLowerCase(),
        password: teacherForm.password.trim(),
      });
      showNotification('O\'qituvchi ma\'lumotlari yangilandi!');
    } else {
      addTeacher({
        firstName: teacherForm.firstName.trim(),
        lastName: teacherForm.lastName.trim(),
        subjectId: teacherForm.subjectId,
        phone: teacherForm.phone.trim(),
        username: teacherForm.username.trim().toLowerCase(),
        password: teacherForm.password.trim(),
      });
      showNotification('Yangi o\'qituvchi hisobi yaratildi!');
    }
    setShowTeacherModal(false);
    playSuccessSound();
  };

  // Shop item save
  const handleSaveShopItem = (e: React.FormEvent) => {
    e.preventDefault();
    addShopItem({
      name: shopForm.name.trim(),
      category: shopForm.category,
      price: shopForm.price,
      preview: shopForm.preview.trim(),
      cssValue: shopForm.cssValue.trim() || shopForm.preview.trim(),
      description: shopForm.description.trim(),
      available: true,
    });
    setShowShopModal(false);
    showNotification('Do\'konga yangi mahsulot qo\'shildi!');
    playSuccessSound();
  };

  // Grade distributions
  const gradeCounts: Record<number, number> = {};
  for (let i = 1; i <= 11; i++) gradeCounts[i] = 0;
  students.forEach((s) => {
    gradeCounts[s.grade] = (gradeCounts[s.grade] || 0) + 1;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-in fade-in">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
          <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-4xl shadow-inner border border-white/20">
            🛡️
          </div>
          <div>
            <span className="text-xs font-black uppercase tracking-wider bg-rose-500/80 px-3 py-1 rounded-full text-white">
              Boshqaruv Markazi (Super Admin)
            </span>
            <h1 className="text-2xl sm:text-3xl font-black font-['Fredoka'] mt-1">
              BilimLand Administratori
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              Foydalanuvchilar, darslar, savollar, narxlar va tizim xavfsizligini to'liq boshqarish
            </p>
          </div>
        </div>

        {/* Global Reset */}
        <button
          onClick={() => {
            playClickSound();
            if (confirm('Barcha ma\'lumotlarni dastlabki holatga qaytarishni xohlaysizmi?')) {
              resetAllData();
              alert('Barcha ma\'lumotlar tiklandi!');
            }
          }}
          className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-rose-600/80 text-white text-xs font-black border border-white/20 transition flex items-center gap-2 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Tizimni dastlabki holatga qaytarish</span>
        </button>
      </div>

      {/* Notice Banner */}
      {notice && (
        <div className="p-3.5 bg-emerald-100 border-2 border-emerald-300 text-emerald-900 rounded-2xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 animate-in zoom-in-95">
          <Check className="w-4 h-4" />
          <span>{notice}</span>
        </div>
      )}

      {/* Admin Tabs */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-2 overflow-x-auto">
        <button
          onClick={() => {
            playClickSound();
            setActiveTab('admin-overview');
          }}
          className={`flex-1 py-3 px-3 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'admin-overview' ? 'bg-slate-900 text-white shadow' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Statistika & Xulosa</span>
        </button>

        <button
          onClick={() => {
            playClickSound();
            setActiveTab('admin-students');
          }}
          className={`flex-1 py-3 px-3 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'admin-students' ? 'bg-indigo-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>O'quvchilar ({students.length})</span>
        </button>

        <button
          onClick={() => {
            playClickSound();
            setActiveTab('admin-teachers');
          }}
          className={`flex-1 py-3 px-3 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'admin-teachers' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>O'qituvchilar ({teachers.length})</span>
        </button>

        <button
          onClick={() => {
            playClickSound();
            setActiveTab('admin-lessons');
          }}
          className={`flex-1 py-3 px-3 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'admin-lessons' ? 'bg-purple-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Darslar ({lessons.length})</span>
        </button>

        <button
          onClick={() => {
            playClickSound();
            setActiveTab('admin-shop');
          }}
          className={`flex-1 py-3 px-3 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'admin-shop' ? 'bg-pink-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Do'kon ({shopItems.length})</span>
        </button>
      </div>

      {/* 1. OVERVIEW & STATS */}
      {activeTab === 'admin-overview' && (
        <div className="space-y-6">
          {/* Metrics row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase">Jami O'quvchilar</span>
              <div className="text-3xl font-black text-indigo-700 font-['Fredoka'] mt-1">
                {students.length} ta
              </div>
            </div>

            <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase">O'qituvchilar</span>
              <div className="text-3xl font-black text-blue-700 font-['Fredoka'] mt-1">
                {teachers.length} ta
              </div>
            </div>

            <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase">Jami Darslar</span>
              <div className="text-3xl font-black text-purple-700 font-['Fredoka'] mt-1">
                {lessons.length} ta
              </div>
            </div>

            <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase">Savollar Banki</span>
              <div className="text-3xl font-black text-amber-600 font-['Fredoka'] mt-1">
                {questions.length} ta
              </div>
            </div>
          </div>

          {/* Grade Distribution Grid */}
          <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 space-y-3 shadow-xs">
            <h3 className="text-base font-black text-slate-800">
              📊 Sinflar bo'yicha o'quvchilar taqsimoti:
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((g) => (
                <div key={g} className="p-3 rounded-2xl bg-slate-50 text-center border border-slate-200">
                  <div className="text-xs font-bold text-slate-500">{g}-sinf</div>
                  <div className="text-lg font-black text-indigo-600 mt-0.5">
                    {gradeCounts[g]} ta
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Admin Security / Password Change */}
          <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 max-w-lg space-y-4 shadow-xs">
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5 text-indigo-600" />
              <h3 className="text-base font-black text-slate-800">
                Admin Parolini O'zgartirish
              </h3>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Hozirgi admin logini: <span className="font-bold text-slate-800">@{admin.username}</span>. Xavfsizlik uchun yangi parol o'rnating.
            </p>

            <form onSubmit={handleUpdatePassword} className="space-y-3">
              <input
                type="password"
                required
                placeholder="Yangi admin paroli..."
                value={newAdminPassword}
                onChange={(e) => setNewAdminPassword(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-200 text-sm font-semibold focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black transition cursor-pointer"
              >
                Parolni yangilash
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. STUDENTS MANAGEMENT */}
      {activeTab === 'admin-students' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                placeholder="O'quvchini qidirish..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border-2 border-slate-200 text-xs font-semibold focus:outline-none focus:border-indigo-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            <button
              onClick={() => handleOpenStudentModal()}
              className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs sm:text-sm shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Yangi o'quvchi hisobi ochish</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border-2 border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-black uppercase border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">O'quvchi</th>
                    <th className="p-3.5">Login / Parol</th>
                    <th className="p-3.5">Sinfi</th>
                    <th className="p-3.5">Tangalar</th>
                    <th className="p-3.5">O'zlashtirilgan</th>
                    <th className="p-3.5 text-right">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                  {students
                    .filter(
                      (s) =>
                        s.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        s.username.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((st) => (
                      <tr key={st.id} className="hover:bg-slate-50">
                        <td className="p-3.5 flex items-center gap-2.5">
                          <span className="text-2xl">{st.avatar}</span>
                          <div>
                            <div className="font-bold text-slate-900">{st.firstName} {st.lastName}</div>
                            <div className="text-[10px] text-slate-400">{st.badge}</div>
                          </div>
                        </td>
                        <td className="p-3.5">
                          <span className="font-bold text-indigo-600">@{st.username}</span>
                          <span className="block text-[11px] text-slate-400 font-mono">
                            {st.password || 'student123'}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className="bg-indigo-100 text-indigo-800 font-black px-2 py-0.5 rounded-full">
                            {st.grade}-sinf
                          </span>
                        </td>
                        <td className="p-3.5 text-amber-700 font-black">
                          🪙 {st.coins}
                        </td>
                        <td className="p-3.5">
                          {st.completedLessons.length} ta dars
                        </td>
                        <td className="p-3.5 text-right space-x-1.5">
                          <button
                            onClick={() => handleOpenStudentModal(st)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 text-indigo-600 cursor-pointer"
                            title="Tahrirlash"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              playClickSound();
                              if (confirm(`${st.firstName} hisobini o'chirmoqchimisiz?`)) {
                                deleteStudent(st.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-rose-600 cursor-pointer"
                            title="O'chirish"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. TEACHERS MANAGEMENT */}
      {activeTab === 'admin-teachers' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-black text-slate-800 font-['Fredoka']">
                O'qituvchilar Ro'yxati
              </h3>
              <p className="text-xs text-slate-500 font-semibold">
                Admin o'qituvchi hisobini yaratadi va unga fan biriktiradi.
              </p>
            </div>
            <button
              onClick={() => handleOpenTeacherModal()}
              className="px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs sm:text-sm shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Yangi o'qituvchi hisobi berish</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teachers.map((tc) => {
              const subj = allSubjects.find((s) => s.id === tc.subjectId);

              return (
                <div
                  key={tc.id}
                  className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-sm flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center text-2xl font-black">
                        👨‍🏫
                      </div>
                      <span className="text-[11px] font-black bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">
                        {subj?.name || 'Fan'}
                      </span>
                    </div>

                    <h4 className="text-base font-black text-slate-900 font-['Fredoka']">
                      {tc.firstName} {tc.lastName}
                    </h4>

                    <div className="p-2.5 bg-slate-50 rounded-xl text-xs space-y-1">
                      <div className="text-slate-600">
                        Login: <span className="font-bold text-indigo-700">@{tc.username}</span>
                      </div>
                      <div className="text-slate-600">
                        Parol: <span className="font-mono font-bold text-slate-800">{tc.password}</span>
                      </div>
                      {tc.phone && (
                        <div className="text-slate-500 text-[11px]">Tel: {tc.phone}</div>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 mt-2 border-t border-slate-100 flex justify-end gap-2">
                    <button
                      onClick={() => handleOpenTeacherModal(tc)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-blue-50 text-blue-600 cursor-pointer"
                      title="Tahrirlash"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        playClickSound();
                        if (confirm(`${tc.firstName} ${tc.lastName} ni o'chirmoqchimisiz?`)) {
                          deleteTeacher(tc.id);
                        }
                      }}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-rose-600 cursor-pointer"
                      title="O'chirish"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. LESSONS OVERVIEW */}
      {activeTab === 'admin-lessons' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-black text-slate-800 font-['Fredoka']">
              Barcha Fan Darslari ({lessons.length} ta dars)
            </h3>
          </div>

          <div className="bg-white rounded-3xl border-2 border-slate-200 overflow-hidden shadow-sm divide-y divide-slate-100">
            {lessons.map((l) => {
              const subj = allSubjects.find((s) => s.id === l.subjectId);
              return (
                <div key={l.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{subj?.icon || '📚'}</span>
                    <div>
                      <div className="text-sm font-bold text-slate-900">
                        {l.grade}-sinf • {subj?.name} — {l.title} ({l.dayNumber}-kun)
                      </div>
                      <div className="text-xs text-slate-400 line-clamp-1">{l.summary}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      playClickSound();
                      if (confirm('Ushbu darsni o\'chirmoqchimisiz?')) {
                        deleteLesson(l.id);
                      }
                    }}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-rose-600 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. SHOP MANAGEMENT */}
      {activeTab === 'admin-shop' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-black text-slate-800 font-['Fredoka']">
                Do'kon Mahsulotlari Boshqaruvi
              </h3>
              <p className="text-xs text-slate-500 font-semibold">
                Yangi avatarlar, nishonlar, ramkalar qo'shish va narxlarini belgilash
              </p>
            </div>
            <button
              onClick={() => {
                playClickSound();
                setShowShopModal(true);
              }}
              className="px-4 py-2.5 rounded-2xl bg-pink-600 hover:bg-pink-700 text-white font-black text-xs sm:text-sm shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Yangi mahsulot qo'shish</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {shopItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-4 border-2 border-slate-200 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center text-xs mb-2">
                    <span className="uppercase font-black text-slate-400">{item.category}</span>
                    <span className="font-black text-amber-700">🪙 {item.price} tanga</span>
                  </div>

                  <div className="h-20 rounded-2xl bg-slate-50 flex items-center justify-center text-4xl mb-2">
                    {item.preview}
                  </div>

                  <h4 className="font-black text-slate-800 text-sm font-['Fredoka']">{item.name}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{item.description}</p>
                </div>

                <div className="pt-3 mt-2 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => {
                      playClickSound();
                      if (confirm(`"${item.name}" ni do'kondan o'chirmoqchimisiz?`)) {
                        deleteShopItem(item.id);
                      }
                    }}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-rose-600 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STUDENT MODAL */}
      {showStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border-4 border-indigo-100 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-800 font-['Fredoka']">
                {editingStudent ? 'O\'quvchini Tahrirlash' : 'Yangi O\'quvchi Yaratish'}
              </h3>
              <button onClick={() => setShowStudentModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Ism</label>
                  <input
                    type="text"
                    required
                    value={studentForm.firstName}
                    onChange={(e) => setStudentForm({ ...studentForm, firstName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border-2 border-slate-200 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Familiya</label>
                  <input
                    type="text"
                    required
                    value={studentForm.lastName}
                    onChange={(e) => setStudentForm({ ...studentForm, lastName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border-2 border-slate-200 text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Sinf (1–11):</label>
                <select
                  value={studentForm.grade}
                  onChange={(e) => setStudentForm({ ...studentForm, grade: Number(e.target.value) as GradeLevel })}
                  className="w-full p-2.5 rounded-xl border-2 border-slate-200 text-xs font-black"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((g) => (
                    <option key={g} value={g}>{g}-sinf</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Login</label>
                <input
                  type="text"
                  required
                  value={studentForm.username}
                  onChange={(e) => setStudentForm({ ...studentForm, username: e.target.value })}
                  className="w-full p-2.5 rounded-xl border-2 border-slate-200 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Parol</label>
                <input
                  type="text"
                  required
                  value={studentForm.password}
                  onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })}
                  className="w-full p-2.5 rounded-xl border-2 border-slate-200 text-xs font-semibold"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm shadow-md transition cursor-pointer"
              >
                Saqlash
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TEACHER MODAL */}
      {showTeacherModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border-4 border-blue-100 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-800 font-['Fredoka']">
                {editingTeacher ? 'O\'qituvchini Tahrirlash' : 'Yangi O\'qituvchi Qo\'shish'}
              </h3>
              <button onClick={() => setShowTeacherModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTeacher} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Ism</label>
                  <input
                    type="text"
                    required
                    value={teacherForm.firstName}
                    onChange={(e) => setTeacherForm({ ...teacherForm, firstName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border-2 border-slate-200 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Familiya</label>
                  <input
                    type="text"
                    required
                    value={teacherForm.lastName}
                    onChange={(e) => setTeacherForm({ ...teacherForm, lastName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border-2 border-slate-200 text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Biriktirilgan fan:</label>
                <select
                  value={teacherForm.subjectId}
                  onChange={(e) => setTeacherForm({ ...teacherForm, subjectId: e.target.value })}
                  className="w-full p-2.5 rounded-xl border-2 border-slate-200 text-xs font-black"
                >
                  {allSubjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.icon} {s.name} ({s.category === 'primary' ? '1–4 sinflar' : '5–11 sinflar'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Login</label>
                <input
                  type="text"
                  required
                  value={teacherForm.username}
                  onChange={(e) => setTeacherForm({ ...teacherForm, username: e.target.value })}
                  className="w-full p-2.5 rounded-xl border-2 border-slate-200 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Parol</label>
                <input
                  type="text"
                  required
                  value={teacherForm.password}
                  onChange={(e) => setTeacherForm({ ...teacherForm, password: e.target.value })}
                  className="w-full p-2.5 rounded-xl border-2 border-slate-200 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Telefon (ixtiyoriy)</label>
                <input
                  type="text"
                  value={teacherForm.phone}
                  onChange={(e) => setTeacherForm({ ...teacherForm, phone: e.target.value })}
                  className="w-full p-2.5 rounded-xl border-2 border-slate-200 text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm shadow-md transition cursor-pointer"
              >
                Saqlash
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SHOP ADD MODAL */}
      {showShopModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border-4 border-pink-100 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-800 font-['Fredoka']">
                Yangi Mahsulot Qo'shish
              </h3>
              <button onClick={() => setShowShopModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveShopItem} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nomi:</label>
                <input
                  type="text"
                  required
                  value={shopForm.name}
                  onChange={(e) => setShopForm({ ...shopForm, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border-2 border-slate-200 text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Turkumi:</label>
                  <select
                    value={shopForm.category}
                    onChange={(e) => setShopForm({ ...shopForm, category: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border-2 border-slate-200 text-xs font-bold"
                  >
                    <option value="avatar">Avatar</option>
                    <option value="frame">Ramka</option>
                    <option value="theme">Mavzu</option>
                    <option value="badge">Nishon</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Narxi (tanga):</label>
                  <input
                    type="number"
                    min={5}
                    value={shopForm.price}
                    onChange={(e) => setShopForm({ ...shopForm, price: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border-2 border-slate-200 text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Emoji / Belgisi:</label>
                <input
                  type="text"
                  required
                  value={shopForm.preview}
                  onChange={(e) => setShopForm({ ...shopForm, preview: e.target.value })}
                  className="w-full p-2.5 rounded-xl border-2 border-slate-200 text-xs font-bold text-center text-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tavsifi:</label>
                <input
                  type="text"
                  required
                  value={shopForm.description}
                  onChange={(e) => setShopForm({ ...shopForm, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border-2 border-slate-200 text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-pink-600 hover:bg-pink-700 text-white font-black text-sm shadow-md transition cursor-pointer"
              >
                Do'konga joylash
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
