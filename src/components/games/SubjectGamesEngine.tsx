import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Subject, GameType, StudentUser } from '../../types';
import { playClickSound, playSuccessSound, playErrorSound, playCoinSound } from '../../utils/audio';
import { fireSchoolConfetti, fireCoinShower } from '../../utils/confetti';
import { 
  X, 
  Sparkles, 
  Trophy, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  RotateCcw, 
  ChevronRight,
  Zap,
  ArrowRight
} from 'lucide-react';

interface SubjectGamesEngineProps {
  subject: Subject;
  isOpen: boolean;
  onClose: () => void;
  gameType?: GameType;
}

// Subject-specific content database for game variations
interface SubjectGameContent {
  memoryPairs: { term: string; match: string }[];
  scrambleWords: { word: string; clue: string }[];
  trueFalse: { statement: string; isTrue: boolean; fact: string }[];
  mathQuestions?: { q: string; a: number; opts: number[] }[];
  speedQuestions: { q: string; opts: string[]; a: string }[];
}

const GAME_CONTENT: Record<string, SubjectGameContent> = {
  ona_tili: {
    memoryPairs: [
      { term: 'Unli', match: 'To\'siqsiz tovush' },
      { term: 'Undosh', match: 'To\'siqli tovush' },
      { term: 'Ot', match: 'Kim? Nima?' },
      { term: 'Fe\'l', match: 'Nima qildi?' },
    ],
    scrambleWords: [
      { word: 'ALIFBO', clue: 'Barcha harflar tartibi' },
      { word: 'LUGAT', clue: 'So\'zlar jamlangan kitob' },
      { word: 'NUQTA', clue: 'Gap oxiridagi tinish belgisi' },
    ],
    trueFalse: [
      { statement: 'O\'zbek alifbosida 29 ta harf bor.', isTrue: true, fact: '29 harf va 1 ta tutuq belgisi mavjud.' },
      { statement: 'Har bir bo\'g\'inda unli bo\'lishi shart emas.', isTrue: false, fact: 'Har bir bo\'g\'inda albatta unli bo\'ladi!' },
      { statement: 'Atoqli otlar bosh harf bilan yoziladi.', isTrue: true, fact: 'Shahar va kishi ismlari doim katta harf bilan.' },
    ],
    speedQuestions: [
      { q: 'Qaysi biri unli harf?', opts: ['M', 'O', 'K', 'S'], a: 'O' },
      { q: '"Quyosh" so\'zi necha bo\'g\'in?', opts: ['1', '2', '3', '4'], a: '2' },
      { q: 'Eshitiladigan va aytiladigan narsa nima?', opts: ['Harf', 'Tovush', 'Rasm', 'Nuqta'], a: 'Tovush' },
    ],
  },
  matematika: {
    memoryPairs: [
      { term: '10 + 10', match: '20' },
      { term: '5 × 5', match: '25' },
      { term: '100 - 40', match: '60' },
      { term: '7 × 3', match: '21' },
    ],
    scrambleWords: [
      { word: 'YIGINDI', clue: 'Qo\'shish amali natijasi' },
      { word: 'AYIRMA', clue: 'Ayirish amali natijasi' },
      { word: 'TORTBURCHAK', clue: 'To\'rtta tomoni bor shakl' },
    ],
    trueFalse: [
      { statement: 'Har qanday sonni 0 ga ko\'paytirsa 0 chiqadi.', isTrue: true, fact: '0 ga ko\'paytirish doimo 0 beradi.' },
      { statement: '1 metrda 10 santimetr bor.', isTrue: false, fact: '1 metrda 100 santimetr bor!' },
      { statement: 'Eng kichik ikki xonali son — 10.', isTrue: true, fact: '10 eng kichik 2 xonali sondir.' },
    ],
    mathQuestions: [
      { q: '14 + 18 = ?', a: 32, opts: [30, 32, 28, 34] },
      { q: '50 - 23 = ?', a: 27, opts: [25, 27, 33, 29] },
      { q: '6 × 4 = ?', a: 24, opts: [20, 24, 28, 18] },
      { q: '81 ÷ 9 = ?', a: 9, opts: [7, 8, 9, 10] },
    ],
    speedQuestions: [
      { q: '3 o\'nlik va 5 birlik qaysi son?', opts: ['53', '35', '8', '305'], a: '35' },
      { q: '4 × 7 nechaga teng?', opts: ['24', '28', '32', '30'], a: '28' },
      { q: '1 soatda necha daqiqa bor?', opts: ['30', '60', '100', '24'], a: '60' },
    ],
  },
  ingliz_tili: {
    memoryPairs: [
      { term: 'Apple', match: 'Olma' },
      { term: 'Book', match: 'Kitob' },
      { term: 'Cat', match: 'Mushuk' },
      { term: 'Sun', match: 'Quyosh' },
    ],
    scrambleWords: [
      { word: 'YELLOW', clue: 'Sariq rang inglizcha' },
      { word: 'SCHOOL', clue: 'Maktab ingliz tilida' },
      { word: 'FRIEND', clue: 'Do\'st degan ma\'noda' },
    ],
    trueFalse: [
      { statement: '"Dog" so\'zi mushuk degani.', isTrue: false, fact: '"Dog" — it, "Cat" — mushuk!' },
      { statement: '"Hello" salomlashish so\'zidir.', isTrue: true, fact: 'Hello — Salom degani.' },
      { statement: '"Green" yashil rangni bildiradi.', isTrue: true, fact: 'Green — Yashil.' },
    ],
    speedQuestions: [
      { q: '"Seven" qaysi son?', opts: ['5', '6', '7', '8'], a: '7' },
      { q: '"Qalam" ingliz tilida qanday?', opts: ['Pencil', 'Apple', 'Door', 'Desk'], a: 'Pencil' },
      { q: '"Good morning" nima degani?', opts: ['Xayr', 'Xayrli tong', 'Rahmat', 'Kechirasiz'], a: 'Xayrli tong' },
    ],
  },
  tarix: {
    memoryPairs: [
      { term: 'Amir Temur', match: 'Kuch — adolatda' },
      { term: 'Ulug\'bek', match: 'Yulduzlar jadvali' },
      { term: 'Samarqand', match: 'Temuriylar poytaxti' },
      { term: 'Ipak Yo\'li', match: 'Qadimiy savdo yo\'li' },
    ],
    scrambleWords: [
      { word: 'REGISTON', clue: 'Samarqanddagi mashhur maydon' },
      { word: 'SOVRIN', clue: 'G\'olibga beriladigan mukofot' },
      { word: 'SARKARDA', clue: 'Qo\'shin yetakchisi' },
    ],
    trueFalse: [
      { statement: 'Amir Temur 1336-yilda tug\'ilgan.', isTrue: true, fact: 'Amir Temur 1336-yil 9-aprelda tug\'ilgan.' },
      { statement: 'Mirzo Ulug\'bek mashhur tabib bo\'lgan.', isTrue: false, fact: 'Ulug\'bek buyuk astronom va matematik bo\'lgan (tabib esa Ibn Sino).' },
      { statement: 'Buxoro qadimiy shahar hisoblanadi.', isTrue: true, fact: 'Buxoro 2500 yildan ortiq tarixga ega.' },
    ],
    speedQuestions: [
      { q: 'Buyuk Ipak yo\'li qayerdan boshlangan?', opts: ['Xitoydan', 'Rimdan', 'Hindistondan', 'Misrdan'], a: 'Xitoydan' },
      { q: 'Ulug\'bek nechta yulduzni o\'rgangan?', opts: ['100 ta', '1018 ta', '500 ta', '2000 ta'], a: '1018 ta' },
    ],
  },
  fizika: {
    memoryPairs: [
      { term: 'Tezlik (v)', match: 'v = s / t' },
      { term: 'Kuch (F)', match: 'Nyuton (N)' },
      { term: 'Bosim (p)', match: 'Paskal (Pa)' },
      { term: 'Massa (m)', match: 'Kilogramm (kg)' },
    ],
    scrambleWords: [
      { word: 'ENERGİYA', clue: 'Ish bajarish qobiliyati' },
      { word: 'HARORAT', clue: 'Issiq-sovuqlik darajasi' },
      { word: 'NYUTON', clue: 'Kuch birligi nomi' },
    ],
    trueFalse: [
      { statement: 'Yerning barcha narsalarni tortishi og\'irlik kuchi deyiladi.', isTrue: true, fact: 'Gravitatsiya Yer markaziga tortadi.' },
      { statement: 'Yorug\'lik tovushdan sekinroq harakatlanadi.', isTrue: false, fact: 'Yorug\'lik tovushdan ancha tez tarqaladi!' },
      { statement: 'Suv 100 darajada qaynaydi.', isTrue: true, fact: 'Oddiy bosimda suv 100°C da qaynaydi.' },
    ],
    speedQuestions: [
      { q: 'Tezlik formulasi qaysi?', opts: ['s / t', 's * t', 't / s', 'm * a'], a: 's / t' },
      { q: 'Erkin tushish tezlanishi g taxminan nechaga teng?', opts: ['9.8', '5.5', '15', '100'], a: '9.8' },
    ],
  },
  kimyo: {
    memoryPairs: [
      { term: 'H₂O', match: 'Suv' },
      { term: 'O₂', match: 'Kislorod' },
      { term: 'Fe', match: 'Temir' },
      { term: 'Au', match: 'Oltin' },
    ],
    scrambleWords: [
      { word: 'VODOROD', clue: 'Koinotdagi eng yengil element' },
      { word: 'MOLEKULA', clue: 'Atomlardan tashkil topgan zarracha' },
      { word: 'REAKSIYA', clue: 'Kimyoviy o\'zgarish jarayoni' },
    ],
    trueFalse: [
      { statement: 'Atom markazida yadro joylashgan.', isTrue: true, fact: 'Atom yadrosida proton va neytronlar bor.' },
      { statement: 'Temirning zanglashi kimyoviy jarayon emas.', isTrue: false, fact: 'Zanglash — temirning kislorod bilan reaksiyasidir.' },
      { statement: 'Havo toza bitta moddadan iborat.', isTrue: false, fact: 'Havo gazlar aralashmasidir (azot, kislorod, va h.k.).' },
    ],
    speedQuestions: [
      { q: 'Suvning kimyoviy formulasi nima?', opts: ['CO₂', 'H₂O', 'NaCl', 'O₂'], a: 'H₂O' },
      { q: 'Mendeleyev jadvali nimani ko\'rsatadi?', opts: ['Shaharlarni', 'Kimyoviy elementlarni', 'Yulduzlarni', 'O\'simliklarni'], a: 'Kimyoviy elementlarni' },
    ],
  },
  geografiya: {
    memoryPairs: [
      { term: 'Yevroosiyo', match: 'Eng katta qit\'a' },
      { term: 'Tinch okeani', match: 'Eng katta okean' },
      { term: 'Nil', match: 'Eng uzun daryo' },
      { term: 'Everest', match: 'Eng baland cho\'qqi' },
    ],
    scrambleWords: [
      { word: 'OKEAN', clue: 'Katta suv havzasi' },
      { word: 'EKVATOR', clue: 'Yerni teng ikkiga bo\'luvchi chiziq' },
      { word: 'CHOQQI', clue: 'Tog\'ning eng baland joyi' },
    ],
    trueFalse: [
      { statement: 'Yer yuzida 4 ta okean bor.', isTrue: true, fact: 'Tinch, Atlantika, Hind va Shimoliy Muz okeanlari.' },
      { statement: 'O\'zbekiston okean sohilida joylashgan.', isTrue: false, fact: 'O\'zbekiston quruqlik ichida joylashgan.' },
      { statement: 'Avstraliya eng kichik qit\'adir.', isTrue: true, fact: 'Avstraliya — eng kichik materik.' },
    ],
    speedQuestions: [
      { q: 'Eng katta qit\'a qaysi?', opts: ['Afrika', 'Yevroosiyo', 'Amerika', 'Avstraliya'], a: 'Yevroosiyo' },
      { q: 'Kompas nimani ko\'rsatadi?', opts: ['Haroratni', 'Ufq tomonlarini', 'Vaqtni', 'Shamollarni'], a: 'Ufq tomonlarini' },
    ],
  },
};

