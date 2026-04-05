'use client';

import { useState, useRef, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Volume2, Play, Pause, Square, Settings } from 'lucide-react';

export default function TextToSpeechPage() {
  const [text, setText] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const loadVoices = () => {
      const available = speechSynthesis.getVoices();
      setVoices(available);
      if (available.length > 0 && !selectedVoice) {
        const zh = available.find(v => v.lang.includes('zh'));
        setSelectedVoice(zh?.name || available[0].name);
      }
    };
    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const speak = () => {
    if (!text.trim()) return;
    speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    const voice = voices.find(v => v.name === selectedVoice);
    if (voice) utter.voice = voice;
    utter.rate = rate;
    utter.pitch = pitch;
    utter.volume = volume;
    utter.onend = () => setIsPlaying(false);
    utter.onerror = () => setIsPlaying(false);
    utteranceRef.current = utter;
    setIsPlaying(true);
    speechSynthesis.speak(utter);
  };

  const pause = () => {
    if (isPlaying) {
      speechSynthesis.pause();
      setIsPlaying(false);
    } else {
      speechSynthesis.resume();
      setIsPlaying(true);
    }
  };

  const stop = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-fuchsia-200 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-2">
              <Volume2 className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">文字转语音</h1>
            </div>
            <p className="text-violet-100 text-lg">将文字转换为自然语音朗读</p>
          </div>
        </section>

        <section className="py-10">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">输入文字</label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="输入要转换为语音的文字..."
                  className="w-full h-40 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                />
              </div>

              {/* Voice settings */}
              <div className="mb-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-900">
                <div className="flex items-center gap-2 mb-4">
                  <Settings className="w-4 h-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">语音设置</span>
                </div>

                <div className="mb-4">
                  <label className="block text-xs text-slate-500 mb-1">选择声音</label>
                  <select
                    value={selectedVoice}
                    onChange={(e) => setSelectedVoice(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                  >
                    {voices.map(v => (
                      <option key={v.name} value={v.name}>{v.name} ({v.lang})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">语速: {rate.toFixed(1)}x</label>
                    <input type="range" min="0.5" max="2" step="0.1" value={rate} onChange={(e) => setRate(parseFloat(e.target.value))} className="w-full accent-violet-500" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">音调: {pitch.toFixed(1)}</label>
                    <input type="range" min="0.5" max="2" step="0.1" value={pitch} onChange={(e) => setPitch(parseFloat(e.target.value))} className="w-full accent-violet-500" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">音量: {Math.round(volume * 100)}%</label>
                    <input type="range" min="0" max="1" step="0.1" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} className="w-full accent-violet-500" />
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4">
                <button onClick={speak} disabled={!text.trim()} className="px-8 py-4 bg-gradient-to-r from-violet-500 to-purple-500 text-white font-semibold rounded-xl hover:from-violet-600 hover:to-purple-600 transition-all disabled:opacity-50 flex items-center gap-2 text-lg">
                  <Play className="w-5 h-5" />
                  开始朗读
                </button>
                <button onClick={pause} className="p-4 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
                <button onClick={stop} className="p-4 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                  <Square className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-violet-50 dark:bg-violet-900/20 rounded-2xl border border-violet-100 dark:border-violet-900/20 p-4">
              <p className="text-sm text-violet-800 dark:text-violet-300">
                💡 提示：此功能使用浏览器内置的 Web Speech API，不同浏览器支持的声音和语言可能有所不同。支持中文、英文、日文、韩文等多种语言的语音合成。
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
