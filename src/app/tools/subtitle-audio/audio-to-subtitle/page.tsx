'use client';

import { useState, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Upload, Subtitles, Download, Loader2, AlertCircle, Info } from 'lucide-react';

export default function AudioToSubtitlePage() {
  const [file, setFile] = useState<File | null>(null);
  const [subtitle, setSubtitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [format, setFormat] = useState<'srt' | 'vtt'>('srt');

  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files?.[0];
    if (uploaded) {
      setFile(uploaded);
      setSubtitle('');
      setError(null);
      setProgress(0);
    }
  }, []);

  const generateSubtitle = useCallback(async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setProgress(10);

    try {
      // Step 1: 调用 API 将音频转为文字
      const formData = new FormData();
      formData.append('file', file);

      setProgress(20);
      const response = await fetch('/api/whisper', {
        method: 'POST',
        body: formData,
      });

      setProgress(50);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '语音转文字失败');
      }

      const transcriptText = data.text;
      console.log('识别结果:', transcriptText);
      setProgress(70);

      // Step 2: 将文字生成为字幕
      // 简单处理：把整段文字作为一个字幕片段
      // 实际应用中可以使用时间戳或 LLM 进行分句
      const formatTime = (seconds: number, type: 'srt' | 'vtt'): string => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        const ms = Math.floor((seconds % 1) * 1000);

        if (type === 'srt') {
          return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')},${String(ms).padStart(3, '0')}`;
        } else {
          return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;
        }
      };

      // 简单分句：按句号、问号、感叹号分
      const sentences = transcriptText.split(/[。？！\n]/).filter((s: string) => s.trim().length > 0);
      const totalDuration = 60; // 假设总时长 60 秒，可根据实际情况调整
      const avgDuration = totalDuration / Math.max(sentences.length, 1);

      let result = '';
      let idx = 1;
      let currentTime = 0;

      for (const sentence of sentences) {
        const start = currentTime;
        const end = currentTime + avgDuration;
        const startStr = formatTime(start, format);
        const endStr = formatTime(end, format);

        if (format === 'srt') {
          result += `${idx}\n${startStr} --> ${endStr}\n${sentence.trim()}\n\n`;
        } else {
          result += `${startStr} --> ${endStr}\n${sentence.trim()}\n\n`;
        }
        idx++;
        currentTime = end;
      }

      // VTT 格式需要头部
      if (format === 'vtt') {
        result = `WEBVTT\n\n${result}`;
      }

      setSubtitle(result);
      setProgress(100);
      setLoading(false);

    } catch (err) {
      setError('生成失败: ' + (err instanceof Error ? err.message : '未知错误'));
      setLoading(false);
    }
  }, [file, format]);

  const downloadSubtitle = () => {
    const ext = format;
    const blob = new Blob([subtitle], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file?.name.replace(/\.[^.]+$/, '') || 'audio'}.${ext}`;
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
                <Subtitles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">音频转字幕</h1>
                <p className="text-slate-500 dark:text-slate-400">将音频转换为字幕文件</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  上传音频文件
                </label>
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center hover:border-indigo-500 transition-colors">
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleUpload}
                    className="hidden"
                    id="audio-to-subtitle-upload"
                  />
                  <label htmlFor="audio-to-subtitle-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                    <p className="text-slate-600 dark:text-slate-400">
                      点击上传音频文件
                    </p>
                  </label>
                </div>
              </div>

              {file && (
                <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-lg">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{file.name}</p>
                  <audio controls src={URL.createObjectURL(file)} className="w-full" />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  输出格式
                </label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as 'srt' | 'vtt')}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="srt">SRT（SubRip）</option>
                  <option value="vtt">VTT（WebVTT）</option>
                </select>
              </div>

              {loading && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-indigo-500">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-sm">正在识别并生成字幕...</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                    <div
                      className="bg-indigo-500 h-2 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
                  <AlertCircle className="w-5 h-5" />
                  {error}
                </div>
              )}

              <button
                onClick={generateSubtitle}
                disabled={loading || !file}
                className="w-full py-3 px-4 bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-400 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Subtitles className="w-5 h-5" />}
                {loading ? '生成中...' : '开始生成'}
              </button>

              {subtitle && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      生成的字幕
                    </label>
                    <button
                      onClick={downloadSubtitle}
                      className="px-3 py-1.5 text-sm bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg flex items-center gap-1 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      下载
                    </button>
                  </div>
                  <textarea
                    value={subtitle}
                    readOnly
                    rows={10}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-sm"
                  />
                </div>
              )}

              <div className="flex items-start gap-2 p-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 rounded-lg text-sm">
                <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>使用 SiliconFlow AI API 将音频转为文字并生成字幕文件。支持 SRT 和 VTT 格式。</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}