
import { createContext, useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

type DeviceIdContextType = {
  deviceId: string;
};

const DeviceIdContext = createContext<DeviceIdContextType | undefined>(undefined);

export const DeviceIdProvider = ({ children }: { children: React.ReactNode }) => {
  const [deviceId, setDeviceId] = useState<string>('');

  useEffect(() => {
    // Try to get the device ID from localStorage
    const storedDeviceId = localStorage.getItem('restaurant_device_id');
    
    if (storedDeviceId) {
      setDeviceId(storedDeviceId);
    } else {
      // Generate a new device ID if one doesn't exist
      const newDeviceId = uuidv4();
      localStorage.setItem('restaurant_device_id', newDeviceId);
      setDeviceId(newDeviceId);
    }
  }, []);

  return (
    <DeviceIdContext.Provider value={{ deviceId }}>
      {children}
    </DeviceIdContext.Provider>
  );
};

export const useDeviceId = (): DeviceIdContextType => {
  const context = useContext(DeviceIdContext);
  if (context === undefined) {
    throw new Error('useDeviceId must be used within a DeviceIdProvider');
  }
  return context;
};
