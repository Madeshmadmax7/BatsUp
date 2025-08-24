import React, { useEffect, useState } from "react";

const API_BASE = "https://batsup-v1-oauz.onrender.com";

export default function LeaderBoard({ onError }) {
    const [tournaments, setTournaments] = useState([]);
    const [selectedTournament, setSelectedTournament] = useState(null);
    const [teams, setTeams] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [loadingTournaments, setLoadingTournaments] = useState(false);
    const [loadingTeams, setLoadingTeams] = useState(false);
    const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);
    const [saving, setSaving] = useState(false);
    const [highlightedId, setHighlightedId] = useState(null);

    useEffect(() => {
        setLoadingTournaments(true);
        fetch(`${API_BASE}/api/tournaments/all`)
            .then(res => {
                if (!res.ok) throw new Error("Failed to load tournaments");
                return res.json();
            })
            .then(data => setTournaments(Array.isArray(data) ? data : []))
            .catch(() => onError?.("Failed to load tournaments"))
            .finally(() => setLoadingTournaments(false));
    }, [onError]);

    useEffect(() => {
        if (!selectedTournament) {
            setTeams([]);
            setLeaderboard([]);
            return;
        }
        setLoadingTeams(true);
        fetch(`${API_BASE}/api/tournaments/${selectedTournament.id}/teams`)
            .then(res => {
                if (!res.ok) throw new Error("Failed to load teams");
                return res.json();
            })
            .then(data => setTeams(Array.isArray(data) ? data : []))
            .catch(() => onError?.("Failed to load teams"))
            .finally(() => setLoadingTeams(false));
    }, [selectedTournament, onError]);

    useEffect(() => {
        if (!selectedTournament || teams.length === 0) {
            setLeaderboard([]);
            return;
        }
        setLoadingLeaderboard(true);
        fetch(`${API_BASE}/api/leaderboard/tournament/${selectedTournament.id}`)
            .then(res => {
                if (!res.ok) throw new Error("Failed to load leaderboard");
                return res.json();
            })
            .then(data => {
                if (Array.isArray(data) && data.length) {
                    const sorted = data.sort((a, b) => a.rank - b.rank);
                    setLeaderboard(sorted.map(e => ({
                        ...e,
                        // Always default to string for input, to keep things controlled
                        netRate: e.netRunRate !== undefined && e.netRunRate !== null ? e.netRunRate : "",
                        matchesPlayed: e.matchesPlayed ?? "",
                        matchesWon: e.matchesWon ?? "",
                        matchesLost: e.matchesLost ?? "",
                        points: e.points ?? ""
                    })));
                } else {
                    // New leaderboard: fill from teams
                    const initEntries = teams
                        .slice()
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((team, idx) => ({
                            id: null,
                            tournamentId: selectedTournament.id,
                            teamId: team.id,
                            teamName: team.name,
                            rank: idx + 1,
                            matchesPlayed: "",
                            matchesWon: "",
                            matchesLost: "",
                            points: "",
                            netRate: "",
                        }));
                    setLeaderboard(initEntries);
                }
            })
            .catch(() => onError?.("Failed to load leaderboard"))
            .finally(() => setLoadingLeaderboard(false));
    }, [selectedTournament, teams, onError]);

    const updateRanks = list => list.map((item, idx) => ({ ...item, rank: idx + 1 }));

    const moveUp = idx => {
        if (idx === 0) return;
        const newList = [...leaderboard];
        [newList[idx], newList[idx - 1]] = [newList[idx - 1], newList[idx]];
        const updatedList = updateRanks(newList);
        setLeaderboard(updatedList);
        setHighlightedId(updatedList[idx - 1].id);
        setTimeout(() => setHighlightedId(null), 1200);
    };

    const moveDown = idx => {
        if (idx === leaderboard.length - 1) return;
        const newList = [...leaderboard];
        [newList[idx], newList[idx + 1]] = [newList[idx + 1], newList[idx]];
        const updatedList = updateRanks(newList);
        setLeaderboard(updatedList);
        setHighlightedId(updatedList[idx + 1].id);
        setTimeout(() => setHighlightedId(null), 1200);
    };

    const handleChange = (id, field, value) => {
        setLeaderboard(lb =>
            lb.map(entry =>
                entry.id === id || (entry.id === null && id === null)
                    ? {
                        ...entry,
                        [field]:
                            value === "" ? "" :
                                field === "netRate" ? value : // keep as string for input, parse before sending
                                    value
                    }
                    : entry
            )
        );
    };

    const safeInputValue = v => v === undefined || v === null ? "" : v;

    const handleSave = async () => {
        setSaving(true);
        try {
            for (const entry of leaderboard) {
                await fetch(`${API_BASE}/api/leaderboard/entry`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        ...entry,
                        // Backend expects netRunRate! Convert the controlled input here:
                        netRunRate: entry.netRate === "" ? 0 : parseFloat(entry.netRate),
                        netRate: undefined, // don't send extraneous key
                        matchesPlayed: entry.matchesPlayed === "" ? 0 : parseInt(entry.matchesPlayed),
                        matchesWon: entry.matchesWon === "" ? 0 : parseInt(entry.matchesWon),
                        matchesLost: entry.matchesLost === "" ? 0 : parseInt(entry.matchesLost),
                        points: entry.points === "" ? 0 : parseInt(entry.points)
                    }),
                });
            }
            alert("Leaderboard updated successfully");
        } catch {
            onError?.("Failed to save leaderboard");
        }
        setSaving(false);
    };

    return (
        <div className="p-6 bg-black min-h-screen text-white max-w-5xl mx-auto">
            <h1 className="text-3xl mb-6 font-bold">Select Tournament</h1>

            {loadingTournaments ? (
                <p>Loading tournaments...</p>
            ) : (
                <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {tournaments.map(t => (
                        <button
                            key={t.id}
                            onClick={() => setSelectedTournament(t)}
                            className={`p-4 rounded border ${selectedTournament?.id === t.id ? "border-yellow-400 bg-gray-800" : "border-gray-900"
                                } hover:border-yellow-400 transition`}
                        >
                            <h2 className="font-semibold text-lg">{t.name}</h2>
                            <p className="text-sm text-gray-400">{t.location || "N/A"}</p>
                            <p className="text-sm text-gray-500">
                                {new Date(t.startDate).toLocaleDateString()}
                            </p>
                        </button>
                    ))}
                </div>
            )}

            {selectedTournament && (
                <>
                    {loadingTeams ? (
                        <p>Loading teams...</p>
                    ) : teams.length === 0 ? (
                        <p className="text-gray-400">No teams registered.</p>
                    ) : loadingLeaderboard ? (
                        <p>Loading leaderboard...</p>
                    ) : (
                        <>
                            <h2 className="text-yellow-400 font-semibold text-2xl mb-4">Leaderboard</h2>
                            <table className="w-full border-collapse bg-gray-900 rounded-md">
                                <thead>
                                    <tr className="border-b border-gray-700 text-white">
                                        <th className="p-2 text-left w-12">Rank</th>
                                        <th className="p-2 text-left w-48">Team</th>
                                        <th className="p-2 text-left w-14">Played</th>
                                        <th className="p-2 text-left w-14">Won</th>
                                        <th className="p-2 text-left w-14">Lost</th>
                                        <th className="p-2 text-left w-14">Points</th>
                                        <th className="p-2 text-left w-20">Net Rate</th>
                                        <th className="p-2 text-center w-24">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leaderboard.map((entry, idx) => (
                                        <tr
                                            key={entry.id ?? `temp-${entry.teamId}`}
                                            className={`border-b border-gray-700 transition-colors ${highlightedId === entry.id ? "bg-yellow-700" : ""
                                                }`}
                                        >
                                            <td className="p-2">{entry.rank}</td>
                                            <td className="p-2 font-semibold">{entry.teamName}</td>
                                            <td className="p-2">
                                                <input
                                                    type="number"
                                                    min={0}
                                                    className="w-full rounded px-1 py-1 text-white"
                                                    value={safeInputValue(entry.matchesPlayed)}
                                                    onChange={e =>
                                                        handleChange(entry.id, "matchesPlayed", e.target.value)
                                                    }
                                                />
                                            </td>
                                            <td className="p-2">
                                                <input
                                                    type="number"
                                                    min={0}
                                                    className="w-full rounded px-1 py-1 text-white"
                                                    value={safeInputValue(entry.matchesWon)}
                                                    onChange={e =>
                                                        handleChange(entry.id, "matchesWon", e.target.value)
                                                    }
                                                />
                                            </td>
                                            <td className="p-2">
                                                <input
                                                    type="number"
                                                    min={0}
                                                    className="w-full rounded px-1 py-1 text-white"
                                                    value={safeInputValue(entry.matchesLost)}
                                                    onChange={e =>
                                                        handleChange(entry.id, "matchesLost", e.target.value)
                                                    }
                                                />
                                            </td>
                                            <td className="p-2">
                                                <input
                                                    type="number"
                                                    min={0}
                                                    className="w-full rounded px-1 py-1 text-white"
                                                    value={safeInputValue(entry.points)}
                                                    onChange={e =>
                                                        handleChange(entry.id, "points", e.target.value)
                                                    }
                                                />
                                            </td>
                                            <td className="p-2">
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    className="w-full rounded px-1 py-1 text-white"
                                                    value={safeInputValue(entry.netRate)}
                                                    onChange={e =>
                                                        handleChange(entry.id, "netRate", e.target.value)
                                                    }
                                                />
                                            </td>
                                            <td className="p-2 flex flex-col gap-1 items-center justify-center">
                                                <button
                                                    onClick={() => moveUp(idx)}
                                                    disabled={idx === 0}
                                                    className={`w-10 h-8 rounded-full ${idx === 0
                                                            ? "opacity-50 cursor-not-allowed"
                                                            : "bg-yellow-400 hover:bg-yellow-500 text-black"
                                                        }`}
                                                    title="Move Up"
                                                >
                                                    ↑
                                                </button>
                                                <button
                                                    onClick={() => moveDown(idx)}
                                                    disabled={idx === leaderboard.length - 1}
                                                    className={`w-10 h-8 rounded-full ${idx === leaderboard.length - 1
                                                            ? "opacity-50 cursor-not-allowed"
                                                            : "bg-yellow-400 hover:bg-yellow-500 text-black"
                                                        }`}
                                                    title="Move Down"
                                                >
                                                    ↓
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded disabled:opacity-50"
                                >
                                    {saving ? "Saving..." : "Update"}
                                </button>
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
}
