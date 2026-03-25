import { useState, useEffect, useRef } from 'react';

const MODES = {
  work:         {label: 'focus',        time: 25 * 60,     color:'#6C63FF'},
  shortbreak:   {label: 'Short Break',  time: 5 * 60,      color:'#10B981'},
  longBreak:    {label: 'Long Break',   time: 15 * 60,     color:'#F59E0B'}
}

export default function Pomodoro() {
  const [isRunning, setIsRunning]       = useState(false);
  const [mode, setMode]                 = useState('work');
  const [secondsLeft, setSeconds]       = useState(MODES.work.time);
  const [sessions, setSessions]         = useState(0);
  const intervalRef                     = useRef(null);

  const current = MODES[mode];

  useEffect(()=> {
    if(isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => {
          if(prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            handleTimerEnd();
            return 0;
          }
          return prev - 1;
        });
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }

    return () => clearInterval(intervalRef.current)
  }, [isRunning, mode]);


  const handleTimerEnd = () => {
    const audio = new Audio('https://www.soundjay.com/buttons_c2026/sounds/button-15.mp3');
    audio.play().catch(()=>{});

    if (mode === 'work') {
      setSessions(prev => {
        const newCount = prev + 1;

        if (newCount % 4 == 0) {
          switchMode('longBreak');
        } else {
          switchMode('shortBreak');
        }
        return newCount;
      })

    } else {
      switchMode('work');
    }
  }

  const switchMode = (newMode) => {
    setMode(newMode);
    setSeconds(MODES[newMode].time);
    setIsRunning(false);
  }

  const handleReset = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setSeconds(MODES[mode].time);
  }


  //format seconds -> MM:SS
  const format = (secs) => {
    const m = Math.floor(secs/60).toString().padStart(2, '0');
    const s = Math.floor(secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  // progress ring calculations
  const total         = MODES[mode].time;
  const progress      = (secondsLeft / total);
  const radius        = 120;
  const circumfrence  = 2 * Math.PI * radius;
  const strokeDash    = circumfrence * progress;

  return (
    <div className="max-w-xl mx-auto flex flex-col items-center">
      <div className="w-full mb-8">
        <h1 className='text-white text-2xl font-bold'>Pomodoro Timer</h1>
        <p className='text-gray-500 text-sm mt-1'>
          {sessions} Sessions completed today
        </p>
      </div>

      {/*Mods Tabs*/}
      <div
      className='flex gap-2 p-1 rounded-2xl mb-10 w-full'
      style={{background: 'rgba(255,255,255,0.05)'}}
      >
        {Object.entries(MODES).map(([key, val]) => (
          <button
          key={key}
          onClick={() => switchMode(key)}
          className='flex-1 py-2 rounded-xl text-xs font-medium transition-all'
          style={{
            background : mode == key ? current.color : 'transparent',
            color: mode == key ? 'white' : '#6B7280'
          }}
          >
            {val.label}
          </button>
        ))}
      </div>
    </div>
  )
}


//https://www.soundjay.com/buttons_c2026/sounds/button-15.mp3