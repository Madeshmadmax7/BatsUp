import React, { useState, useCallback } from "react";
import TournamentManagement from "./TournamentManagement";
import TeamManagement from "./TeamManagement";
import ScoreManagement from "./ScoreManagement";
import FixtureRounds from "./FixtureRounds";
import LeaderBoard from "./LeaderBoard";
import { ErrorNote } from "./SharedComponents";
import NewsletterManagement from "./NewsLetterManagement";

export default function AdminPanel() {
    const [error, setError] = useState("");

    const [tournaments, setTournaments] = useState([]);
    const [selectedTournament, setSelectedTournament] = useState(null);

    const [teams, setTeams] = useState([]);
    const [allPlayers, setAllPlayers] = useState([]);

    const [fixtureRounds, setFixtureRounds] = useState([]);

    // Memoized error setter to keep stable reference
    const onError = useCallback((msg) => {
        setError(msg);
    }, []);

    // Memoized teams change handler
    const onTeamsChange = useCallback((updatedTeams) => {
        setTeams(updatedTeams);
    }, []);

    // Memoized players change handler
    const onPlayersChange = useCallback((players) => {
        setAllPlayers(players);
    }, []);

    // When tournament changes, reset dependent state
    const handleTournamentSelect = useCallback((tournament) => {
        setSelectedTournament(tournament);
        setFixtureRounds([]);
        setTeams([]);
        setAllPlayers([]);
    }, []);

    return (
        <div className="p-6 max-w-7xl mx-auto bg-black min-h-screen text-white space-y-10">
            <header className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Admin Control Panel</h1>
            </header>

            <ErrorNote message={error} />

            <TournamentManagement
                selectedTournament={selectedTournament}
                onTournamentSelect={handleTournamentSelect}
                onError={onError}
            />

            <TeamManagement
                selectedTournament={selectedTournament}
                onError={onError}
                onTeamsChange={onTeamsChange}
                onPlayersChange={onPlayersChange}
            />

            <ScoreManagement
                fixtureRounds={fixtureRounds}
                teams={teams}
                allPlayers={allPlayers}
                onError={onError}
            />

            <NewsletterManagement
                tournaments={tournaments}
                teams={teams}
                selectedTournament={selectedTournament}
                onTournamentSelect={handleTournamentSelect}
                onError={onError}
            />

            <FixtureRounds
                selectedTournament={selectedTournament}
                fixtureRounds={fixtureRounds}
                setFixtureRounds={setFixtureRounds}
                onError={onError}
            />
            <LeaderBoard onError={onError} />

            <footer className="py-8 text-center text-gray-500 text-sm">
                Admin Console — Cricket Manager
            </footer>
        </div>
    );
}

// // import React, { useState, useEffect } from "react";
// // import { useAuth } from "../AuthContext";
// // import ScoreSection from "./ScoreSection";
// // import TournamentSection from "./TournamentSection";
// // import NewsletterSection from "./NewsletterSection";
// // import FixturesSection from "./FixturesSection";
// // import ManagementSection from "./ManagementSection";

// // const AdminTeams = () => {
// //     const { user } = useAuth();
// //     const [teams, setTeams] = useState([]);

// //     useEffect(() => {
// //         // fetch teams API logic
// //         const fetchTeams = async () => {
// //             try {
// //                 const res = await fetch("http://localhost:8080/api/team");
// //                 const data = await res.json();
// //                 setTeams(data);
// //             } catch (err) {
// //                 console.error("Error fetching teams:", err);
// //             }
// //         };
// //         fetchTeams();
// //     }, []);

// //     return (
// //         <div className="p-6 space-y-8">
// //             <h1 className="text-2xl font-bold">Admin Dashboard</h1>

// //             {/* Teams list (still inside parent) */}
// //             <div>
// //                 <h2 className="text-xl font-semibold mb-4">Teams</h2>
// //                 <ul className="space-y-2">
// //                     {teams.map((team) => (
// //                         <li key={team.id} className="border p-3 rounded-lg">
// //                             {team.name}
// //                         </li>
// //                     ))}
// //                 </ul>
// //             </div>

// //             {/* Child components */}
// //             <ScoreSection />
// //             <TournamentSection />
// //             <NewsletterSection />
// //             <FixturesSection />
// //             <ManagementSection />
// //         </div>
// //     );
// // };

// // export default AdminTeams;


// import React, { useEffect, useMemo, useState } from "react";
// import { Trash2, Plus, RefreshCw, AlertCircle, X } from "lucide-react";
// import axios from "axios";

// const API_BASE = "http://localhost:8080"; // update if needed

// function clsx(...parts) {
//     return parts.filter(Boolean).join(" ");
// }

