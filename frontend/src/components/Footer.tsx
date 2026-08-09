import { Link } from 'react-router-dom';

export function Footer() {
    return (
        <footer className="footer bg-black text-white pt-16 pb-8 px-10 flex flex-col relative z-20"
            style={{ clipPath: 'polygon(0 3.5rem, 100% 0, 100% 100%, 0 100%)', marginTop: '-55px', minHeight: '400px' }}>
            <div className="container flex flex-wrap justify-between gap-10 max-w-7xl mx-auto pt-10">
                <div className="column flex flex-col gap-2">
                    <div className="font-bold text-xl mb-4">Follow Us On</div>
                    <div className="social-icons flex gap-4 text-2xl">
                        <a href="https://www.facebook.com" className="hover:text-cyan-400 transition"><i className="fa-brands fa-facebook"></i> F</a>
                        <a href="https://www.twitter.com" className="hover:text-cyan-400 transition"><i className="fa-brands fa-twitter"></i> T</a>
                        <a href="https://www.instagram.com" className="hover:text-cyan-400 transition"><i className="fa-brands fa-instagram"></i> I</a>
                    </div>
                </div>
                <div className="column flex flex-col gap-2">
                    <div className="font-bold text-lg mb-2">Accommodation</div>
                    <a href="#" className="hover:text-cyan-400 transition">Hostels</a>
                    <a href="#" className="hover:text-cyan-400 transition">Hotels</a>
                    <a href="#" className="hover:text-cyan-400 transition">Bed and Breakfast</a>
                </div>
                <div className="column flex flex-col gap-2">
                    <div className="font-bold text-lg mb-2">Quick Links</div>
                    <a href="#Blogs" className="hover:text-cyan-400 transition">Blogs</a>
                    <a href="/roamies" className="hover:text-cyan-400 transition">Tours & Experiences</a>
                    <a href="#" className="hover:text-cyan-400 transition">Student Discount</a>
                    <a href="#" className="hover:text-cyan-400 transition">Solo Travel</a>
                </div>
                <div className="column flex flex-col gap-2">
                    <div className="font-bold text-lg mb-2">About Us</div>
                    <Link to="/login" className="hover:text-cyan-400 transition">Dreamscape.co.ltd</Link>
                    <a href="#" className="hover:text-cyan-400 transition">Careers</a>
                    <a href="#" className="hover:text-cyan-400 transition">Press</a>
                </div>
                <div className="column flex flex-col gap-2">
                    <div className="font-bold text-lg mb-2">Customer Support</div>
                    <a href="#" className="hover:text-cyan-400 transition">Talk to us</a>
                    <a href="#" className="hover:text-cyan-400 transition">Help</a>
                    <a href="#" className="hover:text-cyan-400 transition">Contact</a>
                </div>
            </div>
            <div className="flex flex-wrap justify-between gap-4 mt-10 pt-10 border-t border-gray-800 text-sm font-medium max-w-7xl mx-auto w-full">
                <div><Link to="/login" className="hover:text-cyan-400 transition">© 2024 DreamscapeWorld.com</Link></div>
                <div className="flex gap-4 flex-wrap">
                    <a href="#" className="hover:text-white text-gray-400 transition">Terms & Legal</a>
                    <a href="#" className="hover:text-white text-gray-400 transition">Vouchers</a>
                    <a href="#" className="hover:text-white text-gray-400 transition">Coupons</a>
                    <a href="#" className="hover:text-white text-gray-400 transition">Site Map</a>
                    <a href="#" className="hover:text-white text-gray-400 transition">Cookie Preferences</a>
                </div>
            </div>
        </footer>
    );
}
