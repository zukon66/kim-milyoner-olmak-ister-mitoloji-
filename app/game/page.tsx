"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import questionsData from "@/data/questions.json";
import QuestionCard from "@/components/QuestionCard";
import AnswerButton from "@/components/AnswerButton";
import LifelinesBar from "@/components/LifelinesBar";
import ScoreBox from "@/components/ScoreBox";
import { translations, LanguageKey } from "@/data/i18n";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";
const withBase = (path: string) => `${BASE_PATH}${path}`;

type Question = {
  id: string;
  difficulty: string;
  category: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  tags: string[];
};

const PRIZE_MONEY = [1000, 2000, 3000, 5000, 7500, 10000, 20000, 50000, 100000, 1000000];
const OPTION_KEYS = ["A", "B", "C", "D"];
const TIME_LIMIT = 30;

const shuffle = <T,>(array: T[]) => [...array].sort(() => 0.5 - Math.random());

const sanitizeQuestion = (question: Question, distractorPool: string[]): Question => {
  const seen = new Set<string>();
  const uniqueOptions: string[] = [];

  question.options.forEach((opt) => {
    if (!seen.has(opt)) {
      seen.add(opt);
      uniqueOptions.push(opt);
    }
  });

  if (!seen.has(question.answer)) {
    uniqueOptions[0] = question.answer;
    seen.add(question.answer);
  }

  while (uniqueOptions.length < 4) {
    const candidate = distractorPool[Math.floor(Math.random() * distractorPool.length)];
    if (candidate && !seen.has(candidate) && candidate !== question.answer) {
      seen.add(candidate);
      uniqueOptions.push(candidate);
    }
  }

  return { ...question, options: uniqueOptions.slice(0, 4) };
};

const RAW_QUESTIONS = questionsData as Question[];
const SANITIZED_QUESTIONS = (() => {
  const pool = RAW_QUESTIONS.flatMap((q) => q.options);
  return RAW_QUESTIONS.map((q) => sanitizeQuestion(q, pool));
})();
const AVAILABLE_CATEGORIES = [...new Set(SANITIZED_QUESTIONS.map((q) => q.category))];
const AVAILABLE_DIFFICULTIES = [...new Set(SANITIZED_QUESTIONS.map((q) => q.difficulty))];

const buildPhoneMessage = (lang: LanguageKey, suggestedKey: string) =>
  lang === "tr" ? `${suggestedKey} şıkkı kulağa doğru geliyor.` : `I would go with option ${suggestedKey}.`;

