'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Type, Download } from 'lucide-react';

export default function TextToImagePage() {
  const [text, setText] = useState('传道AI');
  const [bg, setBg] = useState('#1a1a2e');
  const [fg, setFg] = useState('#ffffff');
  const [size, setSize] = useState(600);
  const [fontSize, setFontSize] = useState(48);
  const [previewSrc, setPreviewSrc] = useState('');

  const generateSrc = (t: string, b: string, f: string, s: number, fs: number) => {
    const canvas = document.createElement('canvas');
    canvas.width = s;
    canvas.height = s;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = b;
    ctx.fillRect(0, 0, s, s);
    ctx.fillStyle = f;
    ctx.font = `${fs}px system-ui, "Microsoft YaHei", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(t, s / 2, s / 2);
    return canvas.toDataURL('image/png');
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPreviewSrc(generateSrc(text, bg, fg, size, fontSize));
    }
  }, [text, bg, fg, size, fontSize]);

  const generate = () => {
    const data = generateSrc(text, bg, fg, size, fontSize);
    const link = document.createElement('a');
    link.href = data;
    link.download = 'text-image.png';
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
              <Type className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">文字生成图片工具</h1>
            </div>
            <p className="text-indigo-100 text-lg">将文字内容生成为精美图片，适合社交分享</p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8">
                <h3 className="font-bold text-slate-900 dark:text-white mb-6">设置</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">文字内容</label>
                    <textarea value={text} onChange={e => setText(e.target.value)} rows={3} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white resize-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">背景颜色</label>
                      <div className="flex gap-2">
                        {['#1a1a2e', '#4f46e5', '#ef4444', '#22c55e', '#f59e0b', '#1a1a1a', '#ffffff', '#f0f9ff'].map(c => (
                          <button key={c} onClick={() => setBg(c)} className={`w-8 h-8 rounded-lg border-2 transition-all ${bg === c ? 'border-indigo-500 ring-2 ring-indigo-300' : 'border-slate-200 dark:border-slate-600'}`} style={{ backgroundColor: c }} />
                        ))}
                        <input type="color" value={bg} onChange={e => setBg(e.target.value)} className="w-8 h-8 rounded-lg cursor-pointer" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">文字颜色</label>
                      <div className="flex gap-2">
                        {['#ffffff', '#1a1a1a', '#fef08a', '#fca5a5', '#86efac', '#93c5fd', '#c4b5fd', '#f9a8d4'].map(c => (
                          <button key={c} onClick={() => setFg(c)} className={`w-8 h-8 rounded-lg border-2 transition-all ${fg === c ? 'border-indigo-500 ring-2 ring-indigo-300' : 'border-slate-200 dark:border-slate-600'}`} style={{ backgroundColor: c }} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">图片尺寸：{size}×{size}px</label>
                    <input type="range" min="100" max="1200" value={size} onChange={e => setSize(Number(e.target.value))} className="w-full accent-indigo-600" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">字体大小：{fontSize}px</label>
                    <input type="range" min="12" max="200" value={fontSize} onChange={e => setFontSize(Number(e.target.value))} className="w-full accent-indigo-600" />
                  </div>
                  <button onClick={generate} className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all flex items-center justify-center gap-2">
                    <Download className="w-5 h-5" /> 生成并下载图片
                  </button>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 flex flex-col">
                <h3 className="font-bold text-slate-900 dark:text-white mb-6">预览</h3>
                <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-900 rounded-2xl overflow-hidden">
                  {previewSrc ? (
                    <img src={previewSrc} alt="Preview" className="max-w-full max-h-full object-contain" />
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
