'use client';

import { useState, useRef, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Upload, Download, RefreshCw } from 'lucide-react';

const formats = [
  { id: 'jpeg', label: 'JPEG', ext: 'jpg', mime: 'image/jpeg' },
  { id: 'png', label: 'PNG', ext: 'png', mime: 'image/png' },
  { id: 'webp', label: 'WebP', ext: 'webp', mime: 'image/webp' },
  { id: 'gif', label: 'GIF', ext: 'gif', mime: 'image/gif' },
];

export default function ImageFormatPage() {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [format, setFormat] = useState('jpeg');
  const [quality, setQuality] = useState(90);
  const [origSize, setOrigSize] = useState(0);
  const [newSize, setNewSize] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setOrigSize(file.size);
    const reader = new FileReader();
    reader.onload = (ev) => setImage(ev.target?.result as string);
    reader.readAsDataURL(file);
    setResult(null);
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
      const fmt = formats.find(f => f.id === format)!;
      const dataUrl = canvas.toDataURL(fmt.mime, quality / 100);
      setResult(dataUrl);
      // estimate new size from base64 length
      setNewSize(Math.round(dataUrl.length * 0.75));
    };
    img.src = image;
  };

  const download = () => {
    if (!result) return;
    const fmt = formats.find(f => f.id === format)!;
    const link = document.createElement('a');
    link.href = result;
    link.download = `converted.${fmt.ext}`;
    link.click();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-purple-200 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <RefreshCw className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">图片格式转换</h1>
            </div>
            <p className="text-violet-100 text-lg">支持 JPEG、PNG、WebP、GIF 格式互转</p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Upload */}
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8">
                <h3 className="font-bold text-slate-900 dark:text-white mb-6">上传图片</h3>
                <label className="block w-full aspect-video rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  {image ? (
                    <img src={image} alt="Preview" className="w-full h-full object-contain rounded-xl" />
                  ) : (
                    <>
                      <Upload className="w-12 h-12 text-slate-300 mb-3" />
                      <p className="text-slate-400 text-sm">点击上传图片</p>
                      <p className="text-slate-300 text-xs mt-1">支持 JPG、PNG、WebP、GIF</p>
                    </>
                  )}
                  <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                </label>
                <canvas ref={canvasRef} className="hidden" />
              </div>

              {/* Settings & Result */}
              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-6">转换设置</h3>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">目标格式</label>
                    <div className="grid grid-cols-4 gap-2">
                      {formats.map(f => (
                        <button key={f.id} onClick={() => setFormat(f.id)} className={`py-2 px-3 rounded-xl text-sm font-medium transition-colors ${format === f.id ? 'bg-violet-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  {(format === 'jpeg' || format === 'webp') && (
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">图片质量：{quality}%</label>
                      <input type="range" min="10" max="100" value={quality} onChange={e => setQuality(Number(e.target.value))} className="w-full accent-violet-600" />
                    </div>
                  )}
                  <button onClick={convert} disabled={!image} className="w-full py-3 bg-gradient-to-r from-violet-500 to-purple-500 text-white font-bold rounded-xl hover:from-violet-600 hover:to-purple-600 transition-all disabled:opacity-50">
                    转换
                  </button>
                </div>

                {result && (
                  <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-4">转换结果</h3>
                    <div className="mb-4">
                      <img src={result} alt="Result" className="w-full rounded-xl" />
                    </div>
                    <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                      <span>原大小：{(origSize / 1024).toFixed(1)} KB</span>
                      <span>新大小：{(newSize / 1024).toFixed(1)} KB</span>
                    </div>
                    <button onClick={download} className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all flex items-center justify-center gap-2">
                      <Download className="w-5 h-5" /> 下载图片
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
