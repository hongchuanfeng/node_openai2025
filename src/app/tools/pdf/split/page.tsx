'use client';

import { useState, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Upload, FileText, Download, Info, Package } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';

export default function PdfSplitPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<number>(1);
  const [totalPages, setTotalPages] = useState(0);
  const [splits, setSplits] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files?.[0];
    if (!uploaded) return;
    setFile(uploaded);
    setSplits([]);
    try {
      const arrayBuffer = await uploaded.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      setTotalPages(pdf.getPageCount());
      setPages(1);
    } catch {
      alert('无法读取PDF文件');
    }
  }, []);

  const splitPdf = async () => {
    if (!file || pages < 1) return;
    setLoading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const total = pdf.getPageCount();
      const results: string[] = [];
      const pagesPerSplit = Math.ceil(total / pages);
      for (let i = 0; i < pages; i++) {
        const newPdf = await PDFDocument.create();
        const start = i * pagesPerSplit;
        const end = Math.min(start + pagesPerSplit, total);
        for (let j = start; j < end; j++) {
          const [page] = await newPdf.copyPages(pdf, [j]);
          newPdf.addPage(page);
        }
        const pdfBytes = await newPdf.save();
        const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
        results.push(URL.createObjectURL(blob));
      }
      setSplits(results);
    } catch {
      alert('PDF拆分失败');
    }
    setLoading(false);
  };

  const downloadSplit = (url: string, idx: number) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = `split_${idx + 1}.pdf`;
    a.click();
  };

  const downloadAll = () => {
    splits.forEach((url, idx) => downloadSplit(url, idx));
  };

  const downloadAsZip = async () => {
    setDownloading(true);
    try {
      const zip = new JSZip();
      const baseName = file?.name.replace('.pdf', '') || 'split';

      for (let i = 0; i < splits.length; i++) {
        const response = await fetch(splits[i]);
        const blob = await response.blob();
        zip.file(`${baseName}_part${i + 1}.pdf`, blob);
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(zipBlob);
      link.download = `${baseName}_split.zip`;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch {
      alert('打包下载失败');
    }
    setDownloading(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-blue-900/20 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">PDF拆分</h1>
            <p className="text-slate-600 dark:text-slate-400">将PDF文件拆分成多个部分</p>
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
                    <p className="text-sm text-slate-500">{totalPages} 页</p>
                  </div>
                </div>
              )}

              {file && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                    拆分数：{pages} 份
                  </label>
                  <input type="range" min="1" max={totalPages} value={pages} onChange={e => setPages(Number(e.target.value))} className="w-full accent-blue-500" />
                </div>
              )}

              <button onClick={splitPdf} disabled={!file || loading} className="mt-6 w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all disabled:opacity-50">
                {loading ? '处理中...' : '拆分PDF'}
              </button>
            </div>

            {splits.length > 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-900 dark:text-white">拆分结果（共{splits.length}份）</h3>
                  <div className="flex gap-2">
                    <button onClick={downloadAll} className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 flex items-center gap-1">
                      <Download className="w-4 h-4" /> 下载全部
                    </button>
                    <button onClick={downloadAsZip} disabled={downloading} className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm hover:bg-amber-600 flex items-center gap-1 disabled:opacity-50">
                      <Package className="w-4 h-4" /> {downloading ? '打包中...' : '打包下载'}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  {splits.map((url, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                      <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">{idx + 1}</span>
                      <span className="flex-1 text-slate-700 dark:text-slate-300">第{idx + 1}部分</span>
                      <button onClick={() => downloadSplit(url, idx)} className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 flex items-center gap-1">
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
