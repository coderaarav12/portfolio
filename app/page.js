"use client";

import { useEffect, useRef, useState } from "react";

const projects = [
  {
    title: "EdutechSRM",
    subtitle: "Full-Stack Academic Dashboard",
    category: "Flagship / Full-Stack & AI",
    period: "March 2026 – Present",
    description:
      "Comprehensive academic portal for SRMIST KTR students currently used by 250+ active users. Built on a serverless architecture with token-based session security (no password storage). Integrates timetable synchronization, attendance tracking with threshold alerts, internal marks computation, CGPA forecasting, and an academic AI assistant.",
    demoInfo: "Demo Credentials (Non-SRM) — NetID: dm1234 | Password: edutechsrm@124",
    tags: [
      "Next.js 16",
      "Tailwind CSS",
      "Framer Motion",
      "Radix UI",
      "Serverless TypeScript",
      "Cloudflare Workers",
      "Playwright Scraping",
    ],
    liveLink: "https://www.edutechsrm.in",
    githubLink: "https://github.com/coderaarav12/edutechsrm-frontend-in",
    highlight: "250+ Active Users",
    badge: "Flagship",
    accent: "#8b5cf6",
  },
  {
    title: "Ripple",
    subtitle: "Regional Medicine Shortage Detection & Redistribution",
    category: "AI & Network Intelligence / Hackathon",
    period: "Manipal Hackathon '26 (Sep 2026)",
    description:
      "An intelligent, early-warning supply chain network intelligence platform designed around one foundational insight: 'One low facility is noise; several nearby facilities running low on the same medicine at the same time is signal.' Catches emerging regional shortages days before facilities hit zero by analyzing consumption velocity, confidence-bounded stock runways, and geospatial clustering.",
    tags: [
      "Python",
      "FastAPI",
      "Uvicorn",
      "Pandas",
      "NumPy",
      "SciPy",
      "Scikit-learn",
      "Leaflet.js",
      "JavaScript",
    ],
    githubLink: "https://github.com/4rch1t/ripple",
    highlight: "Manipal Hackathon 2026",
    badge: "Hackathon '26",
    accent: "#06b6d4",
  },
  {
    title: "SyncMasters",
    subtitle: "CPSE Material Intelligence Portal",
    category: "GovTech & GenAI / Smart India Hackathon",
    period: "Smart India Hackathon (Sep 2026)",
    description:
      "Full-stack GovTech platform developed to standardize fragmented raw-material nomenclature across India's Central Public Sector Enterprises (CPSEs), enabling unified procurement and demand aggregation. Built an AI orchestration pipeline using local Llama 3.2 Vision models via Ollama to ingest, extract, normalize, and map thousands of material records into a unified master database.",
    tags: [
      "React 18",
      "Vite",
      "Tailwind CSS",
      "Cloudflare Workers",
      "Hono",
      "Cloudflare D1",
      "FastAPI",
      "Ollama",
      "Llama 3.2 Vision",
    ],
    githubLink: "https://github.com/coderaarav12/SIH2026",
    highlight: "Smart India Hackathon 2026",
    badge: "SIH '26",
    accent: "#ec4899",
  },
  {
    title: "Trust OS",
    subtitle: "AI Assessment & Interview Integrity Platform",
    category: "AI Integrity & Vision / Hackathon",
    period: "Hackathon (Aug 2026)",
    description:
      "An AI integrity verification platform that verifies whether a candidate genuinely completed an interview, assessment, coding challenge, or remote work session. Instead of relying on brittle AI classifiers, TrustOS combines browser telemetry signals, face and hand behavioral tracking, and multi-agent AI analysis into an Explainable Score backed by verifiable evidence.",
    tags: ["Chrome Extension", "FastAPI", "Python", "Computer Vision", "Multi-Agent AI"],
    githubLink: "https://github.com/coderaarav12/Hackathon-TrustOS",
    highlight: "Multi-Agent Integrity Verification",
    badge: "AI Platform",
    accent: "#10b981",
  },
  {
    title: "MediaHub",
    subtitle: "Multi-Source Media Streaming Client",
    category: "Full-Stack Web App",
    period: "2026",
    description:
      "High-performance media streaming platform allowing users to search and stream movies, TV shows, and anime with multi-provider embed fallbacks, instant search indexing, and a sleek cinema dark-mode interface.",
    tags: ["React 19", "Next.js", "Tailwind CSS", "Custom Embed APIs", "Responsive Video"],
    githubLink: "https://github.com/coderaarav12/media-hub-frontend",
    highlight: "Multi-Source Streaming",
    badge: "Web App",
    accent: "#f59e0b",
  },
  {
    title: "SRM Sarthi Web",
    subtitle: "Instant Campus Utility Portal",
    category: "Campus Utility",
    period: "2026",
    description:
      "Lightweight, mobile-first student utility web experience deployed on Vercel. Delivers instant access to verified university portals, campus links, bus schedules, and essential everyday student tools.",
    tags: ["Next.js", "React", "Vercel Edge", "Tailwind CSS"],
    githubLink: "https://github.com/coderaarav12/srm-sarthi-web",
    highlight: "Vercel Edge Deployment",
    badge: "Utility",
    accent: "#6366f1",
  },
  {
    title: "Live GitHub Activity Heatmap",
    subtitle: "Real-Time Engineering Tracker",
    category: "Data Viz & Analytics",
    period: "Live",
    description:
      "Self-hosted interactive contribution calendar, commit heatmap, and push velocity graph. Inspect commits day by day and follow real-time development velocity across 270+ contributions.",
    tags: ["Next.js", "SVG Graphing", "GitHub API", "Data Viz"],
    internalLink: "/activity",
    highlight: "270+ Commits · Real-Time",
    badge: "Interactive",
    accent: "#34d399",
  },
  {
    title: "App Tutorials & Knowledge Vault",
    subtitle: "Curated Engineering Resource Library",
    category: "Developer Library",
    period: "Active",
    description:
      "Centralized cloud repository containing curated mobile and web development tutorials, architecture diagrams, study materials, and reference guides for developers and students.",
    tags: ["Google Drive", "Cloudflare Worker", "Developer Guides", "Curated Vault"],
    internalLink: "/app_tutorials",
    highlight: "Curated Study Vault",
    badge: "Resources",
    accent: "#a855f7",
  },
];

