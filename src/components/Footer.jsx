import React from "react";
import newsBg from "../assets/pic-4.jpg";
import matchBg from "../assets/pic-2.jpg";

const Footer = () => {
return (
    <div className="bg-black text-white">
    <footer className="px-6 py-16">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 mb-16">
        <div
            className="rounded-3xl overflow-hidden relative h-[320px] bg-cover bg-center group"
            style={{ backgroundImage: `url(${newsBg})` }}
        >
            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition-all duration-300" />
            <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6">
            <h2 className="text-white text-2xl md:text-3xl font-bold mb-4 drop-shadow-lg">
                Match Reports, <br /> Features & Analysis
            </h2>
            <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2 rounded-full shadow-md transition-all duration-300 transform hover:scale-105">
                LEARN MORE →
            </button>
            </div>
        </div>

        <div
            className="rounded-3xl overflow-hidden relative h-[320px] bg-cover bg-center group"
            style={{ backgroundImage: `url(${matchBg})` }}
        >
            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition-all duration-300" />
            <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6">
            <h2 className="text-white text-2xl md:text-3xl font-bold mb-4 drop-shadow-lg">
                Video Highlights, <br /> Hot Shots & Interviews
            </h2>
            <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2 rounded-full shadow-md transition-all duration-300 transform hover:scale-105">
                LEARN MORE →
            </button>
            </div>
        </div>
        </div>

        <div className="border-t border-gray-800 pt-12 pb-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-5 sm:grid-cols-2 gap-8 text-sm">
            {[
            {
                heading: "MATCHES",
                links: ["Live Scores", "Schedule", "Results", "Highlights"],
            },
            {
                heading: "TEAMS",
                links: ["India", "Australia", "England", "Pakistan"],
            },
            {
                heading: "ABOUT",
                links: ["Our Story", "Careers", "Privacy Policy", "Terms of Use"],
            },
            {
                heading: "FAN ZONE",
                links: ["Contests", "Player Stories", "Memes", "Fan Shop"],
            },
            {
                heading: "TICKETS",
                links: ["Buy Tickets", "Hospitality", "FAQs", "Support"],
            },
            ].map((section, idx) => (
            <div key={idx}>
                <h4 className="text-yellow-400 font-semibold mb-4 tracking-wide">
                {section.heading}
                </h4>
                <ul className="space-y-2 text-gray-400">
                {section.links.map((link, i) => (
                    <li
                    key={i}
                    className="hover:text-yellow-300 transition-colors cursor-pointer"
                    >
                    {link}
                    </li>
                ))}
                </ul>
            </div>
            ))}
        </div>
        </div>

        <div className="mt-12 border-t border-gray-800 pt-6 text-center text-gray-500 text-xs tracking-wide">
        <p className="mb-2 text-white font-bold text-lg">Bat's Up</p>
        <p>© {new Date().getFullYear()} Bat's Up. All rights reserved.</p>
        </div>
    </footer>
    </div>
);
};

export default Footer;
