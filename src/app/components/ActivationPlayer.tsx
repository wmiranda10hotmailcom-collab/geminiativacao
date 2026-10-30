"use client";

import React, { useRef, useState, useMemo } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  RotateCcw,
  Sparkles,
} from "lucide-react";

interface ActivationPlayerProps {
  videoSrc?: string;
  posterSrc?: string;
}

export function ActivationPlayer({
  videoSrc = "/videos/tutorial.mp4",
  posterSrc,
}: ActivationPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");
  const [hasError, setHasError] = useState(false);

  // Detecta se é link do YouTube ou Vimeo
  const embedUrl = useMemo(() => {
    if (!videoSrc) return null;
    if (videoSrc.includes("youtube.com") || videoSrc.includes("youtu.be")) {
      const match = videoSrc.match(/(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*)/);
      const videoId = match && match[1].length === 11 ? match[1] : null;
      return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0` : null;
    }
    if (videoSrc.includes("vimeo.com")) {
      const match = videoSrc.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)/);
      const videoId = match ? match[1] : null;
      return videoId ? `https://player.vimeo.com/video/${videoId}` : null;
    }
    return null;
  }, [videoSrc]);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error("Erro ao ativar tela cheia:", err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const total = videoRef.current.duration || 1;
    setProgress((current / total) * 100);
    setCurrentTime(formatTime(current));
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(formatTime(videoRef.current.duration));
    setHasError(false);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newProgress = (clickX / rect.width) * 100;
    videoRef.current.currentTime =
      (newProgress / 100) * (videoRef.current.duration || 1);
    setProgress(newProgress);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video bg-slate-950 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border-2 border-blue-500/30 group"
    >
      {/* Selo superior "Passo a Passo Oficial" */}
      <div className="absolute top-3 left-3 md:top-4 md:left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/85 backdrop-blur-md border border-white/10 text-white text-xs font-semibold shadow-md pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        <span className="flex items-center gap-1 text-blue-400">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          Passo a Passo Oficial
        </span>
      </div>

      {embedUrl ? (
        /* Caso o usuário passe um link do YouTube ou Vimeo */
        <iframe
          src={embedUrl}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : videoSrc && !hasError ? (
        /* Vídeo local em MP4 ou link direto */
        <>
          <video
            ref={videoRef}
            src={videoSrc}
            poster={posterSrc}
            className="w-full h-full object-cover cursor-pointer"
            onClick={togglePlay}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onError={() => setHasError(true)}
            playsInline
          />

          {/* Botão central de Play quando pausado */}
          {!isPlaying && (
            <div
              onClick={togglePlay}
              className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-[2px] cursor-pointer transition-opacity"
            >
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-2xl shadow-blue-500/50 hover:scale-110 transition-transform">
                <Play className="w-10 h-10 ml-1 fill-white" />
              </div>
            </div>
          )}

          {/* Barra de Controles Inferior */}
          <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 md:p-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <div
              onClick={handleSeek}
              className="w-full h-1.5 md:h-2 bg-white/20 rounded-full cursor-pointer mb-3 relative overflow-hidden"
            >
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-white text-xs md:text-sm">
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  className="hover:text-blue-400 transition-colors p-1"
                  aria-label={isPlaying ? "Pausar" : "Reproduzir"}
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5 fill-current" />
                  )}
                </button>

                <button
                  onClick={toggleMute}
                  className="hover:text-blue-400 transition-colors p-1"
                  aria-label={isMuted ? "Desmutar" : "Mutar"}
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5 text-red-400" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </button>

                <span className="font-mono text-slate-300 text-xs">
                  {currentTime} / {duration}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (videoRef.current) {
                      videoRef.current.currentTime = 0;
                      videoRef.current.play();
                      setIsPlaying(true);
                    }
                  }}
                  className="hover:text-blue-400 transition-colors p-1"
                  title="Reiniciar vídeo"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={toggleFullscreen}
                  className="hover:text-blue-400 transition-colors p-1"
                  title="Tela Cheia"
                >
                  <Maximize2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Placeholder caso o arquivo ainda não esteja na pasta public/videos/ */
        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 select-none">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-xl shadow-blue-500/40 mb-3">
            <Play className="w-8 h-8 ml-1 fill-white" />
          </div>
          <p className="text-white font-bold text-base md:text-lg max-w-md">
            Vídeo Tutorial de Ativação
          </p>
          <p className="text-blue-300 text-xs mt-1.5 max-w-sm">
            Cole seu arquivo de vídeo em <code className="bg-blue-900/50 px-1 py-0.5 rounded text-white font-mono">public/videos/tutorial.mp4</code> ou cole o link do YouTube/Vimeo.
          </p>
        </div>
      )}
    </div>
  );
}
