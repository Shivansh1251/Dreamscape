import { useEffect, useRef, useState } from 'react';

interface LazyVideoProps {
    src: string;
    webmSrc?: string;
    className?: string;
    label?: string;
}

/** Loads destination video only shortly before it enters the viewport. */
export function LazyVideo({ src, webmSrc, className = '', label = 'Travel destination' }: LazyVideoProps) {
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
        }, { rootMargin: '260px 0px' });

        observer.observe(target);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={containerRef} className={`overflow-hidden rounded-xl bg-gradient-to-br from-cyan-100 via-sky-100 to-blue-200 ${className}`}>
            {shouldLoad ? (
                <video
                    className="h-full w-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="none"
                    aria-label={label}
                >
                    {webmSrc && <source src={webmSrc} type="video/webm" />}
                    <source src={src} type="video/mp4" />
                </video>
            ) : (
                <div className="h-full w-full animate-pulse bg-gradient-to-br from-slate-200 via-cyan-100 to-blue-200" aria-label={`Loading ${label}`} />
            )}
        </div>
    );
}
