import { useEffect, useRef, useState } from "react";

export const useInfiniteScroll = (totalLength: number, batchSize = 10) => {
  const [visibleCount, setVisibleCount] = useState(batchSize);
  const loadingRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;

      if (scrollTop + windowHeight >= fullHeight - 300 && !loadingRef.current) {
        loadingRef.current = true;
        setTimeout(() => {
          setVisibleCount((prev) => Math.min(prev + batchSize, totalLength));
          loadingRef.current = false;
        }, 500); // 500ms遅延
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [totalLength, batchSize]);

  return visibleCount;
};
