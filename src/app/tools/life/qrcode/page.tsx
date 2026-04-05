'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Copy, Check, Download, Upload, RefreshCw } from 'lucide-react';

export default function QRCodePage() {
  const [input, setInput] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [size, setSize] = useState(200);
  const [error, setError] = useState('');

  const generateQRCode = () => {
    if (!input.trim()) {
      setError('请输入内容');
      return;
    }
    setError('');
    const encoded = encodeURIComponent(input);
    setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}`);
  };

  const handleDownload = async () => {
    if (!qrCodeUrl) return;
    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'qrcode.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch {
      setError('下载失败');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-purple-900/20 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              二维码生成
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              将文本、网址等内容生成二维码图片
            </p>
          </div>
        </section>

        <section className="py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                <label className="block text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  输入内容
                </label>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="请输入需要生成二维码的内容（文本、网址等）..."
                  className="w-full h-40 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />

                <div className="mt-4">
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                    二维码尺寸：{size}x{size}像素
                  </label>
                  <input
                    type="range"
                    min={100}
                    max={400}
                    step={50}
                    value={size}
                    onChange={(e) => setSize(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <button
                  onClick={generateQRCode}
                  className="mt-6 w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all"
                >
                  生成二维码
                </button>

                {error && (
                  <p className="mt-4 text-red-500 text-sm text-center">{error}</p>
                )}
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 flex flex-col items-center justify-center">
                <label className="block text-lg font-semibold text-slate-900 dark:text-white mb-4 self-start">
                  二维码预览
                </label>
                <div className="flex-1 flex items-center justify-center bg-white rounded-xl p-4 min-h-[200px]">
                  {qrCodeUrl ? (
                    <img
                      src={qrCodeUrl}
                      alt="二维码"
                      className="max-w-full max-h-full"
                    />
                  ) : (
                    <p className="text-slate-400">二维码将在此显示</p>
                  )}
                </div>
                {qrCodeUrl && (
                  <button
                    onClick={handleDownload}
                    className="mt-4 flex items-center gap-2 px-6 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    下载二维码
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="py-8 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">使用场景</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { title: '网址分享', desc: '将网址转换为二维码，方便手机扫码访问' },
                { title: '联系方式', desc: '生成包含电话、邮箱等联系方式的二维码' },
                { title: '文本信息', desc: '将短文本加密成二维码传递信息' },
              ].map((item, i) => (
                <div key={i} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
