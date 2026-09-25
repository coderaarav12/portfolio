"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import {
  Sparkles,
  Code2,
  Brain,
  Globe,
  Terminal,
  ExternalLink,
  Mail,
  Phone,
  Award,
  GraduationCap,
  Music,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Flame,
  Check,
  Copy,
  ChevronRight,
  Briefcase,
  Calendar,
  Layers,
  FileText,
  User,
  Film,
  BookOpen,
  Waves,
  Trophy,
  ArrowUpRight,
  Cpu
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
  // Audio state
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.45);
  const audioRef = useRef(null);

  // Copy toast state
  const [copiedField, setCopiedField] = useState(null);

  // Project Category Filter
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlayMusic = () => {
    if (!audioRef.current) return;
    if (isPlayingMusic) {
      audioRef.current.pause();
      setIsPlayingMusic(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlayingMusic(true))
        .catch(() => setIsPlayingMusic(false));
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 },
      colors: ["#818cf8", "#38bdf8", "#34d399"]
    });
    setTimeout(() => {
      setCopiedField(null);
    }, 2500);
  };

  const projects = [
    {
      id: "edutechsrm",
      title: "EdutechSRM Platform",
      tagline: "Live Academic Suite Serving 250+ SRMIST Students",
      category: "featured",
      metrics: "250+ Users • 100+ Daily Requests",
      description:
        "Full-stack university companion designed to streamline student academics, automated syllabus access, and real-time announcements. Handles high concurrency during exam weeks.",
      credentials: "Demo ID: dm1234 | Pass: edutechsrm@124",
      tech: ["Next.js", "React", "Cloudflare", "Tailwind CSS", "FastAPI"],
      liveUrl: "https://edutechsrm.dpdns.org",
      githubUrl: "https://github.com/coderaarav12",
      badge: "Production • 250+ Active",
      badgeColor: "emerald"
    },
    {
      id: "ripple",
      title: "Ripple Emergency Mesh",
      tagline: "Manipal Hackathon '26 Finalist Project",
      category: "hackathons",
      metrics: "Sub-Second Mesh Routing • 0 Twilio Dependency",
      description:
        "Multi-channel disaster communication platform engineered for natural crises. Features peer-to-peer WebRTC fallback, offline triage protocols, and geocoded hazard routing.",
      credentials: null,
      tech: ["TypeScript", "WebRTC", "Next.js", "Leaflet Maps", "Node.js"],
      liveUrl: "https://github.com/coderaarav12",
      githubUrl: "https://github.com/coderaarav12",
      badge: "Manipal '26 Finalist",
      badgeColor: "indigo"
    },
    {
      id: "syncmasters",
      title: "SyncMasters GovTech AI",
      tagline: "SIH 2026 Multimodal Audit Automation",
      category: "ai",
      metrics: "Llama 3.2 Vision • 94% Report Accuracy",
      description:
        "Smart India Hackathon project automating governance audit pipelines. Scans bureaucratic documents, verifies financial irregularities via vision LLMs, and synthesizes compliance digests.",
      credentials: null,
      tech: ["Python", "Llama 3.2 Vision", "FastAPI", "Ollama", "React"],
      liveUrl: "https://github.com/coderaarav12",
      githubUrl: "https://github.com/coderaarav12",
      badge: "SIH 2026 AI Solution",
      badgeColor: "cyan"
    },
    {
      id: "trustos",
      title: "Trust OS AI Integrity",
      tagline: "Enterprise Content & Model Verification Suite",
      category: "ai",
      metrics: "Real-Time Toxicity & Hallucination Guardrails",
      description:
        "AI evaluation system providing continuous guardrails, prompt vulnerability scoring, and automated compliance auditing for deployed LLM endpoints.",
      credentials: null,
      tech: ["Python", "FastAPI", "Scikit-learn", "HuggingFace", "Next.js"],
      liveUrl: "https://github.com/coderaarav12",
      githubUrl: "https://github.com/coderaarav12",
      badge: "AI Safety Suite",
      badgeColor: "indigo"
    },
    {
      id: "activity",
      title: "GitHub Activity Heatmap",
      tagline: "Interactive Open-Source Metrics & Contributions",
      category: "tools",
      metrics: "270+ Annual Commits Tracked",
      description:
        "Deep-dive telemetry interface mapping daily repository velocity, commit streaks, language distribution, and pull request activity.",
      credentials: null,
      tech: ["Next.js", "Cloudflare Workers", "SVG Visualizations", "REST API"],
      liveUrl: "/activity",
      githubUrl: "https://github.com/coderaarav12/portfolio",
      badge: "Live Telemetry",
      badgeColor: "emerald"
    },
    {
      id: "app_tutorials",
      title: "Developer Vault & Tutorials",
      tagline: "Curated Technical Workshops & Cloud Guides",
      category: "tools",
      metrics: "Cloud Storage Access",
      description:
        "Centralized repository of technical documentation, architectural walkthroughs, setup scripts, and hands-on lab resources for peers.",
      credentials: null,
      tech: ["Google Drive Sync", "Cloudflare Edge", "Technical Docs"],
      liveUrl: "/app_tutorials",
      githubUrl: "https://github.com/coderaarav12",
      badge: "Knowledge Vault",
      badgeColor: "cyan"
    }
  ];

  const filteredProjects = projects.filter((p) => {
    if (activeTab === "all") return true;
    if (activeTab === "featured") return p.category === "featured";
    if (activeTab === "ai") return p.category === "ai";
    if (activeTab === "hackathons") return p.category === "hackathons";
    if (activeTab === "tools") return p.category === "tools";
    return true;
  });

  const skillsData = [
    {
      category: "Core Languages",
      items: ["Python", "C++", "JavaScript (ES6+)", "TypeScript", "SQL"]
    },
    {
      category: "AI / ML & Vision",
      items: [
        "Llama 3.2 Vision",
        "Ollama Local Inference",
        "Scikit-learn",
        "OpenCV",
        "Prompt Engineering",
        "Data Modeling"
      ]
    },
    {
      category: "Full-Stack & Cloud",
      items: [
        "Next.js 16 (App Router)",
        "React 19",
        "FastAPI",
        "Node.js",
        "Cloudflare Workers & KV",
        "RESTful APIs",
        "Tailwind CSS"
      ]
    },
    {
      category: "Tools & Creative Design",
      items: [
        "Git & GitHub Actions",
        "Docker Basics",
        "Adobe Premiere Pro",
        "After Effects",
        "Figma UI/UX"
      ]
    }
  ];

  const certifications = [
    {
      name: "Google AI Fundamentals",
      issuer: "Google",
      highlight: "Generative AI & Core Concepts"
    },
    {
      name: "Object-Oriented Programming in C++",
      issuer: "Microsoft",
      highlight: "Data Structures & OOP Design"
    },
    {
      name: "Python for Data Science & AI",
      issuer: "IBM",
      highlight: "Data Analysis & ML Pipelines"
    },
    {
      name: "RDMA Programming Fundamentals",
      issuer: "NVIDIA",
      highlight: "High-Performance Networking"
    },
    {
      name: "ENDURO 2025 AI/Robotics Challenge",
      issuer: "IIT Hyderabad",
      highlight: "Autonomous Engineering"
    },
    {
      name: "C++ Programming Certification",
      issuer: "Simplilearn",
      highlight: "Algorithmic Problem Solving"
    },
    {
      name: "HP LIFE AI & Tech Literacy",
      issuer: "HP LIFE",
      highlight: "Product Automation"
    }
  ];

  const experience = [
    {
      role: "Public Relations & Media Team",
      organization: "Directorate of Alumni Affairs, SRMIST",
      timeline: "Aug 2025 – Present",
      type: "University Leadership",
      description:
        "Spearheading digital engagement and media campaigns connecting 50,000+ alumni worldwide. Creating promotional video assets and orchestrating outreach events."
    },
    {
      role: "Technical Team Member (Web Dev)",
      organization: "E-Cell SRM (Entrepreneurship Cell)",
      timeline: "Sep 2025 – Present",
      type: "Technical Club",
      description:
        "Building interactive web portals and hackathon registration workflows for SRMIST's flagship entrepreneurship initiatives and startup conclaves."
    },
    {
      role: "Design Manager & Intern",
      organization: "Cherry+ Network",
      timeline: "Jun 2025 – Aug 2025",
      type: "Design & Product Internship",
      description:
        "Led product visual identity, created social media media graphics, and collaborated on cross-platform digital asset pipelines."
    }
  ];

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      {/* ---------- Ambient Background Video & Aura ---------- */}
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
        <div className="ambient-mesh-grid" />
      </div>

      {/* Audio Element */}
      <audio
        ref={audioRef}
        src="/ambient-music.mp3"
        loop
        preload="auto"
      />

      {/* ---------- Floating Navigation Bar ---------- */}
      <div className="nav-pill-container">
        <motion.nav
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="nav-pill"
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img
              src="/aarav-avatar.png"
              alt="Aarav Goel"
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "1.5px solid rgba(129, 140, 248, 0.4)"
              }}
            />
            <div>
              <span style={{ fontWeight: "700", fontSize: "0.95rem", color: "#f8fafc" }}>
                Aarav Goel
              </span>
              <span style={{ fontSize: "0.75rem", color: "#94a3b8", marginLeft: "6px" }}>
                • SRMIST '29
              </span>
            </div>
          </div>

          <div className="nav-links">
            <a href="#about" className="nav-link-btn">
              About
            </a>
            <a href="#projects" className="nav-link-btn">
              Projects
            </a>
            <a href="#experience" className="nav-link-btn">
              Experience
            </a>
            <a href="#skills" className="nav-link-btn">
              Skills
            </a>
            <a href="#education" className="nav-link-btn">
              Education
            </a>
            <a href="/activity" className="nav-link-btn" style={{ color: "#38bdf8" }}>
              Activity
            </a>
            <a href="#contact" className="nav-link-btn">
              Contact
            </a>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              onClick={togglePlayMusic}
              style={{
                background: isPlayingMusic ? "rgba(56, 189, 248, 0.15)" : "rgba(255, 255, 255, 0.06)",
                border: isPlayingMusic ? "1px solid rgba(56, 189, 248, 0.4)" : "1px solid rgba(255, 255, 255, 0.1)",
                color: isPlayingMusic ? "#38bdf8" : "#cbd5e1",
                padding: "6px 12px",
                borderRadius: "9999px",
                fontSize: "0.8rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
              title={isPlayingMusic ? "Pause Soundscape" : "Play Ambient Lofi (Empty Mind - CC0)"}
            >
              {isPlayingMusic ? (
                <>
                  <div style={{ display: "flex", alignItems: "center", height: "12px" }}>
                    <span className="equalizer-bar" />
                    <span className="equalizer-bar" />
                    <span className="equalizer-bar" />
                  </div>
                  <span>Audio On</span>
                </>
              ) : (
                <>
                  <Music size={14} />
                  <span>Play Music</span>
                </>
              )}
            </button>

            <a
              href="#contact"
              className="btn-primary"
              style={{ padding: "7px 16px", fontSize: "0.82rem" }}
            >
              Connect
            </a>
          </div>
        </motion.nav>
      </div>

      {/* ---------- Main Content Container ---------- */}
      <main style={{ position: "relative", zIndex: 10 }}>
        {/* ==================== HERO SECTION ==================== */}
        <section
          id="about"
          className="section-spacing max-w-content"
          style={{ paddingTop: "140px" }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "40px",
              alignItems: "center"
            }}
          >
            {/* Left Column: Intro */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "18px" }}>
                <span className="status-badge">
                  <span className="status-pulse-dot" />
                  SRMIST KTR • CSE AI/ML
                </span>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "6px 14px",
                    borderRadius: "9999px",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    background: "rgba(129, 140, 248, 0.12)",
                    border: "1px solid rgba(129, 140, 248, 0.3)",
                    color: "#a5b4fc"
                  }}
                >
                  <Flame size={13} color="#f59e0b" />
                  EdutechSRM (250+ Users)
                </span>
              </div>

              <h1
                style={{
                  fontSize: "clamp(2.4rem, 5vw, 3.8rem)",
                  lineHeight: 1.12,
                  marginBottom: "18px",
                  fontWeight: 800
                }}
              >
                Hi, I'm <span className="gradient-accent">Aarav Goel</span>
              </h1>

              <p
                style={{
                  fontSize: "clamp(1.1rem, 2vw, 1.35rem)",
                  color: "#cbd5e1",
                  lineHeight: 1.5,
                  marginBottom: "20px",
                  fontWeight: 500
                }}
              >
                AI/ML Engineer & Full-Stack Builder crafting real-world intelligent platforms, web automations, and resilient cloud systems.
              </p>

              <p
                style={{
                  fontSize: "0.98rem",
                  color: "#94a3b8",
                  lineHeight: 1.7,
                  marginBottom: "32px",
                  maxWidth: "560px"
                }}
              >
                Currently in Semester 3 of B.Tech Computer Science (AI & Machine Learning) at SRMIST Kattankulathur. Passionate about solving practical student and community challenges with modern Python, Next.js, and Vision LLM workflows.
              </p>

              {/* CTAs */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
                <a href="#projects" className="btn-primary">
                  <Sparkles size={16} />
                  <span>Explore Projects</span>
                </a>

                <button
                  onClick={() => handleCopy("goelaarav290@gmail.com", "hero-email")}
                  className="btn-secondary"
                >
                  {copiedField === "hero-email" ? (
                    <>
                      <Check size={16} color="#34d399" />
                      <span style={{ color: "#34d399" }}>Copied Email!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      <span>Copy Email</span>
                    </>
                  )}
                </button>

                <a
                  href="https://github.com/coderaarav12"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary"
                  style={{ padding: "12px 16px" }}
                  title="GitHub Profile"
                >
                  <GithubIcon size={18} />
                </a>

                <a
                  href="https://linkedin.com/in/aaravgoel12"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary"
                  style={{ padding: "12px 16px" }}
                  title="LinkedIn Profile"
                >
                  <LinkedinIcon size={18} />
                </a>
              </div>
            </motion.div>

            {/* Right Column: Avatar Card with Glass Elevation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <div
                className="glass-panel glass-card-glow"
                style={{
                  padding: "24px",
                  maxWidth: "400px",
                  width: "100%",
                  textAlign: "center",
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                  border: "1px solid rgba(255, 255, 255, 0.12)"
                }}
              >
                <div style={{ position: "relative", display: "inline-block", marginBottom: "20px" }}>
                  <div
                    style={{
                      position: "absolute",
                      inset: "-6px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #6366f1, #38bdf8, #34d399)",
                      filter: "blur(12px)",
                      opacity: 0.6
                    }}
                  />
                  <img
                    src="/aarav-avatar.png"
                    alt="Aarav Goel"
                    style={{
                      position: "relative",
                      width: "180px",
                      height: "180px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "3px solid rgba(255, 255, 255, 0.2)"
                    }}
                  />
                </div>

                <h3 style={{ fontSize: "1.35rem", marginBottom: "4px" }}>Aarav Goel</h3>
                <p style={{ color: "#38bdf8", fontSize: "0.9rem", fontWeight: 600, marginBottom: "16px" }}>
                  B.Tech CSE (AI/ML) • SRMIST KTR
                </p>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "10px",
                    background: "rgba(0, 0, 0, 0.25)",
                    padding: "12px",
                    borderRadius: "14px",
                    marginBottom: "16px",
                    textAlign: "left"
                  }}
                >
                  <div>
                    <div style={{ fontSize: "0.74rem", color: "#94a3b8" }}>Current Focus</div>
                    <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#f8fafc" }}>
                      AI Systems & Full-Stack
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.74rem", color: "#94a3b8" }}>Location</div>
                    <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#f8fafc" }}>
                      Chennai, India
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                  <a
                    href="mailto:goelaarav290@gmail.com"
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      padding: "8px 12px",
                      borderRadius: "10px",
                      background: "rgba(255, 255, 255, 0.06)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      fontSize: "0.82rem",
                      color: "#cbd5e1"
                    }}
                  >
                    <Mail size={14} />
                    <span>Email Me</span>
                  </a>
                  <a
                    href="tel:+919500554947"
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      padding: "8px 12px",
                      borderRadius: "10px",
                      background: "rgba(255, 255, 255, 0.06)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      fontSize: "0.82rem",
                      color: "#cbd5e1"
                    }}
                  >
                    <Phone size={14} />
                    <span>Call</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ---------- Key Metrics Bar ---------- */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{
              marginTop: "50px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "16px"
            }}
          >
            {[
              { label: "Active Student Users", value: "250+", sub: "on EdutechSRM Platform", color: "#34d399" },
              { label: "Hackathon AI Platforms", value: "3+", sub: "SIH & Manipal Finalist", color: "#38bdf8" },
              { label: "Industry Certifications", value: "7+", sub: "Google, IBM, Microsoft, NVIDIA", color: "#818cf8" },
              { label: "Open-Source Contributions", value: "270+", sub: "GitHub Commits & Tools", color: "#fbbf24" }
            ].map((metric, idx) => (
              <div
                key={idx}
                className="glass-panel"
                style={{ padding: "20px 24px", position: "relative" }}
              >
                <div style={{ fontSize: "2rem", fontWeight: 800, color: metric.color, marginBottom: "4px" }}>
                  {metric.value}
                </div>
                <div style={{ fontSize: "0.92rem", fontWeight: 600, color: "#f8fafc" }}>
                  {metric.label}
                </div>
                <div style={{ fontSize: "0.78rem", color: "#94a3b8", marginTop: "2px" }}>
                  {metric.sub}
                </div>
              </div>
            ))}
          </motion.div>
        </section>

        {/* ==================== FEATURED PROJECTS ==================== */}
        <section id="projects" className="section-spacing max-w-content">
          <div style={{ textAlign: "center", marginBottom: "36px" }}>
            <span className="status-badge" style={{ marginBottom: "12px" }}>
              <Layers size={13} />
              Portfolio Showcase
            </span>
            <h2 style={{ fontSize: "clamp(2rem, 3.5vw, 2.8rem)", marginBottom: "12px" }}>
              Featured <span className="gradient-violet-cyan">Engineering Projects</span>
            </h2>
            <p style={{ color: "#94a3b8", maxWidth: "600px", margin: "0 auto", fontSize: "0.98rem" }}>
              Architecting production applications, vision-enabled AI workflows, and resilient decentralized utilities.
            </p>

            {/* Filter Tabs */}
            <div
              style={{
                display: "inline-flex",
                flexWrap: "wrap",
                gap: "8px",
                background: "rgba(15, 23, 42, 0.7)",
                padding: "6px",
                borderRadius: "9999px",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                marginTop: "24px"
              }}
            >
              {[
                { id: "all", label: "All Projects" },
                { id: "featured", label: "Flagship" },
                { id: "ai", label: "AI & Vision" },
                { id: "hackathons", label: "Hackathons" },
                { id: "tools", label: "Developer Tools" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: "8px 18px",
                    borderRadius: "9999px",
                    border: "none",
                    background: activeTab === tab.id ? "rgba(99, 102, 241, 0.25)" : "transparent",
                    color: activeTab === tab.id ? "#ffffff" : "#94a3b8",
                    fontWeight: activeTab === tab.id ? 600 : 500,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Projects Grid */}
          <motion.div
            layout
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(330px, 1fr))",
              gap: "24px"
            }}
          >
            <AnimatePresence>
              {filteredProjects.map((project) => (
                <motion.div
                  layout
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="glass-panel glass-card-glow"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: "28px"
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "14px"
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          color:
                            project.badgeColor === "emerald"
                              ? "#34d399"
                              : project.badgeColor === "cyan"
                              ? "#38bdf8"
                              : "#818cf8"
                        }}
                      >
                        {project.badge}
                      </span>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          color: "#94a3b8",
                          background: "rgba(255, 255, 255, 0.05)",
                          padding: "3px 8px",
                          borderRadius: "6px"
                        }}
                      >
                        {project.metrics}
                      </span>
                    </div>

                    <h3 style={{ fontSize: "1.3rem", marginBottom: "6px" }}>{project.title}</h3>
                    <div style={{ color: "#38bdf8", fontSize: "0.86rem", fontWeight: 500, marginBottom: "12px" }}>
                      {project.tagline}
                    </div>

                    <p style={{ color: "#cbd5e1", fontSize: "0.88rem", lineHeight: 1.6, marginBottom: "16px" }}>
                      {project.description}
                    </p>

                    {project.credentials && (
                      <div
                        style={{
                          background: "rgba(52, 211, 153, 0.08)",
                          border: "1px dashed rgba(52, 211, 153, 0.3)",
                          borderRadius: "10px",
                          padding: "8px 12px",
                          fontSize: "0.78rem",
                          color: "#a7f3d0",
                          marginBottom: "16px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}
                      >
                        <span>🔑 {project.credentials}</span>
                        <button
                          onClick={() => handleCopy("dm1234 / edutechsrm@124", "creds")}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "#34d399",
                            cursor: "pointer",
                            fontSize: "0.75rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px"
                          }}
                        >
                          <Copy size={12} />
                          <span>Copy</span>
                        </button>
                      </div>
                    )}

                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "22px" }}>
                      {project.tech.map((t, idx) => (
                        <span
                          key={idx}
                          style={{
                            fontSize: "0.74rem",
                            background: "rgba(255, 255, 255, 0.06)",
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
                      gap: "10px",
                      borderTop: "1px solid rgba(255, 255, 255, 0.07)",
                      paddingTop: "16px"
                    }}
                  >
                    <a
                      href={project.liveUrl}
                      target={project.liveUrl.startsWith("http") ? "_blank" : "_self"}
                      rel="noreferrer"
                      className="btn-primary"
                      style={{
                        flex: 1,
                        padding: "9px 14px",
                        fontSize: "0.82rem",
                        boxShadow: "none"
                      }}
                    >
                      <span>Open Live Demo</span>
                      <ArrowUpRight size={14} />
                    </a>

                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-secondary"
                      style={{ padding: "9px 12px" }}
                      title="Source Code"
                    >
                      <GithubIcon size={15} />
                    </a>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </section>

        {/* ==================== EXPERIENCE & LEADERSHIP ==================== */}
        <section id="experience" className="section-spacing max-w-content">
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <span className="status-badge" style={{ marginBottom: "12px" }}>
              <Briefcase size={13} />
              Career & Campus
            </span>
            <h2 style={{ fontSize: "clamp(2rem, 3.5vw, 2.8rem)", marginBottom: "12px" }}>
              Academic & Leadership <span className="gradient-accent">Experience</span>
            </h2>
            <p style={{ color: "#94a3b8", maxWidth: "600px", margin: "0 auto", fontSize: "0.98rem" }}>
              Active involvement in major university directorates, startup bodies, and engineering design teams.
            </p>
          </div>

          <div style={{ maxWidth: "800px", margin: "0 auto", display: "grid", gap: "20px" }}>
            {experience.map((exp, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="glass-panel"
                style={{ padding: "26px" }}
              >
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "8px",
                    marginBottom: "8px"
                  }}
                >
                  <h3 style={{ fontSize: "1.2rem", margin: 0, color: "#f8fafc" }}>
                    {exp.role}
                  </h3>
                  <span
                    style={{
                      fontSize: "0.78rem",
                      color: "#38bdf8",
                      background: "rgba(56, 189, 248, 0.1)",
                      border: "1px solid rgba(56, 189, 248, 0.2)",
                      padding: "3px 10px",
                      borderRadius: "9999px"
                    }}
                  >
                    {exp.timeline}
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    color: "#818cf8",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    marginBottom: "12px"
                  }}
                >
                  <span>{exp.organization}</span>
                  <span style={{ color: "#64748b" }}>•</span>
                  <span style={{ color: "#94a3b8", fontSize: "0.82rem", fontWeight: 400 }}>
                    {exp.type}
                  </span>
                </div>

                <p style={{ color: "#cbd5e1", fontSize: "0.9rem", lineHeight: 1.6, margin: 0 }}>
                  {exp.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ==================== TECHNICAL SKILLS ==================== */}
        <section id="skills" className="section-spacing max-w-content">
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <span className="status-badge" style={{ marginBottom: "12px" }}>
              <Cpu size={13} />
              Tooling & Competencies
            </span>
            <h2 style={{ fontSize: "clamp(2rem, 3.5vw, 2.8rem)", marginBottom: "12px" }}>
              Technical <span className="gradient-violet-cyan">Skills Arsenal</span>
            </h2>
            <p style={{ color: "#94a3b8", maxWidth: "560px", margin: "0 auto", fontSize: "0.98rem" }}>
              A robust set of programming languages, modern frameworks, and AI workflows used in production.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "20px"
            }}
          >
            {skillsData.map((group, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="glass-panel"
                style={{ padding: "24px" }}
              >
                <div
                  style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "#f8fafc",
                    marginBottom: "16px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}
                >
                  <Code2 size={16} color="#818cf8" />
                  <span>{group.category}</span>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {group.items.map((item, itemIdx) => (
                    <span
                      key={itemIdx}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "8px",
                        fontSize: "0.82rem",
                        fontWeight: 500,
                        background: "rgba(255, 255, 255, 0.04)",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        color: "#e2e8f0"
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ==================== EDUCATION & CERTIFICATIONS ==================== */}
        <section id="education" className="section-spacing max-w-content">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "36px"
            }}
          >
            {/* Left: Education Details */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="status-badge" style={{ marginBottom: "12px" }}>
                <GraduationCap size={13} />
                Academic Background
              </span>
              <h2 style={{ fontSize: "2.2rem", marginBottom: "20px" }}>
                Education <span className="gradient-accent">& Foundations</span>
              </h2>

              <div style={{ display: "grid", gap: "16px" }}>
                <div className="glass-panel" style={{ padding: "24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <h3 style={{ fontSize: "1.15rem", marginBottom: "4px" }}>
                        SRM Institute of Science and Technology
                      </h3>
                      <div style={{ color: "#38bdf8", fontSize: "0.88rem", fontWeight: 600 }}>
                        B.Tech in Computer Science & Engineering (AI / ML)
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: "0.78rem",
                        color: "#a7f3d0",
                        background: "rgba(52, 211, 153, 0.12)",
                        padding: "4px 8px",
                        borderRadius: "6px"
                      }}
                    >
                      2025 – 2029
                    </span>
                  </div>
                  <div style={{ marginTop: "12px", fontSize: "0.85rem", color: "#cbd5e1" }}>
                    • Semester 3 active (Kattankulathur Campus)
                    <br />• Year 1 CGPA: <strong>6.86</strong>
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: "24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <h3 style={{ fontSize: "1.15rem", marginBottom: "4px" }}>
                        Vedritam Group DAV School
                      </h3>
                      <div style={{ color: "#38bdf8", fontSize: "0.88rem", fontWeight: 600 }}>
                        Senior Secondary Education (CBSE)
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: "0.78rem",
                        color: "#94a3b8",
                        background: "rgba(255, 255, 255, 0.06)",
                        padding: "4px 8px",
                        borderRadius: "6px"
                      }}
                    >
                      Completed
                    </span>
                  </div>
                  <div style={{ marginTop: "12px", fontSize: "0.85rem", color: "#cbd5e1" }}>
                    • Class 10th (Secondary): <strong>91.2%</strong>
                    <br />• Class 12th (Senior Secondary): <strong>71.2%</strong>
                  </div>
                </div>
              </div>

              {/* Personal Interests Strip */}
              <div style={{ marginTop: "28px" }}>
                <h4 style={{ fontSize: "1.05rem", marginBottom: "14px", color: "#f8fafc" }}>
                  Personal Interests & Hobbies
                </h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  {[
                    { name: "Video Editing", icon: <Film size={15} color="#ec4899" /> },
                    { name: "Reading Novels", icon: <BookOpen size={15} color="#38bdf8" /> },
                    { name: "Swimming", icon: <Waves size={15} color="#34d399" /> },
                    { name: "Lawn Tennis", icon: <Trophy size={15} color="#fbbf24" /> }
                  ].map((hobby, hIdx) => (
                    <div
                      key={hIdx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "10px 14px",
                        borderRadius: "10px",
                        background: "rgba(255, 255, 255, 0.03)",
                        border: "1px solid rgba(255, 255, 255, 0.07)",
                        fontSize: "0.84rem",
                        color: "#cbd5e1"
                      }}
                    >
                      {hobby.icon}
                      <span>{hobby.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right: Certifications */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="status-badge" style={{ marginBottom: "12px" }}>
                <Award size={13} />
                Industry Validations
              </span>
              <h2 style={{ fontSize: "2.2rem", marginBottom: "20px" }}>
                Verified <span className="gradient-violet-cyan">Certifications</span>
              </h2>

              <div style={{ display: "grid", gap: "12px" }}>
                {certifications.map((cert, cIdx) => (
                  <div
                    key={cIdx}
                    className="glass-panel"
                    style={{
                      padding: "16px 20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "12px"
                    }}
                  >
                    <div>
                      <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "#f8fafc" }}>
                        {cert.name}
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "#94a3b8", marginTop: "2px" }}>
                        {cert.highlight}
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: "0.76rem",
                        fontWeight: 600,
                        color: "#818cf8",
                        background: "rgba(129, 140, 248, 0.12)",
                        border: "1px solid rgba(129, 140, 248, 0.25)",
                        padding: "3px 10px",
                        borderRadius: "9999px",
                        whiteSpace: "nowrap"
                      }}
                    >
                      {cert.issuer}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ==================== CONTACT & CONNECT ==================== */}
        <section id="contact" className="section-spacing max-w-content">
          <div
            className="glass-panel glass-card-glow"
            style={{
              padding: "clamp(30px, 6vw, 60px)",
              textAlign: "center",
              position: "relative",
              overflow: "hidden"
            }}
          >
            <span className="status-badge" style={{ marginBottom: "14px" }}>
              <Sparkles size={13} />
              Let's Build Together
            </span>
            <h2 style={{ fontSize: "clamp(2.2rem, 4vw, 3.2rem)", marginBottom: "16px" }}>
              Ready to collaborate on something <span className="gradient-accent">extraordinary?</span>
            </h2>
            <p
              style={{
                color: "#cbd5e1",
                maxWidth: "640px",
                margin: "0 auto 36px auto",
                fontSize: "1rem",
                lineHeight: 1.6
              }}
            >
              Whether you are looking for an AI/ML developer, full-stack engineer, or an eager hackathon teammate, my inbox is always open.
            </p>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "16px",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <a
                href="mailto:goelaarav290@gmail.com"
                className="btn-primary"
                style={{ padding: "14px 28px", fontSize: "0.95rem" }}
              >
                <Mail size={18} />
                <span>goelaarav290@gmail.com</span>
              </a>

              <button
                onClick={() => handleCopy("+91 9500554947", "contact-phone")}
                className="btn-secondary"
                style={{ padding: "14px 24px", fontSize: "0.95rem" }}
              >
                {copiedField === "contact-phone" ? (
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
                style={{ padding: "14px 20px" }}
              >
                <GithubIcon size={18} />
                <span>GitHub</span>
              </a>

              <a
                href="https://linkedin.com/in/aaravgoel12"
                target="_blank"
                rel="noreferrer"
                className="btn-secondary"
                style={{ padding: "14px 20px" }}
              >
                <LinkedinIcon size={18} />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </section>

        {/* ==================== FOOTER ==================== */}
        <footer
          style={{
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            padding: "36px 24px",
            textAlign: "center",
            color: "#64748b",
            fontSize: "0.85rem"
          }}
        >
          <div className="max-w-content" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
            <div>
              Designed & Engineered by <strong>Aarav Goel</strong> • SRMIST KTR CSE AI/ML
            </div>
            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
              <a href="/activity" style={{ color: "#38bdf8", textDecoration: "none" }}>
                Activity Heatmap
              </a>
              <span>•</span>
              <a href="/app_tutorials" style={{ color: "#94a3b8", textDecoration: "none" }}>
                Tutorials Vault
              </a>
              <span>•</span>
              <a href="#about" style={{ color: "#94a3b8", textDecoration: "none" }}>
                Back to Top ↑
              </a>
            </div>
          </div>
        </footer>
      </main>

      {/* ---------- Floating Music / Soundscape Player ---------- */}
      <div className="soundscape-bar">
        <button
          onClick={togglePlayMusic}
          style={{
            background: isPlayingMusic ? "linear-gradient(135deg, #6366f1, #38bdf8)" : "rgba(255, 255, 255, 0.1)",
            border: "none",
            borderRadius: "50%",
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
            cursor: "pointer",
            boxShadow: isPlayingMusic ? "0 0 12px rgba(56, 189, 248, 0.5)" : "none"
          }}
        >
          {isPlayingMusic ? <Pause size={14} /> : <Play size={14} style={{ marginLeft: "2px" }} />}
        </button>

        <div style={{ display: "flex", flexDirection: "column", minWidth: "120px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "#f8fafc" }}>
              Empty Mind
            </span>
            {isPlayingMusic && (
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
    </div>
  );
}
