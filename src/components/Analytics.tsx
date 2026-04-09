'use client';

import { useEffect } from 'react';

export default function Analytics() {
  useEffect(() => {
    // Google Analytics
    const gtagScript = document.createElement('script');
    gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-HWMGEQS9C0';
    gtagScript.async = true;
    document.head.appendChild(gtagScript);

    const win = window as any;
    win.dataLayer = win.dataLayer || [];
    win.gtag = function(...args: any[]) {
      win.dataLayer.push(args);
    };
    win.gtag('js', new Date());
    win.gtag('config', 'G-HWMGEQS9C0');

    // Google AdSense
    const adsScript = document.createElement('script');
    adsScript.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7274710287377352';
    adsScript.async = true;
    adsScript.crossOrigin = 'anonymous';
    document.head.appendChild(adsScript);
  }, []);

  return null;
}
