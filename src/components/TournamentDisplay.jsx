import React from "react";
import sample1 from "../assets/pic-1.jpg";
import sample2 from "../assets/pic-3.jpg";
import sample3 from "../assets/pic-5.jpg";

const tournaments = [
{
    title: "Bat's Up Super League 2025",
    date: "August 5",
    type: "NEWS",
    img: sample1,
    description: "Clash of top-tier cricket clubs across regions. Join now!",
},
{
    title: "Challenger Trophy - Under 19",
    date: "August 7",
    type: "VIDEO",
    img: sample2,
    description: "Spotlight on rising stars — register your team and compete.",
},
{
    title: "Legends Exhibition Match",
    date: "August 10",
    type: "NEWS",
    img: sample3,
    description: "Watch cricket legends battle it out once again!",
},
];

const TournamentDisplay = () => {
return (
    <div className="bg-[#f8f4e6] px-6 py-16">
    <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
        <h2 className="text-3xl font-bold text-black">Upcoming Tournaments</h2>
        <button className="text-sm text-black border px-4 py-2 rounded-full hover:bg-black hover:text-white transition">
            View All →
        </button>
        </div>

        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-8">
        {tournaments.map((t, idx) => (
            <div
            key={idx}
            className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition"
            >
            <div
                className="h-52 bg-cover bg-center relative"
                style={{ backgroundImage: `url(${t.img})` }}
            >
                <button className="absolute top-3 left-3 bg-black/60 text-white text-xs font-semibold px-3 py-1 rounded-full">
                LEARN MORE
                </button>
            </div>
            <div className="p-5">
                <div className="flex items-center text-xs text-gray-500 gap-3 mb-2">
                <span className="px-2 py-0.5 bg-yellow-300 text-black rounded-full font-semibold">
                    {t.type}
                </span>
                <span>{t.date}</span>
                </div>
                <h3 className="font-semibold text-lg text-black mb-1">
                {t.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {t.description}
                </p>
                <button className="text-sm text-yellow-600 font-semibold hover:underline">
                Join Tournament →
                </button>
            </div>
            </div>
        ))}
        </div>
    </div>
    </div>
);
};

export default TournamentDisplay;