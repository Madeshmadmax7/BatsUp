import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Img from "../assets/logo-black.png";
import { useAuth } from '../AuthContext';

// Player details form (used when role === "PLAYER")
function PlayerDetailsForm({ data, setData }) {
  return (
    <>
      <label className="block mb-1 text-xs text-black">Player Name</label>
      <input
        type="text"
        value={data.playerName || ""}
        onChange={e => setData({ ...data, playerName: e.target.value })}
        placeholder="Your full name"
        className="w-full border text-black border-gray-300 rounded-lg px-2 py-1.5 mb-3 text-sm"
      />
      <label className="block mb-1 text-xs text-black">Player City</label>
      <input
        type="text"
        value={data.playerCity || ""}
        onChange={e => setData({ ...data, playerCity: e.target.value })}
        placeholder="City"
        className="w-full border text-black border-gray-300 rounded-lg px-2 py-1.5 mb-3 text-sm"
      />
      <label className="block mb-1 text-xs text-black">Phone</label>
      <input
        type="text"
        value={data.phone || ""}
        onChange={e => setData({ ...data, phone: e.target.value })}
        placeholder="Phone number"
        className="w-full border text-black border-gray-300 rounded-lg px-2 py-1.5 mb-3 text-sm"
      />
      <label className="block mb-1 text-xs text-black">Player Role</label>
      <select
        value={data.playerType || ""}
        onChange={e => setData({ ...data, playerType: e.target.value })}
        className="w-full border text-black border-gray-300 rounded-lg px-2 py-1.5 mb-3 text-sm"
      >
        <option value="">Select Role</option>
        <option value="Batsman">Batsman</option>
        <option value="Bowler">Bowler</option>
        <option value="All-Rounder">All-Rounder</option>
        <option value="Wicket Keeper">Wicket Keeper</option>
      </select>
      <label className="block mb-1 text-xs text-black">Team Name</label>
      <input
        type="text"
        value={data.teamName || ""}
        onChange={e => setData({ ...data, teamName: e.target.value })}
        placeholder="Team you want to join"
        className="w-full border text-black border-gray-300 rounded-lg px-2 py-1.5 mb-3 text-sm"
      />
      <label className="block mb-1 text-xs text-black">Team Password</label>
      <input
        type="password"
        value={data.teamPassword || ""}
        onChange={e => setData({ ...data, teamPassword: e.target.value })}
        placeholder="Team password"
        className="w-full border text-black border-gray-300 rounded-lg px-2 py-1.5 mb-4 text-sm"
      />
    </>
  );
}

// Fan details form (used when role === "FAN")
function FanDetailsForm({ data, setData }) {
  return (
    <>
      <label className="block mb-1 text-xs text-black">Favorite Player Name</label>
      <input
        type="text"
        value={data.favoritePlayer || ""}
        onChange={e => setData({ ...data, favoritePlayer: e.target.value })}
        placeholder="Favorite player's name"
        className="w-full border text-black border-gray-300 rounded-lg px-2 py-1.5 mb-3 text-sm"
      />
      <label className="block mb-1 text-xs text-black">Region</label>
      <input
        type="text"
        value={data.region || ""}
        onChange={e => setData({ ...data, region: e.target.value })}
        placeholder="Your city or state"
        className="w-full border text-black border-gray-300 rounded-lg px-2 py-1.5 mb-3 text-sm"
      />
      {/* Add following if you want team/tournament following at registration */}
      {/* 
      <label className="block mb-1 text-xs text-black">Follow Team IDs (comma separated)</label>
      <input
        type="text"
        value={data.followedTeamIds || ""}
        onChange={e => setData({ ...data, followedTeamIds: e.target.value })}
        placeholder="e.g. 1,3,7"
        className="w-full border text-black border-gray-300 rounded-lg px-2 py-1.5 mb-3 text-sm"
      />
      */}
    </>
  );
}

// Player/Team helpers for player flow
async function findTeamId(teamName, teamPassword) {
  const { data: teams } = await axios.get('http://localhost:8080/api/team/all');
  const team = teams.find(
    t => t.name.toLowerCase() === teamName.toLowerCase() && t.password === teamPassword
  );
  if (!team) throw new Error('Team name or password is incorrect');
  return team.id;
}
async function findPlayerId(playerName, teamId) {
  const { data: players } = await axios.get('http://localhost:8080/api/player/all');
  const player = players.find(
    p => p.nickname.toLowerCase() === playerName.toLowerCase() && p.teamId === teamId
  );
  return player ? player.id : null;
}
async function registerOrUpdatePlayer({
  playerName, email, password, teamName, teamPassword, playerCity, phone, playerType
}) {
  const teamId = await findTeamId(teamName, teamPassword);

  // Register user
  const { data: user } = await axios.post('http://localhost:8080/api/user/register', {
    firstName: playerName,
    email,
    password,
    roles: ['PLAYER']
  }, { params: { password } });
  const userId = user.id;

  // Player Upsert via backend's registerOrUpdatePlayer endpoint (using userId)
  await axios.post('http://localhost:8080/api/player/registerOrUpdate', null, {
    params: {
      userId,
      playerName,
      playerCity,
      phone,
      playerType,
      teamName,
      teamPassword
    }
  });
}

