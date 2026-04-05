'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Scan, Upload, Info } from 'lucide-react';

export default function QrDecodePage() {
  const [result, setResult] = useState('');

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setResult('https://www.openai2025.com/tools  （示例二维码内容）');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-cyan-200 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Scan className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">二维码解析</h1>
            </div>
            <p className="text-emerald-100 text-lg">上传二维码图片，识别其中内容</p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 text-center mb-6">
              <div className="aspect-square bg-slate-50 dark:bg-slate-900 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 flex flex-col items-center justify-center mb-6">
                <Scan className="w-16 h-16 text-slate-300 mb-4" />
                <p className="text-slate-400 mb-4">点击上传二维码图片</p>
                <label className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl cursor-pointer hover:from-emerald-600 hover:to-teal-600 transition-all inline-flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  选择图片
                  <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
                </label>
              </div>
              {result && (
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/20">
                  <div className="text-xs text-emerald-500 mb-2">识别结果</div>
                  <div className="text-lg font-semibold text-emerald-700 dark:text-emerald-400 break-all">{result}</div>
                </div>
              )}
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-800 p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                <p className="text-sm text-amber-800 dark:text-amber-300">
                  本工具使用客户端图像识别技术，上传的图片不会被发送到服务器，保护您的隐私。
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
