'use client';

import { useRef, useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Mic, MicOff, Volume2, Info } from 'lucide-react';

export default function MicrophoneTestPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasMic, setHasMic] = useState<boolean | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState('');
  const [volume, setVolume] = useState(0);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startMic = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setStream(mediaStream);
      setHasMic(true);
      setIsRecording(true);
      setError('');

      const ctx = new AudioContext();
      const analyserNode = ctx.createAnalyser();
      analyserNode.fftSize = 256;
      ctx.createMediaStreamSource(mediaStream).connect(analyserNode);
      setAudioContext(ctx);
      setAnalyser(analyserNode);

      const data = new Uint8Array(analyserNode.frequencyBinCount);
      const draw = () => {
        analyserNode.getByteFrequencyData(data);
        const avg = data.reduce((a, b) => a + b, 0) / data.length;
        setVolume(Math.round(avg / 255 * 100));
        if (isRecording) requestAnimationFrame(draw);
      };
      draw();
    } catch {
      setHasMic(false);
      setError('无法访问麦克风。请确保已授权麦克风权限，或麦克风可能被其他应用占用。');
    }
  };

  const stopMic = () => {
    if (stream) stream.getTracks().forEach(t => t.stop());
    if (audioContext) audioContext.close();
    setIsRecording(false);
    setVolume(0);
  };

  useEffect(() => { return () => stopMic(); }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-cyan-200 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Mic className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">麦克风测试</h1>
            </div>
            <p className="text-emerald-100 text-lg">检测麦克风是否正常工作</p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
              {/* Volume meter */}
              <div className="relative mb-8">
                <div className="h-8 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-100"
                    style={{ width: `${volume}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-slate-400">0</span>
                  <span className="text-xs text-emerald-500 font-medium">{volume}%</span>
                  <span className="text-xs text-slate-400">100</span>
                </div>
              </div>

              {/* Icon */}
              <div className="flex justify-center mb-8">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${isRecording ? 'bg-emerald-100 dark:bg-emerald-900/30 animate-pulse' : 'bg-slate-100 dark:bg-slate-700'}`}>
                  {isRecording ? (
                    <Mic className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <MicOff className="w-12 h-12 text-slate-400" />
                  )}
                </div>
              </div>

              {/* Controls */}
              <div className="flex gap-4">
                {!isRecording ? (
                  <button
                    onClick={startMic}
                    className="flex-1 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all text-lg flex items-center justify-center gap-2"
                  >
                    <Mic className="w-5 h-5" />
                    开始测试
                  </button>
                ) : (
                  <button
                    onClick={stopMic}
                    className="flex-1 py-4 bg-gradient-to-r from-red-500 to-rose-500 text-white font-bold rounded-xl hover:from-red-600 hover:to-rose-600 transition-all text-lg flex items-center justify-center gap-2"
                  >
                    <MicOff className="w-5 h-5" />
                    停止测试
                  </button>
                )}
              </div>

              {error && (
                <div className="mt-4 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
                  {error}
                </div>
              )}
            </div>

            {isRecording && (
              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-900/20 p-4 mb-6 text-center">
                <p className="text-emerald-700 dark:text-emerald-300 font-medium">🎤 麦克风正在工作！对着麦克风说话看看音量变化</p>
              </div>
            )}

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-900/20 p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                <div className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                  <p>使用提示：</p>
                  <ul className="list-disc list-inside space-y-0.5">
                    <li>首次使用需要授权麦克风权限</li>
                    <li>如果麦克风被其他应用占用，请先关闭其他应用</li>
                    <li>对着麦克风说话，观察上方的音量指示条</li>
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
