// src/components/CountdownTimer.tsx
import React, { useEffect, useState } from 'react';

interface CountdownTimerProps {
  duration: number;
  onTimeUp: () => void;
  timerStarted: boolean;
  setTimerEnded: React.Dispatch<React.SetStateAction<boolean>>;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ duration, onTimeUp, timerStarted, setTimerEnded }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    const savedTime = localStorage.getItem('timeLeft');
    if (savedTime) {
      setTimeLeft(parseInt(savedTime, 10));
    }

    if (!timerStarted) {
      setTimeLeft(duration);
    }
  }, [duration, timerStarted]);

  useEffect(() => {
    if (!timerStarted) return;

    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setTimeout(() => {
            setTimeLeft(1); // Süreyi 1 saniyeye ayarla ve dondur
            onTimeUp();
            setTimerEnded(true);
          }, 0);
          return 1;
        }
        const newTime = prevTime - 1;
        localStorage.setItem('timeLeft', newTime.toString());
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onTimeUp, timerStarted, setTimerEnded]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className="fixed top-4 right-4 bg-white dark:bg-gray-800 text-black dark:text-white p-2 rounded-lg shadow-lg">
      {formatTime(timeLeft)}
    </div>
  );
};

export default CountdownTimer;
