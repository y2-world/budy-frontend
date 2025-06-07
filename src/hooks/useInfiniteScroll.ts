import { useEffect, useRef, useState } from "react";

export const useInfiniteScroll = (totalLength: number, batchSize = 10) => {
  const [visibleCount, setVisibleCount] = useState(batchSize);
  const loadingRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;

      if (scrollTop + windowHeight >= fullHeight - 100 && !loadingRef.current) {
        loadingRef.current = true;
        setVisibleCount((prev) => {
          const next = Math.min(prev + batchSize, totalLength);
          return next;
        });
        setTimeout(() => {
          loadingRef.current = false;
        }, 300);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [totalLength, batchSize]);

  return visibleCount;
};