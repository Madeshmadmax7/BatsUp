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
        if (!entry.id) return;
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
            className="fixed inset-0  z-50 flex items-center justify-center bg-black/75"
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

                <div className="flex mb-4 gap-2">
                    {[team.teamOneId, team.teamTwoId].map((tid) => {
                        const isActive = tid === activeTeamId;
                        const name = tid === team.teamOneId ? team.teamOneName : team.teamTwoName;
                        return (
                            <button
                                key={tid}
                                onClick={() => setActiveTeamId(tid)}
                                className={`px-4 py-2 rounded ${
                                    isActive ? "bg-blue-700 text-white" : "bg-gray-700 text-gray-300"
                                }`}
                            >
                                {name}
                            </button>
                        );
                    })}
                </div>

                <div className="grid grid-cols-3 mb-4 text-white text-center gap-4">
                    <div className="bg-gray-800 p-3 rounded">Runs: {totals.runs}</div>
                    <div className="bg-gray-800 p-3 rounded">Wickets: {totals.wickets}</div>
                    <div className="bg-gray-800 p-3 rounded">Catches: {totals.catches}</div>
                </div>

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
            const newCards = await fetchWithError(
                `${API_BASE}/api/scorecard/${selectedMatch.id}`,
                "fetching scorecards"
            );
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
            const newCards = await fetchWithError(
                `${API_BASE}/api/scorecard/${selectedMatch.id}`,
                "fetching scorecards"
            );
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
            const newCards = await fetchWithError(
                `${API_BASE}/api/scorecard/${selectedMatch.id}`,
                "fetching scorecards"
            );
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


// import React, { useState, useEffect, useMemo } from "react";
// import { Trash2, Plus, X } from "lucide-react";
// import axios from "axios";
// import { Section } from "./SharedComponents";

// const API_BASE = "https://batsup-v1.oz";

// // Utility for standardized fetch with error handling.
// async function fetchWithError(url, desc, options) {
//     const res = await fetch(url, options);
//     if (!res.ok) {
//         const text = await res.text();
//         throw new Error(`${desc} failed: ${res.status} - ${text}`);
//     }
//     return await res.json();
// }

// function ScoreManagementPopup({ team, players, entries, onAdd, onUpdate, onDelete, onClose }) {
//     const [localEntries, setLocalEntries] = useState([]);
//     const [savingId, setSavingId] = useState(null);
//     const [activeTeamId, setActiveTeamId] = useState(team.teamOneId);

//     useEffect(() => {
//         setLocalEntries(Array.isArray(entries) ? entries : []);
//     }, [entries]);

//     const filteredPlayers = useMemo(() => players.filter(p => p.teamId === activeTeamId), [players, activeTeamId]);
//     const filteredScorecards = useMemo(() => localEntries.filter(e => e.teamId === activeTeamId), [localEntries, activeTeamId]);

//     const usedPlayerIds = new Set(filteredScorecards.map(e => e.playerId));
//     const availablePlayers = filteredPlayers.filter(p => !usedPlayerIds.has(p.id));

//     const totals = filteredScorecards.reduce(
//         (acc, e) => {
//             acc.runs += e.runs || 0;
//             acc.wickets += e.wickets || 0;
//             acc.catches += e.catches || 0;
//             return acc;
//         },
//         { runs: 0, wickets: 0, catches: 0 }
//     );

//     function playerName(id) {
//         const p = players.find(pl => pl.id === id);
//         return p ? p.nickname || p.name || `#${p.jerseyNumber || "N/A"}` : "Unknown";
//     }

//     async function handleAddPlayer(id) {
//         if (!id) return;
//         try {
//             await onAdd(id);
//         } catch (e) {
//             alert("Failed to add player: " + e.message);
//         }
//     }

//     function updateField(id, field, value) {
//         setLocalEntries(ls => ls.map(e => (e.id === id ? { ...e, [field]: value } : e)));
//     }

//     async function saveRow(entry) {
//         if (!entry.id) return;
//         setSavingId(entry.id);
//         try {
//             await onUpdate(entry.id, {
//                 runs: Number(entry.runs) || 0,
//                 wickets: Number(entry.wickets) || 0,
//                 catches: Number(entry.catches) || 0,
//                 playerId: entry.playerId,
//                 teamId: activeTeamId,
//                 matchId: entry.matchId,
//             });
//         } finally {
//             setSavingId(null);
//         }
//     }

//     const canEdit = entry => Boolean(entry.id);

//     return (
//         <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-75 flex items-center justify-center p-4">
//             <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto p-6">
//                 <div className="flex justify-between items-center mb-4">
//                     <h3 className="text-xl text-white font-semibold">
//                         Manage Scores — {team.teamOneName} vs {team.teamTwoName}
//                     </h3>
//                     <button onClick={onClose} className="text-white p-2 rounded hover:bg-gray-800">
//                         <X size={20} />
//                     </button>
//                 </div>