// function Section({ title, children, right }) {
//     return (
//         <section className="bg-gray-900/40 rounded-2xl border border-gray-800 p-6 shadow-sm">
//             <div className="flex items-center justify-between gap-4 mb-5">
//                 <h2 className="text-2xl font-semibold">{title}</h2>
//                 {right}
//             </div>
//             {children}
//         </section>
//     );
// }

// function InlineSpinner({ label }) {
//     return (
//         <span className="inline-flex items-center gap-2 text-sm text-gray-300">
//             <RefreshCw className="animate-spin" size={16} />
//             {label || "Loading..."}
//         </span>
//     );
// }

// function Empty({ children }) {
//     return <p className="text-gray-400 italic">{children}</p>;
// }

// function ErrorNote({ message }) {
//     if (!message) return null;
//     return (
//         <div className="flex items-start gap-2 text-rose-300 bg-rose-900/20 border border-rose-800 rounded-lg p-3 mb-4">
//             <AlertCircle size={18} className="mt-0.5" />
//             <div className="text-sm leading-5">{message}</div>
//         </div>
//     );
// }

// // -------------------------------------------------------------
// // Score Management Modal (Improved for match-based management)
// // -------------------------------------------------------------
// function ScoreManagementPopup({ team, players, entries, onAddEntry, onUpdateEntry, onDeleteEntry, onClose }) {
//     const [localEntries, setLocalEntries] = useState(entries || []);
//     const [savingId, setSavingId] = useState(null);

//     useEffect(() => setLocalEntries(entries || []), [entries]);

//     const addNewForPlayer = async (playerId) => {
//         try {
//             await onAddEntry(playerId);
//         } catch (e) {
//             console.error(e);
//         }
//     };

//     const updateField = (id, field, value) => {
//         setLocalEntries((prev) => prev.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
//     };

//     const saveRow = async (entry) => {
//         setSavingId(entry.id);
//         try {
//             await onUpdateEntry(entry.id, {
//                 runs: Number(entry.runs) || 0,
//                 wickets: Number(entry.wickets) || 0,
//                 catches: Number(entry.catches) || 0,
//                 playerId: entry.playerId,
//                 teamId: team.id,
//                 roundId: entry.roundId ?? null,
//             });
//         } finally {
//             setSavingId(null);
//         }
//     };

//     const usedPlayerIds = new Set(localEntries.map((e) => Number(e.playerId)));
//     const availablePlayers = players.filter((p) => !usedPlayerIds.has(Number(p.id)));

//     const playerName = (playerId) => {
//         const p = players.find((pp) => Number(pp.id) === Number(playerId));
//         return p ? p.nickname || p.name || `#${p.jerseyNumber}` : "Unknown";
//     };

//     const totals = {
//         runs: localEntries.reduce((a, e) => a + (Number(e.runs) || 0), 0),
//         wickets: localEntries.reduce((a, e) => a + (Number(e.wickets) || 0), 0),
//         catches: localEntries.reduce((a, e) => a + (Number(e.catches) || 0), 0),
//     };

//     return (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
//             <div
//                 className="bg-gray-900 border border-gray-800 rounded-2xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto"
//                 onClick={(e) => e.stopPropagation()}
//             >
//                 <div className="flex items-center justify-between mb-4">
//                     <h3 className="text-xl font-bold">Manage Scores — {team?.teamOneName} vs {team?.teamTwoName}</h3>
//                     <button onClick={onClose} className="p-2 rounded hover:bg-gray-800">
//                         <X size={18} />
//                     </button>
//                 </div>

//                 {/* Totals */}
//                 <div className="grid grid-cols-3 gap-3 mb-6 text-center">
//                     <div className="bg-gray-800 rounded p-3">
//                         <div className="text-xs text-gray-300">Team Runs</div>
//                         <div className="text-xl font-semibold">{totals.runs}</div>
//                     </div>
//                     <div className="bg-gray-800 rounded p-3">
//                         <div className="text-xs text-gray-300">Team Wickets</div>
//                         <div className="text-xl font-semibold">{totals.wickets}</div>
//                     </div>
//                     <div className="bg-gray-800 rounded p-3">
//                         <div className="text-xs text-gray-300">Team Catches</div>
//                         <div className="text-xl font-semibold">{totals.catches}</div>
//                     </div>
//                 </div>

//                 {/* Add Player */}
//                 <div className="mb-6 flex gap-3 items-center">
//                     <select
//                         id="add-player-select"
//                         className="bg-gray-700 p-2 rounded text-white flex-1"
//                         defaultValue=""
//                         onChange={(e) => {
//                             const val = e.target.value;
//                             if (!val) return;
//                             addNewForPlayer(Number(val));
//                             e.target.value = "";
//                         }}
//                     >
//                         <option value="">Select player to add...</option>
//                         {availablePlayers.map((p) => (
//                             <option key={p.id} value={p.id}>
//                                 #{p.jerseyNumber} — {p.nickname || p.name}
//                             </option>
//                         ))}
//                     </select>
//                     <button
//                         onClick={() => {
//                             const sel = document.getElementById("add-player-select");
//                             if (sel && sel.value) {
//                                 addNewForPlayer(Number(sel.value));
//                                 sel.value = "";
//                             }
//                         }}
//                         className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
//                     >
//                         <Plus size={16} /> Add
//                     </button>
//                 </div>

