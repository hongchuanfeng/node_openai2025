'use client';

import { useState, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Upload, FileCode, Download, Loader2, AlertCircle, FileText, Check, Copy } from 'lucide-react';

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

export default function PdfToMarkdownPage() {
  const [file, setFile] = useState<File | null>(null);
  const [markdown, setMarkdown] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const convertToMarkdown = useCallback((allTextItems: { items: TextItem[]; pageNum: number }[], maxFontSize: number) => {
    const lines: string[] = [];
    const baseFontSize = Math.max(10, Math.min(16, maxFontSize));
    
    for (const pageData of allTextItems) {
      const { items, pageNum } = pageData;
      
      if (items.length === 0) continue;
      
      // Add page separator for multi-page documents
      if (pageCount > 1) {
        if (lines.length > 0) lines.push('\n---\n');
        lines.push(`## 第 ${pageNum} 页\n`);
      }
      
      // Group items by Y position (lines)
      const lineThreshold = 5;
      const sortedItems = [...items].sort((a, b) => {
        if (Math.abs(a.y - b.y) > lineThreshold) return a.y - b.y;
        return a.x - b.x;
      });
      
      const groupedLines: TextItem[][] = [];
      let currentLine: TextItem[] = [];
      let lastY = -1;
      
      for (const item of sortedItems) {
        if (lastY === -1 || Math.abs(item.y - lastY) <= lineThreshold) {
          currentLine.push(item);
        } else {
          if (currentLine.length > 0) groupedLines.push(currentLine);
          currentLine = [item];
        }
        lastY = item.y;
      }
      if (currentLine.length > 0) groupedLines.push(currentLine);
      
      // Process each line
      for (const lineItems of groupedLines) {
        const sortedLine = lineItems.sort((a, b) => a.x - b.x);
        const lineText = sortedLine.map(item => item.text).join(' ').trim();
        
        if (!lineText) continue;
        
        // Get the average font size for this line
        const avgFontSize = sortedLine.reduce((sum, item) => sum + item.fontSize, 0) / sortedLine.length;
        const isBold = sortedLine.some(item => item.fontName.toLowerCase().includes('bold'));
        
        // Determine heading level based on font size
        if (avgFontSize >= baseFontSize * 1.8) {
          // Large text - could be h1 or h2
          const cleanText = lineText.replace(/^[#\s]+/, '').trim();
          lines.push(`# ${cleanText}`);
        } else if (avgFontSize >= baseFontSize * 1.4) {
          const cleanText = lineText.replace(/^[#\s]+/, '').trim();
          lines.push(`## ${cleanText}`);
        } else if (avgFontSize >= baseFontSize * 1.2) {
          const cleanText = lineText.replace(/^[#\s]+/, '').trim();
          lines.push(`### ${cleanText}`);
        } else if (lineText.match(/^[•\-\*\+]\s/) || lineText.match(/^\d+[\.\)]\s/)) {
          // Already a list item
          lines.push(lineText);
        } else if (isBold && lineText.length < 50 && sortedLine.length === 1) {
          // Short bold text could be a subheading
          lines.push(`**${lineText}**`);
        } else {
          lines.push(lineText);
        }
      }
    }
    
    return lines.join('\n\n');
  }, [pageCount]);

  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files?.[0];
    if (uploaded) {
      setFile(uploaded);
      setMarkdown('');
      setError(null);
      setProgress(0);
      setCurrentPage(0);
      setPageCount(0);
    }
  }, []);

  const processPdf = async () => {
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

      const allTextItems: { items: TextItem[]; pageNum: number }[] = [];
      let maxFontSize = 12;

      for (let i = 1; i <= numPages; i++) {
        setCurrentPage(i);
        setProgress(Math.round((i / numPages) * 90));

        const page = await pdf.getPage(i);
        const content = await page.getTextContent();

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
          if (fontSize > maxFontSize) maxFontSize = fontSize;
          return [
            {
              text: (raw.str || '').trim(),
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

        allTextItems.push({ items: pageItems, pageNum: i });
      }

      setProgress(95);
      
      const md = convertToMarkdown(allTextItems, maxFontSize);
      setMarkdown(md || '未能提取到文本内容');
      setProgress(100);
    } catch (err) {
      console.error('转换失败:', err);
      setError('转换失败: ' + (err instanceof Error ? err.message : '未知错误'));
    }

    setLoading(false);
  };

  const copyMarkdown = async () => {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadMarkdown = () => {
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file?.name.replace('.pdf', '.md') || 'output.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-slate-50 to-zinc-50 dark:from-slate-900 dark:to-zinc-900/20 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">PDF转Markdown</h1>
            <p className="text-slate-600 dark:text-slate-400">将PDF文件转换为Markdown格式</p>
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
                      className="bg-gradient-to-r from-slate-500 to-zinc-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              <button 
                onClick={processPdf} 
                disabled={!file || loading}
                className="mt-4 w-full py-3 bg-gradient-to-r from-slate-500 to-zinc-500 text-white font-bold rounded-xl hover:from-slate-600 hover:to-zinc-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    转换中...
                  </>
                ) : (
                  <>
                    <FileCode className="w-5 h-5" />
                    转换为Markdown
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

            {markdown && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-900 dark:text-white">Markdown内容 ({markdown.length} 字符)</h3>
                  <button 
                    onClick={copyMarkdown}
                    className={`flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg transition-colors ${
                      copied 
                        ? 'text-green-600 bg-green-50 dark:bg-green-900/20' 
                        : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    {copied ? <><Check className="w-4 h-4" /> 已复制</> : <><Copy className="w-4 h-4" /> 复制</>}
                  </button>
                </div>
                <textarea 
                  value={markdown} 
                  readOnly 
                  className="w-full h-80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 resize-none font-mono text-sm text-slate-700 dark:text-slate-300" 
                />
                <button 
                  onClick={downloadMarkdown}
                  className="mt-4 w-full py-3 bg-gradient-to-r from-slate-500 to-zinc-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:from-slate-600 hover:to-zinc-600 transition-all"
                >
                  <Download className="w-5 h-5" />
                  下载Markdown文件
                </button>
              </div>
            )}

            <div className="bg-amber-50 dark:bg-slate-800/50 rounded-xl p-6">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <FileCode className="w-5 h-5 text-slate-500" />
                说明
              </h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                将PDF文本内容转换为Markdown格式，支持标题层级识别。转换后的Markdown可在各类编辑器中使用，包括标题、列表、加粗等格式。
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}