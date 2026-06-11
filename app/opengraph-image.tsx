import { ImageResponse } from 'next/og';
import { siteConfig } from '@/lib/site';

export const runtime = 'edge';
export const alt = siteConfig.defaultTitle;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #020617 0%, #071827 52%, #06111f 100%)',
          color: '#ffffff',
          fontFamily: 'sans-serif',
          padding: 64,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 96,
            height: 96,
            borderRadius: 24,
            background: 'rgba(18, 169, 217, 0.2)',
            border: '2px solid rgba(18, 169, 217, 0.5)',
            marginBottom: 32,
            fontSize: 42,
            fontWeight: 900,
          }}
        >
          RS
        </div>
        <div style={{ fontSize: 56, fontWeight: 900, textAlign: 'center', lineHeight: 1.3 }}>
          {siteConfig.name}
        </div>
        <div style={{ fontSize: 28, marginTop: 20, color: '#94a3b8', textAlign: 'center', maxWidth: 800 }}>
          {siteConfig.description}
        </div>
      </div>
    ),
    { ...size },
  );
}
