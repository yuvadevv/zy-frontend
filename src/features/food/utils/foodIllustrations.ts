// src/features/food/utils/foodIllustrations.ts

interface FoodTheme {
  bgStart: string;
  bgEnd: string;
  accent: string;
  plateColor: string;
  plateBorder: string;
  tagBg: string;
  tagColor: string;
  icon: string;
  title: string;
  subtitle: string;
}

const THEMES: Record<string, FoodTheme> = {
  breakfast: {
    bgStart: '#FFF7ED',
    bgEnd: '#FFEDD5',
    accent: '#EA580C',
    plateColor: '#FFFFFF',
    plateBorder: '#FDBA74',
    tagBg: '#C2410C',
    tagColor: '#FFFFFF',
    icon: '🥞',
    title: 'Breakfast Special',
    subtitle: 'Hot & Fresh Counter Preparation',
  },
  meals: {
    bgStart: '#F0FDF4',
    bgEnd: '#DCFCE7',
    accent: '#16A34A',
    plateColor: '#FFFFFF',
    plateBorder: '#86EFAC',
    tagBg: '#15803D',
    tagColor: '#FFFFFF',
    icon: '🍛',
    title: 'Campus Meals',
    subtitle: 'Authentic South Indian Dining',
  },
  'veg-meals': {
    bgStart: '#F0FDF4',
    bgEnd: '#DCFCE7',
    accent: '#16A34A',
    plateColor: '#FFFFFF',
    plateBorder: '#86EFAC',
    tagBg: '#15803D',
    tagColor: '#FFFFFF',
    icon: '🍛',
    title: 'Pure Veg Meals',
    subtitle: 'Unlimited Dining Plate',
  },
  'chicken-curries': {
    bgStart: '#FEF2F2',
    bgEnd: '#FEE2E2',
    accent: '#DC2626',
    plateColor: '#FFFFFF',
    plateBorder: '#FCA5A5',
    tagBg: '#B91C1C',
    tagColor: '#FFFFFF',
    icon: '🍗',
    title: 'Chicken Special',
    subtitle: 'Spiced Campus Recipe',
  },
  'veg-curries': {
    bgStart: '#FFFBEB',
    bgEnd: '#FEF3C7',
    accent: '#D97706',
    plateColor: '#FFFFFF',
    plateBorder: '#FDE68A',
    tagBg: '#B45309',
    tagColor: '#FFFFFF',
    icon: '🥘',
    title: 'Veg Curries',
    subtitle: 'Fresh Paneer & Vegetable Delights',
  },
  'fried-rice': {
    bgStart: '#FFF7ED',
    bgEnd: '#FED7AA',
    accent: '#EA580C',
    plateColor: '#FFFFFF',
    plateBorder: '#FDBA74',
    tagBg: '#9A3412',
    tagColor: '#FFFFFF',
    icon: '🍚',
    title: 'Wok Fried Rice',
    subtitle: 'Tossed Hot with Spices',
  },
  noodles: {
    bgStart: '#FEFCE8',
    bgEnd: '#FEF08A',
    accent: '#CA8A04',
    plateColor: '#FFFFFF',
    plateBorder: '#FDE047',
    tagBg: '#854D0E',
    tagColor: '#FFFFFF',
    icon: '🍜',
    title: 'Hakka Noodles',
    subtitle: 'Freshly Wok-Stirred',
  },
  'egg-items': {
    bgStart: '#FFFBEB',
    bgEnd: '#FDE68A',
    accent: '#D97706',
    plateColor: '#FFFFFF',
    plateBorder: '#FCD34D',
    tagBg: '#78350F',
    tagColor: '#FFFFFF',
    icon: '🍳',
    title: 'Egg Delights',
    subtitle: 'Farm Fresh Campus Preparation',
  },
  pizza: {
    bgStart: '#FFF1F2',
    bgEnd: '#FFE4E6',
    accent: '#E11D48',
    plateColor: '#FFFFFF',
    plateBorder: '#FDA4AF',
    tagBg: '#9F1239',
    tagColor: '#FFFFFF',
    icon: '🍕',
    title: 'Campus Pizza',
    subtitle: 'Baked Golden with Cheese',
  },
  'fast-food': {
    bgStart: '#FEF3C7',
    bgEnd: '#FDE68A',
    accent: '#D97706',
    plateColor: '#FFFFFF',
    plateBorder: '#FCD34D',
    tagBg: '#78350F',
    tagColor: '#FFFFFF',
    icon: '🍔',
    title: 'Fast Food',
    subtitle: 'Burgers, Fries & Quick Bites',
  },
  'chicken-rolls': {
    bgStart: '#FFF7ED',
    bgEnd: '#FFEDD5',
    accent: '#EA580C',
    plateColor: '#FFFFFF',
    plateBorder: '#FDBA74',
    tagBg: '#C2410C',
    tagColor: '#FFFFFF',
    icon: '🌯',
    title: 'Kathi Rolls',
    subtitle: 'Flaky Paratha Wrap',
  },
  snacks: {
    bgStart: '#FFFBEB',
    bgEnd: '#FEF3C7',
    accent: '#D97706',
    plateColor: '#FFFFFF',
    plateBorder: '#FDE68A',
    tagBg: '#92400E',
    tagColor: '#FFFFFF',
    icon: '🥟',
    title: 'Snacks & Bites',
    subtitle: 'Crispy Evening Refreshments',
  },
  'snacks-beverages': {
    bgStart: '#FFFBEB',
    bgEnd: '#FEF3C7',
    accent: '#B45309',
    plateColor: '#FFFFFF',
    plateBorder: '#FDE68A',
    tagBg: '#78350F',
    tagColor: '#FFFFFF',
    icon: '☕',
    title: 'Beverages & Snacks',
    subtitle: 'Hot Filter Coffee & Tea',
  },
};