//                 {availablePlayers.length === 0 && (
//                     <p className="mb-4 text-xs text-gray-400">All team players are added to this scorecard.</p>
//                 )}

//                 {/* Score table */}
//                 <table className="w-full text-sm text-white table-auto mb-3 border-collapse border border-gray-700">
//                     <thead>
//                         <tr>
//                             <th className="border border-gray-700 px-2 py-1 text-left">Player</th>
//                             <th className="border border-gray-700 px-2 py-1 text-center">Runs</th>
//                             <th className="border border-gray-700 px-2 py-1 text-center">Wickets</th>
//                             <th className="border border-gray-700 px-2 py-1 text-center">Catches</th>
//                             <th className="border border-gray-700 px-2 py-1 text-center">Delete</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {localEntries.length === 0 ? (
//                             <tr>
//                                 <td colSpan={5} className="border border-gray-700 px-2 py-2 text-gray-500 text-center">
//                                     No player entries yet.
//                                 </td>
//                             </tr>
//                         ) : (
//                             localEntries.map((e) => (
//                                 <tr key={e.id}>
//                                     <td className="border border-gray-700 px-2 py-1">{playerName(e.playerId)}</td>
//                                     <td className="border border-gray-700 px-2 py-1 text-center">
//                                         <input
//                                             type="number"
//                                             value={e.runs ?? 0}
//                                             onChange={(ev) => updateField(e.id, "runs", ev.target.value)}
//                                             onBlur={() => saveRow(e)}
//                                             className="bg-gray-700 w-20 p-1 rounded text-white text-center"
//                                         />
//                                     </td>
//                                     <td className="border border-gray-700 px-2 py-1 text-center">
//                                         <input
//                                             type="number"
//                                             value={e.wickets ?? 0}
//                                             onChange={(ev) => updateField(e.id, "wickets", ev.target.value)}
//                                             onBlur={() => saveRow(e)}
//                                             className="bg-gray-700 w-20 p-1 rounded text-white text-center"
//                                         />
//                                     </td>
//                                     <td className="border border-gray-700 px-2 py-1 text-center">
//                                         <input
//                                             type="number"
//                                             value={e.catches ?? 0}
//                                             onChange={(ev) => updateField(e.id, "catches", ev.target.value)}
//                                             onBlur={() => saveRow(e)}
//                                             className="bg-gray-700 w-20 p-1 rounded text-white text-center"
//                                         />
//                                     </td>
//                                     <td className="border border-gray-700 px-2 py-1 text-center">
//                                         <button
//                                             className="text-red-500 hover:text-red-600"
//                                             title="Delete Player Entry"
//                                             onClick={() => onDeleteEntry(e.id)}
//                                         >
//                                             <Trash2 size={18} />
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))
//                         )}
//                     </tbody>
//                 </table>

//                 <div className="flex justify-end mt-6">
//                     <button
//                         onClick={onClose}
//                         className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded px-4 py-2"
//                     >
//                         Close
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }

// // -------------------------------------------------------------
// // Main AdminPanel
// // -------------------------------------------------------------
// export default function AdminPanel() {
//     const [error, setError] = useState("");

//     const [tournaments, setTournaments] = useState([]);
//     const [selectedTournament, setSelectedTournament] = useState(null);
//     const [loadingTournaments, setLoadingTournaments] = useState(false);

//     const [teams, setTeams] = useState([]);
//     const [loadingTeams, setLoadingTeams] = useState(false);
//     const [selectedTeam, setSelectedTeam] = useState(null);

//     const [allPlayers, setAllPlayers] = useState([]);
//     const [loadingPlayers, setLoadingPlayers] = useState(false);

//     const [scorecards, setScorecards] = useState([]);
//     const [loadingScorecards, setLoadingScorecards] = useState(false);

//     const [selectedMatch, setSelectedMatch] = useState(null);

//     const [newsletterList, setNewsletterList] = useState([]);
//     const [loadingNews, setLoadingNews] = useState(false);
//     const [newsletterForm, setNewsletterForm] = useState({
//         subject: "",
//         summary: "",
//         imageLink: "",
//         tournamentId: "",
//         teamId: "",
//         content: "",
//     });

//     const [tournamentForm, setTournamentForm] = useState({
//         tournamentName: "",
//         startDate: "",
//         matchType: "",
//         location: "",
//         description: "",
//         image: "",
//     });

