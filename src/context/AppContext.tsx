import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AppUser,
  StudentUser,
  TeacherUser,
  AdminUser,
  Lesson,
  Question,
  ShopItem,
  WrittenSubmission,
  GradeLevel,
  Subject,
} from '../types';
import {
  ALL_SUBJECTS,
  PRIMARY_SUBJECTS,
  SECONDARY_SUBJECTS,
  INITIAL_LESSONS,
  INITIAL_QUESTIONS,
  INITIAL_SHOP_ITEMS,
  INITIAL_ADMIN,
  INITIAL_TEACHERS,
  INITIAL_STUDENTS,
} from '../data/initialData';
import { playCoinSound, playSuccessSound, playFanfareSound } from '../utils/audio';

interface AppContextType {
  currentUser: AppUser | null;
  students: StudentUser[];
  teachers: TeacherUser[];
  admin: AdminUser;
  lessons: Lesson[];
  questions: Question[];
  shopItems: ShopItem[];
  writtenSubmissions: WrittenSubmission[];
  allSubjects: Subject[];
  
  // Auth
  login: (username: string, password: string,roleHint?: 'student' | 'teacher' | 'admin') => { success: boolean; message?: string };
  registerStudent: (data: {
    firstName: string;
    lastName: string;
    grade: GradeLevel;
    username: string;
    password: string;
  }) => { success: boolean; message?: string };
  logout: () => void;
  updateAdminPassword: (newPassword: string) => boolean;

  // Student operations
  completeLesson: (lessonId: string) => void;
  submitTestResult: (
    lessonId: string,
    subjectId: string,
    score: number,
    total: number,
    coinsEarned: number,
    usedQuestionIds: string[]
  ) => void;
  submitWrittenAnswer: (data: {
    subjectId: string;
    lessonId: string;
    questionId: string;
    questionPrompt: string;
    studentAnswer: string;
    correctAnswerReference: string;
  }) => void;
  buyShopItem: (itemId: string) => { success: boolean; message: string };
  equipShopItem: (itemId: string) => void;
  awardGameReward: (coins: number, title?: string) => void;
  getQuestionsForLesson: (lessonId: string, studentId?: string) => Question[];
  getAvailableSubjectQuestions: (subjectId: string, grade: GradeLevel, studentId?: string) => Question[];

  // Teacher operations
  addLesson: (lesson: Omit<Lesson, 'id'>) => void;
  updateLesson: (lesson: Lesson) => void;
  deleteLesson: (lessonId: string) => void;
  addQuestion: (question: Omit<Question, 'id'>) => void;
  deleteQuestion: (questionId: string) => void;
  gradeWrittenSubmission: (submissionId: string, grade: number, feedback: string, bonusCoins: number) => void;

  // Admin operations
  addTeacher: (teacher: Omit<TeacherUser, 'id' | 'role' | 'createdAt'>) => void;
  updateTeacher: (teacher: TeacherUser) => void;
  deleteTeacher: (teacherId: string) => void;
  addStudentByAdmin: (student: Omit<StudentUser, 'id' | 'role' | 'createdAt' | 'coins' | 'avatar' | 'frame' | 'theme' | 'badge' | 'inventory' | 'completedLessons' | 'askedQuestionIds' | 'testResults'>) => void;
  updateStudent: (student: StudentUser) => void;
  deleteStudent: (studentId: string) => void;
  addShopItem: (item: Omit<ShopItem, 'id'>) => void;
  updateShopItem: (item: ShopItem) => void;
  deleteShopItem: (itemId: string) => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEYS = {
  CURRENT_USER: 'bilimland_user_v1',
  STUDENTS: 'bilimland_students_v1',
  TEACHERS: 'bilimland_teachers_v1',
  ADMIN: 'bilimland_admin_v1',
  LESSONS: 'bilimland_lessons_v1',
  QUESTIONS: 'bilimland_questions_v1',
  SHOP_ITEMS: 'bilimland_shop_items_v1',
  SUBMISSIONS: 'bilimland_submissions_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load data from localStorage or fallback to initial
  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [students, setStudents] = useState<StudentUser[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  });

