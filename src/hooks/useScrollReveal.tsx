import { useEffect, useRef, useState } from "react";

interface UseScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollRevealOptions = {}
) {
  const { threshold = 0.1, rootMargin = "0px", triggerOnce = true } = options;
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, isVisible };
}

export function useScrollRevealMultiple(
  count: number,
  options: UseScrollRevealOptions = {}
) {
  const { threshold = 0.1, rootMargin = "0px", triggerOnce = true } = options;
  const refs = useRef<(HTMLElement | null)[]>([]);
  const [visibleItems, setVisibleItems] = useState<boolean[]>([]);
  const observersRef = useRef<IntersectionObserver[]>([]);

  // Reset visible items when count changes
  useEffect(() => {
    setVisibleItems(new Array(count).fill(false));
  }, [count]);

  // Setup observers with a slight delay to ensure DOM elements are ready
  useEffect(() => {
    // Clean up previous observers
    observersRef.current.forEach((obs) => obs.disconnect());
    observersRef.current = [];

    // Small delay to ensure refs are populated after render
    const timeoutId = setTimeout(() => {
      refs.current.forEach((element, index) => {
        if (!element) return;

        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setVisibleItems((prev) => {
                const newState = [...prev];
                newState[index] = true;
                return newState;
              });
              if (triggerOnce) {
                observer.unobserve(element);
              }
            } else if (!triggerOnce) {
              setVisibleItems((prev) => {
                const newState = [...prev];
                newState[index] = false;
                return newState;
              });
            }
          },
          { threshold, rootMargin }
        );

        observer.observe(element);
        observersRef.current.push(observer);
      });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      observersRef.current.forEach((obs) => obs.disconnect());
    };
  }, [count, threshold, rootMargin, triggerOnce]);

  const setRef = (index: number) => (el: HTMLElement | null) => {
    refs.current[index] = el;
  };

  return { setRef, visibleItems };
}
