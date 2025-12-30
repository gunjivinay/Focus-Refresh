'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, Suspense, lazy } from 'react';
import { useGameContext } from '@/src/context/GameContext';
import { useTimer } from '@/src/hooks/useTimer';
import Timer from '@/src/components/ui/Timer';
import Header from '@/src/components/layout/Header';
import LoadingSkeleton from '@/src/components/ui/LoadingSkeleton';
import { getRandomQuote, gameEncouragementQuotes } from '@/src/utils/quotes';
import { recordGamePlay } from '@/src/utils/userStats';
import { checkChallengeCompletion } from '@/src/utils/dailyChallenges';
import { useAuth } from '@/src/hooks/useAuth';
import type { GameType } from '@/src/types';

// Lazy load game components for better performance
const NumberGuess = lazy(() => import('@/src/components/games/NumberGuess'));
const RockPaperScissors = lazy(() => import('@/src/components/games/RockPaperScissors'));
const QuickMathDuel = lazy(() => import('@/src/components/games/QuickMathDuel'));
const TypingBurst = lazy(() => import('@/src/components/games/TypingBurst'));
const OddOneOut = lazy(() => import('@/src/components/games/OddOneOut'));
const MemoryFlip = lazy(() => import('@/src/components/games/MemoryFlip'));
const QuickWordChain = lazy(() => import('@/src/components/games/QuickWordChain'));
const SimonSays = lazy(() => import('@/src/components/games/SimonSays'));
const SlidePuzzle2048 = lazy(() => import('@/src/components/games/SlidePuzzle2048'));
const SnakeAvoider = lazy(() => import('@/src/components/games/SnakeAvoider'));
const LittleAlchemy = lazy(() => import('@/src/components/games/LittleAlchemy'));
const WordScramble = lazy(() => import('@/src/components/games/WordScramble'));
const TriviaQuiz = lazy(() => import('@/src/components/games/TriviaQuiz'));
const DoodleChallenge = lazy(() => import('@/src/components/games/DoodleChallenge'));
const SpotDifference = lazy(() => import('@/src/components/games/SpotDifference'));
const PaperAirplane = lazy(() => import('@/src/components/games/PaperAirplane'));
const LightLogic = lazy(() => import('@/src/components/games/LightLogic'));
const StoryChain = lazy(() => import('@/src/components/games/StoryChain'));
const CodePuzzles = lazy(() => import('@/src/components/games/CodePuzzles'));
const TetrisBlocks = lazy(() => import('@/src/components/games/TetrisBlocks'));
const MinuteWinIt = lazy(() => import('@/src/components/games/MinuteWinIt'));
const PhysicalChallenge = lazy(() => import('@/src/components/games/PhysicalChallenge'));
const MindMaze = lazy(() => import('@/src/components/games/MindMaze'));
const SpeedMatch = lazy(() => import('@/src/components/games/SpeedMatch'));
const LogicLock = lazy(() => import('@/src/components/games/LogicLock'));
const ChessPuzzle = lazy(() => import('@/src/components/games/ChessPuzzle'));
const Sudoku = lazy(() => import('@/src/components/games/Sudoku'));
const BrainTeaser = lazy(() => import('@/src/components/games/BrainTeaser'));
const NumberCrunch = lazy(() => import('@/src/components/games/NumberCrunch'));
const WordChain = lazy(() => import('@/src/components/games/WordChain'));
const PatternMaster = lazy(() => import('@/src/components/games/PatternMaster'));
const MemoryMatrix = lazy(() => import('@/src/components/games/MemoryMatrix'));
const QuickDraw = lazy(() => import('@/src/components/games/QuickDraw'));
const ColorBlast = lazy(() => import('@/src/components/games/ColorBlast'));
const SequenceSolver = lazy(() => import('@/src/components/games/SequenceSolver'));
const WordSearch = lazy(() => import('@/src/components/games/WordSearch'));
const CodeBreaker = lazy(() => import('@/src/components/games/CodeBreaker'));
const SpotTheDiff = lazy(() => import('@/src/components/games/SpotTheDiff'));
const BlockPuzzle = lazy(() => import('@/src/components/games/BlockPuzzle'));
const AnagramSolver = lazy(() => import('@/src/components/games/AnagramSolver'));
const MathRush = lazy(() => import('@/src/components/games/MathRush'));
const ShapeShift = lazy(() => import('@/src/components/games/ShapeShift'));
const FizzBuzzMini = lazy(() => import('@/src/components/games/FizzBuzzMini'));
const CodeGolfBasics = lazy(() => import('@/src/components/games/CodeGolfBasics'));
const PredictOutput = lazy(() => import('@/src/components/games/PredictOutput'));
const GolfScore = lazy(() => import('@/src/components/games/GolfScore'));
const ElevatorSaga = lazy(() => import('@/src/components/games/ElevatorSaga'));
const SQLMurderMystery = lazy(() => import('@/src/components/games/SQLMurderMystery'));
const MiniCodeCombat = lazy(() => import('@/src/components/games/MiniCodeCombat'));
const LeetCodeBites = lazy(() => import('@/src/components/games/LeetCodeBites'));
const CheckIOMissions = lazy(() => import('@/src/components/games/CheckIOMissions'));
const CodinGameClones = lazy(() => import('@/src/components/games/CodinGameClones'));
const TicTacToe = lazy(() => import('@/src/components/games/TicTacToe'));
const Chess = lazy(() => import('@/src/components/games/Chess'));

