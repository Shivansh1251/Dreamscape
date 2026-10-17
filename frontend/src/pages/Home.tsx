import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { CarFront, Hotel, LoaderCircle, PlaneTakeoff, Search } from 'lucide-react';
import { PageLayout } from '../components/PageLayout';
import { DeferredGlobe } from '../components/DeferredGlobe';
import { TravelJournal } from '../components/TravelJournal';
import { TripChatWidget } from '../components/TripChatWidget';
import { LazyVideo } from '../components/LazyVideo';
import { apiUrl } from '../lib/api';

export function Home() {
    const navigate = useNavigate();
    const [location, setLocation] = useState('Spain');
    const [isSearching, setIsSearching] = useState(false);
    const [communityEmail, setCommunityEmail] = useState('');
    const [communityStatus, setCommunityStatus] = useState('');

    const openDestination = () => {
        const destination = location.trim();
        if (!destination || isSearching) return;
        setIsSearching(true);
        window.setTimeout(() => {
            navigate(`/destination/${encodeURIComponent(destination)}`);
        }, 700);
    };

    const subscribeCommunity = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setCommunityStatus('');
        try {
            const response = await fetch(apiUrl('/api/community/subscribe'), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: communityEmail }) });
            const data = await response.json() as { message?: string; error?: string };
            if (!response.ok) throw new Error(data.error || 'Unable to subscribe');
            localStorage.setItem('dreamscapeCommunityEmail', communityEmail);
            setCommunityStatus(data.message || 'You are on the list!');
            setCommunityEmail('');
        } catch (error) { setCommunityStatus(error instanceof Error ? error.message : 'Unable to subscribe'); }
    };

    // Search Bar to inject into PageLayout
    const SearchForm = (
        <div className="TransSearch mb-[60px] mx-auto w-full max-w-4xl p-5 shadow-2xl border border-white/10 rounded-[20px]"
            style={{ backgroundImage: "linear-gradient(rgba(34, 40, 73, 0.9), rgba(45, 59, 137, 0.9))" }}>
            <form className="Search_Bar flex flex-col sm:flex-row items-center justify-evenly w-full gap-4"
                onSubmit={e => { e.preventDefault(); openDestination(); }}>
                <input
                    id="location"
                    list="destinations"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    placeholder="Where do you want to go?"
                    className="h-[42px] rounded border border-gray-300 px-3 text-black shadow-sm outline-none w-full sm:w-[220px]"
                />
                <datalist id="destinations">
                    {['Spain', 'Italy', 'Goa', 'Kashmir', 'Chandigarh', 'Assam', 'Mumbai', 'Delhi', 'New York', 'Los Angeles', 'Chicago', 'Canada'].map(destination => (
                        <option key={destination} value={destination} />
                    ))}
                </datalist>
                <input type="date" id="Date" className="h-[42px] rounded border border-gray-300 text-black px-3 w-full sm:w-auto font-medium shadow-sm outline-none" />
                <input type="date" id="Date2" className="h-[42px] rounded border border-gray-300 text-black px-3 w-full sm:w-auto font-medium shadow-sm outline-none" />
                <input type="number" id="guest" placeholder="Guests" className="h-[42px] rounded border border-gray-300 text-black px-3 w-full sm:w-28 font-medium shadow-sm outline-none" />
                <button type="submit" disabled={isSearching} className="bg-[#217caa] text-white rounded px-6 py-[10px] hover:bg-[#f9d5d3] transition flex items-center justify-center gap-2 font-bold w-full sm:w-auto shadow-md disabled:cursor-wait disabled:opacity-80">
                    {isSearching ? <><LoaderCircle size={18} className="animate-spin" /> Searching...</> : <>Search <Search size={18} /></>}
                </button>
                <Link to="/trip-planner" className="flex w-full items-center justify-center gap-2 rounded px-5 py-[10px] font-bold text-white shadow-md transition hover:bg-white/15 sm:w-auto">
                    <span>Plan with DreamBot</span><span aria-hidden="true">✦</span>
                </Link>
            </form>
        </div>
    );

    return (
        <PageLayout
            videoSrc="https://videos.pexels.com/video-files/4525107/4525107-uhd_2560_1440_24fps.mp4"
            videoWebmSrc="/videos/hero.webm"
            headerContent={SearchForm}
            connectedFooter
        >
            <div className="bg-gray-50 text-gray-900 pb-0">

                {/* ── Perks ── */}
                <div className="flex flex-row gap-2 justify-center items-center py-6 bg-white border-b border-gray-200">
                    <img width="25" height="24" src="https://a.hwstatic.com/raw/upload/f_auto,q_auto/wds/illustrations/sm/calendar-confirmation.svg" alt="icon" />
                    <p className="m-0 text-gray-800"><b>Free Cancellation</b> & <b>Flexible Booking</b> available</p>
                </div>

                <section id="dreambot" className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-[1.1fr_0.9fr] md:items-center">
                    <div>
                        <p className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-cyan-700">DreamBot AI trip planner</p>
                        <h2 className="max-w-2xl text-4xl font-black leading-tight text-slate-950 md:text-5xl">Tell us the feeling. We’ll shape the journey.</h2>
                        <p className="mt-4 max-w-xl text-lg leading-8 text-slate-600">DreamBot turns your destination, dates, budget, travel style and interests into a practical day-by-day itinerary with local ideas and smart pacing.</p>
                        <div className="mt-6 flex flex-wrap gap-3 text-sm font-bold text-slate-700">
                            {['Local hidden gems', 'Budget-aware plans', 'Flexible day-by-day pacing'].map(item => <span key={item} className="rounded-full bg-cyan-50 px-4 py-2 ring-1 ring-cyan-100">{item}</span>)}
                        </div>
                    </div>
                    <div className="rounded-[2rem] bg-[#05203c] p-6 text-white shadow-2xl shadow-cyan-900/15 md:p-8">
                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-400 text-2xl text-[#05203c]">✦</div>
                            <div>
                                <p className="text-xl font-black">Your dream trip, one conversation away.</p>
                                <p className="mt-2 text-sm leading-6 text-slate-300">Start on this page with the floating DreamBot button, or open the focused planner for the full experience.</p>
                            </div>
                        </div>
                        <Link to="/trip-planner" className="mt-6 flex w-full items-center justify-center rounded-xl bg-cyan-400 px-5 py-3 font-black text-[#05203c] transition hover:bg-cyan-300">Open the full planner <span className="ml-2" aria-hidden="true">→</span></Link>
                    </div>
                </section>

                {/* ── Places Grid ── */}
                <div className="py-12 px-4 max-w-7xl mx-auto">
                    <div className="flex flex-row justify-around gap-6 flex-wrap items-center">
                        <Link to="/destination/spain" className="no-underline group">
                            <div className="w-[300px] overflow-hidden rounded-3xl border border-slate-100 bg-white p-3 text-center shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl">
                                <LazyVideo src="https://media.istockphoto.com/id/465600686/video/people-in-the-city-center-of-madrid.mp4?s=mp4-640x640-is&k=20&c=HpjT2EYQ7qP9gtskw4-OfPjlZlwF6d9-y1y8zHV4Brg=" webmSrc="/videos/madrid.webm" className="mx-auto h-[220px] w-full group-hover:scale-105 transition" label="Madrid city center" />
                                <div className="mt-4">
                                    <h4 className="font-bold text-black text-2xl">Spain</h4>
                                    <p className="text-gray-500 text-sm mt-1">Last updated 1 hr ago</p>
                                </div>
                            </div>
                        </Link>
                        <div onClick={() => navigate('/destination/italy')} role="link" tabIndex={0} onKeyDown={(event) => event.key === 'Enter' && navigate('/destination/italy')} className="w-[300px] cursor-pointer overflow-hidden rounded-3xl border border-slate-100 bg-white p-3 text-center shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl group">
                            <LazyVideo src="https://videos.pexels.com/video-files/3381844/3381844-hd_1920_1080_30fps.mp4" webmSrc="/videos/italy.webm" className="mx-auto h-[220px] w-full group-hover:scale-105 transition" label="Italy travel" />
                            <div className="mt-4">
                                <h4 className="font-bold text-black text-2xl">Italy</h4>
                                <p className="text-gray-500 text-sm mt-1">Last updated 3 mins ago</p>
                            </div>
                        </div>
                        <div onClick={() => navigate('/destination/goa')} role="link" tabIndex={0} onKeyDown={(event) => event.key === 'Enter' && navigate('/destination/goa')} className="w-[300px] cursor-pointer overflow-hidden rounded-3xl border border-slate-100 bg-white p-3 text-center shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl group">
                            <LazyVideo src="https://videos.pexels.com/video-files/4440816/4440816-hd_1920_1080_25fps.mp4" webmSrc="/videos/goa.webm" className="mx-auto h-[220px] w-full group-hover:scale-105 transition" label="Goa beach travel" />
                            <div className="mt-4">
                                <h4 className="font-bold text-black text-2xl">Goa</h4>
                                <p className="text-gray-500 text-sm mt-1">Last updated 5 mins ago</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-row justify-around gap-6 flex-wrap items-center my-14">
                        <div onClick={() => navigate('/destination/kashmir')} role="link" tabIndex={0} onKeyDown={(event) => event.key === 'Enter' && navigate('/destination/kashmir')} className="hidden w-[300px] cursor-pointer overflow-hidden rounded-3xl border border-slate-100 bg-white p-3 text-center shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl md:block group">
                            <LazyVideo src="https://videos.pexels.com/video-files/13750318/13750318-sd_640_360_30fps.mp4" webmSrc="/videos/kashmir.webm" className="mx-auto h-[220px] w-full group-hover:scale-105 transition" label="Kashmir mountains" />
                            <div className="mt-4">
                                <h4 className="font-bold text-black text-2xl">Kashmir</h4>
                                <p className="text-gray-500 text-sm mt-1">Last updated 8 mins ago</p>
                            </div>
                        </div>
                        <div className="text-center px-4 max-w-md">
                            <h2 className="text-4xl font-black mb-4 text-black leading-tight">Explore the <span className="text-blue-600 block">World's Best places</span></h2>
                            <h5 className="text-lg font-medium text-gray-600">Discover exceptional accommodations in over 180 countries, with 13 million reviews to guide you.</h5>
                        </div>
                        <div onClick={() => navigate('/destination/chandigarh')} role="link" tabIndex={0} onKeyDown={(event) => event.key === 'Enter' && navigate('/destination/chandigarh')} className="hidden w-[300px] cursor-pointer overflow-hidden rounded-3xl border border-slate-100 bg-white p-3 text-center shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl md:block group">
                            <LazyVideo src="https://videos.pexels.com/video-files/12726493/12726493-sd_640_360_30fps.mp4" className="mx-auto h-[220px] w-full group-hover:scale-105 transition" label="Chandigarh travel" />
                            <div className="mt-4">
                                <h4 className="font-bold text-black text-2xl">Chandigarh</h4>
                                <p className="text-gray-500 text-sm mt-1">Last updated 1 mins ago</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-row justify-around gap-6 flex-wrap items-center">
                        <div onClick={() => navigate('/destination/assam')} role="link" tabIndex={0} onKeyDown={(event) => event.key === 'Enter' && navigate('/destination/assam')} className="w-[300px] cursor-pointer overflow-hidden rounded-3xl border border-slate-100 bg-white p-3 text-center shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl group">
                            <LazyVideo src="https://videos.pexels.com/video-files/5617394/5617394-sd_640_360_25fps.mp4" webmSrc="/videos/assam.webm" className="mx-auto h-[220px] w-full group-hover:scale-105 transition" label="Assam travel" />
                            <div className="mt-4">
                                <h4 className="font-bold text-black text-2xl">Assam</h4>
                                <p className="text-gray-500 text-sm mt-1">Last updated 26 mins ago</p>
                            </div>
                        </div>
                        <div onClick={() => navigate('/destination/mumbai')} role="link" tabIndex={0} onKeyDown={(event) => event.key === 'Enter' && navigate('/destination/mumbai')} className="w-[300px] cursor-pointer overflow-hidden rounded-3xl border border-slate-100 bg-white p-3 text-center shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl group">
                            <LazyVideo src="https://videos.pexels.com/video-files/8361011/8361011-sd_640_360_24fps.mp4" webmSrc="/videos/mumbai.webm" className="mx-auto h-[220px] w-full group-hover:scale-105 transition" label="Mumbai city" />
                            <div className="mt-4">
                                <h4 className="font-bold text-black text-2xl">Mumbai</h4>
                                <p className="text-gray-500 text-sm mt-1">Last updated 10 mins ago</p>
                            </div>
                        </div>
                        <div onClick={() => navigate('/destination/delhi')} role="link" tabIndex={0} onKeyDown={(event) => event.key === 'Enter' && navigate('/destination/delhi')} className="w-[300px] cursor-pointer overflow-hidden rounded-3xl border border-slate-100 bg-white p-3 text-center shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl group">
                            <LazyVideo src="https://videos.pexels.com/video-files/3243946/3243946-sd_640_360_30fps.mp4" webmSrc="/videos/delhi.webm" className="mx-auto h-[220px] w-full group-hover:scale-105 transition" label="Delhi travel" />
                            <div className="mt-4">
                                <h4 className="font-bold text-black text-2xl">Delhi</h4>
                                <p className="text-gray-500 text-sm mt-1">Last updated 3 mins ago</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Where to ── */}
                <section className="mx-auto my-12 grid max-w-6xl gap-4 px-4 sm:grid-cols-2 lg:grid-cols-4">
                    <a href="https://www.google.com/travel/hotels" target="_blank" rel="noreferrer" className="group rounded-2xl bg-[#05203c] p-5 text-white shadow-lg transition hover:-translate-y-1 hover:bg-[#12385c]"><Hotel className="mb-6 text-cyan-300" size={27} /><h3 className="text-xl font-black">Comparison</h3><p className="mt-2 text-sm text-white/70">Compare hotel options and prices.</p></a>
                    <a href="https://www.airbnb.co.in/india/stays" target="_blank" rel="noreferrer" className="group rounded-2xl bg-[#05203c] p-5 text-white shadow-lg transition hover:-translate-y-1 hover:bg-[#12385c]"><Hotel className="mb-6 text-rose-300" size={27} /><h3 className="text-xl font-black">Airbnb</h3><p className="mt-2 text-sm text-white/70">Find stays with local character.</p></a>
                    <a href="https://www.uber.com/in/en/" target="_blank" rel="noreferrer" className="group rounded-2xl bg-[#05203c] p-5 text-white shadow-lg transition hover:-translate-y-1 hover:bg-[#12385c]"><CarFront className="mb-6 text-amber-300" size={27} /><h3 className="text-xl font-black">Car hire</h3><p className="mt-2 text-sm text-white/70">Plan simple travel around town.</p></a>
                    <Link to="/travel-plans" className="group rounded-2xl bg-[#05203c] p-5 text-white shadow-lg transition hover:-translate-y-1 hover:bg-[#12385c]"><PlaneTakeoff className="mb-6 text-violet-300" size={27} /><h3 className="text-xl font-black">Flights</h3><p className="mt-2 text-sm text-white/70">Check airports and flight details.</p></Link>
                </section>

                {/* ── Roamies ── */}
                <div className="bg-[linear-gradient(145deg,black_50%,rgb(63,128,128)_50%)] py-20 px-10 flex flex-col md:flex-row items-center justify-around overflow-hidden text-white" id="Roamie">
                    <div className="flex-1 mb-10 md:mb-0 p-4">
                        <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight"><span className="text-cyan-400 block mb-2">Small group tours</span>in epic places.</h1>
                        <h4 className="text-xl font-medium text-gray-200 leading-relaxed max-w-lg">Explore somewhere new, with a ready-made crew! <br /><br />Adventurous tours, with local guides, and sociable hostels.</h4>
                        <Link to="/roamies">
                            <button className="mt-8 px-10 py-3 text-lg font-bold bg-blue-500 hover:bg-blue-700 text-white border-2 border-blue-700 rounded-xl hover:scale-105 shadow-[0_4px_8px_rgba(0,0,0,0.3)] transition duration-300">Show me</button>
                        </Link>
                    </div>
                    <div className="flex-1 flex justify-center gap-4 flex-col">
                        <div className="flex gap-4">
                            <img loading="lazy" decoding="async" className="w-1/2 h-[170px] md:h-[220px] rounded-2xl object-cover shadow-lg hover:scale-105 transition" src="https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=900&q=80" alt="Alaska mountains" />
                            <img loading="lazy" decoding="async" className="w-1/2 h-[170px] md:h-[220px] rounded-2xl object-cover shadow-lg hover:scale-105 transition" src="https://cdn.clippingpath.in/wp-content/uploads/2018/11/adult-blur-camera-368893.jpg" alt="Camera" />
                        </div>
                        <div className="flex gap-4">
                            <img loading="lazy" decoding="async" className="w-1/2 h-[170px] md:h-[220px] rounded-2xl object-cover shadow-lg hover:scale-105 transition" src="https://images.pexels.com/photos/14934581/pexels-photo-14934581.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Caravan" />
                            <img loading="lazy" decoding="async" className="w-1/2 h-[170px] md:h-[220px] rounded-2xl object-cover shadow-lg hover:scale-105 transition" src="https://images.pexels.com/photos/6978442/pexels-photo-6978442.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load" alt="Travel" />
                        </div>
                    </div>
                </div>

                {/* ── Interactive Globe ── */}
                <DeferredGlobe />

                {/* ── Blogs ── */}
                <TravelJournal />

                {/* ── Community ── */}
                <div className="relative z-10 bg-[#528295] px-10 pb-32 pt-20 text-center text-white" id="Aboutus" style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 3.5rem), 0 100%)' }}>
                    <h2 className="text-4xl font-bold mb-4 drop-shadow-md">Join Our Community!</h2>
                    <div className="mb-8 text-xl font-medium">Sign up to DreamscapeWorld for Extra Offers and benefits!</div>
                    <div className="flex justify-center max-w-md mx-auto">
                        <form onSubmit={subscribeCommunity} className="flex w-full overflow-hidden rounded-xl shadow-2xl bg-white border border-transparent focus-within:border-blue-500 transition">
                            <input value={communityEmail} onChange={(event) => setCommunityEmail(event.target.value)} className="flex-1 px-5 py-4 text-black outline-none font-medium text-lg" type="email" placeholder="Your email address" required />
                            <button className="bg-black text-white px-8 py-4 font-bold text-xl hover:bg-gray-800 transition">→</button>
                        </form>
                    </div>
                    {communityStatus && <p className="mx-auto mt-4 max-w-md rounded-xl bg-white/15 px-4 py-3 font-bold">{communityStatus}</p>}
                    <div className="text-sm max-w-xl mx-auto mt-8 text-gray-100 opacity-80">
                        Just so you know, we’ll be able to see if you receive and open our emails to help us monitor the success of our campaigns.
                    </div>
                </div>
            </div>

            <TripChatWidget />
        </PageLayout>
    );
}
