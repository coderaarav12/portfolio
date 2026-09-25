"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Code2,
  Cpu,
  Server,
  Wrench,
  Award,
  CheckCircle,
  ExternalLink,
  ChevronRight,
  GitBranch
} from "lucide-react";

export default function TechEcosystem() {
  const [activeSystem, setActiveSystem] = useState(0);

  const systems = [
    {
      id: "ai_systems",
      name: "AI & Model Engineering",
      icon: <Cpu size={18} color="#34d399" />,
      description:
        "Applied machine learning, multimodal vision architectures, and safety pipelines tested in high-pressure national hackathons.",
      technologies: [
        {
          name: "Llama 3.2 Vision",
          appliedIn: "SyncMasters GovTech",
          proof: "Multimodal document audit engine with automated fraud detection."
        },
        {
          name: "Ollama Local Engine",
          appliedIn: "Edge Inference",
          proof: "Local low-latency quantized model runner operating without cloud API bills."
        },
        {
          name: "Scikit-learn & OpenCV",
          appliedIn: "Trust OS Guardrails",
          proof: "Feature vectorization, image thresholding, and anomaly scoring."
        },
        {
          name: "Prompt Engineering",
          appliedIn: "Autonomous Workflows",
          proof: "Structured JSON schema output enforcement and hallucination minimization."
        }
      ]
    },
    {
      id: "systems_languages",
      name: "Core Languages & Systems",
      icon: <Code2 size={18} color="#38bdf8" />,
      description:
        "Strong foundation in typed, compiled, and scripting languages with emphasis on memory layouts, data structures, and algorithms.",
      technologies: [
        {
          name: "Python",
          appliedIn: "FastAPI & AI Automation",
          proof: "Microservices for EdutechSRM syllabus extraction & SyncMasters data flows."
        },
        {
          name: "C++",
          appliedIn: "Academic & Systems Foundation",
          proof: "Microsoft Certified OOP, IIT Hyderabad ENDURO robotics & algorithmic rigor."
        },
        {
          name: "TypeScript & JavaScript",
          appliedIn: "Full-Stack Web & Mesh",
          proof: "Strictly typed real-time WebRTC mesh logic in Ripple and Next.js 16 portals."
        },
        {
          name: "SQL & Structured Storage",
          appliedIn: "EdutechSRM & Relational Models",
          proof: "Relational student record schemas, indexing, and transactional integrity."
        }
      ]
    },
    {
      id: "edge_cloud",
      name: "Edge & Cloud Architecture",
      icon: <Server size={18} color="#818cf8" />,
      description:
        "Building lightweight, globally distributed architectures that resist traffic spikes and cost next to nothing to operate.",
      technologies: [
        {
          name: "Cloudflare Workers & KV",
          appliedIn: "Portfolio & EdutechSRM",
          proof: "Sub-50ms edge request routing, custom SVG telemetry generation, zero-egress."
        },
        {
          name: "Next.js 16 (App Router)",
          appliedIn: "Production Frontend",
          proof: "Static export optimization, server component hydration, and client motion."
        },
        {
          name: "FastAPI & REST APIs",
          appliedIn: "Backend Microservices",
          proof: "Asynchronous endpoint handling with automated OpenAPI documentation."
        },
        {
          name: "WebRTC Mesh Protocol",
          appliedIn: "Ripple Disaster System",
          proof: "Peer-to-peer data transport completely independent of cellular carrier gateways."
        }
      ]
    },
    {
      id: "creative_ops",
      name: "Engineering Tools & Creative Media",
      icon: <Wrench size={18} color="#f59e0b" />,
      description:
        "Bridging code with high-end visual communication, video editing, and CI/CD automation.",
      technologies: [
        {
          name: "Git & GitHub Actions",
          appliedIn: "Automated Deployments",
          proof: "Automated build, test, and Cloudflare Pages/Worker deployment pipelines."
        },
        {
          name: "Adobe Premiere Pro & After Effects",
          appliedIn: "Alumni Affairs & Cherry+",
          proof: "Motion graphics, promotional alumni video assets, and multimedia campaigns."
        },
        {
          name: "Figma UI/UX Systems",
          appliedIn: "Product Prototyping",
          proof: "High-fidelity wireframing and design token specification before code execution."
        },
        {
          name: "Docker Containerization",
          appliedIn: "Reproducible Workflows",
          proof: "Containerized local environments for reproducible Python AI dependencies."
        }
      ]
    }
  ];

  const certifications = [
    { name: "Google AI Fundamentals", issuer: "Google", note: "GenAI Foundations" },
    { name: "Object-Oriented Programming with C++", issuer: "Microsoft", note: "OOP Systems" },
    { name: "Python for Data Science & AI", issuer: "IBM", note: "Data Engineering" },
    { name: "RDMA Programming Fundamentals", issuer: "NVIDIA", note: "HPC Networks" },
    { name: "ENDURO 2025 AI/Robotics Challenge", issuer: "IIT Hyderabad", note: "Engineering" },
    { name: "C++ Programming Certification", issuer: "Simplilearn", note: "Algorithms" },
    { name: "HP LIFE AI & Tech Literacy", issuer: "HP LIFE", note: "Automation" }
  ];

  return (
    <section className="tech-ecosystem-section" style={{ padding: "100px 24px", position: "relative" }}>
      <div style={{ maxWidth: "1140px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{ marginBottom: "36px" }}>
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
            Stage 06 • Earned Technology Ecosystem
          </span>
          <h2 style={{ fontSize: "clamp(2.4rem, 5vw, 3.6rem)", fontWeight: 800, margin: "0 0 14px 0", color: "#ffffff" }}>
            Skills Rooted in <span style={{ color: "#38bdf8" }}>Real Systems</span>
          </h2>
          <p style={{ color: "#94a3b8", maxWidth: "680px", margin: 0, fontSize: "1.05rem", lineHeight: 1.6 }}>
            Rather than a disconnected laundry list of keywords, every language and framework in my arsenal corresponds to an actual production system or hackathon platform I personally built and deployed.
          </p>
        </div>

        {/* System Tabs */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "12px",
            marginBottom: "28px"
          }}
        >
          {systems.map((sys, idx) => (
            <button
              key={sys.id}
              onClick={() => setActiveSystem(idx)}
              style={{
                background:
                  activeSystem === idx
                    ? "rgba(15, 23, 42, 0.9)"
                    : "rgba(255, 255, 255, 0.02)",
                border:
                  activeSystem === idx
                    ? "1px solid rgba(56, 189, 248, 0.5)"
                    : "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "14px",
                padding: "16px 18px",
                textAlign: "left",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                {sys.icon}
                <span style={{ fontSize: "0.95rem", fontWeight: 700, color: "#f8fafc" }}>
                  {sys.name}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: "0.78rem", color: "#94a3b8", lineHeight: 1.4 }}>
                {sys.technologies.length} proven technologies
              </p>
            </button>
          ))}
        </div>

        {/* Active System Breakdown */}
        <div
          className="glass-panel"
          style={{
            padding: "36px",
            background: "rgba(10, 15, 26, 0.85)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            marginBottom: "40px"
          }}
        >
          <div style={{ marginBottom: "24px" }}>
            <h3 style={{ fontSize: "1.35rem", margin: "0 0 6px 0", color: "#ffffff" }}>
              {systems[activeSystem].name}
            </h3>
            <p style={{ margin: 0, color: "#94a3b8", fontSize: "0.92rem" }}>
              {systems[activeSystem].description}
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "18px"
            }}
          >
            {systems[activeSystem].technologies.map((tech, tIdx) => (
              <div
                key={tIdx}
                style={{
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.07)",
                  borderRadius: "12px",
                  padding: "18px 20px"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ fontSize: "1.05rem", fontWeight: 700, color: "#f8fafc" }}>
                    {tech.name}
                  </span>
                  <span
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      color: "#34d399",
                      background: "rgba(52, 211, 153, 0.1)",
                      padding: "2px 8px",
                      borderRadius: "6px"
                    }}
                  >
                    {tech.appliedIn}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: "0.82rem", color: "#cbd5e1", lineHeight: 1.5 }}>
                  {tech.proof}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Verified Industry Certifications */}
        <div style={{ marginTop: "40px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "18px" }}>
            <Award size={18} color="#f59e0b" />
            <h3 style={{ fontSize: "1.1rem", margin: 0, fontWeight: 700, color: "#f8fafc" }}>
              Verified Certifications & Accreditations
            </h3>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "12px"
            }}
          >
            {certifications.map((cert, cIdx) => (
              <div
                key={cIdx}
                style={{
                  padding: "14px 18px",
                  borderRadius: "10px",
                  background: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid rgba(255, 255, 255, 0.07)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}
              >
                <div>
                  <div style={{ fontSize: "0.88rem", fontWeight: 600, color: "#f8fafc" }}>
                    {cert.name}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "2px" }}>
                    {cert.note}
                  </div>
                </div>
                <span
                  style={{
                    fontSize: "0.74rem",
                    fontWeight: 700,
                    color: "#f59e0b",
                    background: "rgba(245, 158, 11, 0.1)",
                    padding: "3px 8px",
                    borderRadius: "6px"
                  }}
                >
                  {cert.issuer}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