const experiences = [
  {
    period: "Sep 2026 – Present",
    role: "PR Team Member",
    organization: "Directorate of Alumni Affairs (SRM)",
    badge: "Public Relations",
    points: [
      "Assisted in planning and executing promotional and communication initiatives for university alumni events and activities.",
      "Supported event coordination, publicity, and outreach efforts to strengthen alumni–student engagement across campus.",
      "Created and coordinated digital content for event promotions, announcements, and institutional outreach campaigns.",
    ],
  },
  {
    period: "Sep 2026 – Present",
    role: "Tech Web Development Team Member",
    organization: "Entrepreneurship Cell SRM (E-Cell SRM)",
    badge: "Web Development",
    points: [
      "Selected as a core member of the Tech & Web Development Team, contributing to the development and maintenance of E-Cell SRM's digital platforms.",
      "Collaborating with the technical team on full-stack web development, UI improvements, and technology-driven entrepreneurship initiatives.",
    ],
  },
  {
    period: "May 2026 – Present",
    role: "Design Manager",
    organization: "Cherry+ Network",
    badge: "Design Strategy",
    points: [
      "Leading design strategy and visual identity for Cherry+ Network, an interactive social platform for campus communities.",
      "Managing end-to-end design workflows, coordinating with cross-functional development teams, and ensuring brand consistency across all digital touchpoints.",
      "Mentoring junior design team members and driving cohesive user experiences from concept to shipping.",
    ],
  },
  {
    period: "Oct 2025 – May 2026",
    role: "Design Intern",
    organization: "Cherry+ Network",
    badge: "Internship",
    points: [
      "Worked closely with the design team to develop engaging visual content while maintaining strict consistency with organizational branding.",
      "Contributed to promotional creatives, event content, and digital media assets across social platforms and web properties.",
    ],
  },
];

