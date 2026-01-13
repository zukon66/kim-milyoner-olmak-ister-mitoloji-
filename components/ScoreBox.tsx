import React from 'react';

type ScoreBoxProps = {
    score: number;
    currentQuestionIndex: number;
    totalQuestions: number;
    timeLeft?: number;
    timeLimit?: number;
    theme?: 'dark' | 'light';
    prizeLabel?: string;
    timerLabel?: string;
};

export default function ScoreBox({
    score,
    currentQuestionIndex,
    totalQuestions,
    timeLeft,
    timeLimit,
    theme = 'dark',
    prizeLabel = 'Toplam Ödül',
    timerLabel = '⌛',
}: ScoreBoxProps) {
    const isLight = theme === 'light';
    const progress = timeLeft !== undefined && timeLimit ? Math.max(0, Math.min(100, (timeLeft / timeLimit) * 100)) : 100;

    return (
        <div className={`absolute top-4 right-4 md:top-8 md:right-8 backdrop-blur-md border rounded-xl px-6 py-4 shadow-2xl z-10 max-w-[220px] md:max-w-none ${isLight ? 'bg-white/90 border-amber-200 text-slate-900' : 'bg-slate-900/80 border-amber-500/30 text-white'}`}>
            <div className="text-right">
                <p className={`${isLight ? 'text-slate-600' : 'text-slate-400'} text-[10px] md:text-xs uppercase tracking-widest mb-1 font-bold`}>{prizeLabel}</p>
                <p className="text-xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-600 tabular-nums drop-shadow-sm font-cinzel">
                    ₺ {score.toLocaleString()}
                </p>
            </div>
            <div className="mt-2 md:mt-3 text-right border-t border-white/10 pt-2">
                <div className="flex justify-end gap-1">
                    {Array.from({ length: totalQuestions }).map((_, i) => (
                        <div
                            key={i}
                            className={`h-1.5 w-1.5 md:h-2 md:w-2 rounded-full ${i <= currentQuestionIndex ? 'bg-amber-500' : 'bg-slate-700'}`}
                        />
                    ))}
                </div>
            </div>
            {timeLeft !== undefined && timeLimit !== undefined && (
                <div className="mt-3">
                    <div className={`flex justify-between text-[10px] md:text-xs ${isLight ? 'text-slate-700' : 'text-slate-300'} font-semibold`}>
                        <span>{timerLabel}</span>
                        <span>{timeLeft}s</span>
                    </div>
                    <div className={`w-full h-2 rounded-full mt-1 overflow-hidden ${isLight ? 'bg-amber-100' : 'bg-slate-800'}`}>
                        <div
                            className={`h-full ${timeLeft <= 5 ? 'bg-rose-500' : 'bg-amber-500'} transition-all duration-300`}
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
