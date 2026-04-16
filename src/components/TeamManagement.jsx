import React, { useState, useEffect } from "react";
import { Trash2, X } from "lucide-react";
import { Section, InlineSpinner, Empty } from "./SharedComponents";

const API_BASE = "https://batsup-v1-oauz.onrender.com";

export default function TeamManagement({
    selectedTournament,
    onError,
    onTeamsChange,
    onPlayersChange,
}) {
    const [teams, setTeams] = useState([]);
    const [loadingTeams, setLoadingTeams] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [allPlayers, setAllPlayers] = useState([]);
    const [loadingPlayers, setLoadingPlayers] = useState(false);

    const getPlayersOfTeam = (teamId) =>
        allPlayers.filter((p) => Number(p.teamId) === Number(teamId));

    useEffect(() => {
        let cancelled = false;

        if (!selectedTournament) {
            setTeams([]);
            onTeamsChange && onTeamsChange([]);
            return;
        }

        setLoadingTeams(true);
        onError && onError("");

        fetch(`${API_BASE}/api/tournaments/${selectedTournament.id}/teams`)
            .then((res) => {
                if (!res.ok) throw new Error("Network response was not ok");
                return res.json();
            })
            .then((data) => {
                if (cancelled) return;
                const teamsData = Array.isArray(data) ? data : [];
                setTeams(teamsData);
                onTeamsChange && onTeamsChange(teamsData);
            })
            .catch(() => {
                if (cancelled) return;
                onError && onError("Failed to load teams.");
                setTeams([]);
                onTeamsChange && onTeamsChange([]);
            })
            .finally(() => {
                if (cancelled) return;
                setLoadingTeams(false);
            });

        return () => {
            cancelled = true;
        };
    }, [selectedTournament, onError, onTeamsChange]);

    useEffect(() => {
        let cancelled = false;

        setLoadingPlayers(true);
        onError && onError("");

        fetch(`${API_BASE}/api/player/all`)
            .then((res) => {
                if (!res.ok) throw new Error("Network response was not ok");
                return res.json();
            })
            .then((data) => {
                if (cancelled) return;
                const playersData = Array.isArray(data) ? data : [];
                setAllPlayers(playersData);
                onPlayersChange && onPlayersChange(playersData);
            })
            .catch(() => {
                if (cancelled) return;
                onError && onError("Failed to load players.");
                setAllPlayers([]);
                onPlayersChange && onPlayersChange([]);
            })
            .finally(() => {
                if (cancelled) return;
                setLoadingPlayers(false);
            });

        return () => {
            cancelled = true;
        };
    }, [onError, onPlayersChange]);

    const deleteTeam = async (teamId) => {
        if (!selectedTournament?.id) return;
        onError && onError("");
        try {
            const res = await fetch(
                `${API_BASE}/api/tournaments/${selectedTournament.id}/remove-team/${teamId}`,
                {
                    method: "DELETE",
                }
            );
            if (!res.ok) throw new Error("Remove failed");
            const updatedTeams = teams.filter((t) => t.id !== teamId);
            setTeams(updatedTeams);
            onTeamsChange && onTeamsChange(updatedTeams);
            if (selectedTeam?.id === teamId) setSelectedTeam(null);

            // Refresh players after team deletion
            const pl = await fetch(`${API_BASE}/api/player/all`);
            if (!pl.ok) throw new Error("Failed to reload players");
            const pData = await pl.json();
            const playersData = Array.isArray(pData) ? pData : [];
            setAllPlayers(playersData);
            onPlayersChange && onPlayersChange(playersData);
        } catch {
            onError && onError("Failed to delete team.");
        }
    };

    return (
        <>
            <Section
                title={`Registered Teams${selectedTournament
                        ? ` for "${selectedTournament.tournamentName ||
                        selectedTournament.title ||
                        selectedTournament.name}"`
                        : ""
                    }`}
                right={loadingTeams ? <InlineSpinner /> : null}
            >
                {!selectedTournament ? (
                    <Empty>Select a tournament to view teams.</Empty>
                ) : loadingTeams ? (
                    <Empty>Loading teams…</Empty>
                ) : teams.length === 0 ? (
                    <Empty>No teams found.</Empty>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {teams.map((team) => (
                            <div
                                key={team.id}
                                className="bg-gray-900 rounded-xl border border-gray-800 p-4 relative"
                            >
                                <button
                                    title="Delete Team"
                                    className="absolute top-2 right-2 text-gray-400 hover:text-red-600"
                                    onClick={() => deleteTeam(team.id)}
                                >
                                    <Trash2 size={18} />
                                </button>
                                <h3 className="text-lg font-semibold mb-1">{team.name}</h3>
                                <p className="text-sm text-gray-400">
                                    Location: {team.location || "N/A"}
                                </p>
                                <p className="text-sm text-gray-400">Phone: {team.phone || "N/A"}</p>
                                <p className="text-sm text-gray-400 mb-3">
                                    Players: {getPlayersOfTeam(team.id).length}
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setSelectedTeam(team)}
                                        className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
                                    >
                                        View Players
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Section>

            {/* Player Modal */}
            {selectedTeam && (
                <div
                    className="fixed inset-0 flex items-center justify-center bg-black/60 z-50"
                    onClick={() => setSelectedTeam(null)}
                >
                    <div
                        className="bg-gray-900 p-6 rounded-2xl max-w-md w-full border border-gray-800"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-2xl font-semibold">{selectedTeam.name} — Players</h3>
                            <button
                                onClick={() => setSelectedTeam(null)}
                                className="p-2 rounded hover:bg-gray-800"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        {loadingPlayers ? (
                            <Empty>Loading players…</Empty>
                        ) : getPlayersOfTeam(selectedTeam.id).length === 0 ? (
                            <Empty>No players in this team.</Empty>
                        ) : (
                            <ul className="space-y-2 max-h-72 overflow-y-auto pr-1">
                                {getPlayersOfTeam(selectedTeam.id).map((player) => (
                                    <li
                                        key={player.id}
                                        className="flex justify-between items-center border-b border-gray-800 pb-2"
                                    >
                                        <span>
                                            #{player.jerseyNumber} — {player.nickname || player.name}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={() => setSelectedTeam(null)}
                                className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded px-4 py-2"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
