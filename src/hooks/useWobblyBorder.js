import { useEffect, useMemo, useRef, useState } from 'react';
import { wobblyRectPath } from '../lib/wobblyBorder';

export function useWobblyBorder(seed) {
  const ref = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const observer = new ResizeObserver(([entry]) => {
      const boxSize = entry.borderBoxSize?.[0];
      if (boxSize) {
        setSize({ width: boxSize.inlineSize, height: boxSize.blockSize });
      } else {
        const { width, height } = entry.contentRect;
        setSize({ width, height });
      }
    });
    observer.observe(el, { box: 'border-box' });
    return () => observer.disconnect();
  }, []);

  const path = useMemo(
    () => (size.width && size.height ? wobblyRectPath(size.width, size.height, seed) : ''),
    [size.width, size.height, seed]
  );

  return { ref, size, path };
}
