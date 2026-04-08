'use client';

import { useState, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Upload, Type, Download, Copy, Check, Loader2, AlertCircle, Info } from 'lucide-react';

export default function TextToSubtitlePage() {
  const [text, setText] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [duration, setDuration] = useState(5);
  const [format, setFormat] = useState<'srt' | 'vtt' | 'ass'>('srt');

  const generateSubtitle = useCallback(() => {
    if (!text.trim()) {
      setError('请输入文字内容');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const lines = text.split('\n').filter(l => l.trim());
      let result = '';

      if (format === 'srt') {
        lines.forEach((line, idx) => {
          const start = formatTime(idx * duration, 'srt');
          const end = formatTime((idx + 1) * duration, 'srt');
          result += `${idx + 1}\n${start} --> ${end}\n${line.trim()}\n\n`;
        });
      } else if (format === 'vtt') {
        result = 'WEBVTT\n\n';
        lines.forEach((line, idx) => {
          const start = formatTime(idx * duration, 'vtt');
          const end = formatTime((idx + 1) * duration, 'vtt');
          result += `${idx + 1}\n${start} --> ${end}\n${line.trim()}\n\n`;
        });
      } else {
        result = '[Script Info]\nTitle=Generated Subtitle\n\n[V4+ Styles]\nFormat: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, PrimaryColour, Angle\nStyle: Default,Arial,20,&Hffffff,&Hffffff,&H000000,&H000000,0,0,0,0,100,100,0,0\n\n[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n';
        lines.forEach((line, idx) => {
          const start = formatTime(idx * duration, 'ass');
          const end = formatTime((idx + 1) * duration, 'ass');
          result += `Dialogue: 0,${start},${end},Default,,0,0,0,,${line.trim()}\n`;
        });
      }

      setSubtitle(result);
    } catch (err) {
      setError('生成字幕失败: ' + (err instanceof Error ? err.message : '未知错误'));
    }

    setLoading(false);
  }, [text, duration, format]);

  const formatTime = (seconds: number, type: 'srt' | 'vtt' | 'ass'): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    if (type === 'srt') {
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(Math.floor(s)).padStart(2, '0')},${String(Math.floor((s % 1) * 1000)).padStart(3, '0')}`;
    } else if (type === 'vtt') {
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(Math.floor(s)).padStart(2, '0')}.${String(Math.floor((s % 1) * 1000)).padStart(3, '0')}`;
    } else {
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(Math.floor(s)).padStart(2, '0')}.${String(Math.floor((s % 1) * 100)).padStart(2, '0')}`;
    }
  };

  const downloadSubtitle = () => {
    const ext = format === 'vtt' ? 'vtt' : format === 'ass' ? 'ass' : 'srt';
    const blob = new Blob([subtitle], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subtitle.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(subtitle);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
      <Header />

      <main className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-indigo-500 flex items-center justify-center">
                <Type className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">文字转字幕</h1>
                <p className="text-slate-500 dark:text-slate-400">将文字内容转换为字幕文件</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  输入文字（每行将成为一个字幕片段）
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={8}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  placeholder="请输入字幕文字，每行一段..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    每段时长（秒）
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    输出格式
                  </label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value as 'srt' | 'vtt' | 'ass')}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="srt">SRT（SubRip）</option>
                    <option value="vtt">VTT（WebVTT）</option>
                    <option value="ass">ASS（Advanced SubStation Alpha）</option>
                  </select>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
                  <AlertCircle className="w-5 h-5" />
                  {error}
                </div>
              )}

              <button
                onClick={generateSubtitle}
                disabled={loading}
                className="w-full py-3 px-4 bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-400 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Type className="w-5 h-5" />}
                {loading ? '生成中...' : '生成字幕'}
              </button>

              {subtitle && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      预览
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={copyToClipboard}
                        className="px-3 py-1.5 text-sm bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg flex items-center gap-1 transition-colors"
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? '已复制' : '复制'}
                      </button>
                      <button
                        onClick={downloadSubtitle}
                        className="px-3 py-1.5 text-sm bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg flex items-center gap-1 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        下载
                      </button>
                    </div>
                  </div>
                  <textarea
                    value={subtitle}
                    readOnly
                    rows={10}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-sm"
                  />
                </div>
              )}

              <div className="flex items-start gap-2 p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg text-sm">
                <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>每行文字将自动分配固定时长，支持SRT、VTT、ASS三种常见字幕格式。</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}