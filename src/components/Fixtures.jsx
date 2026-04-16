import React, { useState, useEffect } from "react";
import axios from "axios";

const Fixture = () => {
    const [tournaments, setTournaments] = useState([]);
    const [selectedTournament, setSelectedTournament] = useState(null);
    const [fixtureRounds, setFixtureRounds] = useState({});
    const [selectedRound, setSelectedRound] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        axios
            .get("https://batsup-v1-oauz.onrender.com/api/tournaments/all")
            .then((res) => {
                setTournaments(Array.isArray(res.data) ? res.data : []);
                setLoading(false);
            })
            .catch(() => {
                setTournaments([]);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (!selectedTournament) {
            setFixtureRounds({});
            setSelectedRound("");
            return;
        }
        const teamNames =
            selectedTournament.teamNames && selectedTournament.teamNames.length > 0
                ? selectedTournament.teamNames
                : selectedTournament.teams?.map((t) => t.name) || [];

        if (teamNames.length === 0) {
            setFixtureRounds({});
            setSelectedRound("");
            return;
        }

        let rounds = {};
        const baseDate = new Date(selectedTournament.startDate);
        let matchDates = [];
        for (let i = 0; i < Math.ceil(teamNames.length / 2); i++) {
            const d = new Date(baseDate);
            d.setDate(baseDate.getDate() + i);
            matchDates.push(
                d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
            );
        }
        let round1 = [];
        for (let i = 0, j = 0; i < teamNames.length; i += 2, j++) {
            round1.push({
                date: matchDates[j] || "",
                team1: teamNames[i],
                team2: teamNames[i + 1] || "TBD",
                time: "3:00 PM",
            });
        }
        rounds["Round 1"] = round1;

        setFixtureRounds(rounds);
        setSelectedRound("Round 1");
    }, [selectedTournament]);

    const roundTabs = Object.keys(fixtureRounds);

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white py-10 px-4 flex items-center justify-center">
                <p className="text-xl">Loading fixtures...</p>
            </div>
        );
    }

    if (!selectedTournament) {
        return (
            <div className="min-h-screen bg-black text-white py-10 px-4 font-sans">
                <div className="max-w-6xl mx-auto mt-16">
                    <h1 className="text-4xl font-bold text-center mb-10">Cricket Fixtures</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {tournaments.map((tournament) => (
                            <div
                                key={tournament.id}
                                className="bg-white text-black rounded-2xl overflow-hidden shadow hover:scale-105 cursor-pointer transition-all duration-300"
                                onClick={() => setSelectedTournament(tournament)}
                            >
                                <img
                                    src={tournament.image}
                                    alt={tournament.tournamentName}
                                    className="h-48 w-full object-cover"
                                />
                                <div className="p-4">
                                    <h2 className="text-xl font-semibold">{tournament.tournamentName}</h2>
                                    <p className="text-sm text-gray-600">
                                        {tournament.matchType} | {tournament.location} |{" "}
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
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white py-10 px-4 font-sans">
            <div className="max-w-3xl mx-auto mt-16">
                <button
                    onClick={() => {
                        setSelectedTournament(null);
                        setFixtureRounds({});
                        setSelectedRound("");
                    }}
                    className="mb-6 text-yellow-400 hover:underline"
                >
                    ← Back to Tournaments
                </button>
                <h1 className="text-3xl font-bold text-center mb-8">Cricket Fixtures</h1>
                <div className="flex justify-center mb-6 border-b border-gray-700">
                    {roundTabs.map((round) => (
                        <button
                            key={round}
                            onClick={() => setSelectedRound(round)}
                            className={`px-4 py-2 text-sm sm:text-base transition-all duration-200 border-b-2 ${selectedRound === round
                                    ? "border-white text-white"
                                    : "border-transparent text-gray-400 hover:text-white"
                                }`}
                        >
                            {round}
                        </button>
                    ))}
                </div>
                <div className="space-y-3">
                    {selectedRound && fixtureRounds[selectedRound]?.length > 0 ? (
                        fixtureRounds[selectedRound].map((match, index) => (
                            <div
                                key={index}
                                className="bg-[#1a1a1a] border border-gray-700 rounded-md px-4 py-3 text-sm sm:text-base flex justify-between items-center text-center"
                            >
                                <div className="w-1/4 truncate">
                                    <span className={`${match.team1 === "TBD" ? "text-gray-500" : ""}`}>
                                        {match.team1}
                                    </span>
                                </div>
                                <div className="w-1/4 text-white font-semibold">vs</div>
                                <div className="w-1/4 truncate">
                                    <span className={`${match.team2 === "TBD" ? "text-gray-500" : ""}`}>
                                        {match.team2}
                                    </span>
                                </div>
                                <div className="w-1/4 text-xs text-gray-400">
                                    {match.time} {match.date && <>· {match.date}</>}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-400 py-8">No matches in this round.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Fixture;