export default function GamePage() {
  const router = useRouter();

  const [phase, setPhase] = useState<"setup" | "playing" | "ended">("setup");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lifelines, setLifelines] = useState({ fiftyFifty: true, skip: true, doubleChance: true, phone: true });
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerState, setAnswerState] = useState<"default" | "selected" | "correct" | "wrong">("default");
  const [hiddenOptions, setHiddenOptions] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [questionLocked, setQuestionLocked] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [phoneHint, setPhoneHint] = useState<string | null>(null);
  const [stats, setStats] = useState({ correct: 0, wrong: 0 });
  const [endState, setEndState] = useState<"victory" | "fail" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [musicOn, setMusicOn] = useState(true);
  const [categoryPickerOpen, setCategoryPickerOpen] = useState(false);
  const [doubleChanceActive, setDoubleChanceActive] = useState(false);
  const [doubleChanceFirstMiss, setDoubleChanceFirstMiss] = useState(false);

  const [settings, setSettings] = useState({
    categories: [...AVAILABLE_CATEGORIES],
    difficulty: "all",
    language: "tr" as LanguageKey,
    theme: "dark" as "dark" | "light",
    fontScale: 100,
  });

  const startTimeRef = useRef<number | null>(null);
  const backgroundAudioRef = useRef<HTMLAudioElement | null>(null);
  const correctAudioRef = useRef<HTMLAudioElement | null>(null);
  const wrongAudioRef = useRef<HTMLAudioElement | null>(null);
  const timeoutAudioRef = useRef<HTMLAudioElement | null>(null);

  const t = translations[settings.language];
  const currentQuestion = questions[currentIndex];
  const currentPrize = PRIZE_MONEY[currentIndex] || PRIZE_MONEY[PRIZE_MONEY.length - 1];

  const difficultyLabel = (value: string) => {
    if (settings.language === "en") {
      return value === "easy" ? "Easy" : value === "medium" ? "Medium" : "Hard";
    }
    return value === "easy" ? "Kolay" : value === "medium" ? "Orta" : "Zor";
  };

  useEffect(() => {
    document.documentElement.lang = settings.language;
  }, [settings.language]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", settings.theme);
  }, [settings.theme]);

  useEffect(() => {
    backgroundAudioRef.current = new Audio(withBase("/audio/bg-music.wav"));
    backgroundAudioRef.current.loop = true;
    backgroundAudioRef.current.volume = 0.35;
    correctAudioRef.current = new Audio(withBase("/audio/correct.wav"));
    wrongAudioRef.current = new Audio(withBase("/audio/wrong.wav"));
    timeoutAudioRef.current = new Audio(withBase("/audio/timeout.wav"));

    return () => {
      [backgroundAudioRef, correctAudioRef, wrongAudioRef, timeoutAudioRef].forEach((ref) => {
        if (ref.current) {
          ref.current.pause();
          ref.current.src = "";
        }
      });
    };
  }, []);

  useEffect(() => {
    if (phase === "playing") {
      const timer = setInterval(() => {
        if (startTimeRef.current) {
          setElapsedMs(Date.now() - startTimeRef.current);
        }
      }, 500);
      return () => clearInterval(timer);
    }
  }, [phase]);

  const playSound = useCallback(
    (type: "bg" | "correct" | "wrong" | "timeout") => {
      if (type === "bg" && !musicOn) return;
      const map: Record<typeof type, HTMLAudioElement | null> = {
        bg: backgroundAudioRef.current,
        correct: correctAudioRef.current,
        wrong: wrongAudioRef.current,
        timeout: timeoutAudioRef.current,
      };
      const audio = map[type];
      if (audio) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      }
    },
    [musicOn]
  );

  const stopBackgroundMusic = useCallback(() => {
    if (backgroundAudioRef.current) {
      backgroundAudioRef.current.pause();
      backgroundAudioRef.current.currentTime = 0;
    }
  }, []);

  const startGame = () => {
    const filtered = SANITIZED_QUESTIONS.filter((q) => {
      const categoryMatch = settings.categories.length === 0 || settings.categories.includes(q.category);
      const difficultyMatch = settings.difficulty === "all" || q.difficulty === settings.difficulty;
      return categoryMatch && difficultyMatch;
    });
    const selection = shuffle(filtered).slice(0, 10);

    if (!selection.length) {
      setError(settings.language === "tr" ? "Seçtiğiniz kriterlerde soru bulunamadı." : "No questions found for your selection.");
      return;
    }

    setQuestions(selection);
    setCurrentIndex(0);
    setScore(0);
    setLifelines({ fiftyFifty: true, skip: true, doubleChance: true, phone: true });
    setHiddenOptions([]);
    setSelectedAnswer(null);
    setAnswerState("default");
    setIsProcessing(false);
    setQuestionLocked(false);
    setShowExplanation(false);
    setPhoneHint(null);
    setDoubleChanceActive(false);
    setDoubleChanceFirstMiss(false);
    setStats({ correct: 0, wrong: 0 });
    setTimeLeft(TIME_LIMIT);
    setEndState(null);
    setPhase("playing");
    setError(null);
    startTimeRef.current = Date.now();
    setElapsedMs(0);
    playSound("bg");
  };

  const handleNextQuestion = useCallback(() => {
    setCurrentIndex((prev) => prev + 1);
    setSelectedAnswer(null);
    setAnswerState("default");
    setHiddenOptions([]);
    setIsProcessing(false);
    setQuestionLocked(false);
    setShowExplanation(false);
    setPhoneHint(null);
    setTimeLeft(TIME_LIMIT);
    setDoubleChanceActive(false);
    setDoubleChanceFirstMiss(false);
  }, []);

  const finishGame = useCallback(
    (result: "victory" | "fail") => {
      setPhase("ended");
      setEndState(result);
      setQuestionLocked(true);
      stopBackgroundMusic();
    },
    [stopBackgroundMusic]
  );

  const getCorrectKey = useCallback(() => {
    if (!currentQuestion) return "";
    const idx = currentQuestion.options.findIndex((opt) => opt === currentQuestion.answer);
    return OPTION_KEYS[idx] || "";
  }, [currentQuestion]);

  const handleResolution = useCallback(
    (result: "correct" | "wrong" | "timeout", key?: string) => {
      if (questionLocked || !currentQuestion) return;
      setQuestionLocked(true);
      setShowExplanation(true);
      setIsProcessing(true);
      setSelectedAnswer(key ?? null);

      const futureWrong = result === "wrong" || result === "timeout" ? stats.wrong + 1 : stats.wrong;
      const isLastQuestion = currentIndex + 1 >= questions.length;

      if (result === "correct") {
        setAnswerState("correct");
        setScore(currentPrize);
        setStats((prev) => ({ ...prev, correct: prev.correct + 1 }));
        playSound("correct");
      } else {
        setAnswerState("wrong");
        setStats((prev) => ({ ...prev, wrong: prev.wrong + 1 }));
        playSound(result === "timeout" ? "timeout" : "wrong");
      }

      const delay = result === "correct" ? 1600 : 1800;
      setTimeout(() => {
        if (result === "correct") {
          if (isLastQuestion) {
            finishGame(futureWrong > 0 ? "fail" : "victory");
          } else {
            handleNextQuestion();
            setQuestionLocked(false);
          }
        } else {
          finishGame("fail");
        }
      }, delay);
    },
    [currentQuestion, currentIndex, currentPrize, finishGame, handleNextQuestion, playSound, questionLocked, questions.length, stats.wrong]
  );

  const handleTimeout = useCallback(() => {
    if (questionLocked || !currentQuestion) return;
    handleResolution("timeout");
  }, [currentQuestion, handleResolution, questionLocked]);

  useEffect(() => {
    if (phase !== "playing" || questionLocked) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [phase, currentIndex, questionLocked, handleTimeout]);

  const toggleCategory = (cat: string) => {
    setSettings((prev) => {
      const exists = prev.categories.includes(cat);
      const next = exists ? prev.categories.filter((c) => c !== cat) : [...prev.categories, cat];
      return { ...prev, categories: next };
    });
  };

  const selectAllCategories = () => setSettings((prev) => ({ ...prev, categories: [...AVAILABLE_CATEGORIES] }));
  const clearCategories = () => setSettings((prev) => ({ ...prev, categories: [] }));

  const toggleMusic = () => {
    if (!backgroundAudioRef.current) return;
    if (musicOn) {
      backgroundAudioRef.current.pause();
      setMusicOn(false);
    } else {
      backgroundAudioRef.current.currentTime = 0;
      backgroundAudioRef.current.play().catch(() => {});
      setMusicOn(true);
    }
  };

  const handleAnswerClick = (key: string) => {
    if (phase !== "playing" || isProcessing || questionLocked) return;
    const correctKey = getCorrectKey();

    if (doubleChanceActive && !doubleChanceFirstMiss && key !== correctKey) {
      setSelectedAnswer(key);
      setAnswerState("wrong");
      setIsProcessing(true);
      setTimeout(() => {
        setHiddenOptions((prev) => [...prev, key]);
        setSelectedAnswer(null);
        setAnswerState("default");
        setIsProcessing(false);
        setDoubleChanceFirstMiss(true);
      }, 1100);
      return;
    }

    setAnswerState("selected");
    setDoubleChanceActive(false);
    handleResolution(key === correctKey ? "correct" : "wrong", key);
  };

  const useLifeline = (type: "fiftyFifty" | "skip" | "doubleChance" | "phone") => {
    if (isProcessing || questionLocked) return;
    const correctKey = getCorrectKey();

    if (type === "fiftyFifty" && lifelines.fiftyFifty) {
      const wrongKeys = OPTION_KEYS.filter((k) => k !== correctKey);
      const shuffled = shuffle(wrongKeys);
      const toHide = shuffled.slice(0, 2);
      setHiddenOptions(toHide);
      setLifelines((prev) => ({ ...prev, fiftyFifty: false }));
    }

    if (type === "skip" && lifelines.skip) {
      setLifelines((prev) => ({ ...prev, skip: false }));
      if (currentIndex + 1 < questions.length) {
        handleNextQuestion();
      } else {
        finishGame(stats.wrong > 0 ? "fail" : "victory");
      }
    }

    if (type === "doubleChance" && lifelines.doubleChance) {
      setDoubleChanceActive(true);
      setDoubleChanceFirstMiss(false);
      setLifelines((prev) => ({ ...prev, doubleChance: false }));
      setSelectedAnswer(null);
      setHiddenOptions([]);
      setShowExplanation(false);
    }

    if (type === "phone" && lifelines.phone) {
      const confident = Math.random() > 0.35;
      const suggestion = confident ? correctKey : OPTION_KEYS.find((k) => k !== correctKey && Math.random() > 0.5) || correctKey;
      setPhoneHint(buildPhoneMessage(settings.language, suggestion));
      setLifelines((prev) => ({ ...prev, phone: false }));
    }
  };

  const answeredCount = stats.correct + stats.wrong;
  const totalTimeSeconds = Math.round(elapsedMs / 1000);
  const timedOut = questionLocked && selectedAnswer === null && answerState === "wrong";

  const themeBg = settings.theme === "light" ? "bg-amber-50 text-slate-900" : "bg-slate-950 text-white";
  const panelBg = settings.theme === "light" ? "bg-white/80 border-amber-200" : "bg-slate-900/80 border-white/10";
  const inputStyle = settings.theme === "light" ? "bg-white/80 border-amber-200 text-slate-900" : "bg-slate-900/40 border-amber-400/40 text-white";

  if (phase === "setup") {
    return (
      <main className={`min-h-screen ${themeBg} p-6 md:p-10 flex items-center justify-center`}>
        <div className={`w-full max-w-4xl rounded-2xl border ${panelBg} shadow-2xl backdrop-blur-xl p-8 md:p-12 space-y-8`} style={{ fontSize: `${settings.fontScale}%` }}>
          <div className="space-y-3 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-amber-500 font-semibold">Mitoloji Arena</p>
            <h1 className="text-4xl md:text-5xl font-black font-cinzel">{t.startTitle}</h1>
            <p className="text-lg md:text-xl text-slate-500">{t.startSubtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`rounded-xl border ${panelBg} p-4 space-y-4`}>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold uppercase tracking-wide">{t.categoryLabel}</label>
                <button onClick={() => setCategoryPickerOpen((prev) => !prev)} className="text-xs px-3 py-1 rounded-lg border border-amber-400/60 bg-amber-500/10 hover:bg-amber-500/20 transition">
                  {t.categoryEdit}
                </button>
              </div>

              <div className="flex flex-wrap gap-2 text-xs">
                {(settings.categories.length ? settings.categories : [t.anyCategory]).map((cat) => (
                  <span key={cat} className="px-2 py-1 rounded-full bg-amber-500/10 border border-amber-400/40 text-amber-700">
                    {cat}
                  </span>
                ))}
              </div>

              {categoryPickerOpen && (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <button onClick={selectAllCategories} className="text-xs px-2 py-1 rounded border border-amber-300">
                      Tümünü Seç
                    </button>
                    <button onClick={clearCategories} className="text-xs px-2 py-1 rounded border border-slate-400">
                      Temizle
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {AVAILABLE_CATEGORIES.map((cat) => (
                      <label key={cat} className="flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={settings.categories.includes(cat)} onChange={() => toggleCategory(cat)} className="accent-amber-500" />
                        <span>{cat}</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500">{t.categoryHint}</p>
                </div>
              )}

              <label className="block text-sm font-semibold uppercase tracking-wide">{t.difficultyLabel}</label>
              <select className={`w-full rounded-lg px-3 py-2 border ${inputStyle}`} value={settings.difficulty} onChange={(e) => setSettings((prev) => ({ ...prev, difficulty: e.target.value }))}>
                <option value="all">{t.anyDifficulty}</option>
                {AVAILABLE_DIFFICULTIES.map((diff) => (
                  <option key={diff} value={diff}>
                    {difficultyLabel(diff)}
                  </option>
                ))}
              </select>
            </div>

            <div className={`rounded-xl border ${panelBg} p-4 space-y-4`}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide">{t.languageLabel}</p>
                  <div className="flex gap-2 mt-2">
                    {(["tr", "en"] as LanguageKey[]).map((lang) => (
                      <button key={lang} onClick={() => setSettings((prev) => ({ ...prev, language: lang }))} className={`px-3 py-1 rounded-lg border ${settings.language === lang ? "border-amber-500 text-amber-600 font-bold" : "border-transparent bg-slate-900/20"}`}>
                        {lang.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide">{t.themeLabel}</p>
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => setSettings((prev) => ({ ...prev, theme: "light" }))} className={`px-3 py-1 rounded-lg border ${settings.theme === "light" ? "border-amber-500 text-amber-600 font-bold" : "border-transparent bg-slate-900/20"}`}>
                      {t.themeLight}
                    </button>
                    <button onClick={() => setSettings((prev) => ({ ...prev, theme: "dark" }))} className={`px-3 py-1 rounded-lg border ${settings.theme === "dark" ? "border-amber-500 text-amber-600 font-bold" : "border-transparent bg-slate-900/20"}`}>
                      {t.themeDark}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold uppercase tracking-wide">{t.fontLabel}</p>
                <div className="flex items-center gap-3 mt-2">
                  <button className="px-3 py-1 rounded-md border border-amber-300" onClick={() => setSettings((prev) => ({ ...prev, fontScale: Math.max(80, prev.fontScale - 10) }))}>
                    -
                  </button>
                  <span className="text-sm font-semibold">{settings.fontScale}%</span>
                  <button className="px-3 py-1 rounded-md border border-amber-300" onClick={() => setSettings((prev) => ({ ...prev, fontScale: Math.min(140, prev.fontScale + 10) }))}>
                    +
                  </button>
                </div>
              </div>

              <div className="text-sm text-slate-500">{t.timerHelp(TIME_LIMIT)}</div>
              <div className="text-xs text-slate-500">{t.musicHint}</div>
            </div>
          </div>

          {error && <div className="text-center text-rose-500 font-semibold">{error}</div>}

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <button onClick={startGame} className="w-full md:w-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg transition-all">
              {t.startButton}
            </button>
            <div className="text-xs uppercase tracking-widest text-slate-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" /> {t.timerLabel}: {TIME_LIMIT}s
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!currentQuestion || !questions.length) return null;

  if (phase === "ended" && endState) {
    return (
      <main className={`min-h-screen ${themeBg} p-6 flex flex-col items-center justify-center`} style={{ fontSize: `${settings.fontScale}%` }}>
        <div className={`w-full max-w-2xl rounded-2xl border ${panelBg} shadow-2xl backdrop-blur-xl p-8 md:p-10 text-center space-y-6`}>
          <h1 className="text-4xl md:text-5xl font-black font-cinzel text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-600 drop-shadow-glow">
            {endState === "victory" ? t.victory : t.gameOver}
          </h1>
          <p className="text-sm uppercase tracking-widest text-slate-500">{t.prizeLabel}</p>
          <p className="text-4xl md:text-5xl font-bold text-amber-500 drop-shadow-md font-cinzel">₺ {score.toLocaleString()}</p>

          <div className="grid grid-cols-2 gap-4 text-sm md:text-base">
            <div className={`rounded-xl border ${panelBg} p-4 text-left`}>
              <p className="text-slate-500">{t.correctCount}</p>
              <p className="text-2xl font-bold text-emerald-500">{stats.correct}</p>
            </div>
            <div className={`rounded-xl border ${panelBg} p-4 text-left`}>
              <p className="text-slate-500">{t.wrongCount}</p>
              <p className="text-2xl font-bold text-rose-500">{stats.wrong}</p>
            </div>
            <div className={`rounded-xl border ${panelBg} p-4 text-left`}>
              <p className="text-slate-500">{t.answeredCount}</p>
              <p className="text-2xl font-bold text-amber-500">{answeredCount}</p>
            </div>
            <div className={`rounded-xl border ${panelBg} p-4 text-left`}>
              <p className="text-slate-500">{t.totalTime}</p>
              <p className="text-2xl font-bold text-sky-400">{totalTimeSeconds}s</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button onClick={startGame} className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg">
              {t.playAgain}
            </button>
            <button onClick={() => router.push("/")} className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-3 rounded-xl transition-all shadow">
              {t.home}
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={`min-h-screen ${themeBg} p-4 pb-12 flex flex-col items-center relative overflow-hidden`} style={{ fontSize: `${settings.fontScale}%` }}>
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className={`absolute inset-0 ${settings.theme === "light" ? "bg-gradient-to-br from-amber-50 via-white to-amber-100" : "bg-[radial-gradient(circle_at_50%_50%,_rgba(17,24,39,1),_rgba(0,0,0,1))]"}`} />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/30 blur-[100px] rounded-full animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-900/20 blur-[100px] rounded-full animate-pulse-slow duration-7000" />
      </div>

      <ScoreBox score={score} currentQuestionIndex={currentIndex} totalQuestions={questions.length} timeLeft={timeLeft} timeLimit={TIME_LIMIT} theme={settings.theme} prizeLabel={t.prizeLabel} timerLabel={t.timerLabel} />

      <div className="w-full max-w-4xl mt-24 md:mt-32 relative z-10 space-y-4">
        <div className="absolute -top-16 left-0 flex gap-3 flex-wrap">
          <button onClick={toggleMusic} className="bg-slate-900/70 border border-amber-400/50 text-sm px-3 py-2 rounded-lg hover:bg-amber-500/20 transition-all shadow">
            {musicOn ? t.musicOff : t.musicOn}
          </button>
          <button
            onClick={() => {
              stopBackgroundMusic();
              router.push("/");
            }}
            className="bg-slate-900/70 border border-slate-500 text-sm px-3 py-2 rounded-lg hover:bg-slate-800 transition-all shadow"
          >
            {t.home}
          </button>
        </div>

        <LifelinesBar
          lifelines={lifelines}
          onUseLifeline={useLifeline}
          disabled={isProcessing || questionLocked}
          theme={settings.theme}
          labels={{
            fifty: t.lifelines.fifty,
            skip: t.lifelines.skip,
            double: t.lifelines.double,
            phone: t.lifelines.phone,
          }}
        />

        <QuestionCard question={currentQuestion.question} difficulty={difficultyLabel(currentQuestion.difficulty)} category={currentQuestion.category} theme={settings.theme} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {currentQuestion.options.map((text, index) => {
            const key = OPTION_KEYS[index];
            const correctKey = getCorrectKey();

            let state: "default" | "selected" | "correct" | "wrong" | "hidden" = "default";

            if (hiddenOptions.includes(key)) state = "hidden";
            else if (selectedAnswer === key) {
              if (answerState === "selected") state = "selected";
              if (answerState === "correct") state = "correct";
              if (answerState === "wrong") state = "wrong";
            } else if (answerState === "wrong" && !doubleChanceActive && key === correctKey) {
              state = "correct";
            }

            return <AnswerButton key={key} answer={{ key, text }} state={state} onClick={() => handleAnswerClick(key)} disabled={isProcessing || state === "hidden" || questionLocked} theme={settings.theme} />;
          })}
        </div>

        {phoneHint && (
          <div className={`rounded-xl border ${panelBg} p-4 space-y-3`}>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide mb-1">{t.phoneAFriendHint}</p>
              <p className="text-base">{phoneHint}</p>
            </div>
          </div>
        )}

        {showExplanation && (
          <div className={`rounded-xl border ${panelBg} p-4 space-y-2`}>
            <p className="text-sm font-semibold uppercase tracking-wide text-amber-500">{t.explanationTitle}</p>
            <p className="text-base leading-relaxed">{currentQuestion.explanation}</p>
            {timedOut && <p className="text-sm text-rose-400">{t.timeIsUp}</p>}
            {(answerState === "wrong" || timedOut) && (
              <p className="text-sm text-slate-400">
                {settings.language === "tr" ? "Doğru cevap" : "Correct answer"}: {getCorrectKey()} - {currentQuestion.answer}
              </p>
            )}
          </div>
        )}

        <div className="flex justify-end">
          <button className="text-xs uppercase tracking-widest text-slate-500 hover:text-amber-500 transition-colors" onClick={() => setSettings((prev) => ({ ...prev, theme: prev.theme === "dark" ? "light" : "dark" }))}>
            {t.themeLabel}: {settings.theme === "dark" ? t.themeDark : t.themeLight}
          </button>
        </div>
      </div>
    </main>
  );
}
