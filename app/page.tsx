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
    <main className="min-h-screen bg-slate-50 text-slate-800 flex flex-col items-center justify-center p-6 selection:bg-indigo-100">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500 bg-clip-text text-transparent flex items-center justify-center gap-2">
            <Sparkles className="w-8 h-8 text-violet-500" /> LexiAI
          </h1>
          <p className="text-slate-500 text-sm font-medium">Instant, Natural, Bi-directional Translator</p>
        </div>

        {/* Input Area */}
        <div className="relative space-y-3">
          <div className="p-1 rounded-3xl bg-white border border-slate-200/80 shadow-xl shadow-slate-200/50 focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-500/10 transition">
            <textarea
              className="w-full h-36 bg-transparent rounded-2xl p-4 text-slate-800 placeholder-slate-400 focus:outline-none transition resize-none text-base"
              placeholder="Type any casual phrase here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onBlur={handleTranslate}
              onKeyDown={handleKeyDown}
            />

            <div className="flex justify-between items-center text-xs text-slate-400 px-4 pb-3">
              <span>Press Ctrl + Enter or click outside to translate</span>
              <button
                onClick={handleTranslate}
                disabled={loading || !inputText.trim()}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 disabled:text-slate-300 text-white font-medium rounded-xl transition shadow-md shadow-indigo-200 text-sm active:scale-95"
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
        </div>

        {/* Translation Output Card */}
        {translatedText ? (
          <div className="flex items-start gap-4 p-6 bg-white border border-slate-200/80 rounded-3xl shadow-xl shadow-slate-200/40 transition-all">
            <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xl shadow-sm">
              ✨
            </div>
            <div className="flex-grow space-y-1">
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                LexiAI Interpretation
              </div>
              <div className="text-lg font-medium text-slate-800 whitespace-pre-wrap leading-relaxed">
                {translatedText}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 border border-dashed border-slate-300 rounded-3xl text-center text-slate-400 text-sm bg-slate-100/50">
            ✨ Enter text above to generate a natural translation with nuances.
          </div>
        )}
      </div>
    </main>
  );
}
