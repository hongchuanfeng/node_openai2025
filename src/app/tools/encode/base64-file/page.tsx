'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Copy, Check, RefreshCw, Info, AlertTriangle, HelpCircle, Upload, Download, FileText } from 'lucide-react';

type Mode = 'file-to-base64' | 'base64-to-file';

export default function Base64FilePage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<Mode>('file-to-base64');
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);

    if (mode === 'file-to-base64') {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        const base64 = result.split(',')[1] || result;
        setOutput(base64);
        setInput(file.name);
      };
      reader.readAsDataURL(file);
    } else {
      setInput(file.name);
    }
  };

  const handleTextToFile = () => {
    if (mode === 'base64-to-file' && input.trim()) {
      try {
        const binary = atob(input);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        const blob = new Blob([bytes]);
        const url = URL.createObjectURL(blob);
        setDownloadUrl(url);
        setOutput(`文件已准备就绪: ${fileName || 'output'}`);
        setError('');
      } catch (err) {
        setError('无效的Base64字符串');
        setOutput('');
        setDownloadUrl(null);
      }
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(mode === 'file-to-base64' ? output : output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
    setFileName('');
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(null);
    }
  };

  const handleDownload = () => {
    if (!downloadUrl) return;
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = fileName || 'output';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    handleClear();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-purple-900/20 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Base64/文件互转工具
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              文件与Base64编码之间的相互转换，支持任意类型的文件
            </p>
          </div>
        </section>

        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center mb-6">
              <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
                <button
                  onClick={() => handleModeChange('file-to-base64')}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${
                    mode === 'file-to-base64'
                      ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  文件 → Base64
                </button>
                <button
                  onClick={() => handleModeChange('base64-to-file')}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${
                    mode === 'base64-to-file'
                      ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  Base64 → 文件
                </button>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-lg font-semibold text-slate-900 dark:text-white">
                    {mode === 'file-to-base64' ? '上传文件' : '输入Base64字符串'}
                  </label>
                  <button
                    onClick={handleClear}
                    className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1"
                  >
                    <RefreshCw className="w-4 h-4" />
                    清空
                  </button>
                </div>

                {mode === 'file-to-base64' ? (
                  <div className="space-y-4">
                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-slate-300 dark:border-slate-600 border-dashed rounded-xl cursor-pointer bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-12 h-12 text-slate-400 mb-4" />
                        <p className="mb-2 text-sm text-slate-500">
                          <span className="font-semibold">点击上传文件</span>
                        </p>
                        <p className="text-xs text-slate-500">
                          支持任意文件类型
                        </p>
                      </div>
                      <input
                        type="file"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                    {fileName && (
                      <div className="flex items-center gap-2 p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                        <FileText className="w-5 h-5 text-blue-500" />
                        <span className="text-sm text-slate-700 dark:text-slate-300 truncate">
                          {fileName}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="请粘贴Base64字符串..."
                    className="w-full h-64 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
                  />
                )}

                {mode === 'base64-to-file' && (
                  <div className="mt-4 space-y-4">
                    <input
                      type="text"
                      value={fileName}
                      onChange={(e) => setFileName(e.target.value)}
                      placeholder="输入文件名（如 example.png）"
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={handleTextToFile}
                      className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all"
                    >
                      生成文件
                    </button>
                  </div>
                )}
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-lg font-semibold text-slate-900 dark:text-white">
                    {mode === 'file-to-base64' ? 'Base64结果' : '文件预览'}
                  </label>
                  <button
                    onClick={handleCopy}
                    className={`text-sm flex items-center gap-1 transition-colors ${
                      copied
                        ? 'text-green-600'
                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                  >
                    {copied ? <><Check className="w-4 h-4" /> 已复制</> : <><Copy className="w-4 h-4" /> 复制</>}
                  </button>
                </div>
                <textarea
                  value={error || output}
                  readOnly
                  placeholder={mode === 'file-to-base64' ? 'Base64编码结果将在此显示...' : '文件预览将在此显示...'}
                  className={`w-full h-64 p-4 rounded-xl border resize-none font-mono text-sm ${
                    error
                      ? 'border-red-300 bg-red-50 dark:bg-red-900/20 text-red-600'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white'
                  }`}
                />
                {mode === 'file-to-base64' && output && (
                  <button
                    onClick={handleCopy}
                    className="mt-4 w-full py-2 px-4 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    复制Base64
                  </button>
                )}
                {downloadUrl && (
                  <button
                    onClick={handleDownload}
                    className="mt-4 w-full py-2 px-4 bg-green-500 text-white font-medium rounded-xl hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    下载文件
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="py-8 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-500" />
              示例说明
            </h2>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">使用场景</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-600 dark:text-slate-400">
                <div className="space-y-2">
                  <h4 className="font-medium text-slate-900 dark:text-white">文件 → Base64</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>在小程序或网页中嵌入图片</li>
                    <li>将文件数据存储在JSON中</li>
                    <li>通过URL参数传递小文件</li>
                    <li>将文件内容粘贴到代码中</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-slate-900 dark:text-white">Base64 → 文件</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>还原通过Base64传输的文件</li>
                    <li>从JSON数据中提取文件</li>
                    <li>解码内嵌的资源文件</li>
                    <li>恢复损坏的文件内容</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              注意事项
            </h2>
            <ul className="space-y-3 text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                Base64编码会增加约33%的数据大小，大文件转换后可能很长
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                本工具在浏览器本地处理，不会上传您的文件到服务器
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                建议仅对小文件（如图片、小型配置文件）使用Base64编码
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                下载文件时，请确保文件名包含正确的扩展名
              </li>
            </ul>
          </div>
        </section>

        <section className="py-8 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <button
              className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white mb-6"
            >
              <HelpCircle className="w-5 h-5 text-purple-500" />
              常见问题
              <span className="text-sm font-normal text-slate-500">(展开)</span>
            </button>
            <div className="space-y-4">
              {[
                { q: 'Base64编码后文件变大了？', a: '是的，Base64编码会使数据量增加约33%。这是因为它使用64个可打印字符来表示二进制数据，每个Base64字符只能表示6位信息。' },
                { q: '我的文件安全吗？', a: '完全安全。所有转换操作都在您的浏览器本地完成，文件不会上传到任何服务器。' },
                { q: '为什么下载的文件名需要手动输入？', a: '因为Base64字符串本身不包含文件名信息，所以需要您手动指定要恢复的文件名和扩展名。' },
              ].map((faq, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4"
                >
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                    Q: {faq.q}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    A: {faq.a}
                  </p>
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
