import React from 'react';

type QuestionCardProps = {
    question: string;
    difficulty: string;
    category: string;
    theme?: 'dark' | 'light';
};

export default function QuestionCard({ question, difficulty, category, theme = 'dark' }: QuestionCardProps) {
    // Determine color based on difficulty
    const difficultyColor = {
        'Kolay': 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]',
        'Orta': 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]',
        'Zor': 'text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]',
    }[difficulty] || 'text-white';

    const isLight = theme === 'light';

    return (
        <div className={`w-full max-w-4xl mx-auto ${isLight ? 'bg-white/90 border-amber-200' : 'bg-slate-900/80 border-white/10'} backdrop-blur-2xl rounded-2xl p-8 md:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.7)] mb-8 relative overflow-hidden group transition-all duration-500 hover:shadow-[0_20px_80px_rgba(245,158,11,0.1)]`}>

            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Mystical Gradient Blob - Pulse Animation */}
                <div className={`absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] ${isLight ? 'from-amber-300/20' : 'from-amber-500/5'} via-transparent to-transparent opacity-50 animate-pulse-slow`} />

                {/* Floating Particles (Simple CSS animation) */}
                <div className="absolute top-10 left-10 w-2 h-2 bg-amber-200/30 rounded-full animate-float-delay-1" />
                <div className="absolute bottom-20 right-20 w-3 h-3 bg-amber-200/20 rounded-full animate-float-delay-2" />
                <div className="absolute top-1/2 left-1/4 w-1 h-1 bg-white/30 rounded-full animate-float-delay-3" />

                {/* Subtle Texture Overlay */}
                <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
            </div>

            {/* Decorative corners - Enhanced */}
            <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-amber-500/30 rounded-tl-3xl opacity-60 group-hover:opacity-100 group-hover:w-28 group-hover:h-28 transition-all duration-500" />
            <div className="absolute top-0 right-0 w-24 h-24 border-t-2 border-r-2 border-amber-500/30 rounded-tr-3xl opacity-60 group-hover:opacity-100 group-hover:w-28 group-hover:h-28 transition-all duration-500" />
            <div className="absolute bottom-0 left-0 w-24 h-24 border-b-2 border-l-2 border-amber-500/30 rounded-bl-3xl opacity-60 group-hover:opacity-100 group-hover:w-28 group-hover:h-28 transition-all duration-500" />
            <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-amber-500/30 rounded-br-3xl opacity-60 group-hover:opacity-100 group-hover:w-28 group-hover:h-28 transition-all duration-500" />

            {/* Content Container */}
            <div className="relative z-10">
                <div className={`flex justify-between items-center mb-8 text-sm md:text-base font-bold tracking-[0.2em] border-b pb-4 ${isLight ? 'border-amber-100 text-slate-700' : 'border-white/5'}`}>
                    <span className={`${isLight ? 'text-slate-700' : 'text-slate-400'} uppercase flex items-center gap-3`}>
                        <span className={`w-2 h-2 rounded-full ${isLight ? 'bg-amber-500' : 'bg-amber-500'} animate-pulse`} />
                        {category}
                    </span>
                    <span className={`${difficultyColor} uppercase border border-current px-4 py-1.5 rounded-full text-xs md:text-sm backdrop-blur-md ${isLight ? 'bg-amber-50/70' : 'bg-black/20'}`}>
                        {difficulty}
                    </span>
                </div>

                <div className="min-h-[120px] flex items-center justify-center">
                    <h2 className={`text-2xl md:text-3xl lg:text-4xl font-black text-center leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-cinzel tracking-wide ${isLight ? 'text-slate-900' : 'text-amber-50'}`}>
                        {question}
                    </h2>
                </div>
            </div>

            {/* Bottom Glow */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        </div>
    );
}
