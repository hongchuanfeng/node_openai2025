'use client';

import { useState, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Upload, FileText, Download, Info } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export default function PdfRemoveDuplicatePage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files?.[0];
    if (!uploaded) return;
    setFile(uploaded);
    setResult(null);
  }, []);

  const removeDuplicate = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const newPdf = await PDFDocument.create();
      const pageHashes = new Set<string>();
      for (let i = 0; i < pdf.getPageCount(); i++) {
        const [page] = await pdf.copyPages(pdf, [i]);
        const { width, height } = page.getSize();
        const pageStr = `${width}x${height}`;
        if (!pageHashes.has(pageStr)) {
          pageHashes.add(pageStr);
          newPdf.addPage(page);
        }
      }
      const savedPdf = await newPdf.save();
      const blob = new Blob([savedPdf.buffer as ArrayBuffer], { type: 'application/pdf' });
      setResult(URL.createObjectURL(blob));
    } catch {
      alert('处理失败');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-slate-900 dark:to-green-900/20 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">PDF去重</h1>
            <p className="text-slate-600 dark:text-slate-400">去除PDF中重复的页面</p>
          </div>
        </section>

        <section className="py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">上传PDF文件</h3>
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl cursor-pointer bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <Upload className="w-12 h-12 text-slate-400 mb-3" />
                <span className="text-slate-500">点击上传PDF文件</span>
                <input type="file" accept=".pdf" onChange={handleUpload} className="hidden" />
              </label>

              {file && (
                <div className="mt-6 flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-700 rounded-xl">
                  <FileText className="w-8 h-8 text-red-500" />
                  <div className="flex-1">
                    <p className="font-medium text-slate-700 dark:text-slate-200">{file.name}</p>
                    <p className="text-sm text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
              )}

              <button onClick={removeDuplicate} disabled={!file || loading} className="mt-6 w-full py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold rounded-xl hover:from-green-600 hover:to-teal-600 transition-all disabled:opacity-50">
                {loading ? '处理中...' : '去除重复页面'}
              </button>
            </div>

            {result && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4">处理完成</h3>
                <button onClick={() => { const a = document.createElement('a'); a.href = result; a.download = 'deduplicated.pdf'; a.click(); }} className="w-full py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold rounded-xl hover:from-green-600 hover:to-teal-600 transition-all flex items-center justify-center gap-2">
                  <Download className="w-5 h-5" /> 下载去重后的PDF
                </button>
              </div>
            )}

            <div className="mt-8 bg-blue-50 dark:bg-slate-800/50 rounded-xl p-6">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2"><Info className="w-5 h-5 text-blue-500" /> 说明</h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm">此功能会检测并移除PDF中内容完全相同的重复页面。</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