  const [teachers, setTeachers] = useState<TeacherUser[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TEACHERS);
      return saved ? JSON.parse(saved) : INITIAL_TEACHERS;
    } catch {
      return INITIAL_TEACHERS;
    }
  });

  const [admin, setAdmin] = useState<AdminUser>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ADMIN);
      return saved ? JSON.parse(saved) : INITIAL_ADMIN;
    } catch {
      return INITIAL_ADMIN;
    }
  });

  const [lessons, setLessons] = useState<Lesson[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LESSONS);
      return saved ? JSON.parse(saved) : INITIAL_LESSONS;
    } catch {
      return INITIAL_LESSONS;
    }
  });

  const [questions, setQuestions] = useState<Question[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
      return saved ? JSON.parse(saved) : INITIAL_QUESTIONS;
    } catch {
      return INITIAL_QUESTIONS;
    }
  });

  const [shopItems, setShopItems] = useState<ShopItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SHOP_ITEMS);
      return saved ? JSON.parse(saved) : INITIAL_SHOP_ITEMS;
    } catch {
      return INITIAL_SHOP_ITEMS;
    }
  });

  const [writtenSubmissions, setWrittenSubmissions] = useState<WrittenSubmission[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      }
    } catch {
      // ignore
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(teachers));
  }, [teachers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ADMIN, JSON.stringify(admin));
  }, [admin]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LESSONS, JSON.stringify(lessons));
  }, [lessons]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
  }, [questions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SHOP_ITEMS, JSON.stringify(shopItems));
  }, [shopItems]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(writtenSubmissions));
  }, [writtenSubmissions]);

  // Keep currentUser synced if their student record is updated
  useEffect(() => {
    if (currentUser?.role === 'student') {
      const currentStudent = students.find((s) => s.id === currentUser.id);
      if (currentStudent && JSON.stringify(currentStudent) !== JSON.stringify(currentUser)) {
        setCurrentUser(currentStudent);
      }
    }
  }, [students]);

  // Auth: Login
  const login = (username: string, password: string, roleHint?: 'student' | 'teacher' | 'admin') => {
    const trimmedUser = username.trim().toLowerCase();
    const trimmedPass = password.trim();

    // Check admin
    if ((!roleHint || roleHint === 'admin') && trimmedUser === admin.username.toLowerCase()) {
      if (trimmedPass === admin.password) {
        setCurrentUser(admin);
        return { success: true };
      }
      return { success: false, message: 'Admin paroli noto\'g\'ri!' };
    }

    // Check teacher
    if (!roleHint || roleHint === 'teacher') {
      const teacher = teachers.find(
        (t) => t.username.toLowerCase() === trimmedUser && t.password === trimmedPass
      );
      if (teacher) {
        setCurrentUser(teacher);
        return { success: true };
      }
    }

    // Check student
    if (!roleHint || roleHint === 'student') {
      const student = students.find(
        (s) => s.username.toLowerCase() === trimmedUser && s.password === trimmedPass
      );
      if (student) {
        setCurrentUser(student);
        return { success: true };
      }
    }

    return { success: false, message: 'Login yoki parol xato kiritildi!' };
  };

  // Auth: Register student
  const registerStudent = (data: {
    firstName: string;
    lastName: string;
    grade: GradeLevel;
    username: string;
    password: string;
  }) => {
    const cleanUsername = data.username.trim().toLowerCase();
    if (!cleanUsername || cleanUsername.length < 3) {
      return { success: false, message: 'Login kamida 3 ta belgidan iborat bo\'lishi kerak!' };
    }
    if (!data.password || data.password.length < 4) {
      return { success: false, message: 'Parol kamida 4 ta belgidan iborat bo\'lishi kerak!' };
    }

    // Check uniqueness
    const existsInStudents = students.some((s) => s.username.toLowerCase() === cleanUsername);
    const existsInTeachers = teachers.some((t) => t.username.toLowerCase() === cleanUsername);
    const existsInAdmin = admin.username.toLowerCase() === cleanUsername;

    if (existsInStudents || existsInTeachers || existsInAdmin) {
      return { success: false, message: 'Ushbu login band! Boshqa login tanlang.' };
    }

    const newStudent: StudentUser = {
      id: 'stud_' + Date.now(),
      role: 'student',
      username: cleanUsername,
      password: data.password.trim(),
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      grade: data.grade,
      coins: 50, // Welcome gift!
      avatar: '🦉',
      frame: '',
      theme: 'default',
      badge: '⭐ Bilimdon',
      inventory: ['shop_av_1', 'shop_bd_1'],
      completedLessons: [],
      askedQuestionIds: [],
      testResults: [],
      createdAt: new Date().toISOString().split('T')[0],
    };

    setStudents((prev) => [newStudent, ...prev]);
    setCurrentUser(newStudent);
    playSuccessSound();
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateAdminPassword = (newPassword: string) => {
    if (!newPassword || newPassword.length < 4) return false;
    const updated = { ...admin, password: newPassword };
    setAdmin(updated);
    if (currentUser?.role === 'admin') {
      setCurrentUser(updated);
    }
    return true;
  };

  // Student Actions
  const completeLesson = (lessonId: string) => {
    if (currentUser?.role !== 'student') return;
    const student = currentUser as StudentUser;
    if (student.completedLessons.includes(lessonId)) return; // already done

    const lesson = lessons.find((l) => l.id === lessonId);
    const reward = lesson?.coinsReward || 10;

    const updatedStudent: StudentUser = {
      ...student,
      coins: student.coins + reward,
      completedLessons: [...student.completedLessons, lessonId],
    };

    setStudents((prev) => prev.map((s) => (s.id === student.id ? updatedStudent : s)));
    setCurrentUser(updatedStudent);
    playCoinSound();
  };

  const submitTestResult = (
    lessonId: string,
    subjectId: string,
    score: number,
    total: number,
    coinsEarned: number,
    usedQuestionIds: string[]
  ) => {
    if (currentUser?.role !== 'student') return;
    const student = currentUser as StudentUser;

    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
    const newResult = {
      lessonId,
      subjectId,
      score,
      total,
      percentage,
      coinsEarned,
      date: new Date().toISOString().split('T')[0],
    };

    // Merge used question IDs into askedQuestionIds so they NEVER repeat!
    const uniqueAsked = Array.from(new Set([...student.askedQuestionIds, ...usedQuestionIds]));

    const updatedStudent: StudentUser = {
      ...student,
      coins: student.coins + coinsEarned,
      askedQuestionIds: uniqueAsked,
      testResults: [newResult, ...student.testResults],
    };

    setStudents((prev) => prev.map((s) => (s.id === student.id ? updatedStudent : s)));
    setCurrentUser(updatedStudent);

    if (coinsEarned > 0) {
      playCoinSound();
    }
  };

  const submitWrittenAnswer = (data: {
    subjectId: string;
    lessonId: string;
    questionId: string;
    questionPrompt: string;
    studentAnswer: string;
    correctAnswerReference: string;
  }) => {
    if (currentUser?.role !== 'student') return;
    const student = currentUser as StudentUser;

    const newSub: WrittenSubmission = {
      id: 'sub_' + Date.now(),
      studentId: student.id,
      studentName: `${student.firstName} ${student.lastName}`,
      studentGrade: student.grade,
      subjectId: data.subjectId,
      lessonId: data.lessonId,
      questionId: data.questionId,
      questionPrompt: data.questionPrompt,
      studentAnswer: data.studentAnswer,
      correctAnswerReference: data.correctAnswerReference,
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'pending',
    };

    setWrittenSubmissions((prev) => [newSub, ...prev]);

    // Track question as asked
    if (!student.askedQuestionIds.includes(data.questionId)) {
      const updatedStudent: StudentUser = {
        ...student,
        askedQuestionIds: [...student.askedQuestionIds, data.questionId],
      };
      setStudents((prev) => prev.map((s) => (s.id === student.id ? updatedStudent : s)));
      setCurrentUser(updatedStudent);
    }

    playSuccessSound();
  };

  const buyShopItem = (itemId: string) => {
    if (currentUser?.role !== 'student') {
      return { success: false, message: 'Faqat o\'quvchilar xarid qila oladi!' };
    }
    const student = currentUser as StudentUser;
    const item = shopItems.find((i) => i.id === itemId);

    if (!item) {
      return { success: false, message: 'Mahsulot topilmadi!' };
    }
    if (student.inventory.includes(itemId)) {
      return { success: false, message: 'Bu buyum allaqachon sotib olingan!' };
    }
    if (student.coins < item.price) {
      return { success: false, message: `Tangalar yetarli emas! Sizda ${student.coins} ta, kerak: ${item.price} ta.` };
    }

    const updatedStudent: StudentUser = {
      ...student,
      coins: student.coins - item.price,
      inventory: [...student.inventory, itemId],
    };

    setStudents((prev) => prev.map((s) => (s.id === student.id ? updatedStudent : s)));
    setCurrentUser(updatedStudent);
    playCoinSound();
    return { success: true, message: `Tabriklaymiz! "${item.name}" sotib olindi!` };
  };

  const equipShopItem = (itemId: string) => {
    if (currentUser?.role !== 'student') return;
    const student = currentUser as StudentUser;
    const item = shopItems.find((i) => i.id === itemId);
    if (!item) return;

    const updatedStudent: StudentUser = { ...student };
    if (item.category === 'avatar') {
      updatedStudent.avatar = item.cssValue || item.preview;
    } else if (item.category === 'frame') {
      updatedStudent.frame = item.cssValue;
    } else if (item.category === 'theme') {
      updatedStudent.theme = item.cssValue;
    } else if (item.category === 'badge') {
      updatedStudent.badge = item.cssValue;
    }

    setStudents((prev) => prev.map((s) => (s.id === student.id ? updatedStudent : s)));
    setCurrentUser(updatedStudent);
    playSuccessSound();
  };

  const awardGameReward = (coins: number) => {
    if (currentUser?.role !== 'student' || coins <= 0) return;
    const student = currentUser as StudentUser;

    const updatedStudent: StudentUser = {
      ...student,
      coins: student.coins + coins,
    };
    setStudents((prev) => prev.map((s) => (s.id === student.id ? updatedStudent : s)));
    setCurrentUser(updatedStudent);
    playCoinSound();
    playFanfareSound();
  };

  // Filter questions: only questions that student has NOT answered yet!
  const getQuestionsForLesson = (lessonId: string, studentId?: string) => {
    const student = studentId
      ? students.find((s) => s.id === studentId)
      : currentUser?.role === 'student'
      ? (currentUser as StudentUser)
      : null;

    const lessonQuestions = questions.filter((q) => q.lessonId === lessonId);
    if (!student) return lessonQuestions;

    // Filter out already asked questions
    return lessonQuestions.filter((q) => !student.askedQuestionIds.includes(q.id));
  };

  const getAvailableSubjectQuestions = (subjectId: string, grade: GradeLevel, studentId?: string) => {
    const student = studentId
      ? students.find((s) => s.id === studentId)
      : currentUser?.role === 'student'
      ? (currentUser as StudentUser)
      : null;

    const pool = questions.filter(
      (q) =>
        q.subjectId === subjectId &&
        grade >= q.gradeRange[0] &&
        grade <= q.gradeRange[1]
    );

    if (!student) return pool;
    return pool.filter((q) => !student.askedQuestionIds.includes(q.id));
  };

  // Teacher actions
  const addLesson = (data: Omit<Lesson, 'id'>) => {
    const newLesson: Lesson = {
      ...data,
      id: 'les_' + Date.now(),
    };
    setLessons((prev) => [...prev, newLesson]);
  };

  const updateLesson = (lesson: Lesson) => {
    setLessons((prev) => prev.map((l) => (l.id === lesson.id ? lesson : l)));
  };

  const deleteLesson = (lessonId: string) => {
    setLessons((prev) => prev.filter((l) => l.id !== lessonId));
  };

  const addQuestion = (data: Omit<Question, 'id'>) => {
    const newQ: Question = {
      ...data,
      id: 'q_' + Date.now(),
    };
    setQuestions((prev) => [...prev, newQ]);
  };

  const deleteQuestion = (questionId: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== questionId));
  };

  const gradeWrittenSubmission = (
    submissionId: string,
    grade: number,
    feedback: string,
    bonusCoins: number
  ) => {
    const submission = writtenSubmissions.find((s) => s.id === submissionId);
    if (!submission) return;

    const updatedSubmissions = writtenSubmissions.map((s) =>
      s.id === submissionId
        ? {
            ...s,
            status: 'graded' as const,
            teacherGrade: grade,
            teacherFeedback: feedback,
            coinsAwarded: bonusCoins,
          }
        : s
    );
    setWrittenSubmissions(updatedSubmissions);

    // Award bonus coins to student
    if (bonusCoins > 0) {
      setStudents((prev) =>
        prev.map((stud) =>
          stud.id === submission.studentId
            ? { ...stud, coins: stud.coins + bonusCoins }
            : stud
        )
      );
    }
    playSuccessSound();
  };

  // Admin actions
  const addTeacher = (data: Omit<TeacherUser, 'id' | 'role' | 'createdAt'>) => {
    const newT: TeacherUser = {
      ...data,
      id: 'teach_' + Date.now(),
      role: 'teacher',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setTeachers((prev) => [...prev, newT]);
  };

  const updateTeacher = (teacher: TeacherUser) => {
    setTeachers((prev) => prev.map((t) => (t.id === teacher.id ? teacher : t)));
    if (currentUser?.id === teacher.id) {
      setCurrentUser(teacher);
    }
  };

  const deleteTeacher = (teacherId: string) => {
    setTeachers((prev) => prev.filter((t) => t.id !== teacherId));
  };

  const addStudentByAdmin = (
    data: Omit<StudentUser, 'id' | 'role' | 'createdAt' | 'coins' | 'avatar' | 'frame' | 'theme' | 'badge' | 'inventory' | 'completedLessons' | 'askedQuestionIds' | 'testResults'>
  ) => {
    const newS: StudentUser = {
      ...data,
      id: 'stud_' + Date.now(),
      role: 'student',
      coins: 50,
      avatar: '🦉',
      frame: '',
      theme: 'default',
      badge: '⭐ Bilimdon',
      inventory: ['shop_av_1', 'shop_bd_1'],
      completedLessons: [],
      askedQuestionIds: [],
      testResults: [],
      createdAt: new Date().toISOString().split('T')[0],
    };
    setStudents((prev) => [newS, ...prev]);
  };

  const updateStudent = (student: StudentUser) => {
    setStudents((prev) => prev.map((s) => (s.id === student.id ? student : s)));
    if (currentUser?.id === student.id) {
      setCurrentUser(student);
    }
  };

  const deleteStudent = (studentId: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== studentId));
  };

  const addShopItem = (data: Omit<ShopItem, 'id'>) => {
    const newItem: ShopItem = {
      ...data,
      id: 'shop_' + Date.now(),
    };
    setShopItems((prev) => [...prev, newItem]);
  };

  const updateShopItem = (item: ShopItem) => {
    setShopItems((prev) => prev.map((i) => (i.id === item.id ? item : i)));
  };

  const deleteShopItem = (itemId: string) => {
    setShopItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  const resetAllData = () => {
    setStudents(INITIAL_STUDENTS);
    setTeachers(INITIAL_TEACHERS);
    setAdmin(INITIAL_ADMIN);
    setLessons(INITIAL_LESSONS);
    setQuestions(INITIAL_QUESTIONS);
    setShopItems(INITIAL_SHOP_ITEMS);
    setWrittenSubmissions([]);
    setCurrentUser(null);
    localStorage.clear();
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        students,
        teachers,
        admin,
        lessons,
        questions,
        shopItems,
        writtenSubmissions,
        allSubjects: ALL_SUBJECTS,
        login,
        registerStudent,
        logout,
        updateAdminPassword,
        completeLesson,
        submitTestResult,
        submitWrittenAnswer,
        buyShopItem,
        equipShopItem,
        awardGameReward,
        getQuestionsForLesson,
        getAvailableSubjectQuestions,
        addLesson,
        updateLesson,
        deleteLesson,
        addQuestion,
        deleteQuestion,
        gradeWrittenSubmission,
        addTeacher,
        updateTeacher,
        deleteTeacher,
        addStudentByAdmin,
        updateStudent,
        deleteStudent,
        addShopItem,
        updateShopItem,
        deleteShopItem,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
