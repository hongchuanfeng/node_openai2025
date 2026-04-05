'use client';

import { useState, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Upload, Download, Layers, Circle, Check } from 'lucide-react';

// 可选的尺寸
const allSizes = [16, 24, 32, 48, 64, 128, 256];

// PNG 转 ICO 格式
function pngToIco(pngBuffers: { size: number; data: Uint8Array }[]): Blob {
  const headerSize = 6;
  const dirEntrySize = 16;
  const numImages = pngBuffers.length;
  
  let dataOffset = headerSize + dirEntrySize * numImages;
  
  // 计算总大小
  const totalSize = dataOffset + pngBuffers.reduce((sum, b) => sum + b.data.length, 0);
  
  const ico = new ArrayBuffer(totalSize);
  const view = new Uint8Array(ico);
  const header = new DataView(ico);
  
  // ICO 头
  header.setUint16(0, 0, true);       // Reserved
  header.setUint16(2, 1, true);        // Type: 1 = ICO
  header.setUint16(4, numImages, true); // 图片数量
  
  // 目录条目
  let offset = headerSize;
  for (const { size, data } of pngBuffers) {
    const entry = new DataView(ico, offset, dirEntrySize);
    entry.setUint8(0, size >= 256 ? 0 : size);  // 宽度 (0 = 256)
    entry.setUint8(1, size >= 256 ? 0 : size);  // 高度 (0 = 256)
    entry.setUint8(2, 0);                        // 调色板
    entry.setUint8(3, 0);                        // 保留
    entry.setUint16(4, 1, true);                 // 颜色平面
    entry.setUint16(6, 32, true);                // 位深度
    entry.setUint32(8, data.length, true);       // 数据大小
    entry.setUint32(12, dataOffset, true);       // 数据偏移
    
    view.set(data, dataOffset);
    dataOffset += data.length;
    offset += dirEntrySize;
  }
  
  return new Blob([ico], { type: 'image/x-icon' });
}

