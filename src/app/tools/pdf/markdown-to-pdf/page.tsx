'use client';

import { useState, useCallback, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Upload, FileText, Download, Loader2, AlertCircle, Check } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function MarkdownToPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files?.[0];
    if (uploaded) {
      setFile(uploaded);
      setError(null);
      setProgress(0);
      readMarkdownFile(uploaded);
    }
  }, []);

  const readMarkdownFile = async (file: File) => {
    try {
      const text = await file.text();
      setContent(text);
    } catch (err) {
      console.error('读取Markdown失败:', err);
      setError('读取Markdown文件失败');
    }
  };

  // 简单的 Markdown 转 HTML
  const markdownToHtml = (markdown: string): string => {
    let html = markdown
      // 转义 HTML 特殊字符
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      // 代码块
      .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
      // 行内代码
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      // 图片
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />')
      // 链接
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
      // 标题
      .replace(/^###### (.+)$/gm, '<h6>$1</h6>')
      .replace(/^##### (.+)$/gm, '<h5>$1</h5>')
      .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      // 粗体和斜体
      .replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/___([^_]+)___/g, '<strong><em>$1</em></strong>')
      .replace(/__([^_]+)__/g, '<strong>$1</strong>')
      .replace(/_([^_]+)_/g, '<em>$1</em>')
      // 删除线
      .replace(/~~([^~]+)~~/g, '<del>$1</del>')
      // 引用
      .replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>')
      // 无序列表
      .replace(/^[\*\-] (.+)$/gm, '<li>$1</li>')
      // 有序列表
      .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
      // 水平线
      .replace(/^---$/gm, '<hr />')
      .replace(/^\*\*\*$/gm, '<hr />')
      // 换行和段落
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br />');

    // 包裹在段落中
    html = '<p>' + html + '</p>';
    
    // 清理空段落
    html = html.replace(/<p><\/p>/g, '');
    html = html.replace(/<p>(<h[1-6]>)/g, '$1');
    html = html.replace(/(<\/h[1-6]>)<\/p>/g, '$1');
    html = html.replace(/<p>(<pre>)/g, '$1');
    html = html.replace(/(<\/pre>)<\/p>/g, '$1');
    html = html.replace(/<p>(<blockquote>)/g, '$1');
    html = html.replace(/(<\/blockquote>)<\/p>/g, '$1');
    html = html.replace(/<p>(<li>)/g, '<ul>$1');
    html = html.replace(/(<\/li>)<\/p>/g, '$1</ul>');
    html = html.replace(/<\/li><p>/g, '</li><li>');
    html = html.replace(/<\/ul><ul>/g, '');
    html = html.replace(/<br \/>(<h[1-6]>)/g, '$1');
    html = html.replace(/<br \/>(<pre>)/g, '$1');
    html = html.replace(/<br \/>(<blockquote>)/g, '$1');
    html = html.replace(/<br \/>(<ul>)/g, '$1');

    return html;
  };

  const convertToPdf = async () => {
    if (!content) return;
    setLoading(true);
    setError(null);
    setProgress(0);

    try {
      setProgress(10);

      // 转换 Markdown 为 HTML
      const htmlContent = markdownToHtml(content);

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

      // 写入内容到 iframe
      iframeDoc.open();
      iframeDoc.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: 'SimSun', '宋体', Arial, 'Microsoft YaHei', sans-serif;
              font-size: 12pt;
              color: #333;
              padding: 40px;
              width: 736px;
              line-height: 1.8;
              background: white;
            }
            h1 { font-size: 24pt; font-weight: bold; margin: 20px 0 16px 0; color: #1a1a1a; border-bottom: 2px solid #333; padding-bottom: 8px; }
            h2 { font-size: 20pt; font-weight: bold; margin: 18px 0 14px 0; color: #1a1a1a; border-bottom: 1px solid #999; padding-bottom: 6px; }
            h3 { font-size: 16pt; font-weight: bold; margin: 16px 0 12px 0; color: #333; }
            h4 { font-size: 14pt; font-weight: bold; margin: 14px 0 10px 0; color: #444; }
            h5 { font-size: 12pt; font-weight: bold; margin: 12px 0 8px 0; color: #555; }
            h6 { font-size: 11pt; font-weight: bold; margin: 10px 0 6px 0; color: #666; }
            p { margin: 10px 0; }
            blockquote {
              margin: 12px 0;
              padding: 10px 20px;
              border-left: 4px solid #ccc;
              background: #f5f5f5;
              color: #555;
            }
            pre {
              background: #f5f5f5;
              padding: 12px;
              border-radius: 4px;
              overflow-x: auto;
              margin: 12px 0;
              font-family: 'Consolas', 'Monaco', monospace;
              font-size: 10pt;
              border: 1px solid #ddd;
            }
            code {
              font-family: 'Consolas', 'Monaco', monospace;
              background: #f0f0f0;
              padding: 2px 6px;
              border-radius: 3px;
              font-size: 10pt;
            }
            pre code {
              background: none;
              padding: 0;
            }
            a { color: #0066cc; text-decoration: none; }
            a:hover { text-decoration: underline; }
            img { max-width: 100%; height: auto; margin: 10px 0; }
            ul, ol { margin: 10px 0; padding-left: 30px; }
            li { margin: 6px 0; }
            hr { border: none; border-top: 1px solid #ddd; margin: 20px 0; }
            del { color: #999; }
            strong { font-weight: bold; }
            em { font-style: italic; }
          </style>
        </head>
        <body>${htmlContent}</body>
        </html>
      `);
      iframeDoc.close();

      setProgress(30);

      // 等待 iframe 内容加载
      await new Promise(resolve => setTimeout(resolve, 100));

      // 获取实际内容高度
      const bodyHeight = iframeDoc.body.scrollHeight;

      // 使用 html2canvas 渲染 iframe 内容
      const canvas = await html2canvas(iframeDoc.body, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: 816,
        height: Math.max(bodyHeight, 1056)
      });

      setProgress(60);

      // 移除 iframe
      document.body.removeChild(iframe);
      iframeRef.current = null;

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

      const pdfName = file!.name.replace(/\.md$/i, '.pdf') || 'converted.pdf';
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
        <section className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-900 dark:to-emerald-900/20 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Markdown转PDF</h1>
            <p className="text-slate-600 dark:text-slate-400">将Markdown文件 (.md) 转换为PDF</p>
          </div>
        </section>

        <section className="py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">上传Markdown文件</h3>
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl cursor-pointer bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                {loading ? (
                  <>
                    <Loader2 className="w-12 h-12 text-slate-400 mb-3 animate-spin" />
                    <span className="text-slate-500">转换中...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-slate-400 mb-3" />
                    <span className="text-slate-500">点击上传Markdown文件 (.md)</span>
                  </>
                )}
                <input type="file" accept=".md,.markdown,.MD,.MARKDOWN" onChange={handleUpload} className="hidden" disabled={loading} />
              </label>

              {file && !loading && (
                <div className="mt-6 flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-700 rounded-xl">
                  <FileText className="w-8 h-8 text-emerald-500" />
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
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              <button 
                onClick={convertToPdf} 
                disabled={!content || loading}
                className="mt-4 w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
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

            {content && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4">Markdown预览</h3>
                <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 max-h-96 overflow-y-auto">
                  <pre className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-mono">{content}</pre>
                </div>
              </div>
            )}

            <div className="bg-emerald-50 dark:bg-slate-800/50 rounded-xl p-6">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-500" />
                说明
              </h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                将Markdown文件 (.md) 转换为PDF格式。支持标题、列表、代码块、引用、链接等语法。
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}