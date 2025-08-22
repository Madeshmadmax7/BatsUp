import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext";

const RegisteredTournaments = () => {
    const { user } = useAuth();
    const [teamTournaments, setTeamTournaments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!user?.playerId) {
            setLoading(false);
            return;
        }

        const fetchTournaments = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:8080/api/player/${user.playerId}/tournaments`
                );
                setTeamTournaments(res.data);
            } catch (err) {
                console.error(err);
                setError("Failed to load tournaments");
            } finally {
                setLoading(false);
            }
        };

        fetchTournaments();
    }, [user]);

    if (loading)
        return (
            <p className="text-center text-gray-400 mt-20 text-lg">Loading tournaments...</p>
        );
    if (error)
        return (
            <p className="text-center text-red-600 mt-20 font-semibold text-lg">{error}</p>
        );
    if (!teamTournaments.length)
        return (
            <p className="text-center text-gray-400 mt-20 text-lg">No tournaments found</p>
        );

    const Card = ({ tournament }) => (
        <div
            className="bg-white text-black rounded-2xl overflow-hidden shadow-lg hover:scale-[1.03] hover:shadow-2xl transition-all duration-300 cursor-pointer max-w-md mx-auto mb-6"
        >
            <div className="relative">
                {tournament.image ? (
                    <img
                        src={`http://localhost:8080/images/tournaments/${tournament.image}`}
                        alt={tournament.tournamentName}
                        className="w-full h-60 object-cover"
                    />
                ) : (
                    <div className="w-full h-60 bg-gray-300 flex items-center justify-center text-gray-500 font-semibold">
                        No Image Available
                    </div>
                )}
                <span className="absolute top-4 left-4 bg-gray-900 text-white text-xs font-bold px-3 py-1 rounded-full">
                    LEARN MORE
                </span>
            </div>
            <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                    <span className="bg-yellow-400 text-black text-xs px-2 py-1 rounded uppercase font-semibold">
                        {tournament.matchType || "N/A"}
                    </span>
                    <span className="text-sm text-gray-600">
                        {new Date(tournament.startDate).toLocaleDateString("en-GB")}
                    </span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{tournament.tournamentName}</h3>
                <p className="text-gray-700 mb-2">
                    <span className="font-semibold">Location: </span>
                    {tournament.location || "N/A"}
                </p>
                <p className="text-gray-700 mb-2">
                    <span className="font-semibold">Teams: </span>
                    {(tournament.teamNames && tournament.teamNames.join(", ")) || "N/A"}
                </p>
                {/* Removed the Join Tournament button as requested */}
            </div>
        </div>
    );

    return (
        <div className="bg-black min-h-screen px-6 py-10 text-white overflow-x-hidden">
            <h2 className="text-4xl font-bold mb-10 text-center mt-14">My Joined Team Tournaments</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {teamTournaments.map((t) => (
                    <Card key={t.id} tournament={t} />
                ))}
            </div>
        </div>
    );
};

export default RegisteredTournaments;
