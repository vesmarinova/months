import { useState, useCallback } from 'react';
import { MONTHS, SEASONS } from '../../data/months';
import { shuffle } from '../../utils/shuffle';
import { GameResult } from './GameResult';
import type { Month, Season } from '../../types';

const TOTAL_QUESTIONS = 10;
const SEASON_LIST: Season[] = ['Winter', 'Spring', 'Summer', 'Fall'];

interface Question {
  text: { en: string; bg: string };
  options: { label: string; value: string }[];
  correctValue: string;
}

function generateNextMonthQuestion(month: Month): Question {
  const nextIndex = month.id % 12; // 0-based index of next month
  const nextMonth = MONTHS[nextIndex];
  const wrongChoices = shuffle(
    MONTHS.filter((m) => m.id !== nextMonth.id)
  ).slice(0, 3);

  const options = shuffle([
    { label: `${nextMonth.name.en} / ${nextMonth.name.bg}`, value: String(nextMonth.id) },
    ...wrongChoices.map((m) => ({
      label: `${m.name.en} / ${m.name.bg}`,
      value: String(m.id),
    })),
  ]);

  return {
    text: {
      en: `What month comes after ${month.name.en}?`,
      bg: `Кой месец идва след ${month.name.bg}?`,
    },
    options,
    correctValue: String(nextMonth.id),
  };
}

function generatePrevMonthQuestion(month: Month): Question {
  const prevIndex = (month.id - 2 + 12) % 12;
  const prevMonth = MONTHS[prevIndex];
  const wrongChoices = shuffle(
    MONTHS.filter((m) => m.id !== prevMonth.id)
  ).slice(0, 3);

  const options = shuffle([
    { label: `${prevMonth.name.en} / ${prevMonth.name.bg}`, value: String(prevMonth.id) },
    ...wrongChoices.map((m) => ({
      label: `${m.name.en} / ${m.name.bg}`,
      value: String(m.id),
    })),
  ]);

  return {
    text: {
      en: `What month comes before ${month.name.en}?`,
      bg: `Кой месец идва преди ${month.name.bg}?`,
    },
    options,
    correctValue: String(prevMonth.id),
  };
}

function generateSeasonQuestion(month: Month): Question {
  const options = shuffle(
    SEASON_LIST.map((s) => ({
      label: `${SEASONS[s].emojis[0]} ${SEASONS[s].name.en} / ${SEASONS[s].name.bg}`,
      value: s,
    }))
  );

  return {
    text: {
      en: `Which season is ${month.name.en} in?`,
      bg: `В кой сезон е ${month.name.bg}?`,
    },
    options,
    correctValue: month.season,
  };
}

function generateMonthCountQuestion(month: Month): Question {
  const correct = month.id;
  const wrongOptions = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].filter((n) => n !== correct)).slice(0, 3);

  const options = shuffle([
    { label: String(correct), value: String(correct) },
    ...wrongOptions.map((n) => ({ label: String(n), value: String(n) })),
  ]);

  return {
    text: {
      en: `What number month is ${month.name.en}?`,
      bg: `Кой поред е ${month.name.bg}?`,
    },
    options,
    correctValue: String(correct),
  };
}

function generateQuestion(): Question {
  const month = MONTHS[Math.floor(Math.random() * MONTHS.length)];
  const type = Math.floor(Math.random() * 4);

  switch (type) {
    case 0: return generateNextMonthQuestion(month);
    case 1: return generateSeasonQuestion(month);
    case 2: return generatePrevMonthQuestion(month);
    default: return generateMonthCountQuestion(month);
  }
}

