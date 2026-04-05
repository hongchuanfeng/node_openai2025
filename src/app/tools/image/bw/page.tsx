'use client';

import { useState, useRef, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Upload, Download, Contrast } from 'lucide-react';

export default function ImageBwPage() {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [method, setMethod] = useState<'grayscale' | 'threshold' | 'halftone'>('grayscale');
  const [threshold, setThreshold] = useState(128);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setImage(ev.target?.result as string);
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
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      for (let i = 0; i < data.length; i += 4) {
        const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        if (method === 'grayscale') {
          data[i] = data[i + 1] = data[i + 2] = gray;
        } else if (method === 'threshold') {
          const val = gray > threshold ? 255 : 0;
          data[i] = data[i + 1] = data[i + 2] = val;
        } else {
          const val = gray > threshold ? 255 : 0;
          data[i] = data[i + 1] = data[i + 2] = val;
          // halftone: reduce resolution effect
          const block = 4;
          const bx = Math.floor((i / 4) % canvas.width / block) * block;
          const by = Math.floor((i / 4) / canvas.width / block) * block * canvas.width;
          const idx = (bx + by) * 4;
          if (idx < data.length) {
            const avgGray = data[idx] + data[idx+1] + data[idx+2];
            const dot = avgGray / 3 > threshold ? 255 : 0;
            for (let dy = 0; dy < block && bx + dy < canvas.width; dy++) {
              for (let dx = 0; dx < block && idx + dx * 4 < data.length; dx++) {
                const pi = idx + dy * canvas.width * 4 + dx * 4;
                if (pi < data.length) {
                  data[pi] = data[pi+1] = data[pi+2] = dot;
                }
              }
            }
          }
        }
      }
      ctx.putImageData(imgData, 0, 0);
      setResult(canvas.toDataURL('image/png'));
    };
    img.src = image;
  };

  const download = () => {
    if (!result) return;
    const link = document.createElement('a');
    link.href = result;
    link.download = 'bw-image.png';
    link.click();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-gray-700 via-slate-700 to-zinc-800 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-gray-400 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Contrast className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">彩图转黑白</h1>
            </div>
            <p className="text-gray-300 text-lg">将彩色图片转换为黑白或灰度图</p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8">
                <h3 className="font-bold text-slate-900 dark:text-white mb-6">上传图片</h3>
                <label className="block w-full aspect-video rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  {image ? (
                    <img src={image} alt="Original" className="w-full h-full object-contain rounded-xl grayscale" />
                  ) : (
                    <>
                      <Upload className="w-12 h-12 text-slate-300 mb-3" />
                      <p className="text-slate-400 text-sm">点击上传彩色图片</p>
                    </>
                  )}
                  <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                </label>
                <canvas ref={canvasRef} className="hidden" />
              </div>

              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-6">转换模式</h3>
                  <div className="space-y-3">
                    {[
                      { id: 'grayscale' as const, label: '灰度图', desc: '保留完整灰度层次' },
                      { id: 'threshold' as const, label: '阈值二值化', desc: '黑/白两种颜色' },
                      { id: 'halftone' as const, label: '半色调', desc: '模拟印刷网点效果' },
                    ].map(m => (
                      <button key={m.id} onClick={() => setMethod(m.id)} className={`w-full text-left p-4 rounded-xl border transition-all ${method === m.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-200 dark:border-slate-700'}`}>
                        <div className="font-medium text-slate-900 dark:text-white">{m.label}</div>
                        <div className="text-xs text-slate-400 mt-1">{m.desc}</div>
                      </button>
                    ))}
                  </div>

                  {method !== 'grayscale' && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">阈值：{threshold}</label>
                      <input type="range" min="0" max="255" value={threshold} onChange={e => setThreshold(Number(e.target.value))} className="w-full accent-gray-600" />
                    </div>
                  )}

                  <button onClick={convert} disabled={!image} className="w-full mt-6 py-3 bg-gradient-to-r from-gray-600 to-slate-600 text-white font-bold rounded-xl hover:from-gray-700 hover:to-slate-700 transition-all disabled:opacity-50">
                    转换为黑白
                  </button>
                </div>

                {result && (
                  <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8">
                    <div className="mb-4">
                      <img src={result} alt="Result" className="w-full rounded-xl" />
                    </div>
                    <button onClick={download} className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all flex items-center justify-center gap-2">
                      <Download className="w-5 h-5" /> 下载黑白图片
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
