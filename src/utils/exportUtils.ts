
/**
 * Utility functions for exporting data in various file formats
 */

// Helper to convert data to CSV format
export const convertToCSV = (data: any[]): string => {
  if (!data || !data.length) return '';
  
  const header = Object.keys(data[0]).join(',');
  const rows = data.map(item => 
    Object.values(item)
      .map(value => typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value)
      .join(',')
  );
  
  return [header, ...rows].join('\n');
};

// Helper to convert data to JSON format
export const convertToJSON = (data: any[]): string => {
  return JSON.stringify(data, null, 2);
};

// Helper to convert data to XML format
export const convertToXML = (data: any[], rootElement = 'data', itemElement = 'item'): string => {
  const items = data.map(item => {
    const properties = Object.entries(item)
      .map(([key, value]) => `    <${key}>${value}</${key}>`)
      .join('\n');
    
    return `  <${itemElement}>\n${properties}\n  </${itemElement}>`;
  }).join('\n');
  
  return `<?xml version="1.0" encoding="UTF-8"?>\n<${rootElement}>\n${items}\n</${rootElement}>`;
};

// Helper to download file
export const downloadFile = (content: string, fileName: string, fileType: string): void => {
  const blob = new Blob([content], { type: fileType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  
  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Export data as CSV
export const exportAsCSV = (data: any[], fileName = 'export'): void => {
  const csvContent = convertToCSV(data);
  downloadFile(csvContent, `${fileName}.csv`, 'text/csv');
};

// Export data as JSON
export const exportAsJSON = (data: any[], fileName = 'export'): void => {
  const jsonContent = convertToJSON(data);
  downloadFile(jsonContent, `${fileName}.json`, 'application/json');
};

// Export data as XML
export const exportAsXML = (data: any[], fileName = 'export'): void => {
  const xmlContent = convertToXML(data);
  downloadFile(xmlContent, `${fileName}.xml`, 'application/xml');
};

// Export data as Excel (simple CSV format that Excel can open)
export const exportAsExcel = (data: any[], fileName = 'export'): void => {
  const csvContent = convertToCSV(data);
  downloadFile(csvContent, `${fileName}.xlsx`, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
};

// Export data in the specified format
export const exportData = (data: any[], format: 'csv' | 'json' | 'xml' | 'excel', fileName = 'export'): void => {
  switch (format) {
    case 'csv':
      exportAsCSV(data, fileName);
      break;
    case 'json':
      exportAsJSON(data, fileName);
      break;
    case 'xml':
      exportAsXML(data, fileName);
      break;
    case 'excel':
      exportAsExcel(data, fileName);
      break;
    default:
      console.error('Unsupported export format');
  }
};
