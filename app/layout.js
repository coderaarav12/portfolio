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
      <body>{children}</body>
    </html>
  );
}
