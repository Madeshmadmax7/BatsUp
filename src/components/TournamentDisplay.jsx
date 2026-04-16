import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const TournamentDisplay = () => {
    const navigate = useNavigate();
    const [tournaments, setTournaments] = useState([]);
    const [displayedTournaments, setDisplayedTournaments] = useState([]);

    useEffect(() => {
        axios
            .get("https://batsup-v1-oauz.onrender.com/api/tournaments/get")
            .then((res) => {
                const allTournaments = res.data || [];

                // Separate Adult tournaments and others
                const adultTournaments = allTournaments.filter(
                    (t) => t.matchType === "Adult"
                );

                // Shuffle function
                const shuffleArray = (arr) => {
                    return arr
                        .map((value) => ({ value, sort: Math.random() }))
                        .sort((a, b) => a.sort - b.sort)
                        .map(({ value }) => value);
                };

                // Shuffle Adult tournaments and pick up to 3
                let selected = shuffleArray(adultTournaments).slice(0, 3);

                // If less than 3 adults, fill remaining with others
                if (selected.length < 3) {
                    const remainingCount = 3 - selected.length;
                    const nonSelected = allTournaments.filter((t) => !selected.includes(t));
                    const shuffledNonSelected = shuffleArray(nonSelected);
                    selected = selected.concat(shuffledNonSelected.slice(0, remainingCount));
                }

                setTournaments(allTournaments);
                setDisplayedTournaments(selected);
            })
            .catch(() => {
                setTournaments([]);
                setDisplayedTournaments([]);
            });
    }, []);

    return (
        <div className="bg-[#f8f4e6] px-6 py-16 mt-20">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-10">
                    <h2 className="text-3xl font-bold text-black">Upcoming Tournaments</h2>
                    <button
                        className="text-sm text-black border px-4 py-2 rounded-full hover:bg-black hover:text-white transition"
                        onClick={() => navigate("/tournaments")}
                    >
                        View All →
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {displayedTournaments.map((t, idx) => (
                        <div
                            key={t.id || idx}
                            className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition"
                        >
                            <div
                                className="h-52 bg-cover bg-center relative"
                                style={{ backgroundImage: `url(${t.image})` }}
                            >
                                <button className="absolute top-3 left-3 bg-black/60 text-white text-xs font-semibold px-3 py-1 rounded-full">
                                    LEARN MORE
                                </button>
                            </div>
                            <div className="p-5">
                                <div className="flex items-center text-xs text-gray-500 gap-3 mb-2">
                                    <span className="px-2 py-0.5 bg-yellow-300 text-black rounded-full font-semibold">
                                        {t.matchType}
                                    </span>
                                    <span>{new Date(t.startDate).toLocaleDateString()}</span>
                                </div>
                                <h3 className="font-semibold text-lg text-black mb-1">{t.tournamentName}</h3>
                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{t.description}</p>
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
