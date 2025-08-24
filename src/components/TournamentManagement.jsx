import React, { useState, useEffect } from "react";
import { Section, InlineSpinner, Empty, clsx } from "./SharedComponents";
import { Trash2 } from "lucide-react";

const API_BASE = "https://batsup-v1-oauz.onrender.com";

export default function TournamentManagement({
    selectedTournament,
    onTournamentSelect,
    onError
}) {
    const [tournaments, setTournaments] = useState([]);
    const [loadingTournaments, setLoadingTournaments] = useState(false);
    const [tournamentForm, setTournamentForm] = useState({
        tournamentName: "",
        startDate: "",
        matchType: "",
        location: "",
        description: "",
        image: "",
    });

    useEffect(() => {
        let isMounted = true;
        const loadTournaments = async () => {
            setLoadingTournaments(true);
            onError("");
            try {
                const res = await fetch(`${API_BASE}/api/tournaments/get`);
                const data = await res.json();
                if (isMounted) setTournaments(Array.isArray(data) ? data : []);
            } catch {
                if (isMounted) {
                    onError("Failed to load tournaments.");
                    setTournaments([]);
                }
            } finally {
                if (isMounted) setLoadingTournaments(false);
            }
        };
        loadTournaments();
        return () => {
            isMounted = false;
        };
    }, []);

    const handleTournamentField = (field, val) =>
        setTournamentForm((p) => ({ ...p, [field]: val }));

    const addTournament = async (e) => {
        e.preventDefault();
        onError("");
        try {
            const res = await fetch(`${API_BASE}/api/tournaments/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(tournamentForm),
            });
            if (!res.ok) throw new Error("Create failed");
            await refreshTournaments();
            setTournamentForm({
                tournamentName: "",
                startDate: "",
                matchType: "",
                location: "",
                description: "",
                image: "",
            });
        } catch {
            onError("Failed to create tournament.");
        }
    };

    const refreshTournaments = async () => {
        setLoadingTournaments(true);
        onError("");
        try {
            const res = await fetch(`${API_BASE}/api/tournaments/get`);
            const data = await res.json();
            setTournaments(Array.isArray(data) ? data : []);
        } catch {
            onError("Failed to load tournaments.");
            setTournaments([]);
        } finally {
            setLoadingTournaments(false);
        }
    };

    const deleteTournament = async (id) => {
        if (!window.confirm("Are you sure you want to delete this tournament?")) return;
        onError("");
        try {
            const res = await fetch(`${API_BASE}/api/tournaments/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Delete failed");
            if (selectedTournament?.id === id) {
                onTournamentSelect(null);
            }
            await refreshTournaments();
        } catch {
            onError("Failed to delete tournament.");
        }
    };

    return (
        <Section title="Tournaments" right={loadingTournaments ? <InlineSpinner /> : null}>
            {loadingTournaments ? (
                <Empty>Loading tournaments…</Empty>
            ) : (
                <>
                    <div className="flex flex-wrap gap-2 mb-6 ">
                        {tournaments.length === 0 ? (
                            <Empty>No tournaments found.</Empty>
                        ) : (
                            tournaments.map((t) => (
                                <div key={t.id} className="relative group rounded border bg-gray-800 border-gray-700 flex items-center">
                                    <button
                                        className={clsx(
                                            "px-4 py-2 rounded border flex-1 text-left",
                                            selectedTournament?.id === t.id
                                                ? "bg-yellow-500 text-black border-yellow-500"
                                                : "bg-gray-800 border-gray-800"
                                        )}
                                        onClick={() => onTournamentSelect(t)}
                                    >
                                        {t.tournamentName || t.title || t.name}
                                    </button>
                                    
                                    <button
                                        onClick={() => deleteTournament(t.id)}
                                        title="Delete Tournament"
                                        className="ml-2 p-2 text-red-500 hover:text-red-700 transition-opacity rounded"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    <form
                        onSubmit={addTournament}
                        className="bg-gray-900/60 p-5 rounded-xl border border-gray-800 max-w-xl space-y-4"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Title *"
                                value={tournamentForm.tournamentName}
                                onChange={(e) => handleTournamentField("tournamentName", e.target.value)}
                                className="w-full bg-gray-800 px-3 py-2 rounded text-white border border-gray-700"
                                required
                            />
                            <input
                                type="date"
                                placeholder="Date *"
                                value={tournamentForm.startDate}
                                onChange={(e) => handleTournamentField("startDate", e.target.value)}
                                className="w-full bg-gray-800 px-3 py-2 rounded text-white border border-gray-700"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Type (e.g. Adult, Under19) *"
                                value={tournamentForm.matchType}
                                onChange={(e) => handleTournamentField("matchType", e.target.value)}
                                className="w-full bg-gray-800 px-3 py-2 rounded text-white border border-gray-700"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Location *"
                                value={tournamentForm.location}
                                onChange={(e) => handleTournamentField("location", e.target.value)}
                                className="w-full bg-gray-800 px-3 py-2 rounded text-white border border-gray-700"
                                required
                            />
                        </div>

                        <textarea
                            placeholder="Description (optional)"
                            value={tournamentForm.description}
                            onChange={(e) => handleTournamentField("description", e.target.value)}
                            rows={3}
                            className="w-full bg-gray-800 px-3 py-2 rounded text-white border border-gray-700"
                        />

                        <input
                            type="text"
                            placeholder="Image Link"
                            value={tournamentForm.image}
                            onChange={(e) => handleTournamentField("image", e.target.value)}
                            className="w-full bg-gray-800 px-3 py-2 rounded text-white border border-gray-700"
                        />

                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
                        >
                            Create Tournament
                        </button>
                    </form>
                </>
            )}
        </Section>
    );
}
