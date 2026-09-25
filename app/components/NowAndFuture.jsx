"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import confetti from "canvas-confetti";
import {
  Radio,
  Flame,
  BookOpen,
  Sparkles,
  ArrowUpRight,
  Mail,
  Phone,
  Copy,
  Check,
  Compass,
  Film,
  Trophy,
  Waves
} from "lucide-react";

function GithubIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function LinkedinIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export default function NowAndFuture() {
  const [copiedItem, setCopiedItem] = useState(null);

  const handleCopy = (text, itemKey) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(itemKey);
    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.8 },
      colors: ["#38bdf8", "#818cf8", "#34d399"]
    });
    setTimeout(() => setCopiedItem(null), 2500);
  };

  return (
    <div className="now-future-container" style={{ position: "relative" }}>
      {/* ==================== STAGE 07: NOW (LIVE TELEMETRY) ==================== */}
      <section style={{ padding: "100px 24px", position: "relative" }}>
        <div style={{ maxWidth: "1140px", margin: "0 auto" }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <span
              style={{
                fontSize: "0.75rem",
                fontFamily: "var(--font-mono, monospace)",
                letterSpacing: "0.1em",
                color: "#34d399",
                textTransform: "uppercase",
                background: "rgba(52, 211, 153, 0.1)",
                border: "1px solid rgba(52, 211, 153, 0.25)",
                padding: "4px 12px",
                borderRadius: "9999px",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <span className="status-pulse-dot" />
              Stage 07 • Live Telemetry
            </span>
            <span style={{ fontSize: "0.82rem", color: "#64748b" }}>
              Active Focus & Status
            </span>
          </div>

          <h2 style={{ fontSize: "clamp(2.4rem, 5vw, 3.6rem)", fontWeight: 800, margin: "0 0 32px 0", color: "#ffffff" }}>
            What I'm Doing <span style={{ color: "#34d399" }}>Right Now</span>
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "20px"
            }}
          >
            {/* Building Tile */}
            <div
              className="glass-panel"
              style={{
                padding: "28px",
                background: "rgba(10, 15, 26, 0.8)",
                border: "1px solid rgba(255, 255, 255, 0.1)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px", color: "#38bdf8" }}>
                <Flame size={18} />
                <span style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Building
                </span>
              </div>
              <h3 style={{ fontSize: "1.15rem", margin: "0 0 8px 0", color: "#f8fafc" }}>
                Resilient AI Microservices
              </h3>
              <p style={{ margin: 0, fontSize: "0.86rem", color: "#cbd5e1", lineHeight: 1.6 }}>
                Scaling EdutechSRM for the next semester exams while refining offline mesh routing algorithms for low-connectivity environments.
              </p>
            </div>

            {/* Learning Tile */}
            <div
              className="glass-panel"
              style={{
                padding: "28px",
                background: "rgba(10, 15, 26, 0.8)",
                border: "1px solid rgba(255, 255, 255, 0.1)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px", color: "#818cf8" }}>
                <BookOpen size={18} />
                <span style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Learning
                </span>
              </div>
              <h3 style={{ fontSize: "1.15rem", margin: "0 0 8px 0", color: "#f8fafc" }}>
                Distributed Systems & RDMA
              </h3>
              <p style={{ margin: 0, fontSize: "0.86rem", color: "#cbd5e1", lineHeight: 1.6 }}>
                Deep-diving into high-throughput kernel bypassing, model quantization architectures, and multi-agent coordination frameworks.
              </p>
            </div>

            {/* Campus Leadership Tile */}
            <div
              className="glass-panel"
              style={{
                padding: "28px",
                background: "rgba(10, 15, 26, 0.8)",
                border: "1px solid rgba(255, 255, 255, 0.1)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px", color: "#34d399" }}>
                <Sparkles size={18} />
                <span style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Leadership
                </span>
              </div>
              <h3 style={{ fontSize: "1.15rem", margin: "0 0 8px 0", color: "#f8fafc" }}>
                SRM Alumni Affairs & E-Cell
              </h3>
              <p style={{ margin: 0, fontSize: "0.86rem", color: "#cbd5e1", lineHeight: 1.6 }}>
                Managing global digital alumni campaigns and orchestrating web development workflows for flagship university hackathons.
              </p>
            </div>

            {/* Personal Life & Creative */}
            <div
              className="glass-panel"
              style={{
                padding: "28px",
                background: "rgba(10, 15, 26, 0.8)",
                border: "1px solid rgba(255, 255, 255, 0.1)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px", color: "#f59e0b" }}>
                <Compass size={18} />
                <span style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Life & Craft
                </span>
              </div>
              <h3 style={{ fontSize: "1.15rem", margin: "0 0 8px 0", color: "#f8fafc" }}>
                Novels, Film & Athletics
              </h3>
              <p style={{ margin: 0, fontSize: "0.86rem", color: "#cbd5e1", lineHeight: 1.6 }}>
                Video editing with Premiere Pro, competitive swimming, lawn tennis, and reading classic science fiction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== STAGE 08: THE HORIZON (FUTURE) ==================== */}
      <section
        style={{
          padding: "140px 24px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <span
            style={{
              fontSize: "0.75rem",
              fontFamily: "var(--font-mono, monospace)",
              letterSpacing: "0.15em",
              color: "#94a3b8",
              textTransform: "uppercase"
            }}
          >
            Stage 08 • The Horizon
          </span>

          <h2
            style={{
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              fontWeight: 900,
              lineHeight: 1.1,
              margin: "24px 0 20px 0",
              color: "#ffffff",
              letterSpacing: "-0.03em"
            }}
          >
            "Still building."
          </h2>

          <p
            style={{
              fontSize: "1.1rem",
              color: "#94a3b8",
              lineHeight: 1.6,
              maxWidth: "540px",
              margin: "0 auto"
            }}
          >
            Technology evolves weekly. The builders who endure are those who never lose their curiosity to break things, measure reality, and construct solutions that serve real people.
          </p>
        </div>
      </section>

      {/* ==================== STAGE 09: DESTINATION / CONTACT TERMINAL ==================== */}
      <section
        id="contact"
        style={{
          padding: "120px 24px",
          position: "relative",
          borderTop: "1px solid rgba(255, 255, 255, 0.08)"
        }}
      >
        <div style={{ maxWidth: "1000px", margin: "0 auto", textAlign: "center" }}>
          <span
            style={{
              fontSize: "0.75rem",
              fontFamily: "var(--font-mono, monospace)",
              letterSpacing: "0.1em",
              color: "#38bdf8",
              textTransform: "uppercase",
              background: "rgba(56, 189, 248, 0.1)",
              border: "1px solid rgba(56, 189, 248, 0.25)",
              padding: "4px 14px",
              borderRadius: "9999px",
              display: "inline-block",
              marginBottom: "16px"
            }}
          >
            Destination • Transmission Terminal
          </span>

          <h2
            style={{
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              margin: "0 0 20px 0",
              color: "#ffffff"
            }}
          >
            Let's build something <span style={{ color: "#38bdf8" }}>extraordinary.</span>
          </h2>

          <p
            style={{
              fontSize: "1.1rem",
              color: "#cbd5e1",
              maxWidth: "600px",
              margin: "0 auto 40px auto",
              lineHeight: 1.6
            }}
          >
            Whether you want to discuss full-stack AI engineering, collaborate on an ambitious hackathon platform, or offer an internship opportunity, my inbox is open.
          </p>

          {/* Action Hub */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "16px",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "60px"
            }}
          >
            <a
              href="mailto:goelaarav290@gmail.com"
              className="btn-primary"
              style={{
                padding: "16px 32px",
                fontSize: "1rem",
                background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
                boxShadow: "0 0 30px rgba(14, 165, 233, 0.35)",
                border: "1px solid rgba(56, 189, 248, 0.5)"
              }}
            >
              <Mail size={18} />
              <span>goelaarav290@gmail.com</span>
            </a>

            <button
              onClick={() => handleCopy("+91 9500554947", "phone")}
              className="btn-secondary"
              style={{ padding: "16px 26px", fontSize: "0.95rem" }}
            >
              {copiedItem === "phone" ? (
                <>
                  <Check size={18} color="#34d399" />
                  <span style={{ color: "#34d399" }}>Copied Phone!</span>
                </>
              ) : (
                <>
                  <Phone size={18} />
                  <span>+91 950055 4947</span>
                </>
              )}
            </button>

            <a
              href="https://github.com/coderaarav12"
              target="_blank"
              rel="noreferrer"
              className="btn-secondary"
              style={{ padding: "16px 22px" }}
              title="GitHub Profile"
            >
              <GithubIcon size={18} />
              <span>GitHub</span>
            </a>

            <a
              href="https://linkedin.com/in/aaravgoel12"
              target="_blank"
              rel="noreferrer"
              className="btn-secondary"
              style={{ padding: "16px 22px" }}
              title="LinkedIn Profile"
            >
              <LinkedinIcon size={18} />
              <span>LinkedIn</span>
            </a>
          </div>

          {/* Terminal Spec Strip */}
          <div
            style={{
              padding: "20px 24px",
              borderRadius: "14px",
              background: "rgba(0, 0, 0, 0.4)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "16px",
              fontFamily: "var(--font-mono, monospace)",
              fontSize: "0.78rem",
              color: "#94a3b8"
            }}
          >
            <div>
              <span style={{ color: "#34d399" }}>●</span> OPERATIONAL STATUS: AVAILABLE FOR INTERNSHIPS
            </div>
            <div>
              HOSTED AT: CLOUDFLARE EDGE WORKERS (CUSTOM ENGINE)
            </div>
            <div>
              ORIGIN: SRMIST KTR CHENNAI (UTC+05:30)
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer
        style={{
          borderTop: "1px solid rgba(255, 255, 255, 0.06)",
          padding: "32px 24px",
          color: "#64748b",
          fontSize: "0.82rem"
        }}
      >
        <div
          style={{
            maxWidth: "1140px",
            margin: "0 auto",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px"
          }}
        >
          <div>
            Aarav Goel © {new Date().getFullYear()} • Engineered with Next.js, Three.js & Cloudflare
          </div>
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <a href="/activity" style={{ color: "#38bdf8", textDecoration: "none" }}>
              Activity Telemetry
            </a>
            <span>•</span>
            <a href="/app_tutorials" style={{ color: "#94a3b8", textDecoration: "none" }}>
              Tutorials Vault
            </a>
            <span>•</span>
            <a href="#about" style={{ color: "#94a3b8", textDecoration: "none" }}>
              Top ↑
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
