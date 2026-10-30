"use client";

import React, { useRef, useState, useEffect, useMemo, useCallback } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  RotateCcw,
  Sparkles,
  Gauge,
  Smartphone,
} from "lucide-react";

interface ActivationPlayerProps {
  videoSrc?: string;
  posterSrc?: string;
}

const SPEED_OPTIONS = [1, 1.25, 1.5, 2];

export function ActivationPlayer({
  videoSrc = "/videos/tutorial.mp4",
  posterSrc,
}: ActivationPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hideControlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");
  const [hasError, setHasError] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Detecta se é link do YouTube ou Vimeo
  const embedUrl = useMemo(() => {
    if (!videoSrc) return null;
    if (videoSrc.includes("youtube.com") || videoSrc.includes("youtu.be")) {
      const match = videoSrc.match(
        /(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*)/
      );
      const videoId = match && match[1].length === 11 ? match[1] : null;
      return videoId
        ? `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`
        : null;
    }
    if (videoSrc.includes("vimeo.com")) {
      const match = videoSrc.match(
        /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)/
      );
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

  // Timer para ocultar controles automaticamente durante o play
  const resetControlsTimer = useCallback(() => {
    setShowControls(true);
    if (hideControlsTimeoutRef.current) {
      clearTimeout(hideControlsTimeoutRef.current);
    }
    if (isPlaying) {
      hideControlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3500);
    }
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying) {
      setShowControls(true);
      if (hideControlsTimeoutRef.current) {
        clearTimeout(hideControlsTimeoutRef.current);
      }
    } else {
      resetControlsTimer();
    }
    return () => {
      if (hideControlsTimeoutRef.current) {
        clearTimeout(hideControlsTimeoutRef.current);
      }
    };
  }, [isPlaying, resetControlsTimer]);

  // Listener para saber quando sai da tela cheia
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const togglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          resetControlsTimer();
        })
        .catch(() => setIsPlaying(false));
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
      setShowControls(true);
    }
  };

  const toggleMute = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const setSpeed = (speed: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setPlaybackRate(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const cycleSpeed = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const currentIndex = SPEED_OPTIONS.indexOf(playbackRate);
    const nextSpeed =
      SPEED_OPTIONS[(currentIndex + 1) % SPEED_OPTIONS.length];
    setSpeed(nextSpeed);
  };

  // Suporte universal a tela cheia (iOS Safari, Android Chrome e Desktop)
  const toggleFullscreen = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    const video = videoRef.current;
    const container = containerRef.current;

    // 1. Suporte exclusivo para iPhone / iOS Safari
    // @ts-expect-error webkitEnterFullscreen is iOS Safari specific
    if (video && typeof video.webkitEnterFullscreen === "function") {
      try {
        // @ts-expect-error webkitEnterFullscreen is iOS Safari specific
        video.webkitEnterFullscreen();
        return;
      } catch (err) {
        console.warn("webkitEnterFullscreen fallback:", err);
      }
    }

    // 2. Fullscreen API padrão (Android, Chrome, PC, Mac)
    if (!document.fullscreenElement) {
      const target = container || video;
      if (target?.requestFullscreen) {
        target
          .requestFullscreen()
          .then(() => {
            setIsFullscreen(true);
            // Tenta rotacionar para landscape no Android caso o dispositivo permita
            try {
              // @ts-expect-error ScreenOrientation API
              if (screen.orientation && typeof screen.orientation.lock === "function") {
                // @ts-expect-error ScreenOrientation API
                screen.orientation.lock("landscape").catch(() => {});
              }
            } catch {}
          })
          .catch(() => {
            if (video?.requestFullscreen) {
              video.requestFullscreen().catch((err) => {
                console.error("Erro ao ativar tela cheia:", err);
              });
            }
          });
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
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
    e.stopPropagation();
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newProgress = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
    videoRef.current.currentTime =
      (newProgress / 100) * (videoRef.current.duration || 1);
    setProgress(newProgress);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* ─── CONTAINER PRINCIPAL DO PLAYER ─── */}
      <div
        ref={containerRef}
        onClick={resetControlsTimer}
        onMouseMove={resetControlsTimer}
        className="relative w-full aspect-video bg-slate-950 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border-2 border-blue-500/30 group select-none"
      >
        {/* Selo superior "Passo a Passo Oficial" */}
        <div className="absolute top-3 left-3 md:top-4 md:left-4 z-20 flex items-center gap-2 px-2.5 py-1 md:px-3 md:py-1.5 rounded-full bg-slate-900/85 backdrop-blur-md border border-white/10 text-white text-[11px] md:text-xs font-semibold shadow-md pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="flex items-center gap-1 text-blue-400">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            Passo a Passo Oficial
          </span>
        </div>

        {/* Indicador de Velocidade no topo direito se estiver acima de 1x */}
        {playbackRate !== 1 && (
          <div className="absolute top-3 right-3 md:top-4 md:right-4 z-20 flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-600/90 text-white text-xs font-bold shadow-md">
            <Gauge className="w-3.5 h-3.5" />
            <span>{playbackRate}x</span>
          </div>
        )}

        {embedUrl ? (
          <iframe
            src={embedUrl}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : videoSrc && !hasError ? (
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
              webkit-playsinline="true"
            />

            {/* Botão central de Play quando pausado */}
            {!isPlaying && (
              <div
                onClick={togglePlay}
                className="absolute inset-0 z-10 flex items-center justify-center bg-black/45 backdrop-blur-[2px] cursor-pointer transition-opacity"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-2xl shadow-blue-500/50 hover:scale-110 active:scale-95 transition-transform">
                  <Play className="w-8 h-8 sm:w-10 sm:h-10 ml-1 fill-white" />
                </div>
              </div>
            )}

            {/* ─── BARRA DE CONTROLES INFERIOR (Visível no touch e hover) ─── */}
            <div
              className={`absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-3 sm:p-4 transition-opacity duration-300 ${
                showControls ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
              }`}
            >
              {/* Barra de Progresso / Linha de Tempo */}
              <div
                onClick={handleSeek}
                className="w-full h-2 sm:h-2.5 bg-white/20 rounded-full cursor-pointer mb-2.5 sm:mb-3 relative overflow-hidden group/seek"
              >
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-100"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Botões de Ação na Barra */}
              <div className="flex items-center justify-between text-white text-xs sm:text-sm">
                <div className="flex items-center gap-2 sm:gap-3">
                  {/* Play / Pause */}
                  <button
                    onClick={togglePlay}
                    className="p-1.5 rounded-lg hover:bg-white/10 active:scale-95 transition-all text-white hover:text-blue-400"
                    aria-label={isPlaying ? "Pausar" : "Reproduzir"}
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 fill-current" />
                    ) : (
                      <Play className="w-5 h-5 fill-current" />
                    )}
                  </button>

                  {/* Mute / Unmute */}
                  <button
                    onClick={toggleMute}
                    className="p-1.5 rounded-lg hover:bg-white/10 active:scale-95 transition-all text-white hover:text-blue-400"
                    aria-label={isMuted ? "Ativar som" : "Desativar som"}
                  >
                    {isMuted ? (
                      <VolumeX className="w-5 h-5 text-red-400" />
                    ) : (
                      <Volume2 className="w-5 h-5" />
                    )}
                  </button>

                  {/* Contador de Tempo */}
                  <span className="font-mono text-slate-300 text-[11px] sm:text-xs">
                    {currentTime} / {duration}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2">
                  {/* Botão de Velocidade (1x, 1.25x, 1.5x, 2x) */}
                  <button
                    onClick={cycleSpeed}
                    className="px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 active:scale-95 font-bold text-xs flex items-center gap-1 transition-all border border-white/10 text-white"
                    title="Alternar velocidade"
                  >
                    <Gauge className="w-3.5 h-3.5 text-blue-400" />
                    <span>{playbackRate}x</span>
                  </button>

                  {/* Reiniciar */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (videoRef.current) {
                        videoRef.current.currentTime = 0;
                        videoRef.current.play();
                        setIsPlaying(true);
                      }
                    }}
                    className="p-1.5 rounded-lg hover:bg-white/10 active:scale-95 transition-all hidden sm:flex text-white hover:text-blue-400"
                    title="Reiniciar vídeo"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  {/* TELA CHEIA */}
                  <button
                    onClick={toggleFullscreen}
                    className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-blue-600/90 hover:bg-blue-600 active:scale-95 font-semibold text-xs flex items-center gap-1.5 text-white transition-all shadow-md"
                    title="Assistir em Tela Cheia"
                  >
                    <Maximize2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Tela Cheia</span>
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Placeholder */
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 select-none">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-xl shadow-blue-500/40 mb-3">
              <Play className="w-8 h-8 ml-1 fill-white" />
            </div>
            <p className="text-white font-bold text-base md:text-lg max-w-md">
              Vídeo Tutorial de Ativação
            </p>
          </div>
        )}
      </div>

      {/* ─── BARRA DE ATALHOS RÁPIDOS PARA CELULAR (LOGO ABAIXO DO VÍDEO) ─── */}
      <div className="w-full flex flex-wrap items-center justify-between gap-2 mt-3 px-1">
        {/* Botão de Tela Cheia / Deitar Celular */}
        <button
          onClick={toggleFullscreen}
          className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-98 text-white text-xs sm:text-sm font-bold shadow-md border border-slate-700/60 transition-all cursor-pointer"
        >
          <Maximize2 className="w-4 h-4 text-blue-400" />
          <span>Tela Cheia / Girar Celular</span>
          <Smartphone className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
        </button>

        {/* Seletor Rápido de Velocidade */}
        <div className="flex items-center gap-1 bg-white border border-slate-200 p-1 rounded-xl shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 px-2 flex items-center gap-1">
            <Gauge className="w-3 h-3 text-slate-400" />
            Velocidade:
          </span>
          {SPEED_OPTIONS.map((rate) => (
            <button
              key={rate}
              onClick={(e) => setSpeed(rate, e)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                playbackRate === rate
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {rate === 1.5 ? "1.5x 🔥" : `${rate}x`}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
