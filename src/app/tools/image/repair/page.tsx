'use client';

import { useState, useRef, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Upload, Download, Sparkles, AlertCircle } from 'lucide-react';

export default function PhotoRepairPage() {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      setImage(ev.target?.result as string);
      setResult(null);
      setError('');
    };
    reader.readAsDataURL(file);
  }, []);

  const repair = () => {
    if (!image) return;
    setLoading(true);
    setError('');
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
      ctx.drawImage(img, 0, 0);
      ctx.filter = 'none';
      
      setResult(canvas.toDataURL('image/jpeg', 0.95));
      setLoading(false);
    };
    
    img.onerror = () => {
      setError('图片加载失败');
      setLoading(false);
    };
    
    img.src = image;
  };

  const enhance = () => {
    setBrightness(110);
    setContrast(115);
    setSaturation(105);
    setTimeout(() => repair(), 0);
  };

  const download = () => {
    if (!result) return;
    const link = document.createElement('a');
    link.href = result;
    link.download = 'repaired.jpg';
    link.click();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-amber-600 via-orange-600 to-red-600 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-amber-200 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Sparkles className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">照片修复</h1>
            </div>
            <p className="text-amber-100 text-lg">调整亮度、对比度和饱和度，修复老照片</p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8">
                <h3 className="font-bold text-slate-900 dark:text-white mb-6">上传照片</h3>
                <label className="block w-full aspect-video rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  {image ? (
                    <img src={image} alt="Preview" className="w-full h-full object-contain rounded-xl" />
                  ) : (
                    <>
                      <Upload className="w-12 h-12 text-slate-300 mb-3" />
                      <p className="text-slate-400 text-sm">点击上传照片</p>
                    </>
                  )}
                  <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                </label>
                <canvas ref={canvasRef} className="hidden" />
                
                {error && (
                  <div className="mt-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 flex items-center gap-2 text-sm">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-6">调整参数</h3>
                  
                  <div className="space-y-5">
                    <div>
                      <label className="flex justify-between text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                        <span>亮度</span>
                        <span>{brightness}%</span>
                      </label>
                      <input type="range" min="50" max="150" value={brightness} onChange={e => setBrightness(Number(e.target.value))} className="w-full accent-amber-600" />
                    </div>
                    
                    <div>
                      <label className="flex justify-between text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                        <span>对比度</span>
                        <span>{contrast}%</span>
                      </label>
                      <input type="range" min="50" max="150" value={contrast} onChange={e => setContrast(Number(e.target.value))} className="w-full accent-orange-600" />
                    </div>
                    
                    <div>
                      <label className="flex justify-between text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                        <span>饱和度</span>
                        <span>{saturation}%</span>
                      </label>
                      <input type="range" min="0" max="200" value={saturation} onChange={e => setSaturation(Number(e.target.value))} className="w-full accent-red-600" />
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button onClick={repair} disabled={!image || loading} className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all disabled:opacity-50">
                      应用调整
                    </button>
                    <button onClick={enhance} disabled={!image || loading} className="px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      自动增强
                    </button>
                  </div>
                </div>

                {result && (
                  <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8">
                    <div className="mb-4">
                      <img src={result} alt="Result" className="w-full rounded-xl" />
                    </div>
                    <button onClick={download} className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all flex items-center justify-center gap-2">
                      <Download className="w-5 h-5" /> 下载修复照片
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
