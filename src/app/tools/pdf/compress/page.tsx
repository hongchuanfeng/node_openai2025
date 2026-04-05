'use client';

import { useState, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Upload, Minimize2, Download, Info } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export default function PdfCompressPage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState(0);

  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files?.[0];
    if (uploaded) { setFile(uploaded); setOriginalSize(uploaded.size); setResult(null); }
  }, []);

  const compressPdf = async () => {
    if (!file) return;
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      setResult(URL.createObjectURL(blob));
    } catch {
      alert('压缩失败');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-slate-900 dark:to-green-900/20 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">PDF压缩</h1>
            <p className="text-slate-600 dark:text-slate-400">压缩PDF文件大小</p>
          </div>
        </section>
        <section className="py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">上传PDF文件</h3>
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl cursor-pointer bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 transition-colors">
                <Upload className="w-12 h-12 text-slate-400 mb-3" />
                <span className="text-slate-500">点击上传PDF文件</span>
                <input type="file" accept=".pdf" onChange={handleUpload} className="hidden" />
              </label>
              {file && (
                <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-700 rounded-xl">
                  <p className="font-medium text-slate-700 dark:text-slate-200">{file.name}</p>
                  <p className="text-sm text-slate-500">原始大小：{(originalSize / 1024).toFixed(1)} KB</p>
                </div>
              )}
              <button onClick={compressPdf} disabled={!file} className="mt-6 w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50">
                压缩PDF
              </button>
            </div>
            {result && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4">压缩完成</h3>
                <button onClick={() => { const a = document.createElement('a'); a.href = result; a.download = 'compressed.pdf'; a.click(); }} className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-2">
                  <Download className="w-5 h-5" /> 下载
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
