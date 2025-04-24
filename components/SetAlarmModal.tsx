'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface SetAlarmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSetAlarm: (time: string, ampm: 'AM' | 'PM') => void;
}

const getInitialTime = () => {
  const now = new Date();
  const nextMinute = new Date(now.getTime() + 60000); // Add 1 minute
  
  let hours = nextMinute.getHours();
  const minutes = nextMinute.getMinutes();
  let ampm: 'AM' | 'PM' = hours >= 12 ? 'PM' : 'AM';
  
  // Convert to 12-hour format
  hours = hours % 12;
  hours = hours === 0 ? 12 : hours;
  
  return {
    hours: String(hours).padStart(2, '0'),
    minutes: String(minutes).padStart(2, '0'),
    ampm
  };
};

const SetAlarmModal = ({ isOpen, onClose, onSetAlarm }: SetAlarmModalProps) => {
  const initialTime = getInitialTime();
  const [hours, setHours] = useState(initialTime.hours);
  const [minutes, setMinutes] = useState(initialTime.minutes);
  const [ampm, setAmpm] = useState<'AM' | 'PM'>(initialTime.ampm);

  // Add one minute whenever hours change
  const handleHoursChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setHours(e.target.value);
    setMinutes('01'); // Reset to 01 minute when hours change
  };

  // Add one minute whenever minutes are set to 00
  const handleMinutesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMinutes = e.target.value;
    if (newMinutes === '00') {
      setMinutes('01');
    } else {
      setMinutes(newMinutes);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSetAlarm(`${hours}:${minutes}`, ampm);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-zinc-900 rounded-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-zinc-400 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>
        
        <h2 className="text-2xl font-semibold mb-6">Set Alarm</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center justify-center gap-4">
            <select
              value={hours}
              onChange={handleHoursChange}
              className="bg-zinc-800 text-white text-4xl font-digital rounded px-4 py-2 w-24 appearance-none text-center"
            >
              {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')).map((hour) => (
                <option key={hour} value={hour}>{hour}</option>
              ))}
            </select>
            <span className="text-4xl font-digital">:</span>
            <select
              value={minutes}
              onChange={handleMinutesChange}
              className="bg-zinc-800 text-white text-4xl font-digital rounded px-4 py-2 w-24 appearance-none text-center"
            >
              {Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0')).map((minute) => (
                <option key={minute} value={minute}>{minute}</option>
              ))}
            </select>
            <select
              value={ampm}
              onChange={(e) => setAmpm(e.target.value as 'AM' | 'PM')}
              className="bg-zinc-800 text-white text-4xl font-digital rounded px-4 py-2 w-24 appearance-none text-center"
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-zinc-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 transition-colors"
            >
              Set Alarm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SetAlarmModal; 