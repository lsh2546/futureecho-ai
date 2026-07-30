import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://futureecho-ai-igad.ljs2546.chatgpt.site"),
  title: "FutureEcho AI — See the Future. Change the Outcome.",
  description: "An AI-powered Decision Twin for exploring disaster response scenarios before they unfold.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "FutureEcho AI — See the Future. Change the Outcome.",
    description: "Compare disaster-response futures before they unfold.",
    images: [{ url: "/og.png", width: 1680, height: 945, alt: "FutureEcho AI futures explorer" }],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${geist.variable} ${geistMono.variable}`}>{children}</body></html>;
}
