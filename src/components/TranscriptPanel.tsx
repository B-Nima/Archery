interface TranscriptPanelProps {
  title: string;
  subtitle: string;
  text: string;
  interimText?: string;
  isListening?: boolean;
  isLoading?: boolean;
  isSpeaking?: boolean;
  icon: string;
  onSpeak?: () => void;
}

const TranscriptPanel = ({
  title,
  subtitle,
  text,
  interimText = '',
  isListening = false,
  isLoading = false,
  isSpeaking = false,
  icon,
  onSpeak,
}: TranscriptPanelProps) => {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          <div>
            <h3 className="text-white font-medium text-sm">{title}</h3>
            <p className="text-gray-400 text-xs">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isListening && (
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-xs">Запись</span>
            </div>
          )}
          {isSpeaking && (
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-blue-400 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
              </svg>
              <span className="text-blue-400 text-xs">Озвучка</span>
            </div>
          )}
          {onSpeak && text && (
            <button
              onClick={onSpeak}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
              title="Озвучить перевод"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 min-h-[160px] max-h-[300px] overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
              <span className="text-gray-400">Переводим...</span>
            </div>
          </div>
        ) : text || interimText ? (
          <p className="text-gray-200 text-base leading-relaxed whitespace-pre-wrap">
            {text}
            {interimText && (
              <span className="text-gray-400 italic">{interimText}</span>
            )}
          </p>
        ) : (
          <div className="flex flex-col items-center justify-center h-32 text-gray-500">
            <svg className="w-10 h-10 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
            <p className="text-sm">
              {isListening ? 'Говорите...' : 'Нажмите кнопку для записи'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TranscriptPanel;
