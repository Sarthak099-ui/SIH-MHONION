import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "MH ONION - AI Quality Assessment, AGMARK Grading & Direct Trade",
  description: "AI-powered mobile application for computer-vision onion defect classification, instant AGMARK/FSSAI digital certification, and farm-to-trader marketplace across Maharashtra.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 antialiased">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
          <p>© 2026 MH ONION Quality & Trading System • Aligned with AGMARK / FSSAI Norms • Tamper-Evident Ledger</p>
        </footer>
      </body>
    </html>
  );
}
