'use client';

import { useState, useCallback, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Upload, LucidePresentation, Download, Loader2, AlertCircle, Check } from 'lucide-react';
import JSZip from 'jszip';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface SlideData {
  index: number;
  title: string;
  content: string[];
}

export default function PptToPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [slides, setSlides] = useState<SlideData[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files?.[0];
    if (uploaded) {
      setFile(uploaded);
      setSlides([]);
      setError(null);
      setProgress(0);
      readPptFile(uploaded);
    }
  }, []);

  const readPptFile = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const zip = await JSZip.loadAsync(arrayBuffer);
      
      const slideFiles = Object.keys(zip.files)
        .filter(name => name.match(/ppt\/slides\/slide\d+\.xml$/))
        .sort();
      
      const slideData: SlideData[] = [];

      for (let i = 0; i < slideFiles.length; i++) {
        const slideXml = await zip.file(slideFiles[i])?.async('string');
        if (slideXml) {
          const parser = new DOMParser();
          const doc = parser.parseFromString(slideXml, 'text/xml');
          
          // Extract all text content
          const texts = Array.from(doc.getElementsByTagName('a:t'))
            .map(t => t.textContent || '')
            .filter(t => t.trim());
          
          const title = texts[0] || `幻灯片 ${i + 1}`;
          const content = texts.slice(1);

          slideData.push({
            index: i + 1,
            title,
            content
          });
        }
      }

      setSlides(slideData);
    } catch (err) {
      console.error('读取PPT失败:', err);
      setError('读取PPT文件失败');
    }
  };

  const convertToPdf = async () => {
    if (slides.length === 0) return;
    setLoading(true);
    setError(null);
    setProgress(0);

    try {
      setProgress(10);

      // 创建 iframe
      const iframe = document.createElement('iframe');
      iframe.style.cssText = `
        position: fixed;
        left: 0;
        top: 0;
        width: 960px;
        height: 540px;
        border: none;
        visibility: hidden;
      `;
      document.body.appendChild(iframe);
      iframeRef.current = iframe;

      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) throw new Error('无法创建iframe文档');

      setProgress(15);

      // 写入样式和内容
      iframeDoc.open();
      iframeDoc.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: 'SimSun', '宋体', Arial, sans-serif;
              background: white;
              font-size: 12pt;
              color: #333;
            }
            .slide {
              width: 960px;
              height: 540px;
              padding: 40px;
              background: white;
              box-sizing: border-box;
              page-break-after: always;
              line-height: 1.6;
              position: relative;
              border-bottom: 1px solid #eee;
            }
            .slide:last-child {
              border-bottom: none;
              page-break-after: auto;
            }
            .slide-number {
              position: absolute;
              bottom: 20px;
              right: 20px;
              font-size: 10pt;
              color: #999;
            }
            .slide-title {
              font-size: 24pt;
              font-weight: bold;
              margin-bottom: 20px;
              color: #333;
            }
            .slide-content p {
              margin: 8px 0;
              font-size: 14pt;
            }
          </style>
        </head>
        <body>
      `);

      // Create slides
      for (let i = 0; i < slides.length; i++) {
        const slide = slides[i];
        iframeDoc.write(`
          <div class="slide">
            <div class="slide-number">${slide.index} / ${slides.length}</div>
            <div class="slide-title">${escapeHtml(slide.title)}</div>
            <div class="slide-content">
              ${slide.content.map(t => `<p>${escapeHtml(t)}</p>`).join('')}
            </div>
          </div>
        `);
      }

      iframeDoc.write('</body></html>');
      iframeDoc.close();

      setProgress(30);

      // 等待 iframe 内容加载
      await new Promise(resolve => setTimeout(resolve, 100));

      // 获取实际内容高度
      const bodyHeight = iframeDoc.body.scrollHeight;

      // 使用 html2canvas 渲染
      const canvas = await html2canvas(iframeDoc.body, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: 960,
        height: Math.min(bodyHeight, 540 * slides.length)
      });

      setProgress(60);

      // 移除 iframe
      document.body.removeChild(iframe);
      iframeRef.current = null;

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      const ratio = pdfWidth / imgWidth * 2;
      const scaledHeight = imgHeight * ratio / 2;

      let heightLeft = scaledHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, scaledHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - scaledHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, scaledHeight);
        heightLeft -= pdfHeight;
      }

      setProgress(90);

      const pdfName = file!.name.replace(/\.pptx?$/i, '.pdf') || 'converted.pdf';
      pdf.save(pdfName);

      setProgress(100);
    } catch (err) {
      console.error('转换失败:', err);
      setError('转换失败: ' + (err instanceof Error ? err.message : '未知错误'));
      // 确保清理 iframe
      if (iframeRef.current && document.body.contains(iframeRef.current)) {
        document.body.removeChild(iframeRef.current);
      }
    }

    setLoading(false);
  };

  // HTML转义函数
  const escapeHtml = (text: string) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-slate-900 dark:to-orange-900/20 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">PPT转PDF</h1>
            <p className="text-slate-600 dark:text-slate-400">将PowerPoint演示文稿 (.ppt, .pptx) 转换为PDF</p>
          </div>
        </section>

        <section className="py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">上传PPT文件</h3>
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl cursor-pointer bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                {loading ? (
                  <>
                    <Loader2 className="w-12 h-12 text-slate-400 mb-3 animate-spin" />
                    <span className="text-slate-500">转换中...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-slate-400 mb-3" />
                    <span className="text-slate-500">点击上传PPT文件 (.ppt, .pptx)</span>
                  </>
                )}
                <input type="file" accept=".ppt,.pptx,.PPT,.PPTX" onChange={handleUpload} className="hidden" disabled={loading} />
              </label>

              {file && !loading && (
                <div className="mt-6 flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-700 rounded-xl">
                  <LucidePresentation className="w-8 h-8 text-orange-500" />
                  <div className="flex-1">
                    <p className="font-medium text-slate-700 dark:text-slate-200">{file.name}</p>
                    <p className="text-sm text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <span className="text-xs text-blue-600 dark:text-blue-400">{slides.length} 张幻灯片</span>
                  <Check className="w-5 h-5 text-green-500" />
                </div>
              )}

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

              <button 
                onClick={convertToPdf} 
                disabled={slides.length === 0 || loading}
                className="mt-4 w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    转换中...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    转换为PDF并下载
                  </>
                )}
              </button>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 mb-6 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}

            {slides.length > 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4">幻灯片预览</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {slides.slice(0, 8).map((slide) => (
                    <div key={slide.index} className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                      <div className="text-xs text-slate-500 mb-2">第 {slide.index} 张</div>
                      <div className="font-semibold text-slate-700 dark:text-slate-200 text-sm truncate">{slide.title}</div>
                      <div className="text-xs text-slate-500 mt-1 truncate">
                        {slide.content.slice(0, 2).join(' | ') || '无内容'}
                      </div>
                    </div>
                  ))}
                  {slides.length > 8 && (
                    <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-4 border border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center">
                      <span className="text-slate-500 text-sm">+ {slides.length - 8} 张</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="bg-amber-50 dark:bg-slate-800/50 rounded-xl p-6">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <LucidePresentation className="w-5 h-5 text-orange-500" />
                说明
              </h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                将PowerPoint演示文稿 (.ppt, .pptx) 转换为PDF格式。每张幻灯片自动转为PDF一页。
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}