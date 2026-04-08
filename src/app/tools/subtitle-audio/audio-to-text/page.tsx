'use client';

import { useState, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Upload, Mic, Download, Copy, Check, Loader2, AlertCircle, Info } from 'lucide-react';

export default function AudioToTextPage() {
  const [file, setFile] = useState<File | null>(null);
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files?.[0];
    if (uploaded) {
      setFile(uploaded);
      setTranscript('');
      setError(null);
    }
  }, []);

  const transcribe = useCallback(async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setTranscript('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/whisper', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || '转写失败');
      }

      setTranscript(data.text || '');
    } catch (err) {
      setError(err instanceof Error ? err.message : '转写失败');
    } finally {
      setLoading(false);
    }
  }, [file]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadText = () => {
    const blob = new Blob([transcript], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file?.name.replace(/\.[^.]+$/, '') + '_transcript.txt' || 'transcript.txt';
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
                <Mic className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">音频转文字</h1>
                <p className="text-slate-500 dark:text-slate-400">将音频转换为文字（使用 Whisper AI）</p>
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
                    accept="audio/*,.mp3,.wav,.m4a,.ogg,.flac"
                    onChange={handleUpload}
                    className="hidden"
                    id="audio-to-text-upload"
                  />
                  <label htmlFor="audio-to-text-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                    <p className="text-slate-600 dark:text-slate-400">
                      点击上传音频文件（支持 MP3、WAV、M4A、OGG、FLAC）
                    </p>
                  </label>
                </div>
              </div>

              {file && (
                <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Mic className="w-4 h-4 text-indigo-500" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">{file.name}</span>
                    <span className="text-xs text-slate-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                  </div>
                  <audio controls src={URL.createObjectURL(file)} className="w-full mt-2" />
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
                  <AlertCircle className="w-5 h-5" />
                  {error}
                </div>
              )}

              <button
                onClick={transcribe}
                disabled={loading || !file}
                className="w-full py-3 px-4 bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-400 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Mic className="w-5 h-5" />}
                {loading ? '转写中...' : '开始转写'}
              </button>

              {transcript && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      转写结果（共 {transcript.length} 字）
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
                        onClick={downloadText}
                        className="px-3 py-1.5 text-sm bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg flex items-center gap-1 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        下载
                      </button>
                    </div>
                  </div>
                  <textarea
                    value={transcript}
                    readOnly
                    rows={10}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
              )}

              <div className="flex items-start gap-2 p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg text-sm">
                <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>
                  使用 SiliconFlow Whisper（faster-whisper）进行音频转文字，支持中文和英文语音识别。
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}