'use client';

import { useState, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Upload, Camera, Info, AlertCircle } from 'lucide-react';

interface ExifData {
  Make?: string;
  Model?: string;
  DateTime?: string;
  ExposureTime?: string;
  FNumber?: string;
  ISOSpeedRatings?: string;
  FocalLength?: string;
  ImageWidth?: string;
  ImageHeight?: string;
  Orientation?: string;
  Software?: string;
  GPSLatitude?: string;
  GPSLongitude?: string;
}

export default function ExifViewerPage() {
  const [image, setImage] = useState<string | null>(null);
  const [exifData, setExifData] = useState<ExifData | null>(null);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');

  const readExif = async (file: File): Promise<ExifData> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const view = new DataView(e.target?.result as ArrayBuffer);
        const result: ExifData = {};
        
        // 检查 SOI 标记
        if (view.getUint16(0) !== 0xffd8) {
          resolve({});
          return;
        }
        
        let offset = 2;
        const length = view.byteLength;
        
        while (offset < length) {
          const marker = view.getUint16(offset);
          
          if (marker === 0xffe1) {
            // EXIF 标记
            const exifData = view.buffer.slice(offset + 4, offset + 4 + view.getUint32(offset + 2) - 2);
            const dataView = new DataView(exifData);
            
            // 检查 "Exif" 标识
            if (String.fromCharCode(dataView.getUint8(0), dataView.getUint8(1), dataView.getUint8(2), dataView.getUint8(3)) !== 'Exif') {
              resolve({});
              return;
            }
            
            const tiffOffset = 6;
            const littleEndian = dataView.getUint16(tiffOffset) === 0x4949;
            
            const getUint16 = (o: number) => dataView.getUint16(o, littleEndian);
            const getUint32 = (o: number) => dataView.getUint32(o, littleEndian);
            
            const ifdOffset = getUint32(tiffOffset + 4);
            const entries = getUint16(ifdOffset);
            
            for (let i = 0; i < entries; i++) {
              const entryOffset = ifdOffset + 2 + i * 12;
              const tag = getUint16(entryOffset);
              const type = getUint16(entryOffset + 2);
              const count = getUint32(entryOffset + 4);
              
              const getString = (offset: number, len: number) => {
                let s = '';
                for (let j = 0; j < len && j < 100; j++) {
                  const c = dataView.getUint8(offset + j);
                  if (c === 0) break;
                  s += String.fromCharCode(c);
                }
                return s;
              };
              
              switch (tag) {
                case 0x010f: // Make
                  result.Make = getString(entryOffset + 8, count);
                  break;
                case 0x0110: // Model
                  result.Model = getString(entryOffset + 8, count);
                  break;
                case 0x0132: // DateTime
                  result.DateTime = getString(entryOffset + 8, count);
                  break;
                case 0x829a: // ExposureTime
                  const expNum = dataView.getUint32(entryOffset + 8, littleEndian);
                  const expDen = dataView.getUint32(entryOffset + 12, littleEndian);
                  result.ExposureTime = expDen > 0 ? `${expNum / expDen}s` : `${expNum}s`;
                  break;
                case 0x829d: // FNumber
                  const fNum = dataView.getUint32(entryOffset + 8, littleEndian);
                  const fDen = dataView.getUint32(entryOffset + 12, littleEndian);
                  result.FNumber = `f/${fNum / fDen}`;
                  break;
                case 0x8827: // ISOSpeedRatings
                  result.ISOSpeedRatings = String(getUint16(entryOffset + 8));
                  break;
                case 0x920a: // FocalLength
                  const flNum = dataView.getUint32(entryOffset + 8, littleEndian);
                  const flDen = dataView.getUint32(entryOffset + 12, littleEndian);
                  result.FocalLength = `${flNum / flDen}mm`;
                  break;
                case 0xa002: // ImageWidth
                  result.ImageWidth = String(getUint32(entryOffset + 8));
                  break;
                case 0xa003: // ImageHeight
                  result.ImageHeight = String(getUint32(entryOffset + 8));
                  break;
                case 0x0112: // Orientation
                  result.Orientation = String(getUint16(entryOffset + 8));
                  break;
                case 0x0131: // Software
                  result.Software = getString(entryOffset + 8, count);
                  break;
              }
            }
            
            break;
          } else if ((marker & 0xff00) === 0xff00) {
            const length = view.getUint16(offset + 2);
            offset += 2 + length;
          } else {
            break;
          }
        }
        
        resolve(result);
      };
      
      reader.onerror = () => resolve({});
      reader.readAsArrayBuffer(file);
    });
  };

  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setFileName(file.name);
    setError('');
    
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImage(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
    
    try {
      const exif = await readExif(file);
      setExifData(exif);
    } catch {
      setError('无法读取 EXIF 信息');
    }
  }, []);

  const formatExifItem = (label: string, value: string | undefined, icon?: string) => {
    if (!value) return null;
    return (
      <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700 last:border-0">
        <span className="text-slate-600 dark:text-slate-400">{label}</span>
        <span className="font-medium text-slate-900 dark:text-white">{value}</span>
      </div>
    );
  };

  const getOrientationText = (o: string) => {
    const map: Record<string, string> = {
      '1': '正常',
      '2': '水平翻转',
      '3': '旋转180°',
      '4': '垂直翻转',
      '5': '顺时针90°+水平翻转',
      '6': '顺时针90°',
      '7': '逆时针90°+水平翻转',
      '8': '逆时针90°',
    };
    return map[o] || o;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-teal-600 via-cyan-600 to-blue-600 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-teal-200 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Camera className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">查看EXIF信息</h1>
            </div>
            <p className="text-teal-100 text-lg">读取照片的拍摄参数和元数据</p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 mb-8">
              <h3 className="font-bold text-slate-900 dark:text-white mb-6">上传照片</h3>
              <label className="block w-full aspect-video rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                {image ? (
                  <img src={image} alt="Preview" className="w-full h-full object-contain rounded-xl" />
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-slate-300 mb-3" />
                    <p className="text-slate-400 text-sm">点击上传照片（支持JPEG）</p>
                  </>
                )}
                <input type="file" accept="image/jpeg,image/jpg" onChange={handleUpload} className="hidden" />
              </label>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 flex items-center gap-3 mb-8">
                <AlertCircle className="w-5 h-5 shrink-0" />
                {error}
              </div>
            )}

            {exifData && Object.keys(exifData).length > 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8">
                <h3 className="font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                  <Info className="w-5 h-5 text-teal-500" />
                  EXIF 信息
                </h3>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-sm font-medium text-slate-500 mb-3 uppercase tracking-wider">相机信息</h4>
                    <div className="space-y-1">
                      {formatExifItem('品牌', exifData.Make)}
                      {formatExifItem('型号', exifData.Model)}
                      {formatExifItem('软件', exifData.Software)}
                      {formatExifItem('方向', getOrientationText(exifData.Orientation || ''))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-slate-500 mb-3 uppercase tracking-wider">拍摄参数</h4>
                    <div className="space-y-1">
                      {formatExifItem('快门速度', exifData.ExposureTime)}
                      {formatExifItem('光圈', exifData.FNumber)}
                      {formatExifItem('ISO', exifData.ISOSpeedRatings)}
                      {formatExifItem('焦距', exifData.FocalLength)}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-slate-500 mb-3 uppercase tracking-wider">图像信息</h4>
                    <div className="space-y-1">
                      {formatExifItem('宽度', exifData.ImageWidth ? `${exifData.ImageWidth} px` : undefined)}
                      {formatExifItem('高度', exifData.ImageHeight ? `${exifData.ImageHeight} px` : undefined)}
                      {formatExifItem('拍摄时间', exifData.DateTime)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {exifData && Object.keys(exifData).length === 0 && image && (
              <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 text-center">
                <p className="text-slate-500">未检测到 EXIF 信息</p>
                <p className="text-sm text-slate-400 mt-2">可能是图片格式不支持或已被压缩处理</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
