import React, { useState, useEffect } from "react";
import axios from "axios";

function ScorecardPopup({ open, onClose, team }) {
    if (!open || !team) return null;
    const { players } = team;

    const batsmen = players.filter((p) => p.playerType === "Batsman" || p.playerType === "All-rounder");
    const bowlers = players.filter((p) => p.playerType === "Bowler" || p.playerType === "All-rounder");

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50"
            onClick={onClose}
        >
            <div
                className="bg-[#18181b] text-white p-6 rounded-xl max-w-lg w-full relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="absolute top-3 right-4 text-gray-300 hover:text-white text-2xl"
                    onClick={onClose}
                    aria-label="Close"
                >
                    ×
                </button>
                <h2 className="text-2xl font-bold mb-4">{team.teamName} – Scorecard</h2>

                <h3 className="text-lg text-amber-300 font-semibold mb-1">Batting</h3>
                <table className="w-full mb-4 text-sm">
                    <thead className="border-b border-gray-600">
                        <tr>
                            <th className="text-left py-1 px-2">Player</th>
                            <th className="text-right px-2">R</th>
                            <th className="text-right px-2">B</th>
                            <th className="text-right px-2">4s</th>
                            <th className="text-right px-2">6s</th>
                            <th className="text-right px-2">SR</th>
                        </tr>
                    </thead>
                    <tbody>
                        {batsmen.map((p, i) => (
                            <tr key={i} className="hover:bg-[#23232a] transition">
                                <td className="py-1 px-2">{p.playerName}</td>
                                <td className="text-right px-2">{p.runs}</td>
                                <td className="text-right px-2">{p.balls}</td>
                                <td className="text-right px-2">{p.fours}</td>
                                <td className="text-right px-2">{p.sixes}</td>
                                <td className="text-right px-2">{p.sr}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <h3 className="text-lg text-amber-300 font-semibold mb-1">Bowling</h3>
                <table className="w-full text-sm">
                    <thead className="border-b border-gray-600">
                        <tr>
                            <th className="text-left py-1 px-2">Player</th>
                            <th className="text-right px-2">O</th>
                            <th className="text-right px-2">R</th>
                            <th className="text-right px-2">W</th>
                            <th className="text-right px-2">Econ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bowlers.map((p, i) => (
                            <tr key={i} className="hover:bg-[#23232a] transition">
                                <td className="py-1 px-2">{p.playerName}</td>
                                <td className="text-right px-2">{p.balls /* overs in balls */}</td>
                                <td className="text-right px-2">{p.runs}</td>
                                <td className="text-right px-2">{p.wickets}</td>
                                <td className="text-right px-2">{(p.runs && p.balls) ? (p.runs / (p.balls / 6)).toFixed(2) : "–"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default function LiveScores() {
    const [matches, setMatches] = useState([]);
    const [popupTeamId, setPopupTeamId] = useState(null);
    const [teamsData, setTeamsData] = useState({});
    const [selectedTeam, setSelectedTeam] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:8080/api/match/get").then((res) => {
            setMatches(res.data);
        });
    }, []);

    useEffect(() => {
        if (matches.length) {
            const fetchTeams = async () => {
                let tempTeams = {};
                for (const match of matches) {
                    const homeRes = await axios.get(`http://localhost:8080/api/team/get/${match.homeTeamId}`);
                    const awayRes = await axios.get(`http://localhost:8080/api/team/get/${match.awayTeamId}`);
                    tempTeams[match.homeTeamId] = homeRes.data;
                    tempTeams[match.awayTeamId] = awayRes.data;
                }
                setTeamsData(tempTeams);
            };
            fetchTeams();
        }
    }, [matches]);

    return (
        <div className="bg-black px-4 md:px-10 py-10 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">Live Scores</h1>
                </div>
                {matches.map((match) => (
                    <section key={match.id} className="mb-10">
                        <h2 className="text-xl font-semibold mb-4 text-amber-400">
                            {match.type} - {match.location} - {match.date}
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[match.homeTeamId, match.awayTeamId].map((teamId) => {
                                const team = teamsData[teamId];
                                if (!team) return null;
                                return (
                                    <div
                                        key={team.id}
                                        className="bg-[#18181b] rounded-lg shadow hover:shadow-xl transition flex flex-col items-center p-3 min-h-[160px]"
                                    >
                                        <div
                                            className="w-14 h-14 bg-cover bg-center rounded-full mb-2"
                                            style={{ backgroundImage: `url(${team.logo})` }}
                                        />
                                        <h3 className="text-base font-bold text-white">{team.teamName}</h3>
                                        <div className="text-xs text-gray-300">
                                            <span className="font-extrabold text-yellow-300">{match.scoreDetail?.runs || "–"}/{match.scoreDetail?.wickets || "–"}</span>
                                            <span className="ml-2">({match.scoreDetail?.wickets || "–"} wkts)</span>
                                        </div>
                                        <button
                                            className="mt-4 text-[13px] text-amber-400 font-semibold px-3 py-1 rounded-full border border-amber-400 hover:bg-amber-400 hover:text-black transition"
                                            onClick={() => {
                                                setPopupTeamId(team.id);
                                                setSelectedTeam(team);
                                            }}
                                        >
                                            View Details →
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                ))}
                <ScorecardPopup
                    open={!!popupTeamId}
                    onClose={() => setPopupTeamId(null)}
                    team={selectedTeam}
                />
            </div>
        </div>
    );
}


// import React, { useState } from "react";
// import warriorsLogo from "../assets/pic-1.jpg";
// import strikersLogo from "../assets/pic-2.jpg";
// import titansLogo from "../assets/pic-3.jpg";
// import dragonsLogo from "../assets/pic-4.jpg";

// const tournaments = [
//     {
//         id: 1,
//         name: "Summer Cup 2025",
//         teams: [
//             { id: 101, name: "Warriors", score: "245/6", wickets: 6, img: warriorsLogo },
//             { id: 102, name: "Strikers", score: "198/8", wickets: 8, img: strikersLogo },
//         ],
//     },
//     {
//         id: 2,
//         name: "Winter League 2025",
//         teams: [
//             { id: 201, name: "Titans", score: "165/4", wickets: 4, img: titansLogo },
//             { id: 202, name: "Dragons", score: "210/7", wickets: 7, img: dragonsLogo },
//         ],
//     },
// ];

// const teamsData = {
//     101: {
//         name: "Warriors",
//         batting: [
//             { name: "Y Jaiswal", runs: 75, balls: 84, fours: 8, sixes: 1, sr: 89.28 },
//             { name: "KL Rahul", runs: 18, balls: 21, fours: 2, sixes: 0, sr: 85.71 },
//             { name: "V Kohli", runs: 54, balls: 46, fours: 5, sixes: 1, sr: 117.39 },
//             { name: "SK Yadav", runs: 32, balls: 20, fours: 4, sixes: 1, sr: 160.0 },
//             { name: "H Pandya", runs: 24, balls: 12, fours: 1, sixes: 2, sr: 200.0 },
//             { name: "R Jadeja", runs: 10, balls: 8, fours: 1, sixes: 0, sr: 125.0 },
//         ],
//         bowling: [
//             { name: "J Overton", overs: 8, runs: 35, wickets: 2, econ: 4.38 },
//             { name: "G Atkinson", overs: 6, runs: 25, wickets: 1, econ: 4.16 },
//             { name: "S Khan", overs: 10, runs: 48, wickets: 3, econ: 4.8 },
//             { name: "M Wood", overs: 8, runs: 42, wickets: 0, econ: 5.25 },
//             { name: "R Jadeja", overs: 6, runs: 28, wickets: 1, econ: 4.66 },
//         ],
//     },
//     102: {
//         name: "Strikers",
//         batting: [
//             { name: "J Roy", runs: 61, balls: 49, fours: 7, sixes: 1, sr: 124.48 },
//             { name: "P Salt", runs: 42, balls: 36, fours: 4, sixes: 0, sr: 116.67 },
//             { name: "J Root", runs: 38, balls: 40, fours: 3, sixes: 1, sr: 95.0 },
//             { name: "B Stokes", runs: 22, balls: 15, fours: 2, sixes: 1, sr: 146.67 },
//             { name: "S Curran", runs: 12, balls: 9, fours: 1, sixes: 0, sr: 133.33 },
//             { name: "M Ali", runs: 9, balls: 6, fours: 1, sixes: 0, sr: 150.0 },
//         ],
//         bowling: [
//             { name: "M Starc", overs: 10, runs: 50, wickets: 2, econ: 5.0 },
//             { name: "A Rashid", overs: 10, runs: 45, wickets: 1, econ: 4.5 },
//             { name: "C Woakes", overs: 8, runs: 38, wickets: 2, econ: 4.75 },
//             { name: "L Wood", overs: 6, runs: 35, wickets: 0, econ: 5.83 },
//             { name: "B Stokes", overs: 4, runs: 26, wickets: 0, econ: 6.5 },
//         ],
//     },
//     201: {
//         name: "Titans",
//         batting: [
//             { name: "S Smith", runs: 57, balls: 63, fours: 6, sixes: 0, sr: 90.47 },
//             { name: "D Warner", runs: 48, balls: 38, fours: 5, sixes: 1, sr: 126.32 },
//             { name: "G Maxwell", runs: 35, balls: 20, fours: 3, sixes: 2, sr: 175.0 },
//             { name: "M Marsh", runs: 14, balls: 9, fours: 1, sixes: 0, sr: 155.56 },
//             { name: "A Carey", runs: 6, balls: 8, fours: 0, sixes: 0, sr: 75.0 },
//             { name: "P Cummins", runs: 5, balls: 4, fours: 0, sixes: 0, sr: 125.0 },
//         ],
//         bowling: [
//             { name: "T Boult", overs: 8, runs: 36, wickets: 1, econ: 4.5 },
//             { name: "J Hazlewood", overs: 10, runs: 40, wickets: 2, econ: 4.0 },
//             { name: "A Zampa", overs: 10, runs: 52, wickets: 3, econ: 5.2 },
//             { name: "M Stoinis", overs: 6, runs: 33, wickets: 0, econ: 5.5 },
//             { name: "P Cummins", overs: 6, runs: 32, wickets: 1, econ: 5.33 },
//         ],
//     },
//     202: {
//         name: "Dragons",
//         batting: [
//             { name: "K Williamson", runs: 77, balls: 82, fours: 9, sixes: 0, sr: 93.9 },
//             { name: "M Guptill", runs: 58, balls: 45, fours: 6, sixes: 2, sr: 128.89 },
//             { name: "D Conway", runs: 42, balls: 37, fours: 5, sixes: 0, sr: 113.51 },
//             { name: "J Neesham", runs: 16, balls: 12, fours: 1, sixes: 0, sr: 133.33 },
//             { name: "T Latham", runs: 10, balls: 9, fours: 1, sixes: 0, sr: 111.11 },
//             { name: "M Santner", runs: 4, balls: 5, fours: 0, sixes: 0, sr: 80.0 },
//         ],
//         bowling: [
//             { name: "T Southee", overs: 9, runs: 44, wickets: 2, econ: 4.88 },
//             { name: "K Jamieson", overs: 8, runs: 39, wickets: 1, econ: 4.88 },
//             { name: "I Sodhi", overs: 10, runs: 51, wickets: 2, econ: 5.1 },
//             { name: "M Henry", overs: 6, runs: 35, wickets: 0, econ: 5.83 },
//             { name: "M Santner", overs: 7, runs: 33, wickets: 1, econ: 4.71 },
//         ],
//     },
// };

// function ScorecardPopup({ open, onClose, team }) {
//     if (!open || !team) return null;
//     const { batting, bowling, name } = team;
//     return (
//         <div
//             className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50"
//             onClick={onClose}
//         >
//             <div
//                 className="bg-[#18181b] text-white p-6 rounded-xl max-w-lg w-full relative"
//                 onClick={e => e.stopPropagation()}
//             >
//                 <button
//                     className="absolute top-3 right-4 text-gray-300 hover:text-white text-2xl"
//                     onClick={onClose}
//                     aria-label="Close"
//                 >
//                     ×
//                 </button>
//                 <h2 className="text-2xl font-bold mb-4">{name} – Scorecard</h2>
//                 <h3 className="text-lg text-amber-300 font-semibold mb-1">Batting</h3>
//                 <table className="w-full mb-4 text-sm">
//                     <thead className="border-b border-gray-600">
//                         <tr>
//                             <th className="text-left py-1 px-2">Player</th>
//                             <th className="text-right px-2">R</th>
//                             <th className="text-right px-2">B</th>
//                             <th className="text-right px-2">4s</th>
//                             <th className="text-right px-2">6s</th>
//                             <th className="text-right px-2">SR</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {batting.map((p, i) => (
//                             <tr key={i} className="hover:bg-[#23232a] transition">
//                                 <td className="py-1 px-2">{p.name}</td>
//                                 <td className="text-right px-2">{p.runs}</td>
//                                 <td className="text-right px-2">{p.balls}</td>
//                                 <td className="text-right px-2">{p.fours}</td>
//                                 <td className="text-right px-2">{p.sixes}</td>
//                                 <td className="text-right px-2">{p.sr}</td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//                 <h3 className="text-lg text-amber-300 font-semibold mb-1">Bowling</h3>
//                 <table className="w-full text-sm">
//                     <thead className="border-b border-gray-600">
//                         <tr>
//                             <th className="text-left py-1 px-2">Bowler</th>
//                             <th className="text-right px-2">O</th>
//                             <th className="text-right px-2">R</th>
//                             <th className="text-right px-2">W</th>
//                             <th className="text-right px-2">Econ</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {bowling.map((b, i) => (
//                             <tr key={i} className="hover:bg-[#23232a] transition">
//                                 <td className="py-1 px-2">{b.name}</td>
//                                 <td className="text-right px-2">{b.overs}</td>
//                                 <td className="text-right px-2">{b.runs}</td>
//                                 <td className="text-right px-2">{b.wickets}</td>
//                                 <td className="text-right px-2">{b.econ}</td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// }

// export default function LiveScores() {
//     const [popupTeamId, setPopupTeamId] = useState(null);

//     return (
//         <div className="bg-black px-4 md:px-10 py-10 min-h-screen">
//             <div className="max-w-7xl mx-auto">
//                 <div className="flex items-center justify-between mb-8">
//                     <h1 className="text-2xl sm:text-3xl font-bold text-white">Live Scores</h1>
//                 </div>

//                 {tournaments.map((tournament) => (
//                     <section key={tournament.id} className="mb-10">
//                         <h2 className="text-xl font-semibold mb-4 text-amber-400">
//                             {tournament.name}
//                         </h2>
//                         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                             {tournament.teams.map((team) => (
//                                 <div
//                                     key={team.id}
//                                     className="bg-[#18181b] rounded-lg shadow hover:shadow-xl transition flex flex-col items-center p-3 min-h-[160px]"
//                                 >
//                                     <div
//                                         className="w-14 h-14 bg-cover bg-center rounded-full mb-2"
//                                         style={{ backgroundImage: `url(${team.img})` }}
//                                     />
//                                     <h3 className="text-base font-bold text-white">{team.name}</h3>
//                                     <div className="text-xs text-gray-300">
//                                         <span className="font-extrabold text-yellow-300">
//                                             {team.score}
//                                         </span>
//                                         <span className="ml-2">({team.wickets} wkts)</span>
//                                     </div>
//                                     <button
//                                         className="mt-4 text-[13px] text-amber-400 font-semibold px-3 py-1 rounded-full border border-amber-400 hover:bg-amber-400 hover:text-black transition"
//                                         onClick={() => setPopupTeamId(team.id)}
//                                     >
//                                         View Details →
//                                     </button>
//                                 </div>
//                             ))}
//                         </div>
//                     </section>
//                 ))}

//                 <ScorecardPopup
//                     open={!!popupTeamId}
//                     onClose={() => setPopupTeamId(null)}
//                     team={popupTeamId ? teamsData[popupTeamId] : null}
//                 />
//             </div>
//         </div>
//     );
// }
