'use client';

import { useState, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Upload, FileText, Download, Loader2, AlertCircle, Check } from 'lucide-react';
import mammoth from 'mammoth';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function WordToPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string[]>([]);
  const [pdfContainerRef] = useState<React.RefObject<HTMLDivElement>>({ current: null } as any);

  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files?.[0];
    if (uploaded) {
      setFile(uploaded);
      setText('');
      setError(null);
      setProgress(0);
      setPreview([]);
    }
  }, []);

  const convertToPdf = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setProgress(0);

    try {
      setProgress(10);
      const arrayBuffer = await file.arrayBuffer();
      
      setProgress(20);
      const result = await mammoth.extractRawText({ arrayBuffer });
      const content = result.value;
      
      setProgress(30);
      
      const paragraphs = content.split(/\n\n+/).filter(p => p.trim());
      setPreview(paragraphs.slice(0, 20));
      setText(content);

      setProgress(40);

      // Create a hidden div with content styled for Chinese
      const container = document.createElement('div');
      container.style.cssText = `
        position: fixed;
        left: -9999px;
        top: 0;
        width: 794px;
        padding: 40px;
        background: white;
        font-family: 'SimSun', '宋体', serif;
        font-size: 12pt;
        line-height: 1.8;
        color: #333;
        box-sizing: border-box;
      `;
      
      // Add style for printing
      const style = document.createElement('style');
      style.textContent = `
        @page { size: A4; margin: 0; }
        .doc-content { width: 100%; }
        .doc-line { margin-bottom: 8px; }
        .doc-empty { height: 20px; }
      `;
      container.appendChild(style);

      const docContent = document.createElement('div');
      docContent.className = 'doc-content';

      const lines = content.split('\n');
      for (const line of lines) {
        const p = document.createElement('p');
        p.className = line.trim() ? 'doc-line' : 'doc-empty';
        p.textContent = line || '\u00A0'; // Non-breaking space for empty lines
        docContent.appendChild(p);
      }

      container.appendChild(docContent);
      document.body.appendChild(container);

      setProgress(50);

      // Convert to canvas
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      setProgress(70);

      // Remove container
      document.body.removeChild(container);

      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      // Calculate scaling to fit page width
      const ratio = pdfWidth / (imgWidth / 2); // scale 2 means divide by 2
      const scaledHeight = (imgHeight / 2) * ratio;

      let heightLeft = scaledHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, scaledHeight);
      heightLeft -= pdfHeight;

      // Add more pages if needed
      while (heightLeft > 0) {
        position = heightLeft - scaledHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, scaledHeight);
        heightLeft -= pdfHeight;
      }

      setProgress(90);

      // Download PDF
      const pdfName = file.name.replace(/\.(docx?|DOCX?)$/, '.pdf') || 'converted.pdf';
      pdf.save(pdfName);

      setProgress(100);
    } catch (err) {
      console.error('转换失败:', err);
      setError('转换失败: ' + (err instanceof Error ? err.message : '未知错误'));
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-blue-900/20 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Word转PDF</h1>
            <p className="text-slate-600 dark:text-slate-400">将Word文档 (.doc, .docx) 转换为PDF</p>
          </div>
        </section>

        <section className="py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">上传Word文件</h3>
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl cursor-pointer bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                {loading ? (
                  <>
                    <Loader2 className="w-12 h-12 text-slate-400 mb-3 animate-spin" />
                    <span className="text-slate-500">转换中...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-slate-400 mb-3" />
                    <span className="text-slate-500">点击上传Word文件 (.doc, .docx)</span>
                  </>
                )}
                <input type="file" accept=".doc,.docx,.DOC,.DOCX" onChange={handleUpload} className="hidden" disabled={loading} />
              </label>

              {file && !loading && (
                <div className="mt-6 flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-700 rounded-xl">
                  <FileText className="w-8 h-8 text-blue-500" />
                  <div className="flex-1">
                    <p className="font-medium text-slate-700 dark:text-slate-200">{file.name}</p>
                    <p className="text-sm text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
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
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              <button 
                onClick={convertToPdf} 
                disabled={!file || loading}
                className="mt-4 w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
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

            {preview.length > 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4">内容预览</h3>
                <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 max-h-80 overflow-auto">
                  {preview.map((p, i) => (
                    <p key={i} className="text-sm text-slate-700 dark:text-slate-300 mb-2">{p}</p>
                  ))}
                  {text.split(/\n\n+/).length > 20 && (
                    <p className="text-sm text-slate-500 italic">... 还有 {text.split(/\n\n+/).length - 20} 段内容</p>
                  )}
                </div>
              </div>
            )}

            <div className="bg-amber-50 dark:bg-slate-800/50 rounded-xl p-6">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                说明
              </h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                将Word文档 (.doc, .docx) 转换为PDF格式。使用浏览器渲染支持中文字体。
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}