import { useState, useEffect, useRef } from "react";

const MODES = {
  work: { label: "focus", time: 25 * 60, color: "#6C63FF" },
  shortbreak: { label: "Short Break", time: 5 * 60, color: "#10B981" },
  longBreak: { label: "Long Break", time: 15 * 60, color: "#F59E0B" },
};

export default function Pomodoro() {
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState("work");
  const [secondsLeft, setSeconds] = useState(MODES.work.time);
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef(null);

  const current = MODES[mode];

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            handleTimerEnd();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, mode]);

  const handleTimerEnd = () => {
    const audio = new Audio(
      "https://www.soundjay.com/buttons_c2026/sounds/button-15.mp3",
    );
    audio.play().catch(() => {});

    if (mode === "work") {
      setSessions((prev) => {
        const newCount = prev + 1;

        if (newCount % 4 == 0) {
          switchMode("longBreak");
        } else {
          switchMode("shortbreak");
        }
        return newCount;
      });
    } else {
      switchMode("work");
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setSeconds(MODES[newMode].time);
    setIsRunning(false);
  };

  const handleReset = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setSeconds(MODES[mode].time);
  };

  //format seconds -> MM:SS
  const format = (secs) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = Math.floor(secs % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  // progress ring calculations
  const total = MODES[mode].time;
  const progress = secondsLeft / total;
  const radius = 120;
  const circumfrence = 2 * Math.PI * radius;
  const strokeDash = circumfrence * progress;

  return (
    <div className="max-w-xl mx-auto flex flex-col items-center">
      <div className="w-full mb-8">
        <h1 className="text-white text-2xl font-bold">Pomodoro Timer</h1>
        <p className="text-gray-500 text-sm mt-1">
          {sessions} Sessions completed today
        </p>
      </div>

      {/*Mods Tabs*/}
      <div
        className="flex gap-2 p-1 rounded-2xl mb-10 w-full"
        style={{ background: "rgba(255,255,255,0.05)" }}
      >
        {Object.entries(MODES).map(([key, val]) => (
          <button
            key={key}
            onClick={() => switchMode(key)}
            className="flex-1 py-2 rounded-xl text-xs font-medium transition-all"
            style={{
              background: mode == key ? current.color : "transparent",
              color: mode == key ? "white" : "#6B7280",
            }}
          >
            {val.label}
          </button>
        ))}
      </div>

      {/* Timer Ring */}
      <div className="relative flex items-center justify-center mb-10">
        <svg width="280" height="280" className="=-rotate-90">
          {/* background circle */}
          <circle
            cx="140"
            cy="140"
            r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth="8"
          />

          {/* progress circle */}

          <circle
            cx="140"
            cy="140"
            r={radius}
            fill="none"
            stroke={current.color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumfrence}
            strokeDashoffset={circumfrence - strokeDash}
            style={{ transition: "stroke-dashoffset 1s linear" }}
          />
        </svg>

        <div className="absolute flex flex-col items-center">
          <span className="text-5xl text-white font-bold tracking-tight">
            {format(secondsLeft)}
          </span>
          <span className="text-gray-500 text-sm mt-1">{current.label}</span>
        </div>
      </div>

      {/* controls */}

      <div className="flex items-center gap-4">
        {/* reset */}
        <button onClick={handleReset} 
        className="w-12 h-12 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-all"
        style={{ background: 'rgba(255,255,255,0.05)' }}>↺</button>

        {/* Play / Pause */}
        <button
        onClick={() => setIsRunning(prev => !prev)}
        className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl transition-all"
        style={{
            background: `linear-gradient(135deg, ${current.color}, ${current.color}AA)`,
            boxShadow: `0 4px 30px ${current.color}55`
          }}>
          {isRunning ? '⏸' : '▶'}
        </button>

        {/* skip */}

        <button
          onClick={handleTimerEnd}
          className="w-12 h-12 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-all"
          style={{ background: 'rgba(255,255,255,0.05)' }}
        >
          ⏭
        </button>
      </div>

      {/* Session Date */}

      <div className="flex gap-2 mt-10">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
          key={i}
          className="w-3 h-3 rounded-full transition-all"
          style={{
            background: i < (sessions % 4)
            ? current.color : 'rgba(255,255,255,0.1)'
          }}
          />
        ))}
      </div>

      <p className="text-gray-600 text-xs mt-2">
        {4 - (sessions % 4)} sessions until long break
      </p>
    </div>
  );
}

//https://www.soundjay.com/buttons_c2026/sounds/button-15.mp3
