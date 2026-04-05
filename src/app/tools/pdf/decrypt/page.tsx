'use client';

import { useState, useCallback, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Upload, Unlock, Download, Info, AlertCircle, CheckCircle } from 'lucide-react';

// coherentpdf 浏览器版本的类型定义
declare global {
  interface Window {
    coherentpdf?: {
      fromMemory: (data: Uint8Array, password: string) => unknown;
      decryptPdf: (pdf: unknown) => void;
      toMemory: (pdf: unknown, linearize: boolean, compress: boolean) => Uint8Array;
      deletePdf: (pdf: unknown) => void;
    };
  }
}

export default function PdfDecryptPage() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [cpdfReady, setCpdfReady] = useState(false);

  useEffect(() => {
    // 检查是否已加载
    if (window.coherentpdf) {
      setCpdfReady(true);
      return;
    }

    // 动态加载脚本
    const script = document.createElement('script');
    script.src = '/js/coherentpdf.browser.min.js';
    script.onload = () => {
      if (window.coherentpdf) {
        setCpdfReady(true);
      }
    };
    script.onerror = () => {
      setError('PDF解密库加载失败，请刷新页面重试');
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files?.[0];
    if (uploaded) {
      setFile(uploaded);
      setResult(null);
      setError(null);
    }
  }, []);

  const decryptPdf = async () => {
    if (!file || !password || !window.coherentpdf) return;

    setLoading(true);
    setError(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfBytes = new Uint8Array(arrayBuffer);

      // 使用 coherentpdf 从内存加载 PDF (密码作为第二个参数)
      const pdf = window.coherentpdf.fromMemory(pdfBytes, password);

      // 解密 PDF
      window.coherentpdf.decryptPdf(pdf);

      // 将解密后的 PDF 转为 Uint8Array
      const decryptedBytes = window.coherentpdf.toMemory(pdf, false, false);

      // 释放内存
      window.coherentpdf.deletePdf(pdf);

      const blob = new Blob([decryptedBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      setResult(URL.createObjectURL(blob));
    } catch (err: unknown) {
      console.error('PDF解密失败:', err);
      const errorMessage = err instanceof Error ? err.message : '未知错误';
      if (errorMessage.includes('password') || errorMessage.includes('Password') ||
          errorMessage.includes('invalid') || errorMessage.includes('Invalid')) {
        setError('密码错误，请检查您输入的密码是否正确');
      } else {
        setError('解密失败，该文件可能不是有效的加密PDF或密码不正确');
      }
    } finally {
      setLoading(false);
    }
  };

  const downloadDecrypted = () => {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result;
    a.download = file?.name.replace('.pdf', '_decrypted.pdf') || 'decrypted.pdf';
    a.click();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-teal-50 to-green-50 dark:from-slate-900 dark:to-teal-900/20 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">PDF解密</h1>
            <p className="text-slate-600 dark:text-slate-400">移除PDF密码保护</p>
          </div>
        </section>

        <section className="py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Unlock className="w-5 h-5 text-teal-500" />
                上传加密的PDF文件
              </h3>

              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl cursor-pointer bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <Upload className="w-12 h-12 text-slate-400 mb-3" />
                <span className="text-slate-500">点击上传加密的PDF文件</span>
                <input type="file" accept=".pdf" onChange={handleUpload} className="hidden" />
              </label>

              {file && (
                <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-700 rounded-xl flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900 rounded-lg flex items-center justify-center">
                    <Unlock className="w-5 h-5 text-teal-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-700 dark:text-slate-200">{file.name}</p>
                    <p className="text-sm text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
              )}

              <div className="mt-6">
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                  输入密码
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="输入PDF密码"
                    className="w-full p-3 pr-10 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? '隐藏' : '显示'}
                  </button>
                </div>
              </div>

              {error && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <button
                onClick={decryptPdf}
                disabled={!file || !password || loading || !cpdfReady}
                className="mt-6 w-full py-3 bg-gradient-to-r from-teal-500 to-green-500 text-white font-bold rounded-xl hover:from-teal-600 hover:to-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="animate-spin">⟳</span>
                    解密中...
                  </>
                ) : !cpdfReady ? (
                  <>
                    <span className="animate-spin">⟳</span>
                    加载中...
                  </>
                ) : (
                  <>
                    <Unlock className="w-5 h-5" />
                    解密PDF
                  </>
                )}
              </button>
            </div>

            {result && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white">解密完成</h3>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                  您的PDF文件已成功移除密码保护。下载后将可以直接打开。
                </p>
                <button
                  onClick={downloadDecrypted}
                  className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  下载解密后的PDF
                </button>
              </div>
            )}

            <div className="mt-8 bg-blue-50 dark:bg-slate-800/50 rounded-xl p-6">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-500" />
                使用说明
              </h4>
              <ul className="text-slate-600 dark:text-slate-400 space-y-2 text-sm list-disc list-inside">
                <li>上传需要解密的加密PDF文件</li>
                <li>输入正确的PDF密码</li>
                <li>点击解密按钮移除密码保护</li>
                <li>解密后的PDF可以直接打开，无需密码</li>
                <li>请确保您有权解密该PDF文件</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
