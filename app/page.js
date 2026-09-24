"use client";

import { useEffect, useRef, useState } from "react";

const projects = [
  {
    title: "EduTechSRM",
    subtitle: "SRMIST KTR Academic Dashboard",
    category: "Flagship / Academic Portal",
    description:
      "Comprehensive academic companion for SRMIST KTR students. Features timetable synchronization, attendance tracking with threshold alerts, internal marks computation, CGPA forecasting, and an integrated Gemini AI assistant.",
    tags: ["Next.js", "React", "Tailwind CSS", "SRMIST API", "Gemini AI", "Cloudflare"],
    link: "https://github.com/coderaarav12/edutechsrm-frontend-in",
    highlight: "Daily Academic Companion",
    stats: "Attendance · Timetable · Marks · AI",
    badge: "Flagship",
    accent: "#8b5cf6",
  },
  {
    title: "MediaHub",
    subtitle: "Multi-Source Streaming Platform",
    category: "Web App / Entertainment",
    description:
      "High-performance media streaming platform allowing users to search and stream movies, TV shows, and anime with multi-provider embed fallbacks, instant search indexing, and a sleek dark cinema UI.",
    tags: ["React 19", "Next.js", "Custom APIs", "Responsive Video", "Tailwind"],
    link: "https://github.com/coderaarav12/media-hub-frontend",
    highlight: "Fast Streaming & Zero Bloat",
    stats: "Movies · TV Shows · Anime",
    badge: "Featured",
    accent: "#06b6d4",
  },
  {
    title: "SRM Sarthi Web",
    subtitle: "SRM Campus Utility Portal",
    category: "Campus Utility",
    description:
      "Lightweight, mobile-first student utility web experience deployed on Vercel. Delivers instant access to verified university portals, campus maps, bus schedules, and essential student links.",
    tags: ["Next.js", "React", "Vercel Edge", "Tailwind CSS"],
    link: "https://github.com/coderaarav12/srm-sarthi-web",
    highlight: "Deployed on Vercel",
    stats: "Instant Load · Campus Utilities",
    badge: "Live App",
    accent: "#ec4899",
  },
  {
    title: "Live GitHub Activity Heatmap",
    subtitle: "Real-Time Engineering Tracker",
    category: "Data Viz & Analytics",
    description:
      "Interactive contribution calendar and push graph. Inspect commits day by day, view real-time contribution velocity, and follow active coding streaks across 236+ contributions.",
    tags: ["Next.js", "SVG Graphing", "GitHub API", "Data Viz"],
    link: "/activity",
    isInternal: true,
    highlight: "Live Activity Graph",
    stats: "236+ Commits · Daily Inspection",
    badge: "Interactive",
    accent: "#10b981",
  },
  {
    title: "SRM Planner Backend",
    subtitle: "Automated Academic Pipeline",
    category: "Backend & Automation",
    description:
      "Python backend service built for timetable parsing, exam scheduling alerts, and automated student academic data ingestion pipelines.",
    tags: ["Python", "FastAPI / Flask", "REST APIs", "Automation"],
    link: "https://github.com/coderaarav12/SRMPlannerBackend--OLD",
    highlight: "Python Microservice",
    stats: "Automated Data Processing",
    badge: "Backend",
    accent: "#f59e0b",
  },
  {
    title: "App Tutorials & Knowledge Vault",
    subtitle: "Curated Resource Library",
    category: "Developer Library",
    description:
      "Direct cloud repository of curated mobile and web development tutorials, architecture diagrams, study materials, and reference guides for developers.",
    tags: ["Cloudflare Worker", "Resources", "Guides", "Cloud Storage"],
    link: "/app_tutorials",
    isInternal: true,
    highlight: "Curated Guides & Assets",
    stats: "Handpicked Study Vault",
    badge: "Resources",
    accent: "#6366f1",
  },
];

