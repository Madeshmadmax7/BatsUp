import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Img from "../assets/logo-black.png";

function Login() {
const [isRegister, setIsRegister] = useState(false);
const [role, setRole] = useState("");
const [teamAction, setTeamAction] = useState("");
const [teamName, setTeamName] = useState("");
const [teamPassword, setTeamPassword] = useState("");
const [showPlayerDetails, setShowPlayerDetails] = useState(false);
const navigate = useNavigate();

useEffect(() => {
    if (teamAction === "join") {
    setShowPlayerDetails(false);
    const t = setTimeout(() => setShowPlayerDetails(true), 360);
    return () => clearTimeout(t);
    } else {
    setShowPlayerDetails(false);
    }
}, [teamAction]);

const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
    email: e.target.email?.value ?? "",
    password: e.target.password?.value ?? "",
    role: isRegister ? role : undefined,
    ...(role === "PLAYER" && {
        teamAction,
        teamName,
        teamPassword,
    }),
    };
    console.log("Form data:", data);
    if (teamAction === "join") {
    alert("Join Team submitted (UI only). See console for data.");
    } else if (isRegister) {
    alert("Register submitted (UI only). See console for data.");
    } else {
    alert("Login submitted (UI only). See console for data.");
    }
};

// Only "join" triggers slide out and wide form, "register" ('Register Tournament') does not
const leftPanelWidth =
    teamAction === "join" ? "w-1/4" : "w-1/2";
const rightPanelClass =
    teamAction === "join"
    ? "w-full md:w-3/4 rounded-none"
    : "w-full md:w-1/2 rounded-l-4xl";

