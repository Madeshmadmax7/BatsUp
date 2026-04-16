import React, { useState } from "react";
import axios from "axios";

const Form = ({ tournament, onClose, onRegister }) => {
    const [teamName, setTeamName] = useState("");
    const [teamPassword, setTeamPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [location, setLocation] = useState("");
    const [logoLink, setLogoLink] = useState("");
    const [players, setPlayers] = useState([""]);
    const [jerseyNumbers, setJerseyNumbers] = useState([""]);

    const handleSubmit = async () => {
        if (!teamName || !teamPassword) {
            alert("Please fill Team Name and Team Password.");
            return;
        }
        try {
            const teamCreatePayload = {
                name: teamName,
                password: teamPassword,
                phoneNumber: phone,
                location: location,
                logo: logoLink,
            };

            const { data: createdTeam } = await axios.post(
                "https://batsup-v1-oauz.onrender.com/api/team/create",
                teamCreatePayload
            );

            const teamId = createdTeam.id;

            await axios.post(
                `https://batsup-v1-oauz.onrender.com/api/tournaments/${tournament.id}/add-team/${teamId}`
            );

            for (let i = 0; i < players.length; i++) {
                const playerName = players[i].trim();
                const jerseyRaw = jerseyNumbers[i];
                if (!playerName || !jerseyRaw) continue;

                const jerseyNumber = parseInt(jerseyRaw, 10);
                if (isNaN(jerseyNumber)) continue;

                const playerPayload = {
                    nickname: playerName,
                    jerseyNumber: jerseyNumber,
                    teamId: teamId,
                };

                await axios.post(
                    "https://batsup-v1-oauz.onrender.com/api/player/createNoUser",
                    playerPayload
                );
            }

            alert(`Team '${teamName}' successfully registered with players!`);
            if (onRegister) onRegister();
            onClose();
        } catch (err) {
            console.error(err);
            alert("Registration failed. Please try again!");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden text-black">
                <button
                    className="absolute top-4 right-4 text-gray-600 hover:text-black text-xl z-10"
                    onClick={onClose}
                >
                    &times;
                </button>

                <div className="max-h-[95vh] overflow-y-auto p-8">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <img
                                src={tournament.image}
                                alt={tournament.tournamentName || tournament.title}
                                className="w-full h-64 object-cover rounded-xl shadow mb-4"
                            />
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">
                                {tournament?.tournamentName || tournament?.title}
                            </h2>
                            <p className="text-sm text-gray-500 mb-4">
                                {tournament?.startDate
                                    ? new Date(tournament.startDate).toLocaleDateString()
                                    : ""}{" "}
                                | {tournament?.location || ""}
                            </p>
                            <p className="text-gray-700 text-sm leading-relaxed">
                                {tournament?.description || ""}
                            </p>
                        </div>

                        <div className="space-y-4">
                            <input
                                type="text"
                                value={teamName}
                                onChange={(e) => setTeamName(e.target.value)}
                                placeholder="Team Name"
                                className="w-full border border-gray-300 p-3 rounded-lg"
                            />
                            <input
                                type="password"
                                value={teamPassword}
                                onChange={(e) => setTeamPassword(e.target.value)}
                                placeholder="Team Password"
                                className="w-full border border-gray-300 p-3 rounded-lg"
                            />
                            <input
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="Contact Number"
                                className="w-full border border-gray-300 p-3 rounded-lg"
                            />
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="Team Location"
                                className="w-full border border-gray-300 p-3 rounded-lg"
                            />
                            <input
                                type="text"
                                value={logoLink}
                                onChange={(e) => setLogoLink(e.target.value)}
                                placeholder="Logo URL"
                                className="w-full border border-gray-300 p-3 rounded-lg"
                            />

                            <h4 className="text-lg font-semibold mt-4">Player Details</h4>
                            <div className="max-h-80 overflow-y-auto pr-1 space-y-2">
                                {players.map((player, idx) => (
                                    <div key={idx} className="flex gap-2 items-center">
                                        <input
                                            type="text"
                                            className="flex-1 border border-gray-300 p-2 rounded"
                                            placeholder={`Player ${idx + 1} Name`}
                                            value={player}
                                            onChange={(e) => {
                                                const newPlayers = [...players];
                                                newPlayers[idx] = e.target.value;
                                                setPlayers(newPlayers);
                                            }}
                                        />
                                        <input
                                            type="number"
                                            className="w-20 border border-gray-300 p-2 rounded"
                                            placeholder="Jersey No."
                                            value={jerseyNumbers[idx]}
                                            onChange={(e) => {
                                                const newJerseys = [...jerseyNumbers];
                                                newJerseys[idx] = e.target.value;
                                                setJerseyNumbers(newJerseys);
                                            }}
                                        />
                                        <button
                                            type="button"
                                            className="bg-red-500 text-white px-2 rounded"
                                            onClick={() => {
                                                const newPlayers = [...players];
                                                const newJerseys = [...jerseyNumbers];
                                                newPlayers.splice(idx, 1);
                                                newJerseys.splice(idx, 1);
                                                setPlayers(newPlayers);
                                                setJerseyNumbers(newJerseys);
                                            }}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                                {players.length < 15 && (
                                    <button
                                        type="button"
                                        className="w-full mt-2 py-2 border border-dashed border-gray-400 rounded text-gray-600 hover:bg-gray-200 transition"
                                        onClick={() => {
                                            setPlayers([...players, ""]);
                                            setJerseyNumbers([...jerseyNumbers, ""]);
                                        }}
                                    >
                                        + Add Player
                                    </button>
                                )}
                            </div>

                            <button
                                type="button"
                                className="w-full mt-4 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 rounded"
                                onClick={handleSubmit}
                            >
                                Register Team
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Form;
