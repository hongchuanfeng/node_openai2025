import Link from 'next/link';
import { Sparkles, ExternalLink } from 'lucide-react';

const footerLinks = {
  product: [
    { name: '生活工具', href: '/tools/life' },
    { name: '图片工具', href: '/tools/image' },
    { name: 'PDF工具', href: '/tools/pdf' },
    { name: '字幕音频工具', href: '/tools/subtitle-audio' },
    { name: '加密解密', href: '/tools/encrypt' },
    { name: '编码解码', href: '/tools/encode' },
    { name: '开发工具', href: '/tools/dev' },
  ],
  company: [
    { name: '关于我们', href: '/about' },
    { name: '联系我们', href: '/contact' },
    { name: '隐私政策', href: '/privacy' },
    { name: '服务条款', href: '/terms' },
  ],
  legal: [
    { name: '免责声明', href: '/disclaimer' },
    { name: '版权声明', href: '/copyright' },
  ],
};

const friendLinks = [
  { name: '在线免费图片马赛克', url: 'https://mosaic.openai2025.com/' },
  { name: '免费游戏IceBreakGame', url: 'https://www.icebreakgame.com/' },
  { name: '视频去水印字幕工具', url: 'https://www.removewatermarker.com/' },
  { name: 'NBA趣事', url: 'https://www.zorezoro.com/' },
  { name: '在线文字转字幕AI工具', url: 'https://www.chdaoai.com/' },
  { name: '中国菜系大全', url: 'https://food.zorezoro.com/' },
  { name: '中国功夫网', url: 'https://gf.zorezoro.com/' },
  { name: '中国24史', url: 'https://china.zorezoro.com/' },
  { name: '在线base64工具', url: 'https://www.Base64.club/' },
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">传道AI</span>
            </Link>
            <p className="text-sm text-slate-400">
              传道AI是一个提供丰富在线工具的平台，帮助您更高效地完成日常工作。
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">产品分类</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">关于我们</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">法律信息</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800">
          <h3 className="font-semibold text-white mb-4">友情链接</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {friendLinks.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:text-white transition-colors flex items-center gap-1"
              >
                {link.name}
                <ExternalLink className="w-3 h-3" />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-800 text-center text-sm text-slate-400">
          <p>© 2025 传道AI · 版权所有</p>
          <p className="mt-1">
            工业和信息化部 粤ICP备18041392号-7
          </p>
        </div>
      </div>
    </footer>
  );
}
