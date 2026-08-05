import "./globals.css";

export const metadata = {
  title: "Aarav Goel Portfolio",
  description: "A loud animated portfolio teaser for Cloudflare.",
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
