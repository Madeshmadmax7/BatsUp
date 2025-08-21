import React, { useState, useEffect, useMemo } from "react";
import { Section, InlineSpinner, Empty, clsx } from "./SharedComponents";
import axios from "axios";

const API_BASE = "http://localhost:8080";

export default function FixtureRounds({
    selectedTournament,
    fixtureRounds,
    setFixtureRounds,
    onError
}) {
    const [loadingRounds, setLoadingRounds] = useState(false);
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        const loadRounds = async () => {
            if (!selectedTournament) {
                setFixtureRounds([]);
                return;
            }
            setLoadingRounds(true);
            onError("");
            try {
                const res = await axios.get(
                    `${API_BASE}/api/round/tournament/${selectedTournament.id}`
                );
                const data = Array.isArray(res.data) ? res.data : [];
                data.sort((a, b) => a.roundNumber - b.roundNumber || a.id - b.id);
                setFixtureRounds(data);
            } catch {
                onError("Failed to load rounds for this tournament.");
                setFixtureRounds([]);
            } finally {
                setLoadingRounds(false);
            }
        };
        loadRounds();
    }, [selectedTournament, onError, setFixtureRounds]);

    const generateFixture = async () => {
        if (!selectedTournament?.id) {
            alert("Please select a tournament first.");
            return;
        }
        setGenerating(true);
        onError("");
        try {
            await axios.post(`${API_BASE}/api/round/generate`, null, {
                params: { tournamentId: selectedTournament.id }
            });
            const res = await axios.get(
                `${API_BASE}/api/round/tournament/${selectedTournament.id}`
            );
            const data = Array.isArray(res.data) ? res.data : [];
            data.sort((a, b) => a.roundNumber - b.roundNumber || a.id - b.id);
            setFixtureRounds(data);
            alert("Fixture generated successfully!");
        } catch (e) {
            onError(
                e?.response?.data?.message || e.message || "Failed to generate fixtures."
            );
        } finally {
            setGenerating(false);
        }
    };

    const groupedRounds = useMemo(() => {
        const map = new Map();
        fixtureRounds.forEach((round) => {
            const k = round.roundNumber;
            if (!map.has(k)) map.set(k, []);
            map.get(k).push(round);
        });
        for (const [k, arr] of map.entries()) {
            arr.sort((a, b) => a.id - b.id);
        }
        return [...map.entries()].sort((a, b) => a[0] - b[0]);
    }, [fixtureRounds]);

    return (
        <Section
            title="Fixture Rounds"
            right={
                <button
                    onClick={generateFixture}
                    disabled={generating || !selectedTournament}
                    className={clsx(
                        "inline-flex items-center gap-2 px-4 py-2 rounded font-medium",
                        generating || !selectedTournament
                            ? "bg-gray-700 cursor-not-allowed"
                            : "bg-yellow-500 hover:bg-yellow-600 text-black"
                    )}
                >
                    {generating ? <InlineSpinner label="Generating…" /> : "Generate Fixture"}
                </button>
            }
        >
            {!selectedTournament ? (
                <Empty>Select a tournament to view fixtures.</Empty>
            ) : loadingRounds ? (
                <Empty>Loading rounds…</Empty>
            ) : fixtureRounds.length === 0 ? (
                <Empty>No fixture available.</Empty>
            ) : (
                <div className="space-y-6">
                    {groupedRounds.map(([roundNum, list]) => (
                        <div
                            key={roundNum}
                            className="bg-gray-900 rounded-xl border border-gray-800"
                        >
                            <div className="px-4 py-2 border-b border-gray-800 text-lg font-semibold">
                                Round {roundNum}
                            </div>
                            <div className="divide-y divide-gray-800">
                                {list.flatMap((round) =>
                                    Array.isArray(round.matches)
                                        ? round.matches
                                            .filter((m) => m.teamOneName !== "TBD") // only filter out matches without teamOne
                                            .map((m) => (
                                                <div
                                                    key={m.id}
                                                    className="grid grid-cols-3 gap-4 p-3"
                                                >
                                                    <div className="truncate">{m.teamOneName}</div>
                                                    <div className="text-center text-yellow-400 font-semibold">
                                                        vs
                                                    </div>
                                                    <div className="truncate">{m.teamTwoName}</div>
                                                </div>
                                            ))
                                        : []
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Section>
    );
}