return (
    <div className="flex min-h-screen bg-[#FFF7E9] overflow-hidden transition-all duration-500 ease-in-out">
    <div
        className={`bg-[#FFF7E9] items-center justify-center p-8 transition-all duration-500 ease-in-out ${leftPanelWidth} hidden md:flex`}
    >
        <div className="text-center">
        <img src={Img} alt="BatsUp Illustration" className="w-64 mx-auto" />
        <h2 className="text-xl font-bold text-[#7B1E7A] mt-4">
            Turn your cricket ideas into reality.
        </h2>
        <p className="text-black mt-2 text-sm">
            Start for free and get attractive offers from the community
        </p>
        </div>
    </div>

    {/* Right side form */}
    <div
        className={`flex flex-col justify-center items-center bg-white p-6 shadow-lg mt-[72px] md:mt-0 transition-all duration-500 ease-in-out ${rightPanelClass}`}
    >
        <div
        className={`w-full ${
            teamAction === "join" ? "max-w-4xl" : "max-w-xs"
        }`}
        >
        {/* Header */}
        <div className="mb-2">
            <h2 className="text-xl font-bold text-[#7B1E7A] mb-1">
            {isRegister ? "Create Your Account" : "Login to your Account"}
            </h2>
            <p className="text-xs text-black mb-3">
            {isRegister
                ? "Join the cricket community today"
                : "See what’s going on with your cricket team"}
            </p>

            {/* Top actions when registering as PLAYER */}
            {isRegister && role === "PLAYER" && (
            <div className="flex gap-2 mb-3">
                {/* Register Tournament now does NOT trigger slide out ("register" action has no effect on width) */}
                <button
                type="button"
                onClick={() => {
                    setTeamAction("register");
                    setTimeout(() => navigate("/tournaments"), 400);
                }}
                className={`flex-1 border rounded-lg py-1.5 text-sm ${
                    teamAction === "register"
                    ? "bg-green-600 text-white"
                    : "bg-white border-gray-300 text-black"
                }`}
                >
                Register Tournament
                </button>

                <button
                type="button"
                onClick={() => {
                    setTeamAction("join");
                }}
                className={`flex-1 border rounded-lg py-1.5 text-sm ${
                    teamAction === "join"
                    ? "bg-blue-600 text-white"
                    : "bg-white border-gray-300 text-black"
                }`}
                >
                Join Team
                </button>
            </div>
            )}
        </div>

        {/* Google / separator */}
        {!isRegister && (
            <>
            <button className="w-full text-black flex items-center justify-center border border-gray-300 rounded-lg py-1.5 mb-3 hover:bg-gray-100 transition text-sm">
                <img
                src="/google-icon.svg"
                alt="Google"
                className="w-4 h-4 mr-2"
                />
                Continue with Google
            </button>
            <div className="flex items-center my-3">
                <hr className="flex-grow border-t border-gray-300" />
                <span className="mx-2 text-black text-xs">
                or Sign in with Email
                </span>
                <hr className="flex-grow border-t border-gray-300" />
            </div>
            </>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
            {teamAction !== "join" && (
            <>
                <label className="block mb-1 text-xs text-black">Email</label>
                <input
                name="email"
                type="email"
                required
                className="w-full border text-black border-gray-300 rounded-lg px-2 py-1.5 mb-3 focus:outline-none focus:ring-2 focus:ring-[#7B1E7A] text-sm"
                />

                <label className="block mb-1 text-xs text-black">Password</label>
                <input
                name="password"
                type="password"
                required
                className="w-full border text-black border-gray-300 rounded-lg px-2 py-1.5 mb-4 focus:outline-none focus:ring-2 focus:ring-[#7B1E7A] text-sm"
                />

                {isRegister && (
                <>
                    <label className="block mb-1 text-xs text-black">
                    Confirm Password
                    </label>
                    <input
                    type="password"
                    required
                    className="w-full border text-black border-gray-300 rounded-lg px-2 py-1.5 mb-3 focus:outline-none focus:ring-2 focus:ring-[#7B1E7A] text-sm"
                    />

                    <label className="block mb-1 text-xs text-black">Role</label>
                    <div className="relative mb-3">
                    <select
                        value={role}
                        onChange={(e) => {
                        setRole(e.target.value);
                        setTeamAction("");
                        }}
                        className="w-full appearance-none border text-black border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7B1E7A] text-sm bg-white"
                    >
                        <option value="">-- Select Role --</option>
                        <option value="PLAYER">Player</option>
                        <option value="FAN">Fan</option>
                    </select>
                    <svg
                        className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                        />
                    </svg>
                    </div>
                </>
                )}
            </>
            )}

            {teamAction === "join" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 transition-all duration-500">
                {/* Left column */}
                <div>
                <label className="block mb-1 text-xs text-black">Email</label>
                <input
                    name="email"
                    type="email"
                    required
                    className="w-full border text-black border-gray-300 rounded-lg px-2 py-1.5 mb-3 text-sm"
                />

                <label className="block mb-1 text-xs text-black">
                    Password
                </label>
                <input
                    name="password"
                    type="password"
                    required
                    className="w-full border text-black border-gray-300 rounded-lg px-2 py-1.5 mb-3 text-sm"
                />

                <div className="flex items-center mb-3">
                    <input type="checkbox" id="remember" className="mr-2" />
                    <label
                    htmlFor="remember"
                    className="text-xs text-black"
                    >
                    Remember Me
                    </label>
                </div>

                <div className="mt-2">
                    <button
                    type="button"
                    onClick={() => {
                        alert(
                        "Login (UI only). Proceed to fill player details on the right."
                        );
                    }}
                    className="w-full bg-[#7B1E7A] text-white rounded-lg py-2 hover:bg-[#5e145e] transition text-sm"
                    >
                    Continue
                    </button>
                </div>
                </div>

                {/* Right column */}
                <div
                className={`transition-opacity duration-400 ${
                    showPlayerDetails ? "opacity-100" : "opacity-0"
                }`}
                aria-hidden={!showPlayerDetails}
                >
                <label className="block mb-1 text-xs text-black">
                    Player Name
                </label>
                <input
                    type="text"
                    className="w-full border text-black border-gray-300 rounded-lg px-2 py-1.5 mb-3 text-sm"
                    placeholder="Your full name"
                />

                <label className="block mb-1 text-xs text-black">
                    Player Type
                </label>
                <select className="w-full border text-black border-gray-300 rounded-lg px-2 py-1.5 mb-3 text-sm">
                    <option value="">Select Type</option>
                    <option>Batsman</option>
                    <option>Bowler</option>
                    <option>All-Rounder</option>
                    <option>Wicket Keeper</option>
                </select>

                <label className="block mb-1 text-xs text-black">
                    Jersey Number
                </label>
                <input
                    type="number"
                    className="w-full border text-black border-gray-300 rounded-lg px-2 py-1.5 mb-3 text-sm"
                    placeholder="e.g. 10"
                />

                <label className="block mb-1 text-xs text-black">
                    Team Name
                </label>
                <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="w-full border text-black border-gray-300 rounded-lg px-2 py-1.5 mb-3 text-sm"
                    placeholder="Team you want to join"
                />

                <label className="block mb-1 text-xs text-black">
                    Team Password
                </label>
                <input
                    type="password"
                    value={teamPassword}
                    onChange={(e) => setTeamPassword(e.target.value)}
                    className="w-full border text-black border-gray-300 rounded-lg px-2 py-1.5 mb-4 text-sm"
                    placeholder="Enter team password"
                />

                <div className="flex gap-2">
                    <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 transition text-sm"
                    >
                    Join Team
                    </button>
                    <button
                    type="button"
                    onClick={() => {
                        setTeamAction("");
                        setShowPlayerDetails(false);
                        setTeamName("");
                        setTeamPassword("");
                    }}
                    className="flex-1 bg-gray-200 text-black rounded-lg py-2 hover:bg-gray-300 transition text-sm"
                    >
                    Cancel
                    </button>
                </div>
                </div>
            </div>
            )}

            {teamAction !== "join" && (
            <div className="mt-4">
                <button
                type="submit"
                className="w-full bg-[#7B1E7A] text-white rounded-lg py-1.5 hover:bg-[#5e145e] transition text-sm"
                >
                {isRegister ? "Register" : "Login"}
                </button>
            </div>
            )}
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-black mt-4">
            {isRegister ? (
            <>
                Already have an account?{" "}
                <button
                type="button"
                onClick={() => {
                    setIsRegister(false);
                    setTeamAction("");
                }}
                className="text-[#7B1E7A] font-medium hover:underline"
                >
                Login
                </button>
            </>
            ) : (
            <>
                Not Registered Yet?{" "}
                <button
                type="button"
                onClick={() => {
                    setIsRegister(true);
                    setTeamAction("");
                }}
                className="text-[#7B1E7A] font-medium hover:underline"
                >
                Create an account
                </button>
            </>
            )}
        </p>
        </div>
    </div>
    </div>
);
}

export default Login;
