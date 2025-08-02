import React, { useState } from 'react';

const Fixture = () => {
const [selectedRound, setSelectedRound] = useState('Round 1');

const rounds = {
    'Round 1': [
    { date: '15 March 2025', team1: 'India', team2: 'Bangladesh', time: '3:00 PM' },
    { date: '16 March 2025', team1: 'Australia', team2: 'Sri Lanka', time: '3:00 PM' },
    { date: '17 March 2025', team1: 'Pakistan', team2: 'England', time: '3:00 PM' },
    { date: '18 March 2025', team1: 'South Africa', team2: 'Afghanisthan', time: '3:00 PM' },
    ],
    'Round 2': [
    { date: '22 March 2025', team1: 'TBD', team2: 'TBD', time: '3:00 PM' },
    { date: '23 March 2025', team1: 'TBD', team2: 'TBD', time: '3:00 PM' },
    ],
    'Round 3': [
    { date: '28 March 2025', team1: 'TBD', team2: 'TBD', time: '3:00 PM' },
    ],
};

const roundTabs = Object.keys(rounds);

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
                ? 'border-white text-white'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
            >
            {round}
            </button>
        ))}
        </div>

        <div className="space-y-3">
        {rounds[selectedRound].map((match, index) => (
            <div
            key={index}
            className="bg-[#1a1a1a] border border-gray-700 rounded-md px-4 py-3 text-sm sm:text-base flex justify-between items-center text-center"
            >
            <div className="w-1/4 truncate">
                <span className={`${match.team1 === 'TBD' ? 'text-gray-500' : ''}`}>
                {match.team1}
                </span>
            </div>
            <div className="w-1/4 text-white font-semibold">vs</div>
            <div className="w-1/4 truncate">
                <span className={`${match.team2 === 'TBD' ? 'text-gray-500' : ''}`}>
                {match.team2}
                </span>
            </div>
            <div className="w-1/4 text-xs text-gray-400">
                {match.time} · {match.date}
            </div>
            </div>
        ))}
        </div>

    </div>
    </div>
);
};

export default Fixture;