// Fan registration helper
async function registerFan({ favoritePlayer, region, email, password }) {
  // Register user
  const { data: user } = await axios.post('http://localhost:8080/api/user/register', {
    firstName: favoritePlayer,
    email,
    password,
    roles: ['FAN']
  }, { params: { password } });
  const userId = user.id;

  // Register fan and link to user
  await axios.post('http://localhost:8080/api/fan/create', {
    userId,
    favoritePlayer,
    region,
    // Optionally add followedTeamIds and followedTournamentIds fields
  });
}

function Login() {
  const { setRole } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [role, setLocalRole] = useState('');
  const [playerData, setPlayerData] = useState({
    playerName: '', playerCity: '', phone: '', playerType: '', teamName: '', teamPassword: ''
  });
  const [fanData, setFanData] = useState({
    favoritePlayer: '', region: ''
    // Optionally: followedTeamIds: '', followedTournamentIds: ''
  });

  async function handleLogin(e) {
    e.preventDefault();
    setLoginError('');
    try {
      const { data: user } = await axios.post('http://localhost:8080/api/user/login', null, {
        params: { email, password }
      });
      if (user && user.roles) {
        alert(`${user.roles[0]} Login successful!`);
        setRole(user.roles);
        navigate('/tournaments');
      } else {
        setLoginError('Invalid credentials');
      }
    } catch {
      setLoginError('Login failed');
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    if (!role) {
      alert('Please select a role');
      return;
    }
    try {
      if (role === 'PLAYER') {
        await registerOrUpdatePlayer({ ...playerData, email, password });
        alert('Player registration & team join successful!');
        setRole('PLAYER');
        navigate('/tournaments');
      } else if (role === 'FAN') {
        await registerFan({ ...fanData, email, password });
        alert('Fan registration successful!');
        setRole('FAN');
        navigate('/tournaments');
      }
    } catch (e) {
      alert(`Registration failed: ${e.response?.data || e.message || 'Unknown error'}`);
    }
  }

  return (
    <div className="flex min-h-screen bg-[#FFF7E9]">
      <div className="hidden md:flex w-1/2 bg-[#FFF7E9] justify-center items-center">
        <img src={Img} alt="BatsUp" className="w-64" />
        <div className="ml-4 text-center">
          <h2 className="text-xl font-bold text-[#7B1E7A]">Turn your cricket ideas into reality.</h2>
          <p className="text-black mt-2 text-sm">Start free & get offers from community</p>
        </div>
      </div>

      <div className="w-full md:w-1/2 p-8">
        {!isRegister ? (
          <>
            <h2 className="text-2xl font-bold text-[#7B1E7A] mb-5">Login</h2>
            {loginError && <p className="text-red-600 mb-4">{loginError}</p>}
            <form onSubmit={handleLogin} className="space-y-4 max-w-sm">
              <input
                type="email"
                placeholder="Email"
                className="w-full p-2 border border-gray-300 rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full p-2 border border-gray-300 rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button className="w-full py-2 bg-[#7B1E7A] text-white rounded hover:bg-purple-700" type="submit">Login</button>
            </form>
            <p className="mt-4 text-center">
              Don't have an account?{' '}
              <button className="text-[#7B1E7A] underline" onClick={() => setIsRegister(true)}>
                Register here
              </button>
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-[#7B1E7A] mb-5">Register</h2>
            <form onSubmit={handleRegister} className="space-y-4 max-w-sm">
              <input
                type="email"
                placeholder="Email"
                className="w-full p-2 border border-gray-300 rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full p-2 border border-gray-300 rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <select
                value={role}
                onChange={e => setLocalRole(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              >
                <option value="">Select Role</option>
                <option value="PLAYER">Player</option>
                <option value="FAN">Fan</option>
              </select>
              {role === "PLAYER" && (
                <PlayerDetailsForm data={playerData} setData={setPlayerData} />
              )}
              {role === "FAN" && (
                <FanDetailsForm data={fanData} setData={setFanData} />
              )}
              <button className="w-full py-2 bg-[#7B1E7A] text-white rounded hover:bg-purple-700" type="submit">Register</button>
            </form>
            <p className="mt-4 text-center">
              Already have an account?{' '}
              <button className="text-[#7B1E7A] underline" onClick={() => setIsRegister(false)}>
                Login here
              </button>
            </p>
          </>
        )}
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
