'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { Mood, TimerDuration, GameType, GameContextType, GameState, TimerState } from '@/src/types';

const initialState: GameContextType = {
  // State
  mood: null,
  timerDuration: null,
  selectedGame: null,
  gameState: {
    isActive: false,
    isCompleted: false,
    score: undefined,
  },
  timerState: {
    remainingSeconds: 0,
    isActive: false,
    isCompleted: false,
  },
  // Actions
  setMood: () => {},
  setTimerDuration: () => {},
  setSelectedGame: () => {},
  startGame: () => {},
  endGame: () => {},
  resetContext: () => {},
};

const GameContext = createContext<GameContextType>(initialState);

export function GameProvider({ children }: { children: ReactNode }) {
  const [mood, setMood] = useState<Mood>(null);
  const [timerDuration, setTimerDuration] = useState<TimerDuration>(null);
  const [selectedGame, setSelectedGame] = useState<GameType>(null);
  const [gameState, setGameState] = useState<GameState>({
    isActive: false,
    isCompleted: false,
    score: undefined,
  });
  const [timerState, setTimerState] = useState<TimerState>({
    remainingSeconds: 0,
    isActive: false,
    isCompleted: false,
  });

  const startGame = () => {
    if (timerDuration) {
      setTimerState({
        remainingSeconds: timerDuration,
        isActive: true,
        isCompleted: false,
      });
      setGameState({
        isActive: true,
        isCompleted: false,
        score: undefined,
      });
    }
  };

  const endGame = () => {
    setGameState(prev => ({ ...prev, isActive: false }));
    setTimerState(prev => ({ ...prev, isActive: false }));
  };

  const resetContext = () => {
    setMood(null);
    setTimerDuration(null);
    setSelectedGame(null);
    setGameState({
      isActive: false,
      isCompleted: false,
      score: undefined,
    });
    setTimerState({
      remainingSeconds: 0,
      isActive: false,
      isCompleted: false,
    });
  };

  const value: GameContextType = {
    mood,
    timerDuration,
    selectedGame,
    gameState,
    timerState,
    setMood,
    setTimerDuration,
    setSelectedGame,
    startGame,
    endGame,
    resetContext,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGameContext() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within GameProvider');
  }
  return context;
}


