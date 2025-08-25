import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "https://batsup-v1-oz.herokuapp.com";

export default function TournamentWithLeaderboard({ onError }) {
    const navigate = useNavigate();
    const [tournaments, setTournaments] = useState([]);
    const [selectedTournament, setSelectedTournament] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [loadingTournaments, setLoadingTournaments] = useState(false);
    const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);

    // Load tournaments
    useEffect(() => {
        setLoadingTournaments(true);
        fetch(`${API_BASE}/api/tournaments`)
            .then(res => {
                if (!res.ok) throw new Error("Failed to load tournaments");
                return res.json();
            })
            .then(data => setTournaments(Array.isArray(data) ? data : []))
            .catch(() => {
                setTournaments([]);
                onError?.("Failed to load tournaments");
            })
            .finally(() => setLoadingTournaments(false));
    }, [onError]);

    // Load leaderboard on tournament select
    useEffect(() => {
        if (!selectedTournament) {
            setLeaderboard([]);
            return;
        }
        setLoadingLeaderboard(true);
        fetch(`${API_BASE}/api/leaderboard/${selectedTournament.id}`)
            .then(res => {
                if (!res.ok) throw new Error("Failed to load leaderboard");
                return res.json();
            })
            .then(data => {
                if (Array.isArray(data)) {
                    const sorted = data.sort((a, b) => a.rank - b.rank);
                    setLeaderboard(sorted);
                } else {
                    setLeaderboard([]);
                }
            })
            .catch(() => {
                setLeaderboard([]);
                onError?.("Failed to load leaderboard");
            })
            .finally(() => setLoadingLeaderboard(false));
    }, [selectedTournament, onError]);

    return (
        <div className="bg-black min-h-screen p-6 text-white max-w-7xl mx-auto mt-20">
            <h1 className="text-4xl font-extrabold mb-12 text-center">Tournaments</h1>

            {loadingTournaments ? (
                <p className="text-center">Loading tournaments...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {tournaments.map(t => (
                        <div
                            key={t.id}
                            tabIndex={0}
                            role="button"
                            className={`cursor-pointer rounded-xl bg-white p-4 shadow border border-black focus:outline-none focus:ring-4 ${selectedTournament?.id === t.id ? "ring-yellow-400" : ""
                                }`}
                            onClick={() => setSelectedTournament(t)}
                            onKeyDown={e => {
                                if (e.key === "Enter") setSelectedTournament(t);
                            }}
                        >
                            <div
                                className="h-48 rounded-md bg-center bg-cover"
                                style={{ backgroundImage: `url(${t.image || "/default.jpg"})` }}
                                aria-label={`Image of ${t.tournamentName}`}
                            />
                            <h2 className="mt-4 text-black text-xl font-semibold truncate">{t.tournamentName}</h2>
                            <p className="text-gray-700 mt-1 mb-2 truncate">{t.description}</p>
                            <p className="text-gray-600 text-sm">Start: {new Date(t.startDate).toLocaleDateString()}</p>
                        </div>
                    ))}
                </div>
            )}

            {selectedTournament && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4"
                    onClick={() => setSelectedTournament(null)}
                    aria-modal="true"
                    role="dialog"
                    aria-labelledby="modal-title"
                >
                    <div
                        className="relative max-w-4xl w-full max-h-[90vh] overflow-auto rounded-xl bg-white p-6"
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            className="absolute top-4 right-4 text-3xl text-black hover:text-yellow-500 focus:outline-none"
                            aria-label="Close leaderboard"
                            onClick={() => setSelectedTournament(null)}
                        >
                            &times;
                        </button>
                        <h3 id="modal-title" className="mb-6 text-center text-3xl font-extrabold text-black">
                            Leaderboard: {selectedTournament.tournamentName}
                        </h3>

                        {loadingLeaderboard ? (
                            <p className="text-center text-black">Loading leaderboard...</p>
                        ) : leaderboard.length === 0 ? (
                            <p className="text-center text-gray-700">No leaderboard data available.</p>
                        ) : (
                            <div className="overflow-auto max-h-[60vh]">
                                <table className="w-full table-auto border-collapse border border-gray-800">
                                    <thead>
                                        <tr className="bg-gray-100 border-b border-gray-800 text-black">
                                            <th className="p-3 text-left">Rank</th>
                                            <th className="p-3 text-left">Team</th>
                                            <th className="p-3 text-center">Played</th>
                                            <th className="p-3 text-center">Won</th>
                                            <th className="p-3 text-center">Lost</th>
                                            <th className="p-3 text-center">Points</th>
                                            <th className="p-3 text-center">Net Run Rate</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {leaderboard.map(entry => (
                                            <tr key={entry.id} className="border-b border-gray-300 text-black">
                                                <td className="p-3 font-bold text-yellow-400">{entry.rank}</td>
                                                <td className="p-3 font-semibold">{entry.teamName}</td>
                                                <td className="p-3 text-center">{entry.matchesPlayed}</td>
                                                <td className="p-3 text-center">{entry.matchesWon}</td>
                                                <td className="p-3 text-center">{entry.matchesLost}</td>
                                                <td className="p-3 text-center font-semibold">{entry.points}</td>
                                                <td className="p-3 text-center">{entry.netRunRate?.toFixed(2)}</td>
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
