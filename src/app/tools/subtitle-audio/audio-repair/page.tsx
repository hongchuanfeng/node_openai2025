'use client';

import { useState, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Upload, Wrench, Download, Loader2, AlertCircle, Info, FileAudio } from 'lucide-react';

export default function AudioRepairPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [options, setOptions] = useState({
    normalize: true,
    denoise: true,
    adjustVolume: false,
  });

  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files?.[0];
    if (uploaded) {
      setFile(uploaded);
      setAudioUrl(URL.createObjectURL(uploaded));
      setResultUrl(null);
      setError(null);
    }
  }, []);

  const repair = useCallback(async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const audioContext = new AudioContext();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      const processedBuffer = await processAudio(audioBuffer, audioContext, options);

      const wav = encodeWav(processedBuffer);
      const blob = new Blob([wav], { type: 'audio/wav' });
      setResultUrl(URL.createObjectURL(blob));
    } catch (err) {
      setError('修复失败: ' + (err instanceof Error ? err.message : '未知错误'));
    }

    setLoading(false);
  }, [file, options]);

  const processAudio = async (
    buffer: AudioBuffer,
    ctx: AudioContext,
    opts: typeof options
  ): Promise<AudioBuffer> => {
    let processed = buffer;

    if (opts.normalize || opts.adjustVolume) {
      let maxVal = 0;
      for (let ch = 0; ch < buffer.numberOfChannels; ch++) {
        const data = buffer.getChannelData(ch);
        for (let i = 0; i < data.length; i++) {
          maxVal = Math.max(maxVal, Math.abs(data[i]));
        }
      }

      if (maxVal > 0 && (opts.normalize || opts.adjustVolume)) {
        const targetPeak = 0.95;
        const gain = targetPeak / maxVal;
        const outBuffer = ctx.createBuffer(buffer.numberOfChannels, buffer.length, buffer.sampleRate);
        for (let ch = 0; ch < buffer.numberOfChannels; ch++) {
          const inData = buffer.getChannelData(ch);
          const outData = outBuffer.getChannelData(ch);
          for (let i = 0; i < inData.length; i++) {
            outData[i] = inData[i] * gain;
          }
        }
        processed = outBuffer;
      }
    }

    if (opts.denoise) {
      const outBuffer = ctx.createBuffer(processed.numberOfChannels, processed.length, processed.sampleRate);
      for (let ch = 0; ch < processed.numberOfChannels; ch++) {
        const inData = processed.getChannelData(ch);
        const outData = outBuffer.getChannelData(ch);

        const windowSize = 64;
        const threshold = 0.01;

        for (let i = 0; i < inData.length; i++) {
          let sum = 0;
          let count = 0;
          for (let w = -windowSize; w <= windowSize; w++) {
            const idx = i + w;
            if (idx >= 0 && idx < inData.length) {
              sum += inData[idx] * inData[idx];
              count++;
            }
          }
          const energy = Math.sqrt(sum / count);
          if (energy < threshold) {
            outData[i] = inData[i] * (energy / threshold);
          } else {
            outData[i] = inData[i];
          }
        }
        processed = outBuffer;
      }
    }

    return processed;
  };

  const encodeWav = (audioBuffer: AudioBuffer): ArrayBuffer => {
    const numChannels = audioBuffer.numberOfChannels;
    const sampleRate = audioBuffer.sampleRate;
    const bitsPerSample = 16;
    const bytesPerSample = bitsPerSample / 8;
    const blockAlign = numChannels * bytesPerSample;
    const dataSize = audioBuffer.length * blockAlign;
    const buffer = new ArrayBuffer(44 + dataSize);
    const view = new DataView(buffer);

    const writeStr = (offset: number, str: string) => {
      for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
    };

    writeStr(0, 'RIFF');
    view.setUint32(4, 36 + dataSize, true);
    writeStr(8, 'WAVE');
    writeStr(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * blockAlign, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitsPerSample, true);
    writeStr(36, 'data');
    view.setUint32(40, dataSize, true);

    let pos = 44;
    for (let i = 0; i < audioBuffer.length; i++) {
      for (let ch = 0; ch < numChannels; ch++) {
        const s = Math.max(-1, Math.min(1, audioBuffer.getChannelData(ch)[i]));
        view.setInt16(pos, s < 0 ? s * 0x8000 : s * 0x7fff, true);
        pos += 2;
      }
    }

    return buffer;
  };

  const downloadResult = () => {
    if (!resultUrl) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = file?.name.replace(/\.[^.]+$/, '') + '_repaired.wav' || 'repaired.wav';
    a.click();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
      <Header />

      <main className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-indigo-500 flex items-center justify-center">
                <Wrench className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">音频修复</h1>
                <p className="text-slate-500 dark:text-slate-400">修复音频的音量、去噪等基础问题</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  上传音频文件
                </label>
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center hover:border-indigo-500 transition-colors">
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleUpload}
                    className="hidden"
                    id="audio-repair-upload"
                  />
                  <label htmlFor="audio-repair-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                    <p className="text-slate-600 dark:text-slate-400">
                      点击上传需要修复的音频文件
                    </p>
                  </label>
                </div>
              </div>

              {audioUrl && (
                <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FileAudio className="w-4 h-4 text-indigo-500" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">{file?.name}</span>
                  </div>
                  <audio controls src={audioUrl} className="w-full" />
                </div>
              )}

              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  修复选项
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.normalize}
                      onChange={(e) => setOptions((prev) => ({ ...prev, normalize: e.target.checked }))}
                      className="w-4 h-4 text-indigo-500 rounded border-slate-300 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">音量标准化（防止音频过小或爆音）</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.denoise}
                      onChange={(e) => setOptions((prev) => ({ ...prev, denoise: e.target.checked }))}
                      className="w-4 h-4 text-indigo-500 rounded border-slate-300 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">基础去噪（减少背景噪音）</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.adjustVolume}
                      onChange={(e) => setOptions((prev) => ({ ...prev, adjustVolume: e.target.checked }))}
                      className="w-4 h-4 text-indigo-500 rounded border-slate-300 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">音量调整</span>
                  </label>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
                  <AlertCircle className="w-5 h-5" />
                  {error}
                </div>
              )}

              <button
                onClick={repair}
                disabled={loading || !file}
                className="w-full py-3 px-4 bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-400 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wrench className="w-5 h-5" />}
                {loading ? '修复中...' : '开始修复'}
              </button>

              {resultUrl && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-green-700 dark:text-green-400 font-medium">修复完成！</p>
                    <button
                      onClick={downloadResult}
                      className="px-3 py-1.5 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-1 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      下载
                    </button>
                  </div>
                  <audio controls src={resultUrl} className="w-full" />
                </div>
              )}

              <div className="flex items-start gap-2 p-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 rounded-lg text-sm">
                <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>浏览器端音频处理，可进行音量标准化和基础去噪。如需深度修复，请使用专业音频编辑软件。</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}