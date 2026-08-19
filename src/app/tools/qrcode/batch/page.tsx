'use client';

import { useState, useRef, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import QRCode from 'qrcode';
import JsBarcode from 'jsbarcode';
import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import { Download, Plus, Trash2, Copy, Check, Info, FileDown, QrCode, Barcode, Upload, File, X, Package } from 'lucide-react';

type CodeType = 'qrcode' | 'barcode';
type BarcodeFormat = 'CODE128' | 'CODE39' | 'EAN13' | 'EAN8';

interface BatchItem {
  id: string;
  content: string;
  lines: string[];
  type: CodeType;
  barcodeFormat?: BarcodeFormat;
  previews: string[];
  status: 'pending' | 'generating' | 'done' | 'error';
  errorMsg?: string;
}

export default function BatchGenerator() {
  const [items, setItems] = useState<BatchItem[]>([
    { id: '1', content: '', lines: [], type: 'qrcode', previews: [], status: 'pending' }
  ]);
  const [size, setSize] = useState(128);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const qrCanvasRefs = useRef<Map<string, HTMLCanvasElement>>(new Map());
  const barcodeCanvasRefs = useRef<Map<string, HTMLCanvasElement>>(new Map());
  const subCanvasRefs = useRef<Map<string, HTMLCanvasElement>>(new Map());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addItem = () => {
    setItems(prev => [
      ...prev,
      { id: Date.now().toString(), content: '', lines: [], type: 'qrcode', previews: [], status: 'pending' }
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length <= 1) return;
    setItems(prev => prev.filter(item => item.id !== id));
    qrCanvasRefs.current.delete(id);
    barcodeCanvasRefs.current.delete(id);
    subCanvasRefs.current.delete(id);
  };

  const updateItem = (id: string, updates: Partial<BatchItem>) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const newItem = { ...item, ...updates };
        if (updates.content !== undefined) {
          newItem.lines = updates.content.split('\n').filter(line => line.trim());
          newItem.status = 'pending';
        }
        if (updates.type !== undefined) {
          newItem.previews = [];
        }
        return newItem;
      }
      return item;
    }));
  };

  const parseFileContent = (content: string): string[] => {
    const lines = content.split(/\r?\n/).filter(line => line.trim());
    return lines.map(line => {
      const trimmed = line.trim();
      const commaIndex = trimmed.indexOf(',');
      if (commaIndex !== -1) {
        const afterComma = trimmed.substring(commaIndex + 1).trim();
        if (afterComma) return afterComma;
      }
      const tabIndex = trimmed.indexOf('\t');
      if (tabIndex !== -1) {
        const afterTab = trimmed.substring(tabIndex + 1).trim();
        if (afterTab) return afterTab;
      }
      return trimmed;
    }).filter(Boolean);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const ext = file.name.split('.').pop()?.toLowerCase();
      let contents: string[] = [];

      if (ext === 'txt' || ext === 'csv') {
        const text = await file.text();
        contents = parseFileContent(text);
      } else if (ext === 'xlsx' || ext === 'xls') {
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as (string | number | null)[][];
        contents = jsonData
          .flat()
          .filter(cell => cell !== null && cell !== undefined && String(cell).trim())
          .map(cell => String(cell).trim());
      }

      if (contents.length === 0) {
        alert('文件中没有找到有效数据');
        return;
      }

      const newItems: BatchItem[] = contents.map((content, index) => ({
        id: `file-${Date.now()}-${index}`,
        content,
        lines: content.split('\n').filter(line => line.trim()),
        type: 'qrcode' as CodeType,
        previews: [],
        status: 'pending' as const,
      }));

      setItems(newItems);
    } catch (error) {
      console.error('文件解析错误:', error);
      alert('文件解析失败，请检查文件格式');
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const generateAll = async () => {
    setGenerating(true);
    const itemsWithContent = items.filter(item => item.lines.length > 0);

    for (const item of itemsWithContent) {
      updateItem(item.id, { status: 'generating', previews: [] });
      const newPreviews: string[] = [];

      try {
        for (let i = 0; i < item.lines.length; i++) {
          const lineContent = item.lines[i];
          let dataUrl = '';

          if (item.type === 'qrcode') {
            let canvas = subCanvasRefs.current.get(`${item.id}-${i}`);
            if (!canvas) {
              canvas = document.createElement('canvas');
              subCanvasRefs.current.set(`${item.id}-${i}`, canvas);
            }
            await QRCode.toCanvas(canvas, lineContent, {
              width: size,
              margin: 1,
            });
            dataUrl = canvas.toDataURL('image/png');
          } else {
            let canvas = subCanvasRefs.current.get(`${item.id}-${i}`);
            if (!canvas) {
              canvas = document.createElement('canvas');
              subCanvasRefs.current.set(`${item.id}-${i}`, canvas);
            }
            JsBarcode(canvas, lineContent, {
              format: item.barcodeFormat || 'CODE128',
              width: 2,
              height: 40,
              displayValue: true,
              margin: 5,
            });
            dataUrl = canvas.toDataURL('image/png');
          }

          newPreviews.push(dataUrl);
        }

        updateItem(item.id, { previews: newPreviews, status: 'done' });
      } catch (err) {
        updateItem(item.id, { status: 'error', errorMsg: '生成失败' });
      }
    }
    setGenerating(false);
  };

  const handleCopy = async (preview: string) => {
    const res = await fetch(preview);
    const blob = await res.blob();
    await navigator.clipboard.write([
      new ClipboardItem({ 'image/png': blob })
    ]);
    setCopied(preview);
    setTimeout(() => setCopied(null), 2000);
  };

  const downloadAll = () => {
    let downloadIndex = 0;
    items.forEach((item) => {
      if (item.previews) {
        item.previews.forEach((preview, i) => {
          const link = document.createElement('a');
          link.download = `${item.type === 'qrcode' ? 'qrcode' : 'barcode'}-${downloadIndex + 1}-${i + 1}.png`;
          link.href = preview;
          link.click();
          downloadIndex++;
        });
      }
    });
  };

  const downloadAsZip = async () => {
    setDownloading(true);
    try {
      const zip = new JSZip();
      let fileIndex = 0;
      const generatedItems = items.filter(item => item.previews && item.previews.length > 0);

      if (generatedItems.length === 0) {
        alert('没有已生成的图片');
        return;
      }

      generatedItems.forEach((item) => {
        item.previews.forEach((preview, i) => {
          const base64Data = preview.split(',')[1];
          const fileName = `${item.type === 'qrcode' ? 'qrcode' : 'barcode'}-${fileIndex + 1}-${i + 1}.png`;
          zip.file(fileName, base64Data, { base64: true });
          fileIndex++;
        });
      });

      const blob = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `codes-${Date.now()}.zip`;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('打包下载失败:', error);
      alert('打包下载失败');
    }
    setDownloading(false);
  };

  const downloadSingle = (item: BatchItem, previewIndex: number) => {
    if (item.previews && item.previews[previewIndex]) {
      const link = document.createElement('a');
      link.download = `${item.type === 'qrcode' ? 'qrcode' : 'barcode'}-${item.id}-${previewIndex + 1}.png`;
      link.href = item.previews[previewIndex];
      link.click();
    }
  };

  const downloadItemAll = (item: BatchItem) => {
    if (item.previews) {
      item.previews.forEach((preview, i) => {
        const link = document.createElement('a');
        link.download = `${item.type === 'qrcode' ? 'qrcode' : 'barcode'}-${item.id}-${i + 1}.png`;
        link.href = preview;
        link.click();
      });
    }
  };

  const handleClearAll = () => {
    setItems([{ id: '1', content: '', lines: [], type: 'qrcode', previews: [], status: 'pending' }]);
    qrCanvasRefs.current.clear();
    barcodeCanvasRefs.current.clear();
    subCanvasRefs.current.clear();
  };

  const handleClearGenerated = () => {
    setItems(prev => prev.map(item => ({
      ...item,
      previews: [],
      status: 'pending' as const,
    })));
  };

  const hasGenerated = items.some(item => item.previews && item.previews.length > 0);
  const hasContent = items.some(item => item.lines.length > 0);
  const generatedCount = items.reduce((sum, item) => sum + (item.previews?.length || 0), 0);
  const totalCount = items.reduce((sum, item) => sum + item.lines.length, 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-purple-900/20 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              批量生成二维码/条形码
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              支持上传文本、CSV、Excel文件批量生成，打包下载
            </p>
          </div>
        </section>

        {/* Tool Section */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Settings Bar */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 mb-6">
              <div className="flex flex-wrap items-center gap-4">
                {/* File Upload */}
                <div className="flex items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".txt,.csv,.xlsx,.xls"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    上传文件
                  </button>
                  <span className="text-xs text-slate-500">支持 .txt, .csv, .xlsx</span>
                </div>

                {/* Size Control */}
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    尺寸: {size}px
                  </label>
                  <input
                    type="range"
                    min="64"
                    max="256"
                    step="32"
                    value={size}
                    onChange={(e) => setSize(Number(e.target.value))}
                    className="w-28"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-2 ml-auto">
                  <button
                    onClick={addItem}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    添加
                  </button>
                  <button
                    onClick={handleClearAll}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    清空
                  </button>
                  {hasGenerated && (
                    <button
                      onClick={handleClearGenerated}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      清除结果
                    </button>
                  )}
                  <button
                    onClick={generateAll}
                    disabled={generating || !hasContent}
                    className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <QrCode className="w-4 h-4" />
                    {generating ? `生成中 (${generatedCount}/${totalCount})` : '全部生成'}
                  </button>
                  {hasGenerated && (
                    <>
                      <button
                        onClick={downloadAll}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      >
                        <FileDown className="w-4 h-4" />
                        下载全部
                      </button>
                      <button
                        onClick={downloadAsZip}
                        disabled={downloading}
                        className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50"
                      >
                        <Package className="w-4 h-4" />
                        {downloading ? '打包中...' : '打包下载'}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <File className="w-4 h-4" />
                  总条目: <span className="font-semibold text-slate-900 dark:text-white">{totalCount}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <Check className="w-4 h-4 text-green-500" />
                  已生成: <span className="font-semibold text-green-600 dark:text-green-400">{generatedCount}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <QrCode className="w-4 h-4" />
                  二维码: <span className="font-semibold text-slate-900 dark:text-white">{items.filter(i => i.type === 'qrcode').reduce((sum, i) => sum + i.lines.length, 0)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <Barcode className="w-4 h-4" />
                  条形码: <span className="font-semibold text-slate-900 dark:text-white">{items.filter(i => i.type === 'barcode').reduce((sum, i) => sum + i.lines.length, 0)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <Package className="w-4 h-4" />
                  卡片: <span className="font-semibold text-slate-900 dark:text-white">{items.length}</span>
                </div>
              </div>
            </div>

            {/* Items Grid */}
            <div className="grid gap-4 mx-auto">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className={`bg-white dark:bg-slate-800 rounded-2xl border p-6 transition-all ${
                    item.status === 'error'
                      ? 'border-red-300 dark:border-red-700'
                      : item.status === 'done'
                      ? 'border-green-300 dark:border-green-700'
                      : item.status === 'generating'
                      ? 'border-blue-300 dark:border-blue-700 animate-pulse'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-base font-medium text-slate-500">
                      #{index + 1}
                      {item.status === 'done' && <span className="ml-2 text-green-500">✓</span>}
                      {item.status === 'error' && <span className="ml-2 text-red-500">✗</span>}
                      {item.status === 'generating' && <span className="ml-2 text-blue-500">...</span>}
                    </span>
                    <button
                      onClick={() => removeItem(item.id)}
                      disabled={items.length <= 1}
                      className="text-slate-400 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Type Selector */}
                  <div className="flex gap-3 mb-4">
                    <button
                      onClick={() => updateItem(item.id, { type: 'qrcode' })}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-base font-medium transition-colors ${
                        item.type === 'qrcode'
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <QrCode className="w-5 h-5" />
                      二维码
                    </button>
                    <button
                      onClick={() => updateItem(item.id, { type: 'barcode', barcodeFormat: 'CODE128' })}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-base font-medium transition-colors ${
                        item.type === 'barcode'
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <Barcode className="w-5 h-5" />
                      条形码
                    </button>
                  </div>

                  {/* Barcode Format Selector */}
                  {item.type === 'barcode' && (
                    <select
                      value={item.barcodeFormat || 'CODE128'}
                      onChange={(e) => updateItem(item.id, { barcodeFormat: e.target.value as BarcodeFormat })}
                      className="w-full mb-4 px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-base"
                    >
                      <option value="CODE128">CODE128</option>
                      <option value="CODE39">CODE39</option>
                      <option value="EAN13">EAN-13</option>
                      <option value="EAN8">EAN-8</option>
                    </select>
                  )}

                  {/* Content Input */}
                  <textarea
                    value={item.content}
                    onChange={(e) => updateItem(item.id, { content: e.target.value })}
                    placeholder={item.type === 'qrcode' ? '每行一个内容...' : '每行一个数字...'}
                    className="w-full h-28 p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-base resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="text-xs text-slate-500 mt-1">共 {item.lines.length} 行</div>

                  {/* Error Message */}
                  {item.status === 'error' && (
                    <div className="mt-3 text-sm text-red-500">{item.errorMsg || '生成失败'}</div>
                  )}

                  {/* Preview */}
                  <div className="mt-4 flex flex-col gap-2 bg-gray-50 dark:bg-slate-900 rounded-lg p-4 min-h-[100px]">
                    {item.status === 'generating' ? (
                      <div className="flex items-center gap-3 text-blue-500 justify-center py-4">
                        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        <span className="text-base">生成中...</span>
                      </div>
                    ) : item.previews && item.previews.length > 0 ? (
                      <div className="space-y-2">
                        {item.previews.map((preview, i) => (
                          <div key={i} className="relative group flex justify-center bg-white rounded-lg p-2">
                            <img
                              src={preview}
                              alt={`Preview ${i + 1}`}
                              className="max-h-32"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-lg">
                              <button
                                onClick={() => handleCopy(preview)}
                                className="p-2 bg-white rounded-lg hover:bg-gray-100"
                                title="复制"
                              >
                                {copied === preview ? (
                                  <Check className="w-5 h-5 text-green-500" />
                                ) : (
                                  <Copy className="w-5 h-5" />
                                )}
                              </button>
                              <button
                                onClick={() => downloadSingle(item, i)}
                                className="p-2 bg-white rounded-lg hover:bg-gray-100"
                                title="下载"
                              >
                                <Download className="w-5 h-5" />
                              </button>
                            </div>
                            <span className="absolute top-1 left-2 text-xs text-slate-400">#{i + 1}</span>
                          </div>
                        ))}
                        <div className="flex justify-center pt-2">
                          <button
                            onClick={() => downloadItemAll(item)}
                            className="flex items-center gap-1 px-3 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-800"
                          >
                            <FileDown className="w-3 h-3" />
                            下载全部
                          </button>
                        </div>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-base text-center py-4">
                        {item.lines.length > 0 ? '点击生成预览' : '输入内容'}
                      </span>
                    )}
                  </div>

                  {/* Hidden canvas for generation */}
                  <canvas
                    ref={(el) => {
                      if (el) qrCanvasRefs.current.set(item.id, el);
                    }}
                    style={{ display: 'none' }}
                  />
                  <canvas
                    ref={(el) => {
                      if (el) barcodeCanvasRefs.current.set(item.id, el);
                    }}
                    style={{ display: 'none' }}
                  />
                </div>
              ))}
            </div>
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
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">批量操作</h3>
                <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li>1. 点击"上传文件"导入 TXT、CSV、Excel 表格</li>
                  <li>2. 文件内容会自动填充到列表中</li>
                  <li>3. 可手动添加或删除项目，调整类型</li>
                  <li>4. 点击"全部生成"一键生成所有码</li>
                  <li>5. 使用"打包下载"获取 ZIP 压缩包</li>
                </ul>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">文件格式说明</h3>
                <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><strong>TXT:</strong> 每行一个内容</li>
                  <li><strong>CSV:</strong> 取每行第二个字段作为内容</li>
                  <li><strong>Excel:</strong> 取所有非空单元格作为内容</li>
                  <li>条形码仅支持数字内容</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
