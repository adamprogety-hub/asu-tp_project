import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'acengine.ru — Диспетчеризация вентиляции',
    short_name: 'acengine',
    description: 'Проектирование и внедрение систем диспетчеризации вентиляции коммерческих объектов',
    start_url: '/',
    display: 'standalone',
    background_color: '#f5f6f3',
    theme_color: '#141716',
    icons: [
      { src: '/favicon-32x32.png',  sizes: '32x32',   type: 'image/png' },
      { src: '/favicon-512x512.png', sizes: '512x512', type: 'image/png' },
      { src: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  };
}
