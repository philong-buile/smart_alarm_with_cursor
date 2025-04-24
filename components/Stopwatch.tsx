'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw } from 'lucide-react';

const Stopwatch = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now() - time;
      intervalRef.current = setInterval(() => {
        setTime(Date.now() - (startTimeRef.current || 0));
      }, 10);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, time]);

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds
      .toString()
      .padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-5rem)] px-4">
      <div className="bg-gray-800/50 rounded-3xl p-8 backdrop-blur-sm">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">Stopwatch</h2>
        
        {/* Time display */}
        <div className="font-digital text-[5rem] text-orange-500 tracking-[0.2em] leading-none text-center mb-8 font-mono">
          {formatTime(time)}
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={handleStart}
            className={`w-14 h-14 flex items-center justify-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 ${
              isRunning 
                ? 'bg-red-500 hover:bg-red-600 focus:ring-red-500' 
                : 'bg-green-500 hover:bg-green-600 focus:ring-green-500'
            }`}
            aria-label={isRunning ? "Pause stopwatch" : "Start stopwatch"}
          >
            <Play 
              size={24} 
              className={isRunning ? 'rotate-90' : ''} 
            />
          </button>
          <button
            onClick={handleReset}
            className="w-14 h-14 flex items-center justify-center bg-red-500 rounded-full hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            aria-label="Reset stopwatch"
          >
            <RotateCcw size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Stopwatch; 