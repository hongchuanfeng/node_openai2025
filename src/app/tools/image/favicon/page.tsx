'use client';

import { useState, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Upload, Download, Star, Info } from 'lucide-react';

export default function FaviconPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [text, setText] = useState('AI');
  const [bgColor, setBgColor] = useState('#4f46e5');
  const [fgColor, setFgColor] = useState('#ffffff');
  const [shape, setShape] = useState<'circle' | 'square' | 'rounded'>('rounded');

  const generate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const size = 128;
    canvas.width = size;
    canvas.height = size;

    ctx.fillStyle = bgColor;
    if (shape === 'circle') {
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (shape === 'rounded') {
      roundRect(ctx, 0, 0, size, size, 20);
      ctx.fill();
    } else {
      ctx.fillRect(0, 0, size, size);
    }

    ctx.fillStyle = fgColor;
    ctx.font = `bold ${Math.round(size * 0.5)}px system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text.slice(0, 2), size / 2, size / 2);

    const dataUrl = canvas.toDataURL('image/png');
    setPreview(dataUrl);
  };

  const roundRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  };

  const download = (size: number) => {
    const canvas = canvasRef.current;
    if (!canvas || !preview) return;
    const link = document.createElement('a');
    link.download = `favicon-${size}x${size}.png`;
    const tmpCanvas = document.createElement('canvas');
    tmpCanvas.width = size;
    tmpCanvas.height = size;
    const ctx = tmpCanvas.getContext('2d')!;
    const img = new window.Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, size, size);
      link.href = tmpCanvas.toDataURL('image/png');
      link.click();
    };
    img.src = preview;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-yellow-200 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Star className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">Favicon图标生成</h1>
            </div>
            <p className="text-orange-100 text-lg">在线生成网站Favicon图标，支持多种尺寸导出</p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Settings */}
              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-6">图标设置</h3>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">图标文字（最多2字）</label>
                    <input
                      type="text"
                      value={text}
                      onChange={e => setText(e.target.value.slice(0, 2))}
                      maxLength={2}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="如：AI"
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">背景颜色</label>
                    <div className="flex gap-3">
                      {['#4f46e5', '#ef4444', '#22c55e', '#f59e0b', '#ec4899', '#6366f1', '#14b8a6', '#1a1a1a'].map(c => (
                        <button key={c} onClick={() => setBgColor(c)} className={`w-10 h-10 rounded-xl border-2 transition-all ${bgColor === c ? 'border-blue-500 ring-2 ring-blue-300' : 'border-slate-200 dark:border-slate-600'}`} style={{ backgroundColor: c }} />
                      ))}
                      <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-600 cursor-pointer" />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">文字颜色</label>
                    <div className="flex gap-3">
                      {['#ffffff', '#1a1a1a', '#fef08a', '#fca5a5'].map(c => (
                        <button key={c} onClick={() => setFgColor(c)} className={`w-10 h-10 rounded-xl border-2 transition-all ${fgColor === c ? 'border-blue-500 ring-2 ring-blue-300' : 'border-slate-200 dark:border-slate-600'}`} style={{ backgroundColor: c }} />
                      ))}
                      <input type="color" value={fgColor} onChange={e => setFgColor(e.target.value)} className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-600 cursor-pointer" />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">形状</label>
                    <div className="flex gap-3">
                      {[
                        { id: 'square' as const, label: '方形' },
                        { id: 'rounded' as const, label: '圆角' },
                        { id: 'circle' as const, label: '圆形' },
                      ].map(s => (
                        <button key={s.id} onClick={() => setShape(s.id)} className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-colors ${shape === s.id ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button onClick={generate} className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all">
                    生成 Favicon
                  </button>
                </div>
              </div>

              {/* Preview & Download */}
              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 text-center">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-6">预览</h3>
                  <div className="flex items-center justify-center mb-6">
                    {preview ? (
                      <img src={preview} alt="Favicon Preview" className="w-32 h-32 object-contain" />
                    ) : (
                      <div className="w-32 h-32 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                        <Star className="w-12 h-12 text-slate-300" />
                      </div>
                    )}
                  </div>
                  <canvas ref={canvasRef} className="hidden" />

                  {preview && (
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: '16×16', size: 16 },
                        { label: '32×32', size: 32 },
                        { label: '48×48', size: 48 },
                        { label: '64×64', size: 64 },
                        { label: '128×128', size: 128 },
                        { label: '256×256', size: 256 },
                      ].map(item => (
                        <button key={item.size} onClick={() => download(item.size)} className="py-2 px-3 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors flex items-center justify-center gap-1">
                          <Download className="w-3 h-3" /> {item.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-800 p-4">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                    <div className="text-sm text-amber-800 dark:text-amber-300 space-y-1">
                      <p>Favicon是网站标签页显示的小图标。</p>
                      <p>推荐使用 32×32 或 16×16 像素的图标。</p>
                      <p>所有图片均在本地生成，不会上传到服务器。</p>
                    </div>
                  </div>
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