export default function GamePage() {
  const params = useParams();
  const router = useRouter();
  const { timerDuration, selectedGame, timerState, startGame, endGame, resetContext } = useGameContext();
  const { userId, isAuthenticated, isLoading } = useAuth();
  const [encouragementQuote, setEncouragementQuote] = useState<string | null>(null);

  useEffect(() => {
    setEncouragementQuote(getRandomQuote(gameEncouragementQuotes));
  }, []);
  
  const gameId = params.gameId as GameType;

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/auth/signin?callbackUrl=/game/${gameId}`);
    }
  }, [isAuthenticated, isLoading, router, gameId]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render content if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  // Timer completion handler
  const handleTimerComplete = () => {
    endGame();
    router.push('/alert');
  };

  // Initialize timer when component mounts
  const timer = useTimer({
    initialSeconds: timerDuration || 600,
    onComplete: handleTimerComplete,
    autoStart: false,
  });

  // Start game and timer when component mounts
  useEffect(() => {
    if (timerDuration && selectedGame) {
      startGame();
      timer.start();
    } else {
      // Redirect if no timer or game selected
      router.push('/timer-selection');
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle game completion
  const handleGameComplete = (score: number = 100) => {
    // Game completed - end timer and show motivational message
    timer.pause();
    endGame();
    
    // Record game play and check for badges
    if (selectedGame && timerDuration) {
      const duration = timerDuration - timer.seconds;
      const { newBadges, stats } = recordGamePlay(selectedGame, score, true, duration, userId || undefined);
      
      // Check daily challenge completion
      if (userId) {
        const challengeResult = checkChallengeCompletion(selectedGame, score, true, userId);
        if (challengeResult.completed && challengeResult.reward) {
          // Challenge completed - add bonus points
          recordGamePlay(selectedGame, score + challengeResult.reward.bonusPoints, true, duration, userId);
        }
      }
      
      // Show completion message for 2 seconds, then redirect to alert
      setTimeout(() => {
        if (newBadges.length > 0) {
          router.push(`/alert?completed=true&badges=${newBadges.join(',')}`);
        } else {
          router.push('/alert?completed=true');
        }
      }, 2000);
    } else {
      setTimeout(() => {
        router.push('/alert?completed=true');
      }, 2000);
    }
  };

  // Render game component based on gameId
  const renderGame = () => {
    switch (gameId) {
      case 'number-guess':
        return <NumberGuess onComplete={handleGameComplete} />;
      case 'mind-maze':
        return <MindMaze onComplete={handleGameComplete} />;
      case 'speed-match':
        return <SpeedMatch onComplete={handleGameComplete} />;
      case 'logic-lock':
        return <LogicLock onComplete={handleGameComplete} />;
      case 'chess-puzzle':
        return <ChessPuzzle onComplete={handleGameComplete} />;
      case 'sudoku':
        return <Sudoku onComplete={handleGameComplete} />;
      case 'brain-teaser':
        return <BrainTeaser onComplete={handleGameComplete} />;
      case 'number-crunch':
        return <NumberCrunch onComplete={handleGameComplete} />;
      case 'word-chain':
        return <WordChain onComplete={handleGameComplete} />;
      case 'pattern-master':
        return <PatternMaster onComplete={handleGameComplete} />;
      case 'memory-matrix':
        return <MemoryMatrix onComplete={handleGameComplete} />;
      case 'quick-draw':
        return <QuickDraw onComplete={handleGameComplete} />;
      case 'color-blast':
        return <ColorBlast onComplete={handleGameComplete} />;
      case 'sequence-solver':
        return <SequenceSolver onComplete={handleGameComplete} />;
      case 'word-search':
        return <WordSearch onComplete={handleGameComplete} />;
      case 'code-breaker':
        return <CodeBreaker onComplete={handleGameComplete} />;
      case 'spot-the-diff':
        return <SpotTheDiff onComplete={handleGameComplete} />;
      case 'block-puzzle':
        return <BlockPuzzle onComplete={handleGameComplete} />;
      case 'anagram-solver':
        return <AnagramSolver onComplete={handleGameComplete} />;
      case 'math-rush':
        return <MathRush onComplete={handleGameComplete} />;
      case 'shape-shift':
        return <ShapeShift onComplete={handleGameComplete} />;
      // New games
      case 'rock-paper-scissors':
        return <RockPaperScissors onComplete={handleGameComplete} />;
      case 'quick-math-duel':
        return <QuickMathDuel onComplete={handleGameComplete} />;
      case 'typing-burst':
        return <TypingBurst onComplete={handleGameComplete} />;
      case 'odd-one-out':
        return <OddOneOut onComplete={handleGameComplete} />;
      case 'memory-flip':
        return <MemoryFlip onComplete={handleGameComplete} />;
      case 'quick-word-chain':
        return <QuickWordChain onComplete={handleGameComplete} />;
      case 'simon-says':
        return <SimonSays onComplete={handleGameComplete} />;
      case 'slide-puzzle-2048':
        return <SlidePuzzle2048 onComplete={handleGameComplete} />;
      case 'snake-avoider':
        return <SnakeAvoider onComplete={handleGameComplete} />;
      case 'little-alchemy':
        return <LittleAlchemy onComplete={handleGameComplete} />;
      case 'word-scramble':
        return <WordScramble onComplete={handleGameComplete} />;
      case 'trivia-quiz':
        return <TriviaQuiz onComplete={handleGameComplete} />;
      case 'doodle-challenge':
        return <DoodleChallenge onComplete={handleGameComplete} />;
      case 'spot-difference':
        return <SpotDifference onComplete={handleGameComplete} />;
      case 'paper-airplane':
        return <PaperAirplane onComplete={handleGameComplete} />;
      case 'light-logic':
        return <LightLogic onComplete={handleGameComplete} />;
      case 'story-chain':
        return <StoryChain onComplete={handleGameComplete} />;
      case 'code-puzzles':
        return <CodePuzzles onComplete={handleGameComplete} />;
      case 'tetris-blocks':
        return <TetrisBlocks onComplete={handleGameComplete} />;
      case 'minute-win-it':
        return <MinuteWinIt onComplete={handleGameComplete} />;
      case 'physical-challenge':
        return <PhysicalChallenge onComplete={handleGameComplete} />;
      // Coding & Programming games
      case 'fizzbuzz-mini':
        return <FizzBuzzMini onComplete={handleGameComplete} />;
      case 'code-golf-basics':
        return <CodeGolfBasics onComplete={handleGameComplete} />;
      case 'predict-output':
        return <PredictOutput onComplete={handleGameComplete} />;
      case 'golf-score':
        return <GolfScore onComplete={handleGameComplete} />;
      case 'elevator-saga':
        return <ElevatorSaga onComplete={handleGameComplete} />;
      case 'sql-murder-mystery':
        return <SQLMurderMystery onComplete={handleGameComplete} />;
      case 'mini-code-combat':
        return <MiniCodeCombat onComplete={handleGameComplete} />;
      case 'leetcode-bites':
        return <LeetCodeBites onComplete={handleGameComplete} />;
      case 'checkio-missions':
        return <CheckIOMissions onComplete={handleGameComplete} />;
      case 'codingame-clones':
        return <CodinGameClones onComplete={handleGameComplete} />;
      case 'tic-tac-toe':
        return <TicTacToe onComplete={handleGameComplete} />;
      case 'chess':
        return <Chess onComplete={handleGameComplete} />;
      default:
        return (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <p className="text-xl text-red-600">Game not found!</p>
              <p className="text-gray-600 mt-2">Please select a valid game.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
      <Header showBackButton backHref="/timer-selection" />
      <main className="flex-1 flex flex-col w-full lg:w-[90%] max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 space-y-3 sm:space-y-4 overflow-hidden">
        {/* Timer with Quote */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 border-2 border-blue-200 flex-shrink-0">
          <Timer seconds={timer.seconds} />
          <div className="mt-2 text-center">
            {encouragementQuote ? (
              <p className="text-xs sm:text-sm font-semibold text-gray-700 italic px-2">
                💪 {encouragementQuote}
              </p>
            ) : (
              <LoadingSkeleton type="text" width="200px" height="16px" className="mx-auto" />
            )}
          </div>
        </div>
        
        {/* Game Container */}
        <div className="flex-1 bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 border-2 border-indigo-200 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <Suspense fallback={
              <div className="h-full flex items-center justify-center">
                <div className="text-center space-y-4">
                  <LoadingSkeleton type="circle" width="64px" height="64px" className="mx-auto" />
                  <LoadingSkeleton type="text" width="200px" height="24px" className="mx-auto" />
                </div>
              </div>
            }>
              {renderGame()}
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
}

