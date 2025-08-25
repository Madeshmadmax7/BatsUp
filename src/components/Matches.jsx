import React, { useState, useEffect } from "react";
import axios from "axios";

const Matches = () => {
    const [tournaments, setTournaments] = useState([]);
    const [selectedTournament, setSelectedTournament] = useState(null);
    const [fixtureRounds, setFixtureRounds] = useState({});
    const [selectedRound, setSelectedRound] = useState("");

    // Load tournaments
    useEffect(() => {
        axios
            .get("https://batsup-v1-oauz.onrender.com/api/tournaments/get")
            .then((response) => {
                setTournaments(Array.isArray(response.data) ? response.data : []);
            })
            .catch(() => setTournaments([]));
    }, []);

    useEffect(() => {
        if (!selectedTournament) {
            setFixtureRounds({});
            setSelectedRound("");
            return;
        }

        axios
            .get(
                `https://batsup-v1-oauz.onrender.com/api/round/tournament/${selectedTournament.id}`
            )
            .then((res) => {
                const rounds = res.data;

                // Group rounds by roundNumber with matches array inside
                const grouped = rounds.reduce((acc, round) => {
                    const roundName = `Round ${round.roundNumber}`;
                    if (!acc[roundName]) acc[roundName] = [];

                    if (Array.isArray(round.matches)) {
                        round.matches.forEach((match) => {
                            acc[roundName].push({
                                id: match.id,
                                team1: match.teamOneName || "TBD",
                                team2: match.teamTwoName || "TBD",
                                date: match.date || "", // if available in backend
                                time: match.time || "TBD",
                            });
                        });
                    }
                    return acc;
                }, {});

                setFixtureRounds(grouped);

                // Select first round by default
                if (Object.keys(grouped).length > 0) {
                    setSelectedRound(Object.keys(grouped)[0]);
                }
            })
            .catch(() => {
                setFixtureRounds({});
                setSelectedRound("");
            });
    }, [selectedTournament]);

    const roundTabs = Object.keys(fixtureRounds);

    return (
        <div className="min-h-screen bg-black text-white py-10 px-4 font-sans">
            <div className="max-w-6xl mx-auto mt-16">
                <h1 className="text-4xl font-bold text-center mb-10">Scheduled Matches</h1>

                {!selectedTournament ? (
                    // Tournament List
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {tournaments.map((tournament) => (
                            <div
                                key={tournament.id}
                                className="bg-white text-black rounded-2xl overflow-hidden shadow hover:scale-105 cursor-pointer transition-all duration-300"
                                onClick={() => setSelectedTournament(tournament)}
                            >
                                <img
                                    src={tournament.image || "https://via.placeholder.com/300x200"}
                                    alt={tournament.tournamentName}
                                    className="h-48 w-full object-cover"
                                />
                                <div className="p-4">
                                    <h2 className="text-xl font-semibold">{tournament.tournamentName}</h2>
                                    <p className="text-sm text-gray-600">
                                        {tournament.matchType || "N/A"} | {tournament.location} |{" "}
                                        {new Date(tournament.startDate).toLocaleDateString("en-GB", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        <button
                            onClick={() => setSelectedTournament(null)}
                            className="mb-6 text-yellow-400 hover:underline"
                        >
                            ← Back to Tournaments
                        </button>

                        <h2 className="text-2xl font-bold mb-4">{selectedTournament.tournamentName} Fixtures</h2>

                        {/* Round Tabs */}
                        <div className="flex mb-6 border-b border-gray-700 overflow-x-auto">
                            {roundTabs.map((round) => (
                                <button
                                    key={round}
                                    onClick={() => setSelectedRound(round)}
                                    className={`px-4 py-2 text-sm whitespace-nowrap border-b-2 ${selectedRound === round
                                            ? "border-white text-white"
                                            : "border-transparent text-gray-400 hover:text-white"
                                        }`}
                                >
                                    {round}
                                </button>
                            ))}
                        </div>

                        {/* Matches in selected round */}
                        <div className="space-y-3">
                            {selectedRound && fixtureRounds[selectedRound]?.length > 0 ? (
                                fixtureRounds[selectedRound].map((match, index) => (
                                    <div
                                        key={match.id || index}
                                        className="bg-[#1a1a1a] border border-gray-700 rounded-md px-4 py-3 text-sm sm:text-base flex flex-col md:flex-row justify-between items-center text-center"
                                    >
                                        <div className="w-full md:w-1/4 truncate font-medium">{match.team1}</div>
                                        <div className="w-full md:w-1/4 font-semibold text-yellow-300">vs</div>
                                        <div className="w-full md:w-1/4 truncate font-medium">{match.team2}</div>
                                        <div className="w-full md:w-1/4 text-xs text-gray-400 mt-2 md:mt-0">
                                            {match.time} {match.date && `· ${match.date}`}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-400 py-8">No matches in this round.</p>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Matches;
