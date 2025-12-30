'use client';

import { useState } from 'react';
import TicTacToe from './TicTacToe';

interface CodinGameClonesProps {
  onComplete?: () => void;
}

export default function CodinGameClones({ onComplete }: CodinGameClonesProps) {
  // This is now just a wrapper that shows Tic-Tac-Toe
  return <TicTacToe onComplete={onComplete} />;
}

