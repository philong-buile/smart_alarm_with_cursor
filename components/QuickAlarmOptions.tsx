'use client';

interface QuickOption {
  label: string;
  minutes: number;
  seconds?: number;
}

interface QuickAlarmOptionsProps {
  onSelect: (minutes: number, seconds?: number) => void;
}

const QUICK_OPTIONS: QuickOption[] = [
  { label: '1 min', minutes: 1 },
  { label: '15 min', minutes: 15 },
  { label: '30 min', minutes: 30 },
  { label: '1 hour', minutes: 60 },
  { label: '2 hours', minutes: 120 },
  { label: '3 hours', minutes: 180 },
];

const QuickAlarmOptions = ({ onSelect }: QuickAlarmOptionsProps) => {
  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-gray-300">Quick Options</div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {QUICK_OPTIONS.map((option) => (
          <button
            key={option.label}
            onClick={() => onSelect(option.minutes, option.seconds)}
            className="px-3 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 text-sm"
          >
            +{option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickAlarmOptions; 