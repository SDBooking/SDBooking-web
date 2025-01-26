import { useEffect, useRef } from "react";

const useIntersectionObserver = (
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit
) => {
  const targetRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(callback, options);
    const { current: target } = targetRef;

    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [callback, options]);

  return targetRef;
};

export default useIntersectionObserver;
