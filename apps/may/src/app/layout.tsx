import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MÂY Image Studio v1 — AI Product Imagery for Cosmetics",
  description:
    "Focused premium AI image-production tool for cosmetic brands. Upload, Enhance, Protect, and Export with source packaging protection.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="select-none">{children}</body>
    </html>
  );
}
