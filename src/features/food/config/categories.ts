import { FoodCategory } from '../types';

export const FOOD_CATEGORIES: FoodCategory[] = [
  {
    id: 'all',
    label: 'All Foods',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=180&h=180&q=80',
  },
  {
    id: 'breakfast',
    label: 'Breakfast',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=180&h=180&q=80',
  },
  {
    id: 'meals',
    label: 'Meals',
    image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=180&h=180&q=80',
  },
  {
    id: 'veg-curries',
    label: 'Veg Curries',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=180&h=180&q=80',
  },
  {
    id: 'chicken-curries',
    label: 'Chicken Curries',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=180&h=180&q=80',
  },
  {
    id: 'fried-rice',
    label: 'Fried Rice',
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=180&h=180&q=80',
  },
  {
    id: 'egg-items',
    label: 'Egg Items',
    image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=180&h=180&q=80',
  },
  {
    id: 'noodles',
    label: 'Noodles',
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=180&h=180&q=80',
  },
  {
    id: 'pizza',
    label: 'Pizza',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=180&h=180&q=80',
  },
  {
    id: 'chicken-rolls',
    label: 'Chicken Rolls',
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=180&h=180&q=80',
  },
  {
    id: 'fast-food',
    label: 'Fast Food',
    image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=180&h=180&q=80',
  },
  {
    id: 'snacks',
    label: 'Snacks',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=180&h=180&q=80',
  },
];

export const VENDORS_CONFIG = {
  CANTEEN_STALL: {
    id: 'vendor_canteen_stall',
    name: 'Campus Canteen Fast Food & Rolls',
    shortName: 'Canteen Stall',
    counterLocation: 'Counter 1 (Main Canteen)',
    badgeText: 'Canteen Counter 1',
    pickupInstructions: 'Pick up at Counter 1 inside the Student Canteen. Present your token number.',
  },
  COLLEGE_MESS: {
    id: 'vendor_college_mess',
    name: 'College Mess & Dining Hall',
    shortName: 'College Mess',
    counterLocation: 'Dining Hall Mess Counter',
    badgeText: 'Mess Dining Counter',
    pickupInstructions: 'Pick up at the College Mess Serving Counter. Show your token on screen.',
  },
} as const;
