import { FoodCategory } from '../types';

export const FOOD_CATEGORIES: FoodCategory[] = [
  {
    id: 'all',
    label: 'All Items',
    image: '/images/food/chopsticks_cover.webp',
  },
  {
    id: 'biryani',
    label: 'Biryani',
    image: '/images/food/chicken_dum_biryani.jpg',
  },
  {
    id: 'fried-rice',
    label: 'Fried Rice',
    image: '/images/food/chicken_fried_rice.jpg',
  },
  {
    id: 'noodles',
    label: 'Noodles',
    image: '/images/food/chicken_noodles.jpg',
  },
  {
    id: 'starters',
    label: 'Starters & Manchurian',
    image: '/images/food/chicken_65.jpg',
  },
];

export const VENDORS_CONFIG = {
  CHOPSTICKS: {
    id: 'vendor_canteen_stall',
    name: 'CHOPSTICKS',
    shortName: 'CHOPSTICKS',
    counterLocation: 'Chopsticks Counter (Main Food Court)',
    badgeText: 'CHOPSTICKS',
    pickupInstructions: 'Pick up at the Chopsticks Counter in the Main Food Court. Present your pickup token.',
    coverImage: '/images/food/chopsticks_cover.webp',
    description: 'Fast food & authentic biryanis, fried rice, noodles and sizzling starters.'
  },
  RCE_MESS: {
    id: 'vendor_college_mess',
    name: 'RCE MESS',
    shortName: 'RCE MESS',
    counterLocation: 'RCE Mess Dining Hall Counter',
    badgeText: 'RCE MESS',
    pickupInstructions: 'Pick up at the RCE Mess Serving Counter in Dining Hall. Present your meal coupon / token.',
    coverImage: '/images/food/rce_mess_cover.webp',
    description: 'Official College Mess serving wholesome traditional South Indian meals and daily specials.'
  },
  // Backwards compatible aliases
  CANTEEN_STALL: {
    id: 'vendor_canteen_stall',
    name: 'CHOPSTICKS',
    shortName: 'CHOPSTICKS',
    counterLocation: 'Chopsticks Counter (Main Food Court)',
    badgeText: 'CHOPSTICKS',
    pickupInstructions: 'Pick up at the Chopsticks Counter in the Main Food Court. Present your pickup token.',
  },
  COLLEGE_MESS: {
    id: 'vendor_college_mess',
    name: 'RCE MESS',
    shortName: 'RCE MESS',
    counterLocation: 'RCE Mess Dining Hall Counter',
    badgeText: 'RCE MESS',
    pickupInstructions: 'Pick up at the RCE Mess Serving Counter in Dining Hall. Present your meal coupon / token.',
  },
} as const;
