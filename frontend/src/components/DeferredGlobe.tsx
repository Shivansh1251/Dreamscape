import { lazy, Suspense, useEffect, useRef, useState } from 'react';

const Globe = lazy(() => import('./InteractiveGlobe').then((module) => ({ default: module.InteractiveGlobe })));

export function DeferredGlobe() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [shouldLoad, setShouldLoad] = useState(false);

    useEffect(() => {
        // Keep the initial bundle light, but guarantee the globe mounts even if the
        // browser does not provide IntersectionObserver (or its callback is delayed).
        const timer = setTimeout(() => setShouldLoad(true), 1200);

        const target = containerRef.current;
        if (!target) return;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setShouldLoad(true);
                clearTimeout(timer);
                observer.disconnect();
            }
        }, { rootMargin: '650px 0px' });
        observer.observe(target);

        return () => {
            observer.disconnect();
            clearTimeout(timer);
        };
    }, []);

    return (
        <div ref={containerRef} className="min-h-[520px] w-full bg-[#edf7fa]">
            {shouldLoad ? (
                <Suspense fallback={<div className="flex min-h-[520px] items-center justify-center text-sm font-semibold text-cyan-800">Loading the interactive globe…</div>}>
                    <Globe />
                </Suspense>
            ) : (
                <div className="flex min-h-[520px] items-center justify-center px-6 text-center text-sm font-semibold text-cyan-800">
                    <span>Spin the globe to discover your next destination.</span>
                </div>
            )}
        </div>
    );
}
