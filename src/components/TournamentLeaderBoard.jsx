import React, { useEffect, useState } from "react";

const API_BASE = "http://localhost:8080";

export default function TournamentWithLeaderboard({ onError }) {
    const [tournaments, setTournaments] = useState([]);
    const [selectedTournament, setSelectedTournament] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [loadingTournaments, setLoadingTournaments] = useState(false);
    const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);

    useEffect(() => {
        setLoadingTournaments(true);
        fetch(`${API_BASE}/api/tournaments/all`)
            .then((res) => {
                if (!res.ok) throw new Error("Failed to load tournaments");
                return res.json();
            })
            .then((data) => setTournaments(Array.isArray(data) ? data : []))
            .catch(() => {
                setTournaments([]);
                onError?.("Failed to load tournaments");
            })
            .finally(() => setLoadingTournaments(false));
    }, [onError]);

    useEffect(() => {
        if (!selectedTournament) {
            setLeaderboard([]);
            return;
        }
        setLoadingLeaderboard(true);
        fetch(`${API_BASE}/api/leaderboard/tournament/${selectedTournament.id}`)
            .then((res) => {
                if (!res.ok) throw new Error("Failed to load leaderboard");
                return res.json();
            })
            .then((data) => setLeaderboard(Array.isArray(data) ? data.sort((a, b) => a.rank - b.rank) : []))
            .catch(() => {
                setLeaderboard([]);
                onError?.("Failed to load leaderboard");
            })
            .finally(() => setLoadingLeaderboard(false));
    }, [selectedTournament, onError]);

    return (
        <div className="bg-black min-h-screen p-6 text-white max-w-7xl mx-auto">
            <h1 className="text-4xl font-extrabold mb-12 text-white text-center">
                Tournaments
            </h1>

            {loadingTournaments ? (
                <p className="text-center">Loading tournaments...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {tournaments.map((t) => (
                        <div
                            key={t.id}
                            onClick={() => setSelectedTournament(t)}
                            role="button"
                            tabIndex={0}
                            className={`bg-white text-black rounded-xl shadow border border-black-400 ${selectedTournament?.id === t.id ? "ring-4 ring-yellow-400" : ""
                                } focus:ring focus:outline-none cursor-pointer transition-all`}
                            style={{
                                outline: "none",
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") setSelectedTournament(t);
                            }}
                        >
                            <div
                                className="h-48 bg-cover bg-center rounded-t-xl"
                                style={{ backgroundImage: `url(${t.image || "/default.jpg"})` }}
                                aria-label={`Image of ${t.tournamentName || t.name}`}
                            ></div>
                            <div className="p-5">
                                <span className="inline-block bg-yellow-400 text-black rounded-full px-3 py-1 text-xs font-semibold mb-2">
                                    {t.matchType || "General"}
                                </span>
                                <h2 className="text-xl font-semibold mb-2">{t.tournamentName || t.name}</h2>
                                <p className="text-gray-700 mb-3 line-clamp-3">{t.description || "No description available."}</p>
                                <p className="text-gray-600">
                                    Start Date: {new Date(t.startDate).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedTournament && (
                // Modal overlay (darker and allows click to close)
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center"
                    style={{
                        background: "rgba(0,0,0,0.85)", // More opaque black
                    }}
                    onClick={() => setSelectedTournament(null)} // Clicking outside closes modal
                >
                    <div
                        // Stop click inside modal from closing it
                        onClick={e => e.stopPropagation()}
                        className="bg-white text-black rounded-xl shadow-lg p-6 max-w-3xl w-full relative animate-fadeIn"
                    >
                        <button
                            className="absolute top-3 right-3 text-2xl rounded-full px-3 py-0 text-yellow-400 font-bold hover:text-yellow-500 focus:outline-none"
                            onClick={() => setSelectedTournament(null)}
                            aria-label="Close"
                        >
                            ×
                        </button>
                        <h2 className="text-black text-3xl font-semibold mb-6 text-center">
                            Leaderboard - {selectedTournament.tournamentName || selectedTournament.name}
                        </h2>
                        {loadingLeaderboard ? (
                            <p className="text-center text-black">Loading leaderboard...</p>
                        ) : leaderboard.length === 0 ? (
                            <p className="text-center text-gray-500">No leaderboard data available.</p>
                        ) : (
                            <div className="overflow-x-auto rounded-sm max-h-[70vh]">
                                <table className="w-full border-collapse bg-white rounded-sm border  border-black">
                                    <thead>
                                        <tr className="border-b border-black">
                                            <th className="p-3 text-left w-12">Rank</th>
                                            <th className="p-3 text-left w-48">Team</th>
                                            <th className="p-3 text-center w-20">Played</th>
                                            <th className="p-3 text-center w-20">Won</th>
                                            <th className="p-3 text-center w-20">Lost</th>
                                            <th className="p-3 text-center w-20">Points</th>
                                            <th className="p-3 text-center w-24">Net Run Rate</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {leaderboard.map((entry) => (
                                            <tr key={entry.id} className="border-b border-black">
                                                <td className="p-3 font-bold text-yellow-400">{entry.rank}</td>
                                                <td className="p-3 font-semibold">{entry.teamName}</td>
                                                <td className="p-3 text-center">{entry.matchesPlayed}</td>
                                                <td className="p-3 text-center">{entry.matchesWon}</td>
                                                <td className="p-3 text-center">{entry.matchesLost}</td>
                                                <td className="p-3 text-center font-semibold">{entry.points}</td>
                                                <td className="p-3 text-center">
                                                    {(entry.netRunRate ?? 0).toFixed(2)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}

        </div>
    );
}
