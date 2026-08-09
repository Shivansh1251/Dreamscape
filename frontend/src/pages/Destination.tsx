import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PageLayout } from '../components/PageLayout';

export function Destination() {
    const { name } = useParams<{ name: string }>();
    const [media, setMedia] = useState<{ video: string, images: string[] } | null>(null);
    const [loading, setLoading] = useState(true);

    // Capitalize the first letter for display
    const displayName = name ? name.charAt(0).toUpperCase() + name.slice(1) : 'Destination';

    useEffect(() => {
        // Fetch dynamic media based on destination name
        fetch(`/api/media?location=${name}`)
            .then(res => res.json())
            .then(data => {
                setMedia(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load media:", err);
                setLoading(false);
            });
    }, [name]);

    const heroContent = (
        <h1 className="relative z-10 text-white text-6xl md:text-7xl mb-8 flex flex-col items-center justify-center animate-slide-down pb-2 gap-4"
            style={{
                background: '-webkit-linear-gradient(90deg, #fff, #a5f3fc, #fff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: '900',
                textShadow: '0 4px 20px rgba(0,0,0,0.5)'
            }}>
            <span className="text-3xl md:text-4xl uppercase tracking-[10px] text-cyan-400" style={{ WebkitTextFillColor: "initial", textShadow: 'none' }}>
                Discover
            </span>
            {displayName}
        </h1>
    );

    return (
        <PageLayout
            videoSrc={media?.video || "https://videos.pexels.com/video-files/4525107/4525107-uhd_2560_1440_24fps.mp4"}
            videoOverlayText={heroContent}
            showFooter={true}
        >
            <div className="bg-gray-50 text-gray-800 min-h-screen py-20 px-6">
                <div className="max-w-7xl mx-auto">

                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
                            A glimpse of <span className="text-cyan-600 border-b-4 border-cyan-400 pb-1">{displayName}</span>
                        </h2>
                        <p className="mt-4 text-xl text-gray-500 font-medium">Immerse yourself in breathtaking scenery provided by Unsplash.</p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="w-16 h-16 border-8 border-cyan-200 border-t-cyan-500 rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {media?.images && media.images.map((imgUrl, i) => (
                                <div key={i} className="group relative w-full h-[350px] overflow-hidden rounded-3xl shadow-2xl hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] transition-all duration-500 bg-gray-200">
                                    <img
                                        src={imgUrl}
                                        alt={`${displayName} imagery ${i + 1}`}
                                        className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-1 transition-transform duration-700 brightness-95 group-hover:brightness-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                                        <h3 className="text-white text-2xl font-bold flex items-center gap-2">
                                            📍 {displayName}
                                        </h3>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {!loading && (!media?.images || media.images.length === 0) && (
                        <div className="text-center text-gray-500 py-10 font-bold text-xl">
                            No images available for this location.
                        </div>
                    )}

                </div>
            </div>
        </PageLayout>
    );
}
