'use client';

import { useState, useCallback, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Upload, Scissors, Download, Loader2, AlertCircle, Info, FileAudio, Play, Pause, X } from 'lucide-react';

interface AudioClip {
  id: number;
  file: File;
  url: string;
  start: number;
  end: number;
  duration: number;
}

export default function AudioEditMergePage() {
  const [clips, setClips] = useState<AudioClip[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const AUDIO_EXTENSIONS = ['.wav', '.mp3', '.ogg', '.webm', '.m4a', '.aac', '.flac', '.aiff', '.aif', '.opus'];

  const isAudioFile = (f: File) => {
    if (f.type.startsWith('audio/')) return true;
    const ext = '.' + f.name.split('.').pop()?.toLowerCase();
    return AUDIO_EXTENSIONS.includes(ext);
  };

  const handleFiles = useCallback((files: FileList) => {
    const audioFiles = Array.from(files).filter(isAudioFile);
    if (audioFiles.length === 0) {
      setError('请上传音频文件');
      return;
    }
    setError(null);

    audioFiles.forEach((file) => {
      const url = URL.createObjectURL(file);
      const audio = new Audio(url);
      audio.onloadedmetadata = () => {
        setClips((prev) => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            file,
            url,
            start: 0,
            end: audio.duration,
            duration: audio.duration,
          },
        ]);
      };
    });
  }, []);

  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleFiles(e.target.files);
  }, [handleFiles]);

  const removeClip = (id: number) => {
    setClips((prev) => {
      const clip = prev.find((c) => c.id === id);
      if (clip) URL.revokeObjectURL(clip.url);
      return prev.filter((c) => c.id !== id);
    });
    setResultUrl(null);
  };

  const playClip = (clip: AudioClip) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    audioRef.current = new Audio(clip.url);
    audioRef.current.currentTime = clip.start;
    audioRef.current.play();
    setPlayingId(clip.id);

    audioRef.current.onended = () => setPlayingId(null);
  };

  const pauseClip = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setPlayingId(null);
    }
  };

  const processAndMerge = useCallback(async () => {
    if (clips.length === 0) return;
    setLoading(true);
    setError(null);

    try {
      const { default: audioContext } = await import('audiobuffer-to-wav');

      const combinedBuffer = await concatenateAudioBuffers(
        clips.map((c) => ({
          arrayBuffer: c.file.arrayBuffer(),
          start: c.start,
          end: c.end,
        }))
      );

      const wav = audioContext(combinedBuffer);
      const blob = new Blob([wav], { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
    } catch (err) {
      setError('处理失败: ' + (err instanceof Error ? err.message : '未知错误'));
    }

    setLoading(false);
  }, [clips]);

  const concatenateAudioBuffers = async (
    sources: { arrayBuffer: Promise<ArrayBuffer>; start: number; end: number }[]
  ): Promise<AudioBuffer> => {
    const audioContext = new AudioContext();

    const audioBuffers: AudioBuffer[] = [];
    for (const src of sources) {
      const buffer = await src.arrayBuffer;
      const audioBuffer = await audioContext.decodeAudioData(buffer);
      const duration = src.end - src.start;
      const length = Math.ceil(audioBuffer.sampleRate * duration);
      const ctx = audioContext;
      const newBuffer = ctx.createBuffer(audioBuffer.numberOfChannels, length, audioBuffer.sampleRate);

      for (let ch = 0; ch < audioBuffer.numberOfChannels; ch++) {
        const srcData = audioBuffer.getChannelData(ch);
        const destData = newBuffer.getChannelData(ch);
        for (let i = 0; i < length; i++) {
          const srcIdx = Math.floor(src.start * audioBuffer.sampleRate) + i;
          if (srcIdx < srcData.length) {
            destData[i] = srcData[srcIdx];
          }
        }
      }
      audioBuffers.push(newBuffer);
    }

    const totalLength = audioBuffers.reduce((acc, b) => acc + b.length, 0);
    const ctx = audioContext;
    const output = ctx.createBuffer(audioBuffers[0].numberOfChannels, totalLength, audioBuffers[0].sampleRate);

    let offset = 0;
    for (const buf of audioBuffers) {
      for (let ch = 0; ch < buf.numberOfChannels; ch++) {
        output.getChannelData(ch).set(buf.getChannelData(ch), offset);
      }
      offset += buf.length;
    }

    return output;
  };

  const downloadResult = () => {
    if (!resultUrl) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = 'merged_audio.wav';
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
                <Scissors className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">音频剪辑合并</h1>
                <p className="text-slate-500 dark:text-slate-400">裁剪音频片段并合并为一个文件</p>
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
                    multiple
                    onChange={handleUpload}
                    className="hidden"
                    id="audio-upload"
                  />
                  <label htmlFor="audio-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                    <p className="text-slate-600 dark:text-slate-400">
                      点击上传音频文件，可多选
                    </p>
                  </label>
                </div>
              </div>

              {clips.length > 0 && (
                <div className="space-y-3">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    已添加的片段 ({clips.length})
                  </label>
                  {clips.map((clip) => (
                    <div key={clip.id} className="p-4 bg-slate-100 dark:bg-slate-700 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <FileAudio className="w-4 h-4 text-indigo-500" />
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{clip.file.name}</span>
                          <span className="text-xs text-slate-500">时长: {clip.duration.toFixed(1)}s</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => playingId === clip.id ? pauseClip() : playClip(clip)}
                            className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
                          >
                            {playingId === clip.id ? (
                              <Pause className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                            ) : (
                              <Play className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                            )}
                          </button>
                          <button
                            onClick={() => removeClip(clip.id)}
                            className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
                          >
                            <X className="w-4 h-4 text-slate-500" />
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-slate-500">开始时间 (秒)</label>
                          <input
                            type="number"
                            min={0}
                            max={clip.end}
                            step={0.1}
                            value={clip.start}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value);
                              setClips((prev) =>
                                prev.map((c) =>
                                  c.id === clip.id ? { ...c, start: Math.max(0, Math.min(val, clip.end - 0.1)) } : c
                                )
                              );
                              setResultUrl(null);
                            }}
                            className="w-full px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-slate-500">结束时间 (秒)</label>
                          <input
                            type="number"
                            min={clip.start}
                            max={clip.duration}
                            step={0.1}
                            value={clip.end}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value);
                              setClips((prev) =>
                                prev.map((c) =>
                                  c.id === clip.id ? { ...c, end: Math.min(clip.duration, Math.max(val, clip.start + 0.1)) } : c
                                )
                              );
                              setResultUrl(null);
                            }}
                            className="w-full px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
                  <AlertCircle className="w-5 h-5" />
                  {error}
                </div>
              )}

              <button
                onClick={processAndMerge}
                disabled={loading || clips.length === 0}
                className="w-full py-3 px-4 bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-400 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Scissors className="w-5 h-5" />}
                {loading ? '处理中...' : '裁剪并合并'}
              </button>

              {resultUrl && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-green-700 dark:text-green-400 font-medium">处理完成！</p>
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
                <span>上传音频后可设置每段的起止时间，然后合并为单个音频文件。使用浏览器端处理，无需上传到服务器。</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}