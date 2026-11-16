import type { Language } from './VoiceTranslator';

interface LanguageSelectorProps {
  sourceLang: Language;
  setSourceLang: (lang: Language) => void;
  autoTranslate: boolean;
  setAutoTranslate: (value: boolean) => void;
}

const languages: { value: Language; label: string; flag: string; description: string }[] = [
  { value: 'en-US', label: 'Английский', flag: '🇬🇧', description: 'English' },
  { value: 'fr-FR', label: 'Французский', flag: '🇫🇷', description: 'Français' },
  { value: 'bx-RU', label: 'Бурятский', flag: '🏔️', description: 'Буряад хэлэн' },
];

const LanguageSelector = ({ sourceLang, setSourceLang, autoTranslate, setAutoTranslate }: LanguageSelectorProps) => {
  return (
    <div className="mb-6">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold text-lg flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            Исходный язык
          </h3>
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-sm text-gray-400">Автоперевод</span>
            <div
              className={`relative w-11 h-6 rounded-full transition-colors ${
                autoTranslate ? 'bg-purple-500' : 'bg-gray-600'
              }`}
              onClick={() => setAutoTranslate(!autoTranslate)}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow ${
                  autoTranslate ? 'translate-x-5.5 left-0.5' : 'left-0.5'
                }`}
                style={{ transform: autoTranslate ? 'translateX(20px)' : 'translateX(0)' }}
              ></div>
            </div>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {languages.map((lang) => (
            <button
              key={lang.value}
              onClick={() => setSourceLang(lang.value)}
              className={`relative p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                sourceLang === lang.value
                  ? 'border-purple-500 bg-purple-500/20 shadow-lg shadow-purple-500/10'
                  : 'border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{lang.flag}</span>
                <div>
                  <div className="text-white font-medium">{lang.label}</div>
                  <div className="text-gray-400 text-sm">{lang.description}</div>
                </div>
              </div>
              {sourceLang === lang.value && (
                <div className="absolute top-2 right-2 w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
              )}
            </button>
          ))}
        </div>

        {/* Target language display */}
        <div className="mt-4 flex items-center justify-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/20"></div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
            <span className="text-lg">🇷🇺</span>
            <span className="text-white font-medium">Русский</span>
            <span className="text-gray-400 text-sm">(целевой)</span>
          </div>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/20"></div>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;
