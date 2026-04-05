import { useState } from 'react';

interface GameResultProps {
  attempts: number;
  elapsedSeconds: number;
  onPlayAgain: () => void;
  onBack: () => void;
}

const CONFETTI_COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];

function generateConfetti() {
  return Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 2}s`,
    duration: `${2 + Math.random() * 2}s`,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    size: 6 + Math.random() * 8,
  }));
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
}

function getStarRating(attempts: number): number {
  if (attempts <= 1) return 3;
  if (attempts <= 3) return 2;
  return 1;
}

export function GameResult({ attempts, elapsedSeconds, onPlayAgain, onBack }: GameResultProps) {
  const stars = getStarRating(attempts);
  const [confettiPieces] = useState(generateConfetti);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto px-4 py-8 relative overflow-hidden min-h-[70svh]">
      {/* Confetti */}
      <div className="fixed inset-0 pointer-events-none z-10" aria-hidden="true">
        {confettiPieces.map((piece) => (
          <div
            key={piece.id}
            className="absolute animate-confetti rounded-sm"
            style={{
              left: piece.left,
              top: '-10px',
              width: piece.size,
              height: piece.size,
              backgroundColor: piece.color,
              animationDelay: piece.delay,
              animationDuration: piece.duration,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="animate-bounce-in text-center z-20">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-3xl font-extrabold text-gray-800 mb-2">
          Great Job!
        </h2>
        <p className="text-lg text-gray-500 mb-6">
          Браво! Чудесна работа!
        </p>

        {/* Stars */}
        <div className="flex justify-center gap-2 mb-6" aria-label={`${stars} out of 3 stars`}>
          {[1, 2, 3].map((n) => (
            <span
              key={n}
              className={`text-4xl transition-all duration-500 ${
                n <= stars ? 'opacity-100 scale-100' : 'opacity-20 scale-75'
              }`}
              style={{ animationDelay: `${n * 0.2}s` }}
            >
              ⭐
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white/80 backdrop-blur rounded-xl p-4 shadow-sm">
            <div className="text-2xl font-bold text-indigo-600">{attempts}</div>
            <div className="text-xs text-gray-500">Attempts / Опити</div>
          </div>
          <div className="bg-white/80 backdrop-blur rounded-xl p-4 shadow-sm">
            <div className="text-2xl font-bold text-indigo-600">{formatTime(elapsedSeconds)}</div>
            <div className="text-xs text-gray-500">Time / Време</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={onPlayAgain}
            className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700
                       text-white font-bold text-lg rounded-xl shadow-lg
                       hover:shadow-xl transition-all duration-200
                       active:scale-[0.98] min-h-[48px]"
          >
            Play Again / Пак 🔄
          </button>
          <button
            onClick={onBack}
            className="w-full py-3 px-6 bg-white hover:bg-gray-50
                       text-gray-700 font-semibold text-base rounded-xl
                       border-2 border-gray-200 shadow-sm
                       hover:shadow transition-all duration-200
                       active:scale-[0.98] min-h-[48px]"
          >
            Main Menu / Начало 🏠
          </button>
        </div>
      </div>
    </div>
  );
}
