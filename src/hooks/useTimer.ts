import { useState, useEffect, useCallback } from 'react';

interface UseTimerOptions {
  initialSeconds: number;
  onComplete?: () => void;
  autoStart?: boolean;
}

export function useTimer({ initialSeconds, onComplete, autoStart = false }: UseTimerOptions) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(autoStart);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            if (onComplete) {
              onComplete();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, seconds, onComplete]);

  const start = useCallback(() => {
    setIsActive(true);
  }, []);

  const pause = useCallback(() => {
    setIsActive(false);
  }, []);

  const reset = useCallback((newSeconds?: number) => {
    setIsActive(false);
    setSeconds(newSeconds ?? initialSeconds);
  }, [initialSeconds]);

  return {
    seconds,
    isActive,
    start,
    pause,
    reset,
  };
}


