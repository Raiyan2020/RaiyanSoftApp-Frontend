import { useEffect, type RefObject } from 'react';

function isInViewport(element: Element) {
  const rect = element.getBoundingClientRect();
  return rect.top < window.innerHeight && rect.bottom > 0;
}

export function useSectionReveal(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const reveal = (element: Element) => {
      element.classList.add('visible');
    };

    const elements = Array.from(container.querySelectorAll('.reveal'));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) reveal(entry.target);
        });
      },
      { threshold: 0, rootMargin: '120px 0px' }
    );

    elements.forEach((element) => {
      if (isInViewport(element)) reveal(element);
      observer.observe(element);
    });

    const recheck = window.setTimeout(() => {
      elements.forEach((element) => {
        if (!element.classList.contains('visible') && isInViewport(element)) {
          reveal(element);
        }
      });
    }, 900);

    return () => {
      observer.disconnect();
      window.clearTimeout(recheck);
    };
  }, [ref]);
}
