import React from 'react';

type AnswerData = {
    key: string;
    text: string;
};

type AnswerButtonProps = {
    answer: AnswerData;
    state: 'default' | 'selected' | 'correct' | 'wrong' | 'hidden';
    onClick: () => void;
    disabled: boolean;
    theme?: 'dark' | 'light';
};

export default function AnswerButton({ answer, state, onClick, disabled, theme = 'dark' }: AnswerButtonProps) {
    if (state === 'hidden') {
        return <div className="invisible h-20 md:h-24" />; // Maintain layout space
    }

    const isLight = theme === 'light';

    const baseStyle = "group relative w-full h-20 md:h-24 flex items-center px-8 rounded-xl border-2 text-lg md:text-xl font-bold transition-all duration-300 transform perspective-1000 overflow-hidden";

    const stateStyles = {
        default: isLight
            ? "bg-white/80 border-amber-200 text-slate-900 hover:bg-amber-50 hover:border-amber-500/50 hover:shadow-[0_0_25px_rgba(245,158,11,0.2)] hover:scale-[1.02]"
            : "bg-slate-800/80 border-slate-600 text-slate-200 hover:bg-slate-700/80 hover:border-amber-500/50 hover:shadow-[0_0_25px_rgba(245,158,11,0.2)] hover:scale-[1.02]",
        selected: "bg-amber-600 border-amber-400 text-white shadow-[0_0_30px_rgba(245,158,11,0.6)] scale-[1.02] z-10",
        correct: "bg-emerald-700 border-emerald-400 text-white shadow-[0_0_30px_rgba(16,185,129,0.7)] scale-[1.02] z-10",
        wrong: "bg-rose-700 border-rose-400 text-white shadow-[0_0_30px_rgba(244,63,94,0.7)] animate-shake z-10",
        hidden: "invisible"
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyle} ${stateStyles[state]} ${disabled && state === 'default' ? 'opacity-50 cursor-not-allowed hover:bg-slate-800 hover:border-slate-600 hover:scale-100' : ''}`}
        >
            {/* Hex/Diamond Shape for Letter */}
            <span className={`
        flex items-center justify-center w-10 h-10 md:w-12 md:h-12 border-2 rotate-45 mr-6 md:mr-8 transition-colors duration-300 shadow-lg
        ${state === 'selected' || state === 'correct'
                    ? 'bg-white border-white'
                    : isLight
                        ? 'bg-amber-50 border-amber-500 group-hover:bg-amber-200 group-hover:border-amber-600'
                        : 'bg-slate-900 border-amber-600 group-hover:bg-amber-600 group-hover:border-amber-400'}
      `}>
                <span className={`
           -rotate-45 font-cinzel text-xl md:text-2xl font-bold
           ${state === 'selected' || state === 'correct' ? 'text-amber-600' : isLight ? 'text-amber-700 group-hover:text-amber-800' : 'text-amber-500 group-hover:text-white'}
         `}>
                    {answer.key}
                </span>
            </span>

            <span className={`flex-grow text-left font-serif tracking-wide drop-shadow-sm ${isLight ? 'group-hover:text-amber-900' : 'group-hover:text-amber-50 group-hover:drop-shadow-md'}`}>
                {answer.text}
            </span>

            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-white/10 to-transparent pointer-events-none" />
        </button>
    );
}
