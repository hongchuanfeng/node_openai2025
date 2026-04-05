'use client';

import { useState, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Upload, Droplet, Download, Info } from 'lucide-react';
import { PDFDocument, StandardFonts } from 'pdf-lib';

export default function PdfWatermarkPage() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('WATERMARK');
  const [result, setResult] = useState<string | null>(null);

  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files?.[0];
    if (uploaded) { setFile(uploaded); setResult(null); }
  }, []);

  const addWatermark = async () => {
    if (!file) return;
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      for (const page of pages) {
        const { width, height } = page.getSize();
        page.drawText(text, { x: width / 4, y: height / 2, size: 48, font, opacity: 0.3 });
      }
      const saved = await pdfDoc.save();
      const blob = new Blob([saved as BlobPart], { type: 'application/pdf' });
      setResult(URL.createObjectURL(blob));
    } catch {
      alert('添加水印失败');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-slate-900 dark:to-cyan-900/20 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">PDF添加水印</h1>
            <p className="text-slate-600 dark:text-slate-400">为PDF添加文字水印</p>
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
              {file && <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-700 rounded-xl"><p className="font-medium text-slate-700 dark:text-slate-200">{file.name}</p></div>}
              <div className="mt-6">
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">水印文字</label>
                <input type="text" value={text} onChange={e => setText(e.target.value)} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900" />
              </div>
              <button onClick={addWatermark} disabled={!file} className="mt-6 w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all disabled:opacity-50">
                添加水印
              </button>
            </div>
            {result && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4">处理完成</h3>
                <button onClick={() => { const a = document.createElement('a'); a.href = result; a.download = 'watermarked.pdf'; a.click(); }} className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-2">
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
