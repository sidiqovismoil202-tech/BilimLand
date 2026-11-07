export type Role = 'student' | 'teacher' | 'admin';

export type GradeLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

export interface BaseUser {
  id: string;
  role: Role;
  username: string;
  password?: string;
  firstName: string;
  lastName: string;
  createdAt: string;
}

export interface StudentUser extends BaseUser {
  role: 'student';
  grade: GradeLevel;
  coins: number;
  avatar: string;
  frame: string;
  theme: string;
  badge: string;
  inventory: string[]; // array of shop item IDs
  completedLessons: string[]; // lesson IDs completed
  askedQuestionIds: string[]; // IDs of questions already asked (so they are NEVER repeated!)
  testResults: {
    lessonId: string;
    subjectId: string;
    score: number;
    total: number;
    percentage: number;
    coinsEarned: number;
    date: string;
  }[];
}

export interface TeacherUser extends BaseUser {
  role: 'teacher';
  subjectId: string; // which subject they teach
  phone?: string;
}

export interface AdminUser extends BaseUser {
  role: 'admin';
}

export type AppUser = StudentUser | TeacherUser | AdminUser;

export interface Subject {
  id: string;
  name: string;
  icon: string; // emoji or icon name
  color: string; // Tailwind color class or hex
  bgGradient: string;
  category: 'primary' | 'secondary' | 'all'; // 1-4 vs 5-11
  description: string;
  gradeRange: [number, number]; // [1, 4] or [5, 11]
}

export interface Lesson {
  id: string;
  subjectId: string;
  grade: GradeLevel;
  dayNumber: number; // 1-kun, 2-kun, 3-kun...
  title: string;
  summary: string;
  content: string; // rich text / explanation
  examples: string[]; // practical examples
  keyTakeaways: string[]; // visual highlight points
  coinsReward: number; // usually 10
}

export type QuestionType = 'choice' | 'written';

export interface Question {
  id: string;
  lessonId?: string; // optional specific lesson or general subject bank
  subjectId: string;
  gradeRange: [number, number];
  type: QuestionType;
  prompt: string;
  options?: string[]; // 4 options for 'choice' type
  correctAnswer: string; // option letter or text string for auto-check
  explanation?: string;
  hint?: string;
}

export interface WrittenSubmission {
  id: string;
  studentId: string;
  studentName: string;
  studentGrade: GradeLevel;
  subjectId: string;
  lessonId: string;
  questionId: string;
  questionPrompt: string;
  studentAnswer: string;
  correctAnswerReference: string;
  submittedAt: string;
  status: 'pending' | 'graded';
  teacherGrade?: number; // e.g. 5 or percentage
  teacherFeedback?: string;
  coinsAwarded?: number;
}

export type ShopCategory = 'avatar' | 'frame' | 'theme' | 'badge' | 'sticker';

export interface ShopItem {
  id: string;
  name: string;
  category: ShopCategory;
  price: number;
  preview: string; // emoji or visual styling description
  cssValue: string; // custom css or avatar string
  description: string;
  available: boolean;
}

export type GameType = 'speed_quiz' | 'memory_match' | 'word_puzzle' | 'math_rush' | 'true_false';

export interface GameInfo {
  id: string;
  type: GameType;
  title: string;
  description: string;
  icon: string;
  coinReward: number;
}
