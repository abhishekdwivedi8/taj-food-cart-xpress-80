
import { useContext } from 'react';
import { OrderSystemContext } from './OrderSystemProvider';
import { OrderSystemContextType } from './types';

export const useOrderSystem = (): OrderSystemContextType => {
  const context = useContext(OrderSystemContext);
  if (context === undefined) {
    throw new Error('useOrderSystem must be used within an OrderSystemProvider');
  }
  return context;
};
