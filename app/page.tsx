import Link from "next/link";

export default function Home() {
  const currentYear = new Date().getFullYear();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Cinematic Title Section */}
      <div className="text-center space-y-12 z-10 animate-in fade-in zoom-in duration-1000 ease-out">
        <h1 className="text-6xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-400 to-amber-700 drop-shadow-[0_0_25px_rgba(245,158,11,0.4)] font-cinzel tracking-tighter">
          MİTOLOJİ<br />
          <span className="text-4xl md:text-7xl tracking-[0.2em] font-light text-amber-100/90 block mt-4">MİLYONERİ</span>
        </h1>

        <p className="text-xl md:text-2xl text-slate-300/80 max-w-2xl mx-auto font-serif italic border-y border-white/10 py-6">
          &quot;Tanrıların sofrasına oturmak için<br />
          kadim bilgelik testini geçmelisin.&quot;
        </p>

        <div className="pt-12">
          <Link
            href="/game"
            className="group relative inline-flex items-center justify-center px-12 py-5 text-xl font-bold text-white transition-all duration-300 bg-amber-600/20 border border-amber-500/50 backdrop-blur-sm rounded-sm hover:bg-amber-600 hover:border-amber-400 hover:shadow-[0_0_40px_rgba(245,158,11,0.4)] overflow-hidden"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />

            <span className="mr-3 font-cinzel tracking-widest relative z-10">OYUNA BAŞLA</span>
            <svg
              suppressHydrationWarning
              className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-2 relative z-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>

      <footer className="absolute bottom-6 text-slate-600 text-xs tracking-widest uppercase font-bold">
        Mitoloji Bilgi Yarışması Ajanı &copy; {currentYear}
      </footer>
    </main>
  );
}
