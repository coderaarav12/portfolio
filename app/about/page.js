"use client";

import { useEffect, useRef, useState } from "react";
import "./about.css";

const TRAIL = 9;
const VIDEO_SKIP = 8;

const Icons = {
  github: (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.05-.02-2.06-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.2.08 1.83 1.23 1.83 1.23 1.07 1.83 2.8 1.3 3.49 1 .11-.78.42-1.31.76-1.61-2.66-.3-5.46-1.33-5.46-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6.01 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.63-5.47 5.92.43.37.81 1.1.81 2.22 0 1.61-.01 2.9-.01 3.3 0 .32.22.7.83.58A12.02 12.02 0 0 0 24 12.5C24 5.87 18.63.5 12 .5z" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.32-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  ),
  globe: (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  mail: (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  phone: (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  code: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
};

const links = [
  {
    label: "GitHub",
    handle: "@coderaarav12",
    href: "https://github.com/coderaarav12",
    icon: "github",
    accent: "#8b5cf6",
  },
  {
    label: "LinkedIn",
    handle: "in/aaravgoel12",
    href: "https://www.linkedin.com/in/aaravgoel12/",
    icon: "linkedin",
    accent: "#0a66c2",
  },
  {
    label: "Portfolio",
    handle: "goelaarav.dpdns.org",
    href: "https://goelaarav.dpdns.org/",
    icon: "globe",
    accent: "#f59e0b",
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
];

const marquee = [
  "FRONTEND EXPERT",
  "VIBE CODER",
  "2ND YEAR ENGINEER",
  "REACT",
  "NEXT.JS",
  "TAILWIND",
  "UI / UX",
  "CLEAN CODE",
  "FAST",
  "SMOOTH",
];

const roles = ["2nd Year Engineer", "Frontend Expert", "Vibe Coding Professionalist"];

export default function AboutPage() {
  const sceneRef = useRef(null);
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const cursorRef = useRef(null);
  const cursorRingRef = useRef(null);
  const trailRefs = useRef([]);
  const gridRef = useRef(null);

  const [gateOpen, setGateOpen] = useState(true);
  const [sound, setSound] = useState(false);
  const [copied, setCopied] = useState(null);
  const [showSound, setShowSound] = useState(true);

  const enterSite = (withSound) => {
    setSound(withSound);
    setGateOpen(false);
    if (withSound) {
      audioRef.current?.play().catch(() => {});
    }
    videoRef.current?.play().catch(() => {});
  };

  const toggleSound = () => {
    const next = !sound;
    setSound(next);
    if (next) {
      audioRef.current?.play().catch(() => {});
    } else {
      audioRef.current?.pause();
    }
  };

  const copy = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      window.setTimeout(() => setCopied(null), 1600);
    } catch {
      window.location.href = `mailto:${text}`;
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    video?.play().catch(() => {});
    document.body.style.overflow = gateOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [gateOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const isMobile = window.matchMedia("(pointer: coarse)").matches || window.innerWidth <= 720;
      setShowSound(!isMobile || window.scrollY < 80);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  useEffect(() => {
    const scene = sceneRef.current;
    const cursor = cursorRef.current;
    const cursorRing = cursorRingRef.current;

    if (!scene || !cursor || !cursorRing) {
      return undefined;
    }

    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (!finePointer) {
      cursor.style.display = "none";
      cursorRing.style.display = "none";
    }

    let animationFrameId = 0;
    let alive = true;
    let currentX = 0.5;
    let currentY = 0.5;
    let targetX = 0.5;
    let targetY = 0.5;
    let pointerSpeed = 0;
    const points = [];

    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

    const updateScroll = () => {
      const documentElement = document.documentElement;
      const maxScroll = Math.max(1, documentElement.scrollHeight - window.innerHeight);
      const progress = clamp(window.scrollY / maxScroll, 0, 1);
      scene.style.setProperty("--scroll-progress", progress.toFixed(4));
      scene.style.setProperty("--scroll-angle", `${progress * 360}deg`);
    };

    const parallax = () => {
      const layers = scene.querySelectorAll("[data-parallax]");
      const vh = window.innerHeight;
      layers.forEach((layer) => {
        const speed = parseFloat(layer.dataset.parallax || "0.15");
        const rect = layer.getBoundingClientRect();
        const offset = (rect.top + rect.height / 2 - vh / 2) * -speed;
        layer.style.setProperty("--parallax-y", `${offset.toFixed(2)}px`);
      });
    };

    const movePointer = (event) => {
      targetX = event.clientX / window.innerWidth;
      targetY = event.clientY / window.innerHeight;
      pointerSpeed = Math.hypot(event.movementX || 0, event.movementY || 0);
      scene.style.setProperty("--mx", `${event.clientX}px`);
      scene.style.setProperty("--my", `${event.clientY}px`);
      scene.style.setProperty("--cursor-speed", `${pointerSpeed}`);
    };

    const tilt = (event) => {
      const grid = gridRef.current;
      if (!grid) {
        return;
      }
      const rect = grid.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      grid.style.setProperty("--tilt-x", `${(px * 12).toFixed(2)}deg`);
      grid.style.setProperty("--tilt-y", `${(py * -12).toFixed(2)}deg`);
    };

    const animate = () => {
      if (!alive) {
        return;
      }
      currentX += (targetX - currentX) * 0.085;
      currentY += (targetY - currentY) * 0.085;

      const x = currentX * window.innerWidth;
      const y = currentY * window.innerHeight;
      const speedScale = 1 + clamp(pointerSpeed / 90, 0, 0.3);
      const ringScale = 1 + clamp(pointerSpeed / 45, 0, 0.8);

      cursor.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${speedScale})`;
      cursorRing.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${ringScale})`;
      cursorRing.style.opacity = `${clamp(0.24 + pointerSpeed / 130, 0.3, 0.8)}`;

      points.unshift({ x, y });
      if (points.length > TRAIL) {
        points.pop();
      }
      trailRefs.current.forEach((el, i) => {
        if (!el) {
          return;
        }
        const p = points[i] || points[points.length - 1];
        const lerp = (a, b) => a + (b - a) * 0.4;
        const prev = points[i + 1];
        const fx = prev ? lerp(p.x, prev.x) : p.x;
        const fy = prev ? lerp(p.y, prev.y) : p.y;
        el.style.transform = `translate3d(${fx}px, ${fy}px, 0) translate(-50%, -50%) scale(${1 - i / (TRAIL + 1)})`;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    updateScroll();
    parallax();
    animate();

    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("scroll", parallax, { passive: true });
    window.addEventListener("resize", parallax);
    window.addEventListener("pointermove", movePointer);
    window.addEventListener("pointerdown", movePointer);
    if (finePointer) {
      window.addEventListener("pointermove", tilt);
    }

    return () => {
      alive = false;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("scroll", parallax);
      window.removeEventListener("resize", parallax);
      window.removeEventListener("pointermove", movePointer);
      window.removeEventListener("pointerdown", movePointer);
      window.removeEventListener("pointermove", tilt);
    };
  }, []);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) {
      return undefined;
    }
    const revealables = scene.querySelectorAll("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealables.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="about-scene" ref={sceneRef}>
      <audio ref={audioRef} src="/darkside.mp3" loop preload="auto" />

      <div className="video-stage" aria-hidden="true">
        <video
          ref={videoRef}
          className="montage"
          src="/about-montage.mp4"
          poster="/aarav-photo.png"
          autoPlay
          loop
          muted
          playsInline
          onLoadedMetadata={(event) => {
            event.currentTarget.currentTime = VIDEO_SKIP;
          }}
        />
        <div className="video-shade" />
        <div className="video-noise" />
        <div className="bg-orb orb-a" />
        <div className="bg-orb orb-b" />
        <div className="bg-orb orb-c" />
      </div>

      {gateOpen ? (
        <div className="gate" role="dialog" aria-modal="true" aria-label="Enable sound?">
          <div className="gate-ring" aria-hidden="true" />
          <div className="gate-card">
            <p className="gate-eyebrow">ABOUT ME</p>
            <h2 className="gate-title">
              AARAV <span>GOEL</span>
            </h2>
            <p className="gate-question">This page plays music in the background. Sound okay?</p>
            <p className="gate-sub">You can mute it anytime from the corner.</p>
            <div className="gate-actions">
              <button type="button" className="gate-btn gate-btn-sound" onClick={() => enterSite(true)}>
                <span className="gate-eq" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                  <i />
                </span>
                ENTER WITH SOUND
              </button>
              <button type="button" className="gate-btn gate-btn-muted" onClick={() => enterSite(false)}>
                ENTER MUTED
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="scroll-progress" aria-hidden="true" />

      <button
        type="button"
        className={`sound-toggle ${sound ? "sound-on" : ""} ${showSound ? "" : "sound-hidden"}`}
        onClick={toggleSound}
        aria-pressed={sound}
        aria-label={sound ? "Pause music" : "Play music"}
      >
        <span className="eq" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </span>
        <span className="sound-label">{sound ? "ON" : "OFF"}</span>
      </button>

      <div ref={cursorRef} className="cursor" aria-hidden="true" />
      <div ref={cursorRingRef} className="cursor cursor-ring" aria-hidden="true" />
      <div className="trail-wrap" aria-hidden="true">
        {Array.from({ length: TRAIL }).map((_, i) => (
          <span
            key={i}
            className="trail"
            ref={(el) => {
              trailRefs.current[i] = el;
            }}
          />
        ))}
      </div>

      <section className="hero">
        <div className="hero-copy" data-parallax="0.07" data-reveal>
          <p className="eyebrow">DEVELOPER · 2ND YEAR</p>
          <h1 className="hero-title">
            <span>AARAV</span>
            <span className="hero-last">GOEL</span>
          </h1>
          <div className="role-row">
            {roles.map((role, i) => (
              <span key={role} className="role-chip" style={{ "--chip-index": i }}>
                {role}
              </span>
            ))}
          </div>
          <p className="lede">
            A second-year engineering student who lives on the frontend — building fast, clean, and
            polished web experiences with React and Next.js.
          </p>
          <div className="hero-cta">
            <a className="cta cta-primary" href="#links">
              View my work <span>↓</span>
            </a>
            <a className="cta cta-ghost" href="#contact">
              Get in touch
            </a>
          </div>
        </div>

        <div className="hero-card" data-parallax="0.12" data-reveal>
          <div className="spin-ring" aria-hidden="true" />
          <div className="photo-frame">
            <img src="/aarav-photo.png" alt="Aarav Goel portrait" className="portrait" loading="eager" />
          </div>
          <div className="hero-note">
            <span className="hero-note-icon">{Icons.code}</span>
            <span className="hero-note-text">
              <strong>Aarav Goel</strong>
              <small>frontend developer</small>
            </span>
          </div>
        </div>
      </section>

      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[...marquee, ...marquee, ...marquee].map((item, i) => (
            <span key={i} className="marquee-item">
              {item} <b>✦</b>
            </span>
          ))}
        </div>
      </div>

      <section className="stats" data-reveal>
        <div className="stat">
          <strong>2nd</strong>
          <span>Year Engineer</span>
        </div>
        <div className="stat">
          <strong>100%</strong>
          <span>Frontend Focus</span>
        </div>
        <div className="stat">
          <strong>∞</strong>
          <span>Learning Mode</span>
        </div>
        <div className="stat">
          <strong>24/7</strong>
          <span>Building Mode</span>
        </div>
      </section>

      <section className="links-section" id="links">
        <div className="section-head" data-reveal>
          <p className="eyebrow">CONNECT</p>
          <h2>Find me here.</h2>
        </div>

        <div className="link-grid" ref={gridRef} data-reveal>
          {links.map((link, index) => (
            <a
              key={link.label}
              className="link-card"
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              style={{ "--accent": link.accent, "--card-index": index }}
              data-parallax="0.09"
            >
              <span className="card-glow" aria-hidden="true" />
              <span className="card-icon">{Icons[link.icon]}</span>
              <span className="card-body">
                <strong>{link.label}</strong>
                <small>{link.handle}</small>
              </span>
              <span className="card-arrow">↗</span>
            </a>
          ))}
        </div>
      </section>

      <section className="contact" id="contact">
        <div className="section-head" data-reveal>
          <p className="eyebrow">CONTACT</p>
          <h2>Say hello.</h2>
        </div>

        <div className="contact-grid">
          {contacts.map((contact, index) => (
            <button
              key={contact.label}
              type="button"
              className="contact-card"
              style={{ "--accent": contact.accent, "--card-index": index }}
              onClick={() => copy(contact.value, contact.label)}
              data-reveal
            >
              <span className="card-glow" aria-hidden="true" />
              <span className="contact-icon">{Icons[contact.icon]}</span>
              <span className="contact-body">
                <strong>{contact.label}</strong>
                <small>{contact.value}</small>
              </span>
              <span className="contact-action">{copied === contact.label ? "COPIED ✓" : "TAP TO COPY"}</span>
              <a
                className="contact-direct"
                href={contact.href}
                onClick={(e) => e.stopPropagation()}
                aria-label={`Open ${contact.label}`}
              >
                open →
              </a>
            </button>
          ))}
        </div>
      </section>

      <footer className="about-footer">
        <p>Built with too much coffee &amp; code.</p>
        <p className="footer-tag">GOELAARAV ✦ 2ND YEAR</p>
      </footer>
    </main>
  );
}
