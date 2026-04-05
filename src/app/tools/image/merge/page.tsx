'use client';

import { useState, useRef, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Upload, Download, Columns, Plus } from 'lucide-react';

export default function ImageMergePage() {
  const [images, setImages] = useState<string[]>([]);
  const [direction, setDirection] = useState<'horizontal' | 'vertical'>('horizontal');
  const [gap, setGap] = useState(0);
  const [merged, setMerged] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFiles = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const readers: Promise<string>[] = [];
    for (let i = 0; i < files.length; i++) {
      readers.push(new Promise(res => {
        const reader = new FileReader();
        reader.onload = ev => res(ev.target?.result as string);
        reader.readAsDataURL(files[i]);
      }));
    }
    Promise.all(readers).then(imgs => {
      setImages(prev => [...prev, ...imgs].slice(0, 10));
    });
  }, []);

  const removeImage = (idx: number) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
    setMerged(null);
  };

  const doMerge = () => {
    if (images.length === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const imgs: HTMLImageElement[] = [];
    let loaded = 0;
    images.forEach(src => {
      const img = new Image();
      img.onload = () => {
        imgs.push(img);
        loaded++;
        if (loaded === images.length) drawAll();
      };
      img.src = src;
    });

    const drawAll = () => {
      if (direction === 'horizontal') {
        const totalW = imgs.reduce((sum, i) => sum + i.width, 0) + gap * (imgs.length - 1);
        const maxH = Math.max(...imgs.map(i => i.height));
        canvas.width = totalW;
        canvas.height = maxH;
        let x = 0;
        imgs.forEach(img => {
          ctx.drawImage(img, x, (maxH - img.height) / 2);
          x += img.width + gap;
        });
      } else {
        const maxW = Math.max(...imgs.map(i => i.width));
        const totalH = imgs.reduce((sum, i) => sum + i.height, 0) + gap * (imgs.length - 1);
        canvas.width = maxW;
        canvas.height = totalH;
        let y = 0;
        imgs.forEach(img => {
          ctx.drawImage(img, (maxW - img.width) / 2, y);
          y += img.height + gap;
        });
      }
      setMerged(canvas.toDataURL('image/png'));
    };
  };

  const download = () => {
    if (!merged) return;
    const link = document.createElement('a');
    link.href = merged;
    link.download = `merged-${direction === 'horizontal' ? 'h' : 'v'}.png`;
    link.click();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-600 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-cyan-200 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Columns className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">图片拼接工具</h1>
            </div>
            <p className="text-cyan-100 text-lg">将多张图片水平或垂直拼接成一张</p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
              <h3 className="font-bold text-slate-900 dark:text-white mb-6">已上传图片 ({images.length}/10)</h3>
              {images.length > 0 ? (
                <div className="flex flex-wrap gap-3 mb-6">
                  {images.map((src, i) => (
                    <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-600">
                      <img src={src} alt={`Image ${i + 1}`} className="w-full h-full object-cover" />
                      <button onClick={() => removeImage(i)} className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">×</button>
                      <span className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-1 rounded">{i + 1}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400 mb-4">还没有上传图片</div>
              )}
              <label className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-xl cursor-pointer hover:from-blue-600 hover:to-indigo-600 transition-all">
                <Plus className="w-5 h-5" /> 添加图片
                <input type="file" accept="image/*" multiple onChange={handleFiles} className="hidden" />
              </label>
            </div>

            <canvas ref={canvasRef} className="hidden" />

            {images.length > 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
                <h3 className="font-bold text-slate-900 dark:text-white mb-6">拼接设置</h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">拼接方向</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'horizontal' as const, label: '水平拼接' },
                        { id: 'vertical' as const, label: '垂直拼接' },
                      ].map(d => (
                        <button key={d.id} onClick={() => setDirection(d.id)} className={`py-2 px-3 rounded-xl text-sm font-medium transition-colors ${direction === d.id ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                          {d.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">图片间距：{gap}px</label>
                    <input type="range" min="0" max="20" value={gap} onChange={e => setGap(Number(e.target.value))} className="w-full accent-blue-600" />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={doMerge} className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all flex items-center justify-center gap-2">
                    <Columns className="w-5 h-5" /> 预览拼接
                  </button>
                  {merged && (
                    <button onClick={download} className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all flex items-center justify-center gap-2">
                      <Download className="w-5 h-5" /> 下载
                    </button>
                  )}
                </div>
              </div>
            )}

            {merged && (
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
                <h3 className="font-bold text-slate-900 dark:text-white mb-6">拼接预览</h3>
                <div className="flex justify-center rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 p-4">
                  <img src={merged} alt="Merged" className="max-w-full max-h-96 object-contain" />
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
