"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ExternalLink, ShieldCheck, Loader2 } from "lucide-react";

// The requested Google Drive folder URL
const DESTINATION_URL = "https://drive.google.com/drive/folders/1gDYo3WZRP6ItngaANJCPS8Q8y2GMKLIN?usp=drive_link";
const WAIT_TIME_MS = 6000; // 6 seconds wait time

export default function AppTutorialsRedirect() {
  const [progress, setProgress] = useState(0);
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  // Check system preference for light/dark mode on mount
  useEffect(() => {
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDarkTheme(prefersDark !== false); // Default to dark if not explicitly light
    
    const listener = (e) => setIsDarkTheme(e.matches);
    if (window.matchMedia) {
      window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", listener);
    }
    return () => {
      if (window.matchMedia) {
        window.matchMedia("(prefers-color-scheme: dark)").removeEventListener("change", listener);
      }
    };
  }, []);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min(100, (elapsed / WAIT_TIME_MS) * 100);
      setProgress(currentProgress);
      
      if (currentProgress >= 100) {
        clearInterval(interval);
        window.location.replace(DESTINATION_URL);
      }
    }, 30);

    return () => clearInterval(interval);
  }, []);

  const themeColors = {
    bg: isDarkTheme ? "#05070d" : "#f8fafc",
    cardBg: isDarkTheme ? "rgba(255, 255, 255, 0.03)" : "#ffffff",
    cardBorder: isDarkTheme ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)",
    textPrimary: isDarkTheme ? "#ffffff" : "#0f172a",
    textSecondary: isDarkTheme ? "#94a3b8" : "#64748b",
    accent: "#38bdf8",
    accentGlow: isDarkTheme ? "rgba(56, 189, 248, 0.25)" : "rgba(56, 189, 248, 0.4)",
    shadow: isDarkTheme ? "0 25px 50px -12px rgba(0,0,0,0.5)" : "0 20px 40px -12px rgba(0,0,0,0.1)",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: themeColors.bg,
        color: themeColors.textPrimary,
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        padding: "24px",
        overflow: "hidden",
        position: "relative",
        transition: "background 0.4s ease, color 0.4s ease"
      }}
    >
      {/* Background Ambient Glow */}
      <motion.div
        animate={{ 
          scale: [1, 1.05, 1],
          opacity: [0.6, 0.8, 0.6]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${themeColors.accentGlow} 0%, transparent 60%)`,
          filter: "blur(60px)",
          pointerEvents: "none",
          zIndex: 0
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "relative",
          zIndex: 10,
          background: themeColors.cardBg,
          border: `1px solid ${themeColors.cardBorder}`,
          borderRadius: "24px",
          padding: "48px 40px",
          maxWidth: "540px",
          width: "100%",
          textAlign: "center",
          backdropFilter: "blur(20px)",
          boxShadow: themeColors.shadow,
        }}
      >
        {/* Animated Icon Section */}
        <div style={{ position: "relative", width: "80px", height: "80px", margin: "0 auto 32px auto", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            style={{
              position: "absolute",
              inset: 0,
              border: `2px dashed ${themeColors.accent}`,
              borderRadius: "50%",
              opacity: 0.4
            }}
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            style={{
              position: "absolute",
              inset: "-12px",
              border: `1px solid ${themeColors.accent}`,
              borderRadius: "50%",
              borderTopColor: "transparent",
              borderBottomColor: "transparent",
              opacity: 0.3
            }}
          />
          <ShieldCheck size={36} color={themeColors.accent} strokeWidth={1.5} />
        </div>

        <h1 style={{ 
          fontSize: "1.75rem", 
          fontWeight: 800, 
          letterSpacing: "-0.03em", 
          margin: "0 0 12px 0",
          background: `linear-gradient(135deg, ${themeColors.textPrimary} 0%, ${themeColors.textSecondary} 100%)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}>
          Aarav Goel&apos;s App Tutorial Assignment Drive Page
        </h1>
        
        <p style={{ 
          fontSize: "1.05rem", 
          color: themeColors.textSecondary, 
          margin: "0 0 36px 0",
          lineHeight: 1.6,
          fontWeight: 500
        }}>
          Establishing secure connection to resources. You will be redirected automatically in a few seconds...
        </p>

        {/* Cinematic Progress Bar */}
        <div style={{ width: "100%", marginBottom: "36px" }}>
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            fontSize: "0.85rem", 
            fontFamily: "'JetBrains Mono', monospace", 
            color: themeColors.textSecondary,
            marginBottom: "8px",
            fontWeight: 600
          }}>
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Loader2 size={14} className="animate-spin" style={{ animation: "spin 1s linear Infinity" }} />
              Routing to Google Drive
            </span>
            <span>{Math.floor(progress)}%</span>
          </div>
          <div style={{ 
            width: "100%", 
            height: "6px", 
            background: isDarkTheme ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)", 
            borderRadius: "999px", 
            overflow: "hidden" 
          }}>
            <motion.div 
              style={{
                height: "100%",
                width: `${progress}%`,
                background: "linear-gradient(90deg, #38bdf8 0%, #818cf8 100%)",
                boxShadow: "0 0 10px rgba(56, 189, 248, 0.5)",
                borderRadius: "999px"
              }}
            />
          </div>
        </div>

        {/* Manual Redirect Button */}
        <a 
          href={DESTINATION_URL}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            padding: "14px 28px",
            background: "linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)",
            color: "#ffffff",
            fontWeight: 600,
            fontSize: "0.95rem",
            textDecoration: "none",
            borderRadius: "999px",
            boxShadow: "0 8px 20px -6px rgba(14, 165, 233, 0.5)",
            transition: "transform 0.2s ease, box-shadow 0.2s ease"
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 12px 25px -6px rgba(14, 165, 233, 0.6)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 8px 20px -6px rgba(14, 165, 233, 0.5)";
          }}
        >
          <span>Continue Immediately</span>
          <ExternalLink size={18} />
        </a>
      </motion.div>
      
      {/* Theme Toggle Button (Bonus for aesthetics) */}
      <button 
        onClick={() => setIsDarkTheme(!isDarkTheme)}
        style={{
          position: "absolute",
          top: "24px",
          right: "24px",
          background: themeColors.cardBg,
          border: `1px solid ${themeColors.cardBorder}`,
          color: themeColors.textPrimary,
          padding: "10px 16px",
          borderRadius: "999px",
          fontSize: "0.85rem",
          fontWeight: 600,
          cursor: "pointer",
          backdropFilter: "blur(10px)",
          zIndex: 20
        }}
      >
        {isDarkTheme ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1.5s linear infinite;
        }
      `}</style>
    </div>
  );
}
