import React from "react";
import newsBg from "../assets/pic-4.jpg";
import matchBg from "../assets/pic-2.jpg";

const Footer = () => {
return (

    <div className="pt-0 bg-[#f8f4e6]">
    <footer className="bg-[black] text-white px-6 py-16 rounded-t-[40px]">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-6 mb-16">
            <div
            className="rounded-3xl overflow-hidden relative h-[320px] bg-cover bg-center"
            style={{ backgroundImage: `url(${newsBg})` }}
            >
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6">
                <h2 className="text-white text-xl md:text-2xl font-semibold mb-4">
                Match reports, <br /> features and analysis
                </h2>
                <button className="bg-yellow-300 hover:bg-yellow-400 text-black text-sm font-semibold px-5 py-2 rounded-full transition">
                LEARN MORE →
                </button>
            </div>
            </div>

            <div
            className="rounded-3xl overflow-hidden relative h-[320px] bg-cover bg-center"
            style={{ backgroundImage: `url(${matchBg})` }}
            >
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6">
                <h2 className="text-white text-xl md:text-2xl font-semibold mb-4">
                Video highlights, <br /> hot shots and interviews
                </h2>
                <button className="bg-yellow-300 hover:bg-yellow-400 text-black text-sm font-semibold px-5 py-2 rounded-full transition">
                LEARN MORE →
                </button>
            </div>
            </div>

        </div>
        <div className="max-w-7xl mx-auto grid md:grid-cols-5 sm:grid-cols-2 gap-8 text-sm">
        <div>
            <h4 className="text-yellow-400 font-semibold mb-4">MATCHES</h4>
            <ul className="space-y-2 text-gray-300">
            <li>Live Scores</li>
            <li>Schedule</li>
            <li>Results</li>
            <li>Highlights</li>
            </ul>
        </div>

        <div>
            <h4 className="text-yellow-400 font-semibold mb-4">TEAMS</h4>
            <ul className="space-y-2 text-gray-300">
            <li>India</li>
            <li>Australia</li>
            <li>England</li>
            <li>Pakistan</li>
            </ul>
        </div>

        <div>
            <h4 className="text-yellow-400 font-semibold mb-4">ABOUT</h4>
            <ul className="space-y-2 text-gray-300">
            <li>Our Story</li>
            <li>Careers</li>
            <li>Privacy Policy</li>
            <li>Terms of Use</li>
            </ul>
        </div>

        <div>
            <h4 className="text-yellow-400 font-semibold mb-4">FAN ZONE</h4>
            <ul className="space-y-2 text-gray-300">
            <li>Contests</li>
            <li>Player Stories</li>
            <li>Memes</li>
            <li>Fan Shop</li>
            </ul>
        </div>

        <div>
            <h4 className="text-yellow-400 font-semibold mb-4">TICKETS</h4>
            <ul className="space-y-2 text-gray-300">
            <li>Buy Tickets</li>
            <li>Hospitality</li>
            <li>FAQs</li>
            <li>Support</li>
            </ul>
        </div>
        </div>

        <div className="mt-12 text-center text-gray-500 text-xs tracking-wide">
        <p className="mb-2 text-white font-bold text-lg">Bat's Up</p>
        <p>© 2025 Bat's Up. All rights reserved.</p>
        </div>
    </footer>
    </div>
);
};

export default Footer;
