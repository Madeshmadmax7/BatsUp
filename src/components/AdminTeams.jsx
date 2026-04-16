import React, { useState, useCallback } from "react";
import TournamentManagement from "./TournamentManagement";
import TeamManagement from "./TeamManagement";
import ScoreManagement from "./ScoreManagement";
import FixtureRounds from "./FixtureRounds";
import LeaderBoard from "./LeaderBoard";
import { ErrorNote } from "./SharedComponents";
import NewsletterManagement from "./NewsLetterManagement";

export default function AdminPanel() {
    const [error, setError] = useState("");
    const [tournaments, setTournaments] = useState([]);
    const [selectedTournament, setSelectedTournament] = useState(null);
    const [teams, setTeams] = useState([]);
    const [allPlayers, setAllPlayers] = useState([]);
    const [fixtureRounds, setFixtureRounds] = useState([]);
    const onError = useCallback((msg) => {
        setError(msg);
    }, []);
    const onTeamsChange = useCallback((updatedTeams) => {
        setTeams(updatedTeams);
    }, []);
    const onPlayersChange = useCallback((players) => {
        setAllPlayers(players);
    }, []);
    const handleTournamentSelect = useCallback((tournament) => {
        setSelectedTournament(tournament);
        setFixtureRounds([]);
        setTeams([]);
        setAllPlayers([]);
    }, []);

    return (
        <div className="p-4 sm:p-6 max-w-7xl mx-auto bg-black min-h-screen text-white space-y-8 sm:space-y-10 mt-20">
            <header className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left">
                    Admin Control Panel
                </h1>
            </header>

            <ErrorNote message={error} />

            <TournamentManagement
                selectedTournament={selectedTournament}
                onTournamentSelect={handleTournamentSelect}
                onError={onError}
            />

            <TeamManagement
                selectedTournament={selectedTournament}
                onError={onError}
                onTeamsChange={onTeamsChange}
                onPlayersChange={onPlayersChange}
            />

            <ScoreManagement
                fixtureRounds={fixtureRounds}
                teams={teams}
                allPlayers={allPlayers}
                onError={onError}
            />

            <NewsletterManagement
                tournaments={tournaments}
                teams={teams}
                selectedTournament={selectedTournament}
                onTournamentSelect={handleTournamentSelect}
                onError={onError}
            />

            <FixtureRounds
                selectedTournament={selectedTournament}
                fixtureRounds={fixtureRounds}
                setFixtureRounds={setFixtureRounds}
                onError={onError}
            />

            <LeaderBoard onError={onError} />

            <footer className="py-6 text-center text-gray-500 text-xs sm:text-sm">
                Admin Console — Cricket Manager
            </footer>
        </div>
    );
}