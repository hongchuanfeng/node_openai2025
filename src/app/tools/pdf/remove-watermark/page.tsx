'use client';

import { useState, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Upload, Eraser, Info } from 'lucide-react';

export default function PdfRemoveWatermarkPage() {
  const [file, setFile] = useState<File | null>(null);
  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files?.[0];
    if (uploaded) setFile(uploaded);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-slate-900 dark:to-red-900/20 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">PDF去水印</h1>
            <p className="text-slate-600 dark:text-slate-400">去除PDF中的水印</p>
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
              <button disabled className="mt-6 w-full py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-xl opacity-50 cursor-not-allowed">即将推出</button>
            </div>
            <div className="bg-amber-50 dark:bg-slate-800/50 rounded-xl p-6"><h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2"><Info className="w-5 h-5 text-amber-500" /> 说明</h4><p className="text-slate-600 dark:text-slate-400 text-sm">PDF去水印功能需要图像处理能力，此功能暂不可用。</p></div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
