import React, { useEffect, useState } from "react";
import axios from "axios";

const RegisteredTournaments = () => {
    const [teamTournaments, setTeamTournaments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchTournaments() {
            try {
                const res = await axios.get("https://batsup-v1.oz/api/player/tournaments");
                setTeamTournaments(res.data);
            } catch (err) {
                setError("Failed to load tournaments");
            } finally {
                setLoading(false);
            }
        }

        fetchTournaments();
    }, []);

    if (loading)
        return (
            <div className="flex justify-center items-center min-h-screen bg-black text-white text-lg">
                Loading tournaments...
            </div>
        );

    if (error)
        return (
            <div className="flex justify-center items-center min-h-screen bg-black text-red-600 text-lg font-semibold">
                {error}
            </div>
        );

    if (!teamTournaments.length)
        return (
            <div className="flex justify-center items-center min-h-screen bg-black text-white text-lg">
                No tournaments found
            </div>
        );

    const Card = ({ tournament }) => (
        <article
            role="button"
            tabIndex={0}
            className="bg-gray-800 rounded-xl shadow-lg overflow-hidden transition transform hover:scale-[1.03] hover:shadow-2xl cursor-pointer max-w-md mx-auto mb-6 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            aria-label={`Tournament: ${tournament.tournamentName}`}
        >
            <div className="relative">
                {tournament.image ? (
                    <img
                        src={`https://batsup-v1.oz/api/images/tournaments/${tournament.image}`}
                        alt={tournament.tournamentName}
                        className="w-full h-60 object-cover"
                    />
                ) : (
                    <div className="w-full h-60 bg-gray-700 flex items-center justify-center text-gray-400 font-semibold">
                        No Image Available
                    </div>
                )}
                <span className="absolute top-4 left-4 bg-gray-900 bg-opacity-75 text-white text-xs font-bold px-3 py-1 rounded">
                    LEARN MORE
                </span>
            </div>
            <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                    <span className="bg-yellow-400 text-black font-bold uppercase px-3 py-1 rounded">
                        {tournament.matchType || "N/A"}
                    </span>
                    <time dateTime={new Date(tournament.startDate).toISOString()} className="text-sm text-gray-300">
                        {new Date(tournament.startDate).toLocaleDateString()}
                    </time>
                </div>
                <h3 className="text-xl font-semibold truncate">{tournament.tournamentName}</h3>
                <p className="text-gray-300 mt-2">{tournament.description || "No description available."}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                    {(tournament.teamNames || []).map((team, i) => (
                        <span
                            key={i}
                            className="bg-purple-600 text-white rounded-full px-3 py-1 text-xs truncate max-w-full"
                            title={team}
                        >
                            {team}
                        </span>
                    ))}
                </div>
            </div>
        </article>
    );

    return (
        <main className="bg-black min-h-screen p-6 text-white">
            <h1 className="text-4xl text-center font-bold mb-14">My Joined Tournaments</h1>
            <section className="max-w-7xl mx-auto grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {teamTournaments.map((tournament) => (
                    <Card key={tournament.id} tournament={tournament} />
                ))}
            </section>
        </main>
    );
};

export default RegisteredTournaments;
