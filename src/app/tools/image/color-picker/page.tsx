'use client';

import { useState, useRef, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Upload, Palette, Copy, Check, Download } from 'lucide-react';

export default function ColorPickerImagePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [image, setImage] = useState<string | null>(null);
  const [colors, setColors] = useState<string[]>([]);
  const [copied, setCopied] = useState<number | null>(null);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setImage(dataUrl);
      extractColors(dataUrl);
    };
    reader.readAsDataURL(file);
  }, []);

  const extractColors = (src: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const img = new window.Image();
    img.onload = () => {
      const maxSize = 200;
      const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const colorMap: Record<string, number> = {};
      for (let i = 0; i < imageData.data.length; i += 4) {
        const r = Math.round(imageData.data[i] / 16) * 16;
        const g = Math.round(imageData.data[i + 1] / 16) * 16;
        const b = Math.round(imageData.data[i + 2] / 16) * 16;
        const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
        colorMap[hex] = (colorMap[hex] || 0) + 1;
      }
      const sorted = Object.entries(colorMap).sort((a, b) => b[1] - a[1]).slice(0, 12).map(([c]) => c);
      setColors(sorted);
    };
    img.src = src;
  };

  const copyColor = async (hex: string, idx: number) => {
    await navigator.clipboard.writeText(hex);
    setCopied(idx);
    setTimeout(() => setCopied(null), 2000);
  };

  const rgbToHex = (r: number, g: number, b: number) =>
    `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-pink-200 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Palette className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">图片颜色拾取器</h1>
            </div>
            <p className="text-purple-100 text-lg">上传图片，自动提取主色调和调色板</p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Image upload */}
              <div>
                <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-6">上传图片</h3>
                  <label className="block w-full aspect-video rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    {image ? (
                      <img src={image} alt="Uploaded" className="w-full h-full object-contain rounded-xl" />
                    ) : (
                      <>
                        <Upload className="w-12 h-12 text-slate-300 mb-3" />
                        <p className="text-slate-400 text-sm">点击上传图片</p>
                        <p className="text-slate-300 text-xs mt-1">支持 JPG、PNG、GIF、WebP</p>
                      </>
                    )}
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                  <canvas ref={canvasRef} className="hidden" />
                </div>
              </div>

              {/* Colors */}
              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-6">提取的颜色</h3>
                  {colors.length > 0 ? (
                    <div className="grid grid-cols-4 gap-3">
                      {colors.map((color, i) => (
                        <button
                          key={i}
                          onClick={() => copyColor(color, i)}
                          className="group flex flex-col items-center gap-2"
                        >
                          <div
                            className="w-full aspect-square rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 group-hover:scale-110 transition-transform"
                            style={{ backgroundColor: color }}
                          />
                          <span className={`text-xs font-mono transition-colors ${copied === i ? 'text-green-500' : 'text-slate-500'}`}>
                            {copied === i ? <Check className="w-3 h-3 inline" /> : ''} {color.toUpperCase()}
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-slate-400">
                      <Palette className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p className="text-sm">上传图片后自动提取颜色</p>
                    </div>
                  )}
                </div>

                {/* Color formats */}
                {colors.length > 0 && (
                  <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-6">颜色值格式</h3>
                    <div className="space-y-2">
                      {colors.slice(0, 4).map((color, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900">
                          <div className="w-8 h-8 rounded-lg shadow-sm shrink-0" style={{ backgroundColor: color }} />
                          <div className="flex-1 grid grid-cols-2 gap-2 text-xs font-mono">
                            <div className="text-slate-500">HEX: <span className="text-slate-900 dark:text-white">{color.toUpperCase()}</span></div>
                            <div className="text-slate-500">RGB: <span className="text-slate-900 dark:text-white">{parseInt(color.slice(1, 3), 16)}, {parseInt(color.slice(3, 5), 16)}, {parseInt(color.slice(5, 7), 16)}</span></div>
                          </div>
                        </div>
                      ))}
                    </div>
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
