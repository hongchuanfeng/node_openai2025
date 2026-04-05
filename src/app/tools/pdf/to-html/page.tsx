'use client';

import { useState, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Upload, Code, Download, Loader2, AlertCircle, FileText, Check, Copy, Eye } from 'lucide-react';

interface TextItem {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  fontName: string;
  transform: number[];
}

export default function PdfToHtmlPage() {
  const [file, setFile] = useState<File | null>(null);
  const [htmlContent, setHtmlContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const generateHtml = useCallback((textItems: TextItem[][], pageDimensions: { width: number; height: number }[]) => {
    let htmlPages: string[] = [];
    
    for (let pageIdx = 0; pageIdx < textItems.length; pageIdx++) {
      const items = textItems[pageIdx];
      const dims = pageDimensions[pageIdx];
      
      // Find max values for scaling
      const maxX = Math.max(...items.map(i => i.x + i.width), dims.width);
      const maxY = Math.max(...items.map(i => i.y + i.height), dims.height);
      
      const scaleX = 100 / maxX;
      const scaleY = 100 / maxY;
      
      let pageContent = '';
      
      // Group items by approximate Y position (line grouping)
      const lines: TextItem[][] = [];
      let currentLine: TextItem[] = [];
      let lastY = -1;
      const lineThreshold = 5;
      
      const sortedItems = [...items].sort((a, b) => {
        if (Math.abs(a.y - b.y) > lineThreshold) return a.y - b.y;
        return a.x - b.x;
      });
      
      for (const item of sortedItems) {
        if (lastY === -1 || Math.abs(item.y - lastY) <= lineThreshold) {
          currentLine.push(item);
        } else {
          if (currentLine.length > 0) lines.push(currentLine);
          currentLine = [item];
        }
        lastY = item.y;
      }
      if (currentLine.length > 0) lines.push(currentLine);
      
      // Generate HTML for each line
      for (const line of lines) {
        const sortedLine = line.sort((a, b) => a.x - b.x);
        let lineContent = '';
        
        for (const item of sortedLine) {
          const left = item.x * scaleX;
          const fontSize = Math.max(8, Math.min(24, item.height * scaleY * 0.8));
          
          // Detect bold and italic from font name
          const isBold = item.fontName.toLowerCase().includes('bold');
          const isItalic = item.fontName.toLowerCase().includes('italic');
          
          let style = `position:absolute;left:${left.toFixed(2)}%;top:${(item.y * scaleY).toFixed(2)}%;font-size:${fontSize.toFixed(1)}px;`;
          if (isBold) style += 'font-weight:bold;';
          if (isItalic) style += 'font-style:italic;';
          
          // Escape HTML
          const escapedText = item.text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\n/g, '<br/>');
          
          lineContent += `<span style="${style}">${escapedText}</span>`;
        }
        pageContent += lineContent;
      }
      
      const pageHtml = `<div style="position:relative;width:${dims.width}px;height:${dims.height}px;margin:20px auto;background:white;box-shadow:0 2px 10px rgba(0,0,0,0.1);overflow:hidden;">${pageContent}</div>`;
      htmlPages.push(pageHtml);
    }
    
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${file?.name || 'PDF'} - HTML Export</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:#f5f5f5;padding:20px}
.page-container{background:white;margin:20px auto;box-shadow:0 2px 10px rgba(0,0,0,0.1)}
@media print{.page-container{box-shadow:none;margin:0}}
</style>
</head>
<body>
${htmlPages.join('\n')}
</body>
</html>`;
    
    return htmlPages.join('');
  }, [file]);

  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files?.[0];
    if (uploaded) {
      setFile(uploaded);
      setHtmlContent('');
      setError(null);
      setProgress(0);
      setCurrentPage(0);
      setPageCount(0);
    }
  }, []);

  const convertToHtml = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setProgress(0);
    setCurrentPage(0);

    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
      const arrayBuffer = await file.arrayBuffer();
      const typedArray = new Uint8Array(arrayBuffer);
      const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
      const numPages = pdf.numPages;
      setPageCount(numPages);

      const allTextItems: TextItem[][] = [];
      const pageDimensions: { width: number; height: number }[] = [];

      for (let i = 1; i <= numPages; i++) {
        setCurrentPage(i);
        setProgress(Math.round((i / numPages) * 90));

        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const viewport = page.getViewport({ scale: 1 });

        pageDimensions.push({
          width: viewport.width,
          height: viewport.height
        });

        const pageItems: TextItem[] = content.items.flatMap((item) => {
          if (!('str' in item)) return [];
          const raw = item as {
            str: string;
            transform?: number[];
            width?: number;
            height?: number;
            fontName?: string;
          };
          const transform = raw.transform || [1, 0, 0, 1, 0, 0];
          const fontSize = Math.sqrt(transform[0] * transform[0] + transform[1] * transform[1]) * 12;
          return [
            {
              text: raw.str || '',
              x: transform[4],
              y: transform[5],
              width: raw.width || 0,
              height: raw.height || fontSize,
              fontSize,
              fontName: raw.fontName || 'sans-serif',
              transform,
            },
          ];
        });

        allTextItems.push(pageItems);
      }

      setProgress(95);
      
      // Generate single-page view HTML for preview
      const previewHtml = generateHtml(allTextItems, pageDimensions);
      setHtmlContent(previewHtml);
      setProgress(100);
    } catch (err) {
      console.error('转换失败:', err);
      setError('转换失败: ' + (err instanceof Error ? err.message : '未知错误'));
    }

    setLoading(false);
  };

  const copyHtml = async () => {
    await navigator.clipboard.writeText(htmlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadHtml = () => {
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file?.name.replace('.pdf', '.html') || 'output.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const openPreview = () => {
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-slate-900 dark:to-cyan-900/20 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">PDF转HTML</h1>
            <p className="text-slate-600 dark:text-slate-400">将PDF文件转换为可编辑的HTML格式</p>
          </div>
        </section>

        <section className="py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">上传PDF文件</h3>
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl cursor-pointer bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                {loading ? (
                  <>
                    <Loader2 className="w-12 h-12 text-slate-400 mb-3 animate-spin" />
                    <span className="text-slate-500">转换中... {currentPage}/{pageCount}</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-slate-400 mb-3" />
                    <span className="text-slate-500">点击上传PDF文件</span>
                  </>
                )}
                <input type="file" accept=".pdf" onChange={handleUpload} className="hidden" disabled={loading} />
              </label>

              {file && !loading && (
                <div className="mt-6 flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-700 rounded-xl">
                  <FileText className="w-8 h-8 text-red-500" />
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
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              <button 
                onClick={convertToHtml} 
                disabled={!file || loading}
                className="mt-4 w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    转换中...
                  </>
                ) : (
                  <>
                    <Code className="w-5 h-5" />
                    转换为HTML
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

            {htmlContent && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-900 dark:text-white">HTML预览</h3>
                  <div className="flex gap-2">
                    <button 
                      onClick={openPreview}
                      className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      预览
                    </button>
                    <button 
                      onClick={copyHtml}
                      className={`flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg transition-colors ${
                        copied 
                          ? 'bg-green-100 text-green-600 dark:bg-green-900/20' 
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                      }`}
                    >
                      {copied ? <><Check className="w-4 h-4" /> 已复制</> : <><Code className="w-4 h-4" /> 复制代码</>}
                    </button>
                  </div>
                </div>
                <div className="bg-slate-100 dark:bg-slate-900 rounded-xl p-4 max-h-64 overflow-auto">
                  <pre className="text-xs text-slate-600 dark:text-slate-400 whitespace-pre-wrap break-all">
                    {htmlContent.slice(0, 2000)}{htmlContent.length > 2000 ? '...' : ''}
                  </pre>
                </div>
                <button 
                  onClick={downloadHtml}
                  className="mt-4 w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:from-cyan-600 hover:to-blue-600 transition-all"
                >
                  <Download className="w-5 h-5" />
                  下载HTML文件
                </button>
              </div>
            )}

            <div className="bg-amber-50 dark:bg-slate-800/50 rounded-xl p-6">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <Code className="w-5 h-5 text-cyan-500" />
                说明
              </h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                将PDF文本内容转换为HTML格式，保留原始排版位置。支持复制代码、下载HTML文件和在线预览。复杂排版和图片可能无法完美转换。
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}