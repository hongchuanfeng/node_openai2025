'use client';

import { useState, useRef, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import QRCode from 'qrcode';
import { Download, Copy, Check, RefreshCw, Info } from 'lucide-react';

type ImageFormat = 'png' | 'jpeg' | 'webp';
type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export default function QRCodeGenerator() {
  const [content, setContent] = useState('');
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [format, setFormat] = useState<ImageFormat>('png');
  const [size, setSize] = useState(256);
  const [errorLevel, setErrorLevel] = useState<ErrorCorrectionLevel>('M');
  const [colorDark, setColorDark] = useState('#000000');
  const [colorLight, setColorLight] = useState('#ffffff');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateQR = async () => {
    if (!content.trim()) return;
    setLoading(true);
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;

      await QRCode.toCanvas(canvas, content, {
        width: size,
        margin: 2,
        errorCorrectionLevel: errorLevel,
        color: {
          dark: colorDark,
          light: colorLight,
        },
      });

      const dataUrl = canvas.toDataURL(`image/${format}`, 0.95);
      setQrImage(dataUrl);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (content.trim()) {
      generateQR();
    }
  }, [format, size, errorLevel, colorDark, colorLight]);

  const handleDownload = () => {
    if (!qrImage) return;
    const link = document.createElement('a');
    link.download = `qrcode-${Date.now()}.${format}`;
    link.href = qrImage;
    link.click();
  };

  const handleCopy = async () => {
    if (!qrImage) return;
    const res = await fetch(qrImage);
    const blob = await res.blob();
    await navigator.clipboard.write([
      new ClipboardItem({ 'image/png': blob })
    ]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setContent('');
    setQrImage(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-purple-900/20 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              二维码生成器
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              输入文本、网址或其他内容，即可生成对应的二维码图片
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
                    placeholder="输入文本、网址或任意内容..."
                    className="w-full h-32 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                  <button
                    onClick={generateQR}
                    disabled={!content.trim() || loading}
                    className="mt-4 w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? '生成中...' : '生成二维码'}
                  </button>
                </div>

                {/* Options */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                    选项
                  </h3>
                  <div className="space-y-4">
                    {/* Size */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        尺寸: {size}px
                      </label>
                      <input
                        type="range"
                        min="128"
                        max="512"
                        step="32"
                        value={size}
                        onChange={(e) => setSize(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    {/* Format */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        图片格式
                      </label>
                      <div className="flex gap-2">
                        {(['png', 'jpeg', 'webp'] as ImageFormat[]).map((f) => (
                          <button
                            key={f}
                            onClick={() => setFormat(f)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              format === f
                                ? 'bg-blue-500 text-white'
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                            }`}
                          >
                            {f.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Error Level */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        纠错级别
                      </label>
                      <div className="flex gap-2">
                        {[
                          { level: 'L', label: '低 (7%)' },
                          { level: 'M', label: '中 (15%)' },
                          { level: 'Q', label: '高 (25%)' },
                          { level: 'H', label: '最高 (30%)' },
                        ].map((item) => (
                          <button
                            key={item.level}
                            onClick={() => setErrorLevel(item.level as ErrorCorrectionLevel)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                              errorLevel === item.level
                                ? 'bg-blue-500 text-white'
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                            }`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Colors */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          前景色
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={colorDark}
                            onChange={(e) => setColorDark(e.target.value)}
                            className="w-10 h-10 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={colorDark}
                            onChange={(e) => setColorDark(e.target.value)}
                            className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          背景色
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={colorLight}
                            onChange={(e) => setColorLight(e.target.value)}
                            className="w-10 h-10 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={colorLight}
                            onChange={(e) => setColorLight(e.target.value)}
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
                  {qrImage && (
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
                <div className="flex items-center justify-center bg-gray-50 dark:bg-slate-900 rounded-xl p-8 min-h-[300px]">
                  {qrImage ? (
                    <img src={qrImage} alt="QR Code" className="max-w-full" />
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
              使用说明
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">支持的内容类型</h3>
                <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li>文本内容（最多2000字符）</li>
                  <li>网址链接（自动识别）</li>
                  <li>邮箱地址（mailto:格式）</li>
                  <li>电话号码（tel:格式）</li>
                  <li>WiFi信息（WIFI:T:WPA;S:名称;P:密码;;）</li>
                  <li>名片信息（VCARD格式）</li>
                </ul>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">纠错级别说明</h3>
                <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><strong>L (低)</strong>：可被遮挡7%的数据</li>
                  <li><strong>M (中)</strong>：可被遮挡15%的数据</li>
                  <li><strong>Q (高)</strong>：可被遮挡25%的数据</li>
                  <li><strong>H (最高)</strong>：可被遮挡30%的数据</li>
                </ul>
                <p className="mt-2 text-sm text-slate-500">纠错级别越高，二维码越密集</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
