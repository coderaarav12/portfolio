import "./globals.css";

export const metadata = {
  title: "Aarav Goel Portfolio",
  description: "A loud animated portfolio teaser for Cloudflare.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
