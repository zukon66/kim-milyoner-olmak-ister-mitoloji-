export type LanguageKey = 'tr' | 'en';

type TranslationBundle = {
  startTitle: string;
  startSubtitle: string;
  startButton: string;
  categoryLabel: string;
  categoryEdit: string;
  categoryHint: string;
  difficultyLabel: string;
  anyCategory: string;
  anyDifficulty: string;
  languageLabel: string;
  themeLabel: string;
  fontLabel: string;
  timerLabel: string;
  timeIsUp: string;
  explanationTitle: string;
  lifelines: {
    fifty: string;
    skip: string;
    double: string;
    phone: string;
  };
  phoneAFriendHint: string;
  doubleChanceHint: string;
  gameOver: string;
  victory: string;
  prizeLabel: string;
  answeredCount: string;
  correctCount: string;
  wrongCount: string;
  totalTime: string;
  playAgain: string;
  home: string;
  loading: string;
  continueText: string;
  musicOn: string;
  musicOff: string;
  musicHint: string;
  timerHelp: (seconds: number) => string;
  themeLight: string;
  themeDark: string;
};

export const translations: Record<LanguageKey, TranslationBundle> = {
  tr: {
    startTitle: 'Mitoloji Bilgi Yarışması',
    startSubtitle: 'Kategoriyi ve zorluk seviyesini seç, jokerlerini hazırla ve efsanelere meydan oku.',
    startButton: 'Oyuna Başla',
    categoryLabel: 'Kategori',
    categoryEdit: 'Kategorileri Düzenle',
    categoryHint: 'Seçtiğin mitoloji kategorilerinden sorular gelir. Hiçbirini seçmezsen hepsi dahil olur.',
    difficultyLabel: 'Zorluk',
    anyCategory: 'Hepsi',
    anyDifficulty: 'Karışık',
    languageLabel: 'Dil',
    themeLabel: 'Tema',
    fontLabel: 'Yazı Boyutu',
    timerLabel: 'Geri Sayım',
    timeIsUp: 'Süre doldu! Yanıt verilmedi.',
    explanationTitle: 'Mitolojik Açıklama',
    lifelines: {
      fifty: '50/50',
      skip: 'Atla',
      double: 'Çift Şans',
      phone: 'Telefon Hakkı',
    },
    phoneAFriendHint: 'Sanal arkadaş şöyle diyor:',
    doubleChanceHint: 'Bu soruda iki kez cevap verme hakkın var.',
    gameOver: 'Oyun Bitti',
    victory: 'Mitoloji Efsanesi!',
    prizeLabel: 'Toplam Kazanç',
    answeredCount: 'Doğru Bilinen Soru',
    correctCount: 'Doğru',
    wrongCount: 'Yanlış',
    totalTime: 'Geçen Süre',
    playAgain: 'Tekrar Oyna',
    home: 'Ana Menü',
    loading: 'Yükleniyor...',
    continueText: 'Sonraki Soru',
    musicOn: 'Müziği Aç',
    musicOff: 'Müziği Kapat',
    musicHint: 'Arka plan müziğini buradan kontrol edebilirsin.',
    timerHelp: (seconds: number) => `Her soru için ${seconds} saniyen var.`,
    themeLight: 'Aydınlık',
    themeDark: 'Koyu',
  },
  en: {
    startTitle: 'Mythology Quiz Show',
    startSubtitle: 'Pick a category and difficulty, ready your lifelines, and challenge the legends.',
    startButton: 'Start Game',
    categoryLabel: 'Category',
    categoryEdit: 'Edit Categories',
    categoryHint: 'Questions will be drawn only from selected mythologies. If none selected, all are included.',
    difficultyLabel: 'Difficulty',
    anyCategory: 'All',
    anyDifficulty: 'Mixed',
    languageLabel: 'Language',
    themeLabel: 'Theme',
    fontLabel: 'Font Size',
    timerLabel: 'Countdown',
    timeIsUp: 'Time is up! No answer selected.',
    explanationTitle: 'Mythology Insight',
    lifelines: {
      fifty: '50/50',
      skip: 'Skip',
      double: 'Double Chance',
      phone: 'Phone a Friend',
    },
    phoneAFriendHint: 'Your friend thinks:',
    doubleChanceHint: 'You can answer twice on this question.',
    gameOver: 'Game Over',
    victory: 'Mythology Legend!',
    prizeLabel: 'Total Winnings',
    answeredCount: 'Questions Answered',
    correctCount: 'Correct',
    wrongCount: 'Wrong',
    totalTime: 'Elapsed Time',
    playAgain: 'Play Again',
    home: 'Home',
    loading: 'Loading...',
    continueText: 'Next Question',
    musicOn: 'Turn Music On',
    musicOff: 'Turn Music Off',
    musicHint: 'Control background music here.',
    timerHelp: (seconds: number) => `You have ${seconds} seconds per question.`,
    themeLight: 'Light',
    themeDark: 'Dark',
  },
};
