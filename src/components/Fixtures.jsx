import React from 'react';

const FixturesPage = () => {
const fixtures = {
    round1: [
    { teamA: 'Astralis', teamB: 'Gambit', winner: 'Astralis' },
    { teamA: 'Immortals', teamB: 'G2', winner: 'G2' },
    { teamA: 'FaZe', teamB: 'North', winner: 'FaZe' },
    { teamA: 'Virtus.pro', teamB: 'Liquid', winner: 'Virtus.pro' },
    ],
    round2: [
    { teamA: 'Astralis', teamB: 'G2', winner: 'Astralis' },
    { teamA: 'FaZe', teamB: 'Virtus.pro', winner: 'FaZe' },
    ],
    semifinals: [
    { teamA: 'Astralis', teamB: 'FaZe', winner: 'Astralis' },
    ],
    finals: [
    { teamA: 'Astralis', teamB: 'Gambit', winner: null },
    ],
};

const renderMatch = ({ teamA, teamB, winner }, idx) => (
    <div key={idx} className="bg-[#1e293b] text-white p-3 rounded-lg w-48 mb-4">
    <div className={`flex justify-between items-center p-1 rounded ${winner === teamA ? 'bg-yellow-600' : 'bg-gray-700'}`}>
        <span>{teamA}</span>
        <span>{winner === teamA ? '1' : '0'}</span>
    </div>
    <div className={`flex justify-between items-center p-1 rounded ${winner === teamB ? 'bg-yellow-600' : 'bg-gray-700'}`}>
        <span>{teamB}</span>
        <span>{winner === teamB ? '1' : '0'}</span>
    </div>
    </div>
);

return (
    <div className="min-h-screen bg-[#0f172a] text-white pt-24 px-6">
    <h1 className="text-3xl font-bold mb-10 text-center">Spring Aim Masters – Fixtures</h1>

    <div className="flex gap-12 justify-center overflow-x-auto pb-10">
        {/* Round 1 */}
        <div>
        <h2 className="text-center mb-4 text-lg font-semibold">Round 1</h2>
        {fixtures.round1.map(renderMatch)}
        </div>

        {/* Round 2 */}
        <div>
        <h2 className="text-center mb-4 text-lg font-semibold">Quarterfinals</h2>
        {fixtures.round2.map(renderMatch)}
        </div>

        {/* Semifinals */}
        <div>
        <h2 className="text-center mb-4 text-lg font-semibold">Semifinals</h2>
        {fixtures.semifinals.map(renderMatch)}
        </div>

        {/* Finals */}
        <div>
        <h2 className="text-center mb-4 text-lg font-semibold">Finals</h2>
        {fixtures.finals.map(renderMatch)}
        </div>
    </div>
    </div>
);
};

export default FixturesPage;