const educationList = [
  {
    degree: "Bachelor of Technology in Computer Science (CSE AI/ML)",
    institution: "SRM Institute of Science and Technology (SRMIST KTR)",
    location: "Chennai, India",
    period: "2025 – 2029",
    meta: "Currently in Semester 3 · Year-1 CGPA: 6.86",
    badge: "Undergraduate",
  },
  {
    degree: "Senior Secondary & High School (PCM & Engineering Graphics)",
    institution: "Vedritam Group (DAV Group of Schools)",
    location: "India",
    period: "2017 – 2025",
    meta: "Class 10th: 91.2% | Class 12th: 71.2%",
    badge: "Schooling",
  },
];

const certifications = [
  {
    title: "AI Fundamentals",
    issuer: "Google",
    date: "May 2026",
    credentialId: "8YPOZH4YAEMI",
    accent: "#4285f4",
  },
  {
    title: "Object Oriented Programming with C++",
    issuer: "Microsoft (Coursera)",
    date: "May 2026",
    credentialId: "DIAVK96YVZDV",
    accent: "#00a4ef",
  },
  {
    title: "Python for Data Science, AI & Development",
    issuer: "IBM",
    date: "Dec 2025",
    credentialId: "WGD2ICSMNBZS",
    accent: "#054ada",
  },
  {
    title: "The Fundamentals of RDMA Programming",
    issuer: "NVIDIA",
    date: "Jul 2025",
    credentialId: "KN4PJG9RWP0H",
    accent: "#76b900",
  },
  {
    title: "ENDURO — Software Training & Personality Workshop",
    issuer: "ENDURO in collab with IIT Hyderabad",
    date: "Aug 2025",
    credentialId: "EN251633",
    accent: "#f59e0b",
  },
  {
    title: "Programming with C++",
    issuer: "Simplilearn",
    date: "Jul 2025",
    credentialId: "TQSK59BDIBQ4",
    accent: "#10b981",
  },
  {
    title: "AI for Beginners",
    issuer: "HP LIFE",
    date: "Jun 2025",
    credentialId: "HP-LIFE-CERT",
    accent: "#0096d6",
  },
];

const technicalSkillGroups = [
  {
    category: "Languages",
    color: "#8b5cf6",
    skills: ["Python", "C++", "JavaScript", "TypeScript"],
  },
  {
    category: "Web & Frontend",
    color: "#06b6d4",
    skills: [
      "Next.js 16",
      "React 19 / 18",
      "Tailwind CSS",
      "Framer Motion",
      "Radix UI",
      "Vite",
      "HTML5",
      "CSS3",
    ],
  },
  {
    category: "Backend & Cloud",
    color: "#ec4899",
    skills: [
      "Cloudflare Workers",
      "Hono",
      "Cloudflare D1",
      "FastAPI",
      "Uvicorn",
      "REST APIs",
      "Web Scraping (Playwright)",
    ],
  },
  {
    category: "AI, ML & Data",
    color: "#10b981",
    skills: [
      "Ollama",
      "Llama 3.2",
      "Llama 3.2 Vision",
      "Pandas",
      "NumPy",
      "SciPy",
      "Scikit-learn",
    ],
  },
  {
    category: "Dev Tools & Creative",
    color: "#f59e0b",
    skills: [
      "Git",
      "GitHub",
      "Linux / WSL",
      "Postman",
      "Adobe Premiere Pro",
      "After Effects",
    ],
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
    value: "coderaarav12",
    href: "https://github.com/coderaarav12",
    icon: "github",
    accent: "#8b5cf6",
  },
  {
    label: "LinkedIn",
    value: "in/aaravgoel12",
    href: "https://linkedin.com/in/aaravgoel12",
    icon: "linkedin",
    accent: "#0a66c2",
  },
  {
    label: "Portfolio",
    value: "goelaarav.dpdns.org",
    href: "https://goelaarav.dpdns.org",
    icon: "globe",
    accent: "#10b981",
  },
];

