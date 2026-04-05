'use client';

import { useState, useRef, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Upload, Download, Grid } from 'lucide-react';

export default function ImageMosaicPage() {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [blockSize, setBlockSize] = useState(10);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => { setImage(ev.target?.result as string); setResult(null); };
    reader.readAsDataURL(file);
  }, []);

  const applyMosaic = () => {
    if (!image) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const img = new window.Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const w = canvas.width, h = canvas.height;
      for (let y = 0; y < h; y += blockSize) {
        for (let x = 0; x < w; x += blockSize) {
          let r = 0, g = 0, b = 0, count = 0;
          for (let dy = 0; dy < blockSize && y + dy < h; dy++) {
            for (let dx = 0; dx < blockSize && x + dx < w; dx++) {
              const idx = ((y + dy) * w + (x + dx)) * 4;
              r += data[idx]; g += data[idx + 1]; b += data[idx + 2]; count++;
            }
          }
          r = Math.round(r / count); g = Math.round(g / count); b = Math.round(b / count);
          for (let dy = 0; dy < blockSize && y + dy < h; dy++) {
            for (let dx = 0; dx < blockSize && x + dx < w; dx++) {
              const idx = ((y + dy) * w + (x + dx)) * 4;
              data[idx] = r; data[idx + 1] = g; data[idx + 2] = b;
            }
          }
        }
      }
      ctx.putImageData(imageData, 0, 0);
      setResult(canvas.toDataURL('image/png'));
    };
    img.src = image;
  };

  const download = () => {
    if (!result) return;
    const link = document.createElement('a');
    link.href = result;
    link.download = 'mosaic.png';
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
              <Grid className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">图片马赛克</h1>
            </div>
            <p className="text-purple-100 text-lg">为图片添加模糊马赛克效果，保护隐私</p>
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
                <div className="mt-4">
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">马赛克块大小：{blockSize}px</label>
                  <input type="range" min="2" max="50" value={blockSize} onChange={e => setBlockSize(Number(e.target.value))} className="w-full accent-violet-600" />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>精细</span><span>粗糙</span>
                  </div>
                </div>
                <button onClick={applyMosaic} disabled={!image} className="w-full mt-4 py-3 bg-gradient-to-r from-violet-500 to-purple-500 text-white font-bold rounded-xl hover:from-violet-600 hover:to-purple-600 transition-all disabled:opacity-50">
                  应用马赛克
                </button>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8">
                <h3 className="font-bold text-slate-900 dark:text-white mb-6">预览</h3>
                <div className="aspect-video bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden">
                  {result ? (
                    <img src={result} alt="Mosaic" className="w-full h-full object-contain" />
                  ) : (
                    <div className="text-center text-slate-300">
                      <Grid className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p className="text-sm">马赛克效果预览</p>
                    </div>
                  )}
                </div>
                {result && (
                  <button onClick={download} className="w-full mt-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all flex items-center justify-center gap-2">
                    <Download className="w-5 h-5" /> 下载图片
                  </button>
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