//     const [fixtureRounds, setFixtureRounds] = useState([]);
//     const [loadingRounds, setLoadingRounds] = useState(false);
//     const [generating, setGenerating] = useState(false);

//     const getPlayersOfTeam = (teamId) => allPlayers.filter((p) => Number(p.teamId) === Number(teamId));

//     const getPlayersByTeamName = (teamName) => {
//         const team = teams.find((t) => t.name === teamName);
//         if (!team) return [];
//         return getPlayersOfTeam(team.id);
//     };

//     const matchPlayers = useMemo(() => {
//         if (!selectedMatch) return [];
//         return [...getPlayersByTeamName(selectedMatch.teamOneName), ...getPlayersByTeamName(selectedMatch.teamTwoName)];
//     }, [selectedMatch, teams, allPlayers]);

//     const matchScorecards = useMemo(() => {
//         if (!selectedMatch) return [];
//         return scorecards.filter((s) => s.roundId === selectedMatch.id);
//     }, [selectedMatch, scorecards]);

//     useEffect(() => {
//         const loadTournaments = async () => {
//             setLoadingTournaments(true);
//             setError("");
//             try {
//                 const res = await fetch(`${API_BASE}/api/tournaments/get`);
//                 const data = await res.json();
//                 setTournaments(Array.isArray(data) ? data : []);
//             } catch {
//                 setError("Failed to load tournaments.");
//                 setTournaments([]);
//             } finally {
//                 setLoadingTournaments(false);
//             }
//         };
//         loadTournaments();
//     }, []);

//     useEffect(() => {
//         const loadTeams = async () => {
//             if (!selectedTournament) {
//                 setTeams([]);
//                 return;
//             }
//             setLoadingTeams(true);
//             setError("");
//             try {
//                 const res = await fetch(`${API_BASE}/api/tournaments/${selectedTournament.id}/teams`);
//                 const data = await res.json();
//                 setTeams(Array.isArray(data) ? data : []);
//             } catch {
//                 setError("Failed to load teams.");
//                 setTeams([]);
//             } finally {
//                 setLoadingTeams(false);
//             }
//         };
//         loadTeams();
//     }, [selectedTournament]);

//     useEffect(() => {
//         const loadPlayers = async () => {
//             setLoadingPlayers(true);
//             setError("");
//             try {
//                 const res = await fetch(`${API_BASE}/api/player/all`);
//                 const data = await res.json();
//                 setAllPlayers(Array.isArray(data) ? data : []);
//             } catch {
//                 setError("Failed to load players.");
//                 setAllPlayers([]);
//             } finally {
//                 setLoadingPlayers(false);
//             }
//         };
//         loadPlayers();
//     }, [teams]);

//     const refreshScorecards = async () => {
//         setLoadingScorecards(true);
//         setError("");
//         try {
//             const res = await fetch(`${API_BASE}/api/scorecard/all`);
//             const data = await res.json();
//             setScorecards(Array.isArray(data) ? data : []);
//         } catch {
//             setError("Failed to load scorecards.");
//             setScorecards([]);
//         } finally {
//             setLoadingScorecards(false);
//         }
//     };
//     useEffect(() => {
//         refreshScorecards();
//     }, []);

//     useEffect(() => {
//         const loadRounds = async () => {
//             if (!selectedTournament) {
//                 setFixtureRounds([]);
//                 return;
//             }
//             setLoadingRounds(true);
//             setError("");
//             try {
//                 const res = await axios.get(`${API_BASE}/api/round/tournament/${selectedTournament.id}`);
//                 const data = Array.isArray(res.data) ? res.data : [];
//                 data.sort((a, b) => (a.roundNumber - b.roundNumber) || (a.id - b.id));
//                 setFixtureRounds(data);
//             } catch {
//                 setError("Failed to load rounds for this tournament.");
//                 setFixtureRounds([]);
//             } finally {
//                 setLoadingRounds(false);
//             }
//         };
//         loadRounds();
//     }, [selectedTournament]);

//     const handleTournamentField = (field, val) => setTournamentForm((p) => ({ ...p, [field]: val }));

//     const addTournament = async (e) => {
//         e.preventDefault();
//         setError("");
//         try {
//             const res = await fetch(`${API_BASE}/api/tournaments/create`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(tournamentForm),
//             });
//             if (!res.ok) throw new Error("Create failed");
//             const listRes = await fetch(`${API_BASE}/api/tournaments/get`);
//             const data = await listRes.json();
//             setTournaments(Array.isArray(data) ? data : []);
//             setTournamentForm({ tournamentName: "", startDate: "", matchType: "", location: "", description: "", image: "" });
//         } catch {
//             setError("Failed to create tournament.");
//         }
//     };

//     const handleNewsletterField = (field, val) => setNewsletterForm((p) => ({ ...p, [field]: val }));

