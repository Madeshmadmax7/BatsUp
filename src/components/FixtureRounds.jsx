import React, { useState, useEffect, useMemo } from "react";
import { Section, InlineSpinner, Empty, clsx } from "./SharedComponents";
import axios from "axios";

const API_BASE = "https://batsup-v1-oauz.onrender.com";

export default function FixtureRounds({
    selectedTournament,
    fixtureRounds,
    setFixtureRounds,
    onError,
}) {
    const [loadingRounds, setLoadingRounds] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [selectedRound, setSelectedRound] = useState(null);
    const [selectedTeamOne, setSelectedTeamOne] = useState(null);
    const [selectedTeamTwo, setSelectedTeamTwo] = useState(null);
    const [savingMatch, setSavingMatch] = useState(false);

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
                params: { tournamentId: selectedTournament.id },
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

    // Fix groupedRounds sort
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
        return [...map.entries()].sort((a, b) => a[0] - b[0]); // fix here: use a[0] / b[0]
    }, [fixtureRounds]);

    const onTeamClick = async (round, team, teamSlot) => {
        if (savingMatch) return;
        if (!round) return;

        if (teamSlot === "one") {
            if (selectedTeamOne && selectedTeamOne.id === team.id) {
                setSelectedTeamOne(null);
            } else {
                setSelectedTeamOne(team);
            }
            return;
        } else if (teamSlot === "two") {
            if (selectedTeamTwo && selectedTeamTwo.id === team.id) {
                setSelectedTeamTwo(null);
            } else {
                setSelectedTeamTwo(team);
            }
            return;
        }
    };

    useEffect(() => {
        const tryCreateMatch = async () => {
            if (
                selectedRound &&
                selectedTeamOne &&
                selectedTeamTwo &&
                !savingMatch &&
                selectedTeamOne.id !== selectedTeamTwo.id
            ) {
                setSavingMatch(true);
                onError("");
                try {
                    await axios.post(`${API_BASE}/api/matches/create`, null, {
                        params: {
                            roundId: selectedRound.id,
                            teamOneId: selectedTeamOne.id,
                            teamTwoId: selectedTeamTwo.id,
                        },
                    });
                    const res = await axios.get(
                        `${API_BASE}/api/round/tournament/${selectedTournament.id}`
                    );
                    const data = Array.isArray(res.data) ? res.data : [];
                    data.sort((a, b) => a.roundNumber - b.roundNumber || a.id - b.id);
                    setFixtureRounds(data);
                    setSelectedTeamOne(null);
                    setSelectedTeamTwo(null);
                    alert("Match created successfully!");
                } catch (e) {
                    onError(
                        e?.response?.data?.message || e.message || "Failed to create match."
                    );
                } finally {
                    setSavingMatch(false);
                }
            }
        };
        tryCreateMatch();
    }, [
        selectedRound,
        selectedTeamOne,
        selectedTeamTwo,
        selectedTournament,
        savingMatch,
        onError,
        setFixtureRounds,
    ]);

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
                    {groupedRounds.map(([roundNum, roundList]) => (
                        <div
                            key={roundNum}
                            className="bg-gray-900 rounded-xl border border-gray-800"
                        >
                            <div className="px-4 py-2 border-b border-gray-800 text-lg font-semibold">
                                Round {roundNum}
                            </div>
                            <div className="divide-y divide-gray-800">
                                {roundList.flatMap((round) =>
                                    Array.isArray(round.matches)
                                        ? round.matches
                                            .filter((m) => m.teamOneName !== "TBD") // only matches with teamOneName
                                            .map((m) => (
                                                <div
                                                    key={m.id}
                                                    className="grid grid-cols-3 gap-4 p-3 cursor-pointer hover:bg-gray-800"
                                                >
                                                    {/* Team One */}
                                                    <div
                                                        className={`truncate ${selectedTeamOne?.id === m.teamOneId
                                                                ? "bg-yellow-600 text-black rounded px-1"
                                                                : ""
                                                            }`}
                                                        onClick={() => {
                                                            setSelectedRound(round);
                                                            onTeamClick(round, { id: m.teamOneId, name: m.teamOneName }, "one");
                                                        }}
                                                    >
                                                        {m.teamOneName}
                                                    </div>

                                                    <div className="text-center text-yellow-400 font-semibold">
                                                        vs
                                                    </div>

                                                    {/* Team Two */}
                                                    <div
                                                        className={`truncate ${selectedTeamTwo?.id === m.teamTwoId
                                                                ? "bg-yellow-600 text-black rounded px-1"
                                                                : ""
                                                            }`}
                                                        onClick={() => {
                                                            setSelectedRound(round);
                                                            onTeamClick(round, { id: m.teamTwoId, name: m.teamTwoName }, "two");
                                                        }}
                                                    >
                                                        {m.teamTwoName}
                                                    </div>
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
