'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface AlarmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (time: string, label: string) => void;
}

const AlarmModal = ({ isOpen, onClose, onSave }: AlarmModalProps) => {
  const [time, setTime] = useState('');
  const [label, setLabel] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (time) {
      onSave(time, label);
      setTime('');
      setLabel('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold text-white mb-6">Set Alarm</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-300 mb-2">
              Time
            </label>
            <input
              type="time"
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label htmlFor="label" className="block text-sm font-medium text-gray-300 mb-2">
              Label (optional)
            </label>
            <input
              type="text"
              id="label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Wake up, Meeting, etc."
              className="w-full px-3 py-2 bg-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              Set Alarm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AlarmModal; 