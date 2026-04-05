'use client';

import { useState, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Upload, FileText, Download, Info, FileOutput, AlertCircle, Loader2 } from 'lucide-react';

export default function PdfToPptPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files?.[0];
    if (uploaded) {
      setFile(uploaded);
      setResult(null);
      setError(null);
      setProgress(0);
      setPageCount(0);
      setCurrentPage(0);
    }
  }, []);

  const convertToPpt = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setProgress(0);
    setCurrentPage(0);

    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
      const numPages = pdf.numPages;
      setPageCount(numPages);

      const PptxGenJS = (await import('pptxgenjs')).default;
      const pptx = new PptxGenJS();

      pptx.layout = 'LAYOUT_16x9';
      pptx.title = file.name.replace('.pdf', '');
      pptx.author = 'PDF转PPT工具';

      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        setCurrentPage(pageNum);
        setProgress(Math.round((pageNum / numPages) * 90));

        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        const pageText = textContent.items
          .map((item) => ('str' in item ? String((item as { str: string }).str || '') : ''))
          .join('\n');

        const slide = pptx.addSlide();

        if (pageText.trim()) {
          slide.addText(pageText, {
            x: 0.5,
            y: 0.5,
            w: '90%',
            h: '90%',
            fontSize: 14,
            fontFace: 'Arial',
            color: '333333',
            valign: 'top',
          });
        } else {
          slide.addText(`[第 ${pageNum} 页 - 无可提取的文本内容]`, {
            x: 0.5,
            y: 0.5,
            w: '90%',
            h: '90%',
            fontSize: 14,
            fontFace: 'Arial',
            color: '999999',
            valign: 'middle',
            align: 'center',
          });
        }

        slide.addText(`${pageNum} / ${numPages}`, {
          x: '90%',
          y: '95%',
          w: '9%',
          h: '4%',
          fontSize: 10,
          color: 'CCCCCC',
          align: 'right',
        });
      }

      setProgress(95);

      const pptxBuffer = await pptx.write({ outputType: 'arraybuffer' });
      const pptxBlob = new Blob([pptxBuffer as BlobPart], {
        type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      });

      setProgress(100);
      setResult(URL.createObjectURL(pptxBlob));
    } catch (err) {
      console.error('转换失败:', err);
      setError('转换失败: ' + (err instanceof Error ? err.message : '未知错误'));
    }

    setLoading(false);
  };

  const downloadResult = () => {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result;
    a.download = file?.name.replace('.pdf', '.pptx') || 'converted.pptx';
    a.click();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-slate-900 dark:to-orange-900/20 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">PDF转PPT</h1>
            <p className="text-slate-600 dark:text-slate-400">将PDF文件转换为PowerPoint演示文稿</p>
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

              <button 
                onClick={convertToPpt} 
                disabled={!file || loading}
                className="mt-6 w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    转换中... {currentPage > 0 && `(${currentPage}/${pageCount})`}
                  </>
                ) : (
                  <>
                    <FileOutput className="w-5 h-5" />
                    转换为PPT
                  </>
                )}
              </button>

              {loading && progress > 0 && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-slate-500 mb-1">
                    <span>转换进度</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 mb-6 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}

            {result && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4">转换完成</h3>
                <button 
                  onClick={downloadResult} 
                  className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:from-orange-600 hover:to-red-600 transition-all"
                >
                  <Download className="w-5 h-5" />
                  下载PPT文件
                </button>
              </div>
            )}

            <div className="bg-amber-50 dark:bg-slate-800/50 rounded-xl p-6">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <Info className="w-5 h-5 text-amber-500" />
                说明
              </h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                此功能通过提取PDF中的文本内容来生成PPT。扫描件或图片型PDF无法提取文本。转换结果以文本形式呈现，每页PDF内容对应PPT中的一页幻灯片。
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}