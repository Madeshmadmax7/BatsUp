import { useState } from "react";
import Img from '../assets/logo-black.png';

function Login() {
    const [isRegister, setIsRegister] = useState(false);
    const [role, setRole] = useState("");
    const [teamAction, setTeamAction] = useState("");
    const [teamName, setTeamName] = useState("");
    const [teamPassword, setTeamPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = {
            email: e.target.email.value,
            password: e.target.password.value,
            role: isRegister ? role : undefined,
            ...(role === "PLAYER" && {
                teamAction,
                teamName,
                teamPassword
            })
        };
        console.log("Form data:", data);
    };

    return (
        <div className="flex min-h-screen bg-[#FFF7E9]">
            <div className="hidden md:flex w-1/2 bg-[#FFF7E9] items-center justify-center p-8">
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

            <div className="flex flex-col justify-center items-center w-full md:w-1/2 rounded-l-4xl bg-white p-6 shadow-lg mt-[72px] md:mt-0">
                <div className="w-full max-w-xs">
                    <h2 className="text-xl font-bold text-[#7B1E7A] mb-1">
                        {isRegister ? "Create Your Account" : "Login to your Account"}
                    </h2>
                    <p className="text-xs text-black mb-4">
                        {isRegister
                            ? "Join the cricket community today"
                            : "See what’s going on with your cricket team"}
                    </p>

                    {!isRegister && (
                        <button className="w-full text-black flex items-center justify-center border border-gray-300 rounded-lg py-1.5 mb-3 hover:bg-gray-100 transition text-sm">
                            <img
                                src="/google-icon.svg"
                                alt="Google"
                                className="w-4 h-4 mr-2"
                            />
                            Continue with Google
                        </button>
                    )}

                    {!isRegister && (
                        <div className="flex items-center my-3">
                            <hr className="flex-grow border-t border-gray-300" />
                            <span className="mx-2 text-black text-xs">or Sign in with Email</span>
                            <hr className="flex-grow border-t border-gray-300" />
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <label className="block mb-1 text-xs text-black">Email</label>
                        <input
                            name="email"
                            type="email"
                            className="w-full border text-black border-gray-300 rounded-lg px-2 py-1.5 mb-3 focus:outline-none focus:ring-2 focus:ring-[#7B1E7A] text-sm"
                        />

                        <label className="block mb-1 text-xs text-black">Password</label>
                        <input
                            name="password"
                            type="password"
                            className="w-full border text-black border-gray-300 rounded-lg px-2 py-1.5 mb-3 focus:outline-none focus:ring-2 focus:ring-[#7B1E7A] text-sm"
                        />

                        {isRegister && (
                            <>
                                <label className="block mb-1 text-xs text-black">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    className="w-full border text-black border-gray-300 rounded-lg px-2 py-1.5 mb-3 focus:outline-none focus:ring-2 focus:ring-[#7B1E7A] text-sm"
                                />

                                <label className="block mb-1 text-xs text-black">Role</label>
                                <div className="relative">
                                    <select
                                        value={role}
                                        onChange={(e) => {
                                            setRole(e.target.value);
                                            setTeamAction("");
                                        }}
                                        className="w-full appearance-none border text-black border-gray-300 rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-[#7B1E7A] text-sm bg-white"
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
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>

                                {role === "PLAYER" && (
                                    <>
                                        {/* Team Action Buttons */}
                                        <div className="flex gap-2 mb-3">
                                            <button
                                                type="button"
                                                onClick={() => setTeamAction("create")}
                                                className={`flex-1 border rounded-lg py-1.5 text-sm ${teamAction === "create"
                                                    ? "bg-[#7B1E7A] text-white"
                                                    : "bg-white border-gray-300 text-black"
                                                    }`}
                                            >
                                                Create Team
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setTeamAction("join")}
                                                className={`flex-1 border rounded-lg py-1.5 text-sm ${teamAction === "join"
                                                    ? "bg-[#7B1E7A] text-white"
                                                    : "bg-white border-gray-300 text-black"
                                                    }`}
                                            >
                                                Join Team
                                            </button>
                                        </div>

                                        {/* Team Inputs */}
                                        {teamAction && (
                                            <>
                                                <label className="block mb-1 text-xs text-black">Team Name</label>
                                                <input
                                                    type="text"
                                                    value={teamName}
                                                    onChange={(e) => setTeamName(e.target.value)}
                                                    className="w-full border text-black border-gray-300 rounded-lg px-2 py-1.5 mb-3 focus:outline-none focus:ring-2 focus:ring-[#7B1E7A] text-sm"
                                                />

                                                <label className="block mb-1 text-xs text-black">Team Password</label>
                                                <input
                                                    type="password"
                                                    value={teamPassword}
                                                    onChange={(e) => setTeamPassword(e.target.value)}
                                                    className="w-full border text-black border-gray-300 rounded-lg px-2 py-1.5 mb-3 focus:outline-none focus:ring-2 focus:ring-[#7B1E7A] text-sm"
                                                />
                                            </>
                                        )}
                                    </>
                                )}
                            </>
                        )}

                        <div className="flex justify-between items-center mb-4">
                            {!isRegister && (
                                <label className="flex items-center text-xs text-black">
                                    <input type="checkbox" className="mr-1" />
                                    Remember Me
                                </label>
                            )}
                            {!isRegister && (
                                <a
                                    href="#"
                                    className="text-xs text-[#7B1E7A] hover:underline"
                                >
                                    Forgot Password?
                                </a>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#7B1E7A] text-white rounded-lg py-1.5 hover:bg-[#5e145e] transition text-sm"
                        >
                            {isRegister ? "Register" : "Login"}
                        </button>
                    </form>

                    <p className="text-center text-xs text-black mt-4">
                        {isRegister ? (
                            <>
                                Already have an account?{" "}
                                <button
                                    type="button"
                                    onClick={() => setIsRegister(false)}
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
                                    onClick={() => setIsRegister(true)}
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
