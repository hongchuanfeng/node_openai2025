'use client';

import { useState, useRef, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Upload, Download, ZoomIn, Info } from 'lucide-react';

export default function ImageEnlargePage() {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [scale, setScale] = useState(2);
  const [origSize, setOrigSize] = useState({ width: 0, height: 0 });
  const [newSize, setNewSize] = useState({ width: 0, height: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const img = new window.Image();
      img.onload = () => {
        setOrigSize({ width: img.width, height: img.height });
        setNewSize({ width: img.width * scale, height: img.height * scale });
      };
      img.src = ev.target?.result as string;
      setImage(ev.target?.result as string);
      setResult(null);
    };
    reader.readAsDataURL(file);
  }, [scale]);

  const enlarge = () => {
    if (!image) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const img = new window.Image();
    img.onload = () => {
      const newWidth = Math.round(img.width * scale);
      const newHeight = Math.round(img.height * scale);
      canvas.width = newWidth;
      canvas.height = newHeight;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, newWidth, newHeight);
      setNewSize({ width: newWidth, height: newHeight });
      setResult(canvas.toDataURL('image/png'));
    };
    img.src = image;
  };

  const download = () => {
    if (!result) return;
    const link = document.createElement('a');
    link.href = result;
    link.download = `enlarged-${scale}x.png`;
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
              <ZoomIn className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">图片放大工具</h1>
            </div>
            <p className="text-cyan-100 text-lg">无损放大图片尺寸，支持多种放大倍数</p>
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
                
                {image && (
                  <div className="mt-4 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 flex items-center gap-2 text-sm">
                    <Info className="w-4 h-4 shrink-0" />
                    <span>原图尺寸：{origSize.width} × {origSize.height} 像素</span>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-6">放大设置</h3>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">放大倍数：{scale}x</label>
                    <input
                      type="range"
                      min="1"
                      max="4"
                      step="0.5"
                      value={scale}
                      onChange={e => {
                        const newScale = Number(e.target.value);
                        setScale(newScale);
                        if (image) {
                          setNewSize({ width: origSize.width * newScale, height: origSize.height * newScale });
                        }
                      }}
                      className="w-full accent-cyan-600"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1">
                      <span>1x</span><span>2x</span><span>3x</span><span>4x</span>
                    </div>
                  </div>

                  {image && (
                    <div className="mb-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-700 text-sm">
                      <div className="text-slate-500 dark:text-slate-400 mb-1">放大后尺寸：</div>
                      <div className="font-medium text-slate-900 dark:text-white">
                        {newSize.width} × {newSize.height} 像素
                      </div>
                    </div>
                  )}

                  <button onClick={enlarge} disabled={!image} className="w-full mt-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all disabled:opacity-50">
                    放大图片
                  </button>
                </div>

                {result && (
                  <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8">
                    <div className="mb-4">
                      <img src={result} alt="Result" className="w-full rounded-xl" />
                    </div>
                    <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 text-sm text-center">
                      放大完成！尺寸：{newSize.width} × {newSize.height} 像素
                    </div>
                    <button onClick={download} className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all flex items-center justify-center gap-2">
                      <Download className="w-5 h-5" /> 下载放大图片
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
