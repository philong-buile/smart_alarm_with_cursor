'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { soundPlayer } from '../utils/sounds';

interface Alarm {
  hours: number;
  minutes: number;
  sound: string;
  repeat: boolean;
  isActive: boolean;
}

interface AlarmContextType {
  alarms: Alarm[];
  activeAlarm: { index: number; time: string } | null;
  setAlarm: (hours: number, minutes: number, sound: string, repeat: boolean) => void;
  toggleAlarm: (index: number) => void;
  deleteAlarm: (index: number) => void;
  stopAlarm: () => void;
  snoozeAlarm: () => void;
}

const AlarmContext = createContext<AlarmContextType | undefined>(undefined);

export const AlarmProvider = ({ children }: { children: React.ReactNode }) => {
  const [alarms, setAlarms] = useState<Alarm[]>(() => {
    if (typeof window !== 'undefined') {
      const savedAlarms = localStorage.getItem('alarms');
      return savedAlarms ? JSON.parse(savedAlarms) : [];
    }
    return [];
  });
  const [activeAlarm, setActiveAlarm] = useState<{ index: number; time: string } | null>(null);

  // Save alarms to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('alarms', JSON.stringify(alarms));
  }, [alarms]);

  // Check alarms every second
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      
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

  const setAlarm = (hours: number, minutes: number, sound: string, repeat: boolean) => {
    setAlarms(prev => [...prev, { hours, minutes, sound, repeat, isActive: true }]);
  };

  const toggleAlarm = (index: number) => {
    setAlarms(prev => prev.map((alarm, i) => 
      i === index ? { ...alarm, isActive: !alarm.isActive } : alarm
    ));
  };

  const deleteAlarm = (index: number) => {
    setAlarms(prev => prev.filter((_, i) => i !== index));
  };

  const stopAlarm = () => {
    if (activeAlarm === null) return;
    
    soundPlayer.stop();
    setAlarms(prev => prev.filter((_, i) => i !== activeAlarm.index));
    setActiveAlarm(null);
  };

  const snoozeAlarm = () => {
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

  return (
    <AlarmContext.Provider 
      value={{ 
        alarms, 
        activeAlarm,
        setAlarm, 
        toggleAlarm, 
        deleteAlarm,
        stopAlarm,
        snoozeAlarm
      }}
    >
      {children}
    </AlarmContext.Provider>
  );
};

export const useAlarm = () => {
  const context = useContext(AlarmContext);
  if (context === undefined) {
    throw new Error('useAlarm must be used within an AlarmProvider');
  }
  return context;
}; 