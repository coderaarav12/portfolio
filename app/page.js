"use client";

import { useEffect, useRef } from "react";

const marqueeText = "AARAV GOEL • PORTFOLIO PUBLISHING SOON •";

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export default function Home() {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const cursorRef = useRef(null);
  const cursorRingRef = useRef(null);
  const pointer = useRef({ x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5, speed: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const scene = sceneRef.current;
    const cursor = cursorRef.current;
    const cursorRing = cursorRingRef.current;

    if (!canvas || !scene || !cursor || !cursorRing) {
      return undefined;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return undefined;
    }

    const particles = Array.from({ length: 160 }, (_, index) => ({
      x: Math.random(),
      y: Math.random(),
      z: Math.random(),
      vx: (Math.random() - 0.5) * 0.00065,
      vy: (Math.random() - 0.5) * 0.00065,
      pulse: Math.random() * Math.PI * 2,
      size: 0.8 + Math.random() * 2.6,
      hue: index % 3 === 0 ? 190 : index % 3 === 1 ? 270 : 24,
    }));

    let frame = 0;
    let alive = true;
    let animationFrameId = 0;
    let width = 0;
    let height = 0;

    const resize = () => {
      width = scene.clientWidth;
      height = scene.clientHeight;
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const movePointer = (event) => {
      const x = event.clientX / window.innerWidth;
      const y = event.clientY / window.innerHeight;
      const speed = Math.hypot(event.movementX || 0, event.movementY || 0);
      pointer.current.targetX = clamp(x, 0, 1);
      pointer.current.targetY = clamp(y, 0, 1);
      pointer.current.speed = speed;
      scene.style.setProperty("--mx", `${event.clientX}px`);
      scene.style.setProperty("--my", `${event.clientY}px`);
      scene.style.setProperty("--cursor-speed", `${speed}`);
      cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%) scale(${1 + speed * 0.002})`;
      cursorRing.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%) scale(${1 + speed * 0.004})`;
      cursorRing.style.opacity = `${clamp(0.32 + speed * 0.01, 0.35, 0.9)}`;
      };

    const settlePointer = () => {
      pointer.current.x += (pointer.current.targetX - pointer.current.x) * 0.08;
      pointer.current.y += (pointer.current.targetY - pointer.current.y) * 0.08;
    };

    const draw = () => {
      if (!alive) {
        return;
      }

      frame += 1;
      settlePointer();
      context.clearRect(0, 0, width, height);
      context.fillStyle = "rgba(4, 6, 15, 0.16)";
      context.fillRect(0, 0, width, height);

      const cx = pointer.current.x * width;
      const cy = pointer.current.y * height;
      const scroll = Number(scene.style.getPropertyValue("--scroll-progress") || 0);

      const glow = context.createRadialGradient(cx, cy, 0, cx, cy, Math.max(width, height) * 0.45);
      glow.addColorStop(0, "rgba(255,255,255,0.16)");
      glow.addColorStop(0.2, "rgba(124,58,237,0.16)");
      glow.addColorStop(0.45, "rgba(6,182,212,0.10)");
      glow.addColorStop(1, "rgba(0,0,0,0)");
      context.fillStyle = glow;
      context.fillRect(0, 0, width, height);

      particles.forEach((particle, index) => {
        particle.x += particle.vx * (1 + particle.z * 2.2);
        particle.y += particle.vy * (1 + particle.z * 2.2);
        particle.pulse += 0.02 + particle.z * 0.03;

        if (particle.x < -0.05) particle.x = 1.05;
        if (particle.x > 1.05) particle.x = -0.05;
        if (particle.y < -0.05) particle.y = 1.05;
        if (particle.y > 1.05) particle.y = -0.05;

        const px = particle.x * width;
        const py = particle.y * height;
        const scale = 0.8 + particle.z * 1.4 + Math.sin(particle.pulse) * 0.25;
        const radius = particle.size * scale;

        context.beginPath();
        context.fillStyle = `hsla(${particle.hue}, 100%, ${62 - particle.z * 12}%, ${0.26 + particle.z * 0.28})`;
        context.arc(px, py, radius, 0, Math.PI * 2);
        context.fill();

        if (index % 3 === 0) {
          context.beginPath();
          context.strokeStyle = `hsla(${particle.hue}, 100%, 70%, 0.06)`;
          context.arc(px, py, radius * 4.5, 0, Math.PI * 2);
          context.stroke();
        }
      });

      for (let index = 0; index < particles.length; index += 1) {
        for (let other = index + 1; other < particles.length; other += 1) {
          const a = particles[index];
          const b = particles[other];
          const ax = a.x * width;
          const ay = a.y * height;
          const bx = b.x * width;
          const by = b.y * height;
          const distance = Math.hypot(ax - bx, ay - by);

          if (distance < 160) {
            context.beginPath();
            context.strokeStyle = `rgba(180, 200, 255, ${(1 - distance / 160) * 0.11})`;
            context.lineWidth = 1;
            context.moveTo(ax, ay);
            context.lineTo(bx, by);
            context.stroke();
          }
        }
      }

      const rings = [220, 340, 490];
      rings.forEach((ringRadius, index) => {
        context.beginPath();
        context.strokeStyle = index === 0 ? "rgba(6, 182, 212, 0.16)" : index === 1 ? "rgba(124, 58, 237, 0.13)" : "rgba(249, 115, 22, 0.10)";
        context.lineWidth = 1.4;
        context.arc(cx, cy, ringRadius + Math.sin(frame * 0.02 + index + scroll * 8) * 10, 0, Math.PI * 2);
        context.stroke();
      });

      const gridRows = 14;
      const gridCols = 16;
      const gridW = width / gridCols;
      const gridH = height / gridRows;

      for (let row = 0; row < gridRows; row += 1) {
        for (let col = 0; col < gridCols; col += 1) {
          const x = col * gridW + gridW * 0.5;
          const y = row * gridH + gridH * 0.5;
          const sway = Math.sin(scroll * 8 + row * 0.34 + col * 0.22 + frame * 0.01) * 6;
          const size = 1 + Math.max(0, 1 - Math.hypot(cx - x, cy - y) / 320) * 3;
          context.beginPath();
          context.fillStyle = `rgba(255, 255, 255, ${0.02 + Math.max(0, 1 - Math.hypot(cx - x, cy - y) / 420) * 0.11})`;
          context.arc(x + sway, y - sway * 0.6, size, 0, Math.PI * 2);
          context.fill();
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    const updateScroll = () => {
      const documentElement = document.documentElement;
      const maxScroll = Math.max(1, documentElement.scrollHeight - window.innerHeight);
      const scroll = clamp(window.scrollY / maxScroll, 0, 1);
      const sceneProgress = scroll.toFixed(4);
      scene.style.setProperty("--scroll-progress", sceneProgress);
      scene.style.setProperty("--scroll-angle", `${scroll * 360}`);
      scene.style.setProperty("--scroll-depth", `${scroll}`);
    };

    resize();
    updateScroll();
    draw();

    window.addEventListener("resize", resize);
    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("pointermove", movePointer);
    window.addEventListener("pointerdown", movePointer);

    return () => {
      alive = false;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("pointermove", movePointer);
      window.removeEventListener("pointerdown", movePointer);
    };
  }, []);

  return (
    <main className="scene" ref={sceneRef}>
      <canvas ref={canvasRef} className="fx-canvas" aria-hidden="true" />
      <div ref={cursorRef} className="cursor" aria-hidden="true" />
      <div ref={cursorRingRef} className="cursor cursor-ring" aria-hidden="true" />

      <div className="mesh mesh-a" aria-hidden="true" />
      <div className="mesh mesh-b" aria-hidden="true" />
      <div className="mesh mesh-c" aria-hidden="true" />

      <div className="viewport">
        <section className="hero">
          <div className="title-block">
            <p className="eyebrow">AARAV GOEL</p>
            <h1>
              <span>Portfolio</span>
              <span>publishing soon</span>
            </h1>
            <p className="lede">
              A cinematic teaser with heavy motion, depth, a responsive cursor, and scroll-reactive 3D layers.
            </p>
          </div>

          <div className="glass-card glass-card-left" aria-hidden="true">
            <span>STATUS</span>
            <strong>IN MOTION</strong>
          </div>

          <div className="glass-card glass-card-right" aria-hidden="true">
            <span>DROP</span>
            <strong>SOON</strong>
          </div>

          <div className="stage" aria-hidden="true">
            <div className="portal portal-a" />
            <div className="portal portal-b" />
            <div className="portal portal-c" />
            <div className="texture texture-a" />
            <div className="texture texture-b" />
            <div className="texture texture-c" />
            <div className="chip chip-a" />
            <div className="chip chip-b" />
            <div className="chip chip-c" />
          </div>
        </section>
      </div>

      <section className="scroll-story" aria-hidden="true">
        <article className="story-beat beat-one">
          <span>01</span>
          <strong>Depth</strong>
        </article>
        <article className="story-beat beat-two">
          <span>02</span>
          <strong>Motion</strong>
        </article>
        <article className="story-beat beat-three">
          <span>03</span>
          <strong>Texture</strong>
        </article>
      </section>

      <div className="ticker" aria-hidden="true">
        <div>
          <span>{marqueeText}</span>
          <span>{marqueeText}</span>
          <span>{marqueeText}</span>
          <span>{marqueeText}</span>
        </div>
      </div>
    </main>
  );
}
