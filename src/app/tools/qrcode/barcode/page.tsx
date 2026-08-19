'use client';

import { useState, useRef, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import JsBarcode from 'jsbarcode';
import { Download, Copy, Check, RefreshCw, Info } from 'lucide-react';

type BarcodeFormat = 'CODE128' | 'CODE39' | 'EAN13' | 'EAN8' | 'UPC' | 'ITF14' | 'MSI';

export default function BarcodeGenerator() {
  const [content, setContent] = useState('');
  const [barcodeImage, setBarcodeImage] = useState<string | null>(null);
  const [format, setFormat] = useState<BarcodeFormat>('CODE128');
  const [width, setWidth] = useState(2);
  const [height, setHeight] = useState(80);
  const [displayValue, setDisplayValue] = useState(true);
  const [background, setBackground] = useState('#ffffff');
  const [lineColor, setLineColor] = useState('#000000');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const formatOptions: { value: BarcodeFormat; label: string; example: string }[] = [
    { value: 'CODE128', label: 'CODE128', example: 'ABC-123456' },
    { value: 'CODE39', label: 'CODE39', example: 'ABC123' },
    { value: 'EAN13', label: 'EAN-13', example: '5901234123457' },
    { value: 'EAN8', label: 'EAN-8', example: '12345670' },
    { value: 'UPC', label: 'UPC-A', example: '012345678905' },
    { value: 'ITF14', label: 'ITF-14', example: '01234567890123' },
    { value: 'MSI', label: 'MSI', example: '123456' },
  ];

  const generateBarcode = () => {
    if (!content.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const canvas = canvasRef.current;
      if (!canvas) return;

      JsBarcode(canvas, content, {
        format: format,
        width: width,
        height: height,
        displayValue: displayValue,
        background: background,
        lineColor: lineColor,
        margin: 10,
        fontSize: 14,
      });

      const dataUrl = canvas.toDataURL('image/png');
      setBarcodeImage(dataUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成失败');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (content.trim()) {
      generateBarcode();
    }
  }, [format, width, height, displayValue, background, lineColor]);

  const handleDownload = () => {
    if (!barcodeImage) return;
    const link = document.createElement('a');
    link.download = `barcode-${Date.now()}.png`;
    link.href = barcodeImage;
    link.click();
  };

  const handleCopy = async () => {
    if (!barcodeImage) return;
    const res = await fetch(barcodeImage);
    const blob = await res.blob();
    await navigator.clipboard.write([
      new ClipboardItem({ 'image/png': blob })
    ]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setContent('');
    setBarcodeImage(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-purple-900/20 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              条形码生成器
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              生成各种标准格式的条形码图片，支持多种条码类型
            </p>
          </div>
        </section>

        {/* Tool Section */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Settings */}
              <div className="space-y-6">
                {/* Content Input */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-lg font-semibold text-slate-900 dark:text-white">
                      内容
                    </label>
                    <button
                      onClick={handleClear}
                      className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1"
                    >
                      <RefreshCw className="w-4 h-4" />
                      清空
                    </button>
                  </div>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="输入条形码内容..."
                    className="w-full h-32 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                  {error && (
                    <p className="mt-2 text-sm text-red-500">{error}</p>
                  )}
                  <button
                    onClick={generateBarcode}
                    disabled={!content.trim() || loading}
                    className="mt-4 w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? '生成中...' : '生成条形码'}
                  </button>
                </div>

                {/* Options */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                    选项
                  </h3>
                  <div className="space-y-4">
                    {/* Format */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        条码格式
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {formatOptions.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => setFormat(opt.value)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                              format === opt.value
                                ? 'bg-blue-500 text-white'
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                            }`}
                          >
                            <div>{opt.label}</div>
                            <div className={`text-xs mt-0.5 ${
                              format === opt.value ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'
                            }`}>
                              例: {opt.example}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Width */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        条码宽度: {width}px
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        step="1"
                        value={width}
                        onChange={(e) => setWidth(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    {/* Height */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        条码高度: {height}px
                      </label>
                      <input
                        type="range"
                        min="40"
                        max="200"
                        step="10"
                        value={height}
                        onChange={(e) => setHeight(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    {/* Display Value */}
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="displayValue"
                        checked={displayValue}
                        onChange={(e) => setDisplayValue(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300"
                      />
                      <label htmlFor="displayValue" className="text-sm text-slate-700 dark:text-slate-300">
                        显示数字
                      </label>
                    </div>

                    {/* Colors */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          条纹颜色
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={lineColor}
                            onChange={(e) => setLineColor(e.target.value)}
                            className="w-10 h-10 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={lineColor}
                            onChange={(e) => setLineColor(e.target.value)}
                            className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          背景颜色
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={background}
                            onChange={(e) => setBackground(e.target.value)}
                            className="w-10 h-10 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={background}
                            onChange={(e) => setBackground(e.target.value)}
                            className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-lg font-semibold text-slate-900 dark:text-white">
                    预览
                  </label>
                  {barcodeImage && (
                    <div className="flex gap-2">
                      <button
                        onClick={handleCopy}
                        className={`text-sm flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${
                          copied
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                        }`}
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? '已复制' : '复制'}
                      </button>
                      <button
                        onClick={handleDownload}
                        className="text-sm flex items-center gap-1 px-3 py-1.5 rounded-lg text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                      >
                        <Download className="w-4 h-4" />
                        下载
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-center bg-gray-50 dark:bg-slate-900 rounded-xl p-8 min-h-[200px]">
                  {barcodeImage ? (
                    <img src={barcodeImage} alt="Barcode" className="max-w-full" />
                  ) : (
                    <div className="text-slate-400 text-center">
                      <Info className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>输入内容后点击生成</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Hidden canvas for generation */}
            <canvas ref={canvasRef} style={{ display: 'none' }} />
          </div>
        </section>

        {/* Info Section */}
        <section className="py-8 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-500" />
              支持的条码格式
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">CODE128</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  最常用的条码格式，支持ASCII字符集中的所有128个字符，广泛用于物流、仓储等场景。
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">CODE39</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  早期条码格式，仅支持大写字母、数字和少量特殊字符，常用于工业、军事等领域。
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">EAN-13 / EAN-8</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  商品条码标准，EAN-13为13位数字，EAN-8为8位数字，用于零售商品标识。
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">UPC-A</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  美国和加拿大使用的商品条码系统，由12位数字组成。
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">ITF-14</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  仓储和物流用条码，仅支持数字，用于运输包装箱的标识。
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">MSI</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  零售和库存管理用条码，仅支持数字，常用于价格标签。
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
