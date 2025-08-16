// Updated Login Component with integration for role management and player/team join details

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Img from "../assets/logo-black.png";
import { useAuth } from '../AuthContext';

// Player Details form component
function PlayerDetailsForm({
    playerName, setPlayerName,
    playerCity, setPlayerCity,
    phone, setPhone,
    playedIn, setPlayedIn,
    playerType, setPlayerType,
    lastPlayedFor, setLastPlayedFor,
    teamName, setTeamName,
    teamPassword, setTeamPassword
}) {
    return (
        <>
            <label className="block mb-1 text-xs text-black">Player Name</label>
            <input type="text" value={playerName} onChange={e => setPlayerName(e.target.value)}
                className="w-full border text-black border-gray-300 rounded-lg px-2 py-1.5 mb-3 text-sm" placeholder="Your full name" />

            <label className="block mb-1 text-xs text-black">Player City</label>
            <input type="text" value={playerCity} onChange={e => setPlayerCity(e.target.value)}
                className="w-full border text-black border-gray-300 rounded-lg px-2 py-1.5 mb-3 text-sm" placeholder="City" />

            <label className="block mb-1 text-xs text-black">Phone</label>
            <input type="text" value={phone} onChange={e => setPhone(e.target.value)}
                className="w-full border text-black border-gray-300 rounded-lg px-2 py-1.5 mb-3 text-sm" placeholder="Phone number" />

            <label className="block mb-1 text-xs text-black">Played In</label>
            <input type="text" value={playedIn} onChange={e => setPlayedIn(e.target.value)}
                className="w-full border text-black border-gray-300 rounded-lg px-2 py-1.5 mb-3 text-sm" placeholder="Played in" />

            <label className="block mb-1 text-xs text-black">Player Type</label>
            <select value={playerType} onChange={e => setPlayerType(e.target.value)}
                className="w-full border text-black border-gray-300 rounded-lg px-2 py-1.5 mb-3 text-sm">
                <option value="">Select Type</option>
                <option value="Batsman">Batsman</option>
                <option value="Bowler">Bowler</option>
                <option value="All-Rounder">All-Rounder</option>
                <option value="Wicket Keeper">Wicket Keeper</option>
            </select>

            <label className="block mb-1 text-xs text-black">Last Played For</label>
            <input type="text" value={lastPlayedFor} onChange={e => setLastPlayedFor(e.target.value)}
                className="w-full border text-black border-gray-300 rounded-lg px-2 py-1.5 mb-3 text-sm" placeholder="Last played for" />

            <label className="block mb-1 text-xs text-black">Team Name</label>
            <input type="text" value={teamName} onChange={e => setTeamName(e.target.value)}
                className="w-full border text-black border-gray-300 rounded-lg px-2 py-1.5 mb-3 text-sm" placeholder="Team you want to join/register" />

            <label className="block mb-1 text-xs text-black">Team Password</label>
            <input type="password" value={teamPassword} onChange={e => setTeamPassword(e.target.value)}
                className="w-full border text-black border-gray-300 rounded-lg px-2 py-1.5 mb-4 text-sm" placeholder="Enter team password" />
        </>
    );
}

