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
        fetch("http://localhost:8080/api/team/all")
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
                const res = await fetch(`http://localhost:8080/api/fan/by-user/${user.id}`);
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
                const res = await fetch(`http://localhost:8080/api/fan/${fanId}`);
                if (res.ok) setFan(await res.json());
            } catch { }
        })();
    }, [role, fanId]);

    const favTeamIds = useMemo(() => new Set(fan?.followedTeamIds || []), [fan]);

    // Helper: Get players of a given team (for cards)
    // We will store all players here to show in cards directly.
    const [allPlayers, setAllPlayers] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8080/api/player/all")
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
            const res = await fetch(`http://localhost:8080/api/fan/${fan.id}/follow-teams`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify([...next]),
            });
            if (res.ok) setFan(await res.json());
        } catch { }
    };

    return (
        <div className="bg-black min-h-screen px-6 py-10 text-white overflow-x-hidden">
            <h2 className="text-4xl font-bold mb-10 text-center mt-14">All Teams</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {teams.map((team) => {
                    const isFav = favTeamIds.has(team.id);
                    return (
                        <div
                            key={team.id}
                            className="bg-white text-black rounded-2xl overflow-hidden shadow-lg hover:scale-[1.03] hover:shadow-2xl transition-all duration-300 cursor-pointer"
                            onClick={() => setSelectedTeam(team)} // kept your existing onclick here
                        >
                            <img
                                src={team.logo || DEFAULT_LOGO}
                                alt={team.name}
                                className="w-full h-60 object-cover"
                            />
                            <div className="p-6">
                                <h3 className="text-xl font-semibold mb-2">{team.name}</h3>
                                <p className="text-gray-700 mb-2">Location: {team.location ?? "Unknown"}</p>

                                {/* Player List in card
                                <h4 className="text-lg font-semibold mb-1">Players:</h4>
                                <ul className="mb-3 max-h-24 overflow-y-auto">
                                    {getPlayersOfTeam(team.id).length > 0 ? (
                                        getPlayersOfTeam(team.id).map((player) => (
                                            <li key={player.id} className="text-sm text-gray-600">
                                                {player.playerName || player.nickname || player.name} – {player.role}
                                            </li>
                                        ))
                                    ) : (
                                        <li className="text-gray-500 text-sm">No players available</li>
                                    )}
                                </ul> */}

                                {/* Follow button */}
                                {role === "FAN" && fan && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation(); // prevent card onClick
                                            toggleTeam(team.id);
                                        }}
                                        className={`px-3 py-1 rounded-md text-sm font-semibold transition ${isFav ? "bg-red-500 text-white" : "bg-green-500 text-white"
                                            }`}
                                    >
                                        {isFav ? "Unfollow" : "Follow"}
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Popup / Modal on team click */}
            {selectedTeam && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
                    onClick={() => setSelectedTeam(null)} // close modal on outside click
                >
                    <div
                        className="bg-white text-black w-[90%] max-w-2xl rounded-2xl shadow-lg overflow-hidden relative"
                        onClick={(e) => e.stopPropagation()} // prevent closing on modal click
                    >
                        <button
                            onClick={() => setSelectedTeam(null)}
                            className="absolute top-3 right-3 text-gray-700 hover:text-black text-xl"
                        >
                            ✕
                        </button>

                        <img
                            src={selectedTeam.logo || DEFAULT_LOGO}
                            alt={selectedTeam.name}
                            className="w-full h-56 object-cover"
                        />

                        <div className="p-6">
                            <h2 className="text-2xl font-bold mb-2">{selectedTeam.name}</h2>
                            <p className="text-gray-700 mb-2">
                                         {selectedTeam.location ?? "world"}
                            </p>

                            <h3 className="text-lg font-semibold mb-2">Players:</h3>
                            <ul className="mb-4 max-h-40 overflow-y-auto">
                                {getPlayersOfTeam(selectedTeam.id).length > 0 ? (
                                    getPlayersOfTeam(selectedTeam.id).map((p) => (
                                        <li key={p.id} className="text-sm text-gray-600">
                                            {p.playerName || p.nickname || p.name} – {p.role}
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-gray-500 text-sm">No players available</li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeamsPage;
