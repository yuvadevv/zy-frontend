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
  CHECKOUT: '/app/checkout',
  ORDERS: {
    LIST: '/app/orders',
    DETAILS: (id: string) => `/app/orders/${id}`
  }
} as const;

// Force rebuild
