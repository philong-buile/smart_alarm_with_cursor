'use client';

import { useState, useEffect } from 'react';
import { Share2, Minus, Plus, Maximize2, Bell, X } from 'lucide-react';
import AlarmModal from './AlarmModal';
import AlarmNotificationModal from './AlarmNotificationModal';
import { soundPlayer, ALARM_SOUNDS } from '../utils/sounds';

interface Alarm {
  hours: number;
  minutes: number;
  sound: string;
  repeat: boolean;
  isActive: boolean;
}

const DigitalClock = () => {
  const [time, setTime] = useState<Date | null>(null);
  const [isAlarmModalOpen, setIsAlarmModalOpen] = useState(false);
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [showAlarms, setShowAlarms] = useState(false);
  const [activeAlarm, setActiveAlarm] = useState<{ index: number; time: string } | null>(null);

  // Validate existing alarms against available sounds
  useEffect(() => {
    setAlarms(prevAlarms => 
      prevAlarms.filter(alarm => 
        ALARM_SOUNDS.some(sound => sound.name === alarm.sound)
      )
    );
  }, []);

  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now);
      
      // Check alarms
      alarms.forEach((alarm, index) => {
        if (alarm.isActive) {
          if (now.getHours() === alarm.hours && 
              now.getMinutes() === alarm.minutes && 
              now.getSeconds() === 0) {
            soundPlayer.play(alarm.sound, alarm.repeat);
            const formattedTime = `${alarm.hours.toString().padStart(2, '0')}:${alarm.minutes.toString().padStart(2, '0')}`;
            setActiveAlarm({ index, time: formattedTime });
          }
        }
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      soundPlayer.stop();
    };
  }, [alarms]);

  const handleStopAlarm = () => {
    if (activeAlarm === null) return;
    
    soundPlayer.stop();
    setAlarms(prev => prev.filter((_, i) => i !== activeAlarm.index));
    setActiveAlarm(null);
  };

  const handleSnoozeAlarm = () => {
    if (activeAlarm === null) return;

    soundPlayer.stop();
    
    // Calculate new alarm time (current time + 5 minutes)
    const now = new Date();
    now.setMinutes(now.getMinutes() + 5);
    
    setAlarms(prev => prev.map((alarm, i) => 
      i === activeAlarm.index
        ? {
            ...alarm,
            hours: now.getHours(),
            minutes: now.getMinutes(),
          }
        : alarm
    ));
    setActiveAlarm(null);
  };

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

  const formatAlarmTime = (hours: number, minutes: number) => {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const playAlarmSound = (sound: string, repeat: boolean) => {
    // TODO: Implement different alarm sounds
    const audio = new Audio('/alarm-sound.mp3');
    audio.loop = repeat;
    audio.play().catch(error => console.log('Error playing alarm sound:', error));
  };

  const handleSetAlarm = (hours: number, minutes: number, sound: string, repeat: boolean) => {
    setAlarms(prev => [...prev, { hours, minutes, sound, repeat, isActive: true }]);
    setIsAlarmModalOpen(false);
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
            className="px-8 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 flex items-center space-x-2"
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
                        alarm.isActive ? 'text-blue-500' : 'text-gray-500'
                      }`}
                      aria-label={alarm.isActive ? 'Disable alarm' : 'Enable alarm'}
                    >
                      <Bell size={16} />
                    </button>
                    <div>
                      <div className="font-medium">{formatAlarmTime(alarm.hours, alarm.minutes)}</div>
                      <div className="text-sm text-gray-400">
                        {alarm.sound} {alarm.repeat && '• Repeat'}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteAlarm(index)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="Delete alarm"
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

      <AlarmNotificationModal
        isOpen={activeAlarm !== null}
        onClose={handleStopAlarm}
        onSnooze={handleSnoozeAlarm}
        alarmTime={activeAlarm?.time || ''}
      />
    </div>
  );
};

export default DigitalClock; 