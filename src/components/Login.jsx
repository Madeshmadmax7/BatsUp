import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import Img from "../assets/logo-black.png";

const LoginRegister = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [role, setSelectedRole] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [errors, setErrors] = useState({ email: "", password: "", teamName: "", teamPassword: "" });

    const { setUser } = useAuth();
    const navigate = useNavigate();

    // Player fields
    const [playerData, setPlayerData] = useState({
        playerName: "",
        playerCity: "",
        phone: "",
        playerType: "",
        teamName: "",
        teamPassword: "",
    });

    // Fan fields
    const [fanData, setFanData] = useState({
        favoritePlayer: "",
        region: "",
    });

    // --- Validation Helpers ---
    const validateEmail = (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    };

    const validatePassword = (value) => {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
        return passwordRegex.test(value);
    };

    const validateForm = () => {
        let valid = true;
        let newErrors = { email: "", password: "", teamName: "", teamPassword: "" };

        if (!validateEmail(email)) {
            newErrors.email = "Invalid email format";
            valid = false;
        }
        if (!validatePassword(password)) {
            newErrors.password =
                "Password must be at least 6 characters and contain letters & numbers";
            valid = false;
        }

        if (isRegister && role === "PLAYER") {
            if (!playerData.teamName.trim()) {
                newErrors.teamName = "Team Name is required";
                valid = false;
            }
            if (!playerData.teamPassword.trim()) {
                newErrors.teamPassword = "Team Password is required";
                valid = false;
            }
        }

        setErrors(newErrors);
        return valid;
    };

    // --- API Helpers ---
    const registerPlayer = async (userId) => {
        const response = await fetch(`https://batsup-v1-oauz.onrender.com/api/player/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId,
                nickname: playerData.playerName,
                city: playerData.playerCity,
                phone: playerData.phone,
                playerType: playerData.playerType,
                teamName: playerData.teamName,
                teamPassword: playerData.teamPassword,
            }),
        });
        if (!response.ok) throw new Error("Player registration failed");
        return await response.json();
    };

    const registerFan = async (userId) => {
        const response = await fetch(
            `https://batsup-v1-oauz.onrender.com/api/fan/create?userId=${userId}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    favoritePlayer: fanData.favoritePlayer,
                    region: fanData.region,
                }),
            }
        );
        if (!response.ok) throw new Error("Fan registration failed");
        return await response.json();
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            // For PLAYER role: do not proceed if teamName or teamPassword missing
            if (role === "PLAYER") {
                if (!playerData.teamName.trim() || !playerData.teamPassword.trim()) {
                    alert("Team Name and Team Password are mandatory for Player registration.");
                    return;
                }
            }

            const userResponse = await fetch("https://batsup-v1-oauz.onrender.com/api/user/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    password,
                    firstName: role === "PLAYER" ? playerData.playerName : fanData.favoritePlayer,
                    lastName: "",
                    roles: [role],
                }),
            });

            if (!userResponse.ok) {
                const errText = await userResponse.text();
                throw new Error("User registration failed: " + errText);
            }
            const userJson = await userResponse.json();

            if (role === "PLAYER") await registerPlayer(userJson.id);
            if (role === "FAN") await registerFan(userJson.id);

            alert("Registration successful!");
            setIsRegister(false);
        } catch (err) {
            alert("Registration failed: " + err.message);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const response = await fetch("https://batsup-v1-oauz.onrender.com/api/user/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) throw new Error("Login failed");
            const userJson = await response.json();
            const userRole = userJson.roles?.[0] || "USER";

            setUser((prev) => ({ ...prev, id: userJson.id, role: userRole }));

            if (userRole === "PLAYER") {
                const playerRes = await fetch(
                    `https://batsup-v1-oauz.onrender.com/api/player/by-user/${userJson.id}`
                );
                if (playerRes.ok) {
                    const player = await playerRes.json();
                    setUser((prev) => ({ ...prev, playerId: player.id }));
                }
            }

            if (userRole === "FAN") {
                const fanRes = await fetch(
                    `https://batsup-v1-oauz.onrender.com/api/fan/by-user/${userJson.id}`
                );
                if (fanRes.ok) {
                    const fan = await fanRes.json();
                    setUser((prev) => ({ ...prev, fanId: fan.id }));
                }
            }

            if (userRole === "ADMIN") navigate("/admin/tournament-list");
            else navigate("/newsletter");
        } catch (err) {
            alert("Login failed: " + err.message);
        }
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-[#FFF7E9] overflow-hidden">
            {/* Left Panel */}
            <div className="hidden md:flex w-1/2 bg-[#FFF7E9] items-center justify-center p-8">
                <div className="text-center">
                    <img src={Img} alt="BatsUp" className="w-64 mx-auto" />
                    <h2 className="text-xl font-bold text-[#7B1E7A] mt-4">
                        Turn your cricket ideas into reality.
                    </h2>
                    <p className="text-black mt-2 text-sm">
                        Start for free and get attractive offers from the community
                    </p>
                </div>
            </div>

            {/* Right Panel */}
            <div className="flex flex-col justify-center items-center bg-white p-6 shadow-lg w-full md:w-1/2">
                <div className="w-full max-w-sm">
                    {/* Header */}
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-[#7B1E7A] mb-1">
                            {isRegister ? "Create Your Account" : "Login to your Account"}
                        </h2>
                        <p className="text-xs text-black">
                            {isRegister
                                ? "Join the cricket community today"
                                : "See what’s going on with your cricket team"}
                        </p>
                    </div>

                    {/* Toggle */}
                    <div className="flex justify-center gap-3 mb-6">
                        <button
                            onClick={() => setIsRegister(false)}
                            className={`px-5 py-2 rounded-lg text-sm font-medium ${!isRegister
                                    ? "bg-[#7B1E7A] text-white shadow"
                                    : "bg-gray-100 text-gray-600"
                                }`}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => setIsRegister(true)}
                            className={`px-5 py-2 rounded-lg text-sm font-medium ${isRegister
                                    ? "bg-[#7B1E7A] text-white shadow"
                                    : "bg-gray-100 text-gray-600"
                                }`}
                        >
                            Register
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={isRegister ? handleRegister : handleLogin} className="space-y-3">
                        <div>
                            <label className="block mb-1 text-xs text-black">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Your email"
                                className="w-full border text-black border-gray-300 rounded-lg px-3 py-2 text-sm"
                                required
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label className="block mb-1 text-xs text-black">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Your password"
                                className="w-full border text-black border-gray-300 rounded-lg px-3 py-2 text-sm"
                                required
                            />
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                            )}
                        </div>

                        {/* Role & Extra Fields */}
                        {isRegister && (
                            <>
                                <div>
                                    <label className="block mb-1 text-xs text-black">Role</label>
                                    <select
                                        value={role}
                                        onChange={(e) => setSelectedRole(e.target.value)}
                                        className="w-full border text-black border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
                                        required
                                    >
                                        <option value="">-- Select Role --</option>
                                        <option value="PLAYER">Player</option>
                                        <option value="FAN">Fan</option>
                                    </select>
                                    {errors.teamName && (
                                        <p className="text-red-500 text-xs mt-1">{errors.teamName}</p>
                                    )}
                                    {errors.teamPassword && (
                                        <p className="text-red-500 text-xs mt-1">{errors.teamPassword}</p>
                                    )}
                                </div>

                                {role === "PLAYER" && (
                                    <div className="space-y-2">
                                        {[
                                            { key: "playerName", label: "Player Name" },
                                            { key: "playerCity", label: "City" },
                                            { key: "phone", label: "Phone" },
                                            { key: "playerType", label: "Player Type" },
                                            { key: "teamName", label: "Team Name" },
                                        ].map((field) => (
                                            <div key={field.key}>
                                                <label className="block mb-1 text-xs text-black">
                                                    {field.label}
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder={field.label}
                                                    value={playerData[field.key]}
                                                    onChange={(e) =>
                                                        setPlayerData({
                                                            ...playerData,
                                                            [field.key]: e.target.value,
                                                        })
                                                    }
                                                    className="w-full border text-black border-gray-300 rounded-lg px-3 py-2 text-sm"
                                                />
                                            </div>
                                        ))}
                                        <div>
                                            <label className="block mb-1 text-xs text-black">
                                                Team Password
                                            </label>
                                            <input
                                                type="password"
                                                placeholder="Team Password"
                                                value={playerData.teamPassword}
                                                onChange={(e) =>
                                                    setPlayerData({
                                                        ...playerData,
                                                        teamPassword: e.target.value,
                                                    })
                                                }
                                                className="w-full border text-black border-gray-300 rounded-lg px-3 py-2 text-sm"
                                            />
                                        </div>
                                    </div>
                                )}

                                {role === "FAN" && (
                                    <div className="space-y-2">
                                        <div>
                                            <label className="block mb-1 text-xs text-black">
                                                Favorite Player
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Favorite Player"
                                                value={fanData.favoritePlayer}
                                                onChange={(e) =>
                                                    setFanData({
                                                        ...fanData,
                                                        favoritePlayer: e.target.value,
                                                    })
                                                }
                                                className="w-full border text-black border-gray-300 rounded-lg px-3 py-2 text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1 text-xs text-black">Region</label>
                                            <input
                                                type="text"
                                                placeholder="Region"
                                                value={fanData.region}
                                                onChange={(e) =>
                                                    setFanData({ ...fanData, region: e.target.value })
                                                }
                                                className="w-full border text-black border-gray-300 rounded-lg px-3 py-2 text-sm"
                                            />
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-[#7B1E7A] text-white rounded-lg py-2 hover:bg-[#5e145e] text-sm"
                        >
                            {isRegister ? "Register" : "Login"}
                        </button>
                    </form>

                    {/* Footer */}
                    <p className="text-center text-xs text-black mt-4">
                        {isRegister ? (
                            <>
                                Already have an account?{" "}
                                <button
                                    type="button"
                                    onClick={() => setIsRegister(false)}
                                    className="text-[#7B1E7A] hover:underline"
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
                                    className="text-[#7B1E7A] hover:underline"
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
};

export default LoginRegister;
