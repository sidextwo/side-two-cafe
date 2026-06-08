import type { Metadata } from "next";
import { Lekton } from "next/font/google";
import "./globals.css";

const lekton = Lekton({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Side Two Café",
  description: "Coffee ordering app",
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