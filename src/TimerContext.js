import React, { createContext, useState, useEffect } from 'react';

// Create the TimerContext to manage the global state
export const TimerContext = createContext();

const TimerProvider = ({ children }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);  // Default work time (25 minutes in seconds)
  const [isRunning, setIsRunning] = useState(false);
  const [pomodoros, setPomodoros] = useState(0);

  useEffect(() => {
    let interval;

    if (isRunning) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime === 0) {
            setPomodoros((prevPomodoros) => prevPomodoros + 1);
            setIsRunning(false);  // Stop the timer when it reaches 0
            return 25 * 60;  // Reset time for a new Pomodoro cycle
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (!isRunning && timeLeft !== 0) {
      clearInterval(interval);  // Clear interval when timer is paused or stopped
    }

    return () => clearInterval(interval);  // Cleanup on unmount
  }, [isRunning, timeLeft]);

  const startTimer = () => {
    setIsRunning(true);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(25 * 60);  // Reset to 25 minutes
  };

  const toggleTimer = () => {
    setIsRunning((prevState) => !prevState);
  };

  return (
    <TimerContext.Provider
      value={{ timeLeft, isRunning, pomodoros, startTimer, resetTimer, toggleTimer }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export default TimerProvider;
