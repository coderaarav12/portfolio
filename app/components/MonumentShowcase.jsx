"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import confetti from "canvas-confetti";
import {
  ExternalLink,
  Copy,
  Check,
  Server,
  Zap,
  ShieldCheck,
  Users,
  Terminal,
  ArrowUpRight,
  Database,
  Cpu,
  Layers
} from "lucide-react";

export default function MonumentShowcase() {
  const [copied, setCopied] = useState(false);
  const [activeArchStep, setActiveArchStep] = useState(0);

  const handleCopyCreds = () => {
    navigator.clipboard.writeText("dm1234 / edutechsrm@124");
    setCopied(true);
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.7 },
      colors: ["#38bdf8", "#34d399", "#818cf8"]
    });
    setTimeout(() => setCopied(false), 2600);
  };

  const architectureLayers = [
    {
      title: "Client Layer",
      subtitle: "Next.js 16 & React 19 PWA",
      desc: "Instant client-side route caching, offline syllabus persistence, and responsive UI built for SRMIST students under high exam-week stress.",
      icon: <Layers size={18} color="#38bdf8" />
    },
    {
      title: "Edge Gateway",
      subtitle: "Cloudflare Workers & KV",
      desc: "Distributed serverless proxy that caches university notice digests and handles sudden concurrency spikes without server thrashing.",
      icon: <Zap size={18} color="#f59e0b" />
    },
    {
      title: "Scraper Core",
      subtitle: "FastAPI & Python Workers",
      desc: "Automated parsers that extract timetables, exam room seatings, and syllabus revisions from legacy academic databases.",
      icon: <Cpu size={18} color="#34d399" />
    }
  ];

  return (
    <section className="monument-section" style={{ position: "relative", padding: "120px 24px" }}>
      {/* Background radial glow */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "70vw",
          height: "60vh",
          background: "radial-gradient(circle, rgba(56, 189, 248, 0.08) 0%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
          zIndex: 0
        }}
      />

      <div style={{ maxWidth: "1140px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Section Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
          <span
            style={{
              fontSize: "0.75rem",
              fontFamily: "var(--font-mono, monospace)",
              letterSpacing: "0.1em",
              color: "#38bdf8",
              textTransform: "uppercase",
              background: "rgba(56, 189, 248, 0.1)",
              border: "1px solid rgba(56, 189, 248, 0.25)",
              padding: "4px 12px",
              borderRadius: "9999px"
            }}
          >
            Stage 03 • The Monument
          </span>
          <span style={{ fontSize: "0.82rem", color: "#64748b" }}>
            Flagship Engineering Project
          </span>
        </div>

        {/* Title & Philosophy */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "30px", alignItems: "flex-end", marginBottom: "40px" }}>
          <div>
            <h2
              style={{
                fontSize: "clamp(2.8rem, 6vw, 4.8rem)",
                lineHeight: 1.02,
                fontWeight: 900,
                letterSpacing: "-0.03em",
                margin: "0 0 16px 0",
                color: "#ffffff"
              }}
            >
              EDUTECH<span style={{ color: "#38bdf8" }}>SRM</span>
            </h2>
            <p
              style={{
                fontSize: "1.2rem",
                color: "#cbd5e1",
                maxWidth: "600px",
                lineHeight: 1.5,
                margin: 0
              }}
            >
              The unified academic platform built from scratch to replace fragmented portals for 250+ SRMIST students.
            </p>
          </div>

          {/* Action CTAs */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", justifyContent: "flex-start" }}>
            <a
              href="https://edutechsrm.dpdns.org"
              target="_blank"
              rel="noreferrer"
              className="btn-primary"
              style={{
                padding: "14px 28px",
                fontSize: "0.95rem",
                background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
                boxShadow: "0 0 30px rgba(14, 165, 233, 0.35)",
                border: "1px solid rgba(56, 189, 248, 0.5)"
              }}
            >
              <span>Launch Live System</span>
              <ArrowUpRight size={18} />
            </a>

            <button
              onClick={handleCopyCreds}
              className="btn-secondary"
              style={{ padding: "14px 22px", fontSize: "0.92rem" }}
            >
              {copied ? (
                <>
                  <Check size={16} color="#34d399" />
                  <span style={{ color: "#34d399" }}>Copied: dm1234 / edutechsrm@124</span>
                </>
              ) : (
                <>
                  <Copy size={16} />
                  <span>Copy Demo Login</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Big Highlight Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "24px",
            marginBottom: "36px"
          }}
        >
          {/* Left: System Architecture Panel */}
          <div
            className="glass-panel"
            style={{
              padding: "32px",
              background: "rgba(10, 15, 26, 0.8)",
              border: "1px solid rgba(255, 255, 255, 0.12)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
              <Server size={18} color="#38bdf8" />
              <h3 style={{ fontSize: "1.1rem", margin: 0, fontWeight: 700 }}>
                High-Reliability Architecture
              </h3>
            </div>

            <div style={{ display: "grid", gap: "14px" }}>
              {architectureLayers.map((layer, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveArchStep(idx)}
                  style={{
                    padding: "16px 20px",
                    borderRadius: "14px",
                    background:
                      activeArchStep === idx
                        ? "rgba(56, 189, 248, 0.12)"
                        : "rgba(255, 255, 255, 0.03)",
                    border:
                      activeArchStep === idx
                        ? "1px solid rgba(56, 189, 248, 0.4)"
                        : "1px solid rgba(255, 255, 255, 0.06)",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                    {layer.icon}
                    <span style={{ fontWeight: 700, fontSize: "0.92rem", color: "#f8fafc" }}>
                      {layer.title}
                    </span>
                    <span style={{ fontSize: "0.76rem", color: "#94a3b8" }}>
                      ({layer.subtitle})
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#cbd5e1", lineHeight: 1.5 }}>
                    {layer.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Real-World Metrics & Problem Solving */}
          <div
            className="glass-panel"
            style={{
              padding: "32px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              background: "rgba(10, 15, 26, 0.8)",
              border: "1px solid rgba(255, 255, 255, 0.12)"
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
                <ShieldCheck size={18} color="#34d399" />
                <h3 style={{ fontSize: "1.1rem", margin: 0, fontWeight: 700 }}>
                  Impact & Production Proof
                </h3>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                  marginBottom: "24px"
                }}
              >
                <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "16px", borderRadius: "12px" }}>
                  <div style={{ fontSize: "2.2rem", fontWeight: 900, color: "#34d399", lineHeight: 1 }}>
                    250+
                  </div>
                  <div style={{ fontSize: "0.82rem", color: "#cbd5e1", marginTop: "6px", fontWeight: 600 }}>
                    Active Students
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "#94a3b8" }}>
                    Verified campus accounts
                  </div>
                </div>

                <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "16px", borderRadius: "12px" }}>
                  <div style={{ fontSize: "2.2rem", fontWeight: 900, color: "#38bdf8", lineHeight: 1 }}>
                    100+
                  </div>
                  <div style={{ fontSize: "0.82rem", color: "#cbd5e1", marginTop: "6px", fontWeight: 600 }}>
                    Daily Requests
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "#94a3b8" }}>
                    Syllabus & exam traffic
                  </div>
                </div>
              </div>

              <p style={{ fontSize: "0.9rem", color: "#cbd5e1", lineHeight: 1.6, margin: 0 }}>
                "Before EdutechSRM, students had to navigate 4 different outdated portals to see their internal marks, syllabus guidelines, and class schedules. I built a single automated interface with sub-100ms latency that just works."
              </p>
            </div>

            {/* Test Credentials Terminal Card */}
            <div
              style={{
                marginTop: "24px",
                background: "rgba(0, 0, 0, 0.4)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                padding: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontFamily: "var(--font-mono, monospace)"
              }}
            >
              <div>
                <div style={{ fontSize: "0.72rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Official Demo Credentials
                </div>
                <div style={{ fontSize: "0.86rem", color: "#38bdf8", fontWeight: 600, marginTop: "2px" }}>
                  ID: dm1234 &nbsp;|&nbsp; Pass: edutechsrm@124
                </div>
              </div>

              <button
                onClick={handleCopyCreds}
                style={{
                  background: copied ? "#34d399" : "rgba(255, 255, 255, 0.1)",
                  border: "none",
                  color: copied ? "#000" : "#fff",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "0.76rem",
                  fontWeight: 600,
                  transition: "all 0.2s"
                }}
              >
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
