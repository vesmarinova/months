import { useState, useCallback } from 'react';
import { Header } from './components/layout/Header';
import { MainMenu } from './components/game/MainMenu';
import { MonthSequence } from './components/game/MonthSequence';
import type { GameMode } from './types';

export default function App() {
  const [mode, setMode] = useState<GameMode>('menu');

  const handleBack = useCallback(() => setMode('menu'), []);

  return (
    <main className="min-h-svh flex flex-col items-center">
      <Header />

      {mode === 'menu' && <MainMenu onSelectMode={setMode} />}
      {mode === 'sequence' && <MonthSequence onBack={handleBack} />}
    </main>
  );
}
