import { useState, useEffect } from 'react';

export interface MobileViewportInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  width: number;
  height: number;
  aspectRatio: number;
  dpr: number;
  hasNotchOrDynamicIsland: boolean;
}

export const useMobileViewport = (): MobileViewportInfo => {
  const [viewport, setViewport] = useState<MobileViewportInfo>(() => {
    const w = typeof window !== 'undefined' ? window.innerWidth : 1024;
    const h = typeof window !== 'undefined' ? window.innerHeight : 768;
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    const isIOS = /iPad|iPhone|iPod/.test(ua) || (typeof navigator !== 'undefined' && navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isAndroid = /Android/.test(ua);
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    const ratio = h > 0 ? w / h : 1;

    return {
      isMobile: w < 768,
      isTablet: w >= 768 && w < 1024,
      isDesktop: w >= 1024,
      isIOS,
      isAndroid,
      width: w,
      height: h,
      aspectRatio: ratio,
      dpr,
      hasNotchOrDynamicIsland: isIOS && (h >= 812 || w >= 812),
    };
  });

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const ua = navigator.userAgent;
      const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      const isAndroid = /Android/.test(ua);
      const dpr = window.devicePixelRatio || 1;
      const ratio = h > 0 ? w / h : 1;

      setViewport({
        isMobile: w < 768,
        isTablet: w >= 768 && w < 1024,
        isDesktop: w >= 1024,
        isIOS,
        isAndroid,
        width: w,
        height: h,
        aspectRatio: ratio,
        dpr,
        hasNotchOrDynamicIsland: isIOS && (h >= 812 || w >= 812),
      });
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleResize, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return viewport;
};
