import { useEffect, useState } from 'react';

const macRegex = /Mac/;

export function useIsMac() {
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMac(macRegex.test(window.navigator.userAgent));
    }
  }, []);

  return isMac;
}
