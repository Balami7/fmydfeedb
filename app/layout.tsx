// app/layout.tsx
import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Youth Voice Survey | Federal Ministry of Youth Development",
  description:
    "Share your thoughts and help shape youth development programs in Nigeria. Your voice matters.",
  icons: {
    icon: "/fmyd1.png",
  },
  openGraph: {
    title: "Youth Voice Survey - Ministry of Youth Development",
    description: "Help shape the future of youth development in Nigeria.",
    images: [{ url: "/fmyd1.png" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} antialiased bg-white text-black`}
      >
        {children}
      </body>
    </html>
  );
}