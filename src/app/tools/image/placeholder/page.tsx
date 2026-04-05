'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Image as ImageIcon, Download } from 'lucide-react';

export default function PlaceholderPage() {
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [bg, setBg] = useState('#e2e8f0');
  const [fg, setFg] = useState('#94a3b8');
  const [text, setText] = useState('');
  const [previewSrc, setPreviewSrc] = useState('');

  const generateSrc = (w: number, h: number, b: string, f: string, t: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = b;
    ctx.fillRect(0, 0, w, h);
    const label = t || `${w} × ${h}`;
    ctx.fillStyle = f;
    ctx.font = `${Math.min(w, h) * 0.05}px system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, w / 2, h / 2);
    return canvas.toDataURL('image/png');
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPreviewSrc(generateSrc(width, height, bg, fg, text));
    }
  }, [width, height, bg, fg, text]);

  const generate = () => {
    const data = generateSrc(width, height, bg, fg, text);
    const link = document.createElement('a');
    link.href = data;
    link.download = `placeholder-${width}x${height}.png`;
    link.click();
  };

  const presets = [
    { w: 1920, h: 1080, label: 'Full HD' },
    { w: 1280, h: 720, label: 'HD' },
    { w: 800, h: 600, label: 'VGA' },
    { w: 300, h: 250, label: 'Rectangle' },
    { w: 200, h: 200, label: 'Square' },
    { w: 120, h: 60, label: 'Button' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-600 via-zinc-600 to-gray-700 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-gray-400 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <ImageIcon className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">占位符图片生成</h1>
            </div>
            <p className="text-slate-300 text-lg">生成指定尺寸的占位图片，用于设计和开发</p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-6">图片尺寸</h3>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">宽度：{width}px</label>
                      <input type="range" min="50" max="3840" value={width} onChange={e => setWidth(Number(e.target.value))} className="w-full accent-slate-600" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">高度：{height}px</label>
                      <input type="range" min="50" max="2160" value={height} onChange={e => setHeight(Number(e.target.value))} className="w-full accent-slate-600" />
                    </div>
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">预设尺寸</label>
                    <div className="grid grid-cols-3 gap-2">
                      {presets.map(p => (
                        <button key={p.label} onClick={() => { setWidth(p.w); setHeight(p.h); }} className="py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                          {p.label}<br /><span className="text-slate-400">{p.w}×{p.h}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-6">颜色设置</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">背景色</label>
                      <div className="flex gap-2">
                        {['#e2e8f0', '#f1f5f9', '#fef3c7', '#d1fae5', '#fee2e2', '#c7d2fe'].map(c => (
                          <button key={c} onClick={() => setBg(c)} className={`w-8 h-8 rounded-lg border-2 ${bg === c ? 'border-blue-500 ring-2 ring-blue-300' : 'border-slate-200'}`} style={{ backgroundColor: c }} />
                        ))}
                        <input type="color" value={bg} onChange={e => setBg(e.target.value)} className="w-8 h-8 rounded-lg cursor-pointer" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">文字色</label>
                      <div className="flex gap-2">
                        {['#94a3b8', '#64748b', '#b45309', '#047857', '#b91c1c', '#4338ca'].map(c => (
                          <button key={c} onClick={() => setFg(c)} className={`w-8 h-8 rounded-lg border-2 ${fg === c ? 'border-blue-500 ring-2 ring-blue-300' : 'border-slate-200'}`} style={{ backgroundColor: c }} />
                        ))}
                        <input type="color" value={fg} onChange={e => setFg(e.target.value)} className="w-8 h-8 rounded-lg cursor-pointer" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">自定义文字（可选）</label>
                    <input type="text" value={text} onChange={e => setText(e.target.value)} placeholder="留空显示尺寸" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white" />
                  </div>
                </div>

                <button onClick={generate} className="w-full py-4 bg-gradient-to-r from-slate-500 to-zinc-500 text-white font-bold rounded-xl hover:from-slate-600 hover:to-zinc-600 transition-all flex items-center justify-center gap-2">
                  <Download className="w-5 h-5" /> 生成并下载
                </button>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 flex flex-col">
                <h3 className="font-bold text-slate-900 dark:text-white mb-6">预览</h3>
                <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-900 rounded-2xl overflow-hidden p-4">
                  {previewSrc ? (
                    <img src={previewSrc} alt="Placeholder" className="max-w-full max-h-96 object-contain rounded-lg" />
                  ) : (
                    <div className="text-slate-400 text-sm">生成中...</div>
                  )}
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
