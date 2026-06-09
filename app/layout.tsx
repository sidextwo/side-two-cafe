import type { Metadata, Viewport } from "next";
import { Lekton } from "next/font/google";
import "./globals.css";

const lekton = Lekton({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Side Two Café",
  description: "Coffee ordering app",
  manifest: "/manifest.json",
  icons: {
    apple: "/icon-512.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${lekton.className} bg-white text-zinc-900`}>
        {children}
      </body>
    </html>
  );
}