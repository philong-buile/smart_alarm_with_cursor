'use client';

import { useState, useEffect } from 'react';
import { X, ChevronUp, ChevronDown, Play, Square } from 'lucide-react';
import { soundPlayer, ALARM_SOUNDS } from '../utils/sounds';
import QuickAlarmOptions from './QuickAlarmOptions';

interface AlarmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (hours: number, minutes: number, sound: string, repeat: boolean) => void;
}

const AlarmModal = ({ isOpen, onClose, onSave }: AlarmModalProps) => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [sound, setSound] = useState(ALARM_SOUNDS[0].name);
  const [repeat, setRepeat] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  // Set initial time to current time when modal opens
  useEffect(() => {
    if (isOpen) {
      const now = new Date();
      setHours(now.getHours());
      setMinutes(now.getMinutes());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleHoursChange = (value: number) => {
    if (value >= 0 && value <= 23) {
      setHours(value);
    }
  };

  const handleMinutesChange = (value: number) => {
    if (value >= 0 && value <= 59) {
      setMinutes(value);
    }
  };

  const handleQuickOptionSelect = (addMinutes: number, addSeconds?: number) => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + addMinutes);
    if (addSeconds) {
      now.setSeconds(now.getSeconds() + addSeconds);
    }
    setHours(now.getHours());
    setMinutes(now.getMinutes());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(hours, minutes, sound, repeat);
  };

  const handlePreviewSound = () => {
    if (isPlaying) {
      soundPlayer.stop();
      setIsPlaying(false);
    } else {
      soundPlayer.play(sound, false, 3); // Play for 3 seconds
      setIsPlaying(true);
      setTimeout(() => setIsPlaying(false), 3000);
    }
  };

  const handleTestAlarm = () => {
    soundPlayer.play(sound, repeat, repeat ? undefined : 5); // Play for 5 seconds if not repeating
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-md relative">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-semibold text-white">Edit Alarm</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Quick Options */}
          <QuickAlarmOptions onSelect={handleQuickOptionSelect} />

          {/* Time Selection */}
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Hours</label>
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={() => handleHoursChange(hours - 1)}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Decrease hours"
                >
                  <ChevronDown size={24} />
                </button>
                <select
                  value={hours}
                  onChange={(e) => handleHoursChange(parseInt(e.target.value))}
                  className="w-24 px-3 py-2 bg-gray-700 rounded-md text-white text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Array.from({ length: 24 }, (_, i) => (
                    <option key={i} value={i}>
                      {i.toString().padStart(2, '0')}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => handleHoursChange(hours + 1)}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Increase hours"
                >
                  <ChevronUp size={24} />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Minutes</label>
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={() => handleMinutesChange(minutes - 1)}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Decrease minutes"
                >
                  <ChevronDown size={24} />
                </button>
                <select
                  value={minutes}
                  onChange={(e) => handleMinutesChange(parseInt(e.target.value))}
                  className="w-24 px-3 py-2 bg-gray-700 rounded-md text-white text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Array.from({ length: 60 }, (_, i) => (
                    <option key={i} value={i}>
                      {i.toString().padStart(2, '0')}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => handleMinutesChange(minutes + 1)}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Increase minutes"
                >
                  <ChevronUp size={24} />
                </button>
              </div>
            </div>
          </div>

          {/* Sound Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Sound</label>
            <div className="flex items-center space-x-2">
              <select
                value={sound}
                onChange={(e) => setSound(e.target.value)}
                className="flex-1 px-3 py-2 bg-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {ALARM_SOUNDS.map((s) => (
                  <option key={s.name} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handlePreviewSound}
                className="p-2 text-gray-400 hover:text-white transition-colors"
                aria-label={isPlaying ? 'Stop preview' : 'Preview sound'}
              >
                {isPlaying ? <Square size={20} /> : <Play size={20} />}
              </button>
            </div>
          </div>

          {/* Repeat Toggle */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="repeat"
              checked={repeat}
              onChange={(e) => setRepeat(e.target.checked)}
              className="w-4 h-4 text-blue-500 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
            />
            <label htmlFor="repeat" className="text-sm font-medium text-gray-300">
              Repeat sound
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={handleTestAlarm}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Test
            </button>
            <div className="space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                Start
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AlarmModal; 