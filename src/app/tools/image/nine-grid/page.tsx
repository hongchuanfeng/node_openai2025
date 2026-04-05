'use client';

import { useState, useRef, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Upload, Download, Grid3x3 } from 'lucide-react';

export default function NineGridPage() {
  const [image, setImage] = useState<string | null>(null);
  const [parts, setParts] = useState<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const src = ev.target?.result as string;
      setImage(src);
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d')!;
      const img = new window.Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const cols = 3, rows = 3;
        const pw = img.width / cols, ph = img.height / rows;
        const generated: string[] = [];
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const c2 = document.createElement('canvas');
            c2.width = pw;
            c2.height = ph;
            c2.getContext('2d')!.drawImage(canvas, c * pw, r * ph, pw, ph, 0, 0, pw, ph);
            generated.push(c2.toDataURL('image/png'));
          }
        }
        setParts(generated);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  }, []);

  const downloadPart = (idx: number) => {
    const data = parts[idx];
    if (!data) return;
    const link = document.createElement('a');
    link.href = data;
    link.download = `nine-grid-${idx + 1}.png`;
    link.click();
  };

  const downloadAll = () => {
    parts.forEach((_, idx) => setTimeout(() => downloadPart(idx), idx * 200));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-pink-600 via-rose-600 to-red-500 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-pink-200 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Grid3x3 className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">九宫格切图工具</h1>
            </div>
            <p className="text-pink-100 text-lg">将图片均匀切分为九宫格，适合朋友圈分享</p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
              <label className="block w-full aspect-square max-w-md mx-auto rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                {image ? (
                  <img src={image} alt="Preview" className="w-full h-full object-contain rounded-xl" />
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-slate-300 mb-3" />
                    <p className="text-slate-400 text-sm">点击上传图片</p>
                    <p className="text-slate-300 text-xs mt-1">建议上传正方形图片效果最佳</p>
                  </>
                )}
                <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
              </label>
              <canvas ref={canvasRef} className="hidden" />
            </div>

            {parts.length > 0 && (
              <>
                <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-6">九宫格预览</h3>
                  <div className="grid grid-cols-3 gap-1 rounded-2xl overflow-hidden">
                    {parts.map((src, i) => (
                      <div key={i} className="aspect-square bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                        <img src={src} alt={`Part ${i + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>

                <button onClick={downloadAll} className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all flex items-center justify-center gap-2">
                  <Download className="w-5 h-5" /> 依次下载九张图片
                </button>

                <div className="mt-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 text-sm text-slate-500 text-center">
                  提示：按顺序下载后，按1→4→7→2→5→8→3→6→9的顺序在朋友圈发送，可拼成完整九宫格图片
                </div>
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
