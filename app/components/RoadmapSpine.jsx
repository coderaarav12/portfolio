"use client";

import React from "react";
import { motion } from "motion/react";
import {
  GraduationCap,
  Briefcase,
  Layers,
  ArrowRight,
  Sparkles,
  Milestone
} from "lucide-react";

export default function RoadmapSpine() {
  const roadmapStages = [
    {
      stage: "01",
      code: "ORIGIN",
      title: "Foundations & Curiosity",
      institution: "Vedritam Group DAV School",
      period: "Class 10th (91.2%) • Class 12th (71.2%)",
      summary:
        "Where the transition from consuming technology to writing code began. Built initial algorithmic foundations in mathematics, structured programming, and analytical problem-solving.",
      tag: "CBSE Senior Secondary",
      tagColor: "#94a3b8"
    },
    {
      stage: "02",
      code: "ACCELERATION",
      title: "University & Core AI/ML",
      institution: "SRM Institute of Science and Technology (KTR)",
      period: "2025 – 2029 • Semester 3 Active (Year 1 CGPA: 6.86)",
      summary:
        "Specializing in Computer Science and Engineering with artificial intelligence and machine learning. Focusing on production engineering, distributed systems, and real-world system architecture.",
      tag: "B.Tech CSE (AI / ML)",
      tagColor: "#38bdf8"
    },
    {
      stage: "02.5",
      code: "CAMPUS IMPACT",
      title: "Leadership & Digital Infrastructure",
      institution: "Directorate of Alumni Affairs & E-Cell SRM",
      period: "2025 – Present",
      summary:
        "Spearheading digital engagement and media campaigns for 50,000+ global alumni at the Directorate of Alumni Affairs. Building hackathon and startup portals on the E-Cell SRM technical web dev team.",
      tag: "University Leadership",
      tagColor: "#34d399"
    }
  ];

  return (
    <section className="roadmap-spine-section" style={{ padding: "100px 24px 60px 24px", position: "relative" }}>
      <div style={{ maxWidth: "1140px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{ marginBottom: "40px" }}>
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
            Stages 01 – 02 • Origin to Acceleration
          </span>
          <h2 style={{ fontSize: "clamp(2.4rem, 5vw, 3.6rem)", fontWeight: 800, margin: "0 0 14px 0", color: "#ffffff" }}>
            The Builder's <span style={{ color: "#38bdf8" }}>Roadmap</span>
          </h2>
          <p style={{ color: "#94a3b8", maxWidth: "640px", margin: 0, fontSize: "1.05rem", lineHeight: 1.6 }}>
            Every step represents a progression in technical responsibility — moving from classroom theory to engineering systems that people rely on.
          </p>
        </div>

        {/* Vertical/Grid Spatial Milestones */}
        <div style={{ display: "grid", gap: "24px" }}>
          {roadmapStages.map((milestone, idx) => (
            <div
              key={idx}
              className="glass-panel"
              style={{
                padding: "32px",
                background: "rgba(10, 15, 26, 0.75)",
                border: "1px solid rgba(255, 255, 255, 0.09)",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "24px",
                alignItems: "center"
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-mono, monospace)",
                      fontSize: "0.85rem",
                      fontWeight: 800,
                      color: milestone.tagColor
                    }}
                  >
                    STAGE {milestone.stage} // {milestone.code}
                  </span>
                  <span
                    style={{
                      fontSize: "0.72rem",
                      padding: "2px 8px",
                      borderRadius: "4px",
                      background: "rgba(255, 255, 255, 0.05)",
                      color: "#cbd5e1"
                    }}
                  >
                    {milestone.tag}
                  </span>
                </div>

                <h3 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#ffffff", margin: "0 0 4px 0" }}>
                  {milestone.title}
                </h3>
                <div style={{ fontSize: "0.95rem", color: "#38bdf8", fontWeight: 600 }}>
                  {milestone.institution}
                </div>
              </div>

              <div>
                <div style={{ fontSize: "0.82rem", color: "#64748b", marginBottom: "8px" }}>
                  {milestone.period}
                </div>
                <p style={{ margin: 0, color: "#cbd5e1", fontSize: "0.9rem", lineHeight: 1.6 }}>
                  {milestone.summary}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
