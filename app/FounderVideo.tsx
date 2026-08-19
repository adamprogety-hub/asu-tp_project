'use client';

import { useRef, useState } from 'react';
import { Play } from 'lucide-react';

export function FounderVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  function handlePlay() {
    const v = videoRef.current;
    if (!v) return;
    setPlaying(true);
    v.play();
  }

  return (
    <div className="founder-video" onClick={!playing ? handlePlay : undefined} style={{ cursor: playing ? 'default' : 'pointer' }}>
      {/* decorative grid */}
      <div className="founder-video-grid" aria-hidden>
        {Array.from({ length: 6 }).map((_, i) => <span key={i} />)}
      </div>

      {/* live label */}
      {!playing && (
        <div className="founder-video-label" aria-hidden>
          <i />
          Видео · О проекте
        </div>
      )}

      {/* video element */}
      <video
        ref={videoRef}
        src="/founder.mp4"
        playsInline
        controls={playing}
        preload="metadata"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: playing ? 1 : 0,
          transition: 'opacity 0.4s ease',
          borderRadius: 'inherit',
        }}
        onEnded={() => setPlaying(false)}
      />

      {/* play button */}
      {!playing && (
        <div className="founder-play" aria-label="Смотреть видео">
          <Play fill="currentColor" strokeWidth={0} />
        </div>
      )}

      {/* caption */}
      {!playing && (
        <div className="founder-video-caption">
          <strong>Павел Петров</strong>
          <span>Инженер · Основатель acengine.ru</span>
        </div>
      )}
    </div>
  );
}
