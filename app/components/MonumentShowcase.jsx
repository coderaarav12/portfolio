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
  Layers,
  Lock,
  Calendar,
  BookOpen,
  CheckCircle2,
  Clock
} from "lucide-react";

export default function MonumentShowcase() {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

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

  return (
    <section className="monument-section" style={{ position: "relative", padding: "120px 24px" }}>
      {/* Background soft aura */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "70vw",
          height: "50vh",
          background: "radial-gradient(circle, rgba(56, 189, 248, 0.07) 0%, transparent 70%)",
          filter: "blur(80px)",
          pointerEvents: "none",
          zIndex: 0
        }}
      />

      <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>
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
            Stage 03 // Flagship Monument
          </span>
          <span style={{ fontSize: "0.82rem", color: "#64748b" }}>
            Autonomous University Infrastructure
          </span>
        </div>

        {/* Title & Philosophy */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px", alignItems: "flex-end", marginBottom: "36px" }}>
          <div>
            <h2
              style={{
                fontSize: "clamp(2.5rem, 5.5vw, 4.2rem)",
                lineHeight: 1.05,
                fontWeight: 800,
                letterSpacing: "-0.03em",
                margin: "0 0 14px 0",
                color: "#ffffff"
              }}
            >
              Edutech<span style={{ color: "#38bdf8" }}>SRM</span>
            </h2>
            <p
              style={{
                fontSize: "1.1rem",
                color: "#cbd5e1",
                maxWidth: "600px",
                lineHeight: 1.5,
                margin: 0
              }}
            >
              Built from scratch to unify fragmented university portals into a single high-speed dashboard for 250+ engineering students.
            </p>
          </div>

          {/* Action CTAs */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "flex-start" }}>
            <a
              href="https://edutechsrm.dpdns.org"
              target="_blank"
              rel="noreferrer"
              className="btn-primary"
              style={{
                padding: "13px 26px",
                fontSize: "0.92rem",
                background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
                boxShadow: "0 0 25px rgba(14, 165, 233, 0.35)",
                border: "1px solid rgba(56, 189, 248, 0.4)"
              }}
            >
              <span>Launch Live System</span>
              <ArrowUpRight size={16} />
            </a>

            <button
              onClick={handleCopyCreds}
              className="btn-secondary"
              style={{ padding: "13px 20px", fontSize: "0.9rem" }}
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

        {/* ==================== THE LIVE DASHBOARD MOCKUP ==================== */}
        <div
          className="glass-panel"
          style={{
            background: "rgba(10, 14, 23, 0.9)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.7)",
            marginBottom: "36px"
          }}
        >
          {/* Browser Window Chrome */}
          <div
            style={{
              padding: "12px 18px",
              background: "rgba(15, 23, 42, 0.8)",
              borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px"
            }}
          >
            {/* Traffic Lights */}
            <div style={{ display: "flex", gap: "7px" }}>
              <span style={{ width: "11px", height: "11px", borderRadius: "50%", background: "#ef4444", opacity: 0.85 }} />
              <span style={{ width: "11px", height: "11px", borderRadius: "50%", background: "#f59e0b", opacity: 0.85 }} />
              <span style={{ width: "11px", height: "11px", borderRadius: "50%", background: "#10b981", opacity: 0.85 }} />
            </div>

            {/* Address Bar */}
            <div
              style={{
                flex: "1",
                maxWidth: "480px",
                margin: "0 auto",
                background: "rgba(0, 0, 0, 0.4)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "8px",
                padding: "6px 14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                fontSize: "0.76rem",
                color: "#94a3b8",
                fontFamily: "var(--font-mono, monospace)"
              }}
            >
              <Lock size={12} color="#34d399" />
              <span>https://edutechsrm.dpdns.org/portal</span>
            </div>

            {/* Live Indicator */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.72rem", color: "#34d399", fontWeight: 600 }}>
              <span className="status-pulse-dot" style={{ width: "7px", height: "7px" }} />
              <span>250+ ACTIVE</span>
            </div>
          </div>

          {/* Inner Simulated Dashboard */}
          <div style={{ padding: "28px" }}>
            {/* Student Welcome Banner */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "16px",
                background: "rgba(255, 255, 255, 0.025)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
                borderRadius: "14px",
                padding: "18px 24px",
                marginBottom: "24px"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <img
                  src="/aarav-avatar.png"
                  alt="Aarav Goel"
                  style={{ width: "44px", height: "44px", borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(56, 189, 248, 0.5)" }}
                />
                <div>
                  <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "#f8fafc" }}>
                    Aarav Goel
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "#94a3b8" }}>
                    B.Tech CSE (AI & ML) • Semester 3 • SRMIST Kattankulathur
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <span
                  style={{
                    fontSize: "0.76rem",
                    padding: "6px 12px",
                    borderRadius: "8px",
                    background: "rgba(52, 211, 153, 0.1)",
                    border: "1px solid rgba(52, 211, 153, 0.25)",
                    color: "#6ee7b7",
                    fontWeight: 600
                  }}
                >
                  CGPA: 6.86 (Year 1)
                </span>
                <span
                  style={{
                    fontSize: "0.76rem",
                    padding: "6px 12px",
                    borderRadius: "8px",
                    background: "rgba(56, 189, 248, 0.1)",
                    border: "1px solid rgba(56, 189, 248, 0.25)",
                    color: "#38bdf8",
                    fontWeight: 600
                  }}
                >
                  Attendance: 92.4%
                </span>
              </div>
            </div>

            {/* Dashboard 3-Column Highlights */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "18px"
              }}
            >
              {/* Upcoming Examination Schedule */}
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                  borderRadius: "12px",
                  padding: "18px"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#38bdf8", fontSize: "0.82rem", fontWeight: 700, marginBottom: "12px" }}>
                  <Calendar size={15} />
                  <span>INTERNAL EXAM SCHEDULE</span>
                </div>
                <div style={{ display: "grid", gap: "8px", fontSize: "0.8rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 10px", background: "rgba(0, 0, 0, 0.25)", borderRadius: "8px" }}>
                    <span>Design & Analysis of Algorithms</span>
                    <strong style={{ color: "#38bdf8" }}>TP-402</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 10px", background: "rgba(0, 0, 0, 0.25)", borderRadius: "8px" }}>
                    <span>Artificial Intelligence Principles</span>
                    <strong style={{ color: "#38bdf8" }}>UB-601</strong>
                  </div>
                </div>
              </div>

              {/* Real-time Syllabus Parser */}
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                  borderRadius: "12px",
                  padding: "18px"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#34d399", fontSize: "0.82rem", fontWeight: 700, marginBottom: "12px" }}>
                  <BookOpen size={15} />
                  <span>AUTOMATED SYLLABUS DIGEST</span>
                </div>
                <div style={{ display: "grid", gap: "8px", fontSize: "0.8rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 10px", background: "rgba(0, 0, 0, 0.25)", borderRadius: "8px" }}>
                    <span>Unit 3: Dynamic Programming</span>
                    <span style={{ color: "#34d399", fontWeight: 600 }}>Synced</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 10px", background: "rgba(0, 0, 0, 0.25)", borderRadius: "8px" }}>
                    <span>Unit 4: Supervised Learning Kernels</span>
                    <span style={{ color: "#34d399", fontWeight: 600 }}>Synced</span>
                  </div>
                </div>
              </div>

              {/* Edge Cache & Performance */}
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                  borderRadius: "12px",
                  padding: "18px"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#f59e0b", fontSize: "0.82rem", fontWeight: 700, marginBottom: "12px" }}>
                  <Zap size={15} />
                  <span>EDGE TELEMETRY</span>
                </div>
                <div style={{ display: "grid", gap: "6px", fontSize: "0.82rem", color: "#cbd5e1" }}>
                  <div>Latency: <strong style={{ color: "#34d399" }}>42ms</strong> via Cloudflare</div>
                  <div>Cache Hit Ratio: <strong style={{ color: "#38bdf8" }}>96.8%</strong></div>
                  <div>Concurrent Sessions: <strong style={{ color: "#f8fafc" }}>250+ Verified</strong></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Architecture Specifications */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px"
          }}
        >
          <div className="glass-panel" style={{ padding: "24px", background: "rgba(10, 15, 26, 0.75)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#38bdf8", fontWeight: 700, fontSize: "0.95rem", marginBottom: "8px" }}>
              <Layers size={16} />
              <span>Next.js 16 Client Edge</span>
            </div>
            <p style={{ margin: 0, fontSize: "0.84rem", color: "#cbd5e1", lineHeight: 1.6 }}>
              Instant client-side route caching, offline syllabus persistence, and responsive UI built for students under high exam-week stress.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: "24px", background: "rgba(10, 15, 26, 0.75)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#f59e0b", fontWeight: 700, fontSize: "0.95rem", marginBottom: "8px" }}>
              <Zap size={16} />
              <span>Cloudflare Edge Workers</span>
            </div>
            <p style={{ margin: 0, fontSize: "0.84rem", color: "#cbd5e1", lineHeight: 1.6 }}>
              Distributed proxy caching notice digests and handling sudden exam-result traffic spikes with zero server downtime.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: "24px", background: "rgba(10, 15, 26, 0.75)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#34d399", fontWeight: 700, fontSize: "0.95rem", marginBottom: "8px" }}>
              <Cpu size={16} />
              <span>FastAPI Python Workers</span>
            </div>
            <p style={{ margin: 0, fontSize: "0.84rem", color: "#cbd5e1", lineHeight: 1.6 }}>
              Automated background parsers that securely normalize timetables, exam room allocations, and marks from legacy campus servers.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
