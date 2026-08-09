import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

interface PageLayoutProps {
    children: ReactNode;
    videoSrc?: string;
    videoOverlayText?: ReactNode;
    headerContent?: ReactNode;
    showFooter?: boolean;
    connectedFooter?: boolean;
}

export function PageLayout({ children, videoSrc, videoOverlayText, headerContent, showFooter = true, connectedFooter = false }: PageLayoutProps) {
    return (
        <div className="relative min-h-screen font-sans">
            {/* ── Dynamic Hero Header ── */}
            <header className="relative w-full overflow-hidden text-center text-white top-0 z-40 bg-[#05203c]"
                style={{ minHeight: videoSrc ? '500px' : 'auto' }}>

                {/* Background Video */}
                {videoSrc && (
                    <video key={videoSrc} src={videoSrc} className="absolute top-0 left-0 z-0 h-[125%] w-full object-cover" autoPlay muted loop playsInline preload="metadata" aria-hidden="true" />
                )}

                {/* Navbar */}
                <div className="relative z-50">
                    <Navbar />
                </div>

                {/* Video Overlay Text (Center) */}
                {videoOverlayText && (
                    <div className="relative z-10 flex flex-col items-center justify-center h-full min-h-[300px] pt-24 pb-10">
                        {videoOverlayText}
                    </div>
                )}

                {/* Search Bar / Header Content (Bottom overlapping) */}
                {headerContent && (
                    <div className="relative z-20 flex justify-center w-full px-4" style={{ marginTop: videoOverlayText ? '0' : '150px' }}>
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
