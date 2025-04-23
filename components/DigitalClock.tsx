'use client';

import { useState, useEffect } from 'react';
import { Share2, Minus, Plus, Maximize2, Bell, X } from 'lucide-react';
import AlarmModal from './AlarmModal';

interface Alarm {
  time: string;
  label: string;
  isActive: boolean;
}

const DigitalClock = () => {
  const [time, setTime] = useState<Date | null>(null);
  const [isAlarmModalOpen, setIsAlarmModalOpen] = useState(false);
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [showAlarms, setShowAlarms] = useState(false);

  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now);
      
      // Check alarms
      alarms.forEach(alarm => {
        if (alarm.isActive) {
          const [alarmHours, alarmMinutes] = alarm.time.split(':');
          if (now.getHours() === parseInt(alarmHours) && 
              now.getMinutes() === parseInt(alarmMinutes) && 
              now.getSeconds() === 0) {
            playAlarmSound();
            alert(`Alarm: ${alarm.label || 'Time to wake up!'}`);
          }
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [alarms]);

  const formatTime = (date: Date | null) => {
    if (!date) return '--:--:-- --';
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }).replace(/\s/g, ' ');
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '--- --- --, ----';
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    }).toUpperCase();
  };

  const playAlarmSound = () => {
    const audio = new Audio('/alarm-sound.mp3');
    audio.play().catch(error => console.log('Error playing alarm sound:', error));
  };

  const handleSetAlarm = (time: string, label: string) => {
    setAlarms(prev => [...prev, { time, label, isActive: true }]);
  };

  const toggleAlarm = (index: number) => {
    setAlarms(prev => prev.map((alarm, i) => 
      i === index ? { ...alarm, isActive: !alarm.isActive } : alarm
    ));
  };

  const deleteAlarm = (index: number) => {
    setAlarms(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-5rem)] px-4">
      {/* Control buttons */}
      <div className="absolute top-4 right-4 flex items-center space-x-6">
        <button 
          className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
          aria-label="Share"
        >
          <Share2 size={20} />
        </button>
        <button 
          className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
          aria-label="Zoom out"
        >
          <Minus size={20} />
        </button>
        <button 
          className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
          aria-label="Zoom in"
        >
          <Plus size={20} />
        </button>
        <button 
          className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
          aria-label="Fullscreen"
        >
          <Maximize2 size={20} />
        </button>
      </div>

      {/* Clock container */}
      <div className="flex flex-col items-center space-y-4">
        {/* Digital clock display */}
        <div className="text-[8rem] md:text-[10rem] font-digital text-orange-500 tracking-wider leading-none">
          {formatTime(time)}
        </div>

        {/* Date display */}
        <div className="text-2xl md:text-3xl font-digital text-orange-500 tracking-wide">
          {formatDate(time)}
        </div>

        {/* Alarm section */}
        <div className="mt-8 flex flex-col items-center space-y-4">
          <button
            onClick={() => setIsAlarmModalOpen(true)}
            className="px-8 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 flex items-center space-x-2"
          >
            <Bell size={20} />
            <span>Set Alarm</span>
          </button>

          {alarms.length > 0 && (
            <button
              onClick={() => setShowAlarms(!showAlarms)}
              className="text-gray-300 hover:text-white transition-colors"
            >
              {showAlarms ? 'Hide Alarms' : `Show Alarms (${alarms.length})`}
            </button>
          )}

          {showAlarms && alarms.length > 0 && (
            <div className="w-full max-w-md space-y-2">
              {alarms.map((alarm, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => toggleAlarm(index)}
                      className={`p-1 rounded-full ${
                        alarm.isActive ? 'text-green-500' : 'text-gray-500'
                      }`}
                    >
                      <Bell size={16} />
                    </button>
                    <div>
                      <div className="font-medium">{alarm.time}</div>
                      {alarm.label && (
                        <div className="text-sm text-gray-400">{alarm.label}</div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteAlarm(index)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AlarmModal
        isOpen={isAlarmModalOpen}
        onClose={() => setIsAlarmModalOpen(false)}
        onSave={handleSetAlarm}
      />
    </div>
  );
};

export default DigitalClock; 