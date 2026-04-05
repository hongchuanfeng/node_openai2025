'use client';

import { useState, useRef, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Upload, Download, Edit } from 'lucide-react';

export default function ImageAddTextPage() {
  const [image, setImage] = useState<string | null>(null);
  const [texts, setTexts] = useState<{ id: number; text: string; x: number; y: number; size: number; color: string; bold: boolean }[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nextId, setNextId] = useState(1);

  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      setImage(ev.target?.result as string);
      setTexts([]);
      setNextId(1);
    };
    reader.readAsDataURL(file);
  }, []);

  const addText = () => {
    const newId = nextId;
    setTexts(prev => [...prev, { id: newId, text: '新文字', x: 50, y: 50, size: 32, color: '#ffffff', bold: false }]);
    setEditingId(newId);
    setNextId(prev => prev + 1);
  };

  const updateText = (id: number, field: string, value: any) => {
    setTexts(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const removeText = (id: number) => {
    setTexts(prev => prev.filter(t => t.id !== id));
  };

  const renderPreview = () => {
    if (!image) return null;
    const canvas = document.createElement('canvas');
    const img = new window.Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      texts.forEach(t => {
        ctx.font = `${t.bold ? 'bold ' : ''}${t.size}px system-ui, sans-serif`;
        ctx.fillStyle = t.color;
        ctx.fillText(t.text, t.x, t.y);
      });
      return canvas.toDataURL('image/png');
    };
    img.src = image;
    return null;
  };

  const download = () => {
    if (!image) return;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new window.Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      texts.forEach(t => {
        ctx.font = `${t.bold ? 'bold ' : ''}${t.size}px system-ui, sans-serif`;
        ctx.fillStyle = t.color;
        ctx.fillText(t.text, t.x, t.y);
      });
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'text-image.png';
      link.click();
    };
    img.src = image;
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
              <Edit className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">图片加文字</h1>
            </div>
            <p className="text-amber-100 text-lg">在图片上添加文字标注和说明</p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left: settings */}
              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8">
                  <label className="block w-full aspect-video rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    {image ? (
                      <img src={image} alt="Preview" className="w-full h-full object-contain rounded-xl" />
                    ) : (
                      <>
                        <Upload className="w-12 h-12 text-slate-300 mb-3" />
                        <p className="text-slate-400 text-sm">点击上传图片</p>
                      </>
                    )}
                    <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                  </label>
                  <canvas ref={canvasRef} className="hidden" />
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-slate-900 dark:text-white">文字图层 ({texts.length})</h3>
                    <button onClick={addText} disabled={!image} className="flex items-center gap-1 text-sm px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50">
                      + 添加文字
                    </button>
                  </div>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {texts.map(t => (
                      <div key={t.id} className="p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-2 mb-2">
                          <input type="text" value={t.text} onChange={e => updateText(t.id, 'text', e.target.value)} className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-slate-900 dark:text-white" />
                          <button onClick={() => removeText(t.id)} className="text-red-400 hover:text-red-600 text-sm px-2">删除</button>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <label className="text-slate-400">X: {t.x}</label>
                            <input type="range" min="0" max="100" value={t.x} onChange={e => updateText(t.id, 'x', Number(e.target.value))} className="w-full accent-amber-600" />
                          </div>
                          <div>
                            <label className="text-slate-400">Y: {t.y}</label>
                            <input type="range" min="0" max="100" value={t.y} onChange={e => updateText(t.id, 'y', Number(e.target.value))} className="w-full accent-amber-600" />
                          </div>
                          <div>
                            <label className="text-slate-400">大小: {t.size}</label>
                            <input type="range" min="12" max="120" value={t.size} onChange={e => updateText(t.id, 'size', Number(e.target.value))} className="w-full accent-amber-600" />
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex gap-1">
                            {['#ffffff', '#000000', '#ef4444', '#f59e0b', '#22c55e', '#3b82f6'].map(c => (
                              <button key={c} onClick={() => updateText(t.id, 'color', c)} className={`w-6 h-6 rounded border transition-all ${t.color === c ? 'border-blue-500 ring-1 ring-blue-300' : 'border-slate-200'}`} style={{ backgroundColor: c }} />
                            ))}
                          </div>
                          <button onClick={() => updateText(t.id, 'bold', !t.bold)} className={`px-2 py-1 rounded text-xs font-bold ${t.bold ? 'bg-amber-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>B</button>
                        </div>
                      </div>
                    ))}
                    {texts.length === 0 && <p className="text-center text-slate-400 text-sm py-4">上传图片后添加文字</p>}
                  </div>
                </div>
              </div>

              {/* Right: preview */}
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 flex flex-col">
                <h3 className="font-bold text-slate-900 dark:text-white mb-6">预览</h3>
                <div className="flex-1 flex items-center justify-center">
                  {image ? (
                    <div className="relative w-full bg-slate-50 dark:bg-slate-900 rounded-2xl overflow-hidden flex items-center justify-center" style={{ minHeight: 300 }}>
                      <img src={image} alt="Base" className="w-full object-contain" />
                      {texts.map(t => (
                        <div key={t.id} className="absolute" style={{ left: `${t.x}%`, top: `${t.y}%`, fontSize: t.size, color: t.color, fontWeight: t.bold ? 'bold' : 'normal' }}>
                          {t.text}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-slate-300">
                      <Edit className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p className="text-sm">图片预览</p>
                    </div>
                  )}
                </div>
                <button onClick={download} disabled={!image || texts.length === 0} className="w-full mt-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  <Download className="w-5 h-5" /> 下载图片
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