const DEFAULT_THEME: FoodTheme = {
  bgStart: '#FFF7ED',
  bgEnd: '#FFEDD5',
  accent: '#FF6B00',
  plateColor: '#FFFFFF',
  plateBorder: '#FED7AA',
  tagBg: '#151515',
  tagColor: '#FFFFFF',
  icon: '🍽️',
  title: 'Campus Food',
  subtitle: 'Fresh Counter Preparation',
};

/**
 * Returns a self-contained, 100% offline-ready SVG Data URI
 * that requires ZERO network calls and cannot be blocked by campus firewalls.
 */
export function getFoodIllustrationDataUri(
  categoryId?: string,
  title?: string,
  subtitle?: string
): string {
  const normCat = (categoryId || '').toLowerCase().trim();
  const theme = THEMES[normCat] || DEFAULT_THEME;

  const displayTitle = (title || theme.title).replace(/[<>&"]/g, '');
  const displaySubtitle = (subtitle || theme.subtitle).replace(/[<>&"]/g, '');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.bgStart}"/>
      <stop offset="100%" stop-color="${theme.bgEnd}"/>
    </linearGradient>
    <linearGradient id="plateGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#f8fafc"/>
    </linearGradient>
    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="12" flood-color="rgba(0,0,0,0.08)"/>
    </filter>
  </defs>

  <!-- Background Canvas -->
  <rect width="400" height="300" fill="url(#bgGrad)"/>

  <!-- Decorative Pattern Rings -->
  <circle cx="200" cy="135" r="125" fill="none" stroke="${theme.plateBorder}" stroke-width="1.5" stroke-dasharray="6 6" opacity="0.6"/>

  <!-- Ceramic Serving Plate with Soft Shadow -->
  <circle cx="200" cy="135" r="96" fill="url(#plateGrad)" stroke="${theme.plateBorder}" stroke-width="2" filter="url(#softGlow)"/>
  <circle cx="200" cy="135" r="82" fill="none" stroke="${theme.accent}" stroke-width="1.5" stroke-dasharray="3 3" opacity="0.5"/>

  <!-- Appetizing Center Food Icon -->
  <text x="200" y="142" font-size="64" text-anchor="middle" dominant-baseline="central">${theme.icon}</text>

  <!-- Bottom Frosted Pill Tag -->
  <rect x="30" y="235" width="340" height="46" rx="23" fill="${theme.tagBg}" filter="url(#softGlow)"/>
  <text x="200" y="254" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="13" fill="${theme.tagColor}" text-anchor="middle" letter-spacing="0.3">${displayTitle}</text>
  <text x="200" y="270" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="600" font-size="10.5" fill="${theme.bgEnd}" text-anchor="middle" opacity="0.95">${displaySubtitle}</text>
</svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
