import "./globals.css";

export const metadata = {
  title: "Aarav Goel | Frontend Engineer & Vibe Coder",
  description:
    "Portfolio of Aarav Goel — 2nd year engineering student at SRMIST KTR, frontend developer, and builder of EduTechSRM, MediaHub, and SRM Sarthi.",
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
