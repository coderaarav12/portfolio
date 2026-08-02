"use client";

import { useEffect, useRef, useState } from "react";

const projects = [
  {
    name: "EduTechSRM",
    description:
      "Academic dashboard for SRMIST KTR with timetable, attendance, marks, CGPA, and an AI assistant.",
    link: "https://github.com/coderaarav12/edutechsrm-frontend-in",
  },
  {
    name: "MediaHub",
    description:
      "Search and stream movies, TV shows, and anime from multiple embed sources.",
    link: "https://github.com/coderaarav12/media-hub-frontend",
  },
  {
    name: "SRM Sarthi",
    description: "A clean SRM helper web experience with a Vercel deployment.",
    link: "https://github.com/coderaarav12/srm-sarthi-web",
  },
  {
    name: "SRM Planner Backend",
    description: "Python backend for the older SRM planning stack.",
    link: "https://github.com/coderaarav12/SRMPlannerBackend--OLD",
  },
];

export default function Home() {
  const sceneRef = useRef(null);
  const cursorRef = useRef(null);
  const cursorRingRef = useRef(null);
  const [introVisible, setIntroVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIntroVisible(false);
    }, 2200);

    return () => window.clearTimeout(timer);
  }, []);

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
      const speedScale = 1 + clamp(pointerSpeed / 90, 0, 0.26);
      const ringScale = 1 + clamp(pointerSpeed / 45, 0, 0.7);

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
      <div className={`intro ${introVisible ? "intro-visible" : "intro-hidden"}`} aria-hidden="true">
        <div className="intro-card">
          <p>Welcome to</p>
          <h2>Aarav Goel&apos;s Portfolio</h2>
        </div>
      </div>

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
        </div>

        <div className="hero-photo-card">
          <div className="photo-frame">
            <img src="/aarav-photo.png" alt="Aarav Goel portrait" className="portrait" loading="eager" />
          </div>
          <div className="photo-note">
            <span>AR</span>
            <strong>Aarav Goel</strong>
          </div>
        </div>
      </section>

      <section className="projects">
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
                <span>GitHub</span>
                <span>{index + 1}</span>
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
    </main>
  );
}
