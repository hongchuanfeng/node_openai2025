'use client';

import { useState, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Upload, FileText, Download, Copy, Check, Info, Loader2, AlertCircle } from 'lucide-react';

export default function PdfToTxtPage() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pageCount, setPageCount] = useState(0);

  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files?.[0];
    if (uploaded) {
      setFile(uploaded);
      setText('');
      setError(null);
      setProgress(0);
      setPageCount(0);
      setLoading(true);

      const arrayBuffer = uploaded.arrayBuffer();
      arrayBuffer.then(async (buffer) => {
        try {
          const pdfjsLib = await import('pdfjs-dist');
          pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
          const typedArray = new Uint8Array(buffer);
          const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
          const numPages = pdf.numPages;
          setPageCount(numPages);
          
          const textContent: string[] = [];
          
          for (let i = 1; i <= numPages; i++) {
            setProgress(Math.round((i / numPages) * 90));
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            
            const pageText = content.items
              .map((item) =>
                'str' in item ? String((item as { str: string }).str || '') : ''
              )
              .join(' ');
            
            if (pageText.trim()) {
              textContent.push(`--- 第 ${i} 页 ---\n${pageText}`);
            }
          }
          
          setProgress(100);
          
          if (textContent.length === 0) {
            setError('无法从PDF中提取文本内容。该PDF可能是扫描件或图片型PDF。');
            setText('');
          } else {
            setText(textContent.join('\n\n'));
          }
        } catch (err) {
          console.error('提取失败:', err);
          setError('提取失败: ' + (err instanceof Error ? err.message : '未知错误'));
          setText('');
        }
        
        setLoading(false);
      });
    }
  }, []);

  const copyText = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadTxt = () => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file?.name.replace('.pdf', '.txt') || 'output.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-slate-900 dark:to-gray-900/20 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">PDF转TXT</h1>
            <p className="text-slate-600 dark:text-slate-400">将PDF文件转换为纯文本</p>
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
                    <span className="text-slate-500">提取中... {pageCount > 0 && `(${pageCount}页)`}</span>
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
                </div>
              )}

              {loading && progress > 0 && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-slate-500 mb-1">
                    <span>提取进度</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-gray-500 to-slate-500 h-2 rounded-full transition-all duration-300"
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

            {text && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-900 dark:text-white">提取的文本 ({text.length} 字符)</h3>
                  <button onClick={copyText} className={`flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg transition-colors ${copied ? 'text-green-600 bg-green-50 dark:bg-green-900/20' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                    {copied ? <><Check className="w-4 h-4" /> 已复制</> : <><Copy className="w-4 h-4" /> 复制</>}
                  </button>
                </div>
                <textarea 
                  value={text} 
                  readOnly 
                  className="w-full h-80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 resize-none font-mono text-sm text-slate-700 dark:text-slate-300" 
                />
                <button onClick={downloadTxt} className="mt-4 w-full py-3 bg-gradient-to-r from-gray-500 to-slate-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:from-gray-600 hover:to-slate-600 transition-all">
                  <Download className="w-5 h-5" /> 下载TXT文件
                </button>
              </div>
            )}

            <div className="bg-blue-50 dark:bg-slate-800/50 rounded-xl p-6">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-500" />
                说明
              </h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                此工具从PDF中提取文本内容，不包括图片中的文字。部分PDF使用图片扫描方式，可能无法提取文本。
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}