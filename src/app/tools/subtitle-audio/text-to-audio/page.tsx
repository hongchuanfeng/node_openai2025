'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FileAudio, Download, Loader2, AlertCircle, Volume2 } from 'lucide-react';

export default function TextToAudioPage() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [speechRate, setSpeechRate] = useState(1);
  const [speechPitch, setSpeechPitch] = useState(1);
  const [logLines, setLogLines] = useState<string[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  function appendLog(msg: string) {
    setLogLines(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  }

  useEffect(() => {
    const loadVoices = () => {
      const available = window.speechSynthesis.getVoices();
      setVoices(available);
      const zhVoice = available.find(v => v.lang.includes('zh')) || available.find(v => v.lang.includes('zh-CN')) || null;
      setSelectedVoice(zhVoice || available[0] || null);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, []);

  const handlePreview = useCallback(() => {
    if (!text.trim()) {
      setError('请输入要转换的文字');
      return;
    }
    if (!('speechSynthesis' in window)) {
      setError('当前浏览器不支持语音合成');
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;

    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.rate = speechRate;
    utterance.pitch = speechPitch;
    utterance.lang = selectedVoice?.lang || 'zh-CN';

    utterance.onstart = () => {
      setIsSpeaking(true);
      appendLog('🔊 开始朗读...');
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      appendLog('✅ 朗读结束');
    };
    utterance.onerror = (e) => {
      setIsSpeaking(false);
      const msg = e.error || '未知错误';
      appendLog(`❌ 朗读出错: ${msg}`);
      setError('朗读失败: ' + msg);
    };

    appendLog(`朗读: "${text.substring(0, 20)}${text.length > 20 ? '...' : ''}"`);
    appendLog(`语速: ${speechRate}  音调: ${speechPitch}  声音: ${selectedVoice?.name || '默认'}`);
    window.speechSynthesis.speak(utterance);
  }, [text, selectedVoice, speechRate, speechPitch]);

  const handleStop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    appendLog('⏹ 已停止');
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!text.trim()) {
      setError('请输入要转换的文字');
      return;
    }
    if (!('speechSynthesis' in window)) {
      setError('当前浏览器不支持语音合成');
      return;
    }

    setLoading(true);
    setError(null);
    setAudioUrl(null);
    setLogLines([]);

    try {
      appendLog('准备录制语音...');

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        appendLog(`WebM: ${blob.size} bytes`);
        if (blob.size === 0) {
          setError('录制失败，音频数据为空');
          setLoading(false);
          return;
        }
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        appendLog('✅ 生成成功！');
        setLoading(false);
        stream.getTracks().forEach(t => t.stop());
      };

      mediaRecorder.onerror = (e) => {
        appendLog(`❌ 录制出错: ${e}`);
        setError('录制失败');
        setLoading(false);
        stream.getTracks().forEach(t => t.stop());
      };

      appendLog('开始录制...');
      mediaRecorder.start();

      const utterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utterance;

      if (selectedVoice) utterance.voice = selectedVoice;
      utterance.rate = speechRate;
      utterance.pitch = speechPitch;
      utterance.lang = selectedVoice?.lang || 'zh-CN';

      utterance.onend = () => {
        appendLog('朗读结束，停止录制...');
        setTimeout(() => {
          if (mediaRecorderRef.current?.state === 'recording') {
            mediaRecorderRef.current.stop();
          }
        }, 500);
      };

      utterance.onerror = () => {
        if (mediaRecorderRef.current?.state === 'recording') {
          mediaRecorderRef.current.stop();
        }
      };

      appendLog(`语速: ${speechRate}  音调: ${speechPitch}  声音: ${selectedVoice?.name || '默认'}`);
      window.speechSynthesis.speak(utterance);

    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      appendLog(`❌ 错误: ${msg}`);
      setError('生成失败: ' + msg);
      setLoading(false);
    }
  }, [text, selectedVoice, speechRate, speechPitch]);

  const handleDownload = useCallback(() => {
    if (!audioUrl) return;
    const a = document.createElement('a');
    a.href = audioUrl;
    a.download = 'text_to_audio.webm';
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }, [audioUrl]);

  const zhVoices = voices.filter(v => v.lang.includes('zh') || v.lang.includes('CN'));
  const otherVoices = voices.filter(v => !v.lang.includes('zh') && !v.lang.includes('CN'));

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
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">文字转音频</h1>
                <p className="text-slate-500 dark:text-slate-400">使用浏览器内置语音合成，真人朗读</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  输入文字
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  placeholder="请输入要转换为音频的文字..."
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">选择声音</label>
                  <select
                    value={selectedVoice?.name || ''}
                    onChange={(e) => {
                      const v = voices.find(x => x.name === e.target.value);
                      setSelectedVoice(v || null);
                    }}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
                  >
                    {zhVoices.length > 0 && (
                      <optgroup label="中文声音">
                        {zhVoices.map(v => (
                          <option key={v.name} value={v.name}>{v.name}</option>
                        ))}
                      </optgroup>
                    )}
                    {otherVoices.length > 0 && (
                      <optgroup label="其他声音">
                        {otherVoices.map(v => (
                          <option key={v.name} value={v.name}>{v.name}</option>
                        ))}
                      </optgroup>
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
                    语速: {speechRate.toFixed(1)}x
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={speechRate}
                    onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
                    音调: {speechPitch.toFixed(1)}
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={speechPitch}
                    onChange={(e) => setSpeechPitch(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={isSpeaking ? handleStop : handlePreview}
                  disabled={loading || !text.trim()}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${
                    isSpeaking
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-400 text-white'
                  }`}
                >
                  <Volume2 className="w-5 h-5" />
                  {isSpeaking ? '停止' : '试听'}
                </button>
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={loading || !text.trim()}
                  className="flex-1 py-3 px-4 bg-green-500 hover:bg-green-600 disabled:bg-green-400 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileAudio className="w-5 h-5" />}
                  {loading ? '生成中...' : '生成音频文件'}
                </button>
              </div>

              {audioUrl && !loading && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-green-700 dark:text-green-400 font-medium">生成完成！</span>
                    <button
                      type="button"
                      onClick={handleDownload}
                      className="px-4 py-1.5 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      下载 WebM
                    </button>
                  </div>
                  <audio
                    key={audioUrl}
                    src={audioUrl}
                    controls
                    preload="auto"
                    className="w-full"
                  />
                  <p className="text-xs text-green-600 dark:text-green-500">
                    提示：生成的是 WebM 格式音频文件，浏览器兼容性良好。
                  </p>
                </div>
              )}

              {logLines.length > 0 && (
                <div className="bg-slate-900 rounded-lg p-3 text-xs font-mono text-green-400 max-h-48 overflow-y-auto">
                  {logLines.map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
