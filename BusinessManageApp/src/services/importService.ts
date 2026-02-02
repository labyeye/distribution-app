import * as XLSX from 'xlsx';
import ApiService from './api';
import { API_ENDPOINTS } from '../config/api';
import { Alert } from 'react-native';

interface BillImportRow {
  billNumber: string;
  retailer: string;
  amount: number;
  dueAmount: number;
  billDate: string;
  collectionDay?: string;
  status?: string;
}

interface ImportResult {
  imported: number;
  errors: number;
  errorDetails: string[];
}

class ImportService {
  /**
   * Parse Excel file and extract bills data
   */
  parseExcelBills(fileUri: string): Promise<BillImportRow[]> {
    return new Promise((resolve, reject) => {
      try {
        // For React Native, we need to use different approach
        // This is a placeholder that should work with react-native-fs
        const bills: BillImportRow[] = [];
        
        // Read file and parse it
        // Note: This requires proper file handling in React Native
        resolve(bills);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Validate Excel structure for bills import
   */
  validateBillsExcelStructure(data: any[][]): string | null {
    if (!data || data.length === 0) {
      return 'Excel file is empty';
    }

    const headers = data[0] || [];
    const lowerHeaders = headers.map(h => String(h).toLowerCase().trim());

    const requiredColumns = ['billnumber', 'retailer', 'amount', 'billdate'];
    const missingColumns = requiredColumns.filter(
      col => !lowerHeaders.includes(col.toLowerCase())
    );

    if (missingColumns.length > 0) {
      return `Missing required columns: ${missingColumns.join(', ')}`;
    }

    return null;
  }

  /**
   * Import bills from Excel file
   */
  async importBillsFromExcel(excelData: BillImportRow[]): Promise<ImportResult> {
    try {
      const token = await ApiService.getToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      let imported = 0;
      let errors = 0;
      const errorDetails: string[] = [];

      // Process each bill
      for (let i = 0; i < excelData.length; i++) {
        try {
          const bill = excelData[i];
          
          // Validate bill data
          if (!bill.billNumber || !bill.retailer || !bill.amount || !bill.billDate) {
            errorDetails.push(`Row ${i + 2}: Missing required fields`);
            errors++;
            continue;
          }

          // Send to backend
          await ApiService.post(API_ENDPOINTS.BILLS, {
            billNumber: bill.billNumber.toString().trim(),
            retailer: bill.retailer.toString().trim(),
            amount: Number(bill.amount),
            dueAmount: Number(bill.dueAmount || bill.amount),
            billDate: bill.billDate,
            collectionDay: bill.collectionDay || 'Monday',
            status: bill.status || 'Unpaid',
          });

          imported++;
        } catch (error: any) {
          errors++;
          errorDetails.push(
            `Row ${i + 2}: ${error.response?.data?.message || error.message}`
          );
        }
      }

      return { imported, errors, errorDetails };
    } catch (error: any) {
      throw new Error(`Import failed: ${error.message}`);
    }
  }

  /**
   * Import retailers from Excel file
   */
  async importRetailersFromExcel(excelData: any[]): Promise<ImportResult> {
    try {
      const token = await ApiService.getToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      let imported = 0;
      let errors = 0;
      const errorDetails: string[] = [];

      for (let i = 0; i < excelData.length; i++) {
        try {
          const retailer = excelData[i];
          
          if (!retailer.name || !retailer.contact) {
            errorDetails.push(`Row ${i + 2}: Missing required fields (name, contact)`);
            errors++;
            continue;
          }

          await ApiService.post(API_ENDPOINTS.RETAILERS, {
            name: retailer.name.toString().trim(),
            contact: retailer.contact.toString().trim(),
            address: retailer.address?.toString().trim() || '',
            city: retailer.city?.toString().trim() || '',
            state: retailer.state?.toString().trim() || '',
            pincode: retailer.pincode?.toString().trim() || '',
            gstNumber: retailer.gstNumber?.toString().trim() || '',
          });

          imported++;
        } catch (error: any) {
          errors++;
          errorDetails.push(
            `Row ${i + 2}: ${error.response?.data?.message || error.message}`
          );
        }
      }

      return { imported, errors, errorDetails };
    } catch (error: any) {
      throw new Error(`Retailer import failed: ${error.message}`);
    }
  }

  /**
   * Import products from Excel file
   */
  async importProductsFromExcel(excelData: any[]): Promise<ImportResult> {
    try {
      const token = await ApiService.getToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      let imported = 0;
      let errors = 0;
      const errorDetails: string[] = [];

      for (let i = 0; i < excelData.length; i++) {
        try {
          const product = excelData[i];
          
          if (!product.name || !product.code) {
            errorDetails.push(`Row ${i + 2}: Missing required fields (name, code)`);
            errors++;
            continue;
          }

          await ApiService.post(API_ENDPOINTS.PRODUCTS, {
            name: product.name.toString().trim(),
            code: product.code.toString().trim(),
            category: product.category?.toString().trim() || '',
            price: Number(product.price || 0),
            unit: product.unit?.toString().trim() || 'Piece',
            description: product.description?.toString().trim() || '',
          });

          imported++;
        } catch (error: any) {
          errors++;
          errorDetails.push(
            `Row ${i + 2}: ${error.response?.data?.message || error.message}`
          );
        }
      }

      return { imported, errors, errorDetails };
    } catch (error: any) {
      throw new Error(`Product import failed: ${error.message}`);
    }
  }
}

export default new ImportService();