// Main Login Component
function Login() {
    const { role: authRole, setRole } = useAuth();

    const [isRegister, setIsRegister] = useState(false);
    const [role, setLocalRole] = useState("");
    const [teamAction, setTeamAction] = useState("");

    const [showPlayerDetails, setShowPlayerDetails] = useState(false);

    // Player-related states
    const [playerName, setPlayerName] = useState("");
    const [playerCity, setPlayerCity] = useState("");
    const [phone, setPhone] = useState("");
    const [playedIn, setPlayedIn] = useState("");
    const [playerType, setPlayerType] = useState("");
    const [lastPlayedFor, setLastPlayedFor] = useState("");
    const [teamName, setTeamName] = useState("");
    const [teamPassword, setTeamPassword] = useState("");

    const navigate = useNavigate();

    // Toggle player details form when "join" selected
    useEffect(() => {
        if (teamAction === "join") {
            setShowPlayerDetails(false);
            const timeout = setTimeout(() => setShowPlayerDetails(true), 360);
            return () => clearTimeout(timeout);
        } else {
            setShowPlayerDetails(false);
        }
    }, [teamAction]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = {
            email: e.target.email.value,
            password: e.target.password.value,
            ...(isRegister && { role }),
            ...(role === 'PLAYER' || teamAction === 'join' ? {
                playerName,
                playerCity,
                phone,
                playedIn,
                playerType,
                lastPlayedFor,
                teamName,
                teamPassword,
            } : {}),
        };

        console.log("Form data:", data);

        if (isRegister || (!isRegister && data.role)) {
            setRole(data.role || null);
            alert(`${isRegister ? "Registration" : teamAction === "join" ? "Join Team" : "Login"} submitted.`);
            if (!isRegister) navigate("/"); // Navigate post login (adjust as needed)
            if (isRegister) navigate("/tournaments"); // Navigate post register
        } else {
            alert("Please select a role");
        }
    };

    const showLeftPanel = !(teamAction || isRegister);
    const leftPanelClass = showLeftPanel ? "w-1/2" : "hidden";
    const rightPanelClass = showLeftPanel ? "w-1/2" : "w-full";

    return (
        <div className={`flex min-h-screen bg-[#FFF7E9] overflow-hidden transition-all duration-500 ease-in-out`}>
            {/* Left Panel */}
            <div className={`${leftPanelClass} bg-[#FFF7E9] items-center justify-center p-8 hidden md:flex`}>
                <div className="text-center">
                    <img src={Img} alt="BatsUp" className="w-64 mx-auto" />
                    <h2 className="text-xl font-bold text-[#7B1E7A] mt-4">Turn your cricket ideas into reality.</h2>
                    <p className="text-black mt-2 text-sm">Start for free and get attractive offers from the community</p>
                </div>
            </div>

            {/* Right Panel */}
            <div className={`flex flex-col justify-center items-center bg-white p-6 shadow-lg mt-[72px] md:mt-0 ${rightPanelClass}`}>
                <div className={`w-full ${teamAction ? "max-w-4xl" : "max-w-xs"}`}>
                    <h2 className="text-xl font-bold text-[#7B1E7A] mb-2">
                        {isRegister ? "Create Your Account" : "Login to your Account"}
                    </h2>
                    <p className="text-sm mb-6 text-black">
                        {isRegister ? "Join the community now" : "Manage your team and profile"}
                    </p>

                    {isRegister && (
                        <div className="flex mb-6 gap-4">
                            <button
                                className={`flex-grow py-2 rounded-lg font-semibold text-sm border ${teamAction === 'register' ? 'bg-[#7B1E7A] text-white border-none' : 'border-gray-300 text-gray-700'}`}
                                onClick={() => { setTeamAction('register'); }}
                            >
                                Register Team
                            </button>
                            <button
                                className={`flex-grow py-2 rounded-lg font-semibold text-sm border ${teamAction === 'join' ? 'bg-[#7B1E7A] text-white border-none' : 'border-gray-300 text-gray-700'}`}
                                onClick={() => { setTeamAction('join'); }}
                            >
                                Join Team
                            </button>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {(!teamAction || teamAction === 'register') && (
                            <>
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="Email"
                                    required
                                    className="w-full border border-gray-300 rounded p-2"
                                />
                                <input
                                    name="password"
                                    type="password"
                                    placeholder="Password"
                                    required
                                    className="w-full border border-gray-300 rounded p-2"
                                />
                                {isRegister && (
                                    <>
                                        <input
                                            type="password"
                                            placeholder="Confirm Password"
                                            required
                                            className="w-full border border-gray-300 rounded p-2"
                                        />
                                        <select
                                            value={role}
                                            onChange={e => setLocalRole(e.target.value)}
                                            className="w-full border border-gray-300 rounded p-2"
                                        >
                                            <option value="">Select Role</option>
                                            <option value="PLAYER">Player</option>
                                            <option value="FAN">Fan</option>
                                        </select>
                                    </>
                                )}
                                {role === 'PLAYER' && (
                                    <PlayerDetailsForm
                                        playerName={playerName} setPlayerName={setPlayerName}
                                        playerCity={playerCity} setPlayerCity={setPlayerCity}
                                        phone={phone} setPhone={setPhone}
                                        playedIn={playedIn} setPlayedIn={setPlayedIn}
                                        playerType={playerType} setPlayerType={setPlayerType}
                                        lastPlayedFor={lastPlayedFor} setLastPlayedFor={setLastPlayedFor}
                                        teamName={teamName} setTeamName={setTeamName}
                                        teamPassword={teamPassword} setTeamPassword={setTeamPassword}
                                    />
                                )}
                            </>
                        )}

                        {teamAction === 'join' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <input
                                        name="email"
                                        type="email"
                                        placeholder="Email"
                                        required
                                        className="w-full border border-gray-300 rounded p-2"
                                    />
                                    <input
                                        name="password"
                                        type="password"
                                        placeholder="Password"
                                        required
                                        className="w-full border border-gray-300 rounded p-2 mt-4"
                                    />
                                    <div className="flex items-center mt-2">
                                        <input id="remember" type="checkbox" className="mr-2" />
                                        <label htmlFor="remember">Remember Me</label>
                                    </div>
                                </div>

                                <div className={`${showPlayerDetails ? "opacity-100" : "opacity-0"} transition-opacity`}>
                                    <PlayerDetailsForm
                                        playerName={playerName} setPlayerName={setPlayerName}
                                        playerCity={playerCity} setPlayerCity={setPlayerCity}
                                        phone={phone} setPhone={setPhone}
                                        playedIn={playedIn} setPlayedIn={setPlayedIn}
                                        playerType={playerType} setPlayerType={setPlayerType}
                                        lastPlayedFor={lastPlayedFor} setLastPlayedFor={setLastPlayedFor}
                                        teamName={teamName} setTeamName={setTeamName}
                                        teamPassword={teamPassword} setTeamPassword={setTeamPassword}
                                    />
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full mt-6 bg-[#7B1E7A] text-white rounded py-2 font-semibold"
                        >
                            {isRegister ? "Register" : teamAction === 'join' ? "Join Team" : "Login"}
                        </button>
                    </form>

                    <p className="text-center text-xs mt-4">
                        {isRegister
                            ? <>Already have an account? <button onClick={() => { setIsRegister(false); setTeamAction(''); }} className="text-[#7B1E7A] underline">Login</button></>
                            : <>Don't have an account? <button onClick={() => { setIsRegister(true); setTeamAction(''); }} className="text-[#7B1E7A] underline">Register</button></>
                        }
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;


// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import Img from "../assets/logo-black.png";
// import { useAuth } from '../AuthContext';

// function PlayerDetailsForm({
// playerName, setPlayerName,
// playerCity, setPlayerCity,
// phone, setPhone,
// playedIn, setPlayedIn,
// playerType, setPlayerType,
// lastPlayedFor, setLastPlayedFor,
// teamName, setTeamName,
// teamPassword, setTeamPassword
// }) {
// return (
//     <>
//     <label className="block mb-1 text-xs text-black">Player Name</label>
//     <input type="text" value={playerName} onChange={(e) => setPlayerName(e.target.value)}
//         className="w-full border text-black border-gray-300 rounded-lg px-2 py-1.5 mb-3 text-sm" placeholder="Your full name" />

//     <label className="block mb-1 text-xs text-black">Player City</label>
//     <input type="text" value={playerCity} onChange={(e) => setPlayerCity(e.target.value)}
//         className="w-full border text-black border-gray-300 rounded-lg px-2 py-1.5 mb-3 text-sm" placeholder="City" />

//     <label className="block mb-1 text-xs text-black">Phone</label>
//     <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)}
//         className="w-full border text-black border-gray-300 rounded-lg px-2 py-1.5 mb-3 text-sm" placeholder="Phone number" />

//     <label className="block mb-1 text-xs text-black">Played In</label>
//     <input type="text" value={playedIn} onChange={(e) => setPlayedIn(e.target.value)}
//         className="w-full border text-black border-gray-300 rounded-lg px-2 py-1.5 mb-3 text-sm" placeholder="Played in" />

//     <label className="block mb-1 text-xs text-black">Player Type</label>
//     <select value={playerType} onChange={(e) => setPlayerType(e.target.value)}
//         className="w-full border text-black border-gray-300 rounded-lg px-2 py-1.5 mb-3 text-sm">
//         <option value="">Select Type</option>
//         <option value="Batsman">Batsman</option>
//         <option value="Bowler">Bowler</option>
//         <option value="All-Rounder">All-Rounder</option>
//         <option value="Wicket Keeper">Wicket Keeper</option>
//     </select>

//     <label className="block mb-1 text-xs text-black">Last Played For</label>
//     <input type="text" value={lastPlayedFor} onChange={(e) => setLastPlayedFor(e.target.value)}
//         className="w-full border text-black border-gray-300 rounded-lg px-2 py-1.5 mb-3 text-sm" placeholder="Last played for" />

//     <label className="block mb-1 text-xs text-black">Team Name</label>
//     <input type="text" value={teamName} onChange={(e) => setTeamName(e.target.value)}
//         className="w-full border text-black border-gray-300 rounded-lg px-2 py-1.5 mb-3 text-sm" placeholder="Team you want to join/register" />

//     <label className="block mb-1 text-xs text-black">Team Password</label>
//     <input type="password" value={teamPassword} onChange={(e) => setTeamPassword(e.target.value)}
//         className="w-full border text-black border-gray-300 rounded-lg px-2 py-1.5 mb-4 text-sm" placeholder="Enter team password" />
//     </>
// );
// }

// function Login() {
// const { setRole } = useAuth();

// const [isRegister, setIsRegister] = useState(false);
// const [role, setLocalRole] = useState("");
// const [teamAction, setTeamAction] = useState("");
// const [showPlayerDetails, setShowPlayerDetails] = useState(false);

// // Player fields
// const [playerName, setPlayerName] = useState("");
// const [playerCity, setPlayerCity] = useState("");
// const [phone, setPhone] = useState("");
// const [playedIn, setPlayedIn] = useState("");
// const [playerType, setPlayerType] = useState("");
// const [lastPlayedFor, setLastPlayedFor] = useState("");
// const [teamName, setTeamName] = useState("");
// const [teamPassword, setTeamPassword] = useState("");

// const navigate = useNavigate();

// useEffect(() => {
//     if (teamAction === "join") {
//     setShowPlayerDetails(false);
//     const t = setTimeout(() => setShowPlayerDetails(true), 360);
//     return () => clearTimeout(t);
//     } else {
//     setShowPlayerDetails(false);
//     }
// }, [teamAction]);

// const handleSubmit = (e) => {
//     e.preventDefault();
//     const data = {
//     email: e.target.email?.value ?? "",
//     password: e.target.password?.value ?? "",
//     role: isRegister ? role : undefined,
//     ...(role === "PLAYER" || teamAction === "join") && {
//         playerName,
//         playerCity,
//         phone,
//         playedIn,
//         playerType,
//         lastPlayedFor,
//         teamName,
//         teamPassword,
//     }
//     };
//     console.log("Form data:", data);
//     if (isRegister || (!isRegister && data.role)) {
//     setRole(data.role || null);
//     }
//     alert(`${isRegister ? "Register" : teamAction === "join" ? "Join Team" : "Login"} submitted (UI only). See console.`);
// };

// const showLeftPanel = !(teamAction || isRegister);
// const leftPanelWidth = showLeftPanel ? "w-1/2" : "hidden";
// const rightPanelWidth = showLeftPanel ? "w-full md:w-1/2" : "w-full";

// return (
//     <div className="flex min-h-screen bg-[#FFF7E9] overflow-hidden transition-all duration-500 ease-in-out">
//     {/* Left Panel */}
//     <div className={`${leftPanelWidth} bg-[#FFF7E9] items-center justify-center p-8 hidden md:flex transition-all`}>
//         <div className="text-center">
//         <img src={Img} alt="BatsUp" className="w-64 mx-auto" />
//         <h2 className="text-xl font-bold text-[#7B1E7A] mt-4">Turn your cricket ideas into reality.</h2>
//         <p className="text-black mt-2 text-sm">Start for free and get attractive offers from the community</p>
//         </div>
//     </div>

//     {/* Right Panel */}
//     <div className={`flex flex-col justify-center items-center bg-white p-6 shadow-lg mt-[72px] md:mt-0 ${rightPanelWidth}`}>
//         <div className={`w-full ${teamAction === "join" ? "max-w-4xl" : "max-w-xs"}`}>
        
//         {/* Header */}
//         <div className="mb-2">
//             <h2 className="text-xl font-bold text-[#7B1E7A] mb-1">
//             {isRegister ? "Create Your Account" : "Login to your Account"}
//             </h2>
//             <p className="text-xs text-black mb-3">
//             {isRegister ? "Join the cricket community today" : "See what’s going on with your cricket team"}
//             </p>

//             {/* Role specific buttons */}
//             {isRegister && role === "PLAYER" && (
//             <div className="flex gap-2 mb-3">
//                 <button
//                 type="button"
//                 onClick={() => {
//                     setTeamAction("register");
//                     setTimeout(() => navigate("/tournaments"), 300);
//                 }}
//                 className={`flex-1 border rounded-lg py-1.5 text-sm ${teamAction === "register" ? "bg-[#7B1E7A] text-white" : "border-gray-300 text-black"}`}>
//                 Register Tournament
//                 </button>
//                 <button
//                 type="button"
//                 onClick={() => setTeamAction("join")}
//                 className={`flex-1 border rounded-lg py-1.5 text-sm ${teamAction === "join" ? "bg-[#7B1E7A] text-white" : "border-gray-300 text-black"}`}>
//                 Join Team
//                 </button>
//             </div>
//             )}
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit}>
//             {teamAction !== "join" && (
//             <>
//                 <label className="block mb-1 text-xs text-black">Email</label>
//                 <input name="email" type="email" required
//                 className="w-full border text-black border-gray-300 rounded-lg px-2 py-1.5 mb-3 text-sm" />
//                 <label className="block mb-1 text-xs text-black">Password</label>
//                 <input name="password" type="password" required
//                 className="w-full border text-black border-gray-300 rounded-lg px-2 py-1.5 mb-4 text-sm" />

//                 {isRegister && (
//                 <>
//                     <label className="block mb-1 text-xs text-black">Confirm Password</label>
//                     <input type="password" required
//                     className="w-full border text-black border-gray-300 rounded-lg px-2 py-1.5 mb-3 text-sm" />
//                     <label className="block mb-1 text-xs text-black">Role</label>
//                     <select value={role} onChange={(e) => { setLocalRole(e.target.value); setTeamAction(""); }}
//                     className="w-full border text-black border-gray-300 rounded-lg px-3 py-2 text-sm bg-white mb-3">
//                     <option value="">-- Select Role --</option>
//                     <option value="PLAYER">Player</option>
//                     <option value="FAN">Fan</option>
//                     </select>
//                     {role === "PLAYER" && (
//                     <PlayerDetailsForm
//                         playerName={playerName} setPlayerName={setPlayerName}
//                         playerCity={playerCity} setPlayerCity={setPlayerCity}
//                         phone={phone} setPhone={setPhone}
//                         playedIn={playedIn} setPlayedIn={setPlayedIn}
//                         playerType={playerType} setPlayerType={setPlayerType}
//                         lastPlayedFor={lastPlayedFor} setLastPlayedFor={setLastPlayedFor}
//                         teamName={teamName} setTeamName={setTeamName}
//                         teamPassword={teamPassword} setTeamPassword={setTeamPassword}
//                     />
//                     )}
//                 </>
//                 )}
//             </>
//             )}

//             {teamAction === "join" && (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                 <label className="block mb-1 text-xs text-black">Email</label>
//                 <input name="email" type="email" required
//                     className="w-full border text-black border-gray-300 rounded-lg px-2 py-1.5 mb-3 text-sm" />
//                 <label className="block mb-1 text-xs text-black">Password</label>
//                 <input name="password" type="password" required
//                     className="w-full border text-black border-gray-300 rounded-lg px-2 py-1.5 mb-3 text-sm" />
//                 <div className="flex items-center mb-3">
//                     <input type="checkbox" id="remember" className="mr-2" />
//                     <label htmlFor="remember" className="text-xs text-black">Remember Me</label>
//                 </div>
//                 </div>
//                 {/* Right side player details */}
//                 <div className={`${showPlayerDetails ? "opacity-100" : "opacity-0"} transition-opacity`}>
//                 <PlayerDetailsForm
//                     playerName={playerName} setPlayerName={setPlayerName}
//                     playerCity={playerCity} setPlayerCity={setPlayerCity}
//                     phone={phone} setPhone={setPhone}
//                     playedIn={playedIn} setPlayedIn={setPlayedIn}
//                     playerType={playerType} setPlayerType={setPlayerType}
//                     lastPlayedFor={lastPlayedFor} setLastPlayedFor={setLastPlayedFor}
//                     teamName={teamName} setTeamName={setTeamName}
//                     teamPassword={teamPassword} setTeamPassword={setTeamPassword}
//                 />
//                 </div>
//             </div>
//             )}

//             {teamAction !== "join" && (
//             <div className="mt-4">
//                 <button type="submit"
//                 className="w-full bg-[#7B1E7A] text-white rounded-lg py-1.5 hover:bg-[#5e145e] text-sm">
//                 {isRegister ? "Register" : "Login"}
//                 </button>
//             </div>
//             )}
//         </form>

//         {/* Footer */}
//         <p className="text-center text-xs text-black mt-4">
//             {isRegister ? (
//             <>
//                 Already have an account?{" "}
//                 <button type="button" onClick={() => { setIsRegister(false); setTeamAction(""); }}
//                 className="text-[#7B1E7A] hover:underline">Login</button>
//             </>
//             ) : (
//             <>
//                 Not Registered Yet?{" "}
//                 <button type="button" onClick={() => { setIsRegister(true); setTeamAction(""); }}
//                 className="text-[#7B1E7A] hover:underline">Create an account</button>
//             </>
//             )}
//         </p>
//         </div>
//     </div>
//     </div>
// );
// }

// export default Login;
