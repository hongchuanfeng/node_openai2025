import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    console.log('[Whisper API] 请求开始');
    
    const apiKey = process.env.SILICONFLOW_API_KEY;
    console.log('[Whisper API] API Key 存在:', !!apiKey);
    
    if (!apiKey) {
      return NextResponse.json({ error: '未配置 SILICONFLOW_API_KEY，请先在 .env.local 中配置' }, { status: 500 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    console.log('[Whisper API] 文件:', file?.name, file?.type, file?.size);
    
    if (!file) {
      return NextResponse.json({ error: '未找到音频文件' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    console.log('[Whisper API] 文件大小:', buffer.length, 'bytes');

    // 创建 Blob（FormData 需要 Blob 类型）
    const blob = new Blob([buffer], { type: file.type || 'audio/mpeg' });

    const audioFormData = new FormData();
    audioFormData.append('file', blob, file.name);
    audioFormData.append('model', 'FunAudioLLM/SenseVoiceSmall');
    audioFormData.append('response_format', 'text');
    audioFormData.append('language', 'zh');

    console.log('[Whisper API] 发送请求到 SiliconFlow...');
    
    const res = await fetch('https://api.siliconflow.cn/v1/audio/transcriptions', {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${apiKey}`,
      },
      body: audioFormData,
    });

    console.log('[Whisper API] 响应状态:', res.status);

    const data = await res.json();
    console.log('[Whisper API] 响应数据:', JSON.stringify(data));

    if (!res.ok) {
      return NextResponse.json({ error: data.error?.message || `API错误: ${res.status}` }, { status: 500 });
    }

    return NextResponse.json({ text: data.text || '' });
  } catch (err) {
    console.error('[Whisper API] 错误:', err);
    return NextResponse.json({ error: '服务器错误: ' + String(err) }, { status: 500 });
  }
}