//                 {/* Tabs for team selection */}
//                 <div className="flex mb-4 gap-2">
//                     {[team.teamOneId, team.teamTwoId].map(tid => {
//                         const active = tid === activeTeamId;
//                         return (
//                             <button
//                                 key={tid}
//                                 onClick={() => setActiveTeamId(tid)}
//                                 className={`px-4 py-2 rounded ${active ? "bg-blue-700 text-white" : "bg-gray-700 text-gray-300"}`}
//                                 aria-pressed={active}
//                             >
//                                 {tid === team.teamOneId ? team.teamOneName : team.teamTwoName}
//                             </button>
//                         );
//                     })}
//                 </div>

//                 {/* Totals */}
//                 <div className="grid grid-cols-3 gap-4 text-center text-white mb-4">
//                     <div className="bg-gray-800 p-3 rounded">Runs: {totals.runs}</div>
//                     <div className="bg-gray-800 p-3 rounded">Wickets: {totals.wickets}</div>
//                     <div className="bg-gray-800 p-3 rounded">Catches: {totals.catches}</div>
//                 </div>

//                 {/* Add Player */}
//                 <div className="flex gap-2 mb-4">
//                     <select
//                         className="flex-grow p-2 rounded bg-gray-700 text-white focus:outline-none"
//                         defaultValue=""
//                         onChange={e => {
//                             if (e.target.value) {
//                                 handleAddPlayer(Number(e.target.value));
//                                 e.target.value = "";
//                             }
//                         }}
//                         aria-label="Add player"
//                     >
//                         <option value="" disabled>
//                             Select player to add...
//                         </option>
//                         {availablePlayers.length === 0 && <option disabled>No players left</option>}
//                         {availablePlayers.map(p => (
//                             <option key={p.id} value={p.id}>
//                                 {p.nickname || p.name || `#${p.jerseyNumber || "N/A"}`}
//                             </option>
//                         ))}
//                     </select>
//                     <button
//                         onClick={() => {
//                             const select = document.querySelector('select[aria-label="Add player"]');
//                             if (select?.value) {
//                                 handleAddPlayer(Number(select.value));
//                                 select.value = "";
//                             }
//                         }}
//                         className="bg-green-600 hover:bg-green-700 text-white rounded px-4 flex items-center gap-2"
//                     >
//                         <Plus size={16} />
//                         Add
//                     </button>
//                 </div>

//                 {/* Scorecard Table */}
//                 {filteredScorecards.length === 0 ? (
//                     <p className="text-white text-center py-10">No scores added for this team.</p>
//                 ) : (
//                     <table className="w-full table-auto border-collapse border border-gray-700 text-white">
//                         <thead>
//                             <tr className="bg-gray-800">
//                                 <th className="p-2 border border-gray-600 text-left">Player</th>
//                                 <th className="p-2 border border-gray-600 text-center">Runs</th>
//                                 <th className="p-2 border border-gray-600 text-center">Wickets</th>
//                                 <th className="p-2 border border-gray-600 text-center">Catches</th>
//                                 <th className="p-2 border border-gray-600 text-center">Delete</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {filteredScorecards.map(entry => (
//                                 <tr key={entry.id} className="hover:bg-gray-700">
//                                     <td className="p-2 border border-gray-600">{playerName(entry.playerId)}</td>
//                                     <td className="p-2 border border-gray-600">
//                                         <input
//                                             type="number"
//                                             min={0}
//                                             value={entry.runs || 0}
//                                             disabled={!canEdit(entry) || savingId === entry.id}
//                                             onChange={e => updateField(entry.id, "runs", e.target.value)}
//                                             onBlur={() => saveRow(entry)}
//                                             className="w-16 bg-gray-700 rounded px-2 text-center text-white"
//                                         />
//                                     </td>
//                                     <td className="p-2 border border-gray-600">
//                                         <input
//                                             type="number"
//                                             min={0}
//                                             value={entry.wickets || 0}
//                                             disabled={!canEdit(entry) || savingId === entry.id}
//                                             onChange={e => updateField(entry.id, "wickets", e.target.value)}
//                                             onBlur={() => saveRow(entry)}
//                                             className="w-16 bg-gray-700 rounded px-2 text-center text-white"
//                                         />
//                                     </td>
//                                     <td className="p-2 border border-gray-600">
//                                         <input
//                                             type="number"
//                                             min={0}
//                                             value={entry.catches || 0}
//                                             disabled={!canEdit(entry) || savingId === entry.id}
//                                             onChange={e => updateField(entry.id, "catches", e.target.value)}
//                                             onBlur={() => saveRow(entry)}
//                                             className="w-16 bg-gray-700 rounded px-2 text-center text-white"
//                                         />
//                                     </td>
//                                     <td className="p-2 border border-gray-600">
//                                         <button
//                                             disabled={savingId === entry.id}
//                                             onClick={() => onDelete(entry.id)}
//                                             className="text-red-600 hover:text-red-800"
//                                             aria-label="Delete score entry"
//                                         >
//                                             <Trash2 size={20} />
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 )}

