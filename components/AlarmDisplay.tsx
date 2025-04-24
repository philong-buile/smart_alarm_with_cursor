'use client';

import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';

interface AlarmDisplayProps {
  alarmTime: string;
  alarmAmPm: 'AM' | 'PM';
  onStopAlarm: () => void;
}

const AlarmDisplay = ({ alarmTime, alarmAmPm, onStopAlarm }: AlarmDisplayProps) => {
  const [remainingTime, setRemainingTime] = useState('');

  useEffect(() => {
    const calculateRemainingTime = () => {
      const now = new Date();
      const [hours, minutes] = alarmTime.split(':');
      const alarmDate = new Date();
      
      let alarmHours = parseInt(hours);
      if (alarmAmPm === 'PM' && alarmHours !== 12) {
        alarmHours += 12;
      } else if (alarmAmPm === 'AM' && alarmHours === 12) {
        alarmHours = 0;
      }
      
      alarmDate.setHours(alarmHours);
      alarmDate.setMinutes(parseInt(minutes));
      alarmDate.setSeconds(0);

      // If alarm time is earlier than current time, set it for next day
      if (alarmDate < now) {
        alarmDate.setDate(alarmDate.getDate() + 1);
      }

      const diff = alarmDate.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const timer = setInterval(() => {
      setRemainingTime(calculateRemainingTime());
    }, 1000);

    setRemainingTime(calculateRemainingTime());

    return () => clearInterval(timer);
  }, [alarmTime, alarmAmPm]);

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-6">
      <h2 className="text-orange-400 text-2xl font-semibold">Alarm</h2>
      
      <div className="flex items-center space-x-2 text-5xl font-digital text-orange-400">
        <Bell className="w-8 h-8" />
        <span>{alarmTime}</span>
        <span>{alarmAmPm}</span>
      </div>

      <div className="text-3xl font-digital text-orange-400">
        {remainingTime}
      </div>

      <button
        onClick={onStopAlarm}
        className="mt-4 px-6 py-2 bg-red-400 text-white rounded-md hover:bg-red-500 transition-colors"
      >
        Stop Alarm
      </button>
    </div>
  );
};

export default AlarmDisplay; 