import React, { useState, useEffect } from "react";

const API_BASE = "http://localhost:8080";

export default function LeaderBoard({ onError }) {
    const [tournaments, setTournaments] = useState([]);
    const [selectedTournament, setSelectedTournament] = useState(null);
    const [teams, setTeams] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [loadingTournaments, setLoadingTournaments] = useState(false);
    const [loadingTeams, setLoadingTeams] = useState(false);
    const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);
    const [saving, setSaving] = useState(false);

    // Fetch tournaments
    useEffect(() => {
        setLoadingTournaments(true);
        fetch(`${API_BASE}/api/tournaments/get`)
            .then((res) => {
                if (!res.ok) throw new Error("Failed to load tournaments");
                return res.json();
            })
            .then((data) => setTournaments(Array.isArray(data) ? data : []))
            .catch(() => onError?.("Failed to load tournaments"))
            .finally(() => setLoadingTournaments(false));
    }, [onError]);

    // Fetch teams of selected tournament
    useEffect(() => {
        if (!selectedTournament) {
            setTeams([]);
            setLeaderboard([]);
            return;
        }
        setLoadingTeams(true);
        fetch(`${API_BASE}/api/tournaments/${selectedTournament.id}/teams`)
            .then((res) => {
                if (!res.ok) throw new Error("Failed to load teams");
                return res.json();
            })
            .then((data) => setTeams(Array.isArray(data) ? data : []))
            .catch(() => onError?.("Failed to load teams"))
            .finally(() => setLoadingTeams(false));
    }, [selectedTournament, onError]);

    // Fetch leaderboard entries if teams exist
    useEffect(() => {
        if (!selectedTournament || teams.length === 0) {
            setLeaderboard([]);
            setLoadingLeaderboard(false);
            return;
        }
        setLoadingLeaderboard(true);
        fetch(`${API_BASE}/api/leaderboard/tournament/${selectedTournament.id}`)
            .then((res) => {
                if (!res.ok) throw new Error("Failed to load leaderboard");
                return res.json();
            })
            .then((data) => {
                if (Array.isArray(data)) {
                    const sorted = data.sort((a, b) => a.rank - b.rank);
                    setLeaderboard(sorted);
                } else {
                    setLeaderboard([]);
                }
            })
            .catch(() => {
                onError?.("Failed to load leaderboard");
                setLeaderboard([]);
            })
            .finally(() => setLoadingLeaderboard(false));
    }, [selectedTournament, teams, onError]);

    // Update ranks after reorder
    const updateRanks = (list) => list.map((entry, i) => ({ ...entry, rank: i + 1 }));

    // Move entry up
    const moveUp = (index) => {
        if (index === 0) return;
        setLeaderboard((prev) => {
            const newList = [...prev];
            [newList[index - 1], newList[index]] = [newList[index], newList[index - 1]];
            return updateRanks(newList);
        });
    };

    // Move entry down
    const moveDown = (index) => {
        if (index === leaderboard.length - 1) return;
        setLeaderboard((prev) => {
            const newList = [...prev];
            [newList[index], newList[index + 1]] = [newList[index + 1], newList[index]];
            return updateRanks(newList);
        });
    };

    // Handle input field change
    const handleInputChange = (id, field, val) => {
        setLeaderboard((lb) =>
            lb.map((entry) =>
                entry.id === id
                    ? {
                        ...entry,
                        [field]:
                            field === "netRunRate"
                                ? parseFloat(val) || 0
                                : parseInt(val) || 0,
                    }
                    : entry
            )
        );
    };

    // Save leaderboard entries
    const handleSave = async () => {
        setSaving(true);
        try {
            for (const entry of leaderboard) {
                await fetch(`${API_BASE}/api/leaderboard/entry`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(entry),
                });
            }
            alert("Leaderboard updated successfully");
        } catch {
            onError?.("Failed to save leaderboard");
        }
        setSaving(false);
    };

    return (
        <div className="p-6 max-w-7xl mx-auto bg-black min-h-screen text-white space-y-8">
            <h2 className="text-3xl font-bold mb-6">Select Tournament</h2>

            {loadingTournaments ? (
                <p>Loading tournaments...</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {tournaments.map((t) => (
                        <div
                            key={t.id}
                            onClick={() => setSelectedTournament(t)}
                            className={`cursor-pointer p-4 border rounded-lg ${selectedTournament?.id === t.id ? "border-yellow-400 bg-gray-800" : "border-gray-900"
                                } hover:border-yellow-400`}
                        >
                            <h3 className="text-lg font-semibold">{t.name || t.tournamentName}</h3>
                            <p className="text-sm text-gray-400">{t.location || "N/A"}</p>
                            <p className="text-sm text-gray-400">
                                Start: {new Date(t.startDate).toLocaleDateString()}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {selectedTournament && (
                <>
                    {loadingTeams ? (
                        <p>Loading teams...</p>
                    ) : teams.length === 0 ? (
                        <p className="mt-4 text-gray-400">No teams registered for this tournament.</p>
                    ) : loadingLeaderboard ? (
                        <p>Loading leaderboard...</p>
                    ) : leaderboard.length === 0 ? (
                        <>
                            <h2 className="mt-6 mb-4 text-yellow-400 text-2xl font-semibold">
                                Teams registered (leaderboard not started)
                            </h2>
                            <ul className="bg-white text-black rounded-md shadow divide-y dividing-gray-300">
                                {teams.map((team) => (
                                    <li key={team.id} className="p-4">
                                        {team.name || team.teamName}
                                    </li>
                                ))}
                            </ul>
                        </>
                    ) : (
                        <>
                            <h2 className="mt-6 mb-4 text-yellow-400 text-2xl font-semibold">Leaderboard</h2>
                            <table className="w-full border-collapse bg-white text-black rounded-md">
                                <thead>
                                    <tr className="border-b border-gray-400">
                                        <th className="p-2 w-10 text-left">Rank</th>
                                        <th className="p-2 w-48 text-left">Team</th>
                                        <th className="p-2 w-16">Up</th>
                                        <th className="p-2 w-16">Down</th>
                                        <th className="p-2 w-20">Played</th>
                                        <th className="p-2 w-20">Won</th>
                                        <th className="p-2 w-20">Lost</th>
                                        <th className="p-2 w-20">Points</th>
                                        <th className="p-2 w-24">Net Rate</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leaderboard.map((entry, idx) => (
                                        <tr key={entry.id} className="border-b border-gray-300">
                                            <td className="p-2">{entry.rank}</td>
                                            <td className="p-2 font-semibold">{entry.teamName}</td>
                                            <td className="p-2">
                                                <button
                                                    disabled={idx === 0}
                                                    onClick={() => moveUp(idx)}
                                                    className={`px-2 py-1 rounded ${idx === 0
                                                            ? "opacity-50 cursor-not-allowed"
                                                            : "bg-gray-300 hover:bg-gray-400 text-black"
                                                        }`}
                                                >
                                                    ↑
                                                </button>
                                            </td>
                                            <td className="p-2">
                                                <button
                                                    disabled={idx === leaderboard.length - 1}
                                                    onClick={() => moveDown(idx)}
                                                    className={`px-2 py-1 rounded ${idx === leaderboard.length - 1
                                                            ? "opacity-50 cursor-not-allowed"
                                                            : "bg-gray-300 hover:bg-gray-400 text-black"
                                                        }`}
                                                >
                                                    ↓
                                                </button>
                                            </td>
                                            <td className="p-2">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={entry.matchesPlayed}
                                                    onChange={(e) =>
                                                        handleInputChange(entry.id, "matchesPlayed", e.target.value)
                                                    }
                                                    className="w-full border rounded px-1 py-1"
                                                />
                                            </td>
                                            <td className="p-2">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={entry.matchesWon}
                                                    onChange={(e) =>
                                                        handleInputChange(entry.id, "matchesWon", e.target.value)
                                                    }
                                                    className="w-full border rounded px-1 py-1"
                                                />
                                            </td>
                                            <td className="p-2">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={entry.matchesLost}
                                                    onChange={(e) =>
                                                        handleInputChange(entry.id, "matchesLost", e.target.value)
                                                    }
                                                    className="w-full border rounded px-1 py-1"
                                                />
                                            </td>
                                            <td className="p-2">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={entry.points}
                                                    onChange={(e) =>
                                                        handleInputChange(entry.id, "points", e.target.value)
                                                    }
                                                    className="w-full border rounded px-1 py-1"
                                                />
                                            </td>
                                            <td className="p-2">
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={entry.netRate}
                                                    onChange={(e) =>
                                                        handleInputChange(entry.id, "netRate", e.target.value)
                                                    }
                                                    className="w-full border rounded px-1 py-1"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="flex justify-end mt-4">
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="bg-yellow-400 px-6 py-2 rounded text-black font-semibold hover:bg-yellow-500 disabled:opacity-50"
                                >
                                    {saving ? "Saving..." : "Update Leaderboard"}
                                </button>
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
}
