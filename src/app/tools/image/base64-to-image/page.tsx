'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Upload, Copy, Check, Image as ImageIcon } from 'lucide-react';

export default function Base64ToImagePage() {
  const [input, setInput] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const convert = () => {
    try {
      setError('');
      let src = input.trim();
      if (!src.startsWith('data:')) {
        src = 'data:image/png;base64,' + src;
      }
      setImage(src);
    } catch {
      setError('Base64格式不正确，请检查输入内容');
      setImage(null);
    }
  };

  const copyDataUrl = async () => {
    if (image) {
      await navigator.clipboard.writeText(image);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-teal-600 via-cyan-600 to-blue-600 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-cyan-200 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <ImageIcon className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">Base64转图片</h1>
            </div>
            <p className="text-cyan-100 text-lg">将Base64字符串还原为图片文件</p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8">
                <h3 className="font-bold text-slate-900 dark:text-white mb-6">输入 Base64</h3>
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="粘贴Base64字符串（可包含 data:image/xxx;base64, 前缀）"
                  className="w-full h-64 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none font-mono text-xs"
                />
                {error && (
                  <div className="mt-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">{error}</div>
                )}
                <button onClick={convert} className="w-full mt-4 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold rounded-xl hover:from-teal-600 hover:to-cyan-600 transition-all">
                  转换为图片
                </button>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-slate-900 dark:text-white">图片预览</h3>
                  {image && (
                    <button onClick={copyDataUrl} className={`flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg transition-colors ${copied ? 'bg-green-100 text-green-600' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>
                      {copied ? <><Check className="w-4 h-4" /> 已复制</> : <><Copy className="w-4 h-4" /> 复制DataURL</>}
                    </button>
                  )}
                </div>
                <div className="aspect-video bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden">
                  {image ? (
                    <img src={image} alt="Result" className="max-w-full max-h-full object-contain" />
                  ) : (
                    <div className="text-center text-slate-300">
                      <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">预览将显示在这里</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
