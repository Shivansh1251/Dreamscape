import { ReactNode, useEffect, useState } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

interface PageLayoutProps {
    children: ReactNode;
    videoSrc?: string;
    videoWebmSrc?: string;
    videoOverlayText?: ReactNode;
    headerContent?: ReactNode;
    showFooter?: boolean;
    connectedFooter?: boolean;
}

export function PageLayout({ children, videoSrc, videoWebmSrc, videoOverlayText, headerContent, showFooter = true, connectedFooter = false }: PageLayoutProps) {
    const [loadHeroVideo, setLoadHeroVideo] = useState(false);

    useEffect(() => {
        if (!videoSrc || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const load = () => setLoadHeroVideo(true);
        const idleTimer = window.setTimeout(load, 700);
        return () => {
            window.clearTimeout(idleTimer);
        };
    }, [videoSrc]);

    return (
        <div className="relative min-h-screen font-sans">
            {/* ── Dynamic Hero Header ── */}
            <header className="relative w-full overflow-hidden text-center text-white top-0 z-40 bg-[#05203c]"
                style={{ minHeight: videoSrc ? '500px' : 'auto' }}>

                {/* Background Video */}
                {videoSrc && loadHeroVideo && (
                    <video key={videoSrc} className="absolute top-0 left-0 z-0 h-[125%] w-full object-cover" autoPlay muted loop playsInline preload="none" aria-hidden="true">
                        {videoWebmSrc && <source src={videoWebmSrc} type="video/webm" />}
                        <source src={videoSrc} type="video/mp4" />
                    </video>
                )}

                {/* Navbar */}
                <div className="relative z-50">
                    <Navbar />
                </div>

                {/* Video Overlay Text (Center) */}
                {videoOverlayText && (
                    <div className="relative z-10 flex h-full min-h-[420px] flex-col items-center justify-center px-4 pb-12 pt-52">
                        {videoOverlayText}
                    </div>
                )}

                {/* Search Bar / Header Content (Bottom overlapping) */}
                {headerContent && (
                    <div className="relative z-20 flex w-full justify-center px-4" style={{ marginTop: videoOverlayText ? '0' : '190px' }}>
                        {headerContent}
                    </div>
                )}
            </header>

            {/* ── Main Page Content ── */}
            <main className="relative z-10">
                {children}
            </main>

            {/* ── Universal Footer ── */}
            {showFooter && <Footer connected={connectedFooter} />}
        </div>
    );
}
