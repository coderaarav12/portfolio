"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Cpu, Zap, Radio, Check } from "lucide-react";

export default function WorldLoader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const statuses = [
    "Initializing Three.js WebGL & Studio Shaders...",
    "Calibrating Gravitational Kinematics & Iridescence...",
    "Syncing EdutechSRM Production Gateway (edutechsrm.in)...",
    "Arming Cyberpunk Synthesizer Soundscape...",
    "Aarav Goel's World Ready."
  ];

  useEffect(() => {
    const startTime = Date.now();
    const duration = 1350; // Snappy, cinematic load

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(currentProgress);

      const nextStatus = Math.min(
        statuses.length - 1,
        Math.floor((currentProgress / 100) * statuses.length)
      );
      setStatusIndex(nextStatus);

      if (currentProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsLoaded(true);
          if (onComplete) onComplete();
        }, 150);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isLoaded && (
        <motion.div
          key="world-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "#05070d",
            pointerEvents: isLoaded ? "none" : "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            overflow: "hidden"
          }}
        >
          {/* Subtle background glow */}
          <div
            style={{
              position: "absolute",
              width: "500px",
              height: "500px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(56, 189, 248, 0.12) 0%, rgba(168, 85, 247, 0.08) 50%, transparent 70%)",
              filter: "blur(60px)",
              pointerEvents: "none"
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              maxWidth: "520px",
              width: "100%"
            }}
          >
            {/* Top System Pill */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 14px",
                borderRadius: "9999px",
                background: "rgba(15, 23, 42, 0.8)",
                border: "1px solid rgba(56, 189, 248, 0.3)",
                fontSize: "0.74rem",
                color: "#38bdf8",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                fontFamily: "var(--font-mono, monospace)",
                marginBottom: "28px"
              }}
            >
              <span className="status-pulse-dot" />
              SYSTEM BOOT SEQUENCE // V3.9
            </motion.div>

            {/* Central Animated Gyroscopic Ring */}
            <div
              style={{
                position: "relative",
                width: "130px",
                height: "130px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "32px"
              }}
            >
              {/* Outer rotating ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  border: "2px dashed rgba(56, 189, 248, 0.4)",
                  boxShadow: "0 0 25px rgba(56, 189, 248, 0.2)"
                }}
              />

              {/* Inner counter-rotating ring */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                style={{
                  position: "absolute",
                  inset: "12px",
                  borderRadius: "50%",
                  border: "1.5px solid rgba(168, 85, 247, 0.5)",
                  borderTopColor: "transparent",
                  borderBottomColor: "transparent"
                }}
              />

              {/* Central Progress Percentage */}
              <div style={{ textAlign: "center", zIndex: 3 }}>
                <span
                  style={{
                    fontSize: "1.85rem",
                    fontWeight: 900,
                    letterSpacing: "-0.04em",
                    color: "#ffffff",
                    fontFamily: "var(--font-mono, monospace)"
                  }}
                >
                  {progress}%
                </span>
              </div>
            </div>

            {/* Cinematic Main Title */}
            <motion.h1
              initial={{ opacity: 0.9, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                fontSize: "clamp(1.6rem, 4.5vw, 2.4rem)",
                fontWeight: 900,
                color: "#ffffff",
                letterSpacing: "-0.03em",
                margin: "0 0 10px 0",
                textShadow: "0 2px 20px rgba(56, 189, 248, 0.45)"
              }}
            >
              Entering Aarav Goel&apos;s World
            </motion.h1>

            <p
              style={{
                fontSize: "0.92rem",
                fontWeight: 500,
                color: "#cbd5e1",
                margin: "0 0 24px 0",
                letterSpacing: "-0.01em"
              }}
            >
              AI/ML Engineer &bull; Systems Architect &bull; SRMIST KTR &apos;29
            </p>

            {/* Progress Bar Container */}
            <div
              style={{
                width: "100%",
                height: "5px",
                background: "rgba(255, 255, 255, 0.08)",
                borderRadius: "9999px",
                overflow: "hidden",
                marginBottom: "16px",
                border: "1px solid rgba(255, 255, 255, 0.06)"
              }}
            >
              <motion.div
                style={{
                  height: "100%",
                  width: `${progress}%`,
                  background: "linear-gradient(90deg, #38bdf8 0%, #a855f7 50%, #34d399 100%)",
                  boxShadow: "0 0 12px rgba(56, 189, 248, 0.7)"
                }}
              />
            </div>

            {/* Live Ticker Status */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "0.76rem",
                color: "#7dd3fc",
                fontFamily: "var(--font-mono, monospace)",
                minHeight: "20px"
              }}
            >
              <Zap size={13} color="#38bdf8" />
              <span>{statuses[statusIndex]}</span>
            </div>

            {/* Skip Button */}
            <button
              onClick={() => {
                setIsLoaded(true);
                if (onComplete) onComplete();
              }}
              style={{
                marginTop: "32px",
                background: "transparent",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                color: "#64748b",
                padding: "6px 14px",
                borderRadius: "6px",
                fontSize: "0.72rem",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#94a3b8";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#64748b";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.12)";
              }}
            >
              Skip Intro &rarr;
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
