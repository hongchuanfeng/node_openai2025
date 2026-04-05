'use client';

import { useState, useRef, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Upload, Copy, Check } from 'lucide-react';

export default function ImageToBase64Page() {
  const [image, setImage] = useState<string | null>(null);
  const [base64, setBase64] = useState('');
  const [format, setFormat] = useState<'png' | 'jpeg' | 'webp'>('png');
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      setImage(ev.target?.result as string);
      setBase64('');
    };
    reader.readAsDataURL(file);
  }, []);

  const convert = () => {
    if (!image) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const img = new window.Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const mime = `image/${format}`;
      const dataUrl = canvas.toDataURL(mime);
      // strip data:image/...;base64, prefix for copy
      setBase64(dataUrl);
    };
    img.src = image;
  };

  const copyBase64 = async () => {
    if (base64) {
      await navigator.clipboard.writeText(base64);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-orange-600 via-amber-500 to-yellow-500 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-yellow-200 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Upload className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">图片转Base64</h1>
            </div>
            <p className="text-orange-100 text-lg">将图片转换为Base64编码字符串</p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8">
                <h3 className="font-bold text-slate-900 dark:text-white mb-6">上传图片</h3>
                <label className="block w-full aspect-video rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  {image ? (
                    <img src={image} alt="Preview" className="w-full h-full object-contain rounded-xl" />
                  ) : (
                    <>
                      <Upload className="w-12 h-12 text-slate-300 mb-3" />
                      <p className="text-slate-400 text-sm">点击上传图片</p>
                    </>
                  )}
                  <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                </label>
                <canvas ref={canvasRef} className="hidden" />
                <div className="mt-4 flex gap-3">
                  {(['png', 'jpeg', 'webp'] as const).map(f => (
                    <button key={f} onClick={() => setFormat(f)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${format === f ? 'bg-orange-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                      {f.toUpperCase()}
                    </button>
                  ))}
                </div>
                <button onClick={convert} disabled={!image} className="w-full mt-4 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all disabled:opacity-50">
                  转换为 Base64
                </button>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-slate-900 dark:text-white">Base64 结果</h3>
                  {base64 && (
                    <button onClick={copyBase64} className={`flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg transition-colors ${copied ? 'bg-green-100 text-green-600' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>
                      {copied ? <><Check className="w-4 h-4" /> 已复制</> : <><Copy className="w-4 h-4" /> 复制</>}
                    </button>
                  )}
                </div>
                {base64 ? (
                  <textarea
                    value={base64}
                    readOnly
                    className="w-full h-64 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white resize-none font-mono text-xs"
                  />
                ) : (
                  <div className="h-64 flex items-center justify-center text-slate-300">
                    <p className="text-sm">Base64 编码将显示在这里</p>
                  </div>
                )}
                <div className="mt-3 text-xs text-slate-400">
                  长度：{base64.length.toLocaleString()} 字符
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
