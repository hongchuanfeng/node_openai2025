'use client';

import { useState, useRef, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Upload, Download, RotateCw, RotateCcw, FlipHorizontal, FlipVertical } from 'lucide-react';

export default function ImageRotatePage() {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      setImage(ev.target?.result as string);
      setResult(null);
    };
    reader.readAsDataURL(file);
  }, []);

  const applyTransform = () => {
    if (!image) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const img = new window.Image();
    img.onload = () => {
      const rad = (rotation * Math.PI) / 180;
      const sin = Math.abs(Math.sin(rad));
      const cos = Math.abs(Math.cos(rad));
      const newWidth = img.width * cos + img.height * sin;
      const newHeight = img.width * sin + img.height * cos;
      
      canvas.width = newWidth;
      canvas.height = newHeight;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(rad);
      
      let scaleX = flipH ? -1 : 1;
      let scaleY = flipV ? -1 : 1;
      ctx.scale(scaleX, scaleY);
      
      if (flipH && flipV) {
        ctx.scale(-1, 1);
      }
      
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      setResult(canvas.toDataURL('image/png'));
    };
    img.src = image;
  };

  const rotateLeft = () => setRotation(r => (r - 90 + 360) % 360);
  const rotateRight = () => setRotation(r => (r + 90) % 360);

  const download = () => {
    if (!result) return;
    const link = document.createElement('a');
    link.href = result;
    link.download = `rotated-${rotation}deg.png`;
    link.click();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-pink-200 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <RotateCw className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">图片旋转工具</h1>
            </div>
            <p className="text-purple-100 text-lg">旋转、翻转图片，支持任意角度调整</p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8">
                <h3 className="font-bold text-slate-900 dark:text-white mb-6">上传图片</h3>
                <label className="block w-full aspect-video rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  {image ? (
                    <img src={image} alt="Preview" className="w-full h-full object-contain rounded-xl" style={{ transform: `rotate(${rotation}deg) scale(${flipH ? -1 : 1}, ${flipV ? -1 : 1})` }} />
                  ) : (
                    <>
                      <Upload className="w-12 h-12 text-slate-300 mb-3" />
                      <p className="text-slate-400 text-sm">点击上传图片</p>
                    </>
                  )}
                  <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                </label>
                <canvas ref={canvasRef} className="hidden" />
              </div>

              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-6">旋转控制</h3>
                  
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <button onClick={rotateLeft} className="p-3 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                      <RotateCcw className="w-6 h-6 text-slate-700 dark:text-slate-300" />
                    </button>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white min-w-[80px] text-center">
                      {rotation}°
                    </div>
                    <button onClick={rotateRight} className="p-3 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                      <RotateCw className="w-6 h-6 text-slate-700 dark:text-slate-300" />
                    </button>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={rotation}
                    onChange={e => setRotation(Number(e.target.value))}
                    className="w-full accent-purple-600 mb-6"
                  />

                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={() => setFlipH(!flipH)}
                      className={`p-3 rounded-xl transition-colors ${flipH ? 'bg-purple-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}
                    >
                      <FlipHorizontal className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() => setFlipV(!flipV)}
                      className={`p-3 rounded-xl transition-colors ${flipV ? 'bg-purple-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}
                    >
                      <FlipVertical className="w-6 h-6" />
                    </button>
                  </div>

                  <button onClick={applyTransform} disabled={!image} className="w-full mt-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50">
                    应用旋转
                  </button>
                </div>

                {result && (
                  <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8">
                    <div className="mb-4">
                      <img src={result} alt="Result" className="w-full rounded-xl" />
                    </div>
                    <button onClick={download} className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all flex items-center justify-center gap-2">
                      <Download className="w-5 h-5" /> 下载旋转图片
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
