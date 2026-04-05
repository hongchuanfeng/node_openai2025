'use client';

import { useState, useRef, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Upload, Download, Droplet, Image, Type, Palette, Move, ZoomIn } from 'lucide-react';

type WatermarkType = 'text' | 'image';
type Position = 'top-left' | 'top-center' | 'top-right' | 'center-left' | 'center' | 'center-right' | 'bottom-left' | 'bottom-center' | 'bottom-right' | 'tile';

export default function ImageWatermarkPage() {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [watermarkType, setWatermarkType] = useState<WatermarkType>('text');
  
  // 文字水印
  const [watermarkText, setWatermarkText] = useState('Watermark');
  const [textColor, setTextColor] = useState('#ffffff');
  const [textSize, setTextSize] = useState(36);
  const [textOpacity, setTextOpacity] = useState(0.5);
  const [textFont, setTextFont] = useState('sans-serif');
  
  // 图片水印
  const [watermarkImage, setWatermarkImage] = useState<string | null>(null);
  const [imageScale, setImageScale] = useState(0.3);
  const [imageOpacity, setImageOpacity] = useState(0.8);
  
  // 通用
  const [position, setPosition] = useState<Position>('bottom-right');
  const [margin, setMargin] = useState(20);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mainCanvasRef = useRef<HTMLCanvasElement>(null);

  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => { setImage(ev.target?.result as string); setResult(null); };
    reader.readAsDataURL(file);
  }, []);

  const handleWatermarkUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => { setWatermarkImage(ev.target?.result as string); };
    reader.readAsDataURL(file);
  }, []);

  const getPositionCoords = (canvasW: number, canvasH: number, itemW: number, itemH: number, pos: Position) => {
    const m = margin;
    switch (pos) {
      case 'top-left': return { x: m, y: m };
      case 'top-center': return { x: (canvasW - itemW) / 2, y: m };
      case 'top-right': return { x: canvasW - itemW - m, y: m };
      case 'center-left': return { x: m, y: (canvasH - itemH) / 2 };
      case 'center': return { x: (canvasW - itemW) / 2, y: (canvasH - itemH) / 2 };
      case 'center-right': return { x: canvasW - itemW - m, y: (canvasH - itemH) / 2 };
      case 'bottom-left': return { x: m, y: canvasH - itemH - m };
      case 'bottom-center': return { x: (canvasW - itemW) / 2, y: canvasH - itemH - m };
      case 'bottom-right': return { x: canvasW - itemW - m, y: canvasH - itemH - m };
      default: return { x: m, y: m };
    }
  };

  const applyWatermark = () => {
    if (!image) return;
    const canvas = mainCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const img = new window.Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      if (watermarkType === 'text') {
        applyTextWatermark(ctx, canvas.width, canvas.height);
        setResult(canvas.toDataURL('image/png'));
      } else if (watermarkType === 'image' && watermarkImage) {
        const wmImg = new window.Image();
        wmImg.onload = () => {
          const scaledW = wmImg.width * imageScale;
          const scaledH = wmImg.height * imageScale;

          ctx.globalAlpha = imageOpacity;

          if (position === 'tile') {
            const gapX = scaledW + 60;
            const gapY = scaledH + 60;
            for (let y = -scaledH; y < canvas.height + scaledH; y += gapY) {
              for (let x = -scaledW; x < canvas.width + scaledW; x += gapX) {
                ctx.drawImage(wmImg, x, y, scaledW, scaledH);
              }
            }
          } else {
            const coords = getPositionCoords(canvas.width, canvas.height, scaledW, scaledH, position);
            ctx.drawImage(wmImg, coords.x, coords.y, scaledW, scaledH);
          }
          ctx.globalAlpha = 1;
          setResult(canvas.toDataURL('image/png'));
        };
        wmImg.src = watermarkImage;
      }
    };
    img.src = image;
  };

  const applyTextWatermark = (ctx: CanvasRenderingContext2D, canvasW: number, canvasH: number) => {
    ctx.globalAlpha = textOpacity;
    ctx.fillStyle = textColor;
    ctx.font = `${textSize}px ${textFont}`;
    ctx.textBaseline = 'top';

    const lines = watermarkText.split('\n');
    const lineHeight = textSize * 1.4;
    const maxWidth = Math.max(...lines.map(l => ctx.measureText(l).width));
    const totalH = lines.length * lineHeight;

    if (position === 'tile') {
      ctx.textAlign = 'left';
      const gapX = maxWidth + 80;
      const gapY = totalH + 60;
      for (let y = -totalH; y < canvasH + totalH; y += gapY) {
        for (let x = -maxWidth; x < canvasW + maxWidth; x += gapX) {
          lines.forEach((line, i) => {
            ctx.fillText(line, x, y + i * lineHeight);
          });
        }
      }
    } else {
      const coords = getPositionCoords(canvasW, canvasH, maxWidth, totalH, position);
      ctx.textAlign = position.includes('center') ? 'center' : position.includes('right') ? 'right' : 'left';
      lines.forEach((line, i) => {
        const lineY = position.includes('bottom') 
          ? coords.y + (lines.length - 1 - i) * lineHeight 
          : coords.y + i * lineHeight;
        const lineX = position.includes('center') 
          ? coords.x + maxWidth / 2 
          : position.includes('right') 
            ? coords.x + maxWidth 
            : coords.x;
        ctx.fillText(line, lineX, lineY);
      });
    }
    ctx.globalAlpha = 1;
  };


  const download = () => {
    if (!result) return;
    const link = document.createElement('a');
    link.href = result;
    link.download = 'watermarked.png';
    link.click();
  };

  const positions: { id: Position; label: string }[] = [
    { id: 'top-left', label: '左上' },
    { id: 'top-center', label: '上' },
    { id: 'top-right', label: '右上' },
    { id: 'center-left', label: '左' },
    { id: 'center', label: '居中' },
    { id: 'center-right', label: '右' },
    { id: 'bottom-left', label: '左下' },
    { id: 'bottom-center', label: '下' },
    { id: 'bottom-right', label: '右下' },
    { id: 'tile', label: '平铺' },
  ];

  const presetColors = ['#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff6600', '#333333'];

  return (
    <div className="min-h-screen flex flex-col">
      <canvas ref={mainCanvasRef} className="hidden" />
      <canvas ref={canvasRef} className="hidden" />
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-purple-200 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Droplet className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">图片水印处理</h1>
            </div>
            <p className="text-blue-100 text-lg">为图片添加文字或图片水印，保护图片版权</p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* 上传图片 */}
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Upload className="w-5 h-5 text-blue-500" />
                    上传图片
                  </h3>
                  <label className="block w-full aspect-square rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors overflow-hidden">
                    {image ? (
                      <img src={image} alt="Preview" className="w-full h-full object-contain" />
                    ) : (
                      <>
                        <Upload className="w-12 h-12 text-slate-300 mb-3" />
                        <p className="text-slate-400 text-sm">点击上传图片</p>
                        <p className="text-slate-300 text-xs mt-1">支持 JPG、PNG、WebP</p>
                      </>
                    )}
                    <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                  </label>
                </div>
              </div>

              {/* 水印设置 */}
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-4">水印设置</h3>
                  
                  {/* 水印类型切换 */}
                  <div className="flex gap-2 mb-6">
                    <button
                      onClick={() => setWatermarkType('text')}
                      className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                        watermarkType === 'text' 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <Type className="w-4 h-4" />
                      文字水印
                    </button>
                    <button
                      onClick={() => setWatermarkType('image')}
                      className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                        watermarkType === 'image' 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <Image className="w-4 h-4" />
                      图片水印
                    </button>
                  </div>

                  <div className="space-y-4">
                    {watermarkType === 'text' ? (
                      <>
                        {/* 文字水印设置 */}
                        <div>
                          <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">水印文字</label>
                          <textarea
                            value={watermarkText}
                            onChange={e => setWatermarkText(e.target.value)}
                            rows={2}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            placeholder="输入水印文字"
                          />
                        </div>

                        <div>
                          <label className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                            <Palette className="w-4 h-4" />
                            文字颜色
                          </label>
                          <div className="flex gap-2 mb-2 flex-wrap">
                            {presetColors.map(color => (
                              <button
                                key={color}
                                onClick={() => setTextColor(color)}
                                className={`w-8 h-8 rounded-lg border-2 transition-all ${
                                  textColor === color ? 'border-blue-500 scale-110' : 'border-slate-200 dark:border-slate-600'
                                }`}
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                          <input
                            type="color"
                            value={textColor}
                            onChange={e => setTextColor(e.target.value)}
                            className="w-full h-10 rounded-lg cursor-pointer"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                            字体大小：{textSize}px
                          </label>
                          <input
                            type="range"
                            min="12"
                            max="120"
                            value={textSize}
                            onChange={e => setTextSize(Number(e.target.value))}
                            className="w-full accent-blue-600"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                            透明度：{Math.round(textOpacity * 100)}%
                          </label>
                          <input
                            type="range"
                            min="0.05"
                            max="1"
                            step="0.05"
                            value={textOpacity}
                            onChange={e => setTextOpacity(Number(e.target.value))}
                            className="w-full accent-blue-600"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        {/* 图片水印设置 */}
                        <div>
                          <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">水印图片</label>
                          <label className="block w-full aspect-video rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors overflow-hidden">
                            {watermarkImage ? (
                              <img src={watermarkImage} alt="Watermark" className="w-full h-full object-contain p-2" />
                            ) : (
                              <>
                                <Upload className="w-8 h-8 text-slate-300 mb-2" />
                                <p className="text-slate-400 text-xs">点击上传水印图片</p>
                              </>
                            )}
                            <input type="file" accept="image/*" onChange={handleWatermarkUpload} className="hidden" />
                          </label>
                        </div>

                        <div>
                          <label className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                            <ZoomIn className="w-4 h-4" />
                            缩放比例：{Math.round(imageScale * 100)}%
                          </label>
                          <input
                            type="range"
                            min="0.05"
                            max="1"
                            step="0.05"
                            value={imageScale}
                            onChange={e => setImageScale(Number(e.target.value))}
                            className="w-full accent-blue-600"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                            透明度：{Math.round(imageOpacity * 100)}%
                          </label>
                          <input
                            type="range"
                            min="0.05"
                            max="1"
                            step="0.05"
                            value={imageOpacity}
                            onChange={e => setImageOpacity(Number(e.target.value))}
                            className="w-full accent-blue-600"
                          />
                        </div>
                      </>
                    )}

                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                        <Move className="w-4 h-4" />
                        位置
                      </label>
                      <div className="grid grid-cols-5 gap-1">
                        {positions.map(p => (
                          <button
                            key={p.id}
                            onClick={() => setPosition(p.id)}
                            className={`py-2 rounded-lg text-xs font-medium transition-all ${
                              position === p.id 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                            }`}
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                        边距：{margin}px
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={margin}
                        onChange={e => setMargin(Number(e.target.value))}
                        className="w-full accent-blue-600"
                      />
                    </div>

                    <button
                      onClick={applyWatermark}
                      disabled={!image || (watermarkType === 'image' && !watermarkImage)}
                      className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all disabled:opacity-50"
                    >
                      {watermarkType === 'text' ? '添加文字水印' : '添加图片水印'}
                    </button>
                  </div>
                </div>
              </div>

              {/* 预览与下载 */}
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      预览
                    </h3>
                    {result && (
                      <button
                        onClick={download}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all text-sm"
                      >
                        <Download className="w-4 h-4" />
                        下载
                      </button>
                    )}
                  </div>
                  <div className="aspect-square rounded-2xl bg-slate-100 dark:bg-slate-700 overflow-hidden flex items-center justify-center">
                    {result ? (
                      <img src={result} alt="Result" className="w-full h-full object-contain" />
                    ) : (
                      <p className="text-slate-400 text-sm">上传图片后预览</p>
                    )}
                  </div>
                </div>

                <div className="mt-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                  <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">使用说明</h4>
                  <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                    <li>• 支持文字水印和图片水印</li>
                    <li>• 可自定义颜色、位置、透明度</li>
                    <li>• 平铺模式适合大面积覆盖</li>
                    <li>• 支持 JPG、PNG、WebP 格式</li>
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