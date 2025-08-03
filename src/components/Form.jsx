// Enhanced Form Component with Professional Styling and Popup Support
import React, { useState } from "react";

const Form = ({ tournament, onClose, onRegister }) => {
const [players, setPlayers] = useState(Array(15).fill(""));
const [jerseyNumbers, setJerseyNumbers] = useState(Array(15).fill(""));
const [teamName, setTeamName] = useState("");
const [phone, setPhone] = useState("");
const [location, setLocation] = useState("");
const [logo, setLogo] = useState(null);

const handleSubmit = () => {
    if (!teamName || players.some(p => !p) || jerseyNumbers.some(j => !j) || !phone || !location || !logo) {
    alert("Please complete all fields for all 15 players and upload a team logo.");
    return;
    }
    alert(`Team '${teamName}' successfully registered for ${tournament.title}`);
    onRegister();
    onClose();
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
                    alt={tournament.title}
                    className="w-full h-64 object-cover rounded-xl shadow mb-4"
                />
                <h2 className="text-3xl font-bold text-gray-800 mb-2">{tournament.title}</h2>
                <p className="text-sm text-gray-500 mb-4">{tournament.date} | {tournament.location}</p>
                <p className="text-gray-700 text-sm leading-relaxed">{tournament.description}</p>
                </div>

                <div className="space-y-4">
                <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="Team Name"
                    className="w-full border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:outline-none p-3 rounded-lg"
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
                    type="file"
                    accept="image/*"
                    onChange={(e) => setLogo(e.target.files[0])}
                    className="w-full border border-gray-300 p-3 rounded-lg bg-white"
                />
                <p className="text-sm text-gray-500 italic">Upload your team logo (image file)</p>

                <h4 className="text-lg font-semibold text-gray-700 mt-6">Player Details</h4>
                <div className="max-h-80 overflow-y-auto pr-1 space-y-2">
                    {players.map((player, i) => (
                    <div key={i} className="flex gap-2">
                        <input
                        type="text"
                        value={player}
                        onChange={(e) => {
                            const newPlayers = [...players];
                            newPlayers[i] = e.target.value;
                            setPlayers(newPlayers);
                        }}
                        placeholder={`Player ${i + 1} Name`}
                        className="flex-1 border border-gray-300 p-2 rounded-lg"
                        />
                        <input
                        type="number"
                        value={jerseyNumbers[i]}
                        onChange={(e) => {
                            const newJerseys = [...jerseyNumbers];
                            newJerseys[i] = e.target.value;
                            setJerseyNumbers(newJerseys);
                        }}
                        placeholder="Jersey No."
                        className="w-24 border border-gray-300 p-2 rounded-lg"
                        />
                    </div>
                    ))}
                </div>

                <button
                    onClick={handleSubmit}
                    className="w-full bg-yellow-400 hover:bg-yellow-500 transition duration-300 text-black px-4 py-3 rounded-xl font-semibold mt-4"
                >
                    Submit Registration
                </button>
                </div>
            </div>
            </div>
        </div>
    </div>
);
};

export default Form;