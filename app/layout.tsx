import type { Metadata } from "next";
import { Cinzel, Inter } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mitoloji Milyoneri",
  description: "Mitoloji bilginizi sınayın ve milyoner olun!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body
        className={`${cinzel.variable} ${inter.variable} antialiased bg-slate-950 text-slate-100 selection:bg-amber-500/30`}
      >
        <div className="fixed inset-0 z-[-1] bg-[url('https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2694&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay pointer-events-none" />
        <div className="fixed inset-0 z-[-1] bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 pointer-events-none" />
        <div className="relative min-h-screen flex flex-col">{children}</div>
      </body>
    </html>
  );
}
