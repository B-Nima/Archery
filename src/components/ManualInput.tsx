import { useState } from 'react';

interface ManualInputProps {
  onTranslate: (text: string) => void;
  isLoading: boolean;
}

const ManualInput = ({ onTranslate, isLoading }: ManualInputProps) => {
  const [text, setText] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = () => {
    if (text.trim()) {
      onTranslate(text.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="mt-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-3 flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span className="text-white font-medium">Ручной ввод текста</span>
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
        <div className="px-6 pb-4 border-t border-white/10 pt-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Введите текст для перевода..."
            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-gray-500 resize-none focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-colors"
            rows={3}
          />
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-gray-500">Enter — перевести, Shift+Enter — новая строка</span>
            <button
              onClick={handleSubmit}
              disabled={!text.trim() || isLoading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-all"
            >
              {isLoading ? 'Перевод...' : 'Перевести'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManualInput;