//     const refreshNewsletters = async () => {
//         setLoadingNews(true);
//         setError("");
//         try {
//             const res = await fetch(`${API_BASE}/api/newsletter/all`);
//             const data = await res.json();
//             setNewsletterList(Array.isArray(data) ? data : []);
//         } catch {
//             setError("Failed to load newsletters.");
//             setNewsletterList([]);
//         } finally {
//             setLoadingNews(false);
//         }
//     };

//     useEffect(() => {
//         refreshNewsletters();
//     }, []);

//     const addNewsletter = async (e) => {
//         e.preventDefault();
//         setError("");
//         try {
//             let teamName = "";
//             if (newsletterForm.teamId) {
//                 const team = teams.find((t) => Number(t.id) === Number(newsletterForm.teamId));
//                 teamName = team ? team.name : "";
//             }
//             const payload = { ...newsletterForm, teamName };
//             delete payload.teamId;
//             const res = await fetch(`${API_BASE}/api/newsletter/create`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(payload),
//             });
//             if (!res.ok) throw new Error("Create failed");
//             setNewsletterForm({ subject: "", summary: "", imageLink: "", tournamentId: "", teamId: "", content: "" });
//             refreshNewsletters();
//         } catch {
//             setError("Failed to create newsletter.");
//         }
//     };

//     const deleteNewsletter = async (id) => {
//         setError("");
//         try {
//             const res = await fetch(`${API_BASE}/api/newsletter/${id}`, { method: "DELETE" });
//             if (!res.ok) throw new Error("Delete failed");
//             refreshNewsletters();
//         } catch {
//             setError("Failed to delete newsletter.");
//         }
//     };

//     const deleteTeam = async (teamId) => {
//         if (!selectedTournament?.id) return;
//         setError("");
//         try {
//             const res = await fetch(`${API_BASE}/api/tournaments/${selectedTournament.id}/remove-team/${teamId}`, { method: "DELETE" });
//             if (!res.ok) throw new Error("Remove failed");
//             setTeams((prev) => prev.filter((t) => t.id !== teamId));
//             if (selectedTeam?.id === teamId) setSelectedTeam(null);
//             const pl = await fetch(`${API_BASE}/api/player/all`);
//             const pData = await pl.json();
//             setAllPlayers(Array.isArray(pData) ? pData : []);
//             await refreshScorecards();
//         } catch {
//             setError("Failed to delete team.");
//         }
//     };

//     const addPlayerScoreEntry = async (playerId) => {
//         if (!selectedMatch) return;
//         const player = matchPlayers.find((p) => p.id === playerId);
//         if (!player) return;
//         const payload = {
//             runs: 0,
//             wickets: 0,
//             catches: 0,
//             playerId,
//             teamId: player.teamId,
//             roundId: selectedMatch.id,
//         };
//         await fetch(`${API_BASE}/api/scorecard/create`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(payload),
//         });
//         refreshScorecards();
//     };

//     const updateScoreEntry = async (id, patch) => {
//         const current = scorecards.find((s) => s.id === id);
//         if (!current) return;
//         const dto = {
//             id,
//             runs: patch.runs ?? current.runs,
//             wickets: patch.wickets ?? current.wickets,
//             catches: patch.catches ?? current.catches,
//             playerId: patch.playerId ?? current.playerId,
//             teamId: patch.teamId ?? current.teamId,
//             roundId: patch.roundId ?? current.roundId,
//         };
//         await fetch(`${API_BASE}/api/scorecard/${id}`, {
//             method: "PUT",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(dto),
//         });
//         refreshScorecards();
//     };

//     const deleteScoreEntry = async (id) => {
//         await fetch(`${API_BASE}/api/scorecard/${id}`, { method: "DELETE" });
//         refreshScorecards();
//     };

//     const generateFixture = async () => {
//         if (!selectedTournament?.id) {
//             alert("Please select a tournament first.");
//             return;
//         }
//         setGenerating(true);
//         setError("");
//         try {
//             await axios.post(`${API_BASE}/api/round/generate`, null, { params: { tournamentId: selectedTournament.id } });
//             const res = await axios.get(`${API_BASE}/api/round/tournament/${selectedTournament.id}`);
//             const data = Array.isArray(res.data) ? res.data : [];
//             data.sort((a, b) => (a.roundNumber - b.roundNumber) || (a.id - b.id));
//             setFixtureRounds(data);
//             alert("Fixture generated successfully!");
//         } catch (e) {
//             console.error(e);
//             setError(e?.response?.data?.message || e.message || "Failed to generate fixtures.");
//         } finally {
//             setGenerating(false);
//         }
//     };

