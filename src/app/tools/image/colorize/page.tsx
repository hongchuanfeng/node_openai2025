'use client';

import { useState, useRef, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Upload, Download, Palette, RefreshCw } from 'lucide-react';

export default function ColorizePage() {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [colorStrength, setColorStrength] = useState(100);
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

  const colorize = () => {
    if (!image) return;
    setLoading(true);
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      // 先转为灰度
      ctx.filter = 'grayscale(100%)';
      ctx.drawImage(img, 0, 0);
      ctx.filter = 'none';
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // 基于亮度的伪上色
      for (let i = 0; i < data.length; i += 4) {
        const gray = data[i];
        const brightness = gray / 255;
        
        // 根据亮度分配颜色
        let r, g, b;
        
        if (brightness > 0.7) {
          // 高亮区域 - 暖色调
          r = Math.min(255, gray + 30);
          g = Math.min(255, gray + 10);
          b = Math.max(0, gray - 20);
        } else if (brightness > 0.4) {
          // 中间区域 - 自然色
          r = gray;
          g = Math.min(255, gray + 5);
          b = Math.max(0, gray - 5);
        } else {
          // 暗区域 - 冷色调
          r = Math.max(0, gray - 10);
          g = gray;
          b = Math.min(255, gray + 20);
        }
        
        // 混合原图和着色
        const strength = colorStrength / 100;
        data[i] = Math.round(data[i] * (1 - strength) + r * strength);
        data[i + 1] = Math.round(data[i + 1] * (1 - strength) + g * strength);
        data[i + 2] = Math.round(data[i + 2] * (1 - strength) + b * strength);
      }
      
      ctx.putImageData(imageData, 0, 0);
      setResult(canvas.toDataURL('image/jpeg', 0.95));
      setLoading(false);
    };
    
    img.onerror = () => {
      setLoading(false);
    };
    
    img.src = image;
  };

  const download = () => {
    if (!result) return;
    const link = document.createElement('a');
    link.href = result;
    link.download = 'colorized.jpg';
    link.click();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-orange-600 via-red-600 to-pink-600 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-orange-200 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Palette className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">图片上色</h1>
            </div>
            <p className="text-orange-100 text-lg">黑白照片智能上色，恢复精彩记忆</p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8">
                <h3 className="font-bold text-slate-900 dark:text-white mb-6">上传黑白图片</h3>
                <label className="block w-full aspect-video rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  {image ? (
                    <img src={image} alt="Preview" className="w-full h-full object-contain rounded-xl" />
                  ) : (
                    <>
                      <Upload className="w-12 h-12 text-slate-300 mb-3" />
                      <p className="text-slate-400 text-sm">点击上传黑白图片</p>
                    </>
                  )}
                  <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                </label>
                <canvas ref={canvasRef} className="hidden" />
              </div>

              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-6">上色设置</h3>
                  
                  <div className="mb-4">
                    <label className="flex justify-between text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                      <span>着色强度</span>
                      <span>{colorStrength}%</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={colorStrength}
                      onChange={e => setColorStrength(Number(e.target.value))}
                      className="w-full accent-orange-600"
                    />
                  </div>

                  <button onClick={colorize} disabled={!image || loading} className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                    <Palette className="w-5 h-5" />
                    {loading ? '处理中...' : '开始上色'}
                  </button>
                </div>

                {result && (
                  <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8">
                    <div className="mb-4">
                      <img src={result} alt="Result" className="w-full rounded-xl" />
                    </div>
                    <button onClick={download} className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all flex items-center justify-center gap-2">
                      <Download className="w-5 h-5" /> 下载彩色图片
                    </button>
                  </div>
                )}
                
                <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <RefreshCw className="w-5 h-5 text-orange-500" />
                    关于上色
                  </h4>
                  <ul className="space-y-2 text-sm text-slate-500">
                    <li>• 本工具为黑白照片添加伪彩色</li>
                    <li>• 基于亮度和区域分析进行着色</li>
                    <li>• 效果可能与真实色彩有差异</li>
                    <li>• 专业上色建议使用AI工具</li>
                  </ul>
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
