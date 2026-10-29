"use client";

import React, { useRef, useState, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize2, RotateCcw, Sparkles } from "lucide-react";

interface ActivationPlayerProps {
  videoSrc?: string;
  posterSrc?: string;
}

export function ActivationPlayer({
  videoSrc,
  posterSrc,
}: ActivationPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");
  const [hasStarted, setHasStarted] = useState(false);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
      setHasStarted(true);
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
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newProgress = (clickX / rect.width) * 100;
    videoRef.current.currentTime = (newProgress / 100) * (videoRef.current.duration || 1);
    setProgress(newProgress);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video bg-slate-950 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border-2 border-blue-500/30 group"
    >
      {/* Selo superior "Tutorial de Ativação" */}
      <div className="absolute top-3 left-3 md:top-4 md:left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/85 backdrop-blur-md border border-white/10 text-white text-xs font-semibold shadow-md pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        <span className="flex items-center gap-1 text-blue-400">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          Passo a Passo Oficial
        </span>
      </div>

      {videoSrc ? (
        <video
          ref={videoRef}
          src={videoSrc}
          poster={posterSrc}
          className="w-full h-full object-cover cursor-pointer"
          onClick={togglePlay}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          playsInline
        />
      ) : (
        /* Placeholder dinâmico caso o cliente ainda não tenha inserido o arquivo .mp4 definitivo */
        <div
          className="w-full h-full flex flex-col items-center justify-center p-6 text-center cursor-pointer bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 select-none"
          onClick={() => setHasStarted(!hasStarted)}
        >
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-xl shadow-blue-500/40 mb-4 transition-transform group-hover:scale-110">
            <Play className="w-10 h-10 ml-1 fill-white" />
          </div>
          <p className="text-white font-bold text-lg md:text-xl max-w-md">
            Clique para iniciar o tutorial em vídeo
          </p>
          <p className="text-blue-300 text-xs md:text-sm mt-2 max-w-sm">
            Demonstração em 1 minuto de como resgatar seu link e validar os 18 meses com segurança.
          </p>
        </div>
      )}

      {/* Overlay de Botão Play quando pausado e com vídeo real */}
      {videoSrc && !isPlaying && (
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
      {videoSrc && (
        <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 md:p-4 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Barra de Progresso */}
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
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
              </button>

              <button
                onClick={toggleMute}
                className="hover:text-blue-400 transition-colors p-1"
                aria-label={isMuted ? "Desmutar" : "Mutar"}
              >
                {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5" />}
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
      )}
    </div>
  );
}
