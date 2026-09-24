"use client";

import { useEffect } from "react";

const G_DRIVE_URL =
  "https://drive.google.com/drive/folders/1gDYo3WZRP6ItngaANJCPS8Q8y2GMKLIN?usp=drive_link";

export default function AppTutorialsRedirect() {
  useEffect(() => {
    window.location.replace(G_DRIVE_URL);
  }, []);

  return (
    <>
      <head>
        <meta httpEquiv="refresh" content={`0;url=${G_DRIVE_URL}`} />
        <title>Redirecting to Google Drive...</title>
      </head>
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#05060b",
          color: "#f6f7fb",
          fontFamily: "Inter, sans-serif",
          gap: "16px",
          padding: "24px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            border: "3px solid rgba(139, 92, 246, 0.3)",
            borderTopColor: "#8b5cf6",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <h1 style={{ fontSize: "1.4rem", margin: 0, fontWeight: 700 }}>
          Redirecting to Google Drive Tutorials...
        </h1>
        <p style={{ color: "rgba(246, 247, 251, 0.7)", margin: 0, fontSize: "0.95rem" }}>
          If you are not redirected automatically,{" "}
          <a
            href={G_DRIVE_URL}
            style={{
              color: "#8b5cf6",
              textDecoration: "underline",
              fontWeight: 600,
            }}
          >
            click here to open the folder
          </a>
          .
        </p>
      </div>
    </>
  );
}
