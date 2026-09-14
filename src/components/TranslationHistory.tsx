import { useState } from 'react';

interface TranslationEntry {
  id: number;
  source: string;
  translated: string;
  sourceLang: string;
  timestamp: Date;
}

interface TranslationHistoryProps {
  history: TranslationEntry[];
  onClear: () => void;
}

const TranslationHistory = ({ history, onClear }: TranslationHistoryProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="mt-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-white font-medium">История переводов</span>
          <span className="text-gray-400 text-sm">({history.length})</span>
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="border-t border-white/10">
          <div className="max-h-80 overflow-y-auto">
            {history.map((entry) => (
              <div
                key={entry.id}
                className="px-6 py-3 border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-purple-400 font-medium">{entry.sourceLang}</span>
                  <span className="text-xs text-gray-500">{formatTime(entry.timestamp)}</span>
                </div>
                <p className="text-gray-300 text-sm mb-1 truncate">{entry.source}</p>
                <p className="text-white text-sm font-medium">→ {entry.translated}</p>
              </div>
            ))}
          </div>
          <div className="px-6 py-3 border-t border-white/10 flex justify-end">
            <button
              onClick={onClear}
              className="text-sm text-red-400 hover:text-red-300 transition-colors"
            >
              Очистить историю
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TranslationHistory;
