'use client';

import { useState, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Upload, RefreshCw, Download, Loader2, AlertCircle, Info } from 'lucide-react';

type SubtitleFormat = 'srt' | 'vtt' | 'ass' | 'lrc';

export default function SubtitleFormatPage() {
  const [file, setFile] = useState<File | null>(null);
  const [content, setContent] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [targetFormat, setTargetFormat] = useState<SubtitleFormat>('vtt');

  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files?.[0];
    if (uploaded) {
      setFile(uploaded);
      setError(null);
      setLoading(true);

      const reader = new FileReader();
      reader.onload = (event) => {
        setContent(event.target?.result as string);
        setLoading(false);
      };
      reader.onerror = () => {
        setError('读取文件失败');
        setLoading(false);
      };
      reader.readAsText(uploaded);
    }
  }, []);

  const convertSubtitle = useCallback(() => {
    if (!content.trim()) {
      setError('请先上传字幕文件');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const lines = content.split(/\r?\n/);
      let result = '';

      if (targetFormat === 'vtt') {
        result = 'WEBVTT\n\n';
        let idx = 1;
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || /^\d+$/.test(trimmed) || trimmed.startsWith('WEBVTT') || trimmed.startsWith('[')) continue;
          if (/^\d{2}:\d{2}:\d{2}[,.]/.test(trimmed)) {
            const parts = trimmed.split(/\s*-->\s*/);
            if (parts.length === 2) {
              const start = convertTimeToVtt(parts[0]);
              const end = convertTimeToVtt(parts[1]);
              result += `${idx}\n${start} --> ${end}\n`;
              idx++;
              continue;
            }
          }
          if (trimmed.includes('-->')) {
            const match = trimmed.match(/([\d:,.]+)\s*-->\s*([\d:,.]+)/);
            if (match) {
              result += `${idx}\n${convertTimeToVtt(match[1])} --> ${convertTimeToVtt(match[2])}\n`;
              idx++;
              continue;
            }
          }
          if (!trimmed.startsWith('Script Info') && !trimmed.startsWith('Style:') && !trimmed.startsWith('Format:')) {
            result += trimmed + '\n';
          }
        }
      } else if (targetFormat === 'srt') {
        let idx = 1;
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || /^\d+$/.test(trimmed)) continue;
          if (trimmed.startsWith('WEBVTT') || trimmed.startsWith('[')) continue;
          if (/^[\d:,.]+\s*-->\s*[\d:,.]+/.test(trimmed)) {
            const match = trimmed.match(/([\d:,.]+)\s*-->\s*([\d:,.]+)/);
            if (match) {
              result += `${idx}\n${convertTimeToSrt(match[1])} --> ${convertTimeToSrt(match[2])}\n`;
              idx++;
              continue;
            }
          }
          if (!trimmed.startsWith('Script Info') && !trimmed.startsWith('Style:') && !trimmed.startsWith('Format:') && !trimmed.startsWith('Dialogue:')) {
            result += trimmed + '\n';
          }
        }
      } else if (targetFormat === 'ass') {
        result = '[Script Info]\nTitle=Converted Subtitle\n\n[V4+ Styles]\nFormat: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, PrimaryColour, Angle\nStyle: Default,Arial,20,&Hffffff,&Hffffff,&H000000,&H000000,0,0,0,0,100,100,0,0\n\n[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n';
        let idx = 0;
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || /^\d+$/.test(trimmed)) continue;
          if (trimmed.startsWith('WEBVTT') || trimmed.startsWith('[') || trimmed.startsWith('Script Info') || trimmed.startsWith('Style:') || trimmed.startsWith('Format:')) continue;
          if (/^[\d:,.]+\s*-->\s*[\d:,.]+/.test(trimmed)) {
            const match = trimmed.match(/([\d:,.]+)\s*-->\s*([\d:,.]+)/);
            if (match) {
              const start = convertTimeToAss(match[1]);
              const end = convertTimeToAss(match[2]);
              result += `Dialogue: 0,${start},${end},Default,,0,0,0,,`;
              idx++;
            }
          } else if (!trimmed.startsWith('Dialogue:')) {
            result += `${trimmed}\\N`;
          }
        }
        result = result.replace(/\\N$/, '\n');
      } else {
        let idx = 1;
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || /^\d+$/.test(trimmed)) continue;
          if (trimmed.startsWith('WEBVTT') || trimmed.startsWith('[')) continue;
          if (/^[\d:,.]+\s*-->\s*[\d:,.]+/.test(trimmed)) {
            const match = trimmed.match(/([\d:,.]+)\s*-->\s*([\d:,.]+)/);
            if (match) {
              result += `[${idx}]${convertTimeToLrc(match[1])}\n`;
              result += `${trimmed.split('-->')[1]?.split(/\s/).filter((_, i) => i > 0).join(' ') || trimmed}\n`;
              idx++;
              continue;
            }
          }
          if (!trimmed.startsWith('Script Info') && !trimmed.startsWith('Style:') && !trimmed.startsWith('Format:') && !trimmed.startsWith('Dialogue:')) {
            result += trimmed + '\n';
          }
        }
      }

      setOutput(result);
    } catch (err) {
      setError('转换失败: ' + (err instanceof Error ? err.message : '未知错误'));
    }

    setLoading(false);
  }, [content, targetFormat]);

  const convertTimeToVtt = (time: string): string => {
    return time.replace(',', '.');
  };

  const convertTimeToSrt = (time: string): string => {
    return time.replace('.', ',');
  };

  const convertTimeToAss = (time: string): string => {
    return time.replace('.', '.').replace(',', '.');
  };

  const convertTimeToLrc = (time: string): string => {
    const match = time.match(/(\d{2}):(\d{2}):([\d.]+)/);
    if (match) {
      const mins = parseInt(match[2]);
      const secs = parseFloat(match[3]);
      return `${String(mins).padStart(2, '0')}:${String(Math.floor(secs)).padStart(2, '0')}.${String(Math.round((secs % 1) * 100)).padStart(2, '0')}`;
    }
    return time;
  };

  const downloadResult = () => {
    const blob = new Blob([output], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `converted.${targetFormat === 'lrc' ? 'lrc' : targetFormat}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
      <Header />

      <main className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-indigo-500 flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">字幕格式转化</h1>
                <p className="text-slate-500 dark:text-slate-400">不同字幕格式之间相互转换</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  上传字幕文件
                </label>
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center hover:border-indigo-500 transition-colors">
                  <input
                    type="file"
                    accept=".srt,.vtt,.ass,.lrc"
                    onChange={handleUpload}
                    className="hidden"
                    id="subtitle-upload"
                  />
                  <label htmlFor="subtitle-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                    <p className="text-slate-600 dark:text-slate-400">
                      支持 SRT、VTT、ASS、LRC 格式
                    </p>
                  </label>
                </div>
              </div>

              {file && (
                <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">已选择: {file.name}</span>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  目标格式
                </label>
                <select
                  value={targetFormat}
                  onChange={(e) => setTargetFormat(e.target.value as SubtitleFormat)}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="vtt">VTT（WebVTT）</option>
                  <option value="srt">SRT（SubRip）</option>
                  <option value="ass">ASS（Advanced SubStation Alpha）</option>
                  <option value="lrc">LRC（Lyrics）</option>
                </select>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
                  <AlertCircle className="w-5 h-5" />
                  {error}
                </div>
              )}

              <button
                onClick={convertSubtitle}
                disabled={loading || !content}
                className="w-full py-3 px-4 bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-400 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
                {loading ? '转换中...' : '开始转换'}
              </button>

              {output && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      转换结果
                    </label>
                    <button
                      onClick={downloadResult}
                      className="px-3 py-1.5 text-sm bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg flex items-center gap-1 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      下载
                    </button>
                  </div>
                  <textarea
                    value={output}
                    readOnly
                    rows={10}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-sm"
                  />
                </div>
              )}

              <div className="flex items-start gap-2 p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg text-sm">
                <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>支持 SRT、VTT、ASS、LRC 之间的格式互转，保持时间轴和内容的准确性。</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}