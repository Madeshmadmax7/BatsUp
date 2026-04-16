import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";

function ScorecardPopup({ open, onClose, team }) {
    if (!open || !team) return null;
    const { name, batting, bowling } = team;

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-[#181b1f] text-white p-6 rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="absolute top-3 right-4 text-gray-300 hover:text-white text-2xl"
                    onClick={onClose}
                    aria-label="Close"
                >
                    ×
                </button>
                <h2 className="text-2xl font-bold mb-4">{name} – Scorecard</h2>

                <h3 className="text-lg text-amber-400 font-semibold mb-2">Batting</h3>
                <table className="w-full mb-4 text-sm table-auto">
                    <thead className="border-b border-gray-600 sticky top-0 bg-[#181b1f]">
                        <tr>
                            <th className="text-left px-2 py-1">Player</th>
                            <th className="text-right px-2">Runs</th>
                            <th className="text-right px-2">Wickets</th>
                            <th className="text-right px-2">Catches</th>
                        </tr>
                    </thead>
                    <tbody>
                        {batting.length ? (
                            batting.map((p, i) => (
                                <tr key={i} className="hover:bg-gray-700">
                                    <td className="px-2 py-1 truncate">{p.name}</td>
                                    <td className="text-right px-2">{p.runs}</td>
                                    <td className="text-right px-2">{p.wickets}</td>
                                    <td className="text-right px-2">{p.catches}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="text-center py-3 text-gray-400">
                                    No batting data
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <h3 className="text-lg text-amber-400 font-semibold mb-2">Bowling</h3>
                <table className="w-full text-sm table-auto">
                    <thead className="border-b border-gray-600 sticky top-0 bg-[#181b1f]">
                        <tr>
                            <th className="text-left px-2 py-1">Player</th>
                            <th className="text-right px-2">Wickets</th>
                            <th className="text-right px-2">Runs</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bowling.length ? (
                            bowling.map((b, i) => (
                                <tr key={i} className="hover:bg-gray-700">
                                    <td className="px-2 py-1 truncate">{b.name}</td>
                                    <td className="text-right px-2">{b.wickets}</td>
                                    <td className="text-right px-2">{b.runs}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3} className="text-center py-3 text-gray-400">
                                    No bowling data
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default function LiveScores() {
    const [matches, setMatches] = useState([]);
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [scorecards, setScorecards] = useState([]);
    const [popupTeam, setPopupTeam] = useState(null);

    useEffect(() => {
        fetchMatches();
    }, []);

    async function fetchMatches() {
        try {
            const res = await axios.get(
                "https://batsup-v1-oauz.onrender.com/api/matches/all"
            );
            setMatches(res.data);
        } catch (e) {
            console.error("Failed to fetch matches", e);
        }
    }

    useEffect(() => {
        if (!selectedMatch) return setScorecards([]);
        fetchScorecardsForMatch(selectedMatch.id);
    }, [selectedMatch]);

    async function fetchScorecardsForMatch(matchId) {
        try {
            const res = await axios.get(
                `https://batsup-v1-oauz.onrender.com/api/scorecard/${matchId}`
            );
            setScorecards(res.data);
        } catch (e) {
            console.error("Failed to fetch scorecards", e);
        }
    }

    // Group scorecards by team
    const teamsMap = useMemo(() => {
        const map = {};
        for (const s of scorecards) {
            if (!map[s.teamId]) {
                map[s.teamId] = {
                    id: s.teamId,
                    name: s.teamName,
                    batting: [],
                    bowling: [],
                    totalRuns: 0,
                    totalWickets: 0,
                };
            }
            map[s.teamId].batting.push({
                name: s.playerName,
                runs: s.runs,
                wickets: s.wickets,
                catches: s.catches,
            });
            map[s.teamId].bowling.push({
                name: s.playerName,
                wickets: s.wickets,
                runs: s.runs,
            });
            map[s.teamId].totalRuns += s.runs;
            map[s.teamId].totalWickets += s.wickets;
        }
        return map;
    }, [scorecards]);

    const selectMatchCard = (match) => {
        setSelectedMatch(match);
        setPopupTeam(null);
    };

    const teamIds = Object.keys(teamsMap);

    const currentTeam =
        selectedMatch && teamIds.includes(String(selectedMatch.teamOneId))
            ? teamsMap[selectedMatch.teamOneId]
            : null;
    const opponentTeam =
        selectedMatch && teamIds.includes(String(selectedMatch.teamTwoId))
            ? teamsMap[selectedMatch.teamTwoId]
            : null;

    return (
        <div className="bg-black min-h-screen p-6 sm:p-8">
            <h1 className="text-3xl font-bold text-white mb-8 text-center mt-20">Live Scores</h1>

            <div className="max-w-7xl mx-auto">
                {/* Matches as cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
                    {matches.map((match) => (
                        <div
                            key={match.id}
                            className={`bg-[#181b1f] p-4 rounded-lg cursor-pointer shadow ${selectedMatch?.id === match.id ? "border-2 border-yellow-400" : ""
                                }`}
                            onClick={() => selectMatchCard(match)}
                        >
                            <h2 className="text-lg text-yellow-400 font-bold mb-2">
                                {match.name || `Match #${match.id}`}
                            </h2>
                            <div className="flex items-center justify-between text-white font-semibold">
                                <span>{match.teamOneName}</span>
                                <span className="text-gray-400">vs</span>
                                <span>{match.teamTwoName}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {selectedMatch ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-white">
                        <section className="bg-[#181b1f] rounded p-6 shadow overflow-x-auto">
                            <h2 className="text-xl font-semibold mb-4">{currentTeam?.name} - Batting</h2>
                            <table className="w-full mb-3 text-sm table-auto">
                                <thead className="bg-gray-800 sticky top-0">
                                    <tr>
                                        <th className="text-left px-3 py-1">Player</th>
                                        <th className="text-right px-3 py-1">Runs</th>
                                        <th className="text-right px-3 py-1">Wickets</th>
                                        <th className="text-right px-3 py-1">Catches</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentTeam?.batting.length ? (
                                        currentTeam.batting.map((p, i) => (
                                            <tr
                                                key={i}
                                                className="cursor-pointer hover:bg-gray-700"
                                                onClick={() =>
                                                    setPopupTeam({
                                                        name: currentTeam.name,
                                                        batting: currentTeam.batting,
                                                        bowling: opponentTeam?.bowling || [],
                                                    })
                                                }
                                            >
                                                <td className="px-3 py-1 truncate">{p.name}</td>
                                                <td className="text-right px-3 py-1">{p.runs}</td>
                                                <td className="text-right px-3 py-1">{p.wickets}</td>
                                                <td className="text-right px-3 py-1">{p.catches}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="text-center py-3 text-gray-400">
                                                No batting data
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            <div className="font-bold text-yellow-400">
                                Total Runs: {currentTeam?.totalRuns} &nbsp;|&nbsp; Total Wickets:{" "}
                                {currentTeam?.totalWickets}
                            </div>
                        </section>

                        {opponentTeam && (
                            <section className="bg-[#181b1f] rounded p-6 shadow overflow-x-auto">
                                <h2 className="text-xl font-semibold mb-4">{opponentTeam?.name} - Bowling</h2>
                                <table className="w-full text-sm table-auto">
                                    <thead className="bg-gray-800 sticky top-0">
                                        <tr>
                                            <th className="text-left px-3 py-1">Player</th>
                                            <th className="text-right px-3 py-1">Wickets</th>
                                            <th className="text-right px-3 py-1">Runs</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {opponentTeam?.bowling.length ? (
                                            opponentTeam.bowling.map((b, i) => (
                                                <tr
                                                    key={i}
                                                    className="cursor-pointer hover:bg-gray-700"
                                                    onClick={() =>
                                                        setPopupTeam({
                                                            name: opponentTeam.name,
                                                            batting: opponentTeam.batting,
                                                            bowling: currentTeam?.bowling || [],
                                                        })
                                                    }
                                                >
                                                    <td className="px-3 py-1 truncate">{b.name}</td>
                                                    <td className="text-right px-3 py-1">{b.wickets}</td>
                                                    <td className="text-right px-3 py-1">{b.runs}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={3} className="text-center py-3 text-gray-400">
                                                    No bowling data
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                                <div className="font-bold text-yellow-400">
                                    Total Wickets: {opponentTeam?.totalWickets}
                                </div>
                            </section>
                        )}
                    </div>
                ) : (
                    <div className="text-white text-center mt-20">Select a match to see scores.</div>
                )}

                <ScorecardPopup open={!!popupTeam} onClose={() => setPopupTeam(null)} team={popupTeam} />
            </div>
        </div>
    );
}
