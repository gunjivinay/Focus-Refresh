'use client';

import { useState, useRef, useEffect } from 'react';

interface DoodleChallengeProps {
  onComplete?: () => void;
}

const prompts = [
  'Draw a cat',
  'Draw a house',
  'Draw a tree',
  'Draw a car',
  'Draw a flower',
  'Draw a sun',
  'Draw a star',
  'Draw a heart',
];

export default function DoodleChallenge({ onComplete }: DoodleChallengeProps) {
  const [prompt, setPrompt] = useState('');
  const [timeLeft, setTimeLeft] = useState(120);
  const [gameOver, setGameOver] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    setPrompt(randomPrompt);
    
    // Setup canvas
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
      }
    }
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameOver(true);
            if (onComplete) {
              setTimeout(() => onComplete(), 3000);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, gameOver]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  if (gameOver) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">🎨</div>
          <h3 className="text-2xl font-bold text-gray-800">Time's Up!</h3>
          <p className="text-lg text-gray-600">Great job on your doodle!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-800">✏️ Doodle Challenge</h2>
        <div className="flex items-center justify-center gap-6">
          <p className="text-sm text-gray-600">
            Prompt: <span className="font-bold text-blue-600">{prompt}</span>
          </p>
          <p className={`text-sm font-bold ${timeLeft <= 10 ? 'text-red-600' : 'text-gray-600'}`}>
            Time: {timeLeft}s
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-4 border-2 border-blue-200">
        <canvas
          ref={canvasRef}
          width={500}
          height={400}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="border-2 border-gray-300 rounded-lg cursor-crosshair"
          style={{ touchAction: 'none' }}
        />
      </div>

      <div className="flex gap-4">
        <button
          onClick={clearCanvas}
          className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-semibold"
        >
          Clear
        </button>
      </div>
    </div>
  );
}

