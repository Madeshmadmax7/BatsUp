import React, { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { Section, InlineSpinner, Empty } from "./SharedComponents";

const API_BASE = "https://batsup-v1.am/api";

export default function NewsletterManagement({ onError }) {
    const [tournaments, setTournaments] = useState([]);
    const [selectedTournament, setSelectedTournament] = useState(null);
    const [teams, setTeams] = useState([]);
    const [newsletterList, setNewsletterList] = useState([]);
    const [loadingNews, setLoadingNews] = useState(false);
    const [loadingTournaments, setLoadingTournaments] = useState(false);
    const [newsletterForm, setNewsletterForm] = useState({
        subject: "",
        summary: "",
        imageLink: "",
        tournamentId: "",
        teamId: "",
        content: "",
    });

    // Fetch tournaments and newsletters on mount
    useEffect(() => {
        const fetchTournaments = async () => {
            setLoadingTournaments(true);
            onError("");
            try {
                const res = await fetch(`${API_BASE}/tournaments`);
                const data = await res.json();
                setTournaments(Array.isArray(data) ? data : []);
            } catch {
                onError("Failed to load tournaments.");
                setTournaments([]);
            } finally {
                setLoadingTournaments(false);
            }
        };
        fetchTournaments();
        refreshNewsletters();
    }, []);

    // Fetch teams when a tournament is selected
    useEffect(() => {
        if (!selectedTournament) {
            setTeams([]);
            return;
        }
        const fetchTeams = async () => {
            try {
                const res = await fetch(`${API_BASE}/tournaments/${selectedTournament.id}/teams`);
                const data = await res.json();
                setTeams(Array.isArray(data) ? data : []);
            } catch {
                onError("Failed to load teams for selected tournament.");
                setTeams([]);
            }
        };
        fetchTeams();
    }, [selectedTournament]);

    // Reset tournament and team in form on tournament change
    useEffect(() => {
        setNewsletterForm((f) => ({
            ...f,
            tournamentId: selectedTournament?.id || "",
            teamId: "",
        }));
    }, [selectedTournament]);

    // Fetch the list of newsletters
    const refreshNewsletters = async () => {
        setLoadingNews(true);
        onError("");
        try {
            const res = await fetch(`${API_BASE}/newsletter`);
            const data = await res.json();
            setNewsletterList(Array.isArray(data) ? data : []);
        } catch {
            onError("Failed to load newsletters.");
            setNewsletterList([]);
        } finally {
            setLoadingNews(false);
        }
    };

    // Handle form inputs changes
    const handleFieldChange = (field, val) => {
        setNewsletterForm((p) => ({ ...p, [field]: val }));
        if (field === "tournamentId") {
            const t = tournaments.find((t) => t.id === Number(val));
            setSelectedTournament(t || null);
        }
    };

    // Create a new newsletter
    const addNewsletter = async (e) => {
        e.preventDefault();
        onError("");
        try {
            const payload = { ...newsletterForm };
            const res = await fetch(`${API_BASE}/newsletter`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Create failed");

            setNewsletterForm({
                subject: "",
                summary: "",
                imageLink: "",
                tournamentId: selectedTournament?.id || "",
                teamId: "",
                content: "",
            });
            refreshNewsletters();
        } catch {
            onError("Failed to create newsletter.");
        }
    };

    // Delete newsletter by id
    const deleteNewsletter = async (id) => {
        onError("");
        try {
            const res = await fetch(`${API_BASE}/newsletter/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Delete failed");
            refreshNewsletters();
        } catch {
            onError("Failed to delete newsletter.");
        }
    };

    // Resolve tournament name
    const resolveTournamentName = (id) => {
        if (!id) return "N/A";
        const t = tournaments.find((t) => Number(t.id) === Number(id));
        return t ? t.tournamentName : "N/A";
    };

    // Resolve team name based on tournament selection
    const resolveTeamName = (id, tournamentId) => {
        if (!id) return "N/A";
        const t = tournaments.find((t) => Number(t.id) === Number(tournamentId));
        if (!t) return "N/A";
        const tm = teams.find((tm) => Number(tm.id) === Number(id));
        return tm ? tm.name : "N/A";
    };

    return (
        <Section
            title="Newsletter Management"
            right={loadingNews || loadingTournaments ? <InlineSpinner /> : null}
        >
            {/* Form */}
            <form
                onSubmit={addNewsletter}
                className="bg-gray-900/70 p-6 rounded-xl border border-gray-800 max-w-xl space-y-5 mx-auto"
            >
                <input
                    type="text"
                    placeholder="Subject *"
                    value={newsletterForm.subject}
                    onChange={(e) => handleFieldChange("subject", e.target.value)}
                    required
                    className="w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <input
                    type="text"
                    placeholder="Summary *"
                    value={newsletterForm.summary}
                    onChange={(e) => handleFieldChange("summary", e.target.value)}
                    required
                    className="w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <input
                    type="url"
                    placeholder="Image Link"
                    value={newsletterForm.imageLink}
                    onChange={(e) => handleFieldChange("imageLink", e.target.value)}
                    className="w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <select
                    value={newsletterForm.tournamentId}
                    onChange={(e) => handleFieldChange("tournamentId", e.target.value)}
                    className="w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                    <option value="">Select Tournament (optional)</option>
                    {tournaments.map((t) => (
                        <option key={t.id} value={t.id}>
                            {t.tournamentName}
                        </option>
                    ))}
                </select>
                <select
                    value={newsletterForm.teamId}
                    onChange={(e) =>
                        handleFieldChange(
                            "teamId",
                            e.target.value === "" ? "" : Number(e.target.value)
                        )
                    }
                    disabled={!selectedTournament}
                    className="w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50"
                >
                    <option value="">Select Team (optional)</option>
                    {teams.map((team) => (
                        <option key={team.id} value={team.id}>
                            {team.name}
                        </option>
                    ))}
                </select>
                <textarea
                    placeholder="Content *"
                    value={newsletterForm.content}
                    onChange={(e) => handleFieldChange("content", e.target.value)}
                    required
                    rows={5}
                    className="w-full bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-y"
                />
                <button
                    type="submit"
                    className="w-full py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition"
                >
                    Publish Newsletter
                </button>
            </form>

            {/* Newsletter List */}
            <div className="mt-10 grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {loadingNews ? (
                    <Empty>Loading newsletters…</Empty>
                ) : newsletterList.length === 0 ? (
                    <Empty>No newsletters found.</Empty>
                ) : (
                    newsletterList.map((nw) => (
                        <article
                            key={nw.id}
                            className="relative bg-white rounded-xl shadow p-5 text-gray-900 hover:shadow-lg transition"
                        >
                            <button
                                className="absolute top-3 right-3 text-red-600 hover:text-red-800"
                                onClick={() => deleteNewsletter(nw.id)}
                                title="Delete Newsletter"
                            >
                                <Trash2 size={20} />
                            </button>
                            {nw.imageLink && (
                                <img
                                    src={nw.imageLink}
                                    alt={nw.subject}
                                    className="w-full h-40 object-cover rounded mb-4"
                                />
                            )}
                            <h3 className="text-lg font-semibold mb-1">{nw.subject}</h3>
                            <p className="text-sm font-medium text-gray-600 mb-1">
                                Tournament: {resolveTournamentName(nw.tournamentId)} | Team: {resolveTeamName(nw.teamId, nw.tournamentId)}
                            </p>
                            <p className="mb-2">{nw.summary}</p>
                            <p>{nw.content}</p>
                        </article>
                    ))
                )}
            </div>
        </Section>
    );
}
