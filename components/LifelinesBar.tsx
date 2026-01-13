import React from 'react';

type Lifelines = {
    fiftyFifty: boolean;
    skip: boolean;
    doubleChance: boolean;
    phone: boolean;
};

type LifelinesBarProps = {
    lifelines: Lifelines;
    onUseLifeline: (type: 'fiftyFifty' | 'skip' | 'doubleChance' | 'phone') => void;
    disabled: boolean;
    theme?: 'dark' | 'light';
    labels: {
        fifty: string;
        skip: string;
        double: string;
        phone: string;
    };
};

export default function LifelinesBar({ lifelines, onUseLifeline, disabled, theme = 'dark', labels }: LifelinesBarProps) {
    const isLight = theme === 'light';
    const baseButton = "group relative w-20 h-20 md:w-24 md:h-24 rounded-full border-2 flex items-center justify-center transition-all duration-300 overflow-hidden";

    const blockIcon = (
        <div className="absolute inset-0 flex items-center justify-center text-red-500 text-5xl font-bold opacity-80 pointer-events-none">
            ✕
        </div>
    );

    return (
        <div className="flex justify-center gap-4 md:gap-6 mb-8 flex-wrap">
            {/* 50:50 Lifeline */}
            <button
                onClick={() => onUseLifeline('fiftyFifty')}
                disabled={!lifelines.fiftyFifty || disabled}
                className={`${baseButton} ${lifelines.fiftyFifty
                    ? `${isLight ? 'bg-amber-50 border-indigo-300 text-indigo-700' : 'bg-slate-800 border-indigo-400 text-indigo-300'} hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] cursor-pointer`
                    : 'bg-slate-900 border-slate-700 text-slate-700 opacity-50 cursor-not-allowed'
                    } ${disabled && lifelines.fiftyFifty ? 'opacity-70 cursor-wait' : ''}`}
                title={labels.fifty}
            >
                <div className="relative z-10 flex flex-col items-center leading-none font-cinzel font-bold text-lg md:text-xl">
                    <span>50</span>
                    <span className="w-8 h-px bg-current my-1"></span>
                    <span>50</span>
                </div>
                {lifelines.fiftyFifty && (
                    <div className="absolute inset-0 bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}
                {!lifelines.fiftyFifty && blockIcon}
            </button>

            {/* Double Chance */}
            <button
                onClick={() => onUseLifeline('doubleChance')}
                disabled={!lifelines.doubleChance || disabled}
                className={`${baseButton} ${lifelines.doubleChance
                    ? `${isLight ? 'bg-amber-50 border-lime-300 text-lime-700' : 'bg-slate-800 border-lime-400 text-lime-300'} hover:shadow-[0_0_20px_rgba(132,204,22,0.5)] cursor-pointer`
                    : 'bg-slate-900 border-slate-700 text-slate-700 opacity-50 cursor-not-allowed'
                    } ${disabled && lifelines.doubleChance ? 'opacity-70 cursor-wait' : ''}`}
                title={labels.double}
            >
                <div className="relative z-10 flex items-center gap-1 font-bold text-lg md:text-xl">
                    <span>2️⃣</span>
                </div>
                {lifelines.doubleChance && <div className="absolute inset-0 bg-lime-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />}
                {!lifelines.doubleChance && blockIcon}
            </button>

            {/* Phone a Friend */}
            <button
                onClick={() => onUseLifeline('phone')}
                disabled={!lifelines.phone || disabled}
                className={`${baseButton} ${lifelines.phone
                    ? `${isLight ? 'bg-amber-50 border-sky-300 text-sky-700' : 'bg-slate-800 border-sky-400 text-sky-300'} hover:shadow-[0_0_20px_rgba(56,189,248,0.5)] cursor-pointer`
                    : 'bg-slate-900 border-slate-700 text-slate-700 opacity-50 cursor-not-allowed'
                    } ${disabled && lifelines.phone ? 'opacity-70 cursor-wait' : ''}`}
                title={labels.phone}
            >
                <div className="relative z-10 flex items-center gap-1 font-bold text-lg md:text-xl">
                    <span role="img" aria-label="phone">📞</span>
                </div>
                {lifelines.phone && <div className="absolute inset-0 bg-sky-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />}
                {!lifelines.phone && blockIcon}
            </button>

            {/* Skip Question Lifeline */}
            <button
                onClick={() => onUseLifeline('skip')}
                disabled={!lifelines.skip || disabled}
                className={`${baseButton} ${lifelines.skip
                    ? `${isLight ? 'bg-amber-50 border-fuchsia-300 text-fuchsia-700' : 'bg-slate-800 border-fuchsia-400 text-fuchsia-300'} hover:shadow-[0_0_20px_rgba(232,121,249,0.5)] cursor-pointer`
                    : 'bg-slate-900 border-slate-700 text-slate-700 opacity-50 cursor-not-allowed'
                    } ${disabled && lifelines.skip ? 'opacity-70 cursor-wait' : ''}`}
                title={labels.skip}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10 md:w-12 md:h-12 relative z-10">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" />
                </svg>

                {lifelines.skip && (
                    <div className="absolute inset-0 bg-fuchsia-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}

                {!lifelines.skip && blockIcon}
            </button>
        </div>
    );
}
