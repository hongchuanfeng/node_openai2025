'use client';

import { useState, useRef, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Upload, Download, Minimize2, ImageIcon } from 'lucide-react';

type OutputFormat = 'jpeg' | 'webp' | 'png';

export default function ImageCompressPage() {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [quality, setQuality] = useState(80);
  const [origSize, setOrigSize] = useState(0);
  const [newSize, setNewSize] = useState(0);
  const [format, setFormat] = useState<OutputFormat>('jpeg');
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setOrigSize(file.size);
    const reader = new FileReader();
    reader.onload = ev => {
      setImage(ev.target?.result as string);
      setResult(null);
      setNewSize(0);
    };
    reader.readAsDataURL(file);
  }, []);

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const compress = () => {
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
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      // PNG 不支持 quality 参数，直接绘制
      if (format === 'png') {
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL('image/png');
        setResult(dataUrl);
        setNewSize(Math.round(dataUrl.length * 0.75));
        setLoading(false);
        return;
      }
      
      // JPEG 和 WebP 使用 quality
      const mimeType = format === 'webp' ? 'image/webp' : 'image/jpeg';
      ctx.drawImage(img, 0, 0);
      const dataUrl = canvas.toDataURL(mimeType, quality / 100);
      setResult(dataUrl);
      setNewSize(Math.round(dataUrl.length * 0.75));
      setLoading(false);
    };
    
    img.onerror = () => {
      setLoading(false);
    };
    
    img.src = image;
  };

  const download = () => {
    if (!result) return;
    const ext = format === 'jpeg' ? 'jpg' : format;
    const link = document.createElement('a');
    link.href = result;
    link.download = `compressed-${quality}pct.${ext}`;
    link.click();
  };

  const ratio = origSize > 0 && newSize > 0 ? ((1 - newSize / origSize) * 100).toFixed(1) : '0';

  return (
    <div className="min-h-screen flex flex-col">
      <canvas ref={canvasRef} className="hidden" />
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-emerald-200 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Minimize2 className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">图片压缩工具</h1>
            </div>
            <p className="text-emerald-100 text-lg">压缩图片文件大小，支持转换为 JPG、WebP 格式</p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8">
                <h3 className="font-bold text-slate-900 dark:text-white mb-6">上传图片</h3>
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

                <div className="mt-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">输出格式</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setFormat('jpeg')}
                        className={`py-3 px-4 rounded-xl text-sm font-medium transition-all flex flex-col items-center gap-1 ${
                          format === 'jpeg'
                            ? 'bg-green-500 text-white'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                        }`}
                      >
                        <span className="font-bold">JPG</span>
                        <span className="text-xs opacity-70">体积小</span>
                      </button>
                      <button
                        onClick={() => setFormat('webp')}
                        className={`py-3 px-4 rounded-xl text-sm font-medium transition-all flex flex-col items-center gap-1 ${
                          format === 'webp'
                            ? 'bg-green-500 text-white'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                        }`}
                      >
                        <span className="font-bold">WebP</span>
                        <span className="text-xs opacity-70">现代格式</span>
                      </button>
                      <button
                        onClick={() => setFormat('png')}
                        className={`py-3 px-4 rounded-xl text-sm font-medium transition-all flex flex-col items-center gap-1 ${
                          format === 'png'
                            ? 'bg-green-500 text-white'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                        }`}
                      >
                        <span className="font-bold">PNG</span>
                        <span className="text-xs opacity-70">保留透明</span>
                      </button>
                    </div>
                  </div>

                  {format !== 'png' && (
                    <div>
                      <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                        压缩质量：{quality}%
                      </label>
                      <input 
                        type="range" 
                        min="5" 
                        max="100" 
                        value={quality} 
                        onChange={e => setQuality(Number(e.target.value))} 
                        className="w-full accent-green-600" 
                      />
                      <div className="flex justify-between text-xs text-slate-400 mt-1">
                        <span>高压缩</span>
                        <span>高画质</span>
                      </div>
                    </div>
                  )}

                  {format === 'png' && (
                    <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm">
                      PNG 格式保留透明度，质量参数不适用于 PNG
                    </div>
                  )}
                </div>

                <button 
                  onClick={compress} 
                  disabled={!image || loading} 
                  className="w-full mt-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? '处理中...' : '压缩图片'}
                </button>
              </div>

              <div className="space-y-6">
                {result && (
                  <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-slate-900 dark:text-white">压缩结果</h3>
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
                        {format.toUpperCase()}
                      </span>
                    </div>
                    <img src={result} alt="Compressed" className="w-full rounded-xl mb-6" />
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 text-center">
                        <p className="text-sm text-slate-500 mb-1">原大小</p>
                        <p className="text-lg font-bold text-slate-700 dark:text-slate-300">{formatSize(origSize)}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 text-center">
                        <p className="text-sm text-slate-500 mb-1">新大小</p>
                        <p className="text-lg font-bold text-slate-700 dark:text-slate-300">{formatSize(newSize)}</p>
                      </div>
                    </div>

                    {Number(ratio) > 0 ? (
                      <div className="mb-6 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 text-center font-medium">
                        节省 {ratio}% 空间（减少 {formatSize(origSize - newSize)}）
                      </div>
                    ) : (
                      <div className="mb-6 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 text-center text-sm">
                        压缩后文件变大，建议调整参数
                      </div>
                    )}

                    <button 
                      onClick={download} 
                      className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all flex items-center justify-center gap-2"
                    >
                      <Download className="w-5 h-5" /> 
                      下载 {format.toUpperCase()} 图片
                    </button>
                  </div>
                )}

                <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-4">格式说明</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-amber-600">JPG</span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-700 dark:text-slate-300">JPEG</p>
                        <p className="text-sm text-slate-500">有损压缩，体积最小，适合照片和复杂图像</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-purple-600">WP</span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-700 dark:text-slate-300">WebP</p>
                        <p className="text-sm text-slate-500">现代��式，支持透明，比 JPG 体积更小</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-blue-600">PNG</span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-700 dark:text-slate-300">PNG</p>
                        <p className="text-sm text-slate-500">无损压缩，保留透明度，适合图标和图形</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-3">使用说明</h4>
                  <ul className="space-y-2 text-sm text-slate-500">
                    <li>• 支持 JPG、WebP、PNG 三种格式转换</li>
                    <li>• 调节质量滑块控制压缩程度</li>
                    <li>• WebP 通常比 JPG 体积小 25-35%</li>
                    <li>• 所有处理均在本地完成，图片不会上传</li>
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