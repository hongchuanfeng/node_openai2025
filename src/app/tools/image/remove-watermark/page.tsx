'use client';

import { useState, useRef, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Upload, Download, Eraser, AlertCircle } from 'lucide-react';

export default function RemoveWatermarkPage() {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [threshold, setThreshold] = useState(30);
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

  const removeWatermark = () => {
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
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // 基于边缘检测的简单水印去除
      const copy = new Uint8ClampedArray(data);
      
      for (let y = 1; y < canvas.height - 1; y++) {
        for (let x = 1; x < canvas.width - 1; x++) {
          const idx = (y * canvas.width + x) * 4;
          
          const gray = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
          const neighbors = [
            (y - 1) * canvas.width + x,
            (y + 1) * canvas.width + x,
            y * canvas.width + (x - 1),
            y * canvas.width + (x + 1),
          ];
          
          const neighborGray = neighbors.reduce((sum, ni) => {
            return sum + (copy[ni * 4] + copy[ni * 4 + 1] + copy[ni * 4 + 2]) / 3;
          }, 0) / 4;
          
          if (Math.abs(gray - neighborGray) > threshold) {
            // 边缘区域，使用邻近像素填充
            const topIdx = ((y - 1) * canvas.width + x) * 4;
            const leftIdx = (y * canvas.width + (x - 1)) * 4;
            const rightIdx = (y * canvas.width + (x + 1)) * 4;
            const bottomIdx = ((y + 1) * canvas.width + x) * 4;
            
            data[idx] = Math.round((copy[topIdx] + copy[leftIdx] + copy[rightIdx] + copy[bottomIdx]) / 4);
            data[idx + 1] = Math.round((copy[topIdx + 1] + copy[leftIdx + 1] + copy[rightIdx + 1] + copy[bottomIdx + 1]) / 4);
            data[idx + 2] = Math.round((copy[topIdx + 2] + copy[leftIdx + 2] + copy[rightIdx + 2] + copy[bottomIdx + 2]) / 4);
          }
        }
      }
      
      ctx.putImageData(imageData, 0, 0);
      setResult(canvas.toDataURL('image/png'));
      setLoading(false);
    };
    
    img.onerror = () => {
      setError('图片加载失败');
      setLoading(false);
    };
    
    img.src = image;
  };

  const download = () => {
    if (!result) return;
    const link = document.createElement('a');
    link.href = result;
    link.download = 'no-watermark.png';
    link.click();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-700 via-gray-700 to-zinc-800 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-gray-400 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Eraser className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">去除水印</h1>
            </div>
            <p className="text-gray-300 text-lg">智能去除图片中的水印文字</p>
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
                      <p className="text-slate-400 text-sm">点击上传带水印图片</p>
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
                  <h3 className="font-bold text-slate-900 dark:text-white mb-6">去除设置</h3>
                  
                  <div className="mb-4">
                    <label className="flex justify-between text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                      <span>敏感度</span>
                      <span>{threshold}</span>
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="100"
                      value={threshold}
                      onChange={e => setThreshold(Number(e.target.value))}
                      className="w-full accent-gray-600"
                    />
                    <p className="text-xs text-slate-400 mt-2">数值越高，去除范围越大，但也可能影响原图</p>
                  </div>

                  <button onClick={removeWatermark} disabled={!image || loading} className="w-full py-3 bg-gradient-to-r from-gray-500 to-slate-500 text-white font-bold rounded-xl hover:from-gray-600 hover:to-slate-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                    <Eraser className="w-5 h-5" />
                    {loading ? '处理中...' : '去除水印'}
                  </button>
                </div>

                {result && (
                  <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8">
                    <div className="mb-4">
                      <img src={result} alt="Result" className="w-full rounded-xl" />
                    </div>
                    <button onClick={download} className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all flex items-center justify-center gap-2">
                      <Download className="w-5 h-5" /> 下载图片
                    </button>
                  </div>
                )}
                
                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-800 p-6">
                  <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    注意事项
                  </h4>
                  <ul className="space-y-2 text-sm text-amber-700 dark:text-amber-400">
                    <li>• 本工具基于边缘检测，效果有限</li>
                    <li>• 复杂背景的水印可能无法完全去除</li>
                    <li>• 建议水印区域颜色与背景对比明显</li>
                    <li>• 如需完美效果，建议使用专业图像软件</li>
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
