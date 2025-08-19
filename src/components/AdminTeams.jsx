import React, { useState, useEffect } from 'react';
import { Trash2 } from "lucide-react";

const API_BASE = "http://localhost:8080";

function AdminPanel() {
    const [tournaments, setTournaments] = useState([]);
    const [selectedTournament, setSelectedTournament] = useState(null);
    const [loadingTournaments, setLoadingTournaments] = useState(false);

    const [teams, setTeams] = useState([]);
    const [loadingTeams, setLoadingTeams] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState(null);

    const [allPlayers, setAllPlayers] = useState([]);
    const [loadingPlayers, setLoadingPlayers] = useState(false);

    const [newsletterList, setNewsletterList] = useState([]);
    const [newsletterForm, setNewsletterForm] = useState({
        subject: "",
        summary: "",
        imageLink: "",
        tournamentId: "",   // Added tournamentId
        teamName: "",       // Changed from teamId input to name selection
        content: ""
    });
    const [loadingNews, setLoadingNews] = useState(false);

    const [tournamentForm, setTournamentForm] = useState({
        tournamentName: "",
        startDate: "",
        matchType: "",
        location: "",
        description: "",
        image: "",
    });

    // Fetch all tournaments on mount
    useEffect(() => {
        setLoadingTournaments(true);
        fetch(`${API_BASE}/api/tournaments/get`)
            .then(res => res.ok ? res.json() : [])
            .then(data => {
                setTournaments(Array.isArray(data) ? data : []);
                setLoadingTournaments(false);
            })
            .catch(() => {
                setTournaments([]);
                setLoadingTournaments(false);
            });
    }, []);

    // Fetch teams when tournament selected
    useEffect(() => {
        if (!selectedTournament) {
            setTeams([]);
            return;
        }
        setLoadingTeams(true);
        fetch(`${API_BASE}/api/tournaments/${selectedTournament.id}/teams`)
            .then(res => res.ok ? res.json() : [])
            .then(data => {
                setTeams(Array.isArray(data) ? data : []);
                setLoadingTeams(false);
            })
            .catch(() => {
                setTeams([]);
                setLoadingTeams(false);
            });
    }, [selectedTournament]);

    // Fetch all players on mount or after team changes
    useEffect(() => {
        setLoadingPlayers(true);
        fetch(`${API_BASE}/api/player/all`)
            .then(res => res.ok ? res.json() : [])
            .then(data => {
                setAllPlayers(Array.isArray(data) ? data : []);
                setLoadingPlayers(false);
            })
            .catch(() => {
                setAllPlayers([]);
                setLoadingPlayers(false);
            });
    }, [teams]);

    // Newsletter handlers
    const refreshNewsletters = () => {
        setLoadingNews(true);
        fetch(`${API_BASE}/api/newsletter/all`)
            .then(res => res.ok ? res.json() : [])
            .then(data => {
                setNewsletterList(Array.isArray(data) ? data : []);
                setLoadingNews(false);
            })
            .catch(() => {
                setNewsletterList([]);
                setLoadingNews(false);
            });
    };
    useEffect(refreshNewsletters, []);

    const addNewsletter = (e) => {
        e.preventDefault();

        // Validate tournamentId is selected if you want to enforce it; else send empty string or null

        // Submit newsletterForm as JSON to backend including tournamentId and teamName
        fetch(`${API_BASE}/api/newsletter/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newsletterForm)
        }).then(() => {
            setNewsletterForm({
                subject: "",
                summary: "",
                imageLink: "",
                tournamentId: "",
                teamName: "",
                content: ""
            });
            refreshNewsletters();
        });
    };

    const deleteNewsletter = (id) => {
        fetch(`${API_BASE}/api/newsletter/${id}`, { method: "DELETE" })
            .then(refreshNewsletters);
    };

    // Team handlers
    const deleteTeam = (teamId) => {
        if (!selectedTournament?.id) return;
        fetch(`${API_BASE}/api/tournaments/${selectedTournament.id}/remove-team/${teamId}`, { method: "DELETE" })
            .then(() => {
                setTeams(prev => prev.filter(t => t.id !== teamId));
                if (selectedTeam?.id === teamId) setSelectedTeam(null);
                fetch(`${API_BASE}/api/player/all`)
                    .then(res => res.ok ? res.json() : [])
                    .then(data => setAllPlayers(Array.isArray(data) ? data : []));
            });
    };

    const handleNewsletterField = (field, val) =>
        setNewsletterForm(prev => ({ ...prev, [field]: val }));

    const handleTournamentField = (field, val) =>
        setTournamentForm(prev => ({ ...prev, [field]: val }));

    const addTournament = (e) => {
        e.preventDefault();
        fetch(`${API_BASE}/api/tournaments/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(tournamentForm),
        }).then(() =>
            fetch(`${API_BASE}/api/tournaments/get`)
                .then(res => res.ok ? res.json() : [])
                .then(data => setTournaments(Array.isArray(data) ? data : []))
        );
        setTournamentForm({
            tournamentName: "",
            startDate: "",
            matchType: "",
            location: "",
            description: "",
            image: "",
        });
    };

    // Get players of a team
    const getPlayersOfTeam = (teamId) =>
        allPlayers.filter(player => player.teamId === teamId);

    return (
        <div className="p-6 max-w-7xl mx-auto bg-gray-900 min-h-screen text-white space-y-16">
            <h1 className="text-3xl font-bold mb-8">Admin Control Panel</h1>

            {/* Tournaments */}
            <section>
                <h2 className="text-2xl font-semibold border-b border-gray-600 pb-1 mb-6">
                    Tournaments
                </h2>
                {loadingTournaments ? (
                    <p className="text-gray-300">Loading tournaments...</p>
                ) : (
                    <div className="flex flex-wrap gap-2 mb-6">
                        {tournaments.length === 0 ? (
                            <p className="text-gray-400">No tournaments found.</p>
                        ) : (
                            tournaments.map(t => (
                                <button
                                    key={t.id}
                                    className={`px-4 py-2 rounded ${selectedTournament?.id === t.id
                                        ? "bg-yellow-500 text-black"
                                        : "bg-gray-700"
                                        }`}
                                    onClick={() => setSelectedTournament(t)}
                                >
                                    {t.tournamentName || t.title || t.name}
                                </button>
                            ))
                        )}
                    </div>
                )}
            </section>

            {/* Registered Teams */}
            <section>
                <h2 className="text-2xl font-semibold border-b border-gray-600 pb-1 mb-6">
                    Registered Teams{" "}
                    {selectedTournament
                        ? `for "${selectedTournament.tournamentName || selectedTournament.title || selectedTournament.name}"`
                        : ""}
                </h2>
                {loadingTeams ? (
                    <p className="text-gray-300">Loading teams...</p>
                ) : selectedTournament ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {teams.length === 0 ? (
                            <p className="text-gray-400 italic col-span-full">No teams found.</p>
                        ) : (
                            teams.map(team => (
                                <div
                                    key={team.id}
                                    className="bg-gray-800 p-4 rounded-lg border border-gray-700 relative"
                                >
                                    <button
                                        title="Delete Team"
                                        className="absolute top-2 right-2 text-gray-400 hover:text-red-600"
                                        onClick={() => deleteTeam(team.id)}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                    <h3 className="text-lg font-semibold mb-1">{team.name}</h3>
                                    <p className="text-sm text-gray-400">Location: {team.location || "N/A"}</p>
                                    <p className="text-sm text-gray-400">Phone: {team.phone || "N/A"}</p>
                                    <p className="text-sm text-gray-400 mb-2">
                                        Players: {getPlayersOfTeam(team.id).length}
                                    </p>
                                    <button
                                        onClick={() => setSelectedTeam(team)}
                                        className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
                                    >
                                        View Players
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                ) : (
                    <p className="text-gray-400 italic">Select a tournament to view teams.</p>
                )}

                {/* Players modal */}
                {selectedTeam && (
                    <div
                        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                        onClick={() => setSelectedTeam(null)}
                    >
                        <div
                            className="bg-gray-800 p-6 rounded-lg max-w-md w-full"
                            onClick={e => e.stopPropagation()}
                        >
                            <h3 className="text-2xl font-semibold mb-4">{selectedTeam.name} - Players</h3>
                            {loadingPlayers ? (
                                <p className="text-gray-300">Loading players...</p>
                            ) : getPlayersOfTeam(selectedTeam.id).length === 0 ? (
                                <p className="text-gray-400 italic mb-4">No players in this team.</p>
                            ) : (
                                <ul className="space-y-2 max-h-60 overflow-y-auto">
                                    {getPlayersOfTeam(selectedTeam.id).map(player => (
                                        <li
                                            key={player.id}
                                            className="flex justify-between items-center border-b border-gray-700 pb-2"
                                        >
                                            <span>
                                                #{player.jerseyNumber} - {player.nickname}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            <button
                                onClick={() => setSelectedTeam(null)}
                                className="mt-6 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </section>

            {/* Newsletter Management */}
            <section>
                <h2 className="text-2xl font-semibold border-b border-gray-600 pb-1 mb-6">
                    Newsletter Management
                </h2>
                <form
                    onSubmit={addNewsletter}
                    className="bg-gray-800 p-5 rounded-lg max-w-xl space-y-4"
                >
                    <input
                        type="text"
                        placeholder="Subject *"
                        value={newsletterForm.subject}
                        onChange={e => handleNewsletterField("subject", e.target.value)}
                        className="w-full bg-gray-700 px-3 py-2 rounded text-white"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Summary *"
                        value={newsletterForm.summary}
                        onChange={e => handleNewsletterField("summary", e.target.value)}
                        className="w-full bg-gray-700 px-3 py-2 rounded text-white"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Image Link"
                        value={newsletterForm.imageLink}
                        onChange={e => handleNewsletterField("imageLink", e.target.value)}
                        className="w-full bg-gray-700 px-3 py-2 rounded text-white"
                    />

                    {/* Tournament selector */}
                    <select
                        value={newsletterForm.tournamentId}
                        onChange={e => {
                            const val = e.target.value;
                            handleNewsletterField("tournamentId", val === "" ? "" : Number(val));
                            // Load teams for that tournament to update team selector
                            const selTournament = tournaments.find(t => t.id === Number(val));
                            setSelectedTournament(selTournament || null);
                        }}
                        className="w-full bg-gray-700 px-3 py-2 rounded text-white"
                    >
                        <option value="">Select Tournament (optional)</option>
                        {tournaments.map(t => (
                            <option key={t.id} value={t.id}>
                                {t.tournamentName || t.title || t.name}
                            </option>
                        ))}
                    </select>

                    {/* Team selector based on selected tournament */}
                    <select
                        value={newsletterForm.teamName}
                        onChange={e => handleNewsletterField("teamName", e.target.value)}
                        className="w-full bg-gray-700 px-3 py-2 rounded text-white"
                        disabled={!selectedTournament || teams.length === 0}
                    >
                        <option value="">Select Team (optional)</option>
                        {teams.map(team => (
                            <option key={team.id} value={team.name}>
                                {team.name}
                            </option>
                        ))}
                    </select>

                    <textarea
                        placeholder="Content *"
                        value={newsletterForm.content}
                        onChange={e => handleNewsletterField("content", e.target.value)}
                        required
                        rows={4}
                        className="w-full bg-gray-700 px-3 py-2 rounded text-white"
                    />
                    <button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white"
                    >
                        Publish News
                    </button>
                </form>
                <div className="mt-6 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {loadingNews ? (
                        <p className="text-gray-400 italic">Loading newsletters...</p>
                    ) : newsletterList.length === 0 ? (
                        <p className="text-gray-400 italic">No newsletters found.</p>
                    ) : (
                        newsletterList.map(nw => (
                            <article
                                key={nw.id}
                                className="bg-white rounded-lg shadow-lg p-5 text-gray-900 relative"
                            >
                                <button
                                    className="absolute top-2 right-2 text-red-600"
                                    onClick={() => deleteNewsletter(nw.id)}
                                    title="Delete Newsletter"
                                >
                                    <Trash2 size={18} />
                                </button>
                                {nw.imageLink && (
                                    <img
                                        src={nw.imageLink}
                                        alt={nw.subject}
                                        className="w-full h-40 object-cover rounded mb-4"
                                    />
                                )}
                                <h3 className="text-xl font-semibold">{nw.subject}</h3>
                                <p className="text-sm font-medium text-gray-600 mb-1">
                                    Tournament ID: {nw.tournamentId || "N/A"} | Team: {nw.teamName || "N/A"}
                                </p>
                                <p className="mb-2">{nw.summary}</p>
                                <p className="mb-2">{nw.content}</p>
                            </article>
                        ))
                    )}
                </div>
            </section>

            {/* Tournament Create Form */}
            <section>
                <h2 className="text-2xl font-semibold border-b border-gray-600 pb-1 mb-6">
                    Create Tournament
                </h2>
                <form
                    onSubmit={addTournament}
                    className="bg-gray-800 p-5 rounded-lg max-w-xl space-y-4"
                >
                    <input
                        type="text"
                        placeholder="Title *"
                        value={tournamentForm.tournamentName}
                        onChange={e => handleTournamentField("tournamentName", e.target.value)}
                        className="w-full bg-gray-700 px-3 py-2 rounded text-white"
                        required
                    />
                    <input
                        type="date"
                        placeholder="Date *"
                        value={tournamentForm.startDate}
                        onChange={e => handleTournamentField("startDate", e.target.value)}
                        className="w-full bg-gray-700 px-3 py-2 rounded text-white"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Type (e.g. Adult, Under19) *"
                        value={tournamentForm.matchType}
                        onChange={e => handleTournamentField("matchType", e.target.value)}
                        className="w-full bg-gray-700 px-3 py-2 rounded text-white"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Location *"
                        value={tournamentForm.location}
                        onChange={e => handleTournamentField("location", e.target.value)}
                        className="w-full bg-gray-700 px-3 py-2 rounded text-white"
                        required
                    />
                    <textarea
                        placeholder="Description (optional)"
                        value={tournamentForm.description}
                        onChange={e => handleTournamentField("description", e.target.value)}
                        rows={3}
                        className="w-full bg-gray-700 px-3 py-2 rounded text-white"
                    />
                    <input
                        type="text"
                        placeholder="Image Link"
                        value={tournamentForm.image}
                        onChange={e => handleTournamentField("image", e.target.value)}
                        className="w-full bg-gray-700 px-3 py-2 rounded text-white"
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
                    >
                        Create Tournament
                    </button>
                </form>
            </section>
        </div>
    );
}

export default AdminPanel;



// import React, { useState } from "react";
// import { Trash2, Plus } from "lucide-react";

// const emptyScoreCard = {
// id: null,
// name: "",
// location: "",
// score: "",
// wickets: "",
// overs: "",
// batting: [],
// bowling: [],
// lastOverBalls: Array(6).fill(""),
// players: [],
// logo: null,
// };

// const initialRegisteredTeams = [
// {
//     id: 1,
//     name: "Warriors",
//     location: "Mumbai",
//     phone: "9876543210",
//     logo: null,
//     password: "team123",
//     players: [
//     { id: 1, name: "John", jersey: 7 },
//     { id: 2, name: "David", jersey: 12 },
//     { id: 3, name: "Mark", jersey: 30 },
//     ],
// },
// {
//     id: 2,
//     name: "Strikers",
//     location: "Delhi",
//     phone: "9123456780",
//     logo: null,
//     password: "striker123",
//     players: [
//     { id: 4, name: "Alex", jersey: 99 },
//     { id: 5, name: "Mike", jersey: 15 },
//     ],
// },
// ];

// const initialScoreCards = [
// {
//     id: 100,
//     name: "Titans",
//     location: "Chennai",
//     logo: null,
//     score: "",
//     wickets: "",
//     overs: "",
//     batting: [],
//     bowling: [],
//     lastOverBalls: Array(6).fill(""),
//     players: [],
// },
// ];

// export default function AdminPanel() {
// const [registeredTeams, setRegisteredTeams] = useState(initialRegisteredTeams);
// const [selectedTeam, setSelectedTeam] = useState(null);

// const [scoreCards, setScoreCards] = useState(initialScoreCards);
// const [selectedScoreTeamId, setSelectedScoreTeamId] = useState(null);

// // 3. Newsletter
// const [newsList, setNewsList] = useState([]);
// const [newsForm, setNewsForm] = useState({
//     team: "",
//     imageLink: "",
//     headline: "",
//     summary: "",
//     score: "",
//     link: "",
// });

// // 4. Tournament Creation
// const [tournaments, setTournaments] = useState([]);
// const [newTournament, setNewTournament] = useState({
//     image: "",
//     title: "",
//     date: "",
//     type: "",
//     location: "",
//     description: "",
// });

// // --- Team Management handlers ---
// const deleteRegisteredTeam = (teamId) => {
//     setRegisteredTeams((prev) => prev.filter((team) => team.id !== teamId));
// };

// const deletePlayerFromTeam = (teamId, playerId) => {
//     setRegisteredTeams((prev) =>
//     prev.map((team) =>
//         team.id === teamId
//         ? { ...team, players: team.players.filter((p) => p.id !== playerId) }
//         : team
//     )
//     );
// };

// // --- Score Management handlers ---
// const addScoreCard = () => {
//     const newId = scoreCards.length > 0 ? Math.max(...scoreCards.map((c) => c.id)) + 1 : 100;
//     const newCard = { ...emptyScoreCard, id: newId, name: `New Team ${newId}` };
//     setScoreCards((prev) => [...prev, newCard]);
// };

// const updateScoreCardField = (teamId, field, value) => {
//     setScoreCards((prev) =>
//     prev.map((card) => (card.id === teamId ? { ...card, [field]: value } : card))
//     );
// };

// const updateLastOverBall = (teamId, index, value) => {
//     setScoreCards((prev) =>
//     prev.map((card) =>
//         card.id === teamId
//         ? {
//             ...card,
//             lastOverBalls: card.lastOverBalls.map((b, i) => (i === index ? value : b)),
//             }
//         : card
//     )
//     );
// };

// const updateBattingPlayer = (teamId, idx, field, value) => {
//     setScoreCards((prev) =>
//     prev.map((card) =>
//         card.id === teamId
//         ? {
//             ...card,
//             batting: card.batting.map((b, i) => (i === idx ? { ...b, [field]: value } : b)),
//             }
//         : card
//     )
//     );
// };

// const updateBowlingPlayer = (teamId, idx, field, value) => {
//     setScoreCards((prev) =>
//     prev.map((card) =>
//         card.id === teamId
//         ? {
//             ...card,
//             bowling: card.bowling.map((b, i) => (i === idx ? { ...b, [field]: value } : b)),
//             }
//         : card
//     )
//     );
// };

// const addBattingPlayer = (teamId) => {
//     setScoreCards((prev) =>
//     prev.map((card) =>
//         card.id === teamId
//         ? {
//             ...card,
//             batting: [...card.batting, { name: "", runs: "", balls: "", fours: "", sixes: "", sr: "" }],
//             }
//         : card
//     )
//     );
// };

// const addBowlingPlayer = (teamId) => {
//     setScoreCards((prev) =>
//     prev.map((card) =>
//         card.id === teamId
//         ? {
//             ...card,
//             bowling: [...card.bowling, { name: "", overs: "", runs: "", wickets: "", econ: "" }],
//             }
//         : card
//     )
//     );
// };

// const deleteScoreCard = (teamId) => {
//     setScoreCards((prev) => prev.filter((c) => c.id !== teamId));
// };

// // --- Newsletter handlers ---
// const handleNewsFormChange = (field, value) => {
//     setNewsForm((prev) => ({ ...prev, [field]: value }));
// };

// const submitNews = (e) => {
//     e.preventDefault();
//     if (!newsForm.team || !newsForm.headline || !newsForm.summary) {
//     alert("Please fill in required fields (Team, Headline, Summary)");
//     return;
//     }
//     const newEntry = {
//     id: Date.now(),
//     team: newsForm.team,
//     teamImg: newsForm.imageLink || null,
//     headline: newsForm.headline,
//     summary: newsForm.summary,
//     score: newsForm.score || null,
//     link: newsForm.link || null,
//     };
//     setNewsList((prev) => [newEntry, ...prev]);
//     setNewsForm({ team: "", imageLink: "", headline: "", summary: "", score: "", link: "" });
// };

// // --- Tournament Creation handlers ---
// const handleTournamentChange = (field, value) => {
//     setNewTournament((prev) => ({ ...prev, [field]: value }));
// };

// const submitTournament = (e) => {
//     e.preventDefault();
//     if (!newTournament.title || !newTournament.date || !newTournament.type || !newTournament.location) {
//     alert("Please fill in required fields: Title, Date, Type, Location");
//     return;
//     }
//     const tournamentEntry = { id: Date.now(), ...newTournament };
//     setTournaments((prev) => [tournamentEntry, ...prev]);
//     setNewTournament({
//     image: "",
//     title: "",
//     date: "",
//     type: "",
//     location: "",
//     description: "",
//     });
// };

// const selectedScoreTeam = scoreCards.find((c) => c.id === selectedScoreTeamId);

// return (
//     <div className="p-6 max-w-7xl mx-auto bg-gray-900 min-h-screen text-white space-y-16">
//     <h1 className="text-3xl font-bold mb-8">Admin Control Panel</h1>

//     {/* --- 1. TEAM MANAGEMENT --- */}
//     <section>
//         <h2 className="text-2xl font-semibold border-b border-gray-600 pb-1 mb-6">Team Management</h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         {registeredTeams.length === 0 ? (
//             <p className="text-gray-400 italic col-span-full">No registered teams.</p>
//         ) : (
//             registeredTeams.map((team) => (
//             <div key={team.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700 relative">
//                 <button
//                 title="Delete Team"
//                 className="absolute top-2 right-2 text-gray-400 hover:text-red-600"
//                 onClick={() => deleteRegisteredTeam(team.id)}
//                 >
//                 <Trash2 size={18} />
//                 </button>
//                 <h3 className="text-lg font-semibold mb-1">{team.name}</h3>
//                 <p className="text-sm text-gray-400">Location: {team.location}</p>
//                 <p className="text-sm text-gray-400">Phone: {team.phone}</p>
//                 <p className="text-sm text-gray-400 mb-2">Players: {team.players.length}</p>
//                 <button
//                 onClick={() => setSelectedTeam(team)}
//                 className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
//                 >
//                 View Players
//                 </button>
//             </div>
//             ))
//         )}
//         </div>

//         {/* Players Popup */}
//         {selectedTeam && (
//         <div
//             className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
//             onClick={() => setSelectedTeam(null)}
//         >
//             <div
//             className="bg-gray-800 p-6 rounded-lg max-w-md w-full"
//             onClick={(e) => e.stopPropagation()}
//             >
//             <h3 className="text-2xl font-semibold mb-4">{selectedTeam.name} - Players</h3>
//             {selectedTeam.players.length === 0 ? (
//                 <p className="text-gray-400 italic mb-4">No players in this team.</p>
//             ) : (
//                 <ul className="space-y-2 max-h-60 overflow-y-auto">
//                 {selectedTeam.players.map((player) => (
//                     <li
//                     key={player.id}
//                     className="flex justify-between items-center border-b border-gray-700 pb-2"
//                     >
//                     <span>
//                         #{player.jersey} - {player.name}
//                     </span>
//                     <button
//                         onClick={() => deletePlayerFromTeam(selectedTeam.id, player.id)}
//                         className="text-red-500 hover:text-red-600"
//                         title="Delete Player"
//                     >
//                         <Trash2 size={18} />
//                     </button>
//                     </li>
//                 ))}
//                 </ul>
//             )}
//             <button
//                 onClick={() => setSelectedTeam(null)}
//                 className="mt-6 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
//             >
//                 Close
//             </button>
//             </div>
//         </div>
//         )}
//     </section>

//     {/* --- 2. SCORE MANAGEMENT --- */}
//     <section>
//         <h2 className="text-2xl font-semibold border-b border-gray-600 pb-1 mb-6">Score Management</h2>
//         <button
//         onClick={addScoreCard}
//         className="mb-6 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded inline-flex"
//         title="Add New Score Card"
//         >
//         <Plus size={16} /> Add New Score Card
//         </button>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {scoreCards.length === 0 ? (
//             <p className="text-gray-400 italic col-span-full">No live score cards.</p>
//         ) : (
//             scoreCards.map((card) => (
//             <div key={card.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex flex-col">
//                 <div className="flex justify-between items-center mb-3">
//                 <h3 className="text-lg font-semibold">{card.name || "Unnamed Team"}</h3>
//                 <button
//                     className="text-red-600 hover:text-red-800"
//                     title="Delete Score Card"
//                     onClick={() => deleteScoreCard(card.id)}
//                 >
//                     <Trash2 size={18} />
//                 </button>
//                 </div>
//                 <p className="text-sm text-gray-400 mb-1">Location: {card.location || "-"}</p>
//                 <p className="text-sm text-gray-200">
//                 Score: {card.score || "-"} / {card.wickets || "-"} &nbsp;&nbsp; Overs: {card.overs || "-"}
//                 </p>
//                 <button
//                 onClick={() => setSelectedScoreTeamId(card.id)}
//                 className="mt-auto bg-green-600 px-3 py-1 rounded text-sm hover:bg-green-700"
//                 >
//                 Manage Details
//                 </button>
//             </div>
//             ))
//         )}
//         </div>

//         {/* Score Management Popup */}
//         {selectedScoreTeam && (
//         <ScoreManagementPopup
//             team={selectedScoreTeam}
//             onClose={() => setSelectedScoreTeamId(null)}
//             onScoreChange={updateScoreCardField}
//             onLastOverChange={updateLastOverBall}
//             onBattingChange={updateBattingPlayer}
//             onBowlingChange={updateBowlingPlayer}
//             addBattingPlayer={addBattingPlayer}
//             addBowlingPlayer={addBowlingPlayer}
//         />
//         )}
//     </section>

//     {/* --- 3. NEWSLETTER MANAGEMENT --- */}
//     <section>
//         <h2 className="text-2xl font-semibold border-b border-gray-600 pb-1 mb-6">Newsletter Management</h2>
//         <form onSubmit={submitNews} className="bg-gray-800 p-5 rounded-lg max-w-xl space-y-4">
//         <input
//             type="text"
//             placeholder="Team Name *"
//             value={newsForm.team}
//             onChange={(e) => handleNewsFormChange("team", e.target.value)}
//             className="w-full bg-gray-700 px-3 py-2 rounded text-white"
//             required
//         />
//         <input
//             type="text"
//             placeholder="Image Link (S3 or URL)"
//             value={newsForm.imageLink}
//             onChange={(e) => handleNewsFormChange("imageLink", e.target.value)}
//             className="w-full bg-gray-700 px-3 py-2 rounded text-white"
//         />
//         <input
//             type="text"
//             placeholder="Headline *"
//             value={newsForm.headline}
//             onChange={(e) => handleNewsFormChange("headline", e.target.value)}
//             className="w-full bg-gray-700 px-3 py-2 rounded text-white"
//             required
//         />
//         <textarea
//             placeholder="Summary *"
//             value={newsForm.summary}
//             onChange={(e) => handleNewsFormChange("summary", e.target.value)}
//             rows={3}
//             className="w-full bg-gray-700 px-3 py-2 rounded text-white"
//             required
//         />
//         <input
//             type="text"
//             placeholder="Score (optional)"
//             value={newsForm.score}
//             onChange={(e) => handleNewsFormChange("score", e.target.value)}
//             className="w-full bg-gray-700 px-3 py-2 rounded text-white"
//         />
//         <input
//             type="text"
//             placeholder="Read More Link (optional)"
//             value={newsForm.link}
//             onChange={(e) => handleNewsFormChange("link", e.target.value)}
//             className="w-full bg-gray-700 px-3 py-2 rounded text-white"
//         />
//         <button type="submit" className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white">
//             Publish News
//         </button>
//         </form>

//         {newsList.length > 0 && (
//         <div className="mt-6 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
//             {newsList.map(({ id, team, teamImg, headline, summary, score, link }) => (
//             <article key={id} className="bg-white rounded-lg shadow-lg p-5 text-gray-900">
//                 {teamImg && <img src={teamImg} alt={team} className="w-full h-40 object-cover rounded mb-4" />}
//                 <h3 className="text-xl font-semibold">{headline}</h3>
//                 <p className="text-sm font-medium text-gray-600 mb-1">{team}</p>
//                 <p className="mb-2">{summary}</p>
//                 {score && (
//                 <p className="inline-block bg-gray-200 text-gray-800 font-semibold text-sm px-3 py-1 rounded-lg mb-2">
//                     Score: {score}
//                 </p>
//                 )}
//                 {link && (
//                 <a href={link} target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline">
//                     Read More →
//                 </a>
//                 )}
//             </article>
//             ))}
//         </div>
//         )}
//     </section>

//     {/* --- 4. TOURNAMENT CREATION --- */}
//     <section className="mb-12">
//         <h2 className="text-2xl font-semibold border-b border-gray-600 pb-1 mb-6">Create Tournament</h2>
//         <form onSubmit={submitTournament} className="bg-gray-800 p-5 rounded-lg max-w-xl space-y-4">
//         <input
//             type="text"
//             placeholder="Image Link (S3 URL) *"
//             value={newTournament.image}
//             onChange={(e) => handleTournamentChange("image", e.target.value)}
//             className="w-full bg-gray-700 px-3 py-2 rounded text-white"
//             required
//         />
//         <input
//             type="text"
//             placeholder="Title *"
//             value={newTournament.title}
//             onChange={(e) => handleTournamentChange("title", e.target.value)}
//             className="w-full bg-gray-700 px-3 py-2 rounded text-white"
//             required
//         />
//         <input
//             type="date"
//             placeholder="Date *"
//             value={newTournament.date}
//             onChange={(e) => handleTournamentChange("date", e.target.value)}
//             className="w-full bg-gray-700 px-3 py-2 rounded text-white"
//             required
//         />
//         <input
//             type="text"
//             placeholder="Type (e.g. Adult, Under19) *"
//             value={newTournament.type}
//             onChange={(e) => handleTournamentChange("type", e.target.value)}
//             className="w-full bg-gray-700 px-3 py-2 rounded text-white"
//             required
//         />
//         <input
//             type="text"
//             placeholder="Location *"
//             value={newTournament.location}
//             onChange={(e) => handleTournamentChange("location", e.target.value)}
//             className="w-full bg-gray-700 px-3 py-2 rounded text-white"
//             required
//         />
//         <textarea
//             placeholder="Description (optional)"
//             value={newTournament.description}
//             onChange={(e) => handleTournamentChange("description", e.target.value)}
//             rows={3}
//             className="w-full bg-gray-700 px-3 py-2 rounded text-white"
//         />
//         <button type="submit" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white">
//             Create Tournament
//         </button>
//         </form>

//         {tournaments.length > 0 && (
//         <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
//             {tournaments.map(({ id, image, title, date, type, location, description }) => (
//             <article key={id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
//                 {image && <img src={image} alt={title} className="w-full h-44 object-cover" />}
//                 <div className="p-4 text-white">
//                 <h3 className="text-xl font-semibold mb-1">{title}</h3>
//                 <p className="text-sm text-gray-300 mb-1">
//                     {date} &nbsp;|&nbsp; {type} &nbsp;|&nbsp; {location}
//                 </p>
//                 <p>{description}</p>
//                 </div>
//             </article>
//             ))}
//         </div>
//         )}
//     </section>
//     </div>
// );
// }

// // Score Management Popup component
// function ScoreManagementPopup({
// team,
// onClose,
// onScoreChange,
// onLastOverChange,
// onBattingChange,
// onBowlingChange,
// addBattingPlayer,
// addBowlingPlayer,
// }) {
// if (!team) return null;

// return (
//     <div
//     className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
//     onClick={onClose}
//     >
//     <div
//         className="bg-gray-800 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
//         onClick={(e) => e.stopPropagation()}
//     >
//         <h2 className="text-2xl font-bold mb-4">{team.name || "Unnamed Team"} - Score Management</h2>

//         {/* Team name and location editable */}
//         <div className="grid grid-cols-2 gap-4 mb-6">
//         <input
//             type="text"
//             placeholder="Team Name"
//             value={team.name}
//             onChange={(e) => onScoreChange(team.id, "name", e.target.value)}
//             className="bg-gray-700 p-2 rounded text-white"
//         />
//         <input
//             type="text"
//             placeholder="Location"
//             value={team.location}
//             onChange={(e) => onScoreChange(team.id, "location", e.target.value)}
//             className="bg-gray-700 p-2 rounded text-white"
//         />
//         </div>

//         {/* Basic score fields */}
//         <div className="grid grid-cols-3 gap-4 mb-6">
//         <input
//             type="text"
//             placeholder="Score (Runs)"
//             value={team.score}
//             onChange={(e) => onScoreChange(team.id, "score", e.target.value)}
//             className="bg-gray-700 p-2 rounded text-white"
//         />
//         <input
//             type="text"
//             placeholder="Wickets"
//             value={team.wickets}
//             onChange={(e) => onScoreChange(team.id, "wickets", e.target.value)}
//             className="bg-gray-700 p-2 rounded text-white"
//         />
//         <input
//             type="text"
//             placeholder="Overs"
//             value={team.overs}
//             onChange={(e) => onScoreChange(team.id, "overs", e.target.value)}
//             className="bg-gray-700 p-2 rounded text-white"
//         />
//         </div>

//         {/* Last over balls input */}
//         <div className="flex gap-2 mb-6">
//         {team.lastOverBalls.map((b, i) => (
//             <input
//             key={i}
//             type="text"
//             maxLength={1}
//             value={b}
//             onChange={(e) => onLastOverChange(team.id, i, e.target.value)}
//             className="w-10 text-center bg-gray-700 p-2 rounded text-white"
//             />
//         ))}
//         </div>

//         {/* Batting Section */}
//         <div className="mb-6">
//         <h3 className="text-lg font-semibold mb-2 text-white">Batting</h3>
//         <table className="w-full text-sm text-white table-auto mb-3 border-collapse border border-gray-600">
//             <thead>
//             <tr>
//                 <th className="border border-gray-600 px-2 py-1 text-left">Player</th>
//                 <th className="border border-gray-600 px-2 py-1 text-center">Runs</th>
//                 <th className="border border-gray-600 px-2 py-1 text-center">Balls</th>
//                 <th className="border border-gray-600 px-2 py-1 text-center">4s</th>
//                 <th className="border border-gray-600 px-2 py-1 text-center">6s</th>
//                 <th className="border border-gray-600 px-2 py-1 text-center">SR</th>
//             </tr>
//             </thead>
//             <tbody>
//             {(team.batting.length > 0 ? team.batting : [{ name: "", runs: "", balls: "", fours: "", sixes: "", sr: "" }]).map(
//                 (bat, idx) => (
//                 <tr key={idx}>
//                     <td className="border border-gray-600 px-2 py-1">
//                     <input
//                         type="text"
//                         value={bat.name}
//                         onChange={(e) => onBattingChange(team.id, idx, "name", e.target.value)}
//                         className="bg-gray-700 w-full p-1 rounded text-white"
//                     />
//                     </td>
//                     <td className="border border-gray-600 px-2 py-1 text-center">
//                     <input
//                         type="number"
//                         value={bat.runs}
//                         onChange={(e) => onBattingChange(team.id, idx, "runs", e.target.value)}
//                         className="bg-gray-700 w-full p-1 rounded text-white text-center"
//                     />
//                     </td>
//                     <td className="border border-gray-600 px-2 py-1 text-center">
//                     <input
//                         type="number"
//                         value={bat.balls}
//                         onChange={(e) => onBattingChange(team.id, idx, "balls", e.target.value)}
//                         className="bg-gray-700 w-full p-1 rounded text-white text-center"
//                     />
//                     </td>
//                     <td className="border border-gray-600 px-2 py-1 text-center">
//                     <input
//                         type="number"
//                         value={bat.fours}
//                         onChange={(e) => onBattingChange(team.id, idx, "fours", e.target.value)}
//                         className="bg-gray-700 w-full p-1 rounded text-white text-center"
//                     />
//                     </td>
//                     <td className="border border-gray-600 px-2 py-1 text-center">
//                     <input
//                         type="number"
//                         value={bat.sixes}
//                         onChange={(e) => onBattingChange(team.id, idx, "sixes", e.target.value)}
//                         className="bg-gray-700 w-full p-1 rounded text-white text-center"
//                     />
//                     </td>
//                     <td className="border border-gray-600 px-2 py-1 text-center">
//                     <input
//                         type="number"
//                         value={bat.sr}
//                         onChange={(e) => onBattingChange(team.id, idx, "sr", e.target.value)}
//                         className="bg-gray-700 w-full p-1 rounded text-white text-center"
//                     />
//                     </td>
//                 </tr>
//                 )
//             )}
//             </tbody>
//         </table>
//         <button
//             onClick={() => addBattingPlayer(team.id)}
//             className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1 rounded"
//         >
//             Add Batsman
//         </button>
//         </div>

//         {/* Bowling Section */}
//         <div className="mb-6">
//         <h3 className="text-lg font-semibold mb-2 text-white">Bowling</h3>
//         <table className="w-full text-sm text-white table-auto mb-3 border-collapse border border-gray-600">
//             <thead>
//             <tr>
//                 <th className="border border-gray-600 px-2 py-1 text-left">Bowler</th>
//                 <th className="border border-gray-600 px-2 py-1 text-center">Overs</th>
//                 <th className="border border-gray-600 px-2 py-1 text-center">Runs</th>
//                 <th className="border border-gray-600 px-2 py-1 text-center">Wickets</th>
//                 <th className="border border-gray-600 px-2 py-1 text-center">Econ</th>
//             </tr>
//             </thead>
//             <tbody>
//             {(team.bowling.length > 0 ? team.bowling : [{ name: "", overs: "", runs: "", wickets: "", econ: "" }]).map(
//                 (bowl, idx) => (
//                 <tr key={idx}>
//                     <td className="border border-gray-600 px-2 py-1">
//                     <input
//                         type="text"
//                         value={bowl.name}
//                         onChange={(e) => onBowlingChange(team.id, idx, "name", e.target.value)}
//                         className="bg-gray-700 w-full p-1 rounded text-white"
//                     />
//                     </td>
//                     <td className="border border-gray-600 px-2 py-1 text-center">
//                     <input
//                         type="number"
//                         value={bowl.overs}
//                         onChange={(e) => onBowlingChange(team.id, idx, "overs", e.target.value)}
//                         className="bg-gray-700 w-full p-1 rounded text-white text-center"
//                     />
//                     </td>
//                     <td className="border border-gray-600 px-2 py-1 text-center">
//                     <input
//                         type="number"
//                         value={bowl.runs}
//                         onChange={(e) => onBowlingChange(team.id, idx, "runs", e.target.value)}
//                         className="bg-gray-700 w-full p-1 rounded text-white text-center"
//                     />
//                     </td>
//                     <td className="border border-gray-600 px-2 py-1 text-center">
//                     <input
//                         type="number"
//                         value={bowl.wickets}
//                         onChange={(e) => onBowlingChange(team.id, idx, "wickets", e.target.value)}
//                         className="bg-gray-700 w-full p-1 rounded text-white text-center"
//                     />
//                     </td>
//                     <td className="border border-gray-600 px-2 py-1 text-center">
//                     <input
//                         type="number"
//                         step="0.1"
//                         value={bowl.econ}
//                         onChange={(e) => onBowlingChange(team.id, idx, "econ", e.target.value)}
//                         className="bg-gray-700 w-full p-1 rounded text-white text-center"
//                     />
//                     </td>
//                 </tr>
//                 )
//             )}
//             </tbody>
//         </table>
//         <button
//             onClick={() => addBowlingPlayer(team.id)}
//             className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1 rounded"
//         >
//             Add Bowler
//         </button>
//         </div>

//         <div className="flex justify-end">
//         <button
//             onClick={onClose}
//             className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
//         >
//             Save & Close
//         </button>
//         </div>
//     </div>
//     </div>
// );
// }