//     const groupedRounds = useMemo(() => {
//         const map = new Map();
//         fixtureRounds.forEach((r) => {
//             const k = r.roundNumber;
//             if (!map.has(k)) map.set(k, []);
//             map.get(k).push(r);
//         });
//         for (const [k, arr] of map.entries()) {
//             arr.sort((a, b) => a.id - b.id);
//         }
//         return [...map.entries()].sort((a, b) => a[0] - b[0]);
//     }, [fixtureRounds]);

//     return (
//         <div className="p-6 max-w-7xl mx-auto bg-black min-h-screen text-white space-y-10">
//             <header className="flex items-center justify-between">
//                 <h1 className="text-3xl font-bold">Admin Control Panel</h1>
//             </header>

//             <ErrorNote message={error} />

//             {/* Tournaments */}
//             <Section title="Tournaments" right={loadingTournaments ? <InlineSpinner /> : null}>
//                 {loadingTournaments ? (
//                     <Empty>Loading tournaments…</Empty>
//                 ) : (
//                     <>
//                         <div className="flex flex-wrap gap-2 mb-6">
//                             {tournaments.length === 0 ? (
//                                 <Empty>No tournaments found.</Empty>
//                             ) : (
//                                 tournaments.map((t) => (
//                                     <button
//                                         key={t.id}
//                                         className={clsx(
//                                             "px-4 py-2 rounded border",
//                                             selectedTournament?.id === t.id
//                                                 ? "bg-yellow-500 text-black border-yellow-500"
//                                                 : "bg-gray-800 border-gray-700"
//                                         )}
//                                         onClick={() => setSelectedTournament(t)}
//                                     >
//                                         {t.tournamentName || t.title || t.name}
//                                     </button>
//                                 ))
//                             )}
//                         </div>
//                         <form onSubmit={addTournament} className="bg-gray-900/60 p-5 rounded-xl border border-gray-800 max-w-xl space-y-4">
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                 <input
//                                     type="text"
//                                     placeholder="Title *"
//                                     value={tournamentForm.tournamentName}
//                                     onChange={(e) => handleTournamentField("tournamentName", e.target.value)}
//                                     className="w-full bg-gray-800 px-3 py-2 rounded text-white border border-gray-700"
//                                     required
//                                 />
//                                 <input
//                                     type="date"
//                                     placeholder="Date *"
//                                     value={tournamentForm.startDate}
//                                     onChange={(e) => handleTournamentField("startDate", e.target.value)}
//                                     className="w-full bg-gray-800 px-3 py-2 rounded text-white border border-gray-700"
//                                     required
//                                 />
//                                 <input
//                                     type="text"
//                                     placeholder="Type (e.g. Adult, Under19) *"
//                                     value={tournamentForm.matchType}
//                                     onChange={(e) => handleTournamentField("matchType", e.target.value)}
//                                     className="w-full bg-gray-800 px-3 py-2 rounded text-white border border-gray-700"
//                                     required
//                                 />
//                                 <input
//                                     type="text"
//                                     placeholder="Location *"
//                                     value={tournamentForm.location}
//                                     onChange={(e) => handleTournamentField("location", e.target.value)}
//                                     className="w-full bg-gray-800 px-3 py-2 rounded text-white border border-gray-700"
//                                     required
//                                 />
//                             </div>
//                             <textarea
//                                 placeholder="Description (optional)"
//                                 value={tournamentForm.description}
//                                 onChange={(e) => handleTournamentField("description", e.target.value)}
//                                 rows={3}
//                                 className="w-full bg-gray-800 px-3 py-2 rounded text-white border border-gray-700"
//                             />
//                             <input
//                                 type="text"
//                                 placeholder="Image Link"
//                                 value={tournamentForm.image}
//                                 onChange={(e) => handleTournamentField("image", e.target.value)}
//                                 className="w-full bg-gray-800 px-3 py-2 rounded text-white border border-gray-700"
//                             />
//                             <button type="submit" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white">
//                                 Create Tournament
//                             </button>
//                         </form>
//                     </>
//                 )}
//             </Section>

//             {/* Registered Teams */}
//             <Section title={`Registered Teams${selectedTournament ? ` for "${selectedTournament.tournamentName || selectedTournament.title || selectedTournament.name}"` : ""}`} right={loadingTeams ? <InlineSpinner /> : null}>
//                 {!selectedTournament ? (
//                     <Empty>Select a tournament to view teams.</Empty>
//                 ) : loadingTeams ? (
//                     <Empty>Loading teams…</Empty>
//                 ) : teams.length === 0 ? (
//                     <Empty>No teams found.</Empty>
//                 ) : (
//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//                         {teams.map((team) => (
//                             <div key={team.id} className="bg-gray-900 rounded-xl border border-gray-800 p-4 relative">
//                                 <button title="Delete Team" className="absolute top-2 right-2 text-gray-400 hover:text-red-600" onClick={() => deleteTeam(team.id)}>
//                                     <Trash2 size={18} />
//                                 </button>
//                                 <h3 className="text-lg font-semibold mb-1">{team.name}</h3>
//                                 <p className="text-sm text-gray-400">Location: {team.location || "N/A"}</p>
//                                 <p className="text-sm text-gray-400">Phone: {team.phone || "N/A"}</p>
//                                 <p className="text-sm text-gray-400 mb-3">Players: {getPlayersOfTeam(team.id).length}</p>
//                                 <div className="flex items-center gap-2">
//                                     <button onClick={() => setSelectedTeam(team)} className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm">
//                                         View Players
//                                     </button>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 )}

