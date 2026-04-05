'use client';

import { useState, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Upload, FileText, Download, Trash2, Info } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export default function PdfMergePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [merged, setMerged] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    setFiles(prev => [...prev, ...newFiles]);
    setMerged(null);
  }, []);

  const removeFile = (idx: number) => {
    setFiles(prev => prev.filter((_, i) => i !== idx));
    setMerged(null);
  };

  const reorderFiles = (from: number, to: number) => {
    setFiles(prev => {
      const newFiles = [...prev];
      const [moved] = newFiles.splice(from, 1);
      newFiles.splice(to, 0, moved);
      return newFiles;
    });
    setMerged(null);
  };

  const mergePdf = async () => {
    if (files.length < 2) return;
    setLoading(true);
    try {
      const pdfDoc = await PDFDocument.create();
      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const indices = pdf.getPageIndices();
        const pages = await pdfDoc.copyPages(pdf, indices);
        for (const page of pages) {
          pdfDoc.addPage(page);
        }
      }
      const mergedPdf = await pdfDoc.save();
      const blob = new Blob([mergedPdf.buffer as ArrayBuffer], { type: 'application/pdf' });
      setMerged(URL.createObjectURL(blob));
    } catch (err) {
      console.error('PDF合并失败:', err);
      alert('PDF合并失败');
    }
    setLoading(false);
  };

  const downloadMerged = () => {
    if (!merged) return;
    const a = document.createElement('a');
    a.href = merged;
    a.download = 'merged.pdf';
    a.click();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-slate-900 dark:to-red-900/20 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">PDF合并</h1>
            <p className="text-slate-600 dark:text-slate-400">将多个PDF文件合并为一个</p>
          </div>
        </section>

        <section className="py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">上传PDF文件</h3>
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl cursor-pointer bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <Upload className="w-12 h-12 text-slate-400 mb-3" />
                <span className="text-slate-500">点击上传PDF文件（至少2个）</span>
                <input type="file" accept=".pdf" multiple onChange={handleUpload} className="hidden" />
              </label>

              {files.length > 0 && (
                <div className="mt-6 space-y-2">
                  {files.map((file, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                      <span className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">{idx + 1}</span>
                      <FileText className="w-5 h-5 text-red-500" />
                      <span className="flex-1 text-slate-700 dark:text-slate-300 truncate">{file.name}</span>
                      <span className="text-sm text-slate-500">{(file.size / 1024).toFixed(1)} KB</span>
                      <div className="flex gap-1">
                        <button onClick={() => idx > 0 && reorderFiles(idx, idx - 1)} disabled={idx === 0} className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30">↑</button>
                        <button onClick={() => idx < files.length - 1 && reorderFiles(idx, idx + 1)} disabled={idx === files.length - 1} className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30">↓</button>
                        <button onClick={() => removeFile(idx)} className="p-1 text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button onClick={mergePdf} disabled={files.length < 2 || loading} className="mt-6 w-full py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-xl hover:from-red-600 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? '处理中...' : '合并PDF'}
              </button>
            </div>

            {merged && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4">合并完成</h3>
                <button onClick={downloadMerged} className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all flex items-center justify-center gap-2">
                  <Download className="w-5 h-5" /> 下载合并后的PDF
                </button>
              </div>
            )}

            <div className="mt-8 bg-blue-50 dark:bg-slate-800/50 rounded-xl p-6">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2"><Info className="w-5 h-5 text-blue-500" /> 使用说明</h4>
              <ul className="text-slate-600 dark:text-slate-400 space-y-1 text-sm list-disc list-inside">
                <li>上传至少2个PDF文件</li>
                <li>使用上下箭头调整文件顺序</li>
                <li>点击合并按钮生成单个PDF文件</li>
                <li>合并完成后点击下载保存</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
