import { useState } from 'react';
import { PageLayout } from '../components/PageLayout';

export function Roamies() {
    const [activeTab, setActiveTab] = useState('asia');

    return (
        <PageLayout showFooter={true}>
            <div className="font-sans antialiased overflow-x-hidden relative bg-black">
                {/* ── Background Image Layer ── */}
                <div className="fixed inset-0 z-0 bg-[url('/Imgaes/dive.jpg')] bg-cover bg-center brightness-[0.6] select-none" />

                {/* ── Hero Section ── */}
                <div className="relative z-10 mx-auto flex min-h-[560px] w-full max-w-5xl flex-col items-center justify-center gap-6 px-5 pb-16 pt-28 text-center text-white sm:px-8">
                    <p className="rounded-full bg-white/15 px-4 py-2 text-sm font-bold uppercase tracking-[0.2em] backdrop-blur-md">Small-group adventures</p>
                    <h1 className="font-black text-5xl drop-shadow-xl sm:text-6xl">Dreamscape Roamies</h1>
                    <p className="max-w-3xl font-black text-4xl leading-tight drop-shadow-xl md:text-6xl">Are you ready for an adventure?</p>
                    <span className="max-w-xl text-xl font-medium drop-shadow-lg sm:text-2xl">Explore epic places with new faces, local guides, and a ready-made crew.</span>
                    <a href="#lesgo" className="mt-4 inline-block mx-auto">
                        <button className="h-[46px] px-8 rounded-xl font-bold border-none text-white bg-[#E0008E] hover:bg-[#c3007b] hover:scale-105 transition shadow-[0_2px_16px_rgba(83,80,241,0.5)]">
                            Let's go!
                        </button>
                    </a>
                </div>

                {/* ── Content ── */}
                <div className="relative z-10 w-full pt-10">
                    <div className="absolute left-0 right-0 z-10 hidden w-full bg-[#c4ff4c] px-10 py-14 text-center text-lg font-bold text-[#2b4c06] md:block"
                        style={{ clipPath: 'polygon(0.09rem 100%, 100% 0, 100% 100%, 0 100%)' }}>
                        Travel with a friendly crew, stay in sociable hostels, and make every stop feel like a story worth sharing.
                    </div>

                    <div className="relative z-20 w-full bg-[#5350F1] px-5 py-12 sm:px-8 md:p-20"
                        style={{ clipPath: 'polygon(0 3.5rem, 100% 0, 100% 100%, 0 100%)' }}>
                        <div className="flex flex-col text-white my-10 max-w-7xl mx-auto">

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

                    {/* ── Go Part ── */}
                    <div id="lesgo" className="relative z-30 bg-[#0d0f1a] text-white w-full px-[5%] md:px-[12%] pb-20 pt-[100px]"
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
                    <div className="bg-[#5350F1] w-full pt-[50px] pb-10" style={{ clipPath: 'polygon(1 3.5rem, 100% 0, 100% 100%, 0 100%)', marginTop: '-50px', zIndex: 2, position: 'relative' }}>
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

                </div>
            </div>
        </PageLayout>
    );
}
