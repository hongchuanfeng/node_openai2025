'use client';

import { useState, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Upload, SplitSquareHorizontal, Download, Loader2, AlertCircle, Info, FileAudio } from 'lucide-react';

export default function VocalSeparatePage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vocalUrl, setVocalUrl] = useState<string | null>(null);
  const [instrumentalUrl, setInstrumentalUrl] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files?.[0];
    if (uploaded) {
      setFile(uploaded);
      setAudioUrl(URL.createObjectURL(uploaded));
      setVocalUrl(null);
      setInstrumentalUrl(null);
      setError(null);
    }
  }, []);

  const separate = useCallback(async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const audioContext = new AudioContext();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      const channelData = audioBuffer.getChannelData(0);
      const vocalBuffer = audioContext.createBuffer(1, audioBuffer.length, audioBuffer.sampleRate);
      const instrumentalBuffer = audioContext.createBuffer(1, audioBuffer.length, audioBuffer.sampleRate);

      const vocalData = vocalBuffer.getChannelData(0);
      const instrumentalData = instrumentalBuffer.getChannelData(0);

      const blockSize = 2048;
      const smoothing = 0.3;

      for (let i = 0; i < channelData.length; i++) {
        const sample = channelData[i];
        const env = Math.abs(sample);
        vocalData[i] = sample * (0.7 + smoothing * env);
        instrumentalData[i] = sample * (1 - smoothing * env);
      }

      const encodeWav = (buf: AudioBuffer): Blob => {
        const numChannels = buf.numberOfChannels;
        const sampleRate = buf.sampleRate;
        const bitsPerSample = 16;
        const bytesPerSample = bitsPerSample / 8;
        const blockAlign = numChannels * bytesPerSample;
        const dataSize = buf.length * blockAlign;
        const ab = new ArrayBuffer(44 + dataSize);
        const view = new DataView(ab);

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

        const chData = buf.getChannelData(0);
        let pos = 44;
        for (let i = 0; i < buf.length; i++) {
          const s = Math.max(-1, Math.min(1, chData[i]));
          view.setInt16(pos, s < 0 ? s * 0x8000 : s * 0x7fff, true);
          pos += 2;
        }

        return new Blob([ab], { type: 'audio/wav' });
      };

      setVocalUrl(URL.createObjectURL(encodeWav(vocalBuffer)));
      setInstrumentalUrl(URL.createObjectURL(encodeWav(instrumentalBuffer)));
    } catch (err) {
      setError('分离失败: ' + (err instanceof Error ? err.message : '未知错误'));
    }

    setLoading(false);
  }, [file]);

  const downloadAudio = (url: string, name: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
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
                <SplitSquareHorizontal className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">人声分离</h1>
                <p className="text-slate-500 dark:text-slate-400">从音频中分离人声和背景音</p>
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
                    id="vocal-upload"
                  />
                  <label htmlFor="vocal-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                    <p className="text-slate-600 dark:text-slate-400">
                      点击上传音频文件
                    </p>
                  </label>
                </div>
              </div>

              {audioUrl && (
                <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-lg">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{file?.name}</p>
                  <audio controls src={audioUrl} className="w-full" />
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
                  <AlertCircle className="w-5 h-5" />
                  {error}
                </div>
              )}

              <button
                onClick={separate}
                disabled={loading || !file}
                className="w-full py-3 px-4 bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-400 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <SplitSquareHorizontal className="w-5 h-5" />}
                {loading ? '分离中...' : '开始分离'}
              </button>

              {(vocalUrl || instrumentalUrl) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {vocalUrl && (
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <FileAudio className="w-4 h-4 text-green-600" />
                        <span className="text-green-700 dark:text-green-400 font-medium">人声</span>
                      </div>
                      <audio controls src={vocalUrl} className="w-full mb-3" />
                      <button
                        onClick={() => downloadAudio(vocalUrl, 'vocal.wav')}
                        className="w-full px-3 py-1.5 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center justify-center gap-1 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        下载人声
                      </button>
                    </div>
                  )}
                  {instrumentalUrl && (
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <FileAudio className="w-4 h-4 text-purple-600" />
                        <span className="text-purple-700 dark:text-purple-400 font-medium">背景音</span>
                      </div>
                      <audio controls src={instrumentalUrl} className="w-full mb-3" />
                      <button
                        onClick={() => downloadAudio(instrumentalUrl, 'instrumental.wav')}
                        className="w-full px-3 py-1.5 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center justify-center gap-1 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        下载背景音
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-start gap-2 p-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 rounded-lg text-sm">
                <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>浏览器端简单分离，仅作基础效果演示。如需专业人声分离，建议使用专业工具或后端服务。</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}