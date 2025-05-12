
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ExportButton from '@/components/ui/export-button';
import { Clock, TrendingUp, DollarSign } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ExportSectionProps {
  salesData: any[];
  orderData: any[];
  revenueData: any[];
}

const ExportSection: React.FC<ExportSectionProps> = ({ salesData, orderData, revenueData }) => {
  return (
    <Card className="mb-6 border-[#D4AF37]/20">
      <CardHeader className="bg-[#F5F5DC]/50 border-b border-[#D4AF37]/20">
        <CardTitle className="text-[#5B0018]">Export Data</CardTitle>
        <CardDescription>Download analytics data in various formats</CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <Alert variant="success" className="mb-4">
          <AlertDescription>
            Click any export button to download data in your preferred format. Available formats are CSV, JSON, XML, and Excel.
          </AlertDescription>
        </Alert>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col items-center justify-between p-4 border rounded-md border-[#D4AF37]/20 bg-white">
            <div className="mb-3 flex items-center gap-2">
              <DollarSign size={20} className="text-[#5B0018]" />
              <h3 className="font-medium text-[#5B0018]">Sales Data</h3>
            </div>
            <p className="text-sm text-gray-500 mb-4">Export detailed sales information</p>
            <ExportButton 
              data={salesData} 
              fileName="sales_data" 
              variant="default"
              size="sm"
              className="w-full"
            />
          </div>
          
          <div className="flex flex-col items-center justify-between p-4 border rounded-md border-[#D4AF37]/20 bg-white">
            <div className="mb-3 flex items-center gap-2">
              <Clock size={20} className="text-[#5B0018]" />
              <h3 className="font-medium text-[#5B0018]">Order History</h3>
            </div>
            <p className="text-sm text-gray-500 mb-4">Export complete order history</p>
            <ExportButton 
              data={orderData} 
              fileName="order_history" 
              variant="secondary"
              size="sm"
              className="w-full"
            />
          </div>
          
          <div className="flex flex-col items-center justify-between p-4 border rounded-md border-[#D4AF37]/20 bg-white">
            <div className="mb-3 flex items-center gap-2">
              <TrendingUp size={20} className="text-[#5B0018]" />
              <h3 className="font-medium text-[#5B0018]">Revenue Reports</h3>
            </div>
            <p className="text-sm text-gray-500 mb-4">Export revenue analysis reports</p>
            <ExportButton 
              data={revenueData} 
              fileName="revenue_report" 
              variant="outline"
              size="sm"
              className="w-full border-[#5B0018] text-[#5B0018] hover:bg-[#5B0018]/10"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExportSection;
