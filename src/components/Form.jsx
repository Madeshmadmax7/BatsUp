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
                "http://localhost:8080/api/team/create",
                teamCreatePayload
            );

            const teamId = createdTeam.id;

            await axios.post(
                `http://localhost:8080/api/tournaments/${tournament.id}/add-team/${teamId}`
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
                    "http://localhost:8080/api/player/createNoUser",
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
                                        className="w-full mt-2 py-2 border border-dashed border-gray-400 rounded text-gray-600 hover:bg-gray-200"
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


// import React, { useState } from "react";

// const Form = ({ tournament, onClose, onRegister }) => {
// const [players, setPlayers] = useState([]);
// const [jerseyNumbers, setJerseyNumbers] = useState([]);
// const [teamName, setTeamName] = useState("");
// const [teamPassword, setTeamPassword] = useState(""); // NEW STATE
// const [phone, setPhone] = useState("");
// const [location, setLocation] = useState("");
// const [logo, setLogo] = useState(null);

// const handleAddPlayer = () => {
//     if (players.length < 15) {
//     setPlayers([...players, ""]);
//     setJerseyNumbers([...jerseyNumbers, ""]);
//     }
// };

// const handleDeletePlayer = (index) => {
//     const newPlayers = [...players];
//     const newJerseys = [...jerseyNumbers];
//     newPlayers.splice(index, 1);
//     newJerseys.splice(index, 1);
//     setPlayers(newPlayers);
//     setJerseyNumbers(newJerseys);
// };

// const handleSubmit = () => {
//     if (
//     !teamName ||
//     !teamPassword || // check for password
//     players.some((p) => !p) ||
//     jerseyNumbers.some((j) => !j) ||
//     !phone ||
//     !location ||
//     !logo
//     ) {
//     alert(
//         "Please complete all fields for all players, enter a team password, and upload a team logo."
//     );
//     return;
//     }
//     alert(
//     `Team '${teamName}' successfully registered for ${tournament.title}`
//     );
//     onRegister();
//     onClose();
// };

// return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
//     <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden text-black">
//         <button
//         className="absolute top-4 right-4 text-gray-600 hover:text-black text-xl z-10"
//         onClick={onClose}
//         >
//         &times;
//         </button>

//         <div className="max-h-[95vh] overflow-y-auto p-8">
//         <div className="grid md:grid-cols-2 gap-8">
//             {/* Tournament Info */}
//             <div>
//             <img
//                 src={tournament.image}
//                 alt={tournament.title}
//                 className="w-full h-64 object-cover rounded-xl shadow mb-4"
//             />
//             <h2 className="text-3xl font-bold text-gray-800 mb-2">
//                 {tournament.title}
//             </h2>
//             <p className="text-sm text-gray-500 mb-4">
//                 {tournament.date} | {tournament.location}
//             </p>
//             <p className="text-gray-700 text-sm leading-relaxed">
//                 {tournament.description}
//             </p>
//             </div>

//             {/* Form Fields */}
//             <div className="space-y-4">
//             <input
//                 type="text"
//                 value={teamName}
//                 onChange={(e) => setTeamName(e.target.value)}
//                 placeholder="Team Name"
//                 className="w-full border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:outline-none p-3 rounded-lg"
//             />

//             {/* NEW FIELD: Team Password */}
//             <input
//                 type="password"
//                 value={teamPassword}
//                 onChange={(e) => setTeamPassword(e.target.value)}
//                 placeholder="Team Password"
//                 className="w-full border border-gray-300 p-3 rounded-lg"
//             />

//             <input
//                 type="text"
//                 value={phone}
//                 onChange={(e) => setPhone(e.target.value)}
//                 placeholder="Contact Number"
//                 className="w-full border border-gray-300 p-3 rounded-lg"
//             />
//             <input
//                 type="text"
//                 value={location}
//                 onChange={(e) => setLocation(e.target.value)}
//                 placeholder="Team Location"
//                 className="w-full border border-gray-300 p-3 rounded-lg"
//             />
//             <input
//                 type="file"
//                 accept="image/*"
//                 onChange={(e) => setLogo(e.target.files[0])}
//                 className="w-full border border-gray-300 p-3 rounded-lg bg-white"
//             />
//             <p className="text-sm text-gray-500 italic">
//                 Upload your team logo (image file)
//             </p>

//             {/* Player List */}
//             <h4 className="text-lg font-semibold text-gray-700 mt-6">
//                 Player Details
//             </h4>
//             <div className="max-h-80 overflow-y-auto pr-1 space-y-2">
//                 {players.map((player, i) => (
//                 <div key={i} className="flex gap-2 items-center">
//                     <input
//                     type="text"
//                     value={player}
//                     onChange={(e) => {
//                         const newPlayers = [...players];
//                         newPlayers[i] = e.target.value;
//                         setPlayers(newPlayers);
//                     }}
//                     placeholder={`Player ${i + 1} Name`}
//                     className="flex-1 border border-gray-300 p-2 rounded-lg"
//                     />
//                     <input
//                     type="number"
//                     value={jerseyNumbers[i]}
//                     onChange={(e) => {
//                         const newJerseys = [...jerseyNumbers];
//                         newJerseys[i] = e.target.value;
//                         setJerseyNumbers(newJerseys);
//                     }}
//                     placeholder="Jersey No."
//                     className="w-24 border border-gray-300 p-2 rounded-lg"
//                     />
//                     <button
//                     onClick={() => handleDeletePlayer(i)}
//                     className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-lg"
//                     >
//                     ✕
//                     </button>
//                 </div>
//                 ))}
//                 {players.length < 15 && (
//                 <button
//                     onClick={handleAddPlayer}
//                     className="w-full border border-dashed border-gray-400 text-gray-600 py-2 rounded-lg hover:bg-gray-100"
//                 >
//                     + Add Player
//                 </button>
//                 )}
//             </div>

//             <button
//                 onClick={handleSubmit}
//                 className="w-full bg-yellow-400 hover:bg-yellow-500 transition duration-300 text-black px-4 py-3 rounded-xl font-semibold mt-4"
//             >
//                 Submit Registration
//             </button>
//             </div>
//         </div>
//         </div>
//     </div>
//     </div>
// );
// };

// export default Form;
