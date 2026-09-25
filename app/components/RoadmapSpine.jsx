"use client";

import React from "react";
import { motion } from "motion/react";
import {
  GraduationCap,
  Briefcase,
  Layers,
  ArrowRight,
  Sparkles,
  Milestone,
  CheckCircle2,
  Calendar,
  Building
} from "lucide-react";

export default function RoadmapSpine() {
  const milestones = [
    {
      stage: "01",
      code: "ORIGIN",
      title: "Foundations & Mathematical Rigor",
      institution: "Vedritam Group DAV School",
      period: "Class 10th (91.2%) • Class 12th (71.2%)",
      tag: "CBSE Senior Secondary",
      tagColor: "#38bdf8",
      summary:
        "Where the journey began. Built initial algorithmic foundations in mathematics, structured logic, and C++ fundamentals, sparking an ambition to build production software rather than just studying theory."
    },
    {
      stage: "02",
      code: "ACCELERATION",
      title: "Undergraduate AI/ML Engineering",
      institution: "SRM Institute of Science and Technology (KTR)",
      period: "2025 – 2029 • Semester 3 Active • Year 1 CGPA: 6.86",
      tag: "B.Tech CSE (AI / ML)",
      tagColor: "#818cf8",
      summary:
        "Specializing in Computer Science & Engineering with Artificial Intelligence and Machine Learning. Focused on applied deep learning, distributed cloud edge systems, and building practical products."
    },
    {
      stage: "02.5",
      code: "CAMPUS LEADERSHIP",
      title: "University Media & Technical Direction",
      institution: "Directorate of Alumni Affairs & E-Cell SRM",
      period: "2025 – Present",
      tag: "Institutional Leadership",
      tagColor: "#34d399",
      summary:
        "Spearheading digital engagement and media campaigns for 50,000+ global alumni at the Directorate of Alumni Affairs. Building hackathon platforms and entrepreneurship portals for E-Cell SRM."
    }
  ];

  return (
    <section className="roadmap-spine-section" style={{ padding: "100px 24px 60px 24px", position: "relative" }}>
      <div style={{ maxWidth: "1140px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{ marginBottom: "48px" }}>
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
            Stages 01 – 02 // Origin to Acceleration
          </span>
          <h2 style={{ fontSize: "clamp(2.4rem, 5vw, 3.6rem)", fontWeight: 800, margin: "0 0 14px 0", color: "#ffffff" }}>
            The Builder's <span style={{ color: "#38bdf8" }}>Roadmap</span>
          </h2>
          <p style={{ color: "#94a3b8", maxWidth: "640px", margin: 0, fontSize: "1.05rem", lineHeight: 1.6 }}>
            Every step represents a progression in technical responsibility — moving from classroom theory to engineering systems that people rely on.
          </p>
        </div>

        {/* Timeline with vertical glowing SVG track */}
        <div style={{ position: "relative", paddingLeft: "32px" }}>
          {/* Vertical Illuminated Line */}
          <div
            style={{
              position: "absolute",
              top: "20px",
              bottom: "40px",
              left: "11px",
              width: "2px",
              background: "linear-gradient(180deg, #38bdf8 0%, #818cf8 50%, #34d399 100%)",
              opacity: 0.5
            }}
          />

          <div style={{ display: "grid", gap: "32px" }}>
            {milestones.map((m, idx) => (
              <div key={idx} style={{ position: "relative" }}>
                {/* Glowing Node Marker */}
                <div
                  style={{
                    position: "absolute",
                    left: "-32px",
                    top: "26px",
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    background: "#06070a",
                    border: `2px solid ${m.tagColor}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `0 0 12px ${m.tagColor}60`,
                    zIndex: 2
                  }}
                >
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: m.tagColor }} />
                </div>

                {/* Milestone Content Card */}
                <div
                  className="glass-panel"
                  style={{
                    padding: "28px 32px",
                    background: "rgba(10, 15, 26, 0.8)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "16px"
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "10px"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span
                        style={{
                          fontFamily: "var(--font-mono, monospace)",
                          fontSize: "0.78rem",
                          fontWeight: 800,
                          color: m.tagColor,
                          letterSpacing: "0.08em"
                        }}
                      >
                        STAGE {m.stage} // {m.code}
                      </span>
                      <span
                        style={{
                          fontSize: "0.74rem",
                          padding: "3px 10px",
                          borderRadius: "9999px",
                          background: `${m.tagColor}15`,
                          border: `1px solid ${m.tagColor}30`,
                          color: m.tagColor,
                          fontWeight: 600
                        }}
                      >
                        {m.tag}
                      </span>
                    </div>

                    <div style={{ fontSize: "0.8rem", color: "#94a3b8", display: "flex", alignItems: "center", gap: "6px" }}>
                      <Calendar size={13} />
                      <span>{m.period}</span>
                    </div>
                  </div>

                  <h3 style={{ fontSize: "1.45rem", fontWeight: 700, color: "#ffffff", margin: "0 0 6px 0" }}>
                    {m.title}
                  </h3>

                  <div style={{ fontSize: "0.95rem", color: "#38bdf8", fontWeight: 600, marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Building size={14} />
                    <span>{m.institution}</span>
                  </div>

                  <p style={{ margin: 0, color: "#cbd5e1", fontSize: "0.9rem", lineHeight: 1.6 }}>
                    {m.summary}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
