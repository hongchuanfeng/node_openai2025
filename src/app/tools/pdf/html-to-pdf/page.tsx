'use client';

import { useState, useCallback, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Upload, FileCode, Download, Loader2, AlertCircle, Check, Eye } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function HtmlToPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files?.[0];
    if (uploaded) {
      setFile(uploaded);
      setError(null);
      setProgress(0);
      setShowPreview(false);
      readHtmlFile(uploaded);
    }
  }, []);

  const readHtmlFile = async (file: File) => {
    try {
      const text = await file.text();
      setHtmlContent(text);
    } catch (err) {
      console.error('读取HTML失败:', err);
      setError('读取HTML文件失败');
    }
  };

  const convertToPdf = async () => {
    if (!htmlContent) return;
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
        width: 816px;
        height: 1056px;
        border: none;
        visibility: hidden;
      `;
      document.body.appendChild(iframe);
      iframeRef.current = iframe;

      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) throw new Error('无法创建iframe文档');

      setProgress(20);

      // 写入HTML内容到 iframe
      iframeDoc.open();
      iframeDoc.write(htmlContent);
      iframeDoc.close();

      setProgress(30);

      // 等待 iframe 内容加载
      await new Promise(resolve => setTimeout(resolve, 100));

      // 获取实际内容高度
      const bodyHeight = iframeDoc.body.scrollHeight;
      const bodyWidth = iframeDoc.body.scrollWidth;

      // 使用 html2canvas 渲染 iframe 内容
      const canvas = await html2canvas(iframeDoc.body, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: Math.max(bodyWidth, 816),
        height: Math.max(bodyHeight, 1056)
      });

      setProgress(60);

      // 移除 iframe
      document.body.removeChild(iframe);
      iframeRef.current = null;

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: bodyWidth > bodyHeight ? 'landscape' : 'portrait',
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

      const pdfName = file!.name.replace(/\.html?$/i, '.pdf') || 'converted.pdf';
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-900 dark:to-purple-900/20 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">HTML转PDF</h1>
            <p className="text-slate-600 dark:text-slate-400">将HTML网页文件 (.html, .htm) 转换为PDF</p>
          </div>
        </section>

        <section className="py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">上传HTML文件</h3>
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl cursor-pointer bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                {loading ? (
                  <>
                    <Loader2 className="w-12 h-12 text-slate-400 mb-3 animate-spin" />
                    <span className="text-slate-500">转换中...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-slate-400 mb-3" />
                    <span className="text-slate-500">点击上传HTML文件 (.html, .htm)</span>
                  </>
                )}
                <input type="file" accept=".html,.htm,.HTML,.HTM" onChange={handleUpload} className="hidden" disabled={loading} />
              </label>

              {file && !loading && (
                <div className="mt-6 flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-700 rounded-xl">
                  <FileCode className="w-8 h-8 text-purple-500" />
                  <div className="flex-1">
                    <p className="font-medium text-slate-700 dark:text-slate-200">{file.name}</p>
                    <p className="text-sm text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="flex items-center gap-1 text-purple-600 dark:text-purple-400 hover:underline"
                  >
                    <Eye className="w-4 h-4" />
                    预览
                  </button>
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
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              <button 
                onClick={convertToPdf} 
                disabled={!htmlContent || loading}
                className="mt-4 w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
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

            {htmlContent && showPreview && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4">HTML预览</h3>
                <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 max-h-96 overflow-y-auto">
                  <iframe
                    srcDoc={htmlContent}
                    className="w-full h-80 border-0"
                    title="HTML Preview"
                    sandbox="allow-same-origin"
                  />
                </div>
              </div>
            )}

            <div className="bg-purple-50 dark:bg-slate-800/50 rounded-xl p-6">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <FileCode className="w-5 h-5 text-purple-500" />
                说明
              </h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                将HTML网页文件 (.html, .htm) 转换为PDF格式。支持HTML中的文本、图片、样式等。
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}