//                 {selectedTeam && (
//                     <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50" onClick={() => setSelectedTeam(null)}>
//                         <div className="bg-gray-900 p-6 rounded-2xl max-w-md w-full border border-gray-800" onClick={(e) => e.stopPropagation()}>
//                             <div className="flex items-center justify-between mb-4">
//                                 <h3 className="text-2xl font-semibold">{selectedTeam.name} — Players</h3>
//                                 <button onClick={() => setSelectedTeam(null)} className="p-2 rounded hover:bg-gray-800">
//                                     <X size={18} />
//                                 </button>
//                             </div>
//                             {loadingPlayers ? (
//                                 <Empty>Loading players…</Empty>
//                             ) : getPlayersOfTeam(selectedTeam.id).length === 0 ? (
//                                 <Empty>No players in this team.</Empty>
//                             ) : (
//                                 <ul className="space-y-2 max-h-72 overflow-y-auto pr-1">
//                                     {getPlayersOfTeam(selectedTeam.id).map((player) => (
//                                         <li key={player.id} className="flex justify-between items-center border-b border-gray-800 pb-2">
//                                             <span>
//                                                 #{player.jerseyNumber} — {player.nickname || player.name}
//                                             </span>
//                                         </li>
//                                     ))}
//                                 </ul>
//                             )}
//                             <div className="flex justify-end mt-4">
//                                 <button onClick={() => setSelectedTeam(null)} className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded px-4 py-2">
//                                     Close
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </Section>

//             {/* Score Management - match based */}
//             <Section title="Score Management">
//                 <label className="block mb-2 font-semibold text-lg">Select Match to Manage Scores:</label>
//                 <select
//                     className="mb-4 p-2 rounded w-full max-w-md bg-gray-800 text-white border border-gray-700"
//                     value={selectedMatch ? selectedMatch.id : ""}
//                     onChange={(e) => {
//                         const val = e.target.value;
//                         if (!val) {
//                             setSelectedMatch(null);
//                             return;
//                         }
//                         const match = fixtureRounds.find((m) => m.id.toString() === val);
//                         setSelectedMatch(match || null);
//                     }}
//                 >
//                     <option value="">-- Select Match --</option>
//                     {fixtureRounds.map((m) => (
//                         <option key={m.id} value={m.id}>
//                             {m.teamOneName || "TBD"} vs {m.teamTwoName || "TBD"}
//                         </option>
//                     ))}
//                 </select>

//                 {!selectedMatch ? (
//                     <p className="text-gray-400 italic">Please select a match above to manage scores.</p>
//                 ) : (
//                     <ScoreManagementPopup
//                         team={selectedMatch}
//                         players={matchPlayers}
//                         entries={matchScorecards}
//                         onAddEntry={addPlayerScoreEntry}
//                         onUpdateEntry={updateScoreEntry}
//                         onDeleteEntry={deleteScoreEntry}
//                         onClose={() => setSelectedMatch(null)}
//                     />
//                 )}
//             </Section>

//             {/* Newsletter Management */}
//             <Section title="Newsletter Management" right={loadingNews ? <InlineSpinner /> : null}>
//                 <form onSubmit={addNewsletter} className="bg-gray-900/60 p-5 rounded-xl border border-gray-800 max-w-xl space-y-4">
//                     <input
//                         type="text"
//                         placeholder="Subject *"
//                         value={newsletterForm.subject}
//                         onChange={(e) => handleNewsletterField("subject", e.target.value)}
//                         className="w-full bg-gray-800 px-3 py-2 rounded text-white border border-gray-700"
//                         required
//                     />
//                     <input
//                         type="text"
//                         placeholder="Summary *"
//                         value={newsletterForm.summary}
//                         onChange={(e) => handleNewsletterField("summary", e.target.value)}
//                         className="w-full bg-gray-800 px-3 py-2 rounded text-white border border-gray-700"
//                         required
//                     />
//                     <input
//                         type="text"
//                         placeholder="Image Link"
//                         value={newsletterForm.imageLink}
//                         onChange={(e) => handleNewsletterField("imageLink", e.target.value)}
//                         className="w-full bg-gray-800 px-3 py-2 rounded text-white border border-gray-700"
//                     />

