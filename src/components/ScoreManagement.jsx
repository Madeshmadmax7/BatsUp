import React, { useState, useEffect, useMemo } from "react";
import { Trash2, Plus, X } from "lucide-react";
import { Section } from "./SharedComponents";

const API_BASE = "http://localhost:8080";

// Score Management Modal Component
function ScoreManagementPopup({
    team,
    players,
    entries,
    onAddEntry,
    onUpdateEntry,
    onDeleteEntry,
    onClose,
}) {
    const [localEntries, setLocalEntries] = useState(entries || []);
    const [savingId, setSavingId] = useState(null);

    useEffect(() => setLocalEntries(entries || []), [entries]);

    const addNewForPlayer = async (playerId) => {
        try {
            await onAddEntry(playerId);
        } catch (e) {
            console.error(e);
        }
    };

    const updateField = (id, field, value) => {
        setLocalEntries((prev) =>
            prev.map((e) => (e.id === id ? { ...e, [field]: value } : e))
        );
    };

    const saveRow = async (entry) => {
        setSavingId(entry.id);
        try {
            await onUpdateEntry(entry.id, {
                runs: Number(entry.runs) || 0,
                wickets: Number(entry.wickets) || 0,
                catches: Number(entry.catches) || 0,
                playerId: entry.playerId,
                teamId: team.id,
                matchId: entry.matchId ?? null,
            });
        } finally {
            setSavingId(null);
        }
    };

    const usedPlayerIds = new Set(localEntries.map((e) => Number(e.playerId)));
    const availablePlayers = players.filter((p) => !usedPlayerIds.has(Number(p.id)));

    const playerName = (playerId) => {
        const p = players.find((pp) => Number(pp.id) === Number(playerId));
        return p ? p.nickname || p.name || `#${p.jerseyNumber}` : "Unknown";
    };

    const totals = {
        runs: localEntries.reduce((a, e) => a + (Number(e.runs) || 0), 0),
        wickets: localEntries.reduce((a, e) => a + (Number(e.wickets) || 0), 0),
        catches: localEntries.reduce((a, e) => a + (Number(e.catches) || 0), 0),
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
            onClick={onClose}
        >
            <div
                className="bg-gray-900 border border-gray-800 rounded-2xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">
                        Manage Scores — {team?.teamOneName} vs {team?.teamTwoName}
                    </h3>
                    <button onClick={onClose} className="p-2 rounded hover:bg-gray-800">
                        <X size={18} />
                    </button>
                </div>

                {/* Totals */}
                <div className="grid grid-cols-3 gap-3 mb-6 text-center">
                    <div className="bg-gray-800 rounded p-3">
                        <div className="text-xs text-gray-300">Team Runs</div>
                        <div className="text-xl font-semibold">{totals.runs}</div>
                    </div>
                    <div className="bg-gray-800 rounded p-3">
                        <div className="text-xs text-gray-300">Team Wickets</div>
                        <div className="text-xl font-semibold">{totals.wickets}</div>
                    </div>
                    <div className="bg-gray-800 rounded p-3">
                        <div className="text-xs text-gray-300">Team Catches</div>
                        <div className="text-xl font-semibold">{totals.catches}</div>
                    </div>
                </div>

                {/* Add Player */}
                <div className="mb-6 flex gap-3 items-center">
                    <select
                        id="add-player-select"
                        className="bg-gray-700 p-2 rounded text-white flex-1"
                        defaultValue=""
                        onChange={(e) => {
                            const val = e.target.value;
                            if (!val) return;
                            addNewForPlayer(Number(val));
                            e.target.value = "";
                        }}
                    >
                        <option value="">Select player to add...</option>
                        {availablePlayers.map((p) => (
                            <option key={p.id} value={p.id}>
                                #{p.jerseyNumber} — {p.nickname || p.name}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={() => {
                            const sel = document.getElementById("add-player-select");
                            if (sel && sel.value) {
                                addNewForPlayer(Number(sel.value));
                                sel.value = "";
                            }
                        }}
                        className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
                    >
                        <Plus size={16} /> Add
                    </button>
                </div>

                {availablePlayers.length === 0 && (
                    <p className="mb-4 text-xs text-gray-400">
                        All team players are added to this scorecard.
                    </p>
                )}

                {/* Score table */}
                <table className="w-full text-sm text-white table-auto mb-3 border-collapse border border-gray-700">
                    <thead>
                        <tr>
                            <th className="border border-gray-700 px-2 py-1 text-left">Player</th>
                            <th className="border border-gray-700 px-2 py-1 text-center">Runs</th>
                            <th className="border border-gray-700 px-2 py-1 text-center">Wickets</th>
                            <th className="border border-gray-700 px-2 py-1 text-center">Catches</th>
                            <th className="border border-gray-700 px-2 py-1 text-center">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {localEntries.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="border border-gray-700 px-2 py-2 text-gray-500 text-center"
                                >
                                    No player entries yet.
                                </td>
                            </tr>
                        ) : (
                            localEntries.map((e) => (
                                <tr key={e.id}>
                                    <td className="border border-gray-700 px-2 py-1">{playerName(e.playerId)}</td>
                                    <td className="border border-gray-700 px-2 py-1 text-center">
                                        <input
                                            type="number"
                                            value={e.runs ?? 0}
                                            onChange={(ev) => updateField(e.id, "runs", ev.target.value)}
                                            onBlur={() => saveRow(e)}
                                            className="bg-gray-700 w-20 p-1 rounded text-white text-center"
                                        />
                                    </td>
                                    <td className="border border-gray-700 px-2 py-1 text-center">
                                        <input
                                            type="number"
                                            value={e.wickets ?? 0}
                                            onChange={(ev) => updateField(e.id, "wickets", ev.target.value)}
                                            onBlur={() => saveRow(e)}
                                            className="bg-gray-700 w-20 p-1 rounded text-white text-center"
                                        />
                                    </td>
                                    <td className="border border-gray-700 px-2 py-1 text-center">
                                        <input
                                            type="number"
                                            value={e.catches ?? 0}
                                            onChange={(ev) => updateField(e.id, "catches", ev.target.value)}
                                            onBlur={() => saveRow(e)}
                                            className="bg-gray-700 w-20 p-1 rounded text-white text-center"
                                        />
                                    </td>
                                    <td className="border border-gray-700 px-2 py-1 text-center">
                                        <button
                                            className="text-red-500 hover:text-red-600"
                                            title="Delete Player Entry"
                                            onClick={() => onDeleteEntry(e.id)}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                <div className="flex justify-end mt-6">
                    <button
                        onClick={onClose}
                        className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded px-4 py-2"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

// Main Score Management Component
export default function ScoreManagement({
    fixtureRounds,
    teams,
    allPlayers,
    onError,
    onScorecardsRefresh,
}) {
    const [scorecards, setScorecards] = useState([]);
    const [loadingScorecards, setLoadingScorecards] = useState(false);
    const [selectedMatch, setSelectedMatch] = useState(null);

    const getPlayersByTeamName = (teamName) => {
        const team = teams.find((t) => t.name === teamName);
        if (!team) return [];
        return allPlayers.filter((p) => Number(p.teamId) === Number(team.id));
    };

    const matchPlayers = useMemo(() => {
        if (!selectedMatch) return [];
        return [...getPlayersByTeamName(selectedMatch.teamOneName), ...getPlayersByTeamName(selectedMatch.teamTwoName)];
    }, [selectedMatch, teams, allPlayers]);

    const matchScorecards = useMemo(() => {
        if (!selectedMatch) return [];
        return scorecards.filter((s) => s.matchId === selectedMatch.id);
    }, [selectedMatch, scorecards]);

    const refreshScorecards = async () => {
        if (!selectedMatch) {
            setScorecards([]);
            return;
        }
        setLoadingScorecards(true);
        onError("");
        try {
            const res = await fetch(`${API_BASE}/api/scorecard/match/${selectedMatch.id}`);
            const data = await res.json();
            setScorecards(Array.isArray(data) ? data : []);
            if (onScorecardsRefresh) onScorecardsRefresh(data);
        } catch {
            onError("Failed to load scorecards.");
            setScorecards([]);
        } finally {
            setLoadingScorecards(false);
        }
    };

    useEffect(() => {
        refreshScorecards();
    }, [selectedMatch]);

    const addPlayerScoreEntry = async (playerId) => {
        if (!selectedMatch) return;
        const player = matchPlayers.find((p) => p.id === playerId);
        if (!player) return;
        const payload = {
            runs: 0,
            wickets: 0,
            catches: 0,
            playerId,
            teamId: player.teamId,
            matchId: selectedMatch.id,
        };
        await fetch(`${API_BASE}/api/scorecard/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        refreshScorecards();
    };

    const updateScoreEntry = async (id, patch) => {
        const current = scorecards.find((s) => s.id === id);
        if (!current) return;
        const dto = {
            id,
            runs: patch.runs ?? current.runs,
            wickets: patch.wickets ?? current.wickets,
            catches: patch.catches ?? current.catches,
            playerId: patch.playerId ?? current.playerId,
            teamId: patch.teamId ?? current.teamId,
            matchId: patch.matchId ?? current.matchId,
        };
        await fetch(`${API_BASE}/api/scorecard/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dto),
        });
        refreshScorecards();
    };

    const deleteScoreEntry = async (id) => {
        await fetch(`${API_BASE}/api/scorecard/${id}`, { method: "DELETE" });
        refreshScorecards();
    };

    return (
        <Section title="Score Management">
            <label className="block mb-2 font-semibold text-lg">Select Match to Manage Scores:</label>
            <select
                className="mb-4 p-2 rounded w-full max-w-md bg-gray-800 text-white border border-gray-700"
                value={selectedMatch ? selectedMatch.id : ""}
                onChange={(e) => {
                    const val = e.target.value;
                    if (!val) {
                        setSelectedMatch(null);
                        return;
                    }
                    const match = fixtureRounds.find((m) => m.id.toString() === val);
                    setSelectedMatch(match || null);
                }}
            >
                <option value="">-- Select Match --</option>
                {fixtureRounds.map((m) => (
                    <option key={m.id} value={m.id}>
                        {m.teamOneName || "TBD"} vs {m.teamTwoName || "TBD"}
                    </option>
                ))}
            </select>

            {loadingScorecards && <p>Loading scorecards…</p>}

            {!selectedMatch ? (
                <p className="text-gray-400 italic">Please select a match above to manage scores.</p>
            ) : (
                <ScoreManagementPopup
                    team={selectedMatch}
                    players={matchPlayers}
                    entries={matchScorecards}
                    onAddEntry={addPlayerScoreEntry}
                    onUpdateEntry={updateScoreEntry}
                    onDeleteEntry={deleteScoreEntry}
                    onClose={() => setSelectedMatch(null)}
                />
            )}
        </Section>
    );
}
