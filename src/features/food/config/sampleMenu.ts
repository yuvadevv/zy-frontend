import { FoodProduct } from '../types';
import { VENDORS_CONFIG } from './categories';

export const SAMPLE_FOOD_MENU: FoodProduct[] = [
  // 1. Breakfast (Campus Canteen)
  {
    id: 'food_bf_01',
    name: 'Special Ghee Sambar Idli (2 pcs)',
    description: 'Steamed rice idlis dipped in hot aromatic sambar with coconut chutney and podi.',
    price: 35,
    categoryId: 'breakfast',
    vendorId: VENDORS_CONFIG.CANTEEN_STALL.id,
    vendorName: VENDORS_CONFIG.CANTEEN_STALL.name,
    counterLocation: VENDORS_CONFIG.CANTEEN_STALL.counterLocation,
    dietary: 'veg',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isPopular: true,
  },
  {
    id: 'food_bf_02',
    name: 'Crispy Masala Dosa',
    description: 'Golden roasted fermented crepe rolled with spiced potato bhaji and fresh chutneys.',
    price: 50,
    categoryId: 'breakfast',
    vendorId: VENDORS_CONFIG.CANTEEN_STALL.id,
    vendorName: VENDORS_CONFIG.CANTEEN_STALL.name,
    counterLocation: VENDORS_CONFIG.CANTEEN_STALL.counterLocation,
    dietary: 'veg',
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isPopular: true,
  },
  {
    id: 'food_bf_03',
    name: 'Poori with Potato Masala (2 pcs)',
    description: 'Hot puffed whole wheat pooris served with mild spiced onion-potato sagu.',
    price: 45,
    categoryId: 'breakfast',
    vendorId: VENDORS_CONFIG.CANTEEN_STALL.id,
    vendorName: VENDORS_CONFIG.CANTEEN_STALL.name,
    counterLocation: VENDORS_CONFIG.CANTEEN_STALL.counterLocation,
    dietary: 'veg',
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isPopular: false,
  },

  // 2. Meals (College Mess & Canteen)
  {
    id: 'food_vm_01',
    name: 'Special South Indian Meals Plate',
    description: 'Steamed rice, sambar, rasam, curd, seasonal veg curry, papad and pickle.',
    price: 80,
    categoryId: 'meals',
    vendorId: VENDORS_CONFIG.COLLEGE_MESS.id,
    vendorName: VENDORS_CONFIG.COLLEGE_MESS.name,
    counterLocation: VENDORS_CONFIG.COLLEGE_MESS.counterLocation,
    dietary: 'veg',
    image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isPopular: true,
    isMeal: true,
  },
  {
    id: 'food_vm_02',
    name: 'North Indian Mini Thali',
    description: '2 Phulkas, Paneer Butter Masala, steamed rice, dal fry, salad and pickle.',
    price: 95,
    categoryId: 'meals',
    vendorId: VENDORS_CONFIG.COLLEGE_MESS.id,
    vendorName: VENDORS_CONFIG.COLLEGE_MESS.name,
    counterLocation: VENDORS_CONFIG.COLLEGE_MESS.counterLocation,
    dietary: 'veg',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isPopular: false,
    isMeal: true,
  },

  // 3. Veg Curries
  {
    id: 'food_vc_01',
    name: 'Paneer Butter Masala',
    description: 'Fresh cottage cheese cubes simmered in a mildly spiced, rich tomato butter gravy.',
    price: 110,
    categoryId: 'veg-curries',
    vendorId: VENDORS_CONFIG.CANTEEN_STALL.id,
    vendorName: VENDORS_CONFIG.CANTEEN_STALL.name,
    counterLocation: VENDORS_CONFIG.CANTEEN_STALL.counterLocation,
    dietary: 'veg',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isPopular: true,
  },
  {
    id: 'food_vc_02',
    name: 'Kadai Mushroom Curry',
    description: 'Tender mushrooms tossed with crisp capsicum, onions and freshly ground kadai spices.',
    price: 100,
    categoryId: 'veg-curries',
    vendorId: VENDORS_CONFIG.CANTEEN_STALL.id,
    vendorName: VENDORS_CONFIG.CANTEEN_STALL.name,
    counterLocation: VENDORS_CONFIG.CANTEEN_STALL.counterLocation,
    dietary: 'veg',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isPopular: false,
  },

  // 4. Chicken Curries
  {
    id: 'food_cc_01',
    name: 'Andhra Style Chicken Curry',
    description: 'Traditional home-style chicken curry simmered with roasted spices and curry leaves.',
    price: 120,
    categoryId: 'chicken-curries',
    vendorId: VENDORS_CONFIG.COLLEGE_MESS.id,
    vendorName: VENDORS_CONFIG.COLLEGE_MESS.name,
    counterLocation: VENDORS_CONFIG.COLLEGE_MESS.counterLocation,
    dietary: 'non-veg',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isPopular: true,
  },
  {
    id: 'food_cc_02',
    name: 'Butter Chicken Gravy',
    description: 'Boneless chicken chunks in a smooth, sweet and savoury creamy makhani sauce.',
    price: 135,
    categoryId: 'chicken-curries',
    vendorId: VENDORS_CONFIG.CANTEEN_STALL.id,
    vendorName: VENDORS_CONFIG.CANTEEN_STALL.name,
    counterLocation: VENDORS_CONFIG.CANTEEN_STALL.counterLocation,
    dietary: 'non-veg',
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isPopular: false,
  },

  // 5. Fried Rice
  {
    id: 'food_fr_01',
    name: 'Veg Fried Rice',
    description: 'Wok-tossed long grain basmati rice with crunchy carrots, beans, cabbage and spring onions.',
    price: 70,
    categoryId: 'fried-rice',
    vendorId: VENDORS_CONFIG.CANTEEN_STALL.id,
    vendorName: VENDORS_CONFIG.CANTEEN_STALL.name,
    counterLocation: VENDORS_CONFIG.CANTEEN_STALL.counterLocation,
    dietary: 'veg',
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isPopular: true,
  },
  {
    id: 'food_fr_02',
    name: 'Chicken Fried Rice',
    description: 'Hot wok-tossed rice tossed with shredded chicken pieces, scrambled egg, and Asian sauces.',
    price: 95,
    categoryId: 'fried-rice',
    vendorId: VENDORS_CONFIG.CANTEEN_STALL.id,
    vendorName: VENDORS_CONFIG.CANTEEN_STALL.name,
    counterLocation: VENDORS_CONFIG.CANTEEN_STALL.counterLocation,
    dietary: 'non-veg',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isPopular: true,
  },

  // 6. Egg Items
  {
    id: 'food_egg_01',
    name: 'Egg Fried Rice',
    description: 'Fluffy double-egg scramble tossed with aromatic basmati rice and mild pepper spices.',
    price: 80,
    categoryId: 'egg-items',
    vendorId: VENDORS_CONFIG.CANTEEN_STALL.id,
    vendorName: VENDORS_CONFIG.CANTEEN_STALL.name,
    counterLocation: VENDORS_CONFIG.CANTEEN_STALL.counterLocation,
    dietary: 'egg',
    image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isPopular: false,
  },
  {
    id: 'food_egg_02',
    name: 'Double Egg Masala Omelette',
    description: 'Whisked farm fresh eggs with chopped onions, green chillies, coriander and toasted bread slices.',
    price: 45,
    categoryId: 'egg-items',
    vendorId: VENDORS_CONFIG.CANTEEN_STALL.id,
    vendorName: VENDORS_CONFIG.CANTEEN_STALL.name,
    counterLocation: VENDORS_CONFIG.CANTEEN_STALL.counterLocation,
    dietary: 'egg',
    image: 'https://images.unsplash.com/photo-1510693206972-df098062cb71?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isPopular: false,
  },

  // 7. Noodles
  {
    id: 'food_nd_01',
    name: 'Veg Hakka Noodles',
    description: 'Stir-fried noodles with julienned vegetables, soy sauce and gentle touch of white pepper.',
    price: 70,
    categoryId: 'noodles',
    vendorId: VENDORS_CONFIG.CANTEEN_STALL.id,
    vendorName: VENDORS_CONFIG.CANTEEN_STALL.name,
    counterLocation: VENDORS_CONFIG.CANTEEN_STALL.counterLocation,
    dietary: 'veg',
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isPopular: true,
  },
  {
    id: 'food_nd_02',
    name: 'Schezwan Chicken Noodles',
    description: 'Spicy wok noodles tossed with diced chicken and house-made tangy Schezwan paste.',
    price: 100,
    categoryId: 'noodles',
    vendorId: VENDORS_CONFIG.CANTEEN_STALL.id,
    vendorName: VENDORS_CONFIG.CANTEEN_STALL.name,
    counterLocation: VENDORS_CONFIG.CANTEEN_STALL.counterLocation,
    dietary: 'non-veg',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isPopular: false,
  },

  // 8. Pizza
  {
    id: 'food_pz_01',
    name: 'Classic Margherita Pizza (7-inch)',
    description: 'Hand-stretched personal crust topped with herb tomato sauce and melted mozzarella cheese.',
    price: 99,
    categoryId: 'pizza',
    vendorId: VENDORS_CONFIG.CANTEEN_STALL.id,
    vendorName: VENDORS_CONFIG.CANTEEN_STALL.name,
    counterLocation: VENDORS_CONFIG.CANTEEN_STALL.counterLocation,
    dietary: 'veg',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isPopular: true,
  },
  {
    id: 'food_pz_02',
    name: 'Corn & Paneer Feast Pizza (7-inch)',
    description: 'Loaded with sweet golden corn, spiced paneer cubes and extra cheese on crispy crust.',
    price: 129,
    categoryId: 'pizza',
    vendorId: VENDORS_CONFIG.CANTEEN_STALL.id,
    vendorName: VENDORS_CONFIG.CANTEEN_STALL.name,
    counterLocation: VENDORS_CONFIG.CANTEEN_STALL.counterLocation,
    dietary: 'veg',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isPopular: false,
  },

  // 9. Chicken Rolls
  {
    id: 'food_cr_01',
    name: 'Chicken Shawarma Kathi Roll',
    description: 'Juicy spiced chicken strips wrapped in a freshly toasted paratha with pickled onions and mint mayo.',
    price: 80,
    categoryId: 'chicken-rolls',
    vendorId: VENDORS_CONFIG.CANTEEN_STALL.id,
    vendorName: VENDORS_CONFIG.CANTEEN_STALL.name,
    counterLocation: VENDORS_CONFIG.CANTEEN_STALL.counterLocation,
    dietary: 'non-veg',
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isPopular: true,
  },
  {
    id: 'food_cr_02',
    name: 'Egg & Chicken Double Roll',
    description: 'Layered paratha lined with whipped egg and stuffed with tender chicken roast filling.',
    price: 95,
    categoryId: 'chicken-rolls',
    vendorId: VENDORS_CONFIG.CANTEEN_STALL.id,
    vendorName: VENDORS_CONFIG.CANTEEN_STALL.name,
    counterLocation: VENDORS_CONFIG.CANTEEN_STALL.counterLocation,
    dietary: 'non-veg',
    image: 'https://images.unsplash.com/photo-1644364935906-6098cf3c7219?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isPopular: false,
  },

  // 10. Fast Food
  {
    id: 'food_cff_01',
    name: 'Crispy Chicken Wings (4 pcs)',
    description: 'Golden fried crispy chicken wings served with hot garlic dipping dip.',
    price: 110,
    categoryId: 'fast-food',
    vendorId: VENDORS_CONFIG.CANTEEN_STALL.id,
    vendorName: VENDORS_CONFIG.CANTEEN_STALL.name,
    counterLocation: VENDORS_CONFIG.CANTEEN_STALL.counterLocation,
    dietary: 'non-veg',
    image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isPopular: true,
  },
  {
    id: 'food_cff_02',
    name: 'Chicken Popcorn Bucket',
    description: 'Bite-sized seasoned chicken tenders fried to a crispy golden brown with peri-peri seasoning.',
    price: 85,
    categoryId: 'fast-food',
    vendorId: VENDORS_CONFIG.CANTEEN_STALL.id,
    vendorName: VENDORS_CONFIG.CANTEEN_STALL.name,
    counterLocation: VENDORS_CONFIG.CANTEEN_STALL.counterLocation,
    dietary: 'non-veg',
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isPopular: false,
  },

  // 11. Snacks & Beverages
  {
    id: 'food_sb_01',
    name: 'Crispy Veg Samosa (2 pcs)',
    description: 'Crispy flaky crust stuffed with spicy potato and green peas, served with mint chutney.',
    price: 30,
    categoryId: 'snacks-beverages',
    vendorId: VENDORS_CONFIG.CANTEEN_STALL.id,
    vendorName: VENDORS_CONFIG.CANTEEN_STALL.name,
    counterLocation: VENDORS_CONFIG.CANTEEN_STALL.counterLocation,
    dietary: 'veg',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isPopular: true,
  },
  {
    id: 'food_sb_02',
    name: 'Hot Filter Coffee',
    description: 'Freshly brewed aromatic South Indian chicory blend coffee with frothy whole milk.',
    price: 20,
    categoryId: 'snacks-beverages',
    vendorId: VENDORS_CONFIG.CANTEEN_STALL.id,
    vendorName: VENDORS_CONFIG.CANTEEN_STALL.name,
    counterLocation: VENDORS_CONFIG.CANTEEN_STALL.counterLocation,
    dietary: 'veg',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isPopular: false,
  },
  {
    id: 'food_sb_03',
    name: 'Chilled Mango Lassi',
    description: 'Thick creamy yogurt blended with sweet mango pulp, served chilled.',
    price: 40,
    categoryId: 'snacks-beverages',
    vendorId: VENDORS_CONFIG.CANTEEN_STALL.id,
    vendorName: VENDORS_CONFIG.CANTEEN_STALL.name,
    counterLocation: VENDORS_CONFIG.CANTEEN_STALL.counterLocation,
    dietary: 'veg',
    image: 'https://images.unsplash.com/photo-1528751014936-863e6e7a319c?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isPopular: false,
  },
];

export const getFoodProductById = (id: string): FoodProduct | undefined => {
  return SAMPLE_FOOD_MENU.find((p) => p.id === id);
};

export const getProductFallbackImage = (productId?: string, categoryId?: string): string => {
  if (productId) {
    const found = SAMPLE_FOOD_MENU.find((p) => p.id === productId);
    if (found?.image && found.image.trim()) {
      return found.image;
    }
  }

  switch (categoryId) {
    case 'breakfast':
      return 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80';
    case 'meals':
    case 'veg-meals':
      return 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=600&q=80';
    case 'chicken-curries':
      return 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80';
    case 'veg-curries':
      return 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80';
    case 'fried-rice':
      return 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=600&q=80';
    case 'noodles':
      return 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80';
    case 'egg-items':
      return 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=600&q=80';
    case 'pizza':
    case 'fast-food':
      return 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80';
    case 'chicken-rolls':
      return 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80';
    case 'snacks':
    case 'snacks-beverages':
      return 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80';
    default:
      return 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80';
  }
};