export function QuickQuiz({ onBack }: { onBack: () => void }) {
  const [question, setQuestion] = useState<Question>(generateQuestion);
  const [questionNum, setQuestionNum] = useState(1);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [startTime] = useState(() => Date.now());
  const [isComplete, setIsComplete] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const handleSelect = useCallback(
    (value: string) => {
      if (selected !== null) return; // Already answered

      setSelected(value);
      const correct = value === question.correctValue;
      setIsCorrect(correct);

      if (correct) {
        setScore((prev) => prev + 1);
        setStreak((prev) => {
          const newStreak = prev + 1;
          setBestStreak((best) => Math.max(best, newStreak));
          return newStreak;
        });
      } else {
        setStreak(0);
      }

      // Auto-advance after a short delay
      setTimeout(() => {
        if (questionNum >= TOTAL_QUESTIONS) {
          setElapsedSeconds(Math.round((Date.now() - startTime) / 1000));
          setIsComplete(true);
        } else {
          setQuestion(generateQuestion());
          setQuestionNum((prev) => prev + 1);
          setSelected(null);
          setIsCorrect(null);
        }
      }, 1000);
    },
    [selected, question.correctValue, questionNum, startTime]
  );

  const resetGame = useCallback(() => {
    setQuestion(generateQuestion());
    setQuestionNum(1);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setSelected(null);
    setIsCorrect(null);
    setIsComplete(false);
    setElapsedSeconds(0);
  }, []);

  if (isComplete) {
    return (
      <GameResult
        attempts={TOTAL_QUESTIONS - score}
        elapsedSeconds={elapsedSeconds}
        onPlayAgain={resetGame}
        onBack={onBack}
      />
    );
  }

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto px-4 pb-6">
      <div className="flex items-center justify-between w-full mb-4">
        <button
          onClick={onBack}
          className="text-gray-500 hover:text-gray-700 p-2 -ml-2 rounded-lg
                     hover:bg-gray-100 transition-colors min-w-[44px] min-h-[44px]
                     flex items-center justify-center"
          aria-label="Back to menu"
        >
          ← Back
        </button>
        <div className="flex items-center gap-3 text-sm text-gray-500">
          {streak > 1 && (
            <span className="text-amber-500 font-bold">🔥 {streak}</span>
          )}
          {bestStreak > 2 && streak === 0 && (
            <span className="text-gray-400 text-xs">Best: {bestStreak}</span>
          )}
          <span>
            <span className="font-bold text-gray-700">{score}</span>/{questionNum}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-gray-200 rounded-full mb-4 overflow-hidden">
        <div
          className="h-full bg-amber-500 rounded-full transition-all duration-300"
          style={{ width: `${(questionNum / TOTAL_QUESTIONS) * 100}%` }}
        />
      </div>

      <h2 className="text-lg font-bold text-gray-800 mb-1 text-center">
        Quick Quiz
      </h2>
      <p className="text-xs text-gray-400 mb-5 text-center">
        Question {questionNum} of {TOTAL_QUESTIONS}
      </p>

      {/* Question */}
      <div className="w-full bg-white/80 backdrop-blur rounded-2xl p-5 shadow-sm border border-gray-100 mb-5">
        <p className="text-lg font-bold text-gray-800 text-center leading-snug">
          {question.text.en}
        </p>
        <p className="text-sm text-gray-400 text-center mt-1">
          {question.text.bg}
        </p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 gap-3 w-full">
        {question.options.map((option) => {
          const isThis = selected === option.value;
          const isAnswer = option.value === question.correctValue;

          let buttonClass = 'bg-white border-gray-200 text-gray-800 hover:border-indigo-300 hover:bg-indigo-50';
          if (selected !== null) {
            if (isAnswer) {
              buttonClass = 'bg-green-50 border-green-500 text-green-800 ring-2 ring-green-300';
            } else if (isThis && !isCorrect) {
              buttonClass = 'bg-red-50 border-red-400 text-red-700 ring-2 ring-red-300';
            } else {
              buttonClass = 'bg-gray-50 border-gray-200 text-gray-400';
            }
          }

          return (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              disabled={selected !== null}
              className={`
                w-full text-left px-4 py-3 rounded-xl border-2
                font-semibold text-base transition-all duration-200
                min-h-[48px] active:scale-[0.98]
                ${buttonClass}
              `}
            >
              {option.label}
              {selected !== null && isAnswer && (
                <span className="float-right text-green-500">✓</span>
              )}
              {isThis && !isCorrect && selected !== null && (
                <span className="float-right text-red-400">✗</span>
              )}
            </button>
          );
        })}
      </div>

      {streak > 2 && (
        <div className="mt-4 text-center animate-bounce-in">
          <span className="text-sm font-bold text-amber-500">
            🔥 {streak} streak! Keep going!
          </span>
        </div>
      )}
    </div>
  );
}
