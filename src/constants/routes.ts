export const APP_ROUTES = {
  HOME: '/app/home',
  SERVICES: {
    HUB: '/app/services',
    MANUALS: '/app/services/manuals',
    HALL_TICKETS: '/app/services/hall-tickets',
    UPLOAD_PDF: '/app/services/upload',
    XEROX: '/app/services/xerox',
  },
  MANUALS_WORKFLOW: {
    FIND: '/app/services/manuals/find',
    CHOOSE: '/app/services/manuals/choose',
    MANUAL_LIST: '/app/services/manuals/list',
    OPTIONS: '/app/services/manuals/options',
    REVIEW: '/app/services/manuals/review',
  },
  CART: '/app/cart',
  OFFERS: '/app/offers',
  CAMPUS_FEST: '/app/campus-fest',
  REFER: '/app/refer',
  LEADERBOARD: '/app/leaderboard',
  AMBASSADOR: '/app/campus-fest/ambassador',
  FOOD: {
    LANDING: '/app/campus-food',
    STALL: '/app/campus-food/stall',
    MESS: '/app/campus-food/mess',
    PRODUCT_DETAIL: (id: string) => `/app/campus-food/${id}`,
    CART: '/app/campus-food/cart',
    CHECKOUT: '/app/campus-food/checkout',
    ORDER_CONFIRMATION: (id: string) => `/app/campus-food/orders/${id}`,
  },
  CAMPUS_FOOD: '/app/campus-food',
  CAMPUS_FOOD_MESS: '/app/campus-food/mess',
  CHECKOUT: '/app/checkout',
  ORDERS: {
    LIST: '/app/orders',
    DETAILS: (id: string) => `/app/orders/${id}`
  }
} as const;

// Force rebuild