//                     <select
//                         value={newsletterForm.tournamentId}
//                         onChange={(e) => {
//                             const val = e.target.value;
//                             handleNewsletterField("tournamentId", val === "" ? "" : Number(val));
//                             const selTournament = tournaments.find((t) => t.id === Number(val));
//                             setSelectedTournament(selTournament || null);
//                         }}
//                         className="w-full bg-gray-800 px-3 py-2 rounded text-white border border-gray-700"
//                     >
//                         <option value="">Select Tournament (optional)</option>
//                         {tournaments.map((t) => (
//                             <option key={t.id} value={t.id}>
//                                 {t.tournamentName || t.title || t.name}
//                             </option>
//                         ))}
//                     </select>

//                     <select
//                         value={newsletterForm.teamId}
//                         onChange={(e) => handleNewsletterField("teamId", e.target.value === "" ? "" : Number(e.target.value))}
//                         className="w-full bg-gray-800 px-3 py-2 rounded text-white border border-gray-700"
//                         disabled={!selectedTournament || teams.length === 0}
//                     >
//                         <option value="">Select Team (optional)</option>
//                         {teams.map((team) => (
//                             <option key={team.id} value={team.id}>
//                                 {team.name}
//                             </option>
//                         ))}
//                     </select>

//                     <textarea
//                         placeholder="Content *"
//                         value={newsletterForm.content}
//                         onChange={(e) => handleNewsletterField("content", e.target.value)}
//                         required
//                         rows={4}
//                         className="w-full bg-gray-800 px-3 py-2 rounded text-white border border-gray-700"
//                     />
//                     <button type="submit" className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white">
//                         Publish News
//                     </button>
//                 </form>

//                 <div className="mt-6 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
//                     {loadingNews ? (
//                         <Empty>Loading newsletters…</Empty>
//                     ) : newsletterList.length === 0 ? (
//                         <Empty>No newsletters found.</Empty>
//                     ) : (
//                         newsletterList.map((nw) => (
//                             <article key={nw.id} className="bg-white rounded-xl shadow p-5 text-gray-900 relative">
//                                 <button className="absolute top-2 right-2 text-red-600" onClick={() => deleteNewsletter(nw.id)} title="Delete Newsletter">
//                                     <Trash2 size={18} />
//                                 </button>
//                                 {nw.imageLink && <img src={nw.imageLink} alt={nw.subject} className="w-full h-40 object-cover rounded mb-4" />}
//                                 <h3 className="text-xl font-semibold">{nw.subject}</h3>
//                                 <p className="text-sm font-medium text-gray-600 mb-1">
//                                     Tournament ID: {nw.tournamentId || "N/A"} | Team: {nw.teamName || "N/A"}
//                                 </p>
//                                 <p className="mb-2">{nw.summary}</p>
//                                 <p className="mb-2">{nw.content}</p>
//                             </article>
//                         ))
//                     )}
//                 </div>
//             </Section>

//             {/* Fixture Rounds */}
//             <Section
//                 title="Fixture Rounds"
//                 right={
//                     <button
//                         onClick={generateFixture}
//                         disabled={generating || !selectedTournament}
//                         className={clsx(
//                             "inline-flex items-center gap-2 px-4 py-2 rounded font-medium",
//                             generating || !selectedTournament ? "bg-gray-700 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-600 text-black"
//                         )}
//                     >
//                         {generating ? <RefreshCw size={16} className="animate-spin" /> : null}
//                         {generating ? "Generating…" : "Generate Fixture"}
//                     </button>
//                 }
//             >
//                 {!selectedTournament ? (
//                     <Empty>Select a tournament to view fixtures.</Empty>
//                 ) : loadingRounds ? (
//                     <Empty>Loading rounds…</Empty>
//                 ) : fixtureRounds.length === 0 ? (
//                     <Empty>No fixture available.</Empty>
//                 ) : (
//                     <div className="space-y-6">
//                         {groupedRounds.map(([roundNum, list]) => (
//                             <div key={roundNum} className="bg-gray-900 rounded-xl border border-gray-800">
//                                 <div className="px-4 py-2 border-b border-gray-800 text-lg font-semibold">Round {roundNum}</div>
//                                 <div className="divide-y divide-gray-800">
//                                     {list.map((round) => (
//                                         <div key={round.id} className="grid grid-cols-3 gap-4 p-3">
//                                             <div className="truncate">{round.teamOneName || "TBD"}</div>
//                                             <div className="text-center text-yellow-400 font-semibold">vs</div>
//                                             <div className="truncate">{round.teamTwoName || "TBD"}</div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </Section>

//             <footer className="py-8 text-center text-gray-500 text-sm">Admin Console — Cricket Manager</footer>
//         </div>
//     );
// }
