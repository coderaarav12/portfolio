"use client";

import React, { useState, useEffect, useRef } from "react";
import { Music, Play, Pause, Volume2, VolumeX } from "lucide-react";

export default function SoundscapePlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <>
      <audio
        ref={audioRef}
        src="/ambient-music.mp3"
        loop
        preload="auto"
      />

      <div className="soundscape-bar">
        <button
          onClick={togglePlay}
          style={{
            background: isPlaying
              ? "linear-gradient(135deg, #0284c7, #38bdf8)"
              : "rgba(255, 255, 255, 0.08)",
            border: "none",
            borderRadius: "50%",
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
            cursor: "pointer",
            boxShadow: isPlaying ? "0 0 14px rgba(56, 189, 248, 0.45)" : "none",
            transition: "all 0.2s"
          }}
          title={isPlaying ? "Pause Soundscape" : "Play Ambient Lofi (Empty Mind • CC0)"}
        >
          {isPlaying ? <Pause size={13} /> : <Play size={13} style={{ marginLeft: "2px" }} />}
        </button>

        <div style={{ display: "flex", flexDirection: "column", minWidth: "120px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#f8fafc" }}>
              Empty Mind
            </span>
            {isPlaying && (
              <div style={{ display: "flex", alignItems: "center", height: "10px" }}>
                <span className="equalizer-bar" />
                <span className="equalizer-bar" />
                <span className="equalizer-bar" />
              </div>
            )}
          </div>
          <span style={{ fontSize: "0.68rem", color: "#38bdf8" }}>
            Royalty-Free Lofi • CC0
          </span>
        </div>

        <button
          onClick={toggleMute}
          style={{
            background: "transparent",
            border: "none",
            color: "#94a3b8",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            padding: "4px"
          }}
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
        </button>
      </div>
    </>
  );
}
