'use client';

import { useState, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Upload, Download, FileSpreadsheet, ImageIcon } from 'lucide-react';
import ExcelJS from 'exceljs';

export default function ImageToExcelPage() {
  const [image, setImage] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageName(file.name.replace(/\.[^/.]+$/, ''));
    
    const reader = new FileReader();
    reader.onload = ev => {
      const result = ev.target?.result as string;
      setImage(result);
      
      // 获取图片尺寸
      const img = new window.Image();
      img.onload = () => {
        setImageSize({ width: img.width, height: img.height });
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  }, []);

  const downloadExcel = async () => {
    if (!image) return;
    setLoading(true);

    try {
      const workbook = new ExcelJS.Workbook();
      workbook.creator = 'Image Tool';
      workbook.created = new Date();

      // 创建多个工作表
      const sheet1 = workbook.addWorksheet('Sheet1');
      const sheet2 = workbook.addWorksheet('Sheet2');
      const sheet3 = workbook.addWorksheet('Sheet3');

      // 在 Sheet1 中添加标题
      sheet1.getCell('A1').value = '图片预览';
      sheet1.getCell('A1').font = { size: 16, bold: true };
      sheet1.getCell('A1').alignment = { horizontal: 'center' };
      sheet1.mergeCells('A1:D1');

      // 将 base64 图片添加到工作簿
      const base64Data = image.split(',')[1];
      const extension = image.match(/data:image\/([^;]+)/)?.[1] || 'png';
      const mimeType = `image/${extension === 'jpeg' ? 'jpeg' : extension}`;

      // 添加图片到工作簿
      const imageId = workbook.addImage({
        base64: base64Data,
        extension: (extension === 'jpeg' || extension === 'png' || extension === 'gif') 
          ? extension 
          : 'png',
      });

      // 将图片添加到 Sheet1，从 A3 开始
      sheet1.addImage(imageId, {
        tl: { col: 0, row: 2 },
        ext: {
          width: imageSize.width > 0 ? Math.min(imageSize.width, 600) : 300,
          height: imageSize.height > 0 ? Math.min(imageSize.height, 400) : 200,
        },
        editAs: 'oneCell',
      });

      // 在 Sheet2 中添加信息
      sheet2.getCell('A1').value = '图片信息';
      sheet2.getCell('A1').font = { size: 14, bold: true };
      sheet2.getCell('A2').value = '文件名：';
      sheet2.getCell('B2').value = imageName || '未命名';
      sheet2.getCell('A3').value = '尺寸：';
      sheet2.getCell('B3').value = `${imageSize.width} × ${imageSize.height} px`;
      sheet2.getCell('A4').value = '格式：';
      sheet2.getCell('B4').value = extension.toUpperCase();

      // Sheet3 添加说明
      sheet3.getCell('A1').value = '使用说明';
      sheet3.getCell('A1').font = { size: 14, bold: true };
      sheet3.getCell('A2').value = '1. Sheet1 中可以看到嵌入的图片';
      sheet3.getCell('A3').value = '2. 图片可以拖动调整位置';
      sheet3.getCell('A4').value = '3. 可以通过拖动边框调整图片大小';

      // 生成文件
      const buffer = await workbook.xlsx.writeBuffer();
      
      // 创建 Blob 并下载
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${imageName || 'image'}.xlsx`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('生成Excel失败:', error);
      alert('生成Excel失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-emerald-200 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <FileSpreadsheet className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">图片转Excel</h1>
            </div>
            <p className="text-emerald-100 text-lg">将图片嵌入到Excel文件中</p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-6">上传图片</h3>
                  <label className="block w-full aspect-video rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors overflow-hidden">
                    {image ? (
                      <img src={image} alt="Preview" className="w-full h-full object-contain" />
                    ) : (
                      <>
                        <Upload className="w-12 h-12 text-slate-300 mb-3" />
                        <p className="text-slate-400 text-sm">点击上传图片</p>
                        <p className="text-slate-300 text-xs mt-1">支持 JPG、PNG、GIF、WebP</p>
                      </>
                    )}
                    <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                  </label>

                  {imageSize.width > 0 && (
                    <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 text-sm text-slate-600 dark:text-slate-400">
                      图片尺寸：{imageSize.width} × {imageSize.height} px
                    </div>
                  )}
                </div>

                <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-3">工作表说明</h4>
                  <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                    <p><strong>Sheet1</strong>：包含嵌入的图片</p>
                    <p><strong>Sheet2</strong>：图片信息（文件名、尺寸、格式）</p>
                    <p><strong>Sheet3</strong>：使用说明</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-6">生成Excel</h3>
                  
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 mb-6">
                    <div className="flex items-start gap-3">
                      <ImageIcon className="w-8 h-8 text-green-500 mt-1" />
                      <div>
                        <p className="font-medium text-slate-700 dark:text-slate-300 mb-1">图片嵌入模式</p>
                        <p className="text-sm text-slate-500">
                          图片将以对象形式插入到 Excel 中，可以在 Excel 中调整位置和大小。
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={downloadExcel}
                    disabled={!image || loading}
                    className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>处理中...</>
                    ) : (
                      <>
                        <Download className="w-5 h-5" />
                        下载 Excel 文件
                      </>
                    )}
                  </button>

                  <div className="mt-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20">
                    <h4 className="font-medium text-emerald-800 dark:text-emerald-300 mb-2">生成结果</h4>
                    <ul className="text-sm text-emerald-700 dark:text-emerald-400 space-y-1">
                      <li>• Excel 文件包含 3 个工作表</li>
                      <li>• Sheet1 包含嵌入的图片</li>
                      <li>• 可用 Excel/WPS 打开编辑</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-3">使用说明</h4>
                  <ul className="space-y-2 text-sm text-slate-500">
                    <li>1. 上传任意格式的图片</li>
                    <li>2. 点击下载生成 Excel 文件</li>
                    <li>3. 用 Excel/WPS 打开</li>
                    <li>4. 在 Sheet1 中查看嵌入的图片</li>
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