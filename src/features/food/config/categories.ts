import { FoodCategory } from '../types';
import { getFoodIllustrationDataUri } from '../utils/foodIllustrations';

export const FOOD_CATEGORIES: FoodCategory[] = [
  {
    id: 'all',
    label: 'All Foods',
    image: getFoodIllustrationDataUri('all', 'All Foods'),
  },
  {
    id: 'breakfast',
    label: 'Breakfast',
    image: getFoodIllustrationDataUri('breakfast', 'Breakfast'),
  },
  {
    id: 'meals',
    label: 'Meals',
    image: getFoodIllustrationDataUri('meals', 'Meals'),
  },
  {
    id: 'veg-curries',
    label: 'Veg Curries',
    image: getFoodIllustrationDataUri('veg-curries', 'Veg Curries'),
  },
  {
    id: 'chicken-curries',
    label: 'Chicken Curries',
    image: getFoodIllustrationDataUri('chicken-curries', 'Chicken Curries'),
  },
  {
    id: 'fried-rice',
    label: 'Fried Rice',
    image: getFoodIllustrationDataUri('fried-rice', 'Fried Rice'),
  },
  {
    id: 'egg-items',
    label: 'Egg Items',
    image: getFoodIllustrationDataUri('egg-items', 'Egg Items'),
  },
  {
    id: 'noodles',
    label: 'Noodles',
    image: getFoodIllustrationDataUri('noodles', 'Noodles'),
  },
  {
    id: 'pizza',
    label: 'Pizza',
    image: getFoodIllustrationDataUri('pizza', 'Pizza'),
  },
  {
    id: 'chicken-rolls',
    label: 'Chicken Rolls',
    image: getFoodIllustrationDataUri('chicken-rolls', 'Chicken Rolls'),
  },
  {
    id: 'fast-food',
    label: 'Fast Food',
    image: getFoodIllustrationDataUri('fast-food', 'Fast Food'),
  },
  {
    id: 'snacks',
    label: 'Snacks',
    image: getFoodIllustrationDataUri('snacks', 'Snacks'),
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