const interests = [
  { label: "Video Editing", desc: "Premiere Pro & After Effects", icon: "🎬" },
  { label: "Reading Novels", desc: "Sci-Fi, Tech & Literature", icon: "📚" },
  { label: "Swimming", desc: "Endurance & Focus", icon: "🏊" },
  { label: "Lawn Tennis", desc: "Agility & Precision", icon: "🎾" },
];

const Icons = {
  github: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.05-.02-2.06-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.2.08 1.83 1.23 1.83 1.23 1.07 1.83 2.8 1.3 3.49 1 .11-.78.42-1.31.76-1.61-2.66-.3-5.46-1.33-5.46-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6.01 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.63-5.47 5.92.43.37.81 1.1.81 2.22 0 1.61-.01 2.9-.01 3.3 0 .32.22.7.83.58A12.02 12.02 0 0 0 24 12.5C24 5.87 18.63.5 12 .5z" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.32-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  ),
  globe: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  mail: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  phone: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  arrowUpRight: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  ),
  external: (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
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

    animate();
    window.addEventListener("pointermove", movePointer);

    return () => {
      alive = false;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("pointermove", movePointer);
    };
  }, []);

  const filteredProjects =
    activeFilter === "all"
      ? projects
      : activeFilter === "ai"
      ? projects.filter((p) => p.category.includes("AI") || p.badge.includes("Hackathon"))
      : activeFilter === "web"
      ? projects.filter((p) => p.category.includes("Full-Stack") || p.badge === "Flagship" || p.badge === "Web App")
      : projects.filter((p) => p.badge.includes("Utility") || p.badge.includes("Resources") || p.internalLink);

  return (
    <div className="portfolio-root" ref={sceneRef}>
      {/* Background ambient glowing orbs */}
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

      {/* Sticky Header Navigation (Clean, no /about) */}
      <header className={`portfolio-header ${navScrolled ? "header-scrolled" : ""}`}>
        <div className="header-container">
          <a href="#" className="brand-logo" aria-label="Aarav Goel Home">
            <span className="logo-badge">AG</span>
            <span className="logo-text">
              <strong>Aarav Goel</strong>
              <small>AI/ML @ SRMIST KTR</small>
            </span>
          </a>

          <nav className="desktop-nav" aria-label="Main Navigation">
            <a href="#about" className="nav-item">About</a>
            <a href="#projects" className="nav-item">Projects</a>
            <a href="#experience" className="nav-item">Experience</a>
            <a href="#skills" className="nav-item">Skills</a>
            <a href="#education" className="nav-item">Education</a>
            <a href="#certifications" className="nav-item">Certs</a>
            <a href="/activity" className="nav-item nav-activity-pill">
              <span className="live-dot" aria-hidden="true" /> Activity
            </a>
            <a href="#contact" className="nav-item">Contact</a>
          </nav>

          <div className="header-actions">
            <a
              href="https://github.com/coderaarav12"
              target="_blank"
              rel="noreferrer"
              className="btn-ghost"
              aria-label="GitHub Profile"
            >
              {Icons.github}
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
                <span>AI/ML Undergraduate @ SRMIST KTR · Semester 3 · Open to Opportunities</span>
              </div>

              <h1 className="hero-main-title">
                <span>AI/ML STUDENT &amp;</span>
                <span className="gradient-text">FULL-STACK</span>
                <span>ENGINEER.</span>
              </h1>

              <p className="hero-subtext">
                I&apos;m <strong>Aarav Goel</strong> — a builder-oriented developer who enjoys solving practical
                problems through technology. Experienced in building and deploying real-world applications with
                Python, TypeScript, Next.js, APIs, automation, and cloud technologies.
              </p>

              <div className="hero-cta-group">
                <a href="#projects" className="btn-primary">
                  Explore Projects <span aria-hidden="true">↓</span>
                </a>
                <a href="#experience" className="btn-secondary">
                  Experience &amp; Roles
                </a>
                <a
                  href="https://linkedin.com/in/aaravgoel12"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-ghost"
                  aria-label="LinkedIn Profile"
                >
                  {Icons.linkedin}
                  <span>LinkedIn</span>
                </a>
              </div>

              <div className="hero-quick-tags">
                <span className="tag-chip">Next.js 16</span>
                <span className="tag-chip">FastAPI &amp; Python</span>
                <span className="tag-chip">TypeScript</span>
                <span className="tag-chip">Cloudflare Workers</span>
                <span className="tag-chip">Llama 3.2 Vision / AI</span>
                <span className="tag-chip">Web Automation</span>
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
                  <span className="badge-icon">🎓</span>
                  <div>
                    <strong>B.Tech CSE AI/ML</strong>
                    <small>SRMIST KTR · 2025–2029</small>
                  </div>
                </div>

                <div className="floating-badge badge-bottom-left">
                  <span className="badge-icon">🚀</span>
                  <div>
                    <strong>250+ Active Users</strong>
                    <small>EdutechSRM Platform</small>
                  </div>
                </div>

                <div className="photo-card-footer">
                  <div className="footer-profile-meta">
                    <span className="avatar-chip">AG</span>
                    <div>
                      <strong>Aarav Goel</strong>
                      <p>Aspiring AI Software Engineer</p>
                    </div>
                  </div>
                  <a
                    href="https://linkedin.com/in/aaravgoel12"
                    target="_blank"
                    rel="noreferrer"
                    className="card-linkedin-btn"
                    aria-label="LinkedIn Profile"
                  >
                    {Icons.linkedin}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* METRICS & CORE EXPERTISE STRIP */}
        <section className="metrics-strip" aria-label="Key highlights">
          <div className="metrics-container">
            <div className="metric-box">
              <strong className="metric-number">250+</strong>
              <span className="metric-label">Active Users on EdutechSRM</span>
            </div>
            <div className="metric-box">
              <strong className="metric-number">3+</strong>
              <span className="metric-label">Hackathon AI Platforms (SIH &amp; Manipal)</span>
            </div>
            <div className="metric-box">
              <strong className="metric-number">7+</strong>
              <span className="metric-label">Industry Certifications</span>
            </div>
            <div className="metric-box">
              <strong className="metric-number">270+</strong>
              <span className="metric-label">GitHub Contributions</span>
            </div>
          </div>
        </section>

        {/* CAREER SUMMARY / ABOUT ME */}
        <section className="about-spotlight-section" id="about">
          <div className="section-container">
            <div className="section-header-centered">
              <p className="section-eyebrow">CAREER SUMMARY</p>
              <h2 className="section-title">
                Building Practical, <span className="gradient-text">Scalable Products.</span>
              </h2>
              <p className="section-desc">
                AI/ML undergraduate at SRMIST KTR with hands-on experience building and deploying
                real-world full-stack applications, with a strong focus on Python, TypeScript, Next.js,
                APIs, automation, and cloud technologies.
              </p>
            </div>

            <div className="philosophy-grid">
              <div className="philosophy-card">
                <div className="card-top-icon" style={{ "--c": "#8b5cf6" }}>
                  <span style={{ fontSize: "1.4rem" }}>⚡</span>
                </div>
                <h3>Full-Stack &amp; Cloud Deployment</h3>
                <p>
                  Architecting end-to-end applications using Next.js 16, React, Tailwind CSS, and
                  serverless edge backends on Cloudflare Workers and Vercel. Focused on zero-credential
                  token authentication, instant performance, and clean UI execution.
                </p>
                <div className="card-mini-tags">
                  <span>Full-Stack</span>
                  <span>Serverless</span>
                  <span>Cloudflare</span>
                  <span>Vercel</span>
                </div>
              </div>

              <div className="philosophy-card">
                <div className="card-top-icon" style={{ "--c": "#06b6d4" }}>
                  <span style={{ fontSize: "1.4rem" }}>🧠</span>
                </div>
                <h3>AI &amp; Intelligent Automation</h3>
                <p>
                  Developing AI-driven solutions from multimodal material intelligence pipelines
                  (Llama 3.2 Vision via Ollama for SIH 2026) to supply-chain early warning networks
                  (Ripple at Manipal Hackathon) and explainable candidate verification (TrustOS).
                </p>
                <div className="card-mini-tags">
                  <span>Llama 3.2</span>
                  <span>Ollama</span>
                  <span>FastAPI</span>
                  <span>Scikit-learn</span>
                </div>
              </div>

              <div className="philosophy-card">
                <div className="card-top-icon" style={{ "--c": "#ec4899" }}>
                  <span style={{ fontSize: "1.4rem" }}>👥</span>
                </div>
                <h3>Campus Leadership &amp; Design</h3>
                <p>
                  Active contributor across SRMIST campus organizations: Tech Web Development Team Member at
                  E-Cell SRM, PR Team Member at Directorate of Alumni Affairs, and Design Manager
                  at Cherry+ Network managing brand strategy and workflows.
                </p>
                <div className="card-mini-tags">
                  <span>E-Cell SRM</span>
                  <span>Alumni Affairs</span>
                  <span>Cherry+ Network</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED PROJECTS SHOWCASE */}
        <section className="projects-section" id="projects">
          <div className="section-container">
            <div className="section-header-flex">
              <div>
                <p className="section-eyebrow">PORTFOLIO WORK</p>
                <h2 className="section-title">
                  Featured <span className="gradient-text">Projects.</span>
                </h2>
                <p className="section-desc">
                  Real-world deployed web applications, AI platforms, and hackathon prototypes.
                </p>
              </div>

              {/* Filter tabs */}
              <div className="filter-tabs" role="tablist">
                <button
                  type="button"
                  className={`filter-btn ${activeFilter === "all" ? "active" : ""}`}
                  onClick={() => setActiveFilter("all")}
                >
                  All ({projects.length})
                </button>
                <button
                  type="button"
                  className={`filter-btn ${activeFilter === "ai" ? "active" : ""}`}
                  onClick={() => setActiveFilter("ai")}
                >
                  AI &amp; Hackathons
                </button>
                <button
                  type="button"
                  className={`filter-btn ${activeFilter === "web" ? "active" : ""}`}
                  onClick={() => setActiveFilter("web")}
                >
                  Full-Stack Web
                </button>
                <button
                  type="button"
                  className={`filter-btn ${activeFilter === "tools" ? "active" : ""}`}
                  onClick={() => setActiveFilter("tools")}
                >
                  Tools &amp; Vault
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
                  <div className="card-top-bar">
                    <span className="category-label">{project.category}</span>
                    <span className="badge-pill">{project.badge}</span>
                  </div>

                  <div className="card-title-group">
                    <h3 className="project-title">{project.title}</h3>
                    <p className="project-subtitle">{project.subtitle}</p>
                    {project.period ? (
                      <span style={{ fontSize: "0.76rem", color: "rgba(246, 247, 251, 0.5)", marginTop: "2px", display: "block" }}>
                        {project.period}
                      </span>
                    ) : null}
                  </div>

                  <p className="project-description">{project.description}</p>

                  {project.demoInfo ? (
                    <div
                      style={{
                        padding: "10px 14px",
                        borderRadius: "10px",
                        background: "rgba(139, 92, 246, 0.08)",
                        border: "1px solid rgba(139, 92, 246, 0.25)",
                        fontSize: "0.78rem",
                        color: "#c4b5fd",
                        marginBottom: "16px",
                        fontFamily: "monospace",
                      }}
                    >
                      {project.demoInfo}
                    </div>
                  ) : null}

                  <div className="project-highlight-box">
                    <span className="highlight-dot" aria-hidden="true" />
                    <span>{project.highlight}</span>
                  </div>

                  <div className="project-tags-row">
                    {project.tags.map((tag) => (
                      <span key={tag} className="tech-tag">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="card-footer-actions">
                    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
                      {project.liveLink ? (
                        <a
                          href={project.liveLink}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-primary-sm"
                          style={{ textDecoration: "none", fontSize: "0.78rem" }}
                        >
                          Visit Live App {Icons.external}
                        </a>
                      ) : null}
                      {project.githubLink ? (
                        <a
                          href={project.githubLink}
                          target="_blank"
                          rel="noreferrer"
                          className="project-action-link"
                        >
                          {Icons.github}
                          <span>Source Code</span>
                          {Icons.arrowUpRight}
                        </a>
                      ) : null}
                      {project.internalLink ? (
                        <a href={project.internalLink} className="project-action-link">
                          <span>Open Resource</span>
                          {Icons.arrowUpRight}
                        </a>
                      ) : null}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ACADEMIC & LEADERSHIP EXPERIENCE */}
        <section className="timeline-section" id="experience">
          <div className="section-container">
            <div className="section-header-centered">
              <p className="section-eyebrow">LEADERSHIP &amp; ROLES</p>
              <h2 className="section-title">
                Academic &amp; Professional <span className="gradient-text">Experience.</span>
              </h2>
              <p className="section-desc">
                Active campus roles, organizational responsibilities, and design leadership.
              </p>
            </div>

            <div className="timeline-list">
              {experiences.map((exp, index) => (
                <div key={exp.role + exp.organization} className="timeline-item" style={{ "--i": index }}>
                  <div className="timeline-marker">
                    <span className="marker-dot" />
                    <span className="marker-line" />
                  </div>
                  <div className="timeline-content-card">
                    <div className="timeline-card-header">
                      <span className="timeline-period">{exp.period}</span>
                      <span className="timeline-badge">{exp.badge}</span>
                    </div>
                    <h3 className="timeline-role">{exp.role}</h3>
                    <div className="timeline-org-row">
                      <strong>{exp.organization}</strong>
                    </div>
                    <ul style={{ margin: "12px 0 0", paddingLeft: "18px", color: "var(--text-muted)", fontSize: "0.92rem", lineHeight: "1.7" }}>
                      {exp.points.map((pt, i) => (
                        <li key={i} style={{ marginBottom: "6px" }}>
                          {pt}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TECHNICAL SKILLS ARSENAL */}
        <section className="skills-section" id="skills">
          <div className="section-container">
            <div className="section-header-centered">
              <p className="section-eyebrow">EXPERTISE &amp; STACK</p>
              <h2 className="section-title">
                Technical <span className="gradient-text">Skills.</span>
              </h2>
              <p className="section-desc">
                Core technologies, frameworks, and developer tools across full-stack and AI development.
              </p>
            </div>

            <div className="skills-category-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
              {technicalSkillGroups.map((group) => (
                <div key={group.category} className="skill-category-card" style={{ "--cat-color": group.color }}>
                  <div className="category-header">
                    <div className="category-icon-box" style={{ background: `${group.color}15`, color: group.color, border: `1px solid ${group.color}35` }}>
                      <span>✦</span>
                    </div>
                    <h3 style={{ fontSize: "1rem" }}>{group.category}</h3>
                  </div>
                  <div className="skill-items-list">
                    {group.skills.map((skill) => (
                      <div key={skill} className="skill-pill">
                        <span className="skill-bullet" aria-hidden="true" style={{ background: group.color }} />
                        <span>{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* EDUCATION SECTION */}
        <section className="education-section" id="education" style={{ padding: "60px 0" }}>
          <div className="section-container">
            <div className="section-header-centered">
              <p className="section-eyebrow">ACADEMIC BACKGROUND</p>
              <h2 className="section-title">
                Education &amp; <span className="gradient-text">Qualifications.</span>
              </h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px", maxWidth: "960px", margin: "0 auto" }}>
              {educationList.map((edu) => (
                <div
                  key={edu.institution}
                  style={{
                    padding: "32px 28px",
                    borderRadius: "24px",
                    background: "linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))",
                    border: "1px solid var(--border-subtle)",
                    backdropFilter: "blur(14px)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                      {edu.period}
                    </span>
                    <span className="timeline-badge">{edu.badge}</span>
                  </div>
                  <h3 style={{ margin: "0 0 8px", fontSize: "1.2rem", fontWeight: 800 }}>{edu.degree}</h3>
                  <p style={{ margin: "0 0 12px", color: "rgba(246, 247, 251, 0.8)", fontWeight: 600, fontSize: "0.95rem" }}>
                    {edu.institution}
                  </p>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-dim)" }}>
                    {edu.meta}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CERTIFICATIONS SECTION */}
        <section className="certifications-section" id="certifications" style={{ padding: "60px 0" }}>
          <div className="section-container">
            <div className="section-header-centered">
              <p className="section-eyebrow">CREDENTIALS</p>
              <h2 className="section-title">
                Certifications &amp; <span className="gradient-text">Workshops.</span>
              </h2>
              <p className="section-desc">
                Verified training and certifications in AI, C++, Python, and High-Performance Systems.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "18px" }}>
              {certifications.map((cert) => (
                <div
                  key={cert.title + cert.issuer}
                  style={{
                    padding: "24px",
                    borderRadius: "20px",
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid var(--border-subtle)",
                    backdropFilter: "blur(12px)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                      <span style={{ fontSize: "0.74rem", fontWeight: 700, color: cert.accent, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                        {cert.issuer}
                      </span>
                      <span style={{ fontSize: "0.72rem", color: "var(--text-dim)" }}>{cert.date}</span>
                    </div>
                    <h3 style={{ margin: "0 0 12px", fontSize: "1.05rem", fontWeight: 700 }}>{cert.title}</h3>
                  </div>
                  {cert.credentialId ? (
                    <div style={{ fontSize: "0.72rem", color: "var(--text-dim)", fontFamily: "monospace", paddingTop: "12px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                      Credential ID: {cert.credentialId}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* INTERESTS SECTION */}
        <section className="interests-section" style={{ padding: "40px 0 80px" }}>
          <div className="section-container">
            <div className="section-header-centered">
              <p className="section-eyebrow">BEYOND CODING</p>
              <h2 className="section-title">
                Personal <span className="gradient-text">Interests.</span>
              </h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "18px", maxWidth: "1000px", margin: "0 auto" }}>
              {interests.map((item) => (
                <div
                  key={item.label}
                  style={{
                    padding: "24px",
                    borderRadius: "20px",
                    background: "rgba(255, 255, 255, 0.025)",
                    border: "1px solid var(--border-subtle)",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "2rem", marginBottom: "10px" }}>{item.icon}</div>
                  <h3 style={{ margin: "0 0 4px", fontSize: "1.05rem", fontWeight: 700 }}>{item.label}</h3>
                  <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--text-dim)" }}>{item.desc}</p>
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
                <span className="callout-pill">LIVE HEATMAP &amp; METRICS</span>
                <h2>270+ GitHub Contributions &amp; Active Streaks</h2>
                <p>
                  Explore my interactive contribution calendar, push velocity, and commit history across
                  all repositories. Powered by real-time snapshot data.
                </p>
                <div className="activity-actions">
                  <a href="/activity" className="btn-primary">
                    View Live Heatmap {Icons.arrowUpRight}
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
                  <strong>Active Engineering Streaks</strong>
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
                Have an AI project, internship opportunity, or question? Feel free to reach out anytime.
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

            {/* Direct Email Composer Trigger */}
            <div className="direct-email-banner">
              <div className="banner-left">
                <h3>Looking for an AI / Full-Stack Engineer?</h3>
                <p>Feel free to shoot me an email directly. I respond quickly.</p>
              </div>
              <a
                href="mailto:goelaarav290@gmail.com?subject=Hello%20Aarav%20-%20Opportunity%20Inquiry"
                className="btn-primary"
              >
                Send Direct Email →
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER (Clean, no /about) */}
      <footer className="portfolio-footer">
        <div className="footer-container">
          <div className="footer-top">
            <div className="footer-brand">
              <span className="brand-tag">AARAV GOEL</span>
              <p>AI/ML Undergraduate @ SRMIST KTR · Aspiring AI Software Engineer</p>
            </div>

            <div className="footer-links-group">
              <a href="#about">About</a>
              <a href="#projects">Projects</a>
              <a href="#experience">Experience</a>
              <a href="#skills">Skills</a>
              <a href="#education">Education</a>
              <a href="#certifications">Certifications</a>
              <a href="/activity">Activity Heatmap</a>
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
