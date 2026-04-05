'use client';

import { useState, useRef, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Upload, Download, Circle, Square, Trash2 } from 'lucide-react';

export default function ImageRoundedPage() {
  const [image, setImage] = useState<string | null>(null);
  const [radius, setRadius] = useState(20);
  const [isCircle, setIsCircle] = useState(false);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [preview, setPreview] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState({ w: 0, h: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const src = ev.target?.result as string;
      setImage(src);
      const img = new Image();
      img.onload = () => {
        setOriginalSize({ w: img.width, h: img.height });
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  }, []);

  const applyRounded = useCallback(() => {
    if (!image) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      const r = isCircle ? Math.min(img.width, img.height) / 2 : radius;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.beginPath();
      if (isCircle) {
        const cx = img.width / 2;
        const cy = img.height / 2;
        const cr = Math.min(img.width, img.height) / 2;
        ctx.arc(cx, cy, cr, 0, Math.PI * 2);
      } else {
        ctx.moveTo(r, 0);
        ctx.lineTo(img.width - r, 0);
        ctx.quadraticCurveTo(img.width, 0, img.width, r);
        ctx.lineTo(img.width, img.height - r);
        ctx.quadraticCurveTo(img.width, img.height, img.width - r, img.height);
        ctx.lineTo(r, img.height);
        ctx.quadraticCurveTo(0, img.height, 0, img.height - r);
        ctx.lineTo(0, r);
        ctx.quadraticCurveTo(0, 0, r, 0);
        ctx.closePath();
      }
      ctx.clip();
      ctx.drawImage(img, 0, 0);
      ctx.restore();
      if (isCircle) {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext('2d')!;
        const cx = img.width / 2;
        const cy = img.height / 2;
        const cr = Math.min(img.width, img.height) / 2;
        tempCtx.beginPath();
        tempCtx.arc(cx, cy, cr, 0, Math.PI * 2);
        tempCtx.clip();
        tempCtx.drawImage(canvas, 0, 0);
        setPreview(tempCanvas.toDataURL('image/png'));
      } else {
        setPreview(canvas.toDataURL('image/png'));
      }
    };
    img.src = image;
  }, [image, radius, isCircle]);

  const download = () => {
    if (!preview) return;
    const link = document.createElement('a');
    link.href = preview;
    link.download = isCircle ? 'circle.png' : `rounded-${radius}px.png`;
    link.click();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-pink-500 via-rose-500 to-orange-500 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-pink-200 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Square className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">图片圆角处理</h1>
            </div>
            <p className="text-pink-100 text-lg">为图片添加圆角效果，适合头像和卡片</p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <canvas ref={canvasRef} className="hidden" />

            {/* 上传区域 */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">上传图片</h3>
              {image ? (
                <div className="relative">
                  <img src={image} alt="Uploaded" className="w-full max-h-64 object-contain rounded-xl" />
                  <button
                    onClick={() => { setImage(null); setPreview(null); setOriginalSize({ w: 0, h: 0 }); }}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <p className="text-sm text-slate-500 mt-2">原图尺寸：{originalSize.w} × {originalSize.h}</p>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-48 bg-slate-50 dark:bg-slate-900 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <Upload className="w-12 h-12 text-slate-300 mb-3" />
                  <span className="text-slate-500">点击上传图片</span>
                  <span className="text-slate-400 text-sm mt-1">支持 JPG、PNG、WebP</span>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                </label>
              )}
            </div>

            {/* 设置区域 */}
            {image && (
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
                <h3 className="font-bold text-slate-900 dark:text-white mb-6">圆角设置</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">圆角大小：{radius}px</label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={radius}
                      onChange={e => { setRadius(Number(e.target.value)); setIsCircle(false); }}
                      className="w-full accent-pink-500"
                      disabled={isCircle}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">快速选项</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setIsCircle(false); setRadius(0); }}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${!isCircle && radius === 0 ? 'bg-slate-800 text-white dark:bg-white dark:text-slate-800' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}
                      >
                        方形
                      </button>
                      <button
                        onClick={() => setIsCircle(true)}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1 ${isCircle ? 'bg-pink-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}
                      >
                        <Circle className="w-4 h-4" /> 圆形
                      </button>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">背景颜色（透明区域）</label>
                    <div className="flex gap-2 flex-wrap">
                      {['#ffffff', '#000000', '#f9fafb', '#f3f4f6', 'transparent'].map(c => (
                        <button
                          key={c}
                          onClick={() => setBgColor(c)}
                          className={`w-10 h-10 rounded-lg border-2 transition-all ${bgColor === c ? 'border-pink-500 ring-2 ring-pink-300' : 'border-slate-200 dark:border-slate-600'}`}
                          style={c !== 'transparent' ? { backgroundColor: c } : { backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)', backgroundSize: '8px 8px', backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px' }}
                        />
                      ))}
                      <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer" />
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={applyRounded}
                    className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all"
                  >
                    应用圆角
                  </button>
                  {preview && (
                    <button
                      onClick={download}
                      className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all flex items-center justify-center gap-2"
                    >
                      <Download className="w-5 h-5" /> 下载
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* 预览区域 */}
            {preview && (
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4">处理结果</h3>
                <div className="flex justify-center bg-slate-50 dark:bg-slate-900 rounded-2xl p-6">
                  <img src={preview} alt="Result" className="max-w-full max-h-96 object-contain" />
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
