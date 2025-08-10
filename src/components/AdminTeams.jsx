import { useState } from "react";
import { Trash2 } from "lucide-react";

export default function AdminTeams() {
const tournaments = [
    {
    id: 1,
    name: "Summer Cup 2025",
    teams: [
        {
        id: 101,
        name: "Warriors",
        players: [
            { id: 1, name: "John" },
            { id: 2, name: "David" },
            { id: 3, name: "Mark" },
        ],
        },
        {
        id: 102,
        name: "Strikers",
        players: [
            { id: 4, name: "Alex" },
            { id: 5, name: "Mike" },
        ],
        },
    ],
    },
    {
    id: 2,
    name: "Winter League 2025",
    teams: [
        {
        id: 201,
        name: "Titans",
        players: [
            { id: 6, name: "Sam" },
            { id: 7, name: "Chris" },
        ],
        },
        {
        id: 202,
        name: "Dragons",
        players: [
            { id: 8, name: "Nancy" },
            { id: 9, name: "Liam" },
        ],
        },
    ],
    },
];

const [selectedTeam, setSelectedTeam] = useState(null);

const handleDelete = (teamId) => {
    alert(`Delete team with id: ${teamId} (handle this logic)`);
};

return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-900 min-h-screen">
    <h1 className="text-3xl font-bold text-white mt-10 mb-8">
        Team Management by Tournament
    </h1>

    {tournaments.map((tournament) => (
        <section key={tournament.id} className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-white border-b border-gray-600 pb-1">
            {tournament.name}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {tournament.teams.map((team) => (
            <div
                key={team.id}
                className="relative cursor-pointer bg-gray-800 text-white shadow-md rounded-lg p-4 hover:shadow-lg transition duration-200 border border-gray-700"
                onClick={() => setSelectedTeam(team)}
            >
                {/* Delete button */}
                <button
                onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(team.id);
                }}
                className="absolute top-2 right-2 text-gray-300 hover:text-red-500 transition-colors"
                title="Delete Team"
                >
                <Trash2 size={16} />
                </button>

                <h3 className="text-lg font-semibold mb-1">{team.name}</h3>
                <p className="inline-block bg-gray-700 text-white px-2 py-0.5 rounded text-xs font-medium select-none">
                Players: {team.players.length} / 15
                </p>
            </div>
            ))}
        </div>
        </section>
    ))}

    {selectedTeam && (
        <div
            className="fixed inset-0 flex justify-center items-center z-50"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
            onClick={() => setSelectedTeam(null)}
        >
            <div
            className="bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-lg"
            onClick={(e) => e.stopPropagation()}
            >
            <h3 className="text-2xl font-semibold mb-4 text-white">
                {selectedTeam.name} - Players
            </h3>
            <ul className="space-y-2 max-h-60 overflow-y-auto text-gray-300">
                {selectedTeam.players.map((player) => (
                <li
                    key={player.id}
                    className="border-b border-gray-700 pb-2"
                >
                    {player.name}
                </li>
                ))}
            </ul>
            <button
                onClick={() => setSelectedTeam(null)}
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
                Close
            </button>
            </div>
        </div>
    )}
    </div>
);
}
