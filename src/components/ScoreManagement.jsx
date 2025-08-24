import React, { useState, useEffect, useMemo } from "react";
import { Trash2, Plus, X } from "lucide-react";
import axios from "axios";
import { Section } from "./SharedComponents";

const API_BASE = "https://batsup-v1-oauz.onrender.com";

async function fetchWithError(url, description, options) {
    try {
        const res = await fetch(url, options);
        if (!res.ok) {
            const text = await res.text();
            throw new Error(`${description} failed: ${res.status} - ${text}`);
        }
        return await res.json();
    } catch (e) {
        throw new Error(`Failed to ${description}: ${e.message}`);
    }
}

function ScoreManagementPopup({ team, players, entries, onAdd, onUpdate, onDelete, onClose }) {
    const [localEntries, setLocalEntries] = useState([]);
    const [savingId, setSavingId] = useState(null);
    const [activeTeamId, setActiveTeamId] = useState(team.teamOneId);

    useEffect(() => {
        if (Array.isArray(entries)) setLocalEntries(entries);
        else setLocalEntries([]);
    }, [entries]);

    const filteredPlayers = useMemo(
        () => players.filter((p) => p.teamId === activeTeamId),
        [players, activeTeamId]
    );
    const filteredScorecards = useMemo(
        () => localEntries.filter((c) => c.teamId === activeTeamId),
        [localEntries, activeTeamId]
    );

    const usedPlayerIds = new Set(filteredScorecards.map((c) => c.playerId));
    const availablePlayers = filteredPlayers.filter((p) => !usedPlayerIds.has(p.id));

    const totals = filteredScorecards.reduce(
        (acc, c) => {
            acc.runs += c.runs || 0;
            acc.wickets += c.wickets || 0;
            acc.catches += c.catches || 0;
            return acc;
        },
        { runs: 0, wickets: 0, catches: 0 }
    );

    function playerName(id) {
        const p = players.find((pl) => pl.id === id);
        return p ? p.nickname || p.name || `#${p.jerseyNumber || "N/A"}` : "Unknown";
    }

    async function handleAddPlayer(playerId) {
        try {
            await onAdd(playerId);
        } catch (e) {
            alert("Error adding player: " + e.message);
        }
    }

    function updateField(id, field, value) {
        setLocalEntries((old) =>
            old.map((e) => (e.id === id ? { ...e, [field]: value } : e))
        );
    }

    async function saveRow(entry) {
        if (!entry.id) return; // Only update if valid ID
        setSavingId(entry.id);
        try {
            await onUpdate(entry.id, {
                runs: Number(entry.runs) || 0,
                wickets: Number(entry.wickets) || 0,
                catches: Number(entry.catches) || 0,
                playerId: entry.playerId,
                teamId: activeTeamId,
                matchId: entry.matchId,
            });
        } finally {
            setSavingId(null);
        }
    }

    const canEdit = (entry) => Boolean(entry.id);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75"
            onClick={onClose}
        >
            <div
                className="bg-gray-900 border border-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto p-6"
                style={{ minHeight: 300 }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-white">
                        Manage Scores — {team.teamOneName} vs {team.teamTwoName}
                    </h3>
                    <button onClick={onClose} className="p-2 rounded hover:bg-gray-800 text-white">
                        <X size={20} />
                    </button>
                </div>

                {/* Tabs for team selection */}
                <div className="flex mb-4 gap-2">
                    {[team.teamOneId, team.teamTwoId].map((tid) => {
                        const isActive = tid === activeTeamId;
                        const name = tid === team.teamOneId ? team.teamOneName : team.teamTwoName;
                        return (
                            <button
                                key={tid}
                                onClick={() => setActiveTeamId(tid)}
                                className={`px-4 py-2 rounded ${isActive ? "bg-blue-700 text-white" : "bg-gray-700 text-gray-300"
                                    }`}
                            >
                                {name}
                            </button>
                        );
                    })}
                </div>

                {/* Team totals */}
                <div className="grid grid-cols-3 mb-4 text-white text-center gap-4">
                    <div className="bg-gray-800 p-3 rounded">Runs: {totals.runs}</div>
                    <div className="bg-gray-800 p-3 rounded">Wickets: {totals.wickets}</div>
                    <div className="bg-gray-800 p-3 rounded">Catches: {totals.catches}</div>
                </div>

                {/* Add player selector */}
                <div className="flex mb-4 gap-2">
                    <select
                        id="add-player-select"
                        className="flex-grow p-2 rounded bg-gray-700 text-white"
                        defaultValue=""
                        onChange={(e) => {
                            if (!e.target.value) return;
                            handleAddPlayer(Number(e.target.value));
                            e.target.value = "";
                        }}
                    >
                        <option value="">Select player to add...</option>
                        {availablePlayers.length === 0 && (
                            <option disabled>No more available players</option>
                        )}
                        {availablePlayers.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.nickname || p.name || `#${p.jerseyNumber || "N/A"}`}
                            </option>
                        ))}
                    </select>
                    <button
                        className="bg-green-600 hover:bg-green-700 text-white rounded px-4 py-2 flex items-center gap-2"
                        onClick={() => {
                            const select = document.getElementById("add-player-select");
                            if (select?.value) {
                                handleAddPlayer(Number(select.value));
                                select.value = "";
                            }
                        }}
                    >
                        <Plus size={16} /> Add
                    </button>
                </div>

                {/* Scorecard table */}
                {filteredScorecards.length === 0 ? (
                    <p className="text-center text-gray-400 py-10">No scores added for this team.</p>
                ) : (
                    <table className="w-full border border-gray-700 text-white table-auto">
                        <thead>
                            <tr className="bg-gray-800">
                                <th className="p-2 text-left border">Player</th>
                                <th className="p-2 border text-center">Runs</th>
                                <th className="p-2 border text-center">Wickets</th>
                                <th className="p-2 border text-center">Catches</th>
                                <th className="p-2 border text-center">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredScorecards.map((entry) => (
                                <tr key={entry.id} className="hover:bg-gray-700">
                                    <td className="p-2 border">{playerName(entry.playerId)}</td>
                                    <td className="p-2 border text-center">
                                        <input
                                            type="number"
                                            min={0}
                                            value={entry.runs ?? 0}
                                            disabled={!canEdit(entry) || savingId === entry.id}
                                            className="w-20 bg-gray-700 rounded px-2 text-center"
                                            onChange={(e) => updateField(entry.id, "runs", e.target.value)}
                                            onBlur={() => saveRow(entry)}
                                        />
                                    </td>
                                    <td className="p-2 border text-center">
                                        <input
                                            type="number"
                                            min={0}
                                            value={entry.wickets ?? 0}
                                            disabled={!canEdit(entry) || savingId === entry.id}
                                            className="w-20 bg-gray-700 rounded px-2 text-center"
                                            onChange={(e) => updateField(entry.id, "wickets", e.target.value)}
                                            onBlur={() => saveRow(entry)}
                                        />
                                    </td>
                                    <td className="p-2 border text-center">
                                        <input
                                            type="number"
                                            min={0}
                                            value={entry.catches ?? 0}
                                            disabled={!canEdit(entry) || savingId === entry.id}
                                            className="w-20 bg-gray-700 rounded px-2 text-center"
                                            onChange={(e) => updateField(entry.id, "catches", e.target.value)}
                                            onBlur={() => saveRow(entry)}
                                        />
                                    </td>
                                    <td className="p-2 border text-center">
                                        <button
                                            disabled={savingId === entry.id}
                                            className="text-red-600"
                                            title="Delete"
                                            onClick={() => onDelete(entry.id)}
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded bg-gray-800 text-white hover:bg-gray-700"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function MatchScoreManagement() {
    const [matches, setMatches] = useState([]);
    const [teams, setTeams] = useState([]);
    const [players, setPlayers] = useState([]);
    const [scorecards, setScorecards] = useState([]);
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [loadingScores, setLoadingScores] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchAll() {
            try {
                const matches = await fetchWithError(`${API_BASE}/api/matches/all`, "matches");
                const teams = await fetchWithError(`${API_BASE}/api/team/all`, "teams");
                const players = await fetchWithError(`${API_BASE}/api/player/all`, "players");
                setMatches(Array.isArray(matches) ? matches : []);
                setTeams(Array.isArray(teams) ? teams : []);
                setPlayers(Array.isArray(players) ? players : []);
            } catch (e) {
                setError(e.message);
            }
        }
        fetchAll();
    }, []);

    useEffect(() => {
        if (!selectedMatch) {
            setScorecards([]);
            return;
        }
        let cancelled = false;
        setLoadingScores(true);
        setError("");
        fetchWithError(`${API_BASE}/api/scorecard/${selectedMatch.id}`, "scorecards")
            .then((data) => {
                if (!cancelled) setScorecards(data);
            })
            .catch((e) => {
                if (!cancelled) setError(e.message);
            })
            .finally(() => {
                if (!cancelled) setLoadingScores(false);
            });
        return () => {
            cancelled = true;
        };
    }, [selectedMatch]);

    const matchPlayers = useMemo(() => {
        if (!selectedMatch) return [];
        return players.filter(
            (p) => p.teamId === selectedMatch.teamOneId || p.teamId === selectedMatch.teamTwoId
        );
    }, [players, selectedMatch]);

    async function addScoreEntry(playerId) {
        if (!selectedMatch) return;
        const player = matchPlayers.find((p) => p.id === playerId);
        if (!player) return;

        try {
            await fetchWithError(`${API_BASE}/api/scorecard/create`, "creating scorecard", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    runs: 0,
                    wickets: 0,
                    catches: 0,
                    playerId,
                    teamId: player.teamId,
                    matchId: selectedMatch.id,
                }),
            });
            const newCards = await fetchWithError(`${API_BASE}/api/scorecard/${selectedMatch.id}`, "fetching scorecards");
            setScorecards(newCards);
        } catch (e) {
            alert(`Error creating scorecard: ${e.message}`);
        }
    }

    async function updateScoreEntry(id, patch) {
        try {
            await fetchWithError(`${API_BASE}/api/scorecard/${id}`, "updating scorecard", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(patch),
            });
            const newCards = await fetchWithError(`${API_BASE}/api/scorecard/${selectedMatch.id}`, "fetching scorecards");
            setScorecards(newCards);
        } catch (e) {
            alert(`Error updating scorecard: ${e.message}`);
        }
    }

    async function deleteScoreEntry(id) {
        try {
            await fetchWithError(`${API_BASE}/api/scorecard/${id}`, "deleting scorecard", {
                method: "DELETE",
            });
            const newCards = await fetchWithError(`${API_BASE}/api/scorecard/${selectedMatch.id}`, "fetching scorecards");
            setScorecards(newCards);
        } catch (e) {
            alert(`Error deleting scorecard: ${e.message}`);
        }
    }

    return (
        <Section title="Match Score Management">
            {error && <p className="text-red-600 mb-2">{error}</p>}
            <label htmlFor="match-select" className="block mb-2 font-semibold">
                Select Match
            </label>
            <select
                id="match-select"
                value={selectedMatch?.id || ""}
                className="w-full p-2 rounded border border-gray-600 mb-4"
                onChange={(e) => {
                    const id = Number(e.target.value);
                    const match = matches.find((m) => m.id === id);
                    setSelectedMatch(match || null);
                }}
            >
                <option value="">-- Select a Match --</option>
                {matches
                    .filter((m) => m.teamOneId && m.teamTwoId)
                    .map((m) => (
                        <option key={m.id} value={m.id}>
                            {m.teamOneName} vs {m.teamTwoName}
                        </option>
                    ))}
            </select>

            {loadingScores && <p>Loading scores...</p>}

            {selectedMatch && (
                <ScoreManagementPopup
                    team={selectedMatch}
                    players={matchPlayers}
                    entries={scorecards}
                    onAdd={addScoreEntry}
                    onUpdate={updateScoreEntry}
                    onDelete={deleteScoreEntry}
                    onClose={() => setSelectedMatch(null)}
                />
            )}

            {!selectedMatch && !loadingScores && <p>Please select a match to manage scores.</p>}
        </Section>
    );
}
