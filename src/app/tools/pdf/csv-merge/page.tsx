'use client';

import { useState, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Upload, GitMerge, Download, Trash2, Info } from 'lucide-react';

export default function CsvMergePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<string | null>(null);

  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    setFiles(prev => [...prev, ...newFiles]);
    setResult(null);
  }, []);

  const removeFile = (idx: number) => {
    setFiles(prev => prev.filter((_, i) => i !== idx));
    setResult(null);
  };

  const mergeCsv = async () => {
    if (files.length < 2) return;
    try {
      const allRows: string[][] = [];
      for (const file of files) {
        const text = await file.text();
        const lines = text.split('\n').filter(line => line.trim());
        const rows = lines.map(line => {
          const result: string[] = [];
          let current = '';
          let inQuotes = false;
          for (const char of line) {
            if (char === '"') { inQuotes = !inQuotes; }
            else if (char === ',' && !inQuotes) { result.push(current.trim()); current = ''; }
            else { current += char; }
          }
          result.push(current.trim());
          return result;
        });
        if (allRows.length === 0) { allRows.push(...rows); }
        else { allRows.push(...rows.slice(1)); }
      }
      const csv = allRows.map(row => row.map(cell => cell.includes(',') ? `"${cell}"` : cell).join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      setResult(URL.createObjectURL(blob));
    } catch {
      alert('合并失败');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-slate-900 dark:to-cyan-900/20 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">CSV合并</h1>
            <p className="text-slate-600 dark:text-slate-400">将多个CSV文件合并为一个</p>
          </div>
        </section>
        <section className="py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">上传CSV文件</h3>
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl cursor-pointer bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 transition-colors">
                <Upload className="w-12 h-12 text-slate-400 mb-3" />
                <span className="text-slate-500">点击上传CSV文件（至少2个）</span>
                <input type="file" accept=".csv" multiple onChange={handleUpload} className="hidden" />
              </label>
              {files.length > 0 && (
                <div className="mt-6 space-y-2">
                  {files.map((file, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                      <span className="w-8 h-8 bg-cyan-500 text-white rounded-full flex items-center justify-center text-sm font-bold">{idx + 1}</span>
                      <span className="flex-1 text-slate-700 dark:text-slate-300 truncate">{file.name}</span>
                      <button onClick={() => removeFile(idx)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>
              )}
              <button onClick={mergeCsv} disabled={files.length < 2} className="mt-6 w-full py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-bold rounded-xl hover:from-cyan-600 hover:to-teal-600 transition-all disabled:opacity-50">
                合并CSV
              </button>
            </div>
            {result && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4">合并完成</h3>
                <button onClick={() => { const a = document.createElement('a'); a.href = result; a.download = 'merged.csv'; a.click(); }} className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-2">
                  <Download className="w-5 h-5" /> 下载合并后的CSV
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
