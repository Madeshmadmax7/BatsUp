// Fixture.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const Fixture = () => {
    const [rounds, setRounds] = useState({});
    const [selectedRound, setSelectedRound] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        setLoading(true);
        axios.get("http://localhost:8080/api/round/with-matches")
            .then((res) => {
                const roundsData = {};
                if (Array.isArray(res.data)) {
                    res.data.forEach(round => {
                        roundsData[round.roundName] = round.matches.map(match => ({
                            date: match.date,
                            team1: match.homeTeam || "TBD",
                            team2: match.awayTeam || "TBD",
                            time: match.time || "18:00"
                        }));
                    });
                }
                setRounds(roundsData);
                const firstRound = Object.keys(roundsData)[0];
                setSelectedRound(firstRound || "");
                setLoading(false);
                setError("");
            })
            .catch(() => {
                setRounds({});
                setSelectedRound("");
                setLoading(false);
                setError("Failed to load fixtures");
            });
    }, []);

    const roundTabs = Object.keys(rounds);

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white py-10 px-4 flex items-center justify-center">
                <p className="text-xl">Loading fixtures...</p>
            </div>
        );
    }

    if (error || roundTabs.length === 0) {
        return (
            <div className="min-h-screen bg-black text-white py-10 px-4 flex flex-col items-center justify-center">
                <h2 className="text-2xl mb-4">No Fixtures Found</h2>
                <p className="text-gray-400">{error || "No rounds or matches available."}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white py-10 px-4 font-sans">
            <div className="max-w-3xl mx-auto mt-15">
                <h1 className="text-3xl font-bold text-center mb-8">Cricket Fixtures</h1>
                <div className="flex justify-center mb-6 border-b border-gray-700">
                    {roundTabs.map((round) => (
                        <button
                            key={round}
                            onClick={() => setSelectedRound(round)}
                            className={`px-4 py-2 text-sm sm:text-base transition-all duration-200 border-b-2 ${
                                selectedRound === round
                                    ? "border-white text-white"
                                    : "border-transparent text-gray-400 hover:text-white"
                            }`}
                        >
                            {round}
                        </button>
                    ))}
                </div>
                <div className="space-y-3">
                    {selectedRound && rounds[selectedRound]?.length > 0 ? (
                        rounds[selectedRound].map((match, index) => (
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
                                    {match.time} · {match.date}
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



// import React, { useState } from 'react';

// const Fixture = () => {
// const [selectedRound, setSelectedRound] = useState('Round 1');

// const rounds = {
//     'Round 1': [
//     { date: '15 March 2025', team1: 'India', team2: 'Bangladesh', time: '3:00 PM' },
//     { date: '16 March 2025', team1: 'Australia', team2: 'Sri Lanka', time: '3:00 PM' },
//     { date: '17 March 2025', team1: 'Pakistan', team2: 'England', time: '3:00 PM' },
//     { date: '18 March 2025', team1: 'South Africa', team2: 'Afghanisthan', time: '3:00 PM' },
//     ],
//     'Round 2': [
//     { date: '22 March 2025', team1: 'TBD', team2: 'TBD', time: '3:00 PM' },
//     { date: '23 March 2025', team1: 'TBD', team2: 'TBD', time: '3:00 PM' },
//     ],
//     'Round 3': [
//     { date: '28 March 2025', team1: 'TBD', team2: 'TBD', time: '3:00 PM' },
//     ],
// };

// const roundTabs = Object.keys(rounds);

// return (
//     <div className="min-h-screen bg-black text-white py-10 px-4 font-sans">
//     <div className="max-w-3xl mx-auto mt-15">
//         <h1 className="text-3xl font-bold text-center mb-8">Cricket Fixtures</h1>

//         <div className="flex justify-center mb-6 border-b border-gray-700">
//         {roundTabs.map((round) => (
//             <button
//             key={round}
//             onClick={() => setSelectedRound(round)}
//             className={`px-4 py-2 text-sm sm:text-base transition-all duration-200 border-b-2 ${
//                 selectedRound === round
//                 ? 'border-white text-white'
//                 : 'border-transparent text-gray-400 hover:text-white'
//             }`}
//             >
//             {round}
//             </button>
//         ))}
//         </div>

//         <div className="space-y-3">
//         {rounds[selectedRound].map((match, index) => (
//             <div
//             key={index}
//             className="bg-[#1a1a1a] border border-gray-700 rounded-md px-4 py-3 text-sm sm:text-base flex justify-between items-center text-center"
//             >
//             <div className="w-1/4 truncate">
//                 <span className={`${match.team1 === 'TBD' ? 'text-gray-500' : ''}`}>
//                 {match.team1}
//                 </span>
//             </div>
//             <div className="w-1/4 text-white font-semibold">vs</div>
//             <div className="w-1/4 truncate">
//                 <span className={`${match.team2 === 'TBD' ? 'text-gray-500' : ''}`}>
//                 {match.team2}
//                 </span>
//             </div>
//             <div className="w-1/4 text-xs text-gray-400">
//                 {match.time} · {match.date}
//             </div>
//             </div>
//         ))}
//         </div>

//     </div>
//     </div>
// );
// };

// export default Fixture;
