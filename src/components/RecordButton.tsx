interface RecordButtonProps {
  isRecording: boolean;
  onStart: () => void;
  onStop: () => void;
}

const RecordButton = ({ isRecording, onStart, onStop }: RecordButtonProps) => {
  return (
    <div className="relative">
      {/* Pulse rings when recording */}
      {isRecording && (
        <>
          <div className="absolute inset-0 bg-red-500/30 rounded-full animate-pulse-ring"></div>
          <div className="absolute inset-0 bg-red-500/20 rounded-full animate-pulse-ring" style={{ animationDelay: '0.5s' }}></div>
        </>
      )}
      
      <button
        onClick={isRecording ? onStop : onStart}
        className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${
          isRecording
            ? 'bg-red-500 hover:bg-red-600 shadow-red-500/30 scale-110'
            : 'bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-purple-500/30 hover:scale-105'
        }`}
        title={isRecording ? 'Остановить запись' : 'Начать запись'}
      >
        {isRecording ? (
          <div className="w-6 h-6 bg-white rounded-sm"></div>
        ) : (
          <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default RecordButton;