// Generic fallback content builder for any other subject
function getSubjectContent(subjectId: string): SubjectGameContent {
  const cleanKey = subjectId.replace('_p', '').replace('_s', '');
  if (GAME_CONTENT[cleanKey]) {
    return GAME_CONTENT[cleanKey];
  }
  return {
    memoryPairs: [
      { term: 'Bilim', match: 'Muvaffaqiyat kaliti' },
      { term: 'Kitob', match: 'Eng yaqin do\'st' },
      { term: 'Mehnat', match: 'Ezgulik mevasi' },
      { term: 'Aql', match: 'Tafakkur nuri' },
    ],
    scrambleWords: [
      { word: 'BILIM', clue: 'O\'rganish orqali erishiladigan boylik' },
      { word: 'MAKTAB', clue: 'Ilm maskani' },
      { word: 'USTOZ', clue: 'Yo\'l ko\'rsatuvchi murabbiy' },
    ],
    trueFalse: [
      { statement: 'Har kuni dars qilish aql-idrokni o\'stiradi.', isTrue: true, fact: 'Doimiy mashg\'ulot miyani rivojlantiradi.' },
      { statement: 'Xatolar orqali yangi bilim o\'rganilmaydi.', isTrue: false, fact: 'Xatolardan saboq olib kuchli bo\'lamiz!' },
      { statement: 'Kitob o\'qish so\'z boyligini kengaytiradi.', isTrue: true, fact: 'Kitob mutolaasi boy nutq keltiradi.' },
    ],
    speedQuestions: [
      { q: 'Bilim olishning eng muhim sharti nima?', opts: ['Qiziqish va intilish', 'Uxlash', 'Televizor', 'O\'yin'], a: 'Qiziqish va intilish' },
      { q: 'Yaxshi natijaga qanday erishiladi?', opts: ['Mehnat orqali', 'Dangasalik bilan', 'Bekorchilikdan', 'Unutish bilan'], a: 'Mehnat orqali' },
    ],
  };
}

