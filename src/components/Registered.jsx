import React, { useState, useEffect } from "react";
import axios from "axios";

const Registered = () => {
    const [tournaments, setTournaments] = useState([]);

    useEffect(() => {
        axios
            .get("https://batsup-v1-oauz.onrender.com/api/tournaments/get")
            .then((res) => setTournaments(Array.isArray(res.data) ? res.data : []))
            .catch(() => setTournaments([]));
    }, []);

    return (
        <div className="bg-black min-h-screen px-6 py-10">
            <h1 className="text-white text-3xl font-bold mb-8 text-center">
                Registered Tournaments
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {tournaments.map((tournament, index) => (
                    <div
                        key={index}
                        className="bg-gray-800 text-white rounded-xl shadow-lg overflow-hidden hover:scale-105 transform transition duration-300"
                    >
                        <img
                            src={tournament.image || "https://via.placeholder.com/400x200"}
                            alt={tournament.tournamentName || tournament.title || "Tournament"}
                            className="w-full h-40 object-cover"
                        />
                        <div className="p-4">
                            <h2 className="text-lg font-bold truncate">
                                {tournament.tournamentName || tournament.title}
                            </h2>
                            <p className="text-xs text-gray-400 mb-2">
                                {tournament.startDate || tournament.date} •{" "}
                                {tournament.matchType || tournament.type} • {tournament.location}
                            </p>
                            <p className="text-sm mb-4 line-clamp-3">{tournament.description}</p>
                            <div className="flex flex-wrap gap-2">
                                {(tournament.teams || []).map((team, i) => (
                                    <button
                                        key={i}
                                        className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs hover:bg-purple-700 active:scale-95 transition"
                                        title={typeof team === "object" ? team.teamName : String(team)}
                                    >
                                        {typeof team === "object" ? team.teamName : String(team)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Registered;
