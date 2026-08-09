import { lazy, Suspense, useEffect, useRef, useState } from 'react';

const Globe = lazy(() => import('./InteractiveGlobe').then((module) => ({ default: module.InteractiveGlobe })));

export function DeferredGlobe() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [shouldLoad, setShouldLoad] = useState(false);

    useEffect(() => {
        const target = containerRef.current;
        if (!target) return;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setShouldLoad(true);
                observer.disconnect();
            }
        }, { rootMargin: '300px' });
        observer.observe(target);
        return () => observer.disconnect();
    }, []);

    return <div ref={containerRef} className="min-h-[600px] bg-[#edf7fa]">{shouldLoad && <Suspense fallback={<div className="min-h-[600px] bg-[#edf7fa]" />}><Globe /></Suspense>}</div>;
}