const skillCategories = [
  {
    title: "Frontend Engineering",
    icon: "code",
    color: "#8b5cf6",
    skills: ["React 19", "Next.js (App Router)", "JavaScript (ESNext)", "TypeScript", "HTML5 & Semantic Web", "State Management", "Component Architecture"],
  },
  {
    title: "Styling & Interaction",
    icon: "palette",
    color: "#06b6d4",
    skills: ["Tailwind CSS", "Modern CSS & Grid", "Glassmorphism", "Micro-interactions", "Responsive Layouts", "Accessibility (a11y)", "Figma Prototyping"],
  },
  {
    title: "Backend & Edge",
    icon: "server",
    color: "#ec4899",
    skills: ["Cloudflare Workers", "Wrangler CLI", "Node.js", "Python", "RESTful APIs", "Vercel Edge Functions", "Database Integration"],
  },
  {
    title: "Developer Tooling",
    icon: "tools",
    color: "#10b981",
    skills: ["Git & GitHub Workflow", "VS Code", "Postman", "Linux / WSL", "Performance & CWV", "CI/CD Deployment", "FFmpeg & Media"],
  },
];

const timeline = [
  {
    period: "2024 — 2028",
    role: "B.Tech in Engineering (2nd Year)",
    organization: "SRM Institute of Science and Technology (SRMIST KTR)",
    location: "Chennai, India",
    description:
      "Pursuing undergraduate degree in engineering. Actively architecting student-first applications, academic dashboards, and collaborating on modern web development.",
    badge: "Education",
  },
  {
    period: "2024 — Present",
    role: "Frontend Engineer & Vibe Coder",
    organization: "Independent & Open Source",
    location: "Remote",
    description:
      "Designing and shipping polished web applications like EduTechSRM, MediaHub, and SRM Sarthi. Specializing in fast edge rendering, sleek micro-interactions, and high-performance UI.",
    badge: "Experience",
  },
  {
    period: "2025 — 2026",
    role: "Hackathon Builder & Prototyper",
    organization: "Manipal Hackathon & Tech Meets",
    location: "India",
    description:
      "Created hardware/software solutions under high-pressure hackathon sprints, shipping functional prototypes, hardware integrations, and responsive frontend dashboards.",
    badge: "Hackathons",
  },
];

const contacts = [
  {
    label: "Email",
    value: "goelaarav290@gmail.com",
    href: "mailto:goelaarav290@gmail.com",
    icon: "mail",
    accent: "#f59e0b",
  },
  {
    label: "Phone",
    value: "+91 950055 4947",
    href: "tel:+919500554947",
    icon: "phone",
    accent: "#22d3ee",
  },
  {
    label: "GitHub",
    value: "@coderaarav12",
    href: "https://github.com/coderaarav12",
    icon: "github",
    accent: "#8b5cf6",
  },
  {
    label: "LinkedIn",
    value: "in/aaravgoel12",
    href: "https://www.linkedin.com/in/aaravgoel12/",
    icon: "linkedin",
    accent: "#0a66c2",
  },
  {
    label: "Live Domain",
    value: "goelaarav.dpdns.org",
    href: "https://goelaarav.dpdns.org/",
    icon: "globe",
    accent: "#10b981",
  },
];

const Icons = {
  github: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.05-.02-2.06-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.2.08 1.83 1.23 1.83 1.23 1.07 1.83 2.8 1.3 3.49 1 .11-.78.42-1.31.76-1.61-2.66-.3-5.46-1.33-5.46-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6.01 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.63-5.47 5.92.43.37.81 1.1.81 2.22 0 1.61-.01 2.9-.01 3.3 0 .32.22.7.83.58A12.02 12.02 0 0 0 24 12.5C24 5.87 18.63.5 12 .5z" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.32-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  ),
  globe: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  mail: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  phone: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  code: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  palette: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
      <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
      <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
      <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.6-.7 1.6-1.6 0-.4-.2-.8-.5-1.1-.3-.3-.4-.7-.4-1.1 0-.9.7-1.6 1.6-1.6H16c3.3 0 6-2.7 6-6 0-5.5-4.5-9.6-10-9.6z" />
    </svg>
  ),
  server: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
      <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
      <line x1="6" y1="6" x2="6.01" y2="6" />
      <line x1="6" y1="18" x2="6.01" y2="18" />
    </svg>
  ),
  tools: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  ),
  sparkles: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z" />
    </svg>
  ),
  arrowUpRight: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  ),
};

