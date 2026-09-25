"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Brain,
  FileCheck,
  Eye,
  ShieldCheck,
  Workflow,
  Sparkles,
  Cpu,
  ArrowRight,
  Database,
  Sliders,
  CheckCircle2
} from "lucide-react";

export default function AIPipelineVisualizer() {
  const [activeStage, setActiveStage] = useState(2); // Default to Model Core

  const pipelineStages = [
    {
      id: "input",
      label: "01 / Ingestion",
      name: "Multimodal Inputs",
      subtitle: "Unstructured Data Streams",
      icon: <Database size={20} color="#38bdf8" />,
      tag: "Raw Telemetry & Documents",
      details: {
        sources: ["Bureaucratic PDFs & Audit Scans", "Disaster SOS GPS coordinates", "University Course Syllabi & Portals"],
        tools: ["FastAPI Multipart Streams", "OpenCV Image Preprocessing", "GeoJSON Spatial Buffers"],
        systemRole: "Normalizes noisy real-world data into standardized tensors and contextual payload packets."
      }
    },
    {
      id: "embed",
      label: "02 / Processing",
      name: "Vision & Embeddings",
      subtitle: "Feature Engineering",
      icon: <Sliders size={20} color="#818cf8" />,
      tag: "Vector Space & Transforms",
      details: {
        sources: ["Document Layout Analysis", "Color Histogram & Edge Thresholds", "Tabular Financial Anomaly Vectors"],
        tools: ["Scikit-learn Feature Scaling", "Tesseract & OpenCV Filter Kernels", "Vector Similarity Search"],
        systemRole: "Extracts bounding box regions of interest and semantic features before forwarding to inference."
      }
    },
    {
      id: "model",
      label: "03 / Foundation",
      name: "Vision LLM & Inference",
      subtitle: "Llama 3.2 Vision + Ollama",
      icon: <Cpu size={20} color="#34d399" />,
      tag: "Deep Multimodal Reasoning",
      details: {
        sources: ["Llama 3.2 Vision (Fine-tuned prompts)", "Ollama Local Edge Execution", "Structured JSON Schema Extraction"],
        tools: ["Prompt Engineering & System Directives", "Low-Latency GPU/CPU Quantization", "Deterministic Temperature Tuning"],
        systemRole: "Executes deep multimodal reasoning to parse complex government records and disaster conditions with 94%+ verified accuracy."
      }
    },
    {
      id: "guardrails",
      label: "04 / Verification",
      name: "Trust OS Guardrails",
      subtitle: "Integrity & Safety Layer",
      icon: <ShieldCheck size={20} color="#f59e0b" />,
      tag: "Hallucination & Bias Filters",
      details: {
        sources: ["Automated Hallucination Detection", "Toxicity & Exfiltration Guardrails", "Confidence Score Verification"],
        tools: ["Trust OS Architecture", "Rule-Based Regex & Semantic Differs", "Strict Output JSON Validators"],
        systemRole: "Prevents model hallucinations and unauthorized data leaks before passing output to public services."
      }
    },
    {
      id: "output",
      label: "05 / Dispatch",
      name: "Real-World Action",
      subtitle: "Production System Execution",
      icon: <CheckCircle2 size={20} color="#ec4899" />,
      tag: "Automated Production Impact",
      details: {
        sources: ["SyncMasters Audit Digests", "Ripple WebRTC Mesh Routing", "EdutechSRM Instant Student Insights"],
        tools: ["Cloudflare Edge API Responses", "P2P WebRTC Signal Packets", "Automated PDF Summary Generators"],
        systemRole: "Delivers concrete, actionable results to human decision makers, relief coordinators, and students."
      }
    }
  ];

  return (
    <section className="ai-pipeline-section" style={{ position: "relative", padding: "110px 24px" }}>
      <div style={{ maxWidth: "1140px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{ marginBottom: "36px" }}>
          <span
            style={{
              fontSize: "0.75rem",
              fontFamily: "var(--font-mono, monospace)",
              letterSpacing: "0.1em",
              color: "#34d399",
              textTransform: "uppercase",
              background: "rgba(52, 211, 153, 0.1)",
              border: "1px solid rgba(52, 211, 153, 0.25)",
              padding: "4px 12px",
              borderRadius: "9999px",
              display: "inline-block",
              marginBottom: "12px"
            }}
          >
            Stage 04 • AI & Systems Engineering
          </span>
          <h2 style={{ fontSize: "clamp(2.4rem, 5vw, 3.6rem)", fontWeight: 800, margin: "0 0 14px 0", color: "#ffffff" }}>
            The Intelligence <span style={{ color: "#34d399" }}>Pipeline</span>
          </h2>
          <p style={{ color: "#94a3b8", maxWidth: "680px", margin: 0, fontSize: "1.05rem", lineHeight: 1.6 }}>
            I treat AI not as a magic box of chat prompts, but as an engineered data pipeline where reliability, local inference speed, and safety verification dictate production viability.
          </p>
        </div>

        {/* Pipeline Navigation / Step Track */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "12px",
            marginBottom: "28px"
          }}
        >
          {pipelineStages.map((stage, idx) => (
            <button
              key={stage.id}
              onClick={() => setActiveStage(idx)}
              style={{
                background:
                  activeStage === idx
                    ? "rgba(15, 23, 42, 0.9)"
                    : "rgba(255, 255, 255, 0.02)",
                border:
                  activeStage === idx
                    ? "1px solid rgba(52, 211, 153, 0.5)"
                    : "1px solid rgba(255, 255, 255, 0.07)",
                borderRadius: "14px",
                padding: "16px 14px",
                textAlign: "left",
                cursor: "pointer",
                position: "relative",
                transition: "all 0.2s ease"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontSize: "0.72rem", color: activeStage === idx ? "#34d399" : "#64748b", fontWeight: 700 }}>
                  {stage.label}
                </span>
                {stage.icon}
              </div>
              <div style={{ fontSize: "0.92rem", fontWeight: 700, color: "#f8fafc", marginBottom: "2px" }}>
                {stage.name}
              </div>
              <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                {stage.subtitle}
              </div>
            </button>
          ))}
        </div>

        {/* Stage Detailed Inspector Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStage}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="glass-panel"
            style={{
              padding: "36px",
              background: "rgba(10, 15, 26, 0.85)",
              border: "1px solid rgba(255, 255, 255, 0.12)"
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "32px",
                alignItems: "center"
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: "0.74rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "#34d399",
                    background: "rgba(52, 211, 153, 0.12)",
                    padding: "3px 10px",
                    borderRadius: "6px"
                  }}
                >
                  {pipelineStages[activeStage].tag}
                </span>

                <h3 style={{ fontSize: "1.8rem", margin: "14px 0 8px 0", color: "#ffffff" }}>
                  {pipelineStages[activeStage].name}
                </h3>

                <p style={{ color: "#cbd5e1", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "20px" }}>
                  {pipelineStages[activeStage].details.systemRole}
                </p>

                <div style={{ fontSize: "0.82rem", color: "#94a3b8" }}>
                  Active Production Integration:
                  <strong style={{ color: "#38bdf8", marginLeft: "6px" }}>
                    SyncMasters (SIH '26), Ripple (Manipal '26), Trust OS
                  </strong>
                </div>
              </div>

              {/* Technical Specifications Matrix */}
              <div
                style={{
                  background: "rgba(0, 0, 0, 0.35)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "14px",
                  padding: "24px"
                }}
              >
                <div style={{ marginBottom: "18px" }}>
                  <div style={{ fontSize: "0.76rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>
                    Target Payloads & Inputs
                  </div>
                  <ul style={{ margin: 0, paddingLeft: "18px", color: "#f8fafc", fontSize: "0.85rem", lineHeight: 1.6 }}>
                    {pipelineStages[activeStage].details.sources.map((src, i) => (
                      <li key={i}>{src}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div style={{ fontSize: "0.76rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>
                    Engineering Stack & Algorithms
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {pipelineStages[activeStage].details.tools.map((tool, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: "0.78rem",
                          background: "rgba(255, 255, 255, 0.06)",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                          padding: "4px 10px",
                          borderRadius: "6px",
                          color: "#cbd5e1"
                        }}
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
