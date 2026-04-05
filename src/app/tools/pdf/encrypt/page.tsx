'use client';

import { useState, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Upload, Lock, Download, Info, AlertCircle, CheckCircle } from 'lucide-react';
import { PDFDocument } from 'pdf-lib-plus-encrypt';

export default function PdfEncryptPage() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files?.[0];
    if (uploaded) {
      setFile(uploaded);
      setResult(null);
      setError(null);
    }
  }, []);

  const encryptPdf = async () => {
    if (!file || !password) return;

    if (password.length < 4) {
      setError('密码长度至少需要4个字符');
      return;
    }

    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, {
        ignoreEncryption: true,
      });

      pdfDoc.encrypt({
        userPassword: password,
        ownerPassword: password,
      });

      const pdfBytes = await pdfDoc.save({
        useObjectStreams: false,
      });

      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      setResult(URL.createObjectURL(blob));
    } catch (err) {
      console.error('PDF加密失败:', err);
      setError('PDF加密失败，请确保上传的是有效的PDF文件');
    } finally {
      setLoading(false);
    }
  };

  const downloadEncrypted = () => {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result;
    a.download = file?.name.replace('.pdf', '_encrypted.pdf') || 'encrypted.pdf';
    a.click();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-900 dark:to-indigo-900/20 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">PDF加密</h1>
            <p className="text-slate-600 dark:text-slate-400">为PDF设置密码保护，防止未授权访问</p>
          </div>
        </section>

        <section className="py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-indigo-500" />
                上传PDF文件
              </h3>

              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl cursor-pointer bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <Upload className="w-12 h-12 text-slate-400 mb-3" />
                <span className="text-slate-500">点击上传PDF文件</span>
                <input type="file" accept=".pdf" onChange={handleUpload} className="hidden" />
              </label>

              {file && (
                <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-700 rounded-xl flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center">
                    <Lock className="w-5 h-5 text-indigo-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-700 dark:text-slate-200">{file.name}</p>
                    <p className="text-sm text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
              )}

              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                    设置密码
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="输入密码（至少4个字符）"
                      className="w-full p-3 pr-10 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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

                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                    确认密码
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="再次输入密码"
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              {error && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <button
                onClick={encryptPdf}
                disabled={!file || !password || !confirmPassword || loading}
                className="mt-6 w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="animate-spin">⟳</span>
                    加密中...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    加密PDF
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
                  <h3 className="font-bold text-slate-900 dark:text-white">加密完成</h3>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                  您的PDF文件已成功加密。下载后将需要输入密码才能打开。
                </p>
                <button
                  onClick={downloadEncrypted}
                  className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  下载加密后的PDF
                </button>
              </div>
            )}

            <div className="mt-8 bg-amber-50 dark:bg-slate-800/50 rounded-xl p-6">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <Info className="w-5 h-5 text-amber-500" />
                使用说明
              </h4>
              <ul className="text-slate-600 dark:text-slate-400 space-y-2 text-sm list-disc list-inside">
                <li>上传需要加密的PDF文件</li>
                <li>设置至少4个字符的密码</li>
                <li>确认密码后点击加密按钮</li>
                <li>加密后的PDF需要输入密码才能打开</li>
                <li>请妥善保管您的密码，忘记密码将无法恢复</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
