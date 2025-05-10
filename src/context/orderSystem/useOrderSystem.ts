
import { useOrderSystem as useOrderSystemFromProvider } from './OrderSystemProvider';

// Re-export the hook directly from the provider
export const useOrderSystem = useOrderSystemFromProvider;

// Export the types
export type { OrderSystemContextType } from './types';
