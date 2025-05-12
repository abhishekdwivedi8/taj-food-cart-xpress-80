
import React from 'react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button, ButtonProps } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { exportData } from '@/utils/exportUtils';
import { toast } from 'sonner';

interface ExportButtonProps extends ButtonProps {
  data: any[];
  fileName?: string;
}

const ExportButton = ({ data, fileName = 'export', className, ...props }: ExportButtonProps) => {
  const handleExport = (format: 'csv' | 'json' | 'xml' | 'excel') => {
    if (!data || data.length === 0) {
      toast.error("No data to export");
      return;
    }
    
    try {
      exportData(data, format, fileName);
      toast.success(`${fileName} exported successfully as ${format.toUpperCase()}`, {
        duration: 3000,
      });
    } catch (error) {
      toast.error(`Failed to export as ${format.toUpperCase()}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className={className} 
          {...props}
        >
          <Download size={16} className="mr-2" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-[#F5F5DC] border-[#5B0018]/20">
        <DropdownMenuItem onClick={() => handleExport('csv')} className="cursor-pointer hover:bg-[#5B0018]/10">
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('json')} className="cursor-pointer hover:bg-[#5B0018]/10">
          Export as JSON
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('xml')} className="cursor-pointer hover:bg-[#5B0018]/10">
          Export as XML
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('excel')} className="cursor-pointer hover:bg-[#5B0018]/10">
          Export as Excel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportButton;
