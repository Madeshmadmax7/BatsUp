import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../AuthContext";

const DEFAULT_LOGO =
    "https://via.placeholder.com/400x300.png?text=No+Team+Logo"; // fallback image

const TeamsPage = () => {
    const { user, setUser } = useAuth();
    const role = user?.role;

    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [players, setPlayers] = useState([]); // players for modal
    const [fan, setFan] = useState(null);
    const fanId = user?.fanId ?? fan?.id ?? null;

    // Load all teams
    useEffect(() => {
        fetch("https://batsup-v1-oauz.onrender.com/api/team/all")
            .then((res) => res.json())
            .then((data) => setTeams(data))
            .catch(() => setTeams([]));
    }, []);

    // Lock body scroll when modal open
    useEffect(() => {
        document.body.style.overflow = selectedTeam ? "hidden" : "auto";
    }, [selectedTeam]);

    // Resolve fan by userId
    useEffect(() => {
        if (role !== "FAN" || user?.fanId) return;
        (async () => {
            try {
                const res = await fetch(`https://batsup-v1-oauz.onrender.com/api/fan/by-user/${user.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setFan(data);
                    setUser((prev) => ({ ...prev, fanId: data.id }));
                }
            } catch { }
        })();
    }, [role, user?.id, user?.fanId, setUser]);

    // Fetch full fan with followed teams
    useEffect(() => {
        if (role !== "FAN" || !fanId) return;
        (async () => {
            try {
                const res = await fetch(`https://batsup-v1-oauz.onrender.com/api/fan/${fanId}`);
                if (res.ok) setFan(await res.json());
            } catch { }
        })();
    }, [role, fanId]);

    const favTeamIds = useMemo(() => new Set(fan?.followedTeamIds || []), [fan]);

    // Helper: Get players of a given team (for cards)
    // We will store all players here to show in cards directly.
    const [allPlayers, setAllPlayers] = useState([]);

    useEffect(() => {
        fetch("https://batsup-v1-oauz.onrender.com/api/player/all")
            .then((res) => res.json())
            .then((data) => setAllPlayers(data))
            .catch(() => setAllPlayers([]));
    }, []);

    const getPlayersOfTeam = (teamId) =>
        allPlayers.filter((player) => player.teamId === teamId);

    // Follow / Unfollow
    const toggleTeam = async (teamId) => {
        if (!fan) return;
        const next = new Set(favTeamIds);
        next.has(teamId) ? next.delete(teamId) : next.add(teamId);
        try {
            const res = await fetch(`https://batsup-v1-oauz.onrender.com/api/fan/${fan.id}/follow-teams`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify([...next]),
            });
            if (res.ok) setFan(await res.json());
        } catch { }
    };

    return (
        <div className="bg-black min-h-screen px-4 sm:px-6 lg:px-10 py-10 text-white overflow-x-hidden">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center">
                All Teams
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                {teams.map((team) => {
                    const isFav = favTeamIds.has(team.id);
                    return (
                        <div
                            key={team.id}
                            className="bg-white text-black rounded-2xl overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105 cursor-pointer"
                            onClick={() => setSelectedTeam(team)}
                            tabIndex={0}
                            role="button"
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") setSelectedTeam(team);
                            }}
                        >
                            <img
                                src={team.logo || DEFAULT_LOGO}
                                alt={team.name}
                                className="w-full h-48 sm:h-56 md:h-60 object-cover"
                                loading="lazy"
                            />
                            <div className="p-4 sm:p-6">
                                <h3 className="text-xl sm:text-2xl font-semibold mb-2 truncate">
                                    {team.name}
                                </h3>
                                <p className="text-gray-700 text-sm sm:text-base mb-2">
                                    Location: {team.location ?? "Unknown"}
                                </p>
                                {role === "FAN" && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleTeam(team.id);
                                        }}
                                        className={`w-full sm:w-auto px-4 py-2 text-sm font-semibold rounded-md transition ${isFav
                                                ? "bg-red-600 text-white"
                                                : "bg-green-600 text-white"
                                            } hover:opacity-90`}
                                    >
                                        {isFav ? "Unfollow" : "Follow"}
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {selectedTeam && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 overflow-auto p-4"
                    onClick={() => setSelectedTeam(null)}
                    role="dialog"
                    tabIndex={-1}
                    aria-modal="true"
                    aria-labelledby="modal-title"
                >
                    <div
                        className="bg-white text-black rounded-3xl w-full max-w-lg shadow-lg max-h-[80vh] overflow-y-auto outline-none"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="absolute top-4 right-4 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600"
                            onClick={() => setSelectedTeam(null)}
                            aria-label="Close modal"
                        >
                            <span aria-hidden="true" className="text-3xl font-bold cursor-pointer">
                                &times;
                            </span>
                        </button>

                        <img
                            src={selectedTeam.logo || DEFAULT_LOGO}
                            alt={selectedTeam.name}
                            className="w-full h-56 object-cover rounded-t-3xl"
                            loading="lazy"
                        />

                        <div className="p-6">
                            <h2 id="modal-title" className="text-2xl font-bold mb-3">
                                {selectedTeam.name}
                            </h2>
                            <p className="text-gray-700 mb-6">
                                {selectedTeam.location ?? "World"}
                            </p>
                            <h3 className="text-lg font-semibold mb-3">Players</h3>
                            <ul className="overflow-y-auto max-h-64 pr-3 space-y-2">
                                {getPlayersOfTeam(selectedTeam.id).length > 0 ? (
                                    getPlayersOfTeam(selectedTeam.id).map((player) => (
                                        <li
                                            key={player.id}
                                            className="border-b border-gray-300 pb-1 text-gray-700"
                                        >
                                            {player.jerseyNumber ? `#${player.jerseyNumber} — ` : ""}
                                            {player.nickname || player.name}{" "}
                                            {player.role ? `– ${player.role}` : ""}
                                        </li>
                                    ))
                                ) : (
                                    <li className="italic text-gray-400">No players available</li>
                                )}
                            </ul>
                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => setSelectedTeam(null)}
                                    className="bg-gray-300 hover:bg-gray-400 rounded-md px-5 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeamsPage;
