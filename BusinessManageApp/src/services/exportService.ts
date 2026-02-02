import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import ApiService from './api';
import { Alert, Platform } from 'react-native';

class ExportService {
  /**
   * Download Excel file from API endpoint
   */
  async downloadExcel(endpoint: string, filename: string, params?: any): Promise<void> {
    try {
      const token = await ApiService.getToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      // Build URL with params
      const url = `${ApiService.API_BASE_URL}${endpoint}`;
      const queryParams = params 
        ? '?' + Object.entries(params).map(([key, val]) => `${key}=${encodeURIComponent(String(val))}`).join('&')
        : '';
      
      const fullUrl = url + queryParams;

      // Download the file using Expo FileSystem
      const file = new FileSystem.File(FileSystem.Paths.document, filename);
      const downloadDest = file.uri;
      
      const downloadResult = await FileSystem.downloadAsync(
        fullUrl,
        downloadDest,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (downloadResult.status === 200) {
        // Share the file using Expo Sharing
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(downloadResult.uri, {
            mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            dialogTitle: 'Export Excel',
            UTI: 'com.microsoft.excel.xlsx'
          });
        } else {
          Alert.alert('Success', `File saved to ${downloadDest}`);
        }
      } else {
        throw new Error('Failed to download file');
      }
    } catch (error: any) {
      console.error('Export error:', error);
      throw error;
    }
  }

  /**
   * Export today's collections to Excel
   */
  async exportTodayCollections(): Promise<void> {
    const today = new Date();
    const filename = `collections_${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}.xlsx`;
    
    await this.downloadExcel('/api/reports/export/today-collections/excel', filename);
  }

  /**
   * Export collections for date range to Excel
   */
  async exportDateCollections(startDate: Date, endDate: Date): Promise<void> {
    const filename = `collections_${startDate.toISOString().split('T')[0]}_to_${endDate.toISOString().split('T')[0]}.xlsx`;
    
    await this.downloadExcel('/api/reports/export/date-collections/excel', filename, {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    });
  }

  /**
   * Export DSR summary to Excel
   */
  async exportDSRSummary(startDate: Date, endDate: Date): Promise<void> {
    const filename = `dsr_summary_${startDate.toISOString().split('T')[0]}_to_${endDate.toISOString().split('T')[0]}.xlsx`;
    
    // Note: You'll need to add this endpoint in the backend
    await this.downloadExcel('/api/reports/export/dsr-summary/excel', filename, {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });
  }
}

export default new ExportService();
