import React, { useEffect, useRef, useState } from 'react';

const VideoBackground = () => {
  const videoRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const playVideo = async () => {
      try {
        if (videoRef.current) {
          await videoRef.current.play();
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Error playing video:', err);
        setError(err.message);
      }
    };
    
    playVideo();

    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10">
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70" />
      
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="loading-spinner" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center text-red-500">
          <p>Error loading video: {error}</p>
        </div>
      )}

      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        onLoadedData={() => setIsLoading(false)}
        onError={(e) => {
          console.error('Video error:', e);
          setError('Failed to load video');
        }}
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src="/videos/B.mp4" type="video/mp4" />
        Your browser does not support video playback.
      </video>
    </div>
  );
};

export default React.memo(VideoBackground);
