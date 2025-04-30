import { useEffect, useState } from 'react';

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [isRunning, setIsRunning] = useState(false);
  const [isWork, setIsWork] = useState(true);
  const [workLen, setWorkLen] = useState(25);
  const [breakLen, setBreakLen] = useState(5);
  const [secondsLeft, setSecondsLeft] = useState(workLen * 60);
  const [cycles, setCycles] = useState(+localStorage.getItem('cycles') || 0);

  useEffect(() => {
    document.body.dataset.theme = theme === 'dusky' ? 'dusky' : '';
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            if (isWork) {
              const newCycles = cycles + 1;
              setCycles(newCycles);
              localStorage.setItem('cycles', newCycles);
            }
            setIsWork(!isWork);
            setIsRunning(false);
            alert(isWork ? 'Work session done! Time for a break.' : 'Break over! Back to work.');
            return (isWork ? breakLen : workLen) * 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, isWork, workLen, breakLen, cycles]);

  useEffect(() => {
    if (!isRunning) {
      setSecondsLeft(workLen * 60);
    }
  }, [workLen]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setSecondsLeft(workLen * 60);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dusky' ? 'light' : 'dusky');
  };

  return (
    <><button className="theme-toggle" onClick={toggleTheme}>
    {theme === 'dusky' ? 'Light ☀️' : 'Dusky 🌙'}
  </button>
    <div className="container">
      

      <div clasName="sun"></div>
      <div className="moon"></div>

      <div className="card">
        <h1>Pomodoro</h1>
        <div id="time">{formatTime(secondsLeft)}</div>
        <div>
          <button onClick={startTimer} disabled={isRunning}>Start</button>
          <button onClick={resetTimer} disabled={!isRunning}>Reset</button>
        </div>

        <div className="form-group">
          <label>
            Work <input
              type="number"
              min="1"
              value={workLen}
              onChange={(e) => setWorkLen(+e.target.value)}
              disabled={isRunning}
            /> min
          </label>
          <label>
            Break <input
              type="number"
              min="1"
              value={breakLen}
              onChange={(e) => setBreakLen(+e.target.value)}
              disabled={isRunning}
            /> min
          </label>
        </div>

        <div className="small">Completed pomodoros: {cycles}</div>
      </div>
    </div>
    </>
  );
}

export default App;
