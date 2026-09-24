"use client";

import { useEffect } from "react";

const G_DRIVE_URL =
  "https://drive.google.com/drive/folders/1gDYo3WZRP6ItngaANJCPS8Q8y2GMKLIN?usp=drive_link";

export default function AppTutorialsRedirect() {
  useEffect(() => {
    window.location.replace(G_DRIVE_URL);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#05060b",
        color: "#f6f7fb",
        fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
        gap: "18px",
        padding: "24px",
        textAlign: "center",
      }}
    >
      <script
        dangerouslySetInnerHTML={{
          __html: `window.location.replace("${G_DRIVE_URL}");`,
        }}
      />
      <div
        style={{
          width: "48px",
          height: "48px",
          border: "3px solid rgba(139, 92, 246, 0.2)",
          borderTopColor: "#8b5cf6",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <h1 style={{ fontSize: "1.5rem", margin: 0, fontWeight: 800 }}>
        Redirecting to Google Drive...
      </h1>
      <p style={{ color: "rgba(246, 247, 251, 0.7)", margin: 0, fontSize: "0.95rem", maxWidth: "400px" }}>
        Opening the Tutorials &amp; Resources folder. If not redirected automatically:
      </p>
      <a
        href={G_DRIVE_URL}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "12px 24px",
          borderRadius: "12px",
          background: "linear-gradient(135deg, #8b5cf6, #6366f1)",
          color: "#ffffff",
          fontWeight: 700,
          fontSize: "0.95rem",
          textDecoration: "none",
          boxShadow: "0 10px 30px rgba(124, 58, 237, 0.4)",
        }}
      >
        Open Google Drive Folder ↗
      </a>
    </div>
  );
}
