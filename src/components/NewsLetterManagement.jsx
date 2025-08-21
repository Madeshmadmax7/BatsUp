import React, { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { Section, InlineSpinner, Empty } from "./SharedComponents";

const API_BASE = "http://localhost:8080";

export default function NewsletterManagement({
    tournaments,
    teams,
    selectedTournament,
    onTournamentSelect,
    onError,
}) {
    const [newsletterList, setNewsletterList] = useState([]);
    const [loadingNews, setLoadingNews] = useState(false);
    const [newsletterForm, setNewsletterForm] = useState({
        subject: "",
        summary: "",
        imageLink: "",
        tournamentId: "",
        teamId: "",
        content: "",
    });

    // Sync newsletterForm.tournamentId with selectedTournament.id
    useEffect(() => {
        setNewsletterForm((f) => ({
            ...f,
            tournamentId: selectedTournament?.id || "",
            teamId: "", // reset team selection when tournament changes
        }));
    }, [selectedTournament]);

    useEffect(() => {
        refreshNewsletters();
    }, []);

    const refreshNewsletters = async () => {
        setLoadingNews(true);
        onError("");
        try {
            const res = await fetch(`${API_BASE}/api/newsletter/all`);
            const data = await res.json();
            setNewsletterList(Array.isArray(data) ? data : []);
        } catch {
            onError("Failed to load newsletters.");
            setNewsletterList([]);
        } finally {
            setLoadingNews(false);
        }
    };

    const handleFieldChange = (field, val) => {
        setNewsletterForm((p) => ({ ...p, [field]: val }));
        // If tournamentId changes, notify parent for state update
        if (field === "tournamentId") {
            const t = tournaments.find((t) => t.id === Number(val));
            onTournamentSelect(t || null);
        }
    };

    const addNewsletter = async (e) => {
        e.preventDefault();
        onError("");
        try {
            let teamName = "";
            if (newsletterForm.teamId) {
                const team = teams.find(
                    (t) => Number(t.id) === Number(newsletterForm.teamId)
                );
                teamName = team ? team.name : "";
            }
            const payload = { ...newsletterForm, teamName };
            delete payload.teamId;
            const res = await fetch(`${API_BASE}/api/newsletter/create`, {
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

    const deleteNewsletter = async (id) => {
        onError("");
        try {
            const res = await fetch(`${API_BASE}/api/newsletter/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Delete failed");
            refreshNewsletters();
        } catch {
            onError("Failed to delete newsletter.");
        }
    };

    return (
        <Section
            title="Newsletter Management"
            right={loadingNews ? <InlineSpinner /> : null}
        >
            <form
                onSubmit={addNewsletter}
                className="bg-gray-900/60 p-5 rounded-xl border border-gray-800 max-w-xl space-y-4"
            >
                <input
                    type="text"
                    placeholder="Subject *"
                    value={newsletterForm.subject}
                    onChange={(e) => handleFieldChange("subject", e.target.value)}
                    className="w-full bg-gray-800 px-3 py-2 rounded text-white border border-gray-700"
                    required
                />
                <input
                    type="text"
                    placeholder="Summary *"
                    value={newsletterForm.summary}
                    onChange={(e) => handleFieldChange("summary", e.target.value)}
                    className="w-full bg-gray-800 px-3 py-2 rounded text-white border border-gray-700"
                    required
                />
                <input
                    type="text"
                    placeholder="Image Link"
                    value={newsletterForm.imageLink}
                    onChange={(e) => handleFieldChange("imageLink", e.target.value)}
                    className="w-full bg-gray-800 px-3 py-2 rounded text-white border border-gray-700"
                />
                <select
                    value={newsletterForm.tournamentId}
                    onChange={(e) =>
                        handleFieldChange(
                            "tournamentId",
                            e.target.value === "" ? "" : Number(e.target.value)
                        )
                    }
                    className="w-full bg-gray-800 px-3 py-2 rounded text-white border border-gray-700"
                >
                    <option value="">Select Tournament (optional)</option>
                    {tournaments.map((t) => (
                        <option key={t.id} value={t.id}>
                            {t.tournamentName || t.title || t.name}
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
                    className="w-full bg-gray-800 px-3 py-2 rounded text-white border border-gray-700"
                    disabled={!selectedTournament || teams.length === 0}
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
                    rows={4}
                    className="w-full bg-gray-800 px-3 py-2 rounded text-white border border-gray-700"
                />
                <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white"
                >
                    Publish News
                </button>
            </form>

            <div className="mt-6 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                {loadingNews ? (
                    <Empty>Loading newsletters…</Empty>
                ) : newsletterList.length === 0 ? (
                    <Empty>No newsletters found.</Empty>
                ) : (
                    newsletterList.map((nw) => (
                        <article
                            key={nw.id}
                            className="bg-white rounded-xl shadow p-5 text-gray-900 relative"
                        >
                            <button
                                className="absolute top-2 right-2 text-red-600"
                                onClick={() => deleteNewsletter(nw.id)}
                                title="Delete Newsletter"
                            >
                                <Trash2 size={18} />
                            </button>
                            {nw.imageLink && (
                                <img
                                    src={nw.imageLink}
                                    alt={nw.subject}
                                    className="w-full h-40 object-cover rounded mb-4"
                                />
                            )}
                            <h3 className="text-xl font-semibold">{nw.subject}</h3>
                            <p className="text-sm font-medium text-gray-600 mb-1">
                                Tournament ID: {nw.tournamentId || "N/A"} | Team:{" "}
                                {nw.teamName || "N/A"}
                            </p>
                            <p className="mb-2">{nw.summary}</p>
                            <p className="mb-2">{nw.content}</p>
                        </article>
                    ))
                )}
            </div>
        </Section>
    );
}
