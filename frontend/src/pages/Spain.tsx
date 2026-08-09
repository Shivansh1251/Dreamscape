import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { PageLayout } from '../components/PageLayout';

export function Spain() {
    const [catFact, setCatFact] = useState('');

    const fetchCatFact = async () => {
        try {
            const res = await fetch('https://catfact.ninja/fact');
            const data = await res.json();
            setCatFact(data.fact);
        } catch (e) {
            console.error(e);
        }
    };

    const videoTitle = (
        <h1 className="relative z-10 text-white text-5xl flex items-center justify-center gap-3 animate-slide-down pb-2"
            style={{
                background: '-webkit-linear-gradient(90deg,#AD1519,#AD1519,#FABD00,#AD1519,#AD1519)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 'bold',
                textShadow: '0 2px 10px rgba(0,0,0,0.5)'
            }}>
            Discover Spain
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Bandera_de_Espa%C3%B1a.svg/640px-Bandera_de_Espa%C3%B1a.svg.png" alt="" className="h-[35px] w-[45px] rounded border border-white/20 shadow-lg object-cover" />
        </h1>
    );

    const searchForm = (
        <div className="relative z-10 my-[30px] mx-auto rounded-[20px] w-full max-w-4xl p-4 bg-cover shadow-lg border border-white/10"
            style={{ backgroundImage: "linear-gradient(rgba(34, 40, 73, 0.9), rgba(45, 59, 137, 0.9))" }}>
            <form className="flex flex-col md:flex-row items-center justify-evenly w-full gap-2">
                <select id="From" className="h-[42px] px-2 rounded border border-gray-300 text-black w-full md:w-auto shadow-sm">
                    <optgroup label="Cities">
                        <option value="Barcelona">Barcelona</option>
                        <option value="Madrid">Madrid</option>
                        <option value="Seville">Seville</option>
                    </optgroup>
                </select>
                <input type="date" id="fromDate" className="h-[42px] px-2 rounded border border-gray-300 text-black w-full md:w-auto shadow-sm" />
                <input type="date" id="toDate" className="h-[42px] px-2 rounded border border-gray-300 text-black w-full md:w-auto shadow-sm" />
                <input type="number" id="Guests" placeholder="Guests" className="h-[42px] px-2 rounded border border-gray-300 text-black w-full md:w-24 shadow-sm" />
                <Link to="/" className="w-full md:w-auto">
                    <button type="button" className="h-[42px] px-6 bg-[#217caa] text-white border-none rounded cursor-pointer hover:bg-[#f9d5d3] transition w-full md:w-auto flex items-center justify-center gap-2 font-bold shadow-md">
                        Search <Search size={16} />
                    </button>
                </Link>
            </form>
        </div>
    );

    return (
        <PageLayout
            videoSrc="https://videos.pexels.com/video-files/14367734/14367734-uhd_2560_1440_30fps.mp4"
            videoOverlayText={videoTitle}
            headerContent={searchForm}
        >
            <div className="bg-gray-50 text-gray-800">

                {/* Navigation list right under header */}
                <nav className="bg-white border-b border-gray-200 py-4 hidden md:block shadow-sm relative z-20">
                    <ul className="list-none flex justify-center flex-wrap gap-8 max-w-7xl mx-auto">
                        {['barcelona', 'madrid', 'seville', 'granada', 'mallorca', 'parks', 'cruise'].map(loc => (
                            <li key={loc} className="inline-block">
                                <a href={`#${loc}`} className="text-gray-600 font-bold hover:text-[#AD1519] transition capitalize text-sm tracking-wide">
                                    {loc === 'parks' ? 'Amusement Parks' : loc === 'cruise' ? 'Cruise Lines' : loc}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* ── Locations Grid ── */}
                <div className="relative w-full h-full min-h-screen py-10 px-4">
                    <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/40547/fair-fairground-ferris-wheel-carousel-40547.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] bg-cover bg-center opacity-[0.15] blur-[2px] z-0 pointer-events-none" />

                    <section className="relative z-10 flex flex-wrap justify-center p-2 max-w-6xl mx-auto gap-10">
                        {[
                            { id: 'barcelona', name: 'Barcelona', img: 'https://i.natgeofe.com/n/5fafc705-d9e2-4145-8305-d2fc5e4aa8db/sagradafamilia-barcelona-spain.jpg', desc: 'Famous for its art and architecture, don’t miss La Sagrada Familia, Park Güell, and the Gothic Quarter.', acc: '€100 - €200', meals: '€30 - €50', trans: '€10 - €20', total: '€140 - €270' },
                            { id: 'madrid', name: 'Madrid', img: 'https://media.architecturaldigest.com/photos/57ad893acfc37bc171ad8082/1:1/w_3424,h_3424,c_limit/madrid-travel-guide.jpg', desc: 'The capital city boasts the Royal Palace, Prado Museum, and vibrant squares like Plaza Mayor.', acc: '€90 - €180', meals: '€25 - €45', trans: '€8 - €15', total: '€123 - €240' },
                            { id: 'seville', name: 'Seville', img: 'https://ctdots.eu/wp-content/uploads/2022/06/museum-of-popular-arts-and-traditions-seville-spain-2.jpg', desc: 'Seville is known for its Flamenco music and dance, stunning Alcázar palace, and Seville Cathedral.', acc: '€80 - €160', meals: '€20 - €40', trans: '€7 - €15', total: '€107 - €215' },
                            { id: 'granada', name: 'Granada', img: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2b/9b/26/91/caption.jpg?w=1200&h=-1&s=1', desc: 'Discover the iconic Alhambra Palace and the rich Moorish heritage of this beautiful city.', acc: '€70 - €150', meals: '€18 - €35', trans: '€5 - €12', total: '€93 - €197' },
                            { id: 'mallorca', name: 'Mallorca', img: 'https://bucket-files.city-sightseeing.com/blog/2023/09/palmademallorca-aerialview.jpg', desc: 'A Mediterranean paradise with stunning beaches, limestone mountains, and charming villages.', acc: '€90 - €180', meals: '€25 - €45', trans: '€8 - €15', total: '€123 - €240' },
                            { id: 'parks', name: 'Amusement Parks', img: 'https://media.cntraveler.com/photos/588a14b766153a8509970c39/16:9/w_2560%2Cc_limit/ferrari-theme-park-spain-cr-portaventura.jpg', desc: 'Experience thrilling rides and attractions at Spain\'s top amusement parks.', acc: 'Ticket: €40 - €80', meals: '€20 - €35', trans: '€10 - €20', total: '€70 - €135' },
                            { id: 'cruise', name: 'Cruise Lines', img: 'https://eu-images.contentstack.com/v3/assets/blt57a7a4fed12d2120/blt68d51544f4f6f997/667ec6d29b27861ead6a2d45/CRUISE_MSC_Grandiosa_Barcelona.jpg', desc: 'Embark on a luxurious journey across the Mediterranean with top-notch cruise lines, offering exceptional amenities and breathtaking views.', acc: 'Ticket: €200 - €500', meals: 'Included in cruise', trans: 'Included in cruise', total: '€200 - €500' },
                        ].map(loc => (
                            <div key={loc.id} id={loc.id} className="bg-white w-[350px] mt-10 rounded-xl shadow-2xl border border-gray-200 hover:-translate-y-2 hover:shadow-[0_15px_30px_rgba(0,0,0,0.15)] transition duration-300 flex flex-col overflow-hidden group">
                                <div className="h-[200px] overflow-hidden bg-gray-200">
                                    <img src={loc.img} alt={loc.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                                </div>
                                <h3 className="px-4 pt-5 text-2xl font-bold bg-white text-center pb-3">{loc.name}</h3>
                                <p className="px-5 pb-5 text-[15px] font-medium text-gray-600 bg-white flex-1 text-center border-b border-gray-100">{loc.desc}</p>
                                <div className="bg-[#fcfcfc] p-5 text-sm text-left relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-[#2980b9] rotate-45 translate-x-8 -translate-y-8 opacity-10"></div>
                                    <h4 className="text-[#2980b9] text-base font-bold mb-3 flex items-center gap-2">Suggested Budget</h4>
                                    <p className="my-1 text-[#7f8c8d] font-medium flex justify-between"><span>Accommodation</span> <span>{loc.acc}</span></p>
                                    <p className="my-1 text-[#7f8c8d] font-medium flex justify-between"><span>Meals/day</span> <span>{loc.meals}</span></p>
                                    <p className="my-1 text-[#7f8c8d] font-medium flex justify-between"><span>Transport/day</span> <span>{loc.trans}</span></p>
                                    <div className="mt-3 pt-3 border-t border-gray-200 text-[#e74c3c] font-black text-base flex justify-between items-center tracking-wide">
                                        TOTAL <span>{loc.total}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </section>

                    {/* ── Random Cat Fact Generator ── */}
                    <div className="relative z-10 text-center py-20 pb-0">
                        <h1 className="text-3xl font-black text-gray-900 mb-6 drop-shadow-sm">WANNA HEAR A RANDOM CAT FACT?</h1>
                        <button onClick={fetchCatFact} className="bg-blue-600 font-bold hover:bg-blue-700 text-white px-8 py-3 rounded-full shadow-lg transition hover:scale-105">SURE !!!</button>
                        {catFact && (
                            <div className="mt-6 max-w-lg mx-auto bg-white p-6 rounded-2xl shadow-xl border border-gray-200 animate-fade-in">
                                <p className="text-lg font-medium text-gray-800 italic">"{catFact}"</p>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </PageLayout>
    );
}
