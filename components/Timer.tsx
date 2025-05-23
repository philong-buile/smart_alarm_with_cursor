'use client';

import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import TimerNotificationModal from './TimerNotificationModal';
import { soundPlayer } from '../utils/sounds';

const Timer = () => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && totalSeconds > 0) {
      interval = setInterval(() => {
        setTotalSeconds(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            playTimerEndSound();
            setShowNotification(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, totalSeconds]);

  useEffect(() => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    setHours(h);
    setMinutes(m);
    setSeconds(s);
  }, [totalSeconds]);

  const handleStart = () => {
    const total = hours * 3600 + minutes * 60 + seconds;
    if (total > 0) {
      setTotalSeconds(total);
      setIsRunning(true);
    }
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTotalSeconds(0);
    setHours(0);
    setMinutes(0);
    setSeconds(0);
  };

  const playTimerEndSound = () => {
    soundPlayer.play('Bell', true, 3); // Play the bell sound for 3 seconds
  };

  const handleCloseNotification = () => {
    setShowNotification(false);
    soundPlayer.stop();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-5rem)] px-4">
      <div className="bg-gray-800 rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Timer</h2>
        
        <div className="flex justify-center space-x-4 mb-8">
          <div className="flex flex-col items-center">
            <input
              type="number"
              min="0"
              max="23"
              value={hours}
              onChange={(e) => setHours(parseInt(e.target.value) || 0)}
              className="w-20 px-3 py-2 bg-gray-700 rounded-md text-white text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isRunning}
            />
            <span className="text-gray-400 text-sm mt-1">Hours</span>
          </div>
          <div className="flex flex-col items-center">
            <input
              type="number"
              min="0"
              max="59"
              value={minutes}
              onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
              className="w-20 px-3 py-2 bg-gray-700 rounded-md text-white text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isRunning}
            />
            <span className="text-gray-400 text-sm mt-1">Minutes</span>
          </div>
          <div className="flex flex-col items-center">
            <input
              type="number"
              min="0"
              max="59"
              value={seconds}
              onChange={(e) => setSeconds(parseInt(e.target.value) || 0)}
              className="w-20 px-3 py-2 bg-gray-700 rounded-md text-white text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isRunning}
            />
            <span className="text-gray-400 text-sm mt-1">Seconds</span>
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          {!isRunning ? (
            <button
              onClick={handleStart}
              disabled={totalSeconds === 0 && hours === 0 && minutes === 0 && seconds === 0}
              className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play size={24} />
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="p-3 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              <Pause size={24} />
            </button>
          )}
          <button
            onClick={handleReset}
            className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            <RotateCcw size={24} />
          </button>
        </div>
      </div>

      <TimerNotificationModal
        isOpen={showNotification}
        onClose={handleCloseNotification}
      />
    </div>
  );
};

export default Timer; 