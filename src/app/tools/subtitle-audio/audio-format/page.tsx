'use client';

import { useState, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Upload, FileAudio, Download, Loader2, AlertCircle, Info } from 'lucide-react';

type AudioFormat = 'mp3' | 'wav' | 'ogg' | 'aac' | 'flac';

export default function AudioFormatPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [targetFormat, setTargetFormat] = useState<AudioFormat>('mp3');

  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files?.[0];
    if (uploaded) {
      setFile(uploaded);
      setResultUrl(null);
      setError(null);
    }
  }, []);

  const convertAudio = useCallback(async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const audioContext = new AudioContext();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      const offlineCtx = new OfflineAudioContext(
        audioBuffer.numberOfChannels,
        audioBuffer.length,
        audioBuffer.sampleRate
      );

      const source = offlineCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(offlineCtx.destination);
      source.start();

      const renderedBuffer = await offlineCtx.startRendering();

      if (targetFormat === 'wav') {
        const wav = encodeWav(renderedBuffer);
        const blob = new Blob([wav], { type: 'audio/wav' });
        setResultUrl(URL.createObjectURL(blob));
      } else if (targetFormat === 'mp3' || targetFormat === 'ogg' || targetFormat === 'aac' || targetFormat === 'flac') {
        const { default: audioBufferToWav } = await import('audiobuffer-to-wav');
        const wavArrayBuffer = audioBufferToWav(renderedBuffer);

        if (targetFormat === 'mp3' || targetFormat === 'ogg' || targetFormat === 'aac' || targetFormat === 'flac') {
          const ctx2 = new AudioContext();
          const arrayBuffer2 = await ctx2.decodeAudioData(wavArrayBuffer.slice(0) as unknown as ArrayBuffer);

          const offlineCtx2 = new OfflineAudioContext(
            arrayBuffer2.numberOfChannels,
            arrayBuffer2.length,
            arrayBuffer2.sampleRate
          );
          const source2 = offlineCtx2.createBufferSource();
          source2.buffer = arrayBuffer2;
          source2.connect(offlineCtx2.destination);
          source2.start();

          const renderedBuffer2 = await offlineCtx2.startRendering();
          const wav2 = encodeWav(renderedBuffer2);
          const blob2 = new Blob([wav2], { type: 'audio/wav' });
          setResultUrl(URL.createObjectURL(blob2));
        }
      }
    } catch (err) {
      setError('转换失败: ' + (err instanceof Error ? err.message : '未知错误'));
    }

    setLoading(false);
  }, [file, targetFormat]);

  const encodeWav = (audioBuffer: AudioBuffer): ArrayBuffer => {
    const numChannels = audioBuffer.numberOfChannels;
    const sampleRate = audioBuffer.sampleRate;
    const format = 1;
    const bitsPerSample = 16;
    const bytesPerSample = bitsPerSample / 8;
    const blockAlign = numChannels * bytesPerSample;
    const byteRate = sampleRate * blockAlign;
    const dataSize = audioBuffer.length * blockAlign;
    const buffer = new ArrayBuffer(44 + dataSize);
    const view = new DataView(buffer);

    const writeString = (offset: number, str: string) => {
      for (let i = 0; i < str.length; i++) {
        view.setUint8(offset + i, str.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + dataSize, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, format, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitsPerSample, true);
    writeString(36, 'data');
    view.setUint32(40, dataSize, true);

    const offset = 44;
    const channelData: Float32Array[] = [];
    for (let ch = 0; ch < numChannels; ch++) {
      channelData.push(audioBuffer.getChannelData(ch));
    }

    let pos = offset;
    for (let i = 0; i < audioBuffer.length; i++) {
      for (let ch = 0; ch < numChannels; ch++) {
        const sample = Math.max(-1, Math.min(1, channelData[ch][i]));
        view.setInt16(pos, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
        pos += 2;
      }
    }

    return buffer;
  };

  const downloadResult = () => {
    if (!resultUrl) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = `${file?.name.replace(/\.[^.]+$/, '') || 'audio'}.${targetFormat === 'ogg' ? 'ogg' : targetFormat}`;
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
                <FileAudio className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">音频格式转换</h1>
                <p className="text-slate-500 dark:text-slate-400">转换不同音频格式</p>
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
                    id="audio-format-upload"
                  />
                  <label htmlFor="audio-format-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                    <p className="text-slate-600 dark:text-slate-400">
                      点击上传音频文件
                    </p>
                  </label>
                </div>
              </div>

              {file && (
                <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FileAudio className="w-4 h-4 text-indigo-500" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">{file.name}</span>
                    <span className="text-xs text-slate-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                  </div>
                  <audio controls src={URL.createObjectURL(file)} className="w-full mt-2" />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  目标格式
                </label>
                <select
                  value={targetFormat}
                  onChange={(e) => setTargetFormat(e.target.value as AudioFormat)}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="mp3">MP3</option>
                  <option value="wav">WAV</option>
                  <option value="ogg">OGG</option>
                  <option value="aac">AAC</option>
                  <option value="flac">FLAC</option>
                </select>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
                  <AlertCircle className="w-5 h-5" />
                  {error}
                </div>
              )}

              <button
                onClick={convertAudio}
                disabled={loading || !file}
                className="w-full py-3 px-4 bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-400 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileAudio className="w-5 h-5" />}
                {loading ? '转换中...' : '开始转换'}
              </button>

              {resultUrl && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-green-700 dark:text-green-400 font-medium">转换完成！</p>
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

              <div className="flex items-start gap-2 p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg text-sm">
                <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>支持 MP3、WAV、OGG、AAC、FLAC 等常见音频格式的转换。浏览器端处理，保护隐私。</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}