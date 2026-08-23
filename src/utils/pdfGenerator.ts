import { PDFDocument, rgb, StandardFonts, PDFPage, PDFFont } from 'pdf-lib';

// Color Palette
const COLORS = {
  primary: rgb(1.0, 0.42, 0.0), // #FF6B00
  textDark: rgb(0.067, 0.094, 0.153), // #111827
  textMuted: rgb(0.42, 0.447, 0.502), // #6B7280
  border: rgb(0.898, 0.906, 0.922), // #E5E7EB
  white: rgb(1, 1, 1),
};

const formatCurrency = (amount: number) => {
  return `Rs. ${Number(amount).toFixed(2)}`;
};

class InvoiceGenerator {
  private pdfDoc!: PDFDocument;
  private page!: PDFPage;
  private fontRegular!: PDFFont;
  private fontBold!: PDFFont;
  
  private margin = 50;
  private width = 595.28; // A4 width
  private height = 841.89; // A4 height
  private y = 0;
  private pageNumber = 1;

  public async generate(orderData: any, supportConfig: any) {
    if (!orderData || !orderData.order) {
      throw new Error("Some order details could not be verified. Please try again or contact BLINTZY Support.");
    }

    const { order, items } = orderData;
    
    if (!order.public_id) {
      throw new Error("Order ID is missing. Unable to generate invoice.");
    }
    
    if (!items || items.length === 0) {
      throw new Error("No items found in this order. Unable to generate invoice.");
    }
    
    if (order.grand_total === undefined || order.grand_total === null) {
      throw new Error("Order total could not be verified. Unable to generate invoice.");
    }

    this.pdfDoc = await PDFDocument.create();
    this.fontRegular = await this.pdfDoc.embedFont(StandardFonts.Helvetica);
    this.fontBold = await this.pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    this.addPage();
    
    this.drawHeader(order);
    this.drawBusinessDetails(supportConfig);
    this.drawBillTo(order);
    this.y -= 20; // Extra gap before items
    
    this.drawItemsTable(items);
    this.drawTotals(order);
    
    this.drawPayment(order);
    this.drawDelivery(order);
    this.drawPolicy();
    this.drawSupport(supportConfig);
    this.drawAuthenticity(order.public_id);
    
    this.drawFooters(order.public_id);

    const pdfBytes = await this.pdfDoc.save();
    const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `BLINTZY-Invoice-${order.public_id}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    URL.revokeObjectURL(url);
  }
  
  private addPage() {
    this.page = this.pdfDoc.addPage([this.width, this.height]);
    this.y = this.height - this.margin;
    if (this.pdfDoc.getPageCount() > 1) {
      this.pageNumber++;
    }
  }

  private checkPageBreak(requiredSpace: number) {
    if (this.y - requiredSpace < this.margin + 40) { // 40 for footer margin
      this.addPage();
      return true;
    }
    return false;
  }

  private drawText(text: string, x: number, size: number, isBold: boolean, color = COLORS.textDark) {
    this.page.drawText(String(text), {
      x,
      y: this.y,
      size,
      font: isBold ? this.fontBold : this.fontRegular,
      color,
    });
  }

  private drawHeader(order: any) {
    // Left: Branding
    this.drawText('BLINTZY', this.margin, 24, true, COLORS.primary);
    this.y -= 14;
    this.drawText('Smart Printing • Campus Delivery', this.margin, 10, false, COLORS.textMuted);
    
    // Right: Invoice Meta
    this.y += 14; // Reset Y to top for right column
    const rightAlign = this.width - this.margin - 150;
    
    this.drawText('INVOICE', rightAlign, 20, true, COLORS.textDark);
    this.y -= 18;
    
    this.drawText(`Invoice No:`, rightAlign, 9, false, COLORS.textMuted);
    this.drawText(`BLZ-INV-${order.public_id}`, rightAlign + 55, 9, true, COLORS.textDark);
    this.y -= 14;
    
    this.drawText(`Order ID:`, rightAlign, 9, false, COLORS.textMuted);
    this.drawText(order.public_id, rightAlign + 55, 9, true, COLORS.textDark);
    this.y -= 14;
    
    const dateStr = order.created_at ? new Date(order.created_at).toLocaleDateString() : '';
    this.drawText(`Order Date:`, rightAlign, 9, false, COLORS.textMuted);
    this.drawText(dateStr, rightAlign + 55, 9, true, COLORS.textDark);
    this.y -= 14;
    
    this.drawText(`Status:`, rightAlign, 9, false, COLORS.textMuted);
    const statusColor = (order.status === 'delivered' || order.status === 'paid' || order.status === 'accepted') ? rgb(0.1, 0.6, 0.1) : COLORS.textDark;
    this.drawText((order.status || 'PENDING').toUpperCase(), rightAlign + 55, 9, true, statusColor);
    
    this.y -= 30;
    this.drawLine(this.margin, this.width - this.margin, this.y, COLORS.border);
    this.y -= 20;
  }

  private drawBusinessDetails(supportConfig: any) {
    this.drawText('FROM', this.margin, 10, true, COLORS.textMuted);
    this.y -= 14;
    this.drawText('BLINTZY', this.margin, 10, true, COLORS.textDark);
    this.y -= 12;
    
    if (supportConfig?.supportEmail) {
      this.drawText(supportConfig.supportEmail, this.margin, 9, false, COLORS.textDark);
      this.y -= 12;
    }
    if (supportConfig?.supportPhone) {
      this.drawText(`+${supportConfig.supportPhone}`, this.margin, 9, false, COLORS.textDark);
      this.y -= 12;
    }
    
    // Reset Y for Bill To column to align with "FROM"
    this.y += 38 + (supportConfig?.supportEmail ? 12 : 0) + (supportConfig?.supportPhone ? 12 : 0);
  }

  private drawBillTo(order: any) {
    const leftAlign = this.margin + 200;
    
    this.drawText('BILL TO', leftAlign, 10, true, COLORS.textMuted);
    this.y -= 14;
    
    if (order.student_name) {
      this.drawText(order.student_name, leftAlign, 10, true, COLORS.textDark);
      this.y -= 14;
    }
    
    const addField = (label: string, value: string) => {
      if (value) {
        this.drawText(`${label}:`, leftAlign, 9, false, COLORS.textMuted);
        this.drawText(value, leftAlign + 45, 9, true, COLORS.textDark);
        this.y -= 12;
      }
    };
    
    addField('Roll No', order.roll_number);
    addField('Branch', order.branch_name);
    addField('Year', order.study_year);
    addField('College', order.college);
    
    // Ensure Y is moved down past whichever column was longer
    this.y -= 10;
    this.drawLine(this.margin, this.width - this.margin, this.y, COLORS.border);
    this.y -= 20;
  }

  private drawItemsTable(items: any[]) {
    this.drawText('ORDER ITEMS', this.margin, 10, true, COLORS.textMuted);
    this.y -= 15;
    
    // Table Header
    this.page.drawRectangle({
      x: this.margin,
      y: this.y - 12,
      width: this.width - (this.margin * 2),
      height: 20,
      color: rgb(0.97, 0.97, 0.98),
    });
    
    this.drawText('Description', this.margin + 10, 9, true, COLORS.textDark);
    this.drawText('Qty', this.margin + 320, 9, true, COLORS.textDark);
    this.drawText('Unit Price', this.margin + 380, 9, true, COLORS.textDark);
    this.drawText('Amount', this.margin + 460, 9, true, COLORS.textDark);
    
    this.y -= 20;
    
    // Items
    for (const item of items) {
      this.checkPageBreak(50); // Need at least 50 space for an item
      
      const title = item.manual_title || item.document_filename || 'Print Document';
      this.drawText(title, this.margin + 10, 10, true, COLORS.textDark);
      
      this.drawText(String(item.copies || 1), this.margin + 320, 10, false, COLORS.textDark);
      this.drawText(formatCurrency(item.base_price || 0), this.margin + 380, 10, false, COLORS.textDark);
      this.drawText(formatCurrency(item.item_total || 0), this.margin + 460, 10, false, COLORS.textDark);
      
      this.y -= 14;
      
      // Print specs
      const specs = [];
      if (item.color_mode === 1) specs.push('Color');
      else if (item.color_mode === 0) specs.push('B&W');
      
      if (item.binding_type && item.binding_type !== 'none') specs.push(`${item.binding_type} binding`);
      if (item.page_count) specs.push(`${item.page_count} pages`);
      
      if (specs.length > 0) {
        this.drawText(specs.join(' • '), this.margin + 10, 8, false, COLORS.textMuted);
        this.y -= 14;
      }
      
      this.y -= 5;
      this.drawLine(this.margin, this.width - this.margin, this.y, COLORS.border);
      this.y -= 15;
    }
  }

  private drawTotals(order: any) {
    this.checkPageBreak(120); // Need space for totals
    
    const rightCol = this.margin + 350;
    const valCol = this.margin + 460;
    
    const delivery = Number(order.delivery_fee) || 0;
    const discount = Number(order.discount) || 0;
    const grandTotal = Number(order.grand_total) || 0;
    const subtotal = grandTotal - delivery + discount; 
    
    this.drawText('Subtotal:', rightCol, 9, false, COLORS.textMuted);
    this.drawText(formatCurrency(subtotal), valCol, 9, false, COLORS.textDark);
    this.y -= 14;
    
    if (discount > 0) {
      this.drawText('Discount:', rightCol, 9, false, COLORS.textMuted);
      this.drawText(`-${formatCurrency(discount)}`, valCol, 9, false, rgb(0.1, 0.6, 0.1));
      this.y -= 14;
    }
    
    this.drawText('Delivery:', rightCol, 9, false, COLORS.textMuted);
    this.drawText(delivery === 0 ? 'FREE' : formatCurrency(delivery), valCol, 9, false, COLORS.textDark);
    this.y -= 14;
    
    this.y -= 5;
    this.drawLine(rightCol, this.width - this.margin, this.y, COLORS.border);
    this.y -= 15;
    
    this.drawText('TOTAL', rightCol, 12, true, COLORS.textDark);
    this.drawText(formatCurrency(grandTotal), valCol, 12, true, COLORS.primary);
    
    this.y -= 30;
  }

  private drawPayment(order: any) {
    this.checkPageBreak(80);
    
    this.drawText('PAYMENT', this.margin, 10, true, COLORS.textMuted);
    this.y -= 15;
    
    this.drawText('Status:', this.margin, 9, false, COLORS.textMuted);
    this.drawText(order.payment_status || (order.status === 'received' || order.status === 'pending' ? 'PENDING' : 'PAID'), this.margin + 45, 9, true, COLORS.textDark);
    this.y -= 14;
    
    if (order.payment_method) {
      this.drawText('Method:', this.margin, 9, false, COLORS.textMuted);
      this.drawText(order.payment_method, this.margin + 45, 9, true, COLORS.textDark);
      this.y -= 14;
    }
    
    if (order.payment_id) {
      this.drawText('ID:', this.margin, 9, false, COLORS.textMuted);
      this.drawText(order.payment_id, this.margin + 45, 9, true, COLORS.textDark);
      this.y -= 14;
    }
    
    this.y -= 10;
  }

  private drawDelivery(order: any) {
    this.y += 53 + (order.payment_method ? 14 : 0) + (order.payment_id ? 14 : 0); 
    
    const col2 = this.margin + 200;
    this.drawText('DELIVERY', col2, 10, true, COLORS.textMuted);
    this.y -= 15;
    
    if (order.delivery_type) {
      this.drawText('Method:', col2, 9, false, COLORS.textMuted);
      this.drawText(order.delivery_type.toUpperCase(), col2 + 65, 9, true, COLORS.textDark);
      this.y -= 14;
    }
    
    const destination = [order.delivery_building, order.delivery_room].filter(Boolean).join(' - ');
    if (destination) {
      this.drawText('Destination:', col2, 9, false, COLORS.textMuted);
      this.drawText(destination, col2 + 65, 9, true, COLORS.textDark);
      this.y -= 14;
    }
    
    if (order.estimated_delivery) {
      this.drawText('ETA:', col2, 9, false, COLORS.textMuted);
      this.drawText(new Date(order.estimated_delivery).toLocaleDateString(), col2 + 65, 9, true, COLORS.textDark);
      this.y -= 14;
    }
    
    this.y -= 30;
  }
  
  private drawPolicy() {
    this.checkPageBreak(80);
    this.drawLine(this.margin, this.width - this.margin, this.y, COLORS.border);
    this.y -= 20;
    
    this.drawText('IMPORTANT ORDER POLICY', this.margin, 9, true, COLORS.textDark);
    this.y -= 14;
    this.drawText('Orders cannot currently be cancelled or refunded after placement.', this.margin, 8, false, COLORS.textMuted);
    this.y -= 12;
    this.drawText('If you experience any issue with your order, please contact BLINTZY Support.', this.margin, 8, false, COLORS.textMuted);
    
    this.y -= 20;
  }
  
  private drawSupport(supportConfig: any) {
    this.y += 60;
    
    const col2 = this.margin + 250;
    this.drawText('BLINTZY SUPPORT', col2, 9, true, COLORS.textDark);
    this.y -= 14;
    
    if (supportConfig?.supportWhatsapp) {
      this.drawText('WhatsApp:', col2, 8, false, COLORS.textMuted);
      this.drawText(`+${supportConfig.supportWhatsapp}`, col2 + 50, 8, true, COLORS.textDark);
      this.y -= 12;
    }
    if (supportConfig?.supportPhone) {
      this.drawText('Phone:', col2, 8, false, COLORS.textMuted);
      this.drawText(`+${supportConfig.supportPhone}`, col2 + 50, 8, true, COLORS.textDark);
      this.y -= 12;
    }
    if (supportConfig?.supportEmail) {
      this.drawText('Email:', col2, 8, false, COLORS.textMuted);
      this.drawText(supportConfig.supportEmail, col2 + 50, 8, true, COLORS.textDark);
      this.y -= 12;
    }
    this.y -= 20;
  }

  private drawAuthenticity(publicId: string) {
    this.checkPageBreak(60);
    this.y -= 20;
    this.drawText('BLINTZY', this.margin, 9, true, COLORS.primary);
    this.y -= 12;
    this.drawText('OFFICIAL ORDER DOCUMENT', this.margin, 8, true, COLORS.textMuted);
    this.y -= 12;
    this.drawText('Online invoice verification is coming soon.', this.margin, 7, false, COLORS.border);
  }

  private drawFooters(publicId: string) {
    const pages = this.pdfDoc.getPages();
    pages.forEach((p, idx) => {
      p.drawText(`BLINTZY • Smart Printing • Campus Delivery`, {
        x: this.margin,
        y: 25,
        size: 8,
        font: this.fontRegular,
        color: COLORS.textMuted,
      });
      
      p.drawText(`Order ID: ${publicId}`, {
        x: this.margin + 200,
        y: 25,
        size: 8,
        font: this.fontRegular,
        color: COLORS.textMuted,
      });
      
      p.drawText(`Page ${idx + 1} of ${pages.length}`, {
        x: this.width - this.margin - 40,
        y: 25,
        size: 8,
        font: this.fontRegular,
        color: COLORS.textMuted,
      });
    });
  }

  private drawLine(x1: number, x2: number, y: number, color: any) {
    this.page.drawLine({
      start: { x: x1, y },
      end: { x: x2, y },
      thickness: 1,
      color,
    });
  }
}

export const generateInvoicePDF = async (orderData: any, supportConfig: any) => {
  const generator = new InvoiceGenerator();
  await generator.generate(orderData, supportConfig);
};