//                 <div className="flex justify-end mt-6">
//                     <button onClick={onClose} className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded">
//                         Close
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default function MatchScoreManagement() {
//     const [matches, setMatches] = useState([]);
//     const [teams, setTeams] = useState([]);
//     const [players, setPlayers] = useState([]);
//     const [scorecards, setScorecards] = useState([]);
//     const [selectedMatch, setSelectedMatch] = useState(null);
//     const [loadingScores, setLoadingScores] = useState(false);
//     const [error, setError] = useState("");

//     useEffect(() => {
//         async function fetchData() {
//             try {
//                 const [matchesRes, teamsRes, playersRes] = await Promise.all([
//                     fetchWithError(`${API_BASE}/api/matches/all`, "matches"),
//                     fetchWithError(`${API_BASE}/api/team/all`, "teams"),
//                     fetchWithError(`${API_BASE}/api/player/all`, "players"),
//                 ]);
//                 setMatches(matchesRes);
//                 setTeams(teamsRes);
//                 setPlayers(playersRes);
//             } catch (e) {
//                 setError(e.message);
//             }
//         }
//         fetchData();
//     }, []);

//     useEffect(() => {
//         if (!selectedMatch) {
//             setScorecards([]);
//             return;
//         }
//         setLoadingScores(true);
//         fetchWithError(`${API_BASE}/api/scorecard/${selectedMatch.id}`, "scorecards")
//             .then(data => setScorecards(data))
//             .catch(e => setError(e.message))
//             .finally(() => setLoadingScores(false));
//     }, [selectedMatch]);

//     const matchPlayers = useMemo(() => {
//         if (!selectedMatch) return [];
//         return players.filter(p => p.teamId === selectedMatch.teamOneId || p.teamId === selectedMatch.teamTwoId);
//     }, [players, selectedMatch]);

//     const availablePlayers = useMemo(() => {
//         const usedIds = new Set(scorecards.map(c => c.playerId));
//         return matchPlayers.filter(p => !usedIds.has(p.id));
//     }, [matchPlayers, scorecards]);

//     function playerName(id) {
//         const p = players.find(pl => pl.id === id);
//         return p ? p.nickname || p.name || `#${p.jerseyNumber || "N/A"}` : "Unknown";
//     }

//     function canEdit(entry) {
//         return Boolean(entry.id);
//     }

//     async function addEntry(playerId) {
//         if (!selectedMatch) return;
//         try {
//             await fetchWithError(`${API_BASE}/api/scorecard/create`, "create scorecard", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({
//                     runs: 0,
//                     wickets: 0,
//                     catches: 0,
//                     playerId,
//                     teamId: players.find(p => p.id === playerId)?.teamId,
//                     matchId: selectedMatch.id,
//                 }),
//             });
//             const updated = await fetchWithError(`${API_BASE}/api/scorecard/${selectedMatch.id}`, "fetch scorecards");
//             setScorecards(updated);
//         } catch (e) {
//             alert("Error adding scorecard: " + e.message);
//         }
//     }

//     async function updateEntry(id, patch) {
//         try {
//             await fetchWithError(`${API_BASE}/api/scorecard/${id}`, "update scorecard", {
//                 method: "PUT",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(patch),
//             });
//             const updated = await fetchWithError(`${API_BASE}/api/scorecard/${selectedMatch.id}`, "fetch scorecards");
//             setScorecards(updated);
//         } catch (e) {
//             alert("Error updating scorecard: " + e.message);
//         }
//     }

//     async function deleteEntry(id) {
//         try {
//             await fetchWithError(`${API_BASE}/api/scorecard/${id}`, "delete scorecard", { method: "DELETE" });
//             const updated = await fetchWithError(`${API_BASE}/api/scorecard/${selectedMatch.id}`, "fetch scorecards");
//             setScorecards(updated);
//         } catch (e) {
//             alert("Error deleting scorecard: " + e.message);
//         }
//     }

//     return (
//         <Section title="Match Score Management" className="overflow-auto">
//             <div>
//                 <label htmlFor="match-select" className="block mb-2 font-semibold text-white">
//                     Select Match:
//                 </label>
//                 <select
//                     id="match-select"
//                     className="w-full max-w-md mb-6 p-2 rounded border border-gray-600"
//                     value={selectedMatch?.id || ""}
//                     onChange={e => {
//                         const id = Number(e.target.value);
//                         const match = matches.find(m => m.id === id);
//                         setSelectedMatch(match || null);
//                     }}
//                 >
//                     <option value="">Select a match</option>
//                     {matches.map(m => (
//                         <option key={m.id} value={m.id}>
//                             {m.teamOneName} vs {m.teamTwoName}
//                         </option>
//                     ))}
//                 </select>
//             </div>

//             {loadingScores && <p className="text-white">Loading scores...</p>}
//             {error && <p className="text-red-600">{error}</p>}

//             {selectedMatch && (
//                 <ScoreManagementPopup
//                     team={selectedMatch}
//                     players={players}
//                     entries={scorecards}
//                     onAdd={addEntry}
//                     onUpdate={updateEntry}
//                     onDelete={deleteEntry}
//                     onClose={() => setSelectedMatch(null)}
//                 />
//             )}

//             {!selectedMatch && !loadingScores && (
//                 <p className="text-white mt-10">Select a match to manage scores.</p>
//             )}
//         </Section>
//     );
// }