export const SubjectGamesEngine: React.FC<SubjectGamesEngineProps> = ({
  subject,
  isOpen,
  onClose,
  gameType = 'speed_quiz',
}) => {
  const { awardGameReward, currentUser } = useApp();
  const [selectedGame, setSelectedGame] = useState<GameType>(gameType);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [coinsWon, setCoinsWon] = useState(0);

  // Load content
  const content = getSubjectContent(subject.id);

  // Reset when subject or type changes
  useEffect(() => {
    setSelectedGame(gameType);
    setScore(0);
    setIsGameOver(false);
    setCoinsWon(0);
  }, [gameType, subject]);

  if (!isOpen) return null;

  const handleFinishGame = (earnedScore: number, coins: number) => {
    setScore(earnedScore);
    setCoinsWon(coins);
    setIsGameOver(true);
    if (coins > 0) {
      awardGameReward(coins, subject.name);
      fireSchoolConfetti();
      fireCoinShower();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border-4 border-indigo-200 flex flex-col max-h-[92vh]">
        
        {/* Game Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-4 sm:p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shadow-inner">
              {subject.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black font-['Fredoka']">{subject.name} O'yinlari</h3>
                <span className="text-xs bg-amber-400 text-amber-950 font-black px-2 py-0.5 rounded-full">
                  +15 - 25 Tanga 🪙
                </span>
              </div>
              <p className="text-xs text-white/80 font-medium">
                Quvnoq o'yin orqali fanni mustahkamlash va sovg'alar yutish
              </p>
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

        {/* Game Type Switcher */}
        {!isGameOver && (
          <div className="p-2 bg-slate-100 border-b border-slate-200 flex gap-1.5 overflow-x-auto">
            <button
              onClick={() => {
                playClickSound();
                setSelectedGame('speed_quiz');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap cursor-pointer transition ${
                selectedGame === 'speed_quiz' ? 'bg-indigo-600 text-white shadow' : 'bg-white text-slate-700 hover:bg-slate-200'
              }`}
            >
              ⚡ Tezkor savol
            </button>
            <button
              onClick={() => {
                playClickSound();
                setSelectedGame('memory_match');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap cursor-pointer transition ${
                selectedGame === 'memory_match' ? 'bg-purple-600 text-white shadow' : 'bg-white text-slate-700 hover:bg-slate-200'
              }`}
            >
              🃏 Juftlikni top
            </button>
            <button
              onClick={() => {
                playClickSound();
                setSelectedGame('word_puzzle');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap cursor-pointer transition ${
                selectedGame === 'word_puzzle' ? 'bg-pink-600 text-white shadow' : 'bg-white text-slate-700 hover:bg-slate-200'
              }`}
            >
              🧩 So'z ustasi
            </button>
            <button
              onClick={() => {
                playClickSound();
                setSelectedGame('true_false');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap cursor-pointer transition ${
                selectedGame === 'true_false' ? 'bg-amber-600 text-white shadow' : 'bg-white text-slate-700 hover:bg-slate-200'
              }`}
            >
              ⚖️ Rost yoki Yolg'on
            </button>
            {content.mathQuestions && (
              <button
                onClick={() => {
                  playClickSound();
                  setSelectedGame('math_rush');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap cursor-pointer transition ${
                  selectedGame === 'math_rush' ? 'bg-emerald-600 text-white shadow' : 'bg-white text-slate-700 hover:bg-slate-200'
                }`}
              >
                🚀 Hisob poygasi
              </button>
            )}
          </div>
        )}

        {/* Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {isGameOver ? (
            /* Game Victory Screen */
            <div className="text-center py-6 space-y-4 animate-in zoom-in-95">
              <div className="w-24 h-24 mx-auto rounded-3xl bg-amber-100 border-4 border-amber-300 flex items-center justify-center text-5xl shadow-lg animate-bounce">
                🏆
              </div>
              <div>
                <h4 className="text-2xl font-black text-slate-800 font-['Fredoka']">
                  Qoyilmaqom, Barakalla!
                </h4>
                <p className="text-slate-600 font-medium text-sm mt-1">
                  Siz o'yinni muvaffaqiyatli yakunladingiz!
                </p>
              </div>

              <div className="bg-gradient-to-r from-amber-50 to-yellow-100 p-4 rounded-2xl border-2 border-amber-200 max-w-sm mx-auto shadow-sm">
                <div className="text-sm font-bold text-amber-800">To'plangan mukofot:</div>
                <div className="text-3xl font-black text-amber-600 font-['Fredoka'] flex items-center justify-center gap-2 mt-1">
                  <span>+{coinsWon} Tanga</span>
                  <span className="text-2xl animate-spin" style={{ animationDuration: '3s' }}>🪙</span>
                </div>
                <div className="text-xs text-amber-700 font-semibold mt-1">
                  Natija: {score} ball! Tangalar hisobingizga qo'shildi.
                </div>
              </div>

              <div className="flex justify-center gap-3 pt-3">
                <button
                  onClick={() => {
                    playClickSound();
                    setIsGameOver(false);
                  }}
                  className="px-6 py-3 rounded-2xl font-black bg-indigo-600 text-white hover:bg-indigo-700 shadow-md transition flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  Yana o'ynash
                </button>
                <button
                  onClick={() => {
                    playClickSound();
                    onClose();
                  }}
                  className="px-6 py-3 rounded-2xl font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition cursor-pointer"
                >
                  Tugatish
                </button>
              </div>
            </div>
          ) : (
            /* Active Game Router */
            <>
              {selectedGame === 'speed_quiz' && (
                <SpeedQuizGame
                  questions={content.speedQuestions}
                  onComplete={(pts) => handleFinishGame(pts, 20)}
                />
              )}
              {selectedGame === 'memory_match' && (
                <MemoryMatchGame
                  pairs={content.memoryPairs}
                  onComplete={() => handleFinishGame(100, 25)}
                />
              )}
              {selectedGame === 'word_puzzle' && (
                <WordPuzzleGame
                  words={content.scrambleWords}
                  onComplete={(pts) => handleFinishGame(pts, 15)}
                />
              )}
              {selectedGame === 'true_false' && (
                <TrueFalseGame
                  statements={content.trueFalse}
                  onComplete={(pts) => handleFinishGame(pts, 15)}
                />
              )}
              {selectedGame === 'math_rush' && content.mathQuestions && (
                <MathRushGame
                  mathQuestions={content.mathQuestions}
                  onComplete={(pts) => handleFinishGame(pts, 25)}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/* --- 1. Speed Quiz Sub-Component --- */
function SpeedQuizGame({
  questions,
  onComplete,
}: {
  questions: { q: string; opts: string[]; a: string }[];
  onComplete: (score: number) => void;
}) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(25);
  const [correctCount, setCorrectCount] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete(correctCount * 10);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, correctCount, onComplete]);

  const currentQ = questions[currentIdx % questions.length];

  const handlePick = (opt: string) => {
    if (selectedOption !== null) return;
    setSelectedOption(opt);
    const isCorrect = opt === currentQ.a;

    if (isCorrect) {
      playSuccessSound();
      setCorrectCount((c) => c + 1);
    } else {
      playErrorSound();
    }

    setTimeout(() => {
      setSelectedOption(null);
      if (currentIdx + 1 < questions.length * 2 && timeLeft > 0) {
        setCurrentIdx((i) => i + 1);
      } else {
        onComplete((correctCount + (isCorrect ? 1 : 0)) * 10);
      }
    }, 600);
  };

  return (
    <div className="space-y-4">
      {/* Timer and Score bar */}
      <div className="flex items-center justify-between bg-indigo-50 px-4 py-2.5 rounded-2xl border border-indigo-100">
        <div className="flex items-center gap-2 font-black text-indigo-700 text-sm">
          <Clock className="w-5 h-5 text-indigo-500 animate-spin" style={{ animationDuration: '8s' }} />
          <span>Vaqt: {timeLeft} soniya</span>
        </div>
        <div className="flex items-center gap-1 font-black text-amber-600 text-sm">
          <Zap className="w-4 h-4 fill-amber-500" />
          <span>To'g'ri: {correctCount} ta</span>
        </div>
      </div>

      {/* Question Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-50/50 to-purple-50/50 border-2 border-indigo-100 text-center">
        <span className="text-xs font-black uppercase text-indigo-500 tracking-wider">
          Savol #{currentIdx + 1}
        </span>
        <h4 className="text-xl font-black text-slate-800 mt-2 font-['Fredoka']">
          {currentQ.q}
        </h4>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {currentQ.opts.map((opt, i) => {
          let btnClass = 'bg-white border-2 border-slate-200 text-slate-700 hover:border-indigo-400 hover:bg-indigo-50/50';
          if (selectedOption !== null) {
            if (opt === currentQ.a) {
              btnClass = 'bg-emerald-500 text-white border-emerald-600 shadow-md';
            } else if (opt === selectedOption) {
              btnClass = 'bg-rose-500 text-white border-rose-600 shadow-md';
            }
          }

          return (
            <button
              key={i}
              onClick={() => handlePick(opt)}
              disabled={selectedOption !== null}
              className={`p-4 rounded-2xl font-black text-base transition duration-150 flex items-center justify-center cursor-pointer ${btnClass}`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* --- 2. Memory Match Sub-Component --- */
function MemoryMatchGame({
  pairs,
  onComplete,
}: {
  pairs: { term: string; match: string }[];
  onComplete: () => void;
}) {
  interface Card {
    id: number;
    text: string;
    pairId: number;
  }

  const [cards, setCards] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);

  useEffect(() => {
    // Generate card list and shuffle
    const list: Card[] = [];
    pairs.forEach((p, idx) => {
      list.push({ id: idx * 2, text: p.term, pairId: idx });
      list.push({ id: idx * 2 + 1, text: p.match, pairId: idx });
    });
    // Shuffle
    list.sort(() => Math.random() - 0.5);
    setCards(list);
  }, [pairs]);

  const handleCardClick = (id: number) => {
    if (flipped.length === 2 || flipped.includes(id) || matched.includes(id)) return;
    playClickSound();

    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const card1 = cards.find((c) => c.id === newFlipped[0])!;
      const card2 = cards.find((c) => c.id === newFlipped[1])!;

      if (card1.pairId === card2.pairId) {
        playSuccessSound();
        setMatched((prev) => [...prev, card1.id, card2.id]);
        setFlipped([]);
        if (matched.length + 2 === cards.length) {
          setTimeout(() => onComplete(), 700);
        }
      } else {
        playErrorSound();
        setTimeout(() => {
          setFlipped([]);
        }, 900);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-sm font-bold text-slate-600">
          Atama va unga mos ta'rif yoki tushunchani topib juftlang! ({matched.length / 2}/{pairs.length} juft)
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {cards.map((card) => {
          const isFlipped = flipped.includes(card.id) || matched.includes(card.id);
          const isMatched = matched.includes(card.id);

          return (
            <div
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`h-24 sm:h-28 rounded-2xl flex items-center justify-center p-2 text-center text-sm font-black cursor-pointer transition-all duration-300 transform ${
                isMatched
                  ? 'bg-emerald-500 text-white shadow-md scale-95'
                  : isFlipped
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-gradient-to-tr from-indigo-100 to-purple-100 text-indigo-400 hover:bg-indigo-200 border-2 border-indigo-200'
              }`}
            >
              {isFlipped ? (
                <span className="animate-in zoom-in-75 leading-tight">{card.text}</span>
              ) : (
                <span className="text-2xl">❓</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* --- 3. Word Scramble / Puzzle --- */
function WordPuzzleGame({
  words,
  onComplete,
}: {
  words: { word: string; clue: string }[];
  onComplete: (score: number) => void;
}) {
  const [wordIdx, setWordIdx] = useState(0);
  const [currentGuess, setCurrentGuess] = useState<string[]>([]);
  const [availableLetters, setAvailableLetters] = useState<{ id: number; char: string }[]>([]);
  const [score, setScore] = useState(0);

  const currentItem = words[wordIdx % words.length];

  useEffect(() => {
    const letters = currentItem.word.split('').map((char, i) => ({ id: i, char }));
    letters.sort(() => Math.random() - 0.5);
    setAvailableLetters(letters);
    setCurrentGuess([]);
  }, [wordIdx, currentItem]);

  const handlePickLetter = (item: { id: number; char: string }) => {
    playClickSound();
    setCurrentGuess((prev) => [...prev, item.char]);
    setAvailableLetters((prev) => prev.filter((l) => l.id !== item.id));
  };

  const handleResetGuess = () => {
    playClickSound();
    const letters = currentItem.word.split('').map((char, i) => ({ id: i, char }));
    letters.sort(() => Math.random() - 0.5);
    setAvailableLetters(letters);
    setCurrentGuess([]);
  };

  const handleCheckWord = () => {
    const assembled = currentGuess.join('');
    if (assembled === currentItem.word) {
      playSuccessSound();
      const newScore = score + 30;
      setScore(newScore);
      if (wordIdx + 1 < words.length) {
        setWordIdx((i) => i + 1);
      } else {
        onComplete(newScore);
      }
    } else {
      playErrorSound();
      handleResetGuess();
    }
  };

  return (
    <div className="space-y-5 text-center">
      <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200">
        <span className="text-xs font-black text-purple-600 uppercase">Yordamchi ma'lumot (Clue)</span>
        <h4 className="text-base sm:text-lg font-bold text-slate-800 mt-1">
          "{currentItem.clue}"
        </h4>
      </div>

      {/* Answer slots */}
      <div className="flex justify-center gap-2 flex-wrap min-h-14 items-center">
        {currentItem.word.split('').map((_, i) => (
          <div
            key={i}
            className="w-12 h-12 rounded-xl bg-slate-100 border-2 border-dashed border-indigo-300 flex items-center justify-center font-black text-xl text-indigo-700 shadow-inner"
          >
            {currentGuess[i] || ''}
          </div>
        ))}
      </div>

      {/* Scrambled letter buttons */}
      <div>
        <p className="text-xs font-bold text-slate-500 mb-2">Harflarni navbat bilan bosing:</p>
        <div className="flex justify-center gap-2 flex-wrap">
          {availableLetters.map((l) => (
            <button
              key={l.id}
              onClick={() => handlePickLetter(l)}
              className="w-11 h-11 rounded-xl bg-indigo-600 text-white font-black text-lg hover:bg-indigo-700 shadow-md cursor-pointer transition transform hover:scale-105"
            >
              {l.char}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-3 pt-2">
        <button
          onClick={handleResetGuess}
          className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 cursor-pointer"
        >
          Qaytadan boshlash
        </button>
        <button
          onClick={handleCheckWord}
          disabled={currentGuess.length !== currentItem.word.length}
          className="px-6 py-2 rounded-xl text-sm font-black text-white bg-emerald-600 hover:bg-emerald-700 shadow-md disabled:opacity-50 cursor-pointer"
        >
          Tekshirish
        </button>
      </div>
    </div>
  );
}

/* --- 4. True or False Game --- */
function TrueFalseGame({
  statements,
  onComplete,
}: {
  statements: { statement: string; isTrue: boolean; fact: string }[];
  onComplete: (score: number) => void;
}) {
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<{ correct: boolean; fact: string } | null>(null);

  const cur = statements[idx % statements.length];

  const handleAnswer = (choice: boolean) => {
    const isCorrect = choice === cur.isTrue;
    if (isCorrect) {
      playSuccessSound();
      setScore((s) => s + 20);
    } else {
      playErrorSound();
    }
    setFeedback({ correct: isCorrect, fact: cur.fact });

    setTimeout(() => {
      setFeedback(null);
      if (idx + 1 < statements.length) {
        setIdx((i) => i + 1);
      } else {
        onComplete(score + (isCorrect ? 20 : 0));
      }
    }, 1200);
  };

  return (
    <div className="space-y-5 text-center max-w-lg mx-auto">
      <div className="flex justify-between items-center text-xs font-bold text-slate-600">
        <span>Fakt #{idx + 1} / {statements.length}</span>
        <span>Ball: {score}</span>
      </div>

      <div className="p-6 rounded-3xl bg-amber-50/70 border-2 border-amber-200 min-h-36 flex flex-col justify-center items-center">
        <p className="text-lg sm:text-xl font-bold text-slate-800 leading-snug">
          "{cur.statement}"
        </p>
      </div>

      {feedback ? (
        <div className={`p-4 rounded-2xl text-sm font-bold animate-in zoom-in-95 ${
          feedback.correct ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
        }`}>
          {feedback.correct ? '✅ To\'g\'ri!' : '❌ Noto\'g\'ri!'} {feedback.fact}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleAnswer(true)}
            className="py-4 rounded-2xl font-black text-lg bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-200 transition cursor-pointer flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-6 h-6" />
            Rost (To'g'ri)
          </button>
          <button
            onClick={() => handleAnswer(false)}
            className="py-4 rounded-2xl font-black text-lg bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-200 transition cursor-pointer flex items-center justify-center gap-2"
          >
            <XCircle className="w-6 h-6" />
            Yolg'on (Xato)
          </button>
        </div>
      )}
    </div>
  );
}

/* --- 5. Math Rush Sub-Component --- */
function MathRushGame({
  mathQuestions,
  onComplete,
}: {
  mathQuestions: { q: string; a: number; opts: number[] }[];
  onComplete: (score: number) => void;
}) {
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);

  const cur = mathQuestions[idx % mathQuestions.length];

  const handlePick = (val: number) => {
    const isCorrect = val === cur.a;
    if (isCorrect) {
      playSuccessSound();
      setScore((s) => s + 25);
    } else {
      playErrorSound();
    }

    if (idx + 1 < mathQuestions.length) {
      setIdx((i) => i + 1);
    } else {
      onComplete(score + (isCorrect ? 25 : 0));
    }
  };

  return (
    <div className="space-y-5 text-center max-w-md mx-auto">
      <div className="text-xs font-black text-indigo-600 uppercase">
        Tezkor hisoblash #{idx + 1} / {mathQuestions.length}
      </div>

      <div className="p-8 rounded-3xl bg-indigo-600 text-white shadow-xl shadow-indigo-300">
        <div className="text-4xl sm:text-5xl font-black font-['Fredoka'] tracking-wider">
          {cur.q}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {cur.opts.map((opt, i) => (
          <button
            key={i}
            onClick={() => handlePick(opt)}
            className="p-4 rounded-2xl font-black text-2xl bg-white border-2 border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 text-slate-800 transition shadow-sm cursor-pointer"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
