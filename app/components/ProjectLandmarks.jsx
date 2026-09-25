"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ExternalLink,
  Github,
  Radio,
  FileCheck,
  Shield,
  Activity,
  FolderLock,
  ArrowUpRight,
  Sparkles,
  Layers,
  ChevronRight
} from "lucide-react";

export default function ProjectLandmarks() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const landmarks = [
    {
      id: "ripple",
      code: "LM-01",
      title: "Ripple Emergency Mesh",
      context: "Manipal Hackathon '26 Finalist",
      role: "Lead Systems Architect",
      summary:
        "Engineered an offline-first disaster communication protocol connecting affected populations when cellular infrastructure collapses. Utilizes WebRTC peer-to-peer data channels with zero third-party SMS dependency.",
      specs: [
        "WebRTC Mesh Topology",
        "OpenStreetMap Geocoding",
        "Sub-Second Hazard Routing",
        "0 SMS / Twilio Gateway Dependency"
      ],
      stack: ["TypeScript", "WebRTC", "Next.js", "Leaflet GIS", "FastAPI"],
      category: "hackathon",
      accent: "#818cf8",
      liveLink: "https://github.com/coderaarav12",
      githubLink: "https://github.com/coderaarav12"
    },
    {
      id: "syncmasters",
      code: "LM-02",
      title: "SyncMasters GovTech AI",
      context: "Smart India Hackathon (SIH 2026)",
      role: "Multimodal AI Engineer",
      summary:
        "Automated governance audit engine that ingests thousands of bureaucratic scan records, cross-verifies financial ledger anomalies with Llama 3.2 Vision, and outputs verifiable anti-corruption digests.",
      specs: [
        "Llama 3.2 Vision Analysis",
        "94% Extraction Precision",
        "Ollama Local Edge Execution",
        "Automated Compliance Synthesis"
      ],
      stack: ["Python", "Llama 3.2 Vision", "Ollama", "FastAPI", "React"],
      category: "ai",
      accent: "#38bdf8",
      liveLink: "https://github.com/coderaarav12",
      githubLink: "https://github.com/coderaarav12"
    },
    {
      id: "trustos",
      code: "LM-03",
      title: "Trust OS AI Guardrails",
      context: "Enterprise Model Safety Platform",
      role: "Core Developer",
      summary:
        "Comprehensive model safety framework providing real-time prompt-injection defense, toxicity filtering, and hallucination scoring before LLM outputs reach enterprise users.",
      specs: [
        "Real-Time Toxicity Guardrails",
        "Hallucination Confidence Metrics",
        "Zero-Day Prompt Injection Shield",
        "Auditable Logging Pipeline"
      ],
      stack: ["Python", "FastAPI", "Scikit-learn", "HuggingFace", "Next.js"],
      category: "ai",
      accent: "#34d399",
      liveLink: "https://github.com/coderaarav12",
      githubLink: "https://github.com/coderaarav12"
    },
    {
      id: "activity_stream",
      code: "LM-04",
      title: "GitHub Activity Telemetry",
      context: "Self-Hosted Contribution Visualizer",
      role: "Full-Stack Creator",
      summary:
        "Interactive analytics and SVG engine directly generating contribution matrices, commit streaks, and repo velocity directly on Cloudflare Edge without third-party badge providers.",
      specs: [
        "270+ Yearly Commits Tracked",
        "Serverless SVG Generation",
        "Live Cloudflare KV Caching",
        "Full Dark/Light Dynamic Theming"
      ],
      stack: ["Cloudflare Workers", "Next.js", "SVG Engine", "REST APIs"],
      category: "tools",
      accent: "#fbbf24",
      liveLink: "/activity",
      githubLink: "https://github.com/coderaarav12/portfolio"
    },
    {
      id: "app_vault",
      code: "LM-05",
      title: "Developer Vault & Tutorials",
      context: "Centralized Knowledge Node",
      role: "Author & Maintainer",
      summary:
        "Curated engineering walkthroughs, cloud deployment guides, and Google Drive laboratory assets maintained for peer developers and university juniors.",
      specs: [
        "Google Drive Cloud Sync",
        "Cache-Busting Edge Redirection",
        "Architecture Setup Blueprints",
        "Zero-Egress Direct Access"
      ],
      stack: ["Cloudflare Edge", "Technical Docs", "Cloud Storage"],
      category: "tools",
      accent: "#f43f5e",
      liveLink: "/app_tutorials",
      githubLink: "https://github.com/coderaarav12"
    }
  ];

  const filteredLandmarks = landmarks.filter((item) => {
    if (selectedCategory === "all") return true;
    return item.category === selectedCategory;
  });

  return (
    <section className="project-landmarks-section" style={{ padding: "100px 24px", position: "relative" }}>
      <div style={{ maxWidth: "1140px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "36px", gap: "20px" }}>
          <div>
            <span
              style={{
                fontSize: "0.75rem",
                fontFamily: "var(--font-mono, monospace)",
                letterSpacing: "0.1em",
                color: "#818cf8",
                textTransform: "uppercase",
                background: "rgba(129, 140, 248, 0.1)",
                border: "1px solid rgba(129, 140, 248, 0.25)",
                padding: "4px 12px",
                borderRadius: "9999px",
                display: "inline-block",
                marginBottom: "12px"
              }}
            >
              Stage 05 • Project Landmarks
            </span>
            <h2 style={{ fontSize: "clamp(2.4rem, 5vw, 3.6rem)", fontWeight: 800, margin: 0, color: "#ffffff" }}>
              Engineered <span style={{ color: "#818cf8" }}>Destinations</span>
            </h2>
          </div>

          {/* Category Tabs */}
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
              { id: "all", label: "All Landmarks" },
              { id: "ai", label: "AI & ML" },
              { id: "hackathon", label: "Hackathons" },
              { id: "tools", label: "Developer Tools" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                style={{
                  background: selectedCategory === tab.id ? "rgba(129, 140, 248, 0.2)" : "transparent",
                  color: selectedCategory === tab.id ? "#ffffff" : "#94a3b8",
                  border: "none",
                  padding: "7px 16px",
                  borderRadius: "9999px",
                  fontSize: "0.82rem",
                  fontWeight: selectedCategory === tab.id ? 600 : 500,
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Landmarks Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
          <AnimatePresence>
            {filteredLandmarks.map((lm) => (
              <motion.div
                key={lm.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3 }}
                className="glass-panel"
                style={{
                  padding: "32px",
                  background: "rgba(10, 15, 26, 0.8)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between"
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                    <span
                      style={{
                        fontFamily: "var(--font-mono, monospace)",
                        fontSize: "0.74rem",
                        color: lm.accent,
                        fontWeight: 700,
                        letterSpacing: "0.08em"
                      }}
                    >
                      {lm.code} // {lm.context}
                    </span>
                    <span style={{ fontSize: "0.72rem", color: "#64748b" }}>
                      {lm.role}
                    </span>
                  </div>

                  <h3 style={{ fontSize: "1.45rem", fontWeight: 800, margin: "0 0 12px 0", color: "#ffffff" }}>
                    {lm.title}
                  </h3>

                  <p style={{ color: "#cbd5e1", fontSize: "0.88rem", lineHeight: 1.6, marginBottom: "20px" }}>
                    {lm.summary}
                  </p>

                  {/* Technical Specifications Callout */}
                  <div
                    style={{
                      background: "rgba(0, 0, 0, 0.3)",
                      border: "1px solid rgba(255, 255, 255, 0.05)",
                      borderRadius: "10px",
                      padding: "12px 14px",
                      marginBottom: "20px"
                    }}
                  >
                    <div style={{ fontSize: "0.72rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>
                      Core System Specifications
                    </div>
                    <ul style={{ margin: 0, paddingLeft: "16px", color: "#f8fafc", fontSize: "0.78rem", lineHeight: 1.6 }}>
                      {lm.specs.map((spec, sIdx) => (
                        <li key={sIdx}>{spec}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Stack Badges */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "24px" }}>
                    {lm.stack.map((item, iIdx) => (
                      <span
                        key={iIdx}
                        style={{
                          fontSize: "0.74rem",
                          background: "rgba(255, 255, 255, 0.05)",
                          border: "1px solid rgba(255, 255, 255, 0.08)",
                          padding: "3px 8px",
                          borderRadius: "6px",
                          color: "#cbd5e1"
                        }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Footer */}
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
                    href={lm.liveLink}
                    target={lm.liveLink.startsWith("http") ? "_blank" : "_self"}
                    rel="noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      color: lm.accent
                    }}
                  >
                    <span>Inspect Destination</span>
                    <ArrowUpRight size={14} />
                  </a>

                  <a
                    href={lm.githubLink}
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
                    <span>Source</span>
                  </a>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
