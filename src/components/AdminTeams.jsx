import { useState } from "react";
import { Trash2 } from "lucide-react";

export default function AdminTeams() {
const teams = [
    {
    id: 1,
    name: "Warriors",
    players: [
        { id: 101, name: "John" },
        { id: 102, name: "David" },
        { id: 103, name: "Mark" },
    ],
    },
    {
    id: 2,
    name: "Strikers",
    players: [
        { id: 201, name: "Alex" },
        { id: 202, name: "Mike" },
    ],
    },
    {
    id: 3,
    name: "Titans",
    players: [
        { id: 301, name: "Sam" },
        { id: 302, name: "Chris" },
    ],
    },
];

const [selectedTeam, setSelectedTeam] = useState(null);
const [captainId, setCaptainId] = useState(null);

const handleDelete = (id) => {
    console.log("Delete team with id:", id);
};

const handleSetCaptain = () => {
    console.log(
    `Captain for team ${selectedTeam.name} is player ID: ${captainId}`
    );
    setSelectedTeam(null);
    setCaptainId(null);
};

return (
    <div className="p-6">
    <h1 className="text-3xl font-bold text-violet-600 mb-6">
        Team Management
    </h1>

    {/* TEAM LIST */}
    {!selectedTeam && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
            <div
            key={team.id}
            className="relative bg-white shadow-md rounded-xl p-4 cursor-pointer hover:shadow-lg transition"
            onClick={() => setSelectedTeam(team)}
            >
            <button
                onClick={(e) => {
                e.stopPropagation();
                handleDelete(team.id);
                }}
                className="absolute top-3 right-3 text-red-500 hover:text-red-700"
            >
                <Trash2 size={20} />
            </button>

            <h2 className="text-xl font-semibold text-black">
                {team.name}
            </h2>
            <p className="text-gray-700">
                Players: {team.players.length} / 15
            </p>
            </div>
        ))}
        </div>
    )}

    {/* TEAM DETAILS */}
    {selectedTeam && (
        <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold text-violet-600 mb-4">
            {selectedTeam.name} - Players
        </h2>

        <ul className="space-y-2">
            {selectedTeam.players.map((player) => (
            <li
                key={player.id}
                className="flex items-center justify-between border p-2 rounded-lg"
            >
                <span>{player.name}</span>
                <input
                type="radio"
                name="captain"
                value={player.id}
                checked={captainId === player.id}
                onChange={() => setCaptainId(player.id)}
                />
            </li>
            ))}
        </ul>

        <div className="mt-4 flex gap-3">
            <button
            onClick={handleSetCaptain}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            disabled={!captainId}
            >
            Save Captain
            </button>
            <button
            onClick={() => {
                setSelectedTeam(null);
                setCaptainId(null);
            }}
            className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
            >
            Back
            </button>
        </div>
        </div>
    )}
    </div>
);
}
