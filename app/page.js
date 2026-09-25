"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import HeroScene from "./components/HeroScene";
import RoadmapSpine from "./components/RoadmapSpine";
import MonumentShowcase from "./components/MonumentShowcase";
import AIPipelineVisualizer from "./components/AIPipelineVisualizer";
import ProjectLandmarks from "./components/ProjectLandmarks";
import TechEcosystem from "./components/TechEcosystem";
import NowAndFuture from "./components/NowAndFuture";
import SoundscapePlayer from "./components/SoundscapePlayer";
import {
  Sparkles,
  ArrowDown,
  Layers,
  Terminal,
  ExternalLink,
  Flame,
  Check,
  Copy
} from "lucide-react";

export default function PortfolioPage() {
  const scrollToRoadmap = () => {
    const el = document.getElementById("roadmap-start");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToMonument = () => {
    const el = document.getElementById("monument");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh", background: "#06070a", color: "#f8fafc" }}>
      {/* ---------- Ambient Video Background (Aurora Borealis CC0) ---------- */}
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

      {/* ---------- Floating Navigation Bar ---------- */}
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
                // SRMIST AI/ML '29
              </span>
            </div>
          </div>

          <div className="nav-links">
            <a href="#hero" className="nav-link-btn">
              Core
            </a>
            <a href="#roadmap-start" className="nav-link-btn">
              Roadmap
            </a>
            <a href="#monument" className="nav-link-btn">
              Monument
            </a>
            <a href="#intelligence" className="nav-link-btn">
              AI Systems
            </a>
            <a href="#landmarks" className="nav-link-btn">
              Projects
            </a>
            <a href="#ecosystem" className="nav-link-btn">
              Ecosystem
            </a>
            <a href="/activity" className="nav-link-btn" style={{ color: "#38bdf8" }}>
              Telemetry
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
              Initiate Contact
            </a>
          </div>
        </nav>
      </header>

      {/* ---------- Main Content Flow ---------- */}
      <main style={{ position: "relative", zIndex: 10 }}>
        {/* ==================== STAGE 00: HERO (THE SYSTEM CORE) ==================== */}
        <section
          id="hero"
          style={{
            position: "relative",
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            padding: "120px 24px 80px 24px"
          }}
        >
          {/* Three.js Interactive 3D WebGL Core */}
          <HeroScene />

          {/* Hero Typography & Intent */}
          <div
            style={{
              position: "relative",
              zIndex: 10,
              maxWidth: "1000px",
              margin: "0 auto",
              textAlign: "center",
              pointerEvents: "auto"
            }}
          >
            {/* Status Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{ marginBottom: "20px" }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "6px 16px",
                  borderRadius: "9999px",
                  background: "rgba(10, 15, 26, 0.8)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  backdropFilter: "blur(12px)"
                }}
              >
                <span className="status-pulse-dot" />
                <span style={{ fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.08em", color: "#38bdf8", textTransform: "uppercase" }}>
                  AI/ML Engineer • Software Architect • Builder
                </span>
              </div>
            </motion.div>

            {/* Giant Manifesto Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              style={{
                fontSize: "clamp(2.8rem, 7vw, 5.4rem)",
                fontWeight: 900,
                lineHeight: 1.05,
                letterSpacing: "-0.035em",
                margin: "0 0 24px 0",
                color: "#ffffff"
              }}
            >
              Building intelligent systems that{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #38bdf8 0%, #34d399 50%, #818cf8 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}
              >
                actually do things.
              </span>
            </motion.h1>

            {/* Concise Mission Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              style={{
                fontSize: "clamp(1.05rem, 2vw, 1.25rem)",
                color: "#cbd5e1",
                maxWidth: "720px",
                margin: "0 auto 36px auto",
                lineHeight: 1.6
              }}
            >
              I am <strong>Aarav Goel</strong>, an AI/ML undergraduate at SRMIST KTR (Semester 3). Creator of <strong>EdutechSRM</strong> (serving 250+ engineering students) and builder of multimodal vision pipelines for national hackathons.
            </motion.p>

            {/* Hero CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "14px",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <button
                onClick={scrollToRoadmap}
                className="btn-primary"
                style={{
                  padding: "14px 30px",
                  fontSize: "0.95rem",
                  background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
                  boxShadow: "0 0 25px rgba(14, 165, 233, 0.4)",
                  border: "1px solid rgba(56, 189, 248, 0.4)"
                }}
              >
                <span>Explore the Journey</span>
                <ArrowDown size={16} />
              </button>

              <button
                onClick={scrollToMonument}
                className="btn-secondary"
                style={{ padding: "14px 26px", fontSize: "0.95rem" }}
              >
                <Flame size={16} color="#f59e0b" />
                <span>View The Monument</span>
              </button>
            </motion.div>
          </div>
        </section>

        {/* ==================== STAGE 01 & 02: THE ROADMAP SPINE ==================== */}
        <div id="roadmap-start">
          <RoadmapSpine />
        </div>

        {/* ==================== STAGE 03: THE MONUMENT (EDUTECHSRM) ==================== */}
        <div id="monument">
          <MonumentShowcase />
        </div>

        {/* ==================== STAGE 04: AI & SYSTEMS PIPELINE ==================== */}
        <div id="intelligence">
          <AIPipelineVisualizer />
        </div>

        {/* ==================== STAGE 05: PROJECT LANDMARKS ==================== */}
        <div id="landmarks">
          <ProjectLandmarks />
        </div>

        {/* ==================== STAGE 06: TECHNOLOGY ECOSYSTEM ==================== */}
        <div id="ecosystem">
          <TechEcosystem />
        </div>

        {/* ==================== STAGES 07, 08, 09: NOW, FUTURE & DESTINATION ==================== */}
        <NowAndFuture />
      </main>

      {/* ---------- Floating Soundscape Player ---------- */}
      <SoundscapePlayer />
    </div>
  );
}
