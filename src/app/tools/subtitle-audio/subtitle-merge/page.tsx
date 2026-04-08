'use client';

import { useState, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Upload, GitMerge, Download, Loader2, AlertCircle, Info, FileText, X } from 'lucide-react';

interface SubtitleItem {
  index: number;
  time: string;
  text: string;
  file: File;
}

export default function SubtitleMergePage() {
  const [files, setFiles] = useState<{ file: File; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [merged, setMerged] = useState('');

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = Array.from(e.target.files || []);
    if (uploaded.length === 0) return;

    setLoading(true);
    setError(null);

    Promise.all(
      uploaded.map((file) => {
        return new Promise<{ file: File; content: string }>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (event) => resolve({ file, content: event.target?.result as string });
          reader.onerror = () => reject(new Error(`读取 ${file.name} 失败`));
          reader.readAsText(file);
        });
      })
    )
      .then((results) => {
        setFiles((prev) => [...prev, ...results]);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setMerged('');
  };

  const mergeSubtitles = useCallback(() => {
    if (files.length < 2) {
      setError('请至少上传两个字幕文件');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const allItems: SubtitleItem[] = [];
      let globalIndex = 1;

      for (const { content, file } of files) {
        const lines = content.split(/\r?\n/);
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;
          if (/^\d+$/.test(trimmed)) continue;
          if (/^WEBVTT/.test(trimmed)) continue;
          if (trimmed.startsWith('[') && !trimmed.includes('-->')) continue;
          if (trimmed.startsWith('Script Info') || trimmed.startsWith('Style:') || trimmed.startsWith('Format:')) continue;

          if (/^[\d:,.]+\s*-->\s*[\d:,.]+/.test(trimmed) || /^\d{2}:\d{2}:\d{2}[,.]/.test(trimmed)) {
            const match = trimmed.match(/([\d:,.]+\s*-->\s*[\d:,.]+)|(\d{2}:\d{2}:[\d,.]+)/);
            if (match) {
              globalIndex++;
              continue;
            }
          }

          allItems.push({
            index: globalIndex++,
            time: '',
            text: trimmed,
            file,
          });
        }
      }

      let result = '';
      let idx = 1;
      for (const item of allItems) {
        if (item.time) {
          result += `${idx}\n${item.time}\n${item.text}\n\n`;
          idx++;
        } else {
          result += `${item.text}\n`;
        }
      }

      setMerged(result);
    } catch (err) {
      setError('合并失败: ' + (err instanceof Error ? err.message : '未知错误'));
    }

    setLoading(false);
  }, [files]);

  const downloadMerged = () => {
    const blob = new Blob([merged], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'merged_subtitles.srt';
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
                <GitMerge className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">字幕合并</h1>
                <p className="text-slate-500 dark:text-slate-400">将多个字幕文件合并为一个</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  上传字幕文件（可多选）
                </label>
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center hover:border-indigo-500 transition-colors">
                  <input
                    type="file"
                    accept=".srt,.vtt,.ass,.lrc"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="subtitle-merge-upload"
                  />
                  <label htmlFor="subtitle-merge-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                    <p className="text-slate-600 dark:text-slate-400">
                      点击或拖拽上传多个字幕文件
                    </p>
                  </label>
                </div>
              </div>

              {files.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    已选择的文件 ({files.length})
                  </label>
                  {files.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-500" />
                        <span className="text-sm text-slate-700 dark:text-slate-300">{item.file.name}</span>
                      </div>
                      <button
                        onClick={() => removeFile(idx)}
                        className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded"
                      >
                        <X className="w-4 h-4 text-slate-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
                  <AlertCircle className="w-5 h-5" />
                  {error}
                </div>
              )}

              <button
                onClick={mergeSubtitles}
                disabled={loading || files.length < 2}
                className="w-full py-3 px-4 bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-400 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <GitMerge className="w-5 h-5" />}
                {loading ? '合并中...' : '合并字幕'}
              </button>

              {merged && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      合并结果
                    </label>
                    <button
                      onClick={downloadMerged}
                      className="px-3 py-1.5 text-sm bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg flex items-center gap-1 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      下载
                    </button>
                  </div>
                  <textarea
                    value={merged}
                    readOnly
                    rows={10}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-sm"
                  />
                </div>
              )}

              <div className="flex items-start gap-2 p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg text-sm">
                <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>支持合并 SRT、VTT、ASS、LRC 格式的字幕文件，按上传顺序拼接所有内容。</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}