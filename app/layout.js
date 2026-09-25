import "./globals.css";

export const metadata = {
  title: "Aarav Goel | AI/ML Student @ SRMIST KTR & Full-Stack AI Engineer",
  description:
    "Portfolio of Aarav Goel — AI/ML undergraduate at SRMIST KTR building practical full-stack applications and AI systems including EdutechSRM, Ripple, SyncMasters, and TrustOS.",
  icons: {
    icon: "/aarav-photo.png",
    shortcut: "/aarav-photo.png",
    apple: "/aarav-photo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
