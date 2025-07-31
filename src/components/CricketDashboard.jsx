import React from "react";
import { Plus } from "lucide-react";
import newsBg from "../assets/news.jpg";
import matchBg from "../assets/match.jpg";

const CricketCards = () => {
return (
    <div className="min-h-screen bg-black flex items-center justify-center gap-6 p-10 font-sans">
    <div
        className="w-[580px] h-[520px] relative bg-cover bg-center rounded-3xl overflow-hidden shadow-2xl"
        style={{ backgroundImage: `url(${newsBg})` }}
    >
        <div className="absolute inset-0 bg-black/50 p-5 flex flex-col justify-end gap-4">
        {[
            {
            type: "NEWS",
            date: "JULY 30",
            title: "India stuns Australia in thrilling World Cup semi-final",
            },
            {
            type: "VIDEO",
            date: "JULY 29",
            title: "Top 10 Sixes of the Tournament – Must Watch!",
            },
            {
            type: "NEWS",
            date: "JULY 28",
            title: "Bumrah’s Yorker Masterclass: A breakdown",
            },
        ].map((item, idx) => (
            <div
            key={idx}
            className="bg-white/10 backdrop-blur-xl p-4 rounded-xl flex justify-between items-start border border-white/10"
            >
            <div>
                <div className="flex items-center text-xs mb-1">
                <span
                    className={`px-2 py-0.5 rounded-full text-black font-bold text-[10px] tracking-wide ${
                    item.type === "VIDEO" ? "bg-green-300" : "bg-blue-300"
                    }`}
                >
                    {item.type}
                </span>
                <span className="ml-3 text-white/70 text-[10px]">{item.date}</span>
                </div>
                <h2 className="text-sm font-medium text-white">{item.title}</h2>
            </div>
            <Plus className="w-4 h-4 text-white/70 mt-1" />
            </div>
        ))}
        </div>
    </div>

    {/* Card 2 - Scoreboard */}
    <div
        className="w-[500px] h-[520px] relative bg-cover bg-center rounded-3xl overflow-hidden shadow-2xl"
        style={{ backgroundImage: `url(${matchBg})` }}
    >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/30 p-6 flex flex-col justify-end gap-4">
        <div className="flex gap-4 text-sm mb-1">
            <button className="bg-yellow-300 text-black px-4 py-1 rounded-full font-semibold">
            RESULTS
            </button>
            <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-1 rounded-full font-semibold">
            UPCOMING
            </button>
            <button className="ml-auto text-white/70 hover:text-white underline text-xs">
            ALL MATCHES
            </button>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
            <div className="text-sm text-white/70 mb-2">Mumbai Stadium</div>
            <div className="flex justify-between items-center">
            <div>
                <div className="font-semibold text-white">🇮🇳 India</div>
                <div className="font-semibold text-white">🇦🇺 Australia</div>
            </div>
            <div className="text-right text-white/80 text-sm">
                <div>
                <span className="text-yellow-300 mr-2">●</span>320/8
                </div>
                <div>311/10</div>
            </div>
            </div>

            <div className="flex justify-between mt-2 text-white/70 text-xs">
            <span>OVERS</span>
            <div className="flex gap-4">
                <span>50</span>
                <span>49.3</span>
            </div>
            </div>

            <div className="flex justify-between items-center mt-3 text-xs text-white/60">
            <span>DURATION: 7h 15m</span>
            <button className="bg-yellow-300 text-black px-3 py-1 rounded-md text-xs font-semibold">
                VIEW HIGHLIGHTS
            </button>
            </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
            <div className="text-sm text-white/70 mb-2">Chennai Ground</div>
            <div className="flex justify-between items-center">
            <div>
                <div className="font-semibold text-white">🇵🇰 Pakistan</div>
                <div className="font-semibold text-white">🇿🇦 South Africa</div>
            </div>
            <div className="text-right text-white/80 text-sm">
                <div>289/9</div>
                <div>290/6</div>
            </div>
            </div>
            <div className="flex justify-between mt-3 text-xs text-white/60">
            <span>DURATION: 6h 30m</span>
            </div>
        </div>
        </div>
    </div>
    </div>
);
};

export default CricketCards;
