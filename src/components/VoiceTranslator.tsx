import { useState, useRef, useCallback, useEffect } from 'react';
import LanguageSelector from './LanguageSelector';
import TranscriptPanel from './TranscriptPanel';
import RecordButton from './RecordButton';
import TranslationHistory from './TranslationHistory';
import ManualInput from './ManualInput';

export type Language = 'en-US' | 'fr-FR' | 'bx-RU' | 'auto';

interface TranslationEntry {
  id: number;
  source: string;
  translated: string;
  sourceLang: string;
  timestamp: Date;
}

const VoiceTranslator = () => {
  const [sourceLang, setSourceLang] = useState<Language>('en-US');
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [translation, setTranslation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<TranslationEntry[]>([]);
  const [error, setError] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoTranslate, setAutoTranslate] = useState(true);

  const recognitionRef = useRef<any>(null);
  const translateTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idCounter = useRef(0);

  const getLanguageName = (lang: Language): string => {
    switch (lang) {
      case 'en-US': return 'Английский';
      case 'fr-FR': return 'Французский';
      case 'bx-RU': return 'Бурятский';
      case 'auto': return 'Автоопределение';
      default: return lang;
    }
  };



  // Initialize Speech Recognition
  const initRecognition = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setError('Ваш браузер не поддерживает распознавание речи. Пожалуйста, используйте Google Chrome.');
      return null;
    }

    const recognition = new SpeechRecognition();
    
    // For Buryat, we use Russian recognition as closest available
    const langCode = sourceLang === 'bx-RU' ? 'ru-RU' : sourceLang === 'auto' ? 'en-US' : sourceLang;
    recognition.lang = langCode;
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interim = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }

      if (finalTranscript) {
        setTranscript(prev => prev + finalTranscript);
        setInterimTranscript('');
        
        // Auto-translate
        if (autoTranslate) {
          if (translateTimeoutRef.current) {
            clearTimeout(translateTimeoutRef.current);
          }
          translateTimeoutRef.current = setTimeout(() => {
            translateText(finalTranscript);
          }, 1000);
        }
      } else {
        setInterimTranscript(interim);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        setError('Доступ к микрофону запрещён. Пожалуйста, разрешите доступ в настройках браузера.');
      } else if (event.error === 'no-speech') {
        // Ignore no-speech errors during recording
      } else {
        setError(`Ошибка распознавания: ${event.error}`);
      }
    };

    recognition.onend = () => {
      if (isRecording) {
        // Restart recognition if still recording
        try {
          recognition.start();
        } catch (e) {
          // Already started
        }
      }
    };

    return recognition;
  }, [sourceLang, isRecording, autoTranslate]);

  const translateText = async (text: string) => {
    if (!text.trim()) return;
    
    setIsLoading(true);
    try {
      // Using MyMemory Translation API (free, no key required)
      const sourceLangCode = sourceLang === 'bx-RU' ? 'ru' : sourceLang === 'en-US' ? 'en' : sourceLang === 'fr-FR' ? 'fr' : 'en';
      const targetLangCode = 'ru';
      
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLangCode}|${targetLangCode}`
      );
      
      const data = await response.json();
      
      if (data.responseStatus === 200 && data.responseData) {
        const translatedText = data.responseData.translatedText;
        setTranslation(translatedText);
        
        // Add to history
        const entry: TranslationEntry = {
          id: ++idCounter.current,
          source: text,
          translated: translatedText,
          sourceLang: getLanguageName(sourceLang),
          timestamp: new Date()
        };
        setHistory(prev => [entry, ...prev].slice(0, 20));
      } else {
        setError('Ошибка при переводе текста');
      }
    } catch (err) {
      console.error('Translation error:', err);
      setError('Не удалось подключиться к сервису перевода');
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = () => {
    setError('');
    setTranscript('');
    setInterimTranscript('');
    setTranslation('');
    
    const recognition = initRecognition();
    if (recognition) {
      recognitionRef.current = recognition;
      try {
        recognition.start();
        setIsRecording(true);
      } catch (e) {
        setError('Не удалось запустить распознавание речи');
      }
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsRecording(false);
    
    // Translate remaining transcript
    if (transcript.trim() && !translation) {
      translateText(transcript);
    }
  };

  const speakTranslation = () => {
    if (!translation) return;
    
    const utterance = new SpeechSynthesisUtterance(translation);
    utterance.lang = 'ru-RU';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const clearAll = () => {
    setTranscript('');
    setInterimTranscript('');
    setTranslation('');
    setError('');
  };

  const handleManualTranslate = () => {
    if (transcript.trim()) {
      translateText(transcript);
    }
  };

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      window.speechSynthesis.cancel();
      if (translateTimeoutRef.current) {
        clearTimeout(translateTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Синхронный переводчик
          </h1>
        </div>
        <p className="text-gray-300 text-lg">
          Перевод речи на английский, французский и бурятский → русский
        </p>
      </div>

      {/* Language Selector */}
      <LanguageSelector
        sourceLang={sourceLang}
        setSourceLang={setSourceLang}
        autoTranslate={autoTranslate}
        setAutoTranslate={setAutoTranslate}
      />

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 flex items-center gap-3">
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
          <button onClick={() => setError('')} className="ml-auto text-red-300 hover:text-white">✕</button>
        </div>
      )}

      {/* Main Content */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {/* Source Panel */}
        <TranscriptPanel
          title="Исходная речь"
          subtitle={getLanguageName(sourceLang)}
          text={transcript}
          interimText={interimTranscript}
          isListening={isRecording}
          icon="🎤"
        />

        {/* Translation Panel */}
        <TranscriptPanel
          title="Перевод на русский"
          subtitle="Русский язык"
          text={translation}
          isLoading={isLoading}
          isSpeaking={isSpeaking}
          icon="🇷🇺"
          onSpeak={translation ? speakTranslation : undefined}
        />
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-4">
          <RecordButton
            isRecording={isRecording}
            onStart={startRecording}
            onStop={stopRecording}
          />
          
          {!isRecording && transcript && (
            <button
              onClick={handleManualTranslate}
              disabled={isLoading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-blue-500/25"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Перевод...
                </span>
              ) : 'Перевести'}
            </button>
          )}

          {(transcript || translation) && (
            <button
              onClick={clearAll}
              className="px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-all"
            >
              Очистить
            </button>
          )}
        </div>

        {isRecording && (
          <div className="flex items-center gap-2 text-green-400">
            <div className="flex items-end gap-1 h-6">
              <div className="w-1 bg-green-400 rounded-full wave-bar" style={{ height: '100%' }}></div>
              <div className="w-1 bg-green-400 rounded-full wave-bar" style={{ height: '100%' }}></div>
              <div className="w-1 bg-green-400 rounded-full wave-bar" style={{ height: '100%' }}></div>
              <div className="w-1 bg-green-400 rounded-full wave-bar" style={{ height: '100%' }}></div>
              <div className="w-1 bg-green-400 rounded-full wave-bar" style={{ height: '100%' }}></div>
            </div>
            <span className="text-sm">Слушаю...</span>
          </div>
        )}
      </div>

      {/* Manual Input */}
      <ManualInput
        onTranslate={translateText}
        isLoading={isLoading}
      />

      {/* History */}
      {history.length > 0 && (
        <TranslationHistory
          history={history}
          onClear={() => setHistory([])}
        />
      )}

      {/* Footer */}
      <div className="mt-8 text-center text-gray-500 text-sm">
        <p>Используйте Google Chrome для лучшей поддержки распознавания речи</p>
        <p className="mt-1">Для бурятского языка используется распознавание русской речи</p>
      </div>
    </div>
  );
};

export default VoiceTranslator;
