'use client';

import { useState } from 'react';
import { Sparkles, Loader2, Send } from 'lucide-react';

export default function Home() {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [lastTranslatedText, setLastTranslatedText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTranslate = async () => {
    if (!inputText.trim() || inputText === lastTranslatedText) {
      if (!inputText.trim()) setTranslatedText('');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText }),
      });
      const data = await res.json();

      if (res.status === 429) {
        setTranslatedText('⚠️ Rate limit exceeded. Please wait a moment and try again.');
      } else {
        setTranslatedText(data.result || data.error);
        setLastTranslatedText(inputText);
      }
    } catch {
      setTranslatedText('An error occurred during translation.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleTranslate();
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center justify-center gap-2">
            <Sparkles className="w-8 h-8 text-purple-400" /> LexiAI
          </h1>
          <p className="text-slate-400 text-sm">Instant, Natural, Bi-directional Translator</p>
        </div>

        {/* Input Area */}
        <div className="relative space-y-2">
          <textarea
            className="w-full h-36 bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 backdrop-blur-md transition resize-none"
            placeholder="Type any casual phrase here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onBlur={handleTranslate}
            onKeyDown={handleKeyDown}
          />

          <div className="flex justify-between items-center text-xs text-slate-500 px-1">
            <span>Press Ctrl + Enter or click outside to translate</span>
            <button
              onClick={handleTranslate}
              disabled={loading || !inputText.trim()}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-medium rounded-xl transition shadow-lg text-sm"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" /> Translate
                </>
              )}
            </button>
          </div>
        </div>

        {/* Translation Output Card */}
        {translatedText ? (
          <div className="flex items-start gap-4 p-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl backdrop-blur-xl shadow-2xl transition-all">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-purple-500/30 flex items-center justify-center text-xl shadow-inner">
              🔮
            </div>
            <div className="flex-grow space-y-1">
              <div className="text-xs font-bold uppercase tracking-wider text-blue-400">
                LexiAI Interpretation
              </div>
              <div className="text-lg font-medium text-slate-100 whitespace-pre-wrap leading-relaxed">
                {translatedText}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 border border-dashed border-slate-800 rounded-2xl text-center text-slate-500 text-sm">
            ✨ Enter text above to generate a natural translation with nuances.
          </div>
        )}
      </div>
    </main>
  );
}
