import { useEffect, useState } from 'react';
import { UserCheck, UserPlus } from 'lucide-react';
import { PageLayout } from '../components/PageLayout';
import { RoamieConnection, connectRoamie, disconnectRoamie, getConnections, onAppDataChange } from '../lib/appData';
import { SphereImageGrid, SphereImage } from '../components/ui/img-sphere';

const ROAMIE_PROFILES: Array<Omit<RoamieConnection, 'connectedAt'>> = [
    { id: 'maya-goa', name: 'Maya Shah', handle: '@mayawanders', city: 'Mumbai', interests: ['Food', 'Beaches', 'Photos'], bio: 'Slow mornings, local markets, and never saying no to a beach sunset.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80' },
    { id: 'arjun-delhi', name: 'Arjun Mehta', handle: '@arjunontheroad', city: 'Delhi', interests: ['Culture', 'Hiking', 'Coffee'], bio: 'Always looking for the next trail and a great café at the end of it.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80' },
    { id: 'sofia-bcn', name: 'Sofia Costa', handle: '@sofiagoes', city: 'Barcelona', interests: ['Art', 'Nightlife', 'Food'], bio: 'Museum days, live music nights, and sharing the best table in town.', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80' },
];

export function Roamies() {
    const [activeTab, setActiveTab] = useState('asia');
    const [connections, setConnections] = useState<RoamieConnection[]>(getConnections);

    useEffect(() => onAppDataChange(() => setConnections(getConnections())), []);

    const isConnected = (id: string) => connections.some(connection => connection.id === id);
    const toggleConnection = (roamie: Omit<RoamieConnection, 'connectedAt'>) => {
        if (isConnected(roamie.id)) disconnectRoamie(roamie.id);
        else connectRoamie(roamie);
    };

    const roamieSphereImages: SphereImage[] = [
        { id: 'maya', src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80', alt: 'Maya, traveller', title: 'Maya', description: 'Always up for a sunset walk.' },
        { id: 'arjun', src: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80', alt: 'Arjun, traveller', title: 'Arjun', description: 'Chasing trails and great coffee.' },
        { id: 'sofia', src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80', alt: 'Sofia, traveller', title: 'Sofia', description: 'Museums by day, live music by night.' },
        { id: 'traveller-one', src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80', alt: 'Traveller portrait', title: 'Alex' },
        { id: 'traveller-two', src: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80', alt: 'Traveller portrait', title: 'Nina' },
        { id: 'traveller-three', src: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80', alt: 'Traveller portrait', title: 'Leo' },
        { id: 'traveller-four', src: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=300&q=80', alt: 'Traveller portrait', title: 'Aisha' },
        { id: 'traveller-five', src: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80', alt: 'Traveller portrait', title: 'Ella' },
        { id: 'traveller-six', src: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80', alt: 'Traveller portrait', title: 'Sam' },
        { id: 'traveller-seven', src: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80', alt: 'Traveller portrait', title: 'Riya' },
        { id: 'traveller-eight', src: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&w=300&q=80', alt: 'Traveller portrait', title: 'Daniel' },
        { id: 'traveller-nine', src: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=300&q=80', alt: 'Traveller portrait', title: 'Zoe' },
        { id: 'traveller-ten', src: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=300&q=80', alt: 'Traveller portrait', title: 'Priya' },
        { id: 'traveller-eleven', src: 'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=300&q=80', alt: 'Traveller portrait', title: 'Noah' },
    ];

    return (
        <PageLayout showFooter={true}>
            <div className="font-sans antialiased overflow-x-hidden relative bg-[#5350F1]">
                {/* ── Background Image Layer ── */}
                <div className="fixed inset-0 z-0 bg-[url('/Imgaes/dive.jpg')] bg-cover bg-center brightness-[0.6] select-none" />

                {/* ── Hero Section ── */}
                <div className="relative z-10 mx-auto flex min-h-[560px] w-full max-w-none flex-col items-center justify-center gap-6 px-5 pb-24 pt-28 text-center text-white sm:px-8" style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 3.5rem), 0 100%)' }}>
                    <h1 className="font-black text-5xl drop-shadow-xl sm:text-6xl">Dreamscape Roamies</h1>
                    <p className="max-w-none whitespace-normal font-black text-3xl leading-tight drop-shadow-xl sm:text-5xl md:whitespace-nowrap md:text-6xl">Are you ready for an adventure?</p>
                    <span className="max-w-xl text-xl font-medium drop-shadow-lg sm:text-2xl">Explore epic places with new faces, local guides, and a ready-made crew.</span>
                    <a href="#lesgo" className="mt-4 inline-block mx-auto">
                        <button className="h-[46px] px-8 rounded-xl font-bold border-none text-white bg-[#E0008E] hover:bg-[#c3007b] hover:scale-105 transition shadow-[0_2px_16px_rgba(83,80,241,0.5)]">
                            Let's go!
                        </button>
                    </a>
                </div>

                {/* ── Content ── */}
                <section className="relative z-20 mx-auto -mt-8 w-[min(1120px,calc(100%_-_2rem))] rounded-[2rem] bg-white p-6 text-slate-900 shadow-2xl sm:p-8">
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <div><p className="text-sm font-black uppercase tracking-[0.18em] text-[#5350F1]">Meet your crew</p><h2 className="mt-1 text-3xl font-black">Connect with Roamies</h2><p className="mt-2 max-w-2xl text-slate-600">Choose travelers whose style fits your next adventure. Your connections are saved to your dashboard.</p></div>
                        <span className="rounded-full bg-[#5350F1]/10 px-4 py-2 text-sm font-black text-[#5350F1]">{connections.length} connection{connections.length === 1 ? '' : 's'}</span>
                    </div>
                    <div className="mt-6 grid gap-4 md:grid-cols-3">
                        {ROAMIE_PROFILES.map(roamie => {
                            const connected = isConnected(roamie.id);
                            return <article key={roamie.id} className="rounded-2xl border border-slate-200 p-4"><div className="flex items-center gap-3"><img src={roamie.avatar} alt="" className="h-12 w-12 rounded-full object-cover" /><div><h3 className="font-black">{roamie.name}</h3><p className="text-sm text-slate-500">{roamie.handle} · {roamie.city}</p></div></div><p className="mt-3 text-sm leading-6 text-slate-600">{roamie.bio}</p><p className="mt-3 text-xs font-bold uppercase tracking-wide text-[#5350F1]">{roamie.interests.join(' · ')}</p><button onClick={() => toggleConnection(roamie)} className={`mt-4 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-black transition ${connected ? 'bg-emerald-100 text-emerald-700 hover:bg-rose-100 hover:text-rose-700' : 'bg-[#5350F1] text-white hover:bg-[#3f3cce]'}`}>{connected ? <><UserCheck size={16} /> Connected</> : <><UserPlus size={16} /> Connect</>}</button></article>;
                        })}
                    </div>
                </section>

                <div className="relative z-10 mt-8 w-full bg-[url('/Imgaes/dive.jpg')] bg-cover bg-center pt-6">
                    <div className="absolute left-0 right-0 z-10 hidden w-full bg-[#c4ff4c] px-10 py-14 text-center text-lg font-bold text-[#2b4c06] md:block"
                        style={{ clipPath: 'polygon(0.09rem 100%, 100% 0, 100% 100%, 0 100%)' }}>
                        Travel with a friendly crew, stay in sociable hostels, and make every stop feel like a story worth sharing.
                    </div>

                    <div className="relative z-20 w-full bg-[#5350F1] px-5 pb-16 pt-12 sm:px-8 md:px-20 md:pb-20 md:pt-12"
                        style={{ clipPath: 'polygon(0 3.5rem, 100% 0, 100% 100%, 0 100%)' }}>
                        <div className="mx-auto my-4 flex max-w-7xl flex-col text-white md:my-6">

                            <div className="mx-auto mt-8 grid max-w-6xl gap-10 md:grid-cols-2 md:gap-16">
                                <div className="flex flex-col flex-1 gap-6">
                                    <h1 className="font-black text-4xl md:text-5xl leading-tight">Wait, what is Roamies?</h1>
                                    <p className="text-lg leading-relaxed font-medium">
                                        If you’re ready to explore somewhere new, with a ready-made crew - Roamies is for you!<br /><br />
                                        They’re small-group tours filled with adventurous people just like you! Travel to places you’ve only dreamt of exploring while staying in some of the world’s best hostels.
                                        Local guides will make sure you’re as immersed in local life as can be, plus you’ll have the flexibility of doing your own thing too.
                                    </p>
                                </div>
                                <div className="flex flex-col flex-1 gap-6">
                                    <h1 className="font-black text-4xl md:text-5xl leading-tight">Roamies travel – Is it for you?</h1>
                                    <p className="text-lg leading-relaxed font-medium">
                                        On these tours, we travel to the most talked-about places and the lesser-known local spots, with the flexibility to do your own thing.
                                        It’s the legit backpacking experience, staying in sociable hostels and getting to the heart of everywhere we travel.<br /><br />
                                        G Adventures know a thing or two about locally guided small group travel, and we like to think hostelling is in our DNA.
                                    </p>
                                </div>
                            </div>

                            <div className="mx-auto mt-20 grid max-w-6xl gap-10 md:grid-cols-3">
                                {[
                                    { img: 'https://images.pexels.com/photos/757435/pexels-photo-757435.jpeg?auto=compress&cs=tinysrgb&w=600', title: 'Local Guides', p: 'It’s like travelling with a knowledgeable friend...' },
                                    { img: 'https://images.pexels.com/photos/696214/pexels-photo-696214.jpeg?auto=compress&cs=tinysrgb&w=600', title: 'Sociable hostels', p: 'If staying in hostels is new for you, let us show you how welcoming they can be.' },
                                    { img: 'https://images.pexels.com/photos/5137967/pexels-photo-5137967.jpeg?auto=compress&cs=tinysrgb&w=600', title: 'Budget friendly', p: 'We’ve kept costs as low as they can go, while paying people fairly.' }
                                ].map(feat => (
                                    <div key={feat.title} className="flex flex-col gap-4 flex-1 items-center text-center">
                                        <div className="h-[220px] w-full overflow-hidden rounded-3xl shadow-[0_10px_20px_rgba(0,0,0,0.3)] sm:h-[260px]">
                                            <img src={feat.img} loading="lazy" className="h-full w-full object-cover hover:scale-110 transition duration-500" alt={feat.title} />
                                        </div>
                                        <h3 className="text-3xl font-black mt-2">{feat.title}</h3>
                                        <p className="font-medium text-lg text-white/90">{feat.p}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="relative z-20 h-14 w-full bg-[#5350F1]" aria-hidden="true" />

                    {/* ── Go Part ── */}
                    <div id="lesgo" className="relative z-30 -mt-14 bg-[#0d0f1a] text-white w-full px-[5%] pb-20 pt-[100px] md:px-[12%]"
                        style={{ clipPath: 'polygon(0 3.5rem, 100% 0, 100% calc(100% - 3.5rem), 0 100%)' }}>
                        <div className="text-center max-w-4xl mx-auto">
                            <h1 className="font-black text-5xl md:text-6xl mb-6">Where's your adventure?</h1>
                            <p className="text-xl font-medium text-gray-300">Maybe you know where you want to go, or maybe it’s put a pin in the map time. Have a scroll through these handcrafted trips and remember there is no wrong option; adventure is guaranteed.</p>

                            <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                {[
                                    { id: 'asia', icon: 'fa-earth-asia', title: 'Asia', tours: '12 Tours' },
                                    { id: 'europe', icon: 'fa-earth-europe', title: 'Europe', tours: '13 Tours' },
                                    { id: 'south_america', icon: 'fa-earth-americas', title: 'South America', tours: '4 Tours' },
                                    { id: 'central', icon: 'fa-earth-americas', title: 'Central America', tours: '8 Tours' }
                                ].map(tab => (
                                    <li key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full border-2 rounded-2xl p-5 cursor-pointer transition-all duration-300 ${activeTab === tab.id ? 'border-[#5350F1] text-[#5350F1] scale-[1.03] shadow-xl bg-white' : 'border-white/20 bg-white/5 hover:border-[#5350F1] hover:bg-white/10 text-white hover:text-white hover:scale-[1.03]'}`}>
                                        <div className="font-black text-xl mb-1">{tab.title}</div>
                                        <div className="text-sm font-medium opacity-80">{tab.tours} Available</div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="mt-16 max-w-7xl mx-auto min-h-[500px]">
                            {activeTab === 'asia' && (
                                <div className="flex flex-col items-center animate-fade-in">
                                    <div className="relative mb-6 rounded-[2rem] overflow-hidden group w-full max-w-[1150px]">
                                        <span className="absolute top-6 left-6 bg-black/60 backdrop-blur-md text-white font-bold px-6 py-2 rounded-full z-10 group-hover:bg-black/90 transition text-lg shadow-lg border border-white/10">DisneyLand</span>
                                        <img src="https://cdn1.parksmedia.wdprapps.disney.com/resize/mwImage/1/3840/2160/75/vision-dam/digital/parks-platform/parks-global-assets/disneyland/events/halloween/disneyland-halloween-16x9-16x9.jpg" className="w-full max-h-[600px] object-cover group-hover:scale-105 transition duration-500" alt="" />
                                    </div>
                                    <div className="flex flex-col md:flex-row justify-between w-full max-w-[1150px] gap-6">
                                        <div className="relative flex-1 rounded-[2rem] overflow-hidden group">
                                            <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white font-bold p-3 rounded-full z-10 group-hover:bg-black/90 transition text-sm shadow-lg border border-white/10">Beautiful Park</span>
                                            <img src="https://images.pexels.com/photos/441379/pexels-photo-441379.jpeg?auto=compress&cs=tinysrgb&w=600" className="w-full h-[300px] object-cover group-hover:scale-105 transition duration-500" alt="" />
                                        </div>
                                        <div className="relative flex-1 rounded-[2rem] overflow-hidden group">
                                            <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white font-bold p-3 rounded-full z-10 group-hover:bg-black/90 transition text-sm shadow-lg border border-white/10">Sports</span>
                                            <img src="https://images.pexels.com/photos/1435537/pexels-photo-1435537.jpeg?auto=compress&cs=tinysrgb&w=600" className="w-full h-[300px] object-cover group-hover:scale-105 transition duration-500" alt="" />
                                        </div>
                                        <div className="relative flex-1 rounded-[2rem] overflow-hidden group">
                                            <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white font-bold p-3 rounded-full z-10 group-hover:bg-black/90 transition text-sm shadow-lg border border-white/10">Urban Life</span>
                                            <img src="https://cdn1.parksmedia.wdprapps.disney.com/resize/mwImage/1/706/706/75/media/testopt/homepage-uplift/u6/dlr-story-destination-4.jpg?r=12408u6" className="w-full h-[300px] object-cover group-hover:scale-105 transition duration-500" alt="" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {(activeTab === 'europe' || activeTab === 'central') && (
                                <div className="flex flex-col items-center animate-fade-in">
                                    {/* ... same structure as asia ... */}
                                    <div className="relative mb-6 rounded-[2rem] overflow-hidden group w-full max-w-[1150px]">
                                        <span className="absolute top-6 left-6 bg-black/60 backdrop-blur-md text-white font-bold px-6 py-2 rounded-full z-10 group-hover:bg-black/90 transition text-lg shadow-lg border border-white/10">Europe Classic</span>
                                        <img src="https://static.toiimg.com/photo/msid-87137761,width-96,height-65.cms" className="w-full max-h-[600px] object-cover group-hover:scale-105 transition duration-500" alt="" />
                                    </div>
                                    <div className="flex flex-col md:flex-row justify-between w-full max-w-[1150px] gap-6">
                                        <div className="relative flex-1 rounded-[2rem] overflow-hidden group">
                                            <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white font-bold p-3 rounded-full z-10 group-hover:bg-black/90 transition text-sm">Lakes</span>
                                            <img src="https://images.travelandleisureasia.com/wp-content/uploads/sites/2/2023/11/20122038/ljublianica.jpeg" className="w-full h-[300px] object-cover group-hover:scale-105 transition duration-500" alt="" />
                                        </div>
                                        <div className="relative flex-1 rounded-[2rem] overflow-hidden group">
                                            <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white font-bold p-3 rounded-full z-10 group-hover:bg-black/90 transition text-sm">Nature's Bliss</span>
                                            <img src="https://assets.bwbx.io/images/users/iqjWHBFdfxIU/itiU.jJleW1I/v4/-1x-1.webp" className="w-full h-[300px] object-cover group-hover:scale-105 transition duration-500" alt="" />
                                        </div>
                                        <div className="relative flex-1 rounded-[2rem] overflow-hidden group">
                                            <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white font-bold p-3 rounded-full z-10 group-hover:bg-black/90 transition text-sm">Artifacts</span>
                                            <img src="https://i.gocollette.com/img/destination-page/europe/europe-continent/europe-ms2.jpg" className="w-full h-[300px] object-cover group-hover:scale-105 transition duration-500" alt="" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'south_america' && (
                                <div className="flex flex-col items-center animate-fade-in">
                                    <div className="relative mb-6 rounded-[2rem] overflow-hidden group w-full max-w-[1150px]">
                                        <span className="absolute top-6 left-6 bg-black/60 backdrop-blur-md text-white font-bold px-6 py-2 rounded-full z-10 group-hover:bg-black/90 transition text-lg shadow-lg border border-white/10">America</span>
                                        <img src="https://www.nicolelabarge.com/wp-content/uploads/2020/07/south-america-landmarks-6.jpg" className="w-full max-h-[600px] object-cover group-hover:scale-105 transition duration-500" alt="" />
                                    </div>
                                    <div className="flex flex-col md:flex-row justify-between w-full max-w-[1150px] gap-6">
                                        <div className="relative flex-1 rounded-[2rem] overflow-hidden group">
                                            <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white font-bold p-3 rounded-full z-10 group-hover:bg-black/90 transition text-sm">Landmarks</span>
                                            <img src="https://images.pexels.com/photos/20850019/pexels-photo-20850019/free-photo-of-destination-sign-in-a-forest.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" className="w-full h-[300px] object-cover group-hover:scale-105 transition duration-500" alt="" />
                                        </div>
                                        <div className="relative flex-1 rounded-[2rem] overflow-hidden group">
                                            <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white font-bold p-3 rounded-full z-10 group-hover:bg-black/90 transition text-sm">Streets</span>
                                            <img src="https://www.veryhungrynomads.com/wp-content/uploads/2023/08/The-best-places-to-visit-in-South-America.png" className="w-full h-[300px] object-cover group-hover:scale-105 transition duration-500" alt="" />
                                        </div>
                                        <div className="relative flex-1 rounded-[2rem] overflow-hidden group">
                                            <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white font-bold p-3 rounded-full z-10 group-hover:bg-black/90 transition text-sm">Market</span>
                                            <img src="https://images.pexels.com/photos/15286713/pexels-photo-15286713/free-photo-of-motorcycles-parked-on-a-street.jpeg?auto=compress&cs=tinysrgb&w=600" className="w-full h-[300px] object-cover group-hover:scale-105 transition duration-500" alt="" />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── End blue bg ── */}
                    <div className="bg-[#5350F1] w-full pt-[50px] pb-10" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', marginTop: '-50px', zIndex: 2, position: 'relative' }}>
                    </div>

                    {/* ── Included in All ── */}
                    <div className="bg-white w-full pt-[100px] flex flex-col items-center pb-[100px] relative z-10" style={{ clipPath: 'polygon(0 3.5rem, 100% 0, 100% 100%, 0 100%)', marginTop: '-50px' }}>
                        <h1 className="font-black text-5xl md:text-6xl text-gray-900 mb-10 text-center px-4">Included in all tours</h1>

                        <ul className="flex flex-row justify-center flex-wrap gap-4 w-[90%] md:w-[80%] mx-auto mb-16">
                            {['Accommodation', 'Unique Experiences', 'Best of both Worlds', 'People', 'Value'].map(opt => (
                                <a href="#" key={opt}>
                                    <li className="list-none text-black border-2 border-black/20 px-8 py-3 rounded-2xl font-bold bg-[#f9f9f9] hover:bg-[#5350f1] hover:text-white hover:border-[#5350f1] transition shadow-sm hover:shadow-xl hover:-translate-y-1">
                                        {opt}
                                    </li>
                                </a>
                            ))}
                        </ul>

                        <div className="flex flex-col md:flex-row justify-between max-w-6xl mx-auto px-4 gap-12 items-center">
                            <div className="flex-1 flex flex-col gap-6 text-gray-700">
                                <div>
                                    <h4 className="font-black text-2xl text-black mb-1">Best selection of hostels</h4>
                                    <p className="text-lg font-medium">You can relax knowing you're staying at incredible places around the world.</p>
                                </div>
                                <div>
                                    <h4 className="font-black text-2xl text-black mb-1">Hostel activities</h4>
                                    <p className="text-lg font-medium">Hang out with other travellers at party nights, games evenings, and film viewings.</p>
                                </div>
                                <div>
                                    <h4 className="font-black text-2xl text-black mb-1">Hostel facilities</h4>
                                    <p className="text-lg font-medium">Communal kitchens for affordable meal times, washing machines and budget laundry services are often available.</p>
                                </div>
                                <div>
                                    <h4 className="font-black text-2xl text-black mb-1">Room options</h4>
                                    <p className="text-lg font-medium">Freedom to choose the type of room that works perfectly best for you.</p>
                                </div>
                            </div>

                            <div className="flex-1 right flex justify-center">
                                <img src="https://cdn.pixabay.com/photo/2023/01/29/00/16/drums-7751985_1280.jpg" className="w-full max-w-[500px] h-auto rounded-[2rem] shadow-2xl object-cover hover:scale-105 transition duration-500" alt="Community" />
                            </div>
                        </div>
                    </div>

                    <section className="relative z-10 overflow-hidden bg-[#082b42] px-5 py-10 text-center text-white sm:px-8"><div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-3xl" /><h2 className="relative text-3xl font-black sm:text-4xl">Connect with your next travel crew</h2><p className="relative mx-auto mt-2 max-w-xl text-slate-300">Meet curious people who are ready to share the journey.</p><SphereImageGrid images={roamieSphereImages} containerSize={500} sphereRadius={170} className="relative mt-4" /></section>

                </div>
            </div>
        </PageLayout>
    );
}
