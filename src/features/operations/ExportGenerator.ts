import * as XLSX from 'xlsx';

export const generateExcelExport = (orders: any[], filters: any = {}) => {
  // Format orders for Excel
  const excelData = orders.map(order => ({
    'Order ID': order.publicId,
    'Order Date': new Date(order.createdAt).toLocaleDateString(),
    'Student Name': order.student?.name || 'Not provided',
    'Roll Number': order.student?.rollNumber || 'Not provided',
    'Mobile': order.student?.phone || 'Not provided',
    'Email': order.student?.email || 'Not provided',
    'Branch': order.academic?.branchCode || 'N/A',
    'Academic Year': order.academic?.yearLabel || 'N/A',
    'Semester': order.academic?.semesterLabel || 'N/A',
    'Manual': order.items?.[0]?.title || 'Document',
    'Quantity': order.items?.reduce((acc: number, item: any) => acc + (item.quantity || 1), 0) || 1,
    'Pages': order.items?.[0]?.pages || 0,
    'Print Type': order.items?.[0]?.printType || 'B&W',
    'Color Mode': order.items?.[0]?.colorMode || 1,
    'Binding': order.items?.[0]?.binding || 'None',
    'Unit Price': order.items?.[0]?.unitPrice || 0,
    'Item Total': order.items?.[0]?.totalPrice || 0,
    'Subtotal': order.pricing?.subtotal || 0,
    'Discount': order.pricing?.discount || 0,
    'Delivery Fee': order.pricing?.deliveryFee || 0,
    'Grand Total': order.pricing?.grandTotal || 0,
    'Payment Status': order.paymentStatus || 'pending',
    'Order Status': order.status || 'received',
    'Delivery Type': order.delivery?.type || 'Standard',
    'Building': order.delivery?.building || '',
    'Room': order.delivery?.room || '',
    'ETA': order.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleString() : 'Not set',
    'Vendor': order.vendorId || '',
    'Created At': new Date(order.createdAt).toLocaleString(),
    'Updated At': new Date(order.updatedAt).toLocaleString(),
    'Internal Timestamp': order.updatedAt // Hidden field for conflict detection during import
  }));

  const worksheet = XLSX.utils.json_to_sheet(excelData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');
  
  // Apply bold header (XLSX basic style)
  // Not needed strictly but standard
  
  // Generate buffer and trigger download
  XLSX.writeFile(workbook, `Blintzy_Orders_${new Date().toISOString().split('T')[0]}.xlsx`);
};

export const generateImportTemplate = () => {
  const templateData = [{
    'Order ID': 'BLZ-26-XXXX (READ ONLY)',
    'Student Name': 'John Doe (READ ONLY)',
    'Roll Number': '123456 (READ ONLY)',
    'Grand Total': '500 (READ ONLY)',
    'Order Status': 'ready_for_pickup (EDITABLE)',
    'ETA': '2026-08-25T10:00:00 (EDITABLE)',
    'Delivery Type': 'classroom (EDITABLE)',
    'Building': 'Block A (EDITABLE)',
    'Room': 'Room 101 (EDITABLE)'
  }];
  
  const worksheet = XLSX.utils.json_to_sheet(templateData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');
  
  XLSX.writeFile(workbook, `Blintzy_Import_Template.xlsx`);
};

export const parseExcelImport = async (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        // Map to structured format
        const rows = jsonData.map((row: any) => ({
          orderId: row['Order ID'],
          status: row['Order Status'],
          estimatedDelivery: row['ETA'] ? new Date(row['ETA']).getTime() : undefined,
          deliveryType: row['Delivery Type'],
          deliveryBuilding: row['Building'],
          deliveryRoom: row['Room'],
          exportTimestamp: row['Internal Timestamp'] // For concurrency check
        })).filter(row => row.orderId && !row.orderId.includes('(READ ONLY)'));
        
        resolve(rows);
      } catch (err) {
        reject(err);
      }
    };
    reader.readAsBinaryString(file);
  });
};
