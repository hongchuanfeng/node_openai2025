'use client';

import { useState, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Upload, FileText, Download, Copy, Check, Loader2, AlertCircle, Info } from 'lucide-react';

export default function SubtitleToTextPage() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files?.[0];
    if (uploaded) {
      setFile(uploaded);
      setError(null);
      setLoading(true);

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          const extracted = parseSubtitle(content);
          setText(extracted);
        } catch (err) {
          setError('解析字幕文件失败: ' + (err instanceof Error ? err.message : '未知错误'));
          setText('');
        }
        setLoading(false);
      };
      reader.onerror = () => {
        setError('读取文件失败');
        setLoading(false);
      };
      reader.readAsText(uploaded);
    }
  }, []);

  const parseSubtitle = (content: string): string => {
    const lines: string[] = [];
    const rawLines = content.split(/\r?\n/);

    for (const line of rawLines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      if (/^\d+$/.test(trimmed)) continue;
      if (/^\d{2}:\d{2}:\d{2}[,.]/.test(trimmed)) continue;
      if (trimmed.startsWith('WEBVTT')) continue;
      if (trimmed.startsWith('[')) continue;
      if (/^Duration:/.test(trimmed)) continue;
      if (trimmed.startsWith('Style:')) continue;
      if (trimmed.startsWith('Dialogue:')) {
        const parts = trimmed.split(',');
        if (parts.length > 9) {
          lines.push(parts.slice(9).join(',').replace(/\\N/g, ' ').replace(/\{[^}]*\}/g, '').trim());
        }
        continue;
      }
      if (trimmed.includes('-->')) continue;
      lines.push(trimmed);
    }

    return lines.join('\n');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadText = () => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file?.name.replace(/\.(srt|vtt|ass)$/i, '.txt') || 'subtitle.txt';
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
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">字幕转文字</h1>
                <p className="text-slate-500 dark:text-slate-400">从字幕文件中提取文字内容</p>
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
                    accept=".srt,.vtt,.ass"
                    onChange={handleUpload}
                    className="hidden"
                    id="subtitle-upload"
                  />
                  <label htmlFor="subtitle-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                    <p className="text-slate-600 dark:text-slate-400">
                      点击上传字幕文件，支持 SRT、VTT、ASS 格式
                    </p>
                  </label>
                </div>
              </div>

              {file && (
                <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-lg">
                  <p className="text-sm text-slate-600 dark:text-slate-400">已选择: {file.name}</p>
                </div>
              )}

              {loading && (
                <div className="flex items-center justify-center gap-2 py-8">
                  <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
                  <span className="text-slate-500">解析中...</span>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
                  <AlertCircle className="w-5 h-5" />
                  {error}
                </div>
              )}

              {text && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      提取结果
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
                    value={text}
                    readOnly
                    rows={12}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-sm"
                  />
                </div>
              )}

              <div className="flex items-start gap-2 p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg text-sm">
                <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>自动识别 SRT、VTT、ASS 等常见字幕格式，提取纯文本内容。</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}