"use client";

import { useEffect, useRef } from "react";

const projects = [
  {
    name: "EduTechSRM",
    type: "Featured",
    description:
      "Academic dashboard for SRMIST KTR with timetable, attendance, marks, CGPA, and an AI assistant.",
    link: "https://github.com/coderaarav12/edutechsrm-frontend-in",
  },
  {
    name: "MediaHub",
    type: "Featured",
    description:
      "Search and stream movies, TV shows, and anime from multiple embed sources.",
    link: "https://github.com/coderaarav12/media-hub-frontend",
  },
  {
    name: "SRM Sarthi",
    type: "Web App",
    description: "A clean SRM helper web experience with a Vercel deployment.",
    link: "https://github.com/coderaarav12/srm-sarthi-web",
  },
  {
    name: "SRM Planner Backend",
    type: "Backend",
    description: "Python backend for the older SRM planning stack.",
    link: "https://github.com/coderaarav12/SRMPlannerBackend--OLD",
  },
  {
    name: "MediaHub API",
    type: "API",
    description: "API layer supporting the media project stack.",
    link: "https://github.com/coderaarav12/media-hub-api",
  },
  {
    name: "Portfolio",
    type: "Current",
    description: "This portfolio teaser and deployment setup.",
    link: "https://github.com/coderaarav12/portfolio",
  },
  {
    name: "HelloApp",
    type: "App",
    description: "A lightweight public app repo from the profile.",
    link: "https://github.com/coderaarav12/HelloApp",
  },
  {
    name: "UC",
    type: "Java",
    description: "Small Java project from the public profile.",
    link: "https://github.com/coderaarav12/UC",
  },
  {
    name: "OOPSBannerApp",
    type: "Java",
    description: "Introductory Java project in the profile history.",
    link: "https://github.com/coderaarav12/OOPSBannerApp",
  },
  {
    name: "coderaarav12",
    type: "Profile",
    description: "GitHub profile configuration and README content.",
    link: "https://github.com/coderaarav12/coderaarav12",
  },
];

export default function Home() {
  const sceneRef = useRef(null);
  const cursorRef = useRef(null);
  const cursorRingRef = useRef(null);
  const progressRef = useRef(0);

  useEffect(() => {
    const scene = sceneRef.current;
    const cursor = cursorRef.current;
    const cursorRing = cursorRingRef.current;

    if (!scene || !cursor || !cursorRing) {
      return undefined;
    }

    let animationFrameId = 0;
    let alive = true;
    let currentX = 0.5;
    let currentY = 0.5;
    let targetX = 0.5;
    let targetY = 0.5;
    let pointerSpeed = 0;

    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

    const updateScroll = () => {
      const documentElement = document.documentElement;
      const maxScroll = Math.max(1, documentElement.scrollHeight - window.innerHeight);
      const scrollProgress = clamp(window.scrollY / maxScroll, 0, 1);
      progressRef.current = scrollProgress;
      scene.style.setProperty("--scroll-progress", scrollProgress.toFixed(4));
      scene.style.setProperty("--scroll-angle", `${scrollProgress * 360}deg`);
    };

    const movePointer = (event) => {
      targetX = event.clientX / window.innerWidth;
      targetY = event.clientY / window.innerHeight;
      pointerSpeed = Math.hypot(event.movementX || 0, event.movementY || 0);
      scene.style.setProperty("--mx", `${event.clientX}px`);
      scene.style.setProperty("--my", `${event.clientY}px`);
      scene.style.setProperty("--cursor-speed", `${pointerSpeed}`);
    };

    const animate = () => {
      if (!alive) {
        return;
      }

      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      const x = currentX * window.innerWidth;
      const y = currentY * window.innerHeight;
      const speedScale = 1 + clamp(pointerSpeed / 90, 0, 0.35);
      const ringScale = 1 + clamp(pointerSpeed / 45, 0, 0.9);

      cursor.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${speedScale})`;
      cursorRing.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${ringScale})`;
      cursorRing.style.opacity = `${clamp(0.24 + pointerSpeed / 140, 0.28, 0.75)}`;

      animationFrameId = requestAnimationFrame(animate);
    };

    updateScroll();
    animate();

    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("pointermove", movePointer);
    window.addEventListener("pointerdown", movePointer);
    window.addEventListener("resize", updateScroll);

    return () => {
      alive = false;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("pointermove", movePointer);
      window.removeEventListener("pointerdown", movePointer);
      window.removeEventListener("resize", updateScroll);
    };
  }, []);

  return (
    <main className="scene" ref={sceneRef}>
      <div className="bg-orb orb-a" aria-hidden="true" />
      <div className="bg-orb orb-b" aria-hidden="true" />
      <div className="bg-orb orb-c" aria-hidden="true" />
      <div className="bg-grid" aria-hidden="true" />

      <div ref={cursorRef} className="cursor" aria-hidden="true" />
      <div ref={cursorRingRef} className="cursor cursor-ring" aria-hidden="true" />

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">AARAV GOEL</p>
          <h1>
            <span>Portfolio</span>
            <span>publishing soon</span>
          </h1>
          <p className="lede">
            A calm, aesthetic portfolio with 3D depth, scroll-reactive motion, and your real GitHub work.
          </p>
        </div>

        <div className="hero-frame" aria-hidden="true">
          <div className="frame-shell frame-shell-a" />
          <div className="frame-shell frame-shell-b" />
          <div className="frame-core">
            <span className="frame-label">Selected work</span>
            <strong>2026</strong>
          </div>
        </div>
      </section>

      <section className="featured-strip" aria-hidden="true">
        <div className="featured-chip">3D scroll</div>
        <div className="featured-chip">Responsive cursor</div>
        <div className="featured-chip">Soft aesthetic</div>
        <div className="featured-chip">GitHub projects</div>
      </section>

      <section className="projects">
        <header className="section-head">
          <p>GitHub projects</p>
          <span>Selected from your public profile</span>
        </header>

        <div className="project-grid">
          {projects.map((project, index) => (
            <a
              key={project.name}
              className="project-card"
              href={project.link}
              target="_blank"
              rel="noreferrer"
              style={{ "--card-index": index }}
            >
              <div className="project-top">
                <span>{project.type}</span>
                <span>GitHub</span>
              </div>
              <strong>{project.name}</strong>
              <p>{project.description}</p>
              <div className="project-bottom">
                <span>Open repo</span>
                <span>↗</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="scroll-behavior" aria-hidden="true">
        <div className="scroll-card scroll-a">
          <span>3D layer</span>
          <strong>Depth</strong>
        </div>
        <div className="scroll-card scroll-b">
          <span>Motion layer</span>
          <strong>Scroll</strong>
        </div>
        <div className="scroll-card scroll-c">
          <span>Glass layer</span>
          <strong>Texture</strong>
        </div>
      </section>

      <div className="ticker" aria-hidden="true">
        <div>
          <span>AARAV GOEL • PORTFOLIO PUBLISHING SOON •</span>
          <span>AARAV GOEL • PORTFOLIO PUBLISHING SOON •</span>
          <span>AARAV GOEL • PORTFOLIO PUBLISHING SOON •</span>
          <span>AARAV GOEL • PORTFOLIO PUBLISHING SOON •</span>
        </div>
      </div>
    </main>
  );
}