export default function IconConvertPage() {
  const [image, setImage] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string>('');
  const [results, setResults] = useState<Map<number, string>>(new Map());
  const [rounded, setRounded] = useState(true);
  const [cornerRadius, setCornerRadius] = useState(20);
  const [selectedSizes, setSelectedSizes] = useState<number[]>([16, 32, 48, 256]);

  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageName(file.name.replace(/\.[^/.]+$/, ''));
    const reader = new FileReader();
    reader.onload = ev => {
      setImage(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const generateAll = () => {
    if (!image) return;
    const img = new window.Image();
    img.onload = () => {
      const generated = new Map<number, string>();
      for (const size of allSizes) {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d')!;
        
        // 圆角裁剪
        const r = (cornerRadius / 100) * size;
        if (rounded && r > 0) {
          ctx.beginPath();
          ctx.roundRect(0, 0, size, size, r);
          ctx.clip();
        }
        
        // 居中绘制
        const scale = Math.max(size / img.width, size / img.height);
        const w = img.width * scale;
        const h = img.height * scale;
        const x = (size - w) / 2;
        const y = (size - h) / 2;
        ctx.drawImage(img, x, y, w, h);
        
        generated.set(size, canvas.toDataURL('image/png'));
      }
      setResults(generated);
    };
    img.src = image;
  };

  const handleRoundedChange = (enabled: boolean) => {
    setRounded(enabled);
    setTimeout(generateAll, 0);
  };

  const toggleSize = (size: number) => {
    setSelectedSizes(prev => {
      if (prev.includes(size)) {
        if (prev.length === 1) return prev; // 至少保留一个
        return prev.filter(s => s !== size);
      }
      return [...prev, size].sort((a, b) => a - b);
    });
  };

  const downloadIco = async () => {
    if (results.size === 0) return;
    
    const pngBuffers: { size: number; data: Uint8Array }[] = [];
    
    for (const size of selectedSizes) {
      const dataUrl = results.get(size);
      if (!dataUrl) continue;
      
      // 转换为 PNG buffer
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const buffer = await blob.arrayBuffer();
      pngBuffers.push({ size, data: new Uint8Array(buffer) });
    }
    
    if (pngBuffers.length === 0) return;
    
    const ico = pngToIco(pngBuffers);
    const url = URL.createObjectURL(ico);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${imageName || 'icon'}.ico`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadPng = (size: number) => {
    const dataUrl = results.get(size);
    if (!dataUrl) return;
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `${imageName || 'icon'}-${size}x${size}.png`;
    link.click();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-pink-600 via-rose-600 to-orange-500 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-pink-200 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Layers className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">在线转换 Icon 图标</h1>
            </div>
            <p className="text-pink-100 text-lg">上传图片，生成 .ico 格式图标，可自定义尺寸和圆角</p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* 上传区域 */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 mb-8">
              <label className="block w-full aspect-video rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                {image ? (
                  <img src={image} alt="Preview" className="w-full h-full object-contain rounded-xl" />
                ) : (
                  <>
                    <Upload className="w-16 h-16 text-slate-300 mb-4" />
                    <p className="text-slate-400 text-lg font-medium mb-2">点击上传图片</p>
                    <p className="text-slate-300 text-sm">PNG、JPG、WebP 等格式均可，建议尺寸 ≥ 512px</p>
                  </>
                )}
                <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
              </label>
              
              {image && (
                <button
                  onClick={generateAll}
                  className="mt-4 w-full py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all"
                >
                  生成图标
                </button>
              )}
            </div>

            {/* 设置区域 */}
            {image && (
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 mb-8">
                <h3 className="font-bold text-slate-900 dark:text-white mb-6">图标设置</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  {/* 圆角设置 */}
                  <div>
                    <label className="flex items-center gap-3 mb-4 cursor-pointer">
                      <button
                        onClick={() => handleRoundedChange(!rounded)}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          rounded ? 'bg-pink-500' : 'bg-slate-300 dark:bg-slate-600'
                        }`}
                      >
                        <span
                          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                            rounded ? 'left-7' : 'left-1'
                          }`}
                        />
                      </button>
                      <span className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2">
                        <Circle className="w-5 h-5" />
                        添加圆角
                      </span>
                    </label>
                    
                    {rounded && (
                      <div className="ml-15">
                        <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                          圆角大小：{cornerRadius}%
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="50"
                          value={cornerRadius}
                          onChange={e => {
                            setCornerRadius(Number(e.target.value));
                          }}
                          className="w-full accent-pink-500"
                        />
                        <button
                          onClick={generateAll}
                          className="mt-2 w-full py-2 text-sm bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 rounded-lg hover:bg-pink-200 dark:hover:bg-pink-900/50 transition-colors"
                        >
                          重新生成
                        </button>
                      </div>
                    )}
                  </div>

                  {/* 尺寸选择 */}
                  <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">
                      选择 ICO 包含的尺寸
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {allSizes.map(size => (
                        <button
                          key={size}
                          onClick={() => toggleSize(size)}
                          className={`py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1 ${
                            selectedSizes.includes(size)
                              ? 'bg-pink-500 text-white'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          {selectedSizes.includes(size) && <Check className="w-3 h-3" />}
                          {size}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-slate-400 mt-2">已选择 {selectedSizes.length} 种尺寸</p>
                  </div>
                </div>
              </div>
            )}

            {/* 预览 */}
            {results.size > 0 && (
              <>
                <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-slate-900 dark:text-white">图标预览</h3>
                    <button
                      onClick={downloadIco}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all"
                    >
                      <Download className="w-5 h-5" />
                      下载 ICO ({selectedSizes.length}尺寸)
                    </button>
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-4">
                    {allSizes.map(size => (
                      <div key={size} className="text-center">
                        <div 
                          className="w-full aspect-square rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center mb-2 overflow-hidden p-2"
                          style={{ borderRadius: rounded ? `${cornerRadius / 2}px` : '8px' }}
                        >
                          {results.get(size) && (
                            <img src={results.get(size)!} alt={`${size}x${size}`} className="w-full h-full object-contain" />
                          )}
                        </div>
                        <div className="text-xs text-slate-500 mb-1">{size}×{size}</div>
                        <button
                          onClick={() => downloadPng(size)}
                          className="py-1 px-2 rounded bg-slate-100 dark:bg-slate-700 text-slate-500 text-xs hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                        >
                          PNG
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-pink-50 dark:bg-pink-900/20 rounded-2xl border border-pink-200 dark:border-pink-800 p-6">
                  <h4 className="font-bold text-pink-800 dark:text-pink-300 mb-3">使用说明</h4>
                  <ul className="space-y-2 text-sm text-pink-700 dark:text-pink-400">
                    <li>• 点击"下载 ICO"生成真正的 .ico 格式文件（不是 PNG）</li>
                    <li>• 可勾选需要包含哪些尺寸（16/24/32/48/64/128/256）</li>
                    <li>• 勾选的尺寸会打包到一个 .ico 文件中</li>
                    <li>• ICO 图标可直接用于 Windows 软件、网站 Favicon</li>
                    <li>• 点击各尺寸下方的"PNG"可单独下载透明背景的 PNG 图标</li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}