'use client';

import { useState, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Upload, Scissors, Download, Info } from 'lucide-react';

export default function CsvSplitPage() {
  const [file, setFile] = useState<File | null>(null);
  const [rowsPerFile, setRowsPerFile] = useState(1000);
  const [results, setResults] = useState<string[]>([]);

  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files?.[0];
    if (uploaded) { setFile(uploaded); setResults([]); }
  }, []);

  const splitCsv = async () => {
    if (!file) return;
    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      const headers = lines[0];
      const dataLines = lines.slice(1);
      const parts: string[][] = [];
      for (let i = 0; i < dataLines.length; i += rowsPerFile) {
        parts.push(dataLines.slice(i, i + rowsPerFile));
      }
      const urls: string[] = [];
      parts.forEach((part, idx) => {
        const csv = [headers, ...part].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        urls.push(URL.createObjectURL(blob));
      });
      setResults(urls);
    } catch {
      alert('拆分失败');
    }
  };

  const downloadResult = (url: string, idx: number) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = `split_${idx + 1}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-slate-900 dark:to-orange-900/20 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">CSV拆分</h1>
            <p className="text-slate-600 dark:text-slate-400">将CSV文件拆分成多个文件</p>
          </div>
        </section>
        <section className="py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">上传CSV文件</h3>
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl cursor-pointer bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 transition-colors">
                <Upload className="w-12 h-12 text-slate-400 mb-3" />
                <span className="text-slate-500">点击上传CSV文件</span>
                <input type="file" accept=".csv" onChange={handleUpload} className="hidden" />
              </label>
              {file && <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-700 rounded-xl"><p className="font-medium text-slate-700 dark:text-slate-200">{file.name}</p></div>}
              {file && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">每个文件行数：{rowsPerFile}</label>
                  <input type="range" min="10" max="10000" step="10" value={rowsPerFile} onChange={e => setRowsPerFile(Number(e.target.value))} className="w-full accent-orange-500" />
                </div>
              )}
              <button onClick={splitCsv} disabled={!file} className="mt-6 w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50">
                拆分CSV
              </button>
            </div>
            {results.length > 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4">拆分结果（共{results.length}个文件）</h3>
                <div className="space-y-2">
                  {results.map((url, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                      <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">{idx + 1}</span>
                      <span className="flex-1 text-slate-700 dark:text-slate-300">第{idx + 1}部分</span>
                      <button onClick={() => downloadResult(url, idx)} className="px-3 py-1 bg-orange-500 text-white rounded text-sm hover:bg-orange-600 flex items-center gap-1">
                        <Download className="w-4 h-4" /> 下载
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
