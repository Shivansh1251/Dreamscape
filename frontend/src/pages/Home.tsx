import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { LoaderCircle, Search } from 'lucide-react';
import { PageLayout } from '../components/PageLayout';
import { DeferredGlobe } from '../components/DeferredGlobe';
import { TravelJournal } from '../components/TravelJournal';

export function Home() {
    const navigate = useNavigate();
    const [location, setLocation] = useState('Spain');
    const [isSearching, setIsSearching] = useState(false);

    const openDestination = () => {
        const destination = location.trim();
        if (!destination || isSearching) return;
        setIsSearching(true);
        window.setTimeout(() => {
            navigate(destination.toLowerCase() === 'spain' ? '/spain' : `/destination/${encodeURIComponent(destination)}`);
        }, 700);
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
            </form>
        </div>
    );

    return (
        <PageLayout
            videoSrc="https://videos.pexels.com/video-files/4525107/4525107-uhd_2560_1440_24fps.mp4"
            headerContent={SearchForm}
            connectedFooter
        >
            <div className="bg-gray-50 text-gray-900 pb-0">

                {/* ── Perks ── */}
                <div className="flex flex-row gap-2 justify-center items-center py-6 bg-white border-b border-gray-200">
                    <img width="25" height="24" src="https://a.hwstatic.com/raw/upload/f_auto,q_auto/wds/illustrations/sm/calendar-confirmation.svg" alt="icon" />
                    <p className="m-0 text-gray-800"><b>Free Cancellation</b> & <b>Flexible Booking</b> available</p>
                </div>

                {/* ── Places Grid ── */}
                <div className="py-12 px-4 max-w-7xl mx-auto">
                    <div className="flex flex-row justify-around gap-6 flex-wrap items-center">
                        <Link to="/spain" className="no-underline group">
                            <div className="w-[260px] bg-white rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.1)] p-4 text-center hover:-translate-y-2 transition duration-300">
                                <video width="200" height="200" src="https://media.istockphoto.com/id/465600686/video/people-in-the-city-center-of-madrid.mp4?s=mp4-640x640-is&k=20&c=HpjT2EYQ7qP9gtskw4-OfPjlZlwF6d9-y1y8zHV4Brg=" autoPlay loop muted playsInline preload="none" className="rounded-xl mx-auto object-cover group-hover:scale-105 transition" />
                                <div className="mt-4">
                                    <h4 className="font-bold text-black text-2xl">Spain</h4>
                                    <p className="text-gray-500 text-sm mt-1">Last updated 1 hr ago</p>
                                </div>
                            </div>
                        </Link>
                        <div onClick={() => navigate('/destination/italy')} role="link" tabIndex={0} onKeyDown={(event) => event.key === 'Enter' && navigate('/destination/italy')} className="w-[260px] cursor-pointer bg-white rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.1)] p-4 text-center group">
                            <video width="200" height="200" src="https://videos.pexels.com/video-files/3381844/3381844-hd_1920_1080_30fps.mp4" autoPlay loop muted playsInline preload="none" className="rounded-xl mx-auto object-cover group-hover:scale-105 transition" />
                            <div className="mt-4">
                                <h4 className="font-bold text-black text-2xl">Italy</h4>
                                <p className="text-gray-500 text-sm mt-1">Last updated 3 mins ago</p>
                            </div>
                        </div>
                        <div onClick={() => navigate('/destination/goa')} role="link" tabIndex={0} onKeyDown={(event) => event.key === 'Enter' && navigate('/destination/goa')} className="w-[260px] cursor-pointer bg-white rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.1)] p-4 text-center group">
                            <video width="200" height="200" src="https://videos.pexels.com/video-files/4440816/4440816-hd_1920_1080_25fps.mp4" autoPlay loop muted playsInline preload="none" className="rounded-xl mx-auto object-cover group-hover:scale-105 transition" />
                            <div className="mt-4">
                                <h4 className="font-bold text-black text-2xl">Goa</h4>
                                <p className="text-gray-500 text-sm mt-1">Last updated 5 mins ago</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-row justify-around gap-6 flex-wrap items-center my-14">
                        <div onClick={() => navigate('/destination/kashmir')} role="link" tabIndex={0} onKeyDown={(event) => event.key === 'Enter' && navigate('/destination/kashmir')} className="w-[260px] cursor-pointer bg-white rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.1)] p-4 text-center hidden md:block group">
                            <video width="200" height="200" src="https://videos.pexels.com/video-files/13750318/13750318-sd_640_360_30fps.mp4" autoPlay loop muted playsInline preload="none" className="rounded-xl mx-auto object-cover group-hover:scale-105 transition" />
                            <div className="mt-4">
                                <h4 className="font-bold text-black text-2xl">Kashmir</h4>
                                <p className="text-gray-500 text-sm mt-1">Last updated 8 mins ago</p>
                            </div>
                        </div>
                        <div className="text-center px-4 max-w-md">
                            <h2 className="text-4xl font-black mb-4 text-black leading-tight">Explore the <span className="text-blue-600 block">World's Best places</span></h2>
                            <h5 className="text-lg font-medium text-gray-600">Discover exceptional accommodations in over 180 countries, with 13 million reviews to guide you.</h5>
                        </div>
                        <div onClick={() => navigate('/destination/chandigarh')} role="link" tabIndex={0} onKeyDown={(event) => event.key === 'Enter' && navigate('/destination/chandigarh')} className="w-[260px] cursor-pointer bg-white rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.1)] p-4 text-center hidden md:block group">
                            <video width="200" height="200" src="https://videos.pexels.com/video-files/12726493/12726493-sd_640_360_30fps.mp4" autoPlay loop muted playsInline preload="none" className="rounded-xl mx-auto object-cover group-hover:scale-105 transition" />
                            <div className="mt-4">
                                <h4 className="font-bold text-black text-2xl">Chandigarh</h4>
                                <p className="text-gray-500 text-sm mt-1">Last updated 1 mins ago</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-row justify-around gap-6 flex-wrap items-center">
                        <div onClick={() => navigate('/destination/assam')} role="link" tabIndex={0} onKeyDown={(event) => event.key === 'Enter' && navigate('/destination/assam')} className="w-[260px] cursor-pointer bg-white rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.1)] p-4 text-center group">
                            <video width="200" height="200" src="https://videos.pexels.com/video-files/5617394/5617394-sd_640_360_25fps.mp4" autoPlay loop muted playsInline preload="none" className="rounded-xl mx-auto object-cover group-hover:scale-105 transition" />
                            <div className="mt-4">
                                <h4 className="font-bold text-black text-2xl">Assam</h4>
                                <p className="text-gray-500 text-sm mt-1">Last updated 26 mins ago</p>
                            </div>
                        </div>
                        <div onClick={() => navigate('/destination/mumbai')} role="link" tabIndex={0} onKeyDown={(event) => event.key === 'Enter' && navigate('/destination/mumbai')} className="w-[260px] cursor-pointer bg-white rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.1)] p-4 text-center group">
                            <video width="200" height="200" src="https://videos.pexels.com/video-files/8361011/8361011-sd_640_360_24fps.mp4" autoPlay loop muted playsInline preload="none" className="rounded-xl mx-auto object-cover group-hover:scale-105 transition" />
                            <div className="mt-4">
                                <h4 className="font-bold text-black text-2xl">Mumbai</h4>
                                <p className="text-gray-500 text-sm mt-1">Last updated 10 mins ago</p>
                            </div>
                        </div>
                        <div onClick={() => navigate('/destination/delhi')} role="link" tabIndex={0} onKeyDown={(event) => event.key === 'Enter' && navigate('/destination/delhi')} className="w-[260px] cursor-pointer bg-white rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.1)] p-4 text-center group">
                            <video width="200" height="200" src="https://videos.pexels.com/video-files/3243946/3243946-sd_640_360_30fps.mp4" autoPlay loop muted playsInline preload="none" className="rounded-xl mx-auto object-cover group-hover:scale-105 transition" />
                            <div className="mt-4">
                                <h4 className="font-bold text-black text-2xl">Delhi</h4>
                                <p className="text-gray-500 text-sm mt-1">Last updated 3 mins ago</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Where to ── */}
                <div className="flex flex-row justify-center gap-6 my-10 hidden md:flex">
                    <a href="https://www.booking.com/"><button className="bg-[#05203c] text-white font-bold h-[50px] w-[200px] rounded-xl hover:bg-[#1a385b] transition">Comparison</button></a>
                    <a href="https://www.airbnb.co.in/india/stays"><button className="bg-[#05203c] text-white font-bold h-[50px] w-[200px] rounded-xl hover:bg-[#1a385b] transition">Airbnb</button></a>
                    <a href="https://www.uber.com/in/en/"><button className="bg-[#05203c] text-white font-bold h-[50px] w-[200px] rounded-xl hover:bg-[#1a385b] transition">Car hire</button></a>
                    <Link to="/travel-plans"><button className="bg-[#05203c] text-white font-bold h-[50px] w-[200px] rounded-xl hover:bg-[#1a385b] transition">Flights</button></Link>
                </div>

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
                            <img className="w-1/2 h-[170px] md:h-[220px] rounded-2xl object-cover shadow-lg hover:scale-105 transition" src="https://dailywildlifephoto.nathab.com/photography-guide/wp-content/uploads/2016/05/alaska-1-940x627.jpg" alt="Alaksa" />
                            <img className="w-1/2 h-[170px] md:h-[220px] rounded-2xl object-cover shadow-lg hover:scale-105 transition" src="https://cdn.clippingpath.in/wp-content/uploads/2018/11/adult-blur-camera-368893.jpg" alt="Camera" />
                        </div>
                        <div className="flex gap-4">
                            <img className="w-1/2 h-[170px] md:h-[220px] rounded-2xl object-cover shadow-lg hover:scale-105 transition" src="https://images.pexels.com/photos/14934581/pexels-photo-14934581.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Caravan" />
                            <img className="w-1/2 h-[170px] md:h-[220px] rounded-2xl object-cover shadow-lg hover:scale-105 transition" src="https://images.pexels.com/photos/6978442/pexels-photo-6978442.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load" alt="Travel" />
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
                        <form className="flex w-full overflow-hidden rounded-xl shadow-2xl bg-white border border-transparent focus-within:border-blue-500 transition">
                            <input className="flex-1 px-5 py-4 text-black outline-none font-medium text-lg" type="email" placeholder="Your email address" required />
                            <button className="bg-black text-white px-8 py-4 font-bold text-xl hover:bg-gray-800 transition">→</button>
                        </form>
                    </div>
                    <div className="text-sm max-w-xl mx-auto mt-8 text-gray-100 opacity-80">
                        Just so you know, we’ll be able to see if you receive and open our emails to help us monitor the success of our campaigns.
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}
