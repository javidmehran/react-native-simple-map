import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import type { ZoomPanContextValue } from '../types';

const defaultValue: ZoomPanContextValue = {
  x: 0,
  y: 0,
  k: 1,
  transformString: 'translate(0 0) scale(1)',
};

const ZoomPanContext = createContext<ZoomPanContextValue>(defaultValue);

interface ZoomPanProviderProps {
  value?: ZoomPanContextValue;
  children?: ReactNode;
}

const ZoomPanProvider = ({
  value = defaultValue,
  children,
}: ZoomPanProviderProps) => {
  return (
    <ZoomPanContext.Provider value={value}>{children}</ZoomPanContext.Provider>
  );
};

const useZoomPanContext = (): ZoomPanContextValue => {
  return useContext(ZoomPanContext);
};

export { ZoomPanContext, ZoomPanProvider, useZoomPanContext };
