import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Kadiri Ward 08 Electoral Directory & Campaign War Room | APSEC 2026",
  description: "Official Electoral Directory, Search Engine, Duplicate Audit, and Campaign War Room for Ward 8, Kadiri Municipality, Sri Sathya Sai District, Andhra Pradesh.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased selection:bg-emerald-500 selection:text-white">
        <Navbar />
        <main className="min-h-[calc(100vh-4rem)] pb-16">
          {children}
        </main>
        <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 no-print">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              <span className="font-bold text-slate-700">Kadiri Municipality — Ward 08</span> • Sri Sathya Sai District, Andhra Pradesh
            </div>
            <div className="font-telugu text-slate-400">
              ఆంధ్రప్రదేశ్ రాష్ట్ర ఎన్నికల సంఘం (APSEC) • అధికారిక ఓటర్ల జాబితా 2026
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