export default function Home() {
  const sceneRef = useRef(null);
  const cursorRef = useRef(null);
  const cursorRingRef = useRef(null);
  const [copied, setCopied] = useState(null);
  const [navScrolled, setNavScrolled] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");

  const copyToClipboard = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      window.setTimeout(() => setCopied(null), 2000);
    } catch {
      window.location.href = `mailto:${text}`;
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setNavScrolled(window.scrollY > 40);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const scene = sceneRef.current;
    const cursor = cursorRef.current;
    const cursorRing = cursorRingRef.current;

    if (!scene || !cursor || !cursorRing) return undefined;

    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (!finePointer) {
      cursor.style.display = "none";
      cursorRing.style.display = "none";
      return undefined;
    }

    let animationFrameId = 0;
    let alive = true;
    let currentX = 0.5;
    let currentY = 0.5;
    let targetX = 0.5;
    let targetY = 0.5;
    let pointerSpeed = 0;

    const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

    const updateScroll = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const scrollProgress = clamp(window.scrollY / maxScroll, 0, 1);
      scene.style.setProperty("--scroll-progress", scrollProgress.toFixed(4));
    };

    const movePointer = (event) => {
      targetX = event.clientX / window.innerWidth;
      targetY = event.clientY / window.innerHeight;
      pointerSpeed = Math.hypot(event.movementX || 0, event.movementY || 0);
      scene.style.setProperty("--mx", `${event.clientX}px`);
      scene.style.setProperty("--my", `${event.clientY}px`);
    };

    const animate = () => {
      if (!alive) return;
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;

      const x = currentX * window.innerWidth;
      const y = currentY * window.innerHeight;
      const speedScale = 1 + clamp(pointerSpeed / 80, 0, 0.3);
      const ringScale = 1 + clamp(pointerSpeed / 40, 0, 0.7);

      cursor.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${speedScale})`;
      cursorRing.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${ringScale})`;
      cursorRing.style.opacity = `${clamp(0.24 + pointerSpeed / 120, 0.25, 0.8)}`;

      animationFrameId = requestAnimationFrame(animate);
    };

    updateScroll();
    animate();

    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("pointermove", movePointer);
    window.addEventListener("resize", updateScroll);

    return () => {
      alive = false;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("pointermove", movePointer);
      window.removeEventListener("resize", updateScroll);
    };
  }, []);

  const filteredProjects =
    activeFilter === "all"
      ? projects
      : activeFilter === "flagship"
      ? projects.filter((p) => p.badge === "Flagship" || p.badge === "Featured")
      : activeFilter === "apps"
      ? projects.filter((p) => !p.badge.includes("Backend") && !p.badge.includes("Resources"))
      : projects.filter((p) => p.badge.includes("Backend") || p.badge.includes("Resources") || p.isInternal);

  return (
    <div className="portfolio-root" ref={sceneRef}>
      {/* Background ambient lighting */}
      <div className="bg-glow-orb orb-1" aria-hidden="true" />
      <div className="bg-glow-orb orb-2" aria-hidden="true" />
      <div className="bg-glow-orb orb-3" aria-hidden="true" />
      <div className="bg-grid-overlay" aria-hidden="true" />

      {/* Custom magnetic cursor on desktop */}
      <div ref={cursorRef} className="portfolio-cursor" aria-hidden="true" />
      <div ref={cursorRingRef} className="portfolio-cursor-ring" aria-hidden="true" />

      {/* Floating toast notification */}
      {copied ? (
        <div className="toast-notification" role="status" aria-live="polite">
          <span className="toast-icon">✓</span>
          <span>Copied {copied} to clipboard!</span>
        </div>
      ) : null}

      {/* Navigation Header */}
      <header className={`portfolio-header ${navScrolled ? "header-scrolled" : ""}`}>
        <div className="header-container">
          <a href="#" className="brand-logo" aria-label="Aarav Goel Home">
            <span className="logo-badge">AG</span>
            <span className="logo-text">
              <strong>Aarav Goel</strong>
              <small>Frontend Engineer</small>
            </span>
          </a>

          <nav className="desktop-nav" aria-label="Main Navigation">
            <a href="#about" className="nav-item">About</a>
            <a href="#projects" className="nav-item">Projects</a>
            <a href="#skills" className="nav-item">Skills</a>
            <a href="#experience" className="nav-item">Experience</a>
            <a href="/activity" className="nav-item nav-activity-pill">
              <span className="live-dot" aria-hidden="true" /> Activity
            </a>
            <a href="#contact" className="nav-item">Contact</a>
          </nav>

          <div className="header-actions">
            <a href="/about" className="btn-immersive" title="Explore the interactive audio/visual story">
              <span>✦</span> Experience /about
            </a>
            <a href="#contact" className="btn-primary-sm">
              Let&apos;s Connect
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content">
        {/* HERO SECTION */}
        <section className="hero-section">
          <div className="hero-container">
            <div className="hero-details">
              <div className="status-pill">
                <span className="pulsing-green-dot" aria-hidden="true" />
                <span>Available for Projects &amp; Internships · 2nd Year @ SRMIST</span>
              </div>

              <h1 className="hero-main-title">
                <span>CRAFTING FAST,</span>
                <span className="gradient-text">VIBRANT WEB</span>
                <span>EXPERIENCES.</span>
              </h1>

              <p className="hero-subtext">
                I&apos;m <strong>Aarav Goel</strong> — a frontend engineer and vibe coder dedicated to building
                lightning-fast, hyper-polished web apps with React, Next.js, and modern edge architecture.
              </p>

              <div className="hero-cta-group">
                <a href="#projects" className="btn-primary">
                  Explore Projects <span aria-hidden="true">↓</span>
                </a>
                <a href="/about" className="btn-secondary">
                  <span>✦</span> Immersive Story (/about)
                </a>
                <a
                  href="https://github.com/coderaarav12"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-ghost"
                  aria-label="GitHub Profile"
                >
                  {Icons.github}
                  <span>GitHub</span>
                </a>
              </div>

              <div className="hero-quick-tags">
                <span className="tag-chip">Next.js App Router</span>
                <span className="tag-chip">React 19</span>
                <span className="tag-chip">Tailwind CSS</span>
                <span className="tag-chip">Cloudflare Edge</span>
                <span className="tag-chip">Fluid Micro-Interactions</span>
              </div>
            </div>

            {/* Hero 3D Card / Portrait */}
            <div className="hero-visual">
              <div className="hero-card-glow" aria-hidden="true" />
              <div className="photo-card-wrapper">
                <div className="photo-inner-frame">
                  <img
                    src="/aarav-photo.png"
                    alt="Aarav Goel portrait"
                    className="portrait-img"
                    loading="eager"
                  />
                  <div className="photo-lens-flare" aria-hidden="true" />
                </div>

                <div className="floating-badge badge-top-right">
                  <span className="badge-icon">⚡</span>
                  <div>
                    <strong>2nd Year B.Tech</strong>
                    <small>SRMIST KTR</small>
                  </div>
                </div>

                <div className="floating-badge badge-bottom-left">
                  <span className="badge-icon">🚀</span>
                  <div>
                    <strong>236+ GitHub</strong>
                    <small>Active Contributions</small>
                  </div>
                </div>

                <div className="photo-card-footer">
                  <div className="footer-profile-meta">
                    <span className="avatar-chip">AG</span>
                    <div>
                      <strong>Aarav Goel</strong>
                      <p>@coderaarav12 · Frontend Specialist</p>
                    </div>
                  </div>
                  <a
                    href="https://www.linkedin.com/in/aaravgoel12/"
                    target="_blank"
                    rel="noreferrer"
                    className="card-linkedin-btn"
                    aria-label="LinkedIn"
                  >
                    {Icons.linkedin}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* METRICS STRIP */}
        <section className="metrics-strip" aria-label="Key highlights">
          <div className="metrics-container">
            <div className="metric-box">
              <strong className="metric-number">2nd</strong>
              <span className="metric-label">Year Engineer @ SRMIST KTR</span>
            </div>
            <div className="metric-box">
              <strong className="metric-number">236+</strong>
              <span className="metric-label">GitHub Contributions</span>
            </div>
            <div className="metric-box">
              <strong className="metric-number">13+</strong>
              <span className="metric-label">Public Repos &amp; Web Tools</span>
            </div>
            <div className="metric-box">
              <strong className="metric-number">100%</strong>
              <span className="metric-label">Frontend &amp; UI/UX Focus</span>
            </div>
          </div>
        </section>

        {/* ABOUT / PHILOSOPHY SPOTLIGHT */}
        <section className="about-spotlight-section" id="about">
          <div className="section-container">
            <div className="section-header-centered">
              <p className="section-eyebrow">ABOUT ME</p>
              <h2 className="section-title">
                Building for Students, Builders &amp; <span className="gradient-text">the Modern Web.</span>
              </h2>
              <p className="section-desc">
                I bridge the gap between engineering rigor and aesthetic delight. Here is how I think, build, and ship.
              </p>
            </div>

            <div className="philosophy-grid">
              <div className="philosophy-card">
                <div className="card-top-icon" style={{ "--c": "#8b5cf6" }}>
                  {Icons.code}
                </div>
                <h3>High-Velocity Frontend</h3>
                <p>
                  Specializing in Next.js, React 19, and Tailwind CSS. I prioritize snappy Core Web Vitals, accessible semantic HTML, zero layout shifts, and sleek glassmorphic interfaces.
                </p>
                <div className="card-mini-tags">
                  <span>SSR &amp; ISR</span>
                  <span>Modern CSS</span>
                  <span>Edge Routing</span>
                </div>
              </div>

              <div className="philosophy-card">
                <div className="card-top-icon" style={{ "--c": "#06b6d4" }}>
                  {Icons.sparkles}
                </div>
                <h3>Vibe Coding &amp; Flow State</h3>
                <p>
                  Turning creative energy into living software. From micro-interactions to ambient backdrops and music integration, I treat every web page as an interactive digital art piece.
                </p>
                <div className="card-mini-tags">
                  <span>Fluid Motion</span>
                  <span>Audio Sync</span>
                  <span>Haptic Visuals</span>
                </div>
              </div>

              <div className="philosophy-card">
                <div className="card-top-icon" style={{ "--c": "#ec4899" }}>
                  {Icons.tools}
                </div>
                <h3>Real-World Campus Impact</h3>
                <p>
                  Built EduTechSRM and SRM Sarthi to solve actual friction points for thousands of university students — attendance tracking, timetable lookups, exam alerts, and smart AI chat.
                </p>
                <div className="card-mini-tags">
                  <span>Student Tools</span>
                  <span>AI Assistants</span>
                  <span>Vercel / Cloudflare</span>
                </div>
              </div>
            </div>

            {/* Immersive Audio/Visual teaser banner */}
            <div className="about-immersive-banner">
              <div className="banner-content">
                <span className="banner-badge">✦ IMMERSIVE AUDIO / VISUAL EXPERIENCE</span>
                <h3>Want to see the audio-reactive story?</h3>
                <p>
                  Check out the full <strong>/about</strong> experience featuring ambient background video,
                  custom soundtrack player, tilt physics, and an interactive personal showcase.
                </p>
              </div>
              <a href="/about" className="btn-banner-cta">
                Launch /about Experience {Icons.arrowUpRight}
              </a>
            </div>
          </div>
        </section>

        {/* FEATURED PROJECTS SECTION */}
        <section className="projects-section" id="projects">
          <div className="section-container">
            <div className="section-header-flex">
              <div>
                <p className="section-eyebrow">PORTFOLIO WORK</p>
                <h2 className="section-title">
                  Featured <span className="gradient-text">Creations.</span>
                </h2>
                <p className="section-desc">
                  Selected open-source applications, student utilities, and interactive web tools.
                </p>
              </div>

              {/* Filter tabs */}
              <div className="filter-tabs" role="tablist">
                <button
                  type="button"
                  className={`filter-btn ${activeFilter === "all" ? "active" : ""}`}
                  onClick={() => setActiveFilter("all")}
                >
                  All Projects
                </button>
                <button
                  type="button"
                  className={`filter-btn ${activeFilter === "flagship" ? "active" : ""}`}
                  onClick={() => setActiveFilter("flagship")}
                >
                  Flagship
                </button>
                <button
                  type="button"
                  className={`filter-btn ${activeFilter === "apps" ? "active" : ""}`}
                  onClick={() => setActiveFilter("apps")}
                >
                  Web Apps
                </button>
                <button
                  type="button"
                  className={`filter-btn ${activeFilter === "tools" ? "active" : ""}`}
                  onClick={() => setActiveFilter("tools")}
                >
                  Tools &amp; Backend
                </button>
              </div>
            </div>

            <div className="projects-showcase-grid">
              {filteredProjects.map((project) => (
                <article
                  key={project.title}
                  className="project-showcase-card"
                  style={{ "--accent": project.accent }}
                >
                  <div className="card-glow-reflection" aria-hidden="true" />
                  <div className="card-top-bar">
                    <span className="category-label">{project.category}</span>
                    <span className="badge-pill">{project.badge}</span>
                  </div>

                  <div className="card-title-group">
                    <h3 className="project-title">{project.title}</h3>
                    <p className="project-subtitle">{project.subtitle}</p>
                  </div>

                  <p className="project-description">{project.description}</p>

                  <div className="project-highlight-box">
                    <span className="highlight-dot" aria-hidden="true" />
                    <span>{project.stats}</span>
                  </div>

                  <div className="project-tags-row">
                    {project.tags.map((tag) => (
                      <span key={tag} className="tech-tag">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="card-footer-actions">
                    <a
                      href={project.link}
                      target={project.isInternal ? undefined : "_blank"}
                      rel={project.isInternal ? undefined : "noreferrer"}
                      className="project-action-link"
                    >
                      <span>{project.isInternal ? "Open Experience" : "View on GitHub"}</span>
                      {Icons.arrowUpRight}
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* SKILLS & TECHNICAL ARSENAL */}
        <section className="skills-section" id="skills">
          <div className="section-container">
            <div className="section-header-centered">
              <p className="section-eyebrow">TECH STACK</p>
              <h2 className="section-title">
                Engineering <span className="gradient-text">Toolkit.</span>
              </h2>
              <p className="section-desc">
                Technologies and tools I use to build scalable, responsive, and delightful web apps.
              </p>
            </div>

            <div className="skills-category-grid">
              {skillCategories.map((cat) => (
                <div key={cat.title} className="skill-category-card" style={{ "--cat-color": cat.color }}>
                  <div className="category-header">
                    <div className="category-icon-box">{Icons[cat.icon]}</div>
                    <h3>{cat.title}</h3>
                  </div>
                  <div className="skill-items-list">
                    {cat.skills.map((skill) => (
                      <div key={skill} className="skill-pill">
                        <span className="skill-bullet" aria-hidden="true" />
                        <span>{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* EXPERIENCE & EDUCATION TIMELINE */}
        <section className="timeline-section" id="experience">
          <div className="section-container">
            <div className="section-header-centered">
              <p className="section-eyebrow">JOURNEY</p>
              <h2 className="section-title">
                Experience &amp; <span className="gradient-text">Education.</span>
              </h2>
              <p className="section-desc">
                My academic and software development milestones.
              </p>
            </div>

            <div className="timeline-list">
              {timeline.map((item, index) => (
                <div key={item.role} className="timeline-item" style={{ "--i": index }}>
                  <div className="timeline-marker">
                    <span className="marker-dot" />
                    <span className="marker-line" />
                  </div>
                  <div className="timeline-content-card">
                    <div className="timeline-card-header">
                      <span className="timeline-period">{item.period}</span>
                      <span className="timeline-badge">{item.badge}</span>
                    </div>
                    <h3 className="timeline-role">{item.role}</h3>
                    <div className="timeline-org-row">
                      <strong>{item.organization}</strong>
                      <span className="org-bullet">·</span>
                      <span>{item.location}</span>
                    </div>
                    <p className="timeline-description">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* GITHUB ACTIVITY CALLOUT */}
        <section className="activity-callout-section">
          <div className="section-container">
            <div className="activity-card-container">
              <div className="activity-text">
                <span className="callout-pill">LIVE ANALYTICS</span>
                <h2>236+ GitHub Contributions in 2026</h2>
                <p>
                  Curious to see my real-time commit heatmaps, contribution streaks, and push timelines?
                  I built a custom interactive activity viewer powered by GitHub data snapshots.
                </p>
                <div className="activity-actions">
                  <a href="/activity" className="btn-primary">
                    View Live Activity Heatmap {Icons.arrowUpRight}
                  </a>
                  <a
                    href="https://github.com/coderaarav12"
                    target="_blank"
                    rel="noreferrer"
                    className="btn-secondary"
                  >
                    {Icons.github} Follow @coderaarav12
                  </a>
                </div>
              </div>
              <div className="activity-graphic">
                <div className="graphic-grid-mockup" aria-hidden="true">
                  <div className="mockup-row">
                    <span className="mock-cell level-0" />
                    <span className="mock-cell level-1" />
                    <span className="mock-cell level-2" />
                    <span className="mock-cell level-4" />
                    <span className="mock-cell level-3" />
                    <span className="mock-cell level-1" />
                    <span className="mock-cell level-4" />
                  </div>
                  <div className="mockup-row">
                    <span className="mock-cell level-2" />
                    <span className="mock-cell level-3" />
                    <span className="mock-cell level-4" />
                    <span className="mock-cell level-2" />
                    <span className="mock-cell level-4" />
                    <span className="mock-cell level-4" />
                    <span className="mock-cell level-3" />
                  </div>
                  <div className="mockup-row">
                    <span className="mock-cell level-1" />
                    <span className="mock-cell level-4" />
                    <span className="mock-cell level-3" />
                    <span className="mock-cell level-4" />
                    <span className="mock-cell level-2" />
                    <span className="mock-cell level-3" />
                    <span className="mock-cell level-4" />
                  </div>
                </div>
                <div className="graphic-badge">
                  <span>Consistent Builder</span>
                  <strong>Active Daily Streaks</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT & CONNECT SECTION */}
        <section className="contact-section" id="contact">
          <div className="section-container">
            <div className="section-header-centered">
              <p className="section-eyebrow">GET IN TOUCH</p>
              <h2 className="section-title">
                Let&apos;s Build Something <span className="gradient-text">Exceptional.</span>
              </h2>
              <p className="section-desc">
                Have a project, internship opportunity, or question? Feel free to reach out anytime.
              </p>
            </div>

            <div className="contact-cards-grid">
              {contacts.map((contact) => (
                <div
                  key={contact.label}
                  className="contact-interactive-card"
                  style={{ "--accent": contact.accent }}
                >
                  <div className="contact-card-icon">{Icons[contact.icon]}</div>
                  <div className="contact-card-details">
                    <span className="contact-label">{contact.label}</span>
                    <strong className="contact-val">{contact.value}</strong>
                  </div>
                  <div className="contact-card-actions">
                    <button
                      type="button"
                      className="contact-copy-btn"
                      onClick={() => copyToClipboard(contact.value, contact.label)}
                      title={`Copy ${contact.label}`}
                    >
                      {copied === contact.label ? "Copied ✓" : "Copy"}
                    </button>
                    <a
                      href={contact.href}
                      target={contact.href.startsWith("http") ? "_blank" : undefined}
                      rel="noreferrer"
                      className="contact-open-btn"
                      aria-label={`Open ${contact.label}`}
                    >
                      Open ↗
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Email Composer Trigger */}
            <div className="direct-email-banner">
              <div className="banner-left">
                <h3>Prefer a direct email?</h3>
                <p>Click below to open your favorite email client with a pre-filled subject line.</p>
              </div>
              <a
                href="mailto:goelaarav290@gmail.com?subject=Hello%20Aarav%20-%20Portfolio%20Inquiry"
                className="btn-primary"
              >
                Send Direct Email →
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="portfolio-footer">
        <div className="footer-container">
          <div className="footer-top">
            <div className="footer-brand">
              <span className="brand-tag">AARAV GOEL</span>
              <p>Frontend Engineer · Vibe Coder · 2nd Year Student @ SRMIST KTR</p>
            </div>

            <div className="footer-links-group">
              <a href="#about">About</a>
              <a href="#projects">Projects</a>
              <a href="#skills">Skills</a>
              <a href="#experience">Experience</a>
              <a href="/about">/about story</a>
              <a href="/activity">Live Heatmap</a>
              <a href="/app_tutorials">Tutorials Hub</a>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} Aarav Goel. All rights reserved.</p>
            <div className="footer-badges">
              <span className="status-indicator">
                <span className="status-dot-active" /> Systems Operational
              </span>
              <a href="#" className="back-to-top">
                Back to top ↑
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
