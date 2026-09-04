export interface PricingSettings {
  printRates: {
    bw_single: number;
    bw_double: number;
    color_single: number;
    color_double: number;
  };
  bindingFees: {
    none: number;
    spiral: number;
    soft_bound: number;
    hard_bound: number;
  };
  defaultDeliveryFee: number;
}

export interface ManualPriceConfig {
  pages: number;
  print_type: 'Black & White' | 'Color';
  print_side: 'Single Side' | 'Double Side';
  binding_type: 'None' | 'Spiral' | 'Soft Bound' | 'Hard Bound';
  quantity: number;
  price_override?: number | null;
  delivery_override?: number | null;
}

export const DEFAULT_PRICING_SETTINGS: PricingSettings = {
  printRates: {
    bw_single: 1.0,
    bw_double: 1.5,
    color_single: 5.0,
    color_double: 8.0
  },
  bindingFees: {
    none: 0,
    spiral: 30.0,
    soft_bound: 50.0,
    hard_bound: 100.0
  },
  defaultDeliveryFee: 40.0
};

export class PricingService {
  private settings: PricingSettings;

  constructor(settings?: PricingSettings) {
    this.settings = settings || DEFAULT_PRICING_SETTINGS;
  }

  public getPrintRate(type: 'Black & White' | 'Color', side: 'Single Side' | 'Double Side'): number {
    if (type === 'Black & White') {
      return side === 'Single Side' ? this.settings.printRates.bw_single : this.settings.printRates.bw_double;
    } else {
      return side === 'Single Side' ? this.settings.printRates.color_single : this.settings.printRates.color_double;
    }
  }

  public getBindingFee(type: 'None' | 'Spiral' | 'Soft Bound' | 'Hard Bound'): number {
    switch (type) {
      case 'Spiral': return this.settings.bindingFees.spiral;
      case 'Soft Bound': return this.settings.bindingFees.soft_bound;
      case 'Hard Bound': return this.settings.bindingFees.hard_bound;
      default: return this.settings.bindingFees.none;
    }
  }

  public calculate(config: ManualPriceConfig) {
    const { pages, print_type, print_side, binding_type, quantity, price_override, delivery_override } = config;
    
    // Per-copy calculations
    const printRate = this.getPrintRate(print_type, print_side);
    const printingAmount = Math.ceil(pages / (print_side === 'Double Side' ? 2 : 1)) * printRate;
    const bindingFee = this.getBindingFee(binding_type);
    
    // Base unit price per manual
    let unitPrice = printingAmount + bindingFee;

    // Apply manual override for price if specified
    if (price_override !== undefined && price_override !== null) {
      unitPrice = price_override;
    }

    // Item total
    const itemTotal = unitPrice * quantity;

    // Delivery fee (usually per order, but represented here for display)
    const deliveryFee = (delivery_override !== undefined && delivery_override !== null)
      ? delivery_override
      : this.settings.defaultDeliveryFee;

    const finalTotal = itemTotal + deliveryFee;

    return {
      unitPrice,
      printingAmount,
      bindingFee,
      itemTotal,
      deliveryFee,
      finalTotal,
      isOverridden: price_override !== undefined && price_override !== null
    };
  }
}
