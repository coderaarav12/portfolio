"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import WorldLoader from "./components/WorldLoader";
import HeroScene from "./components/HeroScene";
import SoundscapePlayer from "./components/SoundscapePlayer";
import {
  Sparkles,
  ArrowUpRight,
  ExternalLink,
  Flame,
  Check,
  Copy,
  Layers,
  Cpu,
  Globe,
  Radio,
  Calendar,
  Lock,
  BookOpen,
  Award,
  GraduationCap,
  Briefcase,
  Mail,
  Phone,
  Code2,
  Server,
  Zap
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

export default function PortfolioPage() {
  const [copiedKey, setCopiedKey] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("all");

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.8 },
      colors: ["#38bdf8", "#34d399", "#818cf8"]
    });
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const projects = [
    {
      id: "edutechsrm",
      title: "EdutechSRM Platform",
      tagline: "Live Academic Suite Serving 250+ SRMIST Students",
      tag: "Flagship Production",
      category: "flagship",
      accent: "#38bdf8",
      metrics: "250+ Active Students • 100+ Daily Requests",
      description:
        "Full-stack unified university portal providing sub-100ms access to academic timetables, exam room allocations, and automated syllabus revisions for SRMIST students.",
      tech: ["Next.js 16", "Cloudflare Workers", "FastAPI", "Python", "Tailwind CSS"],
      credentials: "ID: dm1234 | Pass: edutechsrm@124",
      liveUrl: "https://edutechsrm.in",
      githubUrl: "https://github.com/coderaarav12"
    },
    {
      id: "ripple",
      title: "Ripple Emergency Mesh",
      tagline: "Manipal Hackathon '26 Project",
      tag: "Hackathon Project",
      category: "hackathon",
      accent: "#818cf8",
      metrics: "Sub-Second Routing • 0 SMS Gateway Dependency",
      description:
        "Offline-first disaster communication protocol connecting affected populations when cell towers collapse, utilizing direct WebRTC peer-to-peer data channels and OpenStreetMap hazard routing.",
      tech: ["TypeScript", "WebRTC", "Next.js", "Leaflet Maps", "Node.js"],
      credentials: null,
      liveUrl: "https://github.com/coderaarav12",
      githubUrl: "https://github.com/coderaarav12"
    },
    {
      id: "syncmasters",
      title: "SyncMasters GovTech AI",
      tagline: "Smart India Hackathon (SIH 2026)",
      tag: "Multimodal AI",
      category: "ai",
      accent: "#34d399",
      metrics: "Llama 3.2 Vision • 94% Extraction Precision",
      description:
        "Automated government audit pipeline that ingests complex bureaucratic scans, detects financial irregularities using vision LLMs, and synthesizes compliance digests.",
      tech: ["Python", "Llama 3.2 Vision", "FastAPI", "Ollama", "React"],
      credentials: null,
      liveUrl: "https://github.com/coderaarav12",
      githubUrl: "https://github.com/coderaarav12"
    },
    {
      id: "trustos",
      title: "Trust OS AI Integrity",
      tagline: "Enterprise Model Safety & Verification Suite",
      tag: "AI Safety",
      category: "ai",
      accent: "#f59e0b",
      metrics: "Real-Time Toxicity & Hallucination Guardrails",
      description:
        "Comprehensive model evaluation framework providing zero-day prompt-injection defense, toxicity scoring, and hallucination filters for deployed LLM endpoints.",
      tech: ["Python", "FastAPI", "Scikit-learn", "HuggingFace", "Next.js"],
      credentials: null,
      liveUrl: "https://github.com/coderaarav12",
      githubUrl: "https://github.com/coderaarav12"
    },
    {
      id: "activity",
      title: "GitHub Activity Telemetry",
      tagline: "Self-Hosted Contribution Engine",
      tag: "Edge Tooling",
      category: "tools",
      accent: "#ec4899",
      metrics: "270+ Yearly Commits Tracked",
      description:
        "Real-time analytics and contribution heatmap visualizer generating SVG metrics directly on Cloudflare Workers edge nodes.",
      tech: ["Cloudflare Workers", "Next.js", "SVG Engine", "REST API"],
      credentials: null,
      liveUrl: "/activity",
      githubUrl: "https://github.com/coderaarav12/portfolio"
    },
    {
      id: "app_tutorials",
      title: "Developer Vault & Tutorials",
      tagline: "Curated Technical Workshops & Cloud Guides",
      tag: "Knowledge Base",
      category: "tools",
      accent: "#a78bfa",
      metrics: "Direct Cloud Storage",
      description:
        "Centralized repository of architectural walkthroughs, cloud setup scripts, and laboratory documentation maintained for university peers.",
      tech: ["Google Drive Sync", "Cloudflare Edge", "Technical Docs"],
      credentials: null,
      liveUrl: "/app_tutorials",
      githubUrl: "https://github.com/coderaarav12"
    }
  ];

  const filteredProjects = projects.filter((p) => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "flagship") return p.category === "flagship";
    if (selectedFilter === "ai") return p.category === "ai";
    if (selectedFilter === "hackathon") return p.category === "hackathon";
    if (selectedFilter === "tools") return p.category === "tools";
    return true;
  });

  const skillsData = [
    {
      category: "Core Languages",
      items: ["Python", "C++", "JavaScript", "TypeScript", "SQL"]
    },
    {
      category: "AI & Machine Learning",
      items: ["Llama 3.2 Vision", "Ollama Local Engine", "Scikit-learn", "OpenCV", "Prompt Engineering"]
    },
    {
      category: "Web & Edge Infrastructure",
      items: ["Next.js 16", "React 19", "FastAPI", "Cloudflare Workers & KV", "Node.js", "Tailwind CSS"]
    },
    {
      category: "Engineering Tools & Design",
      items: ["Git & GitHub Actions", "Docker Basics", "Adobe Premiere Pro", "After Effects", "Figma"]
    }
  ];

  const certifications = [
    { name: "Google AI Fundamentals", issuer: "Google" },
    { name: "OOP with C++", issuer: "Microsoft" },
    { name: "Python for Data Science & AI", issuer: "IBM" },
    { name: "RDMA Programming Fundamentals", issuer: "NVIDIA" },
    { name: "ENDURO 2025 AI/Robotics", issuer: "IIT Hyderabad" },
    { name: "C++ Programming Certification", issuer: "Simplilearn" },
    { name: "HP LIFE AI & Tech Literacy", issuer: "HP LIFE" }
  ];

  return (
    <div style={{ position: "relative", minHeight: "100vh", background: "#06070a", color: "#f8fafc" }}>
      <WorldLoader />

      {/* Background Atmosphere */}
      <div className="ambient-video-container">
        <video
          className="ambient-video"
          autoPlay
          loop
          muted
          playsInline
          poster="/ambient-poster.jpg"
        >
          <source src="/ambient-bg.mp4" type="video/mp4" />
        </video>
        <div className="ambient-overlay" />
      </div>

      {/* Floating Navigation */}
      <header className="nav-pill-container">
        <nav className="nav-pill">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img
              src="/aarav-avatar.png"
              alt="Aarav Goel"
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "1.5px solid rgba(56, 189, 248, 0.4)"
              }}
            />
            <div>
              <span style={{ fontWeight: 800, fontSize: "0.92rem", color: "#ffffff", letterSpacing: "-0.01em" }}>
                AARAV GOEL
              </span>
              <span style={{ fontSize: "0.72rem", color: "#64748b", marginLeft: "6px" }}>
                • SRMIST AI/ML '29
              </span>
            </div>
          </div>

          <div className="nav-links">
            <a href="#work" className="nav-link-btn">
              Work
            </a>
            <a href="#about" className="nav-link-btn">
              About
            </a>
            <a href="#skills" className="nav-link-btn">
              Skills
            </a>
            <a href="/activity" className="nav-link-btn" style={{ color: "#38bdf8" }}>
              Activity
            </a>
            <a href="#contact" className="nav-link-btn">
              Contact
            </a>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <a
              href="#contact"
              className="btn-primary"
              style={{
                padding: "8px 18px",
                fontSize: "0.8rem",
                background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
                boxShadow: "0 0 16px rgba(14, 165, 233, 0.3)"
              }}
            >
              Get In Touch
            </a>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main style={{ position: "relative", zIndex: 10 }}>
        {/* ==================== HERO SECTION ==================== */}
        <section className="hero-section">
          <div className="hero-split-grid">
            {/* Left: Text & CTAs */}
            <div className="hero-text-col">
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px", flexWrap: "wrap" }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "6px 14px",
                    borderRadius: "9999px",
                    background: "rgba(15, 23, 42, 0.8)",
                    border: "1px solid rgba(56, 189, 248, 0.3)",
                    backdropFilter: "blur(12px)",
                    fontSize: "0.76rem",
                    fontWeight: 700,
                    color: "#38bdf8",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase"
                  }}
                >
                  <span className="status-pulse-dot" />
                  SRMIST KTR &apos;29 • B.Tech AI &amp; ML
                </span>
                <span
                  style={{
                    fontSize: "0.78rem",
                    color: "#94a3b8",
                    fontFamily: "var(--font-mono, monospace)"
                  }}
                >
                  Semester 3 • CGPA 6.86
                </span>
              </div>

              <h1
                style={{
                  fontSize: "clamp(2.4rem, 4.8vw, 3.8rem)",
                  fontWeight: 800,
                  lineHeight: 1.12,
                  letterSpacing: "-0.035em",
                  margin: "0 0 16px 0",
                  color: "#ffffff"
                }}
              >
                Aarav Goel
                <span
                  style={{
                    display: "block",
                    fontSize: "clamp(1.25rem, 2.6vw, 1.85rem)",
                    fontWeight: 600,
                    letterSpacing: "-0.02em",
                    marginTop: "6px",
                    background: "linear-gradient(135deg, #38bdf8 0%, #a855f7 60%, #34d399 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent"
                  }}
                >
                  AI/ML Engineer &amp; Systems Builder
                </span>
              </h1>

              <p
                style={{
                  fontSize: "1.06rem",
                  color: "#cbd5e1",
                  lineHeight: 1.65,
                  marginBottom: "24px",
                  maxWidth: "540px"
                }}
              >
                Undergraduate in Computer Science &amp; AI/ML at SRMIST KTR. Creator of <strong style={{ color: "#ffffff" }}>EdutechSRM</strong>{" "}(serving 250+ engineering students daily) and developer of projects like Ripple (Manipal &apos;26) and SyncMasters (SIH &apos;26). Engineering real-world AI automations, peer-to-peer edge networks, and production web systems.
              </p>

              {/* Status telemetry pill */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "6px 14px",
                  borderRadius: "8px",
                  background: "rgba(15, 23, 42, 0.65)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  marginBottom: "28px",
                  fontFamily: "var(--font-mono, monospace)",
                  fontSize: "0.78rem",
                  color: "#94a3b8"
                }}
              >
                <span style={{ color: "#34d399", fontWeight: 700 }}>● PRODUCTION</span>
                <span>edutechsrm.in</span>
                <span style={{ color: "#64748b" }}>•</span>
                <span style={{ color: "#38bdf8" }}>250+ Active Campus Users</span>
              </div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "12px",
                  alignItems: "center",
                  marginBottom: "36px"
                }}
              >
                <a
                  href="#work"
                  className="btn-primary"
                  style={{
                    padding: "13px 26px",
                    fontSize: "0.92rem",
                    background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
                    boxShadow: "0 0 25px rgba(14, 165, 233, 0.4)",
                    border: "1px solid rgba(56, 189, 248, 0.4)"
                  }}
                >
                  <span>Explore Projects</span>
                  <ArrowUpRight size={15} />
                </a>

                <button
                  onClick={() => handleCopy("goelaarav290@gmail.com", "hero-email")}
                  className="btn-secondary"
                  style={{ padding: "13px 20px", fontSize: "0.92rem" }}
                >
                  {copiedKey === "hero-email" ? (
                    <>
                      <Check size={15} color="#34d399" />
                      <span style={{ color: "#34d399" }}>Copied Email!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={15} />
                      <span>Copy Email</span>
                    </>
                  )}
                </button>

                <a
                  href="https://github.com/coderaarav12"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary"
                  style={{ padding: "13px 18px", fontSize: "0.92rem", display: "inline-flex", alignItems: "center", gap: "6px" }}
                >
                  <GithubIcon size={16} />
                  <span>GitHub</span>
                </a>

                <a
                  href="https://linkedin.com/in/aaravgoel12"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary"
                  style={{ padding: "13px 18px", fontSize: "0.92rem", display: "inline-flex", alignItems: "center", gap: "6px" }}
                >
                  <LinkedinIcon size={16} />
                  <span>LinkedIn</span>
                </a>
              </div>

              {/* Quick Metrics */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))",
                  gap: "12px",
                  paddingTop: "20px",
                  borderTop: "1px solid rgba(255, 255, 255, 0.08)"
                }}
              >
                <div>
                  <div style={{ fontSize: "1.45rem", fontWeight: 800, color: "#34d399", lineHeight: 1 }}>
                    250+
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "4px" }}>
                    EdutechSRM Students
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: "1.45rem", fontWeight: 800, color: "#38bdf8", lineHeight: 1 }}>
                    3+
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "4px" }}>
                    Hackathon AI Platforms
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: "1.45rem", fontWeight: 800, color: "#818cf8", lineHeight: 1 }}>
                    7+
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "4px" }}>
                    Industry Certifications
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: "1.45rem", fontWeight: 800, color: "#f59e0b", lineHeight: 1 }}>
                    270+
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "4px" }}>
                    GitHub Contributions
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Interactive 3D Gravity Hanging Sculpture */}
            <div className="hero-scene-container">
              <HeroScene />
            </div>
          </div>
        </section>

        {/* ==================== EDUTECHSRM SHOWCASE ==================== */}
        <section id="work" style={{ padding: "100px 24px", position: "relative" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "36px", flexWrap: "wrap", gap: "20px" }}>
              <div>
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
                    borderRadius: "9999px",
                    display: "inline-block",
                    marginBottom: "12px"
                  }}
                >
                  Featured Production Platform
                </span>
                <h2 style={{ fontSize: "clamp(2.4rem, 5vw, 3.8rem)", fontWeight: 800, margin: "0 0 10px 0", color: "#ffffff" }}>
                  Edutech<span style={{ color: "#38bdf8" }}>SRM</span>
                </h2>
                <p style={{ color: "#94a3b8", maxWidth: "600px", margin: 0, fontSize: "1.05rem" }}>
                  The unified university companion platform engineered to replace outdated college portals for 250+ SRMIST students.
                </p>
              </div>

              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <a
                  href="https://edutechsrm.in"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary"
                  style={{
                    padding: "13px 26px",
                    fontSize: "0.92rem",
                    background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)"
                  }}
                >
                  <span>Launch Live Portal</span>
                  <ArrowUpRight size={16} />
                </a>

                <button
                  onClick={() => handleCopy("dm1234 / edutechsrm@124", "creds")}
                  className="btn-secondary"
                  style={{ padding: "13px 20px", fontSize: "0.9rem" }}
                >
                  {copiedKey === "creds" ? (
                    <>
                      <Check size={16} color="#34d399" />
                      <span style={{ color: "#34d399" }}>Copied: dm1234 / edutechsrm@124</span>
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      <span>Copy Demo Access</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Simulated Live Portal Browser Mockup */}
            <div
              className="glass-panel"
              style={{
                background: "rgba(10, 14, 23, 0.9)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.7)",
                marginBottom: "40px"
              }}
            >
              {/* Window Chrome Header */}
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
                <div style={{ display: "flex", gap: "7px" }}>
                  <span style={{ width: "11px", height: "11px", borderRadius: "50%", background: "#ef4444", opacity: 0.85 }} />
                  <span style={{ width: "11px", height: "11px", borderRadius: "50%", background: "#f59e0b", opacity: 0.85 }} />
                  <span style={{ width: "11px", height: "11px", borderRadius: "50%", background: "#10b981", opacity: 0.85 }} />
                </div>

                <div
                  style={{
                    flex: "1",
                    maxWidth: "460px",
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
                  <span>https://edutechsrm.in/dashboard</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.72rem", color: "#34d399", fontWeight: 600 }}>
                  <span className="status-pulse-dot" style={{ width: "7px", height: "7px" }} />
                  <span>250+ ACTIVE</span>
                </div>
              </div>

              {/* Inner Dashboard View */}
              <div style={{ padding: "28px" }}>
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
                      style={{ width: "42px", height: "42px", borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(56, 189, 248, 0.5)" }}
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

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                    gap: "18px"
                  }}
                >
                  <div style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255, 255, 255, 0.06)", borderRadius: "12px", padding: "18px" }}>
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

                  <div style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255, 255, 255, 0.06)", borderRadius: "12px", padding: "18px" }}>
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

                  <div style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255, 255, 255, 0.06)", borderRadius: "12px", padding: "18px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#f59e0b", fontSize: "0.82rem", fontWeight: 700, marginBottom: "12px" }}>
                      <Zap size={15} />
                      <span>EDGE TELEMETRY</span>
                    </div>
                    <div style={{ display: "grid", gap: "6px", fontSize: "0.82rem", color: "#cbd5e1" }}>
                      <div>Latency: <strong style={{ color: "#34d399" }}>42ms</strong> via Cloudflare</div>
                      <div>Cache Hit Ratio: <strong style={{ color: "#38bdf8" }}>96.8%</strong></div>
                      <div>Concurrency: <strong style={{ color: "#f8fafc" }}>250+ Verified</strong></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Architecture Highlights */}
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
                  Client-side route caching, offline syllabus persistence, and responsive UI built for students under high exam-week stress.
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

        {/* ==================== ALL PROJECTS & SYSTEMS ==================== */}
        <section style={{ padding: "80px 24px", position: "relative" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
              <div>
                <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, margin: "0 0 8px 0", color: "#ffffff" }}>
                  Engineering Projects & Systems
                </h2>
                <p style={{ color: "#94a3b8", margin: 0, fontSize: "0.98rem" }}>
                  Autonomous applications, offline mesh communication protocols, and vision AI tools.
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "6px",
                  background: "rgba(15, 23, 42, 0.8)",
                  padding: "4px",
                  borderRadius: "9999px",
                  border: "1px solid rgba(255, 255, 255, 0.08)"
                }}
              >
                {[
                  { id: "all", label: "All Work" },
                  { id: "flagship", label: "Flagship" },
                  { id: "ai", label: "AI & ML" },
                  { id: "hackathon", label: "Hackathons" },
                  { id: "tools", label: "Developer Tools" }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedFilter(tab.id)}
                    style={{
                      background: selectedFilter === tab.id ? "rgba(56, 189, 248, 0.2)" : "transparent",
                      color: selectedFilter === tab.id ? "#ffffff" : "#94a3b8",
                      border: "none",
                      padding: "7px 16px",
                      borderRadius: "9999px",
                      fontSize: "0.82rem",
                      fontWeight: selectedFilter === tab.id ? 600 : 500,
                      cursor: "pointer",
                      transition: "all 0.2s"
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "24px" }}>
              <AnimatePresence>
                {filteredProjects.map((proj) => (
                  <motion.div
                    key={proj.id}
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.25 }}
                    className="glass-panel"
                    style={{
                      padding: "30px",
                      background: "rgba(10, 15, 26, 0.8)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between"
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                        <span
                          style={{
                            fontSize: "0.74rem",
                            fontWeight: 700,
                            letterSpacing: "0.06em",
                            color: proj.accent,
                            textTransform: "uppercase"
                          }}
                        >
                          {proj.tag}
                        </span>
                        <span style={{ fontSize: "0.72rem", color: "#94a3b8" }}>
                          {proj.metrics}
                        </span>
                      </div>

                      <h3 style={{ fontSize: "1.35rem", fontWeight: 800, margin: "0 0 6px 0", color: "#ffffff" }}>
                        {proj.title}
                      </h3>

                      <div style={{ fontSize: "0.85rem", color: proj.accent, fontWeight: 500, marginBottom: "12px" }}>
                        {proj.tagline}
                      </div>

                      <p style={{ color: "#cbd5e1", fontSize: "0.88rem", lineHeight: 1.6, marginBottom: "20px" }}>
                        {proj.description}
                      </p>

                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "24px" }}>
                        {proj.tech.map((t, idx) => (
                          <span
                            key={idx}
                            style={{
                              fontSize: "0.74rem",
                              background: "rgba(255, 255, 255, 0.05)",
                              border: "1px solid rgba(255, 255, 255, 0.08)",
                              padding: "3px 8px",
                              borderRadius: "6px",
                              color: "#cbd5e1"
                            }}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        borderTop: "1px solid rgba(255, 255, 255, 0.07)",
                        paddingTop: "16px"
                      }}
                    >
                      <a
                        href={proj.liveUrl}
                        target={proj.liveUrl.startsWith("http") ? "_blank" : "_self"}
                        rel="noreferrer"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          fontSize: "0.85rem",
                          fontWeight: 600,
                          color: proj.accent
                        }}
                      >
                        <span>Open Project</span>
                        <ArrowUpRight size={14} />
                      </a>

                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          fontSize: "0.78rem",
                          color: "#94a3b8"
                        }}
                      >
                        <GithubIcon size={14} />
                        <span>Source</span>
                      </a>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* ==================== ABOUT & EDUCATION ==================== */}
        <section id="about" style={{ padding: "80px 24px", position: "relative" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: "32px"
              }}
            >
              {/* Education & Foundations */}
              <div className="glass-panel" style={{ padding: "32px", background: "rgba(10, 15, 26, 0.8)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#38bdf8", fontWeight: 700, marginBottom: "16px" }}>
                  <GraduationCap size={18} />
                  <span>Academic Foundations</span>
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
                    <h3 style={{ fontSize: "1.1rem", margin: 0, color: "#ffffff" }}>
                      SRM Institute of Science and Technology
                    </h3>
                    <span style={{ fontSize: "0.75rem", color: "#38bdf8", background: "rgba(56, 189, 248, 0.1)", padding: "3px 8px", borderRadius: "4px" }}>
                      2025 – 2029
                    </span>
                  </div>
                  <div style={{ fontSize: "0.86rem", color: "#cbd5e1" }}>
                    B.Tech in Computer Science & Engineering (AI / ML)
                  </div>
                  <div style={{ fontSize: "0.82rem", color: "#94a3b8", marginTop: "4px" }}>
                    Semester 3 Active • Year 1 CGPA: <strong style={{ color: "#34d399" }}>6.86</strong>
                  </div>
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
                    <h3 style={{ fontSize: "1.1rem", margin: 0, color: "#ffffff" }}>
                      Vedritam Group DAV School
                    </h3>
                    <span style={{ fontSize: "0.75rem", color: "#94a3b8", background: "rgba(255, 255, 255, 0.05)", padding: "3px 8px", borderRadius: "4px" }}>
                      Completed
                    </span>
                  </div>
                  <div style={{ fontSize: "0.86rem", color: "#cbd5e1" }}>
                    Senior Secondary Education (CBSE)
                  </div>
                  <div style={{ fontSize: "0.82rem", color: "#94a3b8", marginTop: "4px" }}>
                    Class 10th: <strong>91.2%</strong> • Class 12th: <strong>71.2%</strong>
                  </div>
                </div>
              </div>

              {/* Leadership & Campus Roles */}
              <div className="glass-panel" style={{ padding: "32px", background: "rgba(10, 15, 26, 0.8)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#34d399", fontWeight: 700, marginBottom: "16px" }}>
                  <Briefcase size={18} />
                  <span>Campus Leadership</span>
                </div>

                <div style={{ marginBottom: "18px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
                    <h3 style={{ fontSize: "1.05rem", margin: 0, color: "#ffffff" }}>
                      Directorate of Alumni Affairs, SRMIST
                    </h3>
                    <span style={{ fontSize: "0.72rem", color: "#34d399" }}>
                      PR & Media Team
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: "0.84rem", color: "#cbd5e1", lineHeight: 1.5 }}>
                    Leading multimedia campaigns and global digital engagement for 50,000+ SRMIST alumni worldwide.
                  </p>
                </div>

                <div style={{ marginBottom: "18px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
                    <h3 style={{ fontSize: "1.05rem", margin: 0, color: "#ffffff" }}>
                      E-Cell SRM (Entrepreneurship Cell)
                    </h3>
                    <span style={{ fontSize: "0.72rem", color: "#818cf8" }}>
                      Web Dev Team
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: "0.84rem", color: "#cbd5e1", lineHeight: 1.5 }}>
                    Building web registration workflows and hackathon infrastructure for startup conclaves.
                  </p>
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
                    <h3 style={{ fontSize: "1.05rem", margin: 0, color: "#ffffff" }}>
                      Cherry+ Network
                    </h3>
                    <span style={{ fontSize: "0.72rem", color: "#f59e0b" }}>
                      Design Manager
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: "0.84rem", color: "#cbd5e1", lineHeight: 1.5 }}>
                    Directed brand identity and managed cross-platform digital asset pipelines.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== SKILLS & CERTIFICATIONS ==================== */}
        <section id="skills" style={{ padding: "80px 24px", position: "relative" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, margin: "0 0 28px 0", color: "#ffffff" }}>
              Technical Skills & Certifications
            </h2>

            {/* Skills Matrix */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "18px",
                marginBottom: "36px"
              }}
            >
              {skillsData.map((grp, idx) => (
                <div key={idx} className="glass-panel" style={{ padding: "24px", background: "rgba(10, 15, 26, 0.8)" }}>
                  <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#f8fafc", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <Code2 size={16} color="#38bdf8" />
                    <span>{grp.category}</span>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {grp.items.map((it, iIdx) => (
                      <span
                        key={iIdx}
                        style={{
                          fontSize: "0.8rem",
                          background: "rgba(255, 255, 255, 0.04)",
                          border: "1px solid rgba(255, 255, 255, 0.08)",
                          padding: "4px 10px",
                          borderRadius: "6px",
                          color: "#cbd5e1"
                        }}
                      >
                        {it}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Certifications Strip */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {certifications.map((cert, cIdx) => (
                <div
                  key={cIdx}
                  style={{
                    padding: "10px 16px",
                    borderRadius: "8px",
                    background: "rgba(255, 255, 255, 0.02)",
                    border: "1px solid rgba(255, 255, 255, 0.07)",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "0.82rem"
                  }}
                >
                  <Award size={14} color="#f59e0b" />
                  <span style={{ fontWeight: 600, color: "#f8fafc" }}>{cert.name}</span>
                  <span style={{ color: "#64748b" }}>({cert.issuer})</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==================== CONTACT ==================== */}
        <section id="contact" style={{ padding: "120px 24px", position: "relative", borderTop: "1px solid rgba(255, 255, 255, 0.06)" }}>
          <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
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
              Get In Touch
            </span>

            <h2
              style={{
                fontSize: "clamp(2.4rem, 5.5vw, 4rem)",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                margin: "0 0 16px 0",
                color: "#ffffff"
              }}
            >
              Let's build something <span style={{ color: "#38bdf8" }}>extraordinary.</span>
            </h2>

            <p style={{ color: "#cbd5e1", fontSize: "1.05rem", lineHeight: 1.6, marginBottom: "36px" }}>
              Whether you are looking for an AI/ML developer, full-stack engineer, or an eager hackathon teammate, my inbox is open.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", justifyContent: "center", alignItems: "center" }}>
              <a
                href="mailto:goelaarav290@gmail.com"
                className="btn-primary"
                style={{
                  padding: "14px 28px",
                  fontSize: "0.95rem",
                  background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)"
                }}
              >
                <Mail size={16} />
                <span>goelaarav290@gmail.com</span>
              </a>

              <button
                onClick={() => handleCopy("+91 9500554947", "phone")}
                className="btn-secondary"
                style={{ padding: "14px 24px", fontSize: "0.95rem" }}
              >
                {copiedKey === "phone" ? (
                  <>
                    <Check size={16} color="#34d399" />
                    <span style={{ color: "#34d399" }}>Copied Phone!</span>
                  </>
                ) : (
                  <>
                    <Phone size={16} />
                    <span>+91 950055 4947</span>
                  </>
                )}
              </button>

              <a
                href="https://github.com/coderaarav12"
                target="_blank"
                rel="noreferrer"
                className="btn-secondary"
                style={{ padding: "14px 20px" }}
              >
                <GithubIcon size={16} />
                <span>GitHub</span>
              </a>

              <a
                href="https://linkedin.com/in/aaravgoel12"
                target="_blank"
                rel="noreferrer"
                className="btn-secondary"
                style={{ padding: "14px 20px" }}
              >
                <LinkedinIcon size={16} />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ borderTop: "1px solid rgba(255, 255, 255, 0.06)", padding: "28px 24px", color: "#64748b", fontSize: "0.82rem" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
            <div>
              Aarav Goel © {new Date().getFullYear()} • SRMIST KTR CSE (AI/ML)
            </div>
            <div style={{ display: "flex", gap: "14px" }}>
              <a href="/activity" style={{ color: "#38bdf8" }}>Activity Telemetry</a>
              <span>•</span>
              <a href="/app_tutorials" style={{ color: "#94a3b8" }}>Tutorials Vault</a>
            </div>
          </div>
        </footer>
      </main>

      {/* Floating Soundscape */}
      <SoundscapePlayer />
    </div>
  );
}
