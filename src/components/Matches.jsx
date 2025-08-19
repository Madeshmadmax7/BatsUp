import React, { useState, useEffect } from "react";
import axios from "axios";

const Matches = () => {
    const [tournaments, setTournaments] = useState([]);
    const [selectedTournament, setSelectedTournament] = useState(null);
    const [fixtureRounds, setFixtureRounds] = useState({});
    const [selectedRound, setSelectedRound] = useState("");

    useEffect(() => {
        axios.get("http://localhost:8080/api/tournaments/get")
            .then((response) => {
                if (Array.isArray(response.data)) {
                    setTournaments(response.data);
                } else {
                    setTournaments([]);
                }
            })
            .catch(() => setTournaments([]));
    }, []);

    // Generate rounds when tournament is selected
    useEffect(() => {
        if (!selectedTournament) {
            setFixtureRounds({});
            setSelectedRound("");
            return;
        }

        const teamNames =
            selectedTournament.teamNames && selectedTournament.teamNames.length > 0
                ? selectedTournament.teamNames
                : selectedTournament.teams?.map(t => t.name) || [];

        if (teamNames.length === 0) {
            setFixtureRounds({});
            setSelectedRound("");
            return;
        }

        let rounds = {};
        const baseDate = new Date(selectedTournament.startDate);
        let matchDates = [];

        // Dates for Round 1
        for (let i = 0; i < Math.ceil(teamNames.length / 2); i++) {
            const d = new Date(baseDate);
            d.setDate(baseDate.getDate() + i);
            matchDates.push(
                d.toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                })
            );
        }

        // Round 1 → actual team vs team
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

        // Round 2 → winners of round 1 (TBD vs TBD)
        let round2 = [];
        for (let i = 0; i < Math.ceil(round1.length / 2); i++) {
            round2.push({
                date: "", // can calculate later if needed
                team1: "TBD",
                team2: "TBD",
                time: "TBD",
            });
        }
        rounds["Round 2"] = round2;

        // Round 3 (Final) → winner of round 2 (TBD vs TBD)
        let round3 = [];
        if (round2.length > 1) {
            for (let i = 0; i < Math.ceil(round2.length / 2); i++) {
                round3.push({
                    date: "",
                    team1: "TBD",
                    team2: "TBD",
                    time: "TBD",
                });
            }
            rounds["Round 3"] = round3;
        }

        setFixtureRounds(rounds);
        setSelectedRound("Round 1");
    }, [selectedTournament]);

    const roundTabs = Object.keys(fixtureRounds);

    return (
        <div className="min-h-screen bg-black text-white py-10 px-4 font-sans">
            <div className="max-w-6xl mx-auto mt-16">
                <h1 className="text-4xl font-bold text-center mb-10">Scheduled Matches</h1>

                {!selectedTournament ? (
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
                                    className={`px-4 py-2 text-sm whitespace-nowrap border-b-2 ${
                                        selectedRound === round
                                            ? "border-white text-white"
                                            : "border-transparent text-gray-400 hover:text-white"
                                    }`}
                                >
                                    {round}
                                </button>
                            ))}
                        </div>

                        {/* Matches */}
                        <div className="space-y-3">
                            {selectedRound && fixtureRounds[selectedRound]?.length > 0 ? (
                                fixtureRounds[selectedRound].map((match, index) => (
                                    <div
                                        key={index}
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



// import { useState } from "react";

// import pic6 from "../assets/pic-6.jpg";
// import pic7 from "../assets/pic-7.jpg";
// import pic8 from "../assets/pic-8.jpg";
// import pic9 from "../assets/pic-9.jpg";
// import pic10 from "../assets/pic-10.jpg";
// import pic11 from "../assets/pic-11.jpg";
// import pic12 from "../assets/pic-12.jpg";
// import pic13 from "../assets/pic-13.jpg";
// import pic14 from "../assets/pic-14.jpg";
// import pic15 from "../assets/pic-15.jpg";

// const tournaments = [
// {
//     id: 1,
//     image: pic6,
//     title: "Neo Cup 2025",
//     type: "Adult",
//     location: "Mumbai",
//     date: "August 12",
//     rounds: {
//     "Round 1": [
//         { date: "15 March 2025", time: "3:00 PM", team1: "India", team2: "Bangladesh" },
//         { date: "16 March 2025", time: "3:00 PM", team1: "Australia", team2: "Sri Lanka" },
//         { date: "17 March 2025", time: "3:00 PM", team1: "Pakistan", team2: "Nepal" }
//     ],
//     "Round 2": [{ date: "20 March 2025", time: "3:00 PM", team1: "TBD", team2: "TBD" }],
//     "Round 3": [{ date: "24 March 2025", time: "3:00 PM", team1: "TBD", team2: "TBD" }]
//     }
// },
// {
//     id: 2,
//     image: pic7,
//     title: "Veterans Premier Battle",
//     type: "Veteran",
//     location: "Chennai",
//     date: "August 14",
//     rounds: {
//     "Round 1": [
//         { date: "17 March 2025", time: "4:00 PM", team1: "England", team2: "Pakistan" },
//         { date: "18 March 2025", time: "4:00 PM", team1: "South Africa", team2: "Afghanistan" },
//         { date: "19 March 2025", time: "4:00 PM", team1: "India", team2: "New Zealand" }
//     ],
//     "Round 2": [{ date: "22 March 2025", time: "4:00 PM", team1: "TBD", team2: "TBD" }],
//     "Round 3": [{ date: "28 March 2025", time: "4:00 PM", team1: "TBD", team2: "TBD" }]
//     }
// },
// {
//     id: 3,
//     image: pic8,
//     title: "Legends Legacy League",
//     type: "Veteran",
//     location: "Delhi",
//     date: "August 16",
//     rounds: {
//     "Round 1": [
//         { date: "19 March 2025", time: "5:00 PM", team1: "Zimbabwe", team2: "Bangladesh" },
//         { date: "20 March 2025", time: "5:00 PM", team1: "India", team2: "Australia" },
//         { date: "21 March 2025", time: "5:00 PM", team1: "Sri Lanka", team2: "West Indies" }
//     ],
//     "Round 2": [{ date: "25 March 2025", time: "5:00 PM", team1: "TBD", team2: "TBD" }],
//     "Round 3": [{ date: "29 March 2025", time: "5:00 PM", team1: "TBD", team2: "TBD" }]
//     }
// },
// {
//     id: 4,
//     image: pic9,
//     title: "Champions Street Clash",
//     type: "Amateur",
//     location: "Pune",
//     date: "August 18",
//     rounds: {
//     "Round 1": [
//         { date: "22 March 2025", time: "2:00 PM", team1: "England", team2: "Nepal" },
//         { date: "23 March 2025", time: "2:00 PM", team1: "Afghanistan", team2: "New Zealand" },
//         { date: "24 March 2025", time: "2:00 PM", team1: "Pakistan", team2: "Zimbabwe" }
//     ],
//     "Round 2": [{ date: "26 March 2025", time: "2:00 PM", team1: "TBD", team2: "TBD" }],
//     "Round 3": [{ date: "30 March 2025", time: "2:00 PM", team1: "TBD", team2: "TBD" }]
//     }
// },
// {
//     id: 5,
//     image: pic10,
//     title: "Coastal Trophy",
//     type: "Amateur",
//     location: "Goa",
//     date: "August 20",
//     rounds: {
//     "Round 1": [
//         { date: "25 March 2025", time: "6:00 PM", team1: "Sri Lanka", team2: "India" },
//         { date: "26 March 2025", time: "6:00 PM", team1: "Australia", team2: "West Indies" },
//         { date: "27 March 2025", time: "6:00 PM", team1: "Nepal", team2: "South Africa" }
//     ],
//     "Round 2": [{ date: "29 March 2025", time: "6:00 PM", team1: "TBD", team2: "TBD" }],
//     "Round 3": [{ date: "31 March 2025", time: "6:00 PM", team1: "TBD", team2: "TBD" }]
//     }
// },
// {
//     id: 6,
//     image: pic11,
//     title: "Desert Arena Cup",
//     type: "Adult",
//     location: "Rajasthan",
//     date: "August 22",
//     rounds: {
//     "Round 1": [
//         { date: "28 March 2025", time: "4:00 PM", team1: "India", team2: "Afghanistan" },
//         { date: "29 March 2025", time: "4:00 PM", team1: "Bangladesh", team2: "South Africa" },
//         { date: "30 March 2025", time: "4:00 PM", team1: "Pakistan", team2: "England" }
//     ],
//     "Round 2": [{ date: "2 April 2025", time: "4:00 PM", team1: "TBD", team2: "TBD" }],
//     "Round 3": [{ date: "5 April 2025", time: "4:00 PM", team1: "TBD", team2: "TBD" }]
//     }
// },
// {
//     id: 7,
//     image: pic12,
//     title: "Summit Showdown",
//     type: "Veteran",
//     location: "Kolkata",
//     date: "August 24",
//     rounds: {
//     "Round 1": [
//         { date: "1 April 2025", time: "3:30 PM", team1: "New Zealand", team2: "Nepal" },
//         { date: "2 April 2025", time: "3:30 PM", team1: "India", team2: "Sri Lanka" },
//         { date: "3 April 2025", time: "3:30 PM", team1: "Australia", team2: "Pakistan" }
//     ],
//     "Round 2": [{ date: "5 April 2025", time: "3:30 PM", team1: "TBD", team2: "TBD" }],
//     "Round 3": [{ date: "7 April 2025", time: "3:30 PM", team1: "TBD", team2: "TBD" }]
//     }
// },
// {
//     id: 8,
//     image: pic13,
//     title: "U-23 Rising Stars Cup",
//     type: "U-23",
//     location: "Hyderabad",
//     date: "August 26",
//     rounds: {
//     "Round 1": [
//         { date: "4 April 2025", time: "1:00 PM", team1: "Bangladesh", team2: "Nepal" },
//         { date: "5 April 2025", time: "1:00 PM", team1: "Afghanistan", team2: "India" },
//         { date: "6 April 2025", time: "1:00 PM", team1: "Pakistan", team2: "New Zealand" }
//     ],
//     "Round 2": [{ date: "8 April 2025", time: "1:00 PM", team1: "TBD", team2: "TBD" }],
//     "Round 3": [{ date: "10 April 2025", time: "1:00 PM", team1: "TBD", team2: "TBD" }]
//     }
// },
// {
//     id: 9,
//     image: pic14,
//     title: "Night Knockout League",
//     type: "Adult",
//     location: "Jaipur",
//     date: "August 28",
//     rounds: {
//     "Round 1": [
//         { date: "7 April 2025", time: "8:00 PM", team1: "New Zealand", team2: "West Indies" },
//         { date: "8 April 2025", time: "8:00 PM", team1: "Zimbabwe", team2: "Bangladesh" },
//         { date: "9 April 2025", time: "8:00 PM", team1: "Afghanistan", team2: "Nepal" }
//     ],
//     "Round 2": [{ date: "11 April 2025", time: "8:00 PM", team1: "TBD", team2: "TBD" }],
//     "Round 3": [{ date: "13 April 2025", time: "8:00 PM", team1: "TBD", team2: "TBD" }]
//     }
// },
// {
//     id: 10,
//     image: pic15,
//     title: "Final Glory League",
//     type: "Veteran",
//     location: "Ahmedabad",
//     date: "August 30",
//     rounds: {
//     "Round 1": [
//         { date: "10 April 2025", time: "6:30 PM", team1: "India", team2: "Pakistan" },
//         { date: "11 April 2025", time: "6:30 PM", team1: "Sri Lanka", team2: "Australia" },
//         { date: "12 April 2025", time: "6:30 PM", team1: "Nepal", team2: "West Indies" }
//     ],
//     "Round 2": [{ date: "14 April 2025", time: "6:30 PM", team1: "TBD", team2: "TBD" }],
//     "Round 3": [{ date: "16 April 2025", time: "6:30 PM", team1: "TBD", team2: "TBD" }]
//     }
// }
// ];


// const Matches = () => {
// const [selectedTournament, setSelectedTournament] = useState(null);
// const [selectedRound, setSelectedRound] = useState("Round 1");

// return (
//     <div className="min-h-screen bg-black text-white py-10 px-4 font-sans">
//     <div className="max-w-6xl mx-auto mt-16">
//         <h1 className="text-4xl font-bold text-center mb-10">
//         Scheduled Matches
//         </h1>

//         {!selectedTournament ? (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//             {tournaments.map((tournament) => (
//             <div
//                 key={tournament.id}
//                 className="bg-white text-black rounded-2xl overflow-hidden shadow hover:scale-105 cursor-pointer transition-all duration-300"
//                 onClick={() => {
//                 setSelectedTournament(tournament);
//                 setSelectedRound("Round 1");
//                 }}
//             >
//                 <img
//                 src={tournament.image}
//                 alt={tournament.title}
//                 className="h-48 w-full object-cover"
//                 />
//                 <div className="p-4">
//                 <h2 className="text-xl font-semibold">{tournament.title}</h2>
//                 <p className="text-sm text-gray-600">
//                     {tournament.type} | {tournament.location} | {tournament.date}
//                 </p>
//                 </div>
//             </div>
//             ))}
//         </div>
//         ) : (
//         <>
//             <button
//             onClick={() => setSelectedTournament(null)}
//             className="mb-6 text-yellow-400 hover:underline"
//             >
//             ← Back to Tournaments
//             </button>

//             <h2 className="text-2xl font-bold mb-4">
//             {selectedTournament.title} Fixtures
//             </h2>

//             {/* Round Tabs */}
//             <div className="flex mb-6 border-b border-gray-700 overflow-x-auto">
//             {Object.keys(selectedTournament.rounds).map((round) => (
//                 <button
//                 key={round}
//                 onClick={() => setSelectedRound(round)}
//                 className={`px-4 py-2 text-sm border-b-2 whitespace-nowrap ${
//                     selectedRound === round
//                     ? "border-white text-white"
//                     : "border-transparent text-gray-400 hover:text-white"
//                 }`}
//                 >
//                 {round}
//                 </button>
//             ))}
//             </div>

//             {/* Match Cards */}
//             <div className="space-y-3">
//             {selectedTournament.rounds[selectedRound]?.map((match, index) => (
//                 <div
//                 key={index}
//                 className="bg-[#1a1a1a] border border-gray-700 rounded-md px-4 py-3 text-sm sm:text-base flex flex-col md:flex-row justify-between items-center text-center"
//                 >
//                 <div className="w-full md:w-1/4 truncate font-medium">
//                     {match.team1}
//                 </div>
//                 <div className="w-full md:w-1/4 font-semibold text-yellow-300">vs</div>
//                 <div className="w-full md:w-1/4 truncate font-medium">
//                     {match.team2}
//                 </div>
//                 <div className="w-full md:w-1/4 text-xs text-gray-400 mt-2 md:mt-0">
//                     {match.time} · {match.date}
//                 </div>
//                 </div>
//             ))}
//             </div>
//         </>
//         )}
//     </div>
//     </div>
// );
// };

// export default Matches;
