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
};

return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center overflow-y-auto items-start pt-10 px-4">
        <div className="bg-white text-black rounded-3xl p-10 w-full max-w-6xl shadow-2xl relative">
            <div className="grid md:grid-cols-2 gap-10">
                <div>
                    <img
                    src={tournament.image}
                    alt={tournament.title}
                    className="w-full h-72 object-cover rounded-xl shadow-md mb-4"
                    />
                    <h2 className="text-3xl font-bold text-gray-800 mb-1">{tournament.title}</h2>
                    <p className="text-sm text-gray-500 mb-2">{tournament.date} | {tournament.location}</p>
                    <p className="text-gray-700 text-base leading-relaxed">{tournament.description}</p>
                </div>
                <div className="space-y-4">
                    <input
                        type="text"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        placeholder="Team Name"
                        className="w-full border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100 p-3 rounded-lg outline-none"
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
                    <h4 className="text-xl font-semibold text-gray-700 mt-6 mb-2">Player Details</h4>
                    <div className="max-h-96 overflow-y-auto pr-2">
                        {players.map((player, i) => (
                            <div key={i} className="flex gap-2 mb-3">
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
                                className="w-28 border border-gray-300 p-2 rounded-lg"
                            />
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={handleSubmit}
                        className="bg-yellow-400 hover:bg-yellow-500 transition duration-300 text-black px-4 py-3 rounded-xl font-semibold w-full"
                        >
                        Submit Registration
                    </button>
                </div>
            </div>
        </div>
    </div>
);
};

export default Form;
