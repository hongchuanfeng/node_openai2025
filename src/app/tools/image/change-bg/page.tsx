'use client';

import { useState, useRef, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Upload, Download, Palette, Wand2 } from 'lucide-react';

export default function ChangeBgPage() {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [targetColor, setTargetColor] = useState('#ff0000');
  const [tolerance, setTolerance] = useState(40);
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

  // 颜色差异计算
  const colorDiff = (c1: number[], c2: number[]): number => {
    return Math.sqrt(
      Math.pow(c1[0] - c2[0], 2) +
      Math.pow(c1[1] - c2[1], 2) +
      Math.pow(c1[2] - c2[2], 2)
    );
  };

  const changeBgColor = () => {
    if (!image) return;
    setLoading(true);
    
    const canvas = canvasRef.current;
    if (!canvas) {
      setLoading(false);
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setLoading(false);
      return;
    }
    
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const width = canvas.width;
      const height = canvas.height;
      
      // 采样边缘颜色作为原背景色
      const samples: number[][] = [];
      const step = 3;
      
      // 上边和下边
      for (let x = 0; x < width; x += step) {
        const topIdx = (0 * width + x) * 4;
        if (data[topIdx + 3] > 0) {
          samples.push([data[topIdx], data[topIdx + 1], data[topIdx + 2]]);
        }
        const bottomIdx = ((height - 1) * width + x) * 4;
        if (data[bottomIdx + 3] > 0) {
          samples.push([data[bottomIdx], data[bottomIdx + 1], data[bottomIdx + 2]]);
        }
      }
      // 左边和右边
      for (let y = 0; y < height; y += step) {
        const leftIdx = (y * width + 0) * 4;
        if (data[leftIdx + 3] > 0) {
          samples.push([data[leftIdx], data[leftIdx + 1], data[leftIdx + 2]]);
        }
        const rightIdx = (y * width + width - 1) * 4;
        if (data[rightIdx + 3] > 0) {
          samples.push([data[rightIdx], data[rightIdx + 1], data[rightIdx + 2]]);
        }
      }
      
      if (samples.length < 4) {
        setLoading(false);
        return;
      }
      
      // 计算原背景平均色
      const srcBg = [
        Math.round(samples.reduce((s, c) => s + c[0], 0) / samples.length),
        Math.round(samples.reduce((s, c) => s + c[1], 0) / samples.length),
        Math.round(samples.reduce((s, c) => s + c[2], 0) / samples.length),
      ];
      
      // 解析目标颜色
      const targetRgb = [
        parseInt(targetColor.slice(1, 3), 16),
        parseInt(targetColor.slice(3, 5), 16),
        parseInt(targetColor.slice(5, 7), 16),
      ];
      
      // 替换颜色
      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] > 0) { // 只处理不透明像素
          const pixelColor = [data[i], data[i + 1], data[i + 2]];
          
          // 如果颜色接近原背景色，则替换为目标色
          if (colorDiff(pixelColor, srcBg) <= tolerance) {
            data[i] = targetRgb[0];
            data[i + 1] = targetRgb[1];
            data[i + 2] = targetRgb[2];
          }
        }
      }
      
      ctx.putImageData(imageData, 0, 0);
      setResult(canvas.toDataURL('image/png'));
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
    link.download = 'changed-bg.png';
    link.click();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <canvas ref={canvasRef} className="hidden" />
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-violet-200 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Palette className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">替换背景色</h1>
            </div>
            <p className="text-violet-100 text-lg">将图片的背景色替换为你选择的颜色</p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4">上传图片</h3>
                <label className="block w-full aspect-video rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  {image ? (
                    <img src={image} alt="Preview" className="w-full h-full object-contain rounded-lg" />
                  ) : (
                    <>
                      <Upload className="w-10 h-10 text-slate-300 mb-2" />
                      <p className="text-slate-400 text-sm">点击上传图片</p>
                    </>
                  )}
                  <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                </label>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4">目标颜色</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={targetColor}
                      onChange={e => setTargetColor(e.target.value)}
                      className="w-14 h-14 rounded-lg border-2 border-slate-200 dark:border-slate-600 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={targetColor}
                      onChange={e => setTargetColor(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-mono"
                    />
                  </div>
                  <div 
                    className="w-full h-12 rounded-lg border border-slate-200 dark:border-slate-600"
                    style={{ backgroundColor: targetColor }}
                  />
                </div>
                
                <div className="mt-4">
                  <label className="flex justify-between text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                    <span>替换范围</span>
                    <span>{tolerance}</span>
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={tolerance}
                    onChange={e => setTolerance(Number(e.target.value))}
                    className="w-full accent-violet-600"
                  />
                  <p className="text-xs text-slate-400 mt-1">值越大，替换的颜色范围越广</p>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4">处理结果</h3>
                <div className="w-full aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center">
                  {result ? (
                    <img src={result} alt="Result" className="w-full h-full object-contain" />
                  ) : (
                    <p className="text-slate-400 text-sm">结果预览</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={changeBgColor}
                disabled={!image || loading}
                className="px-8 py-3 bg-gradient-to-r from-violet-500 to-purple-500 text-white font-bold rounded-xl hover:from-violet-600 hover:to-purple-600 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                <Wand2 className="w-5 h-5" />
                {loading ? '处理中...' : '替换背景色'}
              </button>
              
              {result && (
                <button
                  onClick={download}
                  className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all flex items-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  下载结果
                </button>
              )}
            </div>
            
            <div className="mt-8 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 max-w-2xl mx-auto">
              <h4 className="font-bold text-slate-900 dark:text-white mb-3">使用说明</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li>1. 上传需要替换背景色的图片</li>
                <li>2. 选择目标颜色（如红色）</li>
                <li>3. 调节替换范围控制精度</li>
                <li>4. 点击"替换背景色"按钮</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
