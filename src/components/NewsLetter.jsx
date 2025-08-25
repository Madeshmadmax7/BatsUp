import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext";


function groupNews(news, favTeamIds = new Set(), favTournamentIds = new Set(), favTeamNames = new Set()) {
    const preferred = [];
    const others = [];
    for (const n of news) {
        const tId = n.teamId ?? null;
        const trId = n.tournamentId ?? null;
        const tName = (n.teamName || "").toLowerCase();
        const likedById = (tId && favTeamIds.has(tId)) || (trId && favTournamentIds.has(trId));
        const likedByName = tName && favTeamNames.has(tName);
        const liked = likedById || likedByName;
        (liked ? preferred : others).push(n);
    }
    return { preferred, others };
}


const NewsLetter = () => {
    const { user, setUser } = useAuth();
    const role = user?.role;


    const [teams, setTeams] = useState([]);
    const [tournaments, setTournaments] = useState([]);
    const [newsData, setNewsData] = useState([]);


    const [fan, setFan] = useState(null);
    const fanId = user?.fanId ?? fan?.id ?? null;


    // Popup state
    const [popupOpen, setPopupOpen] = useState(false);
    const [selectedNews, setSelectedNews] = useState(null);


    useEffect(() => {
        axios.get("https://batsup-v1-oauz.onrender.com/api/team/all")
            .then((r) => setTeams(r.data))
            .catch(() => setTeams([]));


        axios.get("https://batsup-v1-oauz.onrender.com/api/tournaments/get")
            .then((r) => setTournaments(r.data))
            .catch(() => setTournaments([]));


        axios.get("https://batsup-v1-oauz.onrender.com/api/newsletter/all")
            .then((r) => setNewsData(r.data))
            .catch(() => setNewsData([]));
    }, []);


    // Resolve fan by userId if needed
    useEffect(() => {
        const needs = role === "FAN" && !user?.fanId && user?.id;
        if (!needs) return;
        (async () => {
            try {
                const res = await fetch(`https://batsup-v1-oauz.onrender.com/api/fan/by-user/${user.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setFan(data);
                    setUser((prev) => ({ ...prev, fanId: data.id }));
                }
            } catch { }
        })();
    }, [role, user?.id, user?.fanId, setUser]);


    useEffect(() => {
        if (role !== "FAN" || !fanId) return;
        (async () => {
            try {
                const res = await fetch(`https://batsup-v1-oauz.onrender.com/api/fan/${fanId}`);
                if (res.ok) setFan(await res.json());
            } catch { }
        })();
    }, [role, fanId]);


    const favTeamIds = useMemo(() => new Set(fan?.followedTeamIds || []), [fan]);
    const favTournamentIds = useMemo(() => new Set(fan?.followedTournamentIds || []), [fan]);
    const favTeamNames = useMemo(() => {
        const set = new Set();
        if (teams?.length && favTeamIds.size) {
            teams.forEach((t) => {
                if (favTeamIds.has(t.id) && t.teamName) set.add(t.teamName.toLowerCase());
            });
        }
        return set;
    }, [teams, favTeamIds]);


    const { preferred, others } = useMemo(() => {
        if (role !== "FAN") return { preferred: [], others: newsData };
        return groupNews(newsData, favTeamIds, favTournamentIds, favTeamNames);
    }, [newsData, role, favTeamIds, favTournamentIds, favTeamNames]);


    const toggleTeam = async (teamId) => {
        if (!fan) return;
        const next = new Set(favTeamIds);
        next.has(teamId) ? next.delete(teamId) : next.add(teamId);
        const body = Array.from(next);
        try {
            const res = await fetch(`https://batsup-v1-oauz.onrender.com/api/fan/${fan.id}/follow-teams`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            if (res.ok) setFan(await res.json());
        } catch { }
    };


    const toggleTournament = async (tid) => {
        if (!fan) return;
        const next = new Set(favTournamentIds);
        next.has(tid) ? next.delete(tid) : next.add(tid);
        const body = Array.from(next);
        try {
            const res = await fetch(`https://batsup-v1-oauz.onrender.com/api/fan/${fan.id}/follow-tournaments`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            if (res.ok) setFan(await res.json());
        } catch { }
    };


    const TeamChip = ({ t }) => {
        const isFav = favTeamIds.has(t.id);
        return (
            <button
                onClick={() => toggleTeam(t.id)}
                className={`flex flex-col items-center gap-1 border rounded-2xl p-3 w-24 transition hover:scale-105 ${isFav ? "border-white bg-white/10" : "border-gray-500 bg-transparent"
                    }`}
                title={isFav ? "Unfollow" : "Follow"}
            >
                {t.logo ? (
                    <img
                        src={t.logo}
                        alt={t.teamName}
                        className="w-12 h-12 rounded-full object-cover border"
                    />
                ) : (
                    <span className="inline-block w-12 h-12 rounded-full bg-gray-400" />
                )}
                <span className="text-sm text-center truncate">{t.teamName}</span>
                <span className="text-lg leading-none">{isFav ? "−" : "+"}</span>
            </button>
        );
    };


    const TournamentChip = ({ tr }) => {
        const isFav = favTournamentIds.has(tr.id);
        return (
            <button
                onClick={() => toggleTournament(tr.id)}
                className={`flex flex-col items-center justify-between border rounded-2xl p-3 w-28 h-36 transition hover:scale-105 ${isFav ? "border-white bg-white/10" : "border-gray-500 bg-transparent"
                    }`}
                title={isFav ? "Unfollow" : "Follow"}
            >
                {tr.image ? (
                    <img
                        src={tr.image}
                        alt={tr.tournamentName}
                        className="w-12 h-12 rounded-full object-cover border"
                    />
                ) : (
                    <span className="inline-block w-12 h-12 rounded-full bg-gray-400" />
                )}
                <span className="text-center leading-tight max-w-[5rem] break-words text-xs sm:text-sm">
                    {tr.tournamentName}
                </span>
                <span className="text-lg leading-none">{isFav ? "−" : "+"}</span>
            </button>
        );
    };


    const handleCardClick = (item) => {
        setSelectedNews(item);
        setPopupOpen(true);
    };


    const closePopup = () => {
        setPopupOpen(false);
        setSelectedNews(null);
    };


    const Card = ({ item }) => (
        <article
            onClick={() => handleCardClick(item)}
            className="bg-white text-black rounded-xl shadow-lg overflow-hidden transform transition hover:shadow-2xl hover:scale-105 cursor-pointer"
        >
            {item.imageLink ? (
                <img
                    src={item.imageLink}
                    alt={item.subject}
                    className="w-full h-48 object-cover"
                    loading="lazy"
                />
            ) : null}
            <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{item.subject}</h3>
                <p className="mb-4">{item.summary}</p>
                <p className="text-sm text-gray-600">
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ""}
                    {item.teamName ? ` | ${item.teamName}` : ""}
                    {item.tournamentName ? ` | ${item.tournamentName}` : ""}
                </p>
            </div>
        </article>
    );


    return (
        <div className="max-w-6xl mx-auto px-6 mt-24 text-white">
            <h1 className="text-4xl mb-6 border-b-2 border-gray-500">Cricket News & Scores</h1>


            {role === "FAN" && fan && (
                <>
                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold mb-3">Your Picks</h2>


                        <div className="mb-4">
                            <h3 className="text-lg mb-2 opacity-80">Teams</h3>
                            <div className="flex flex-wrap gap-3">
                                {teams.length ? teams.map((t) => <TeamChip key={t.id} t={t} />) : (
                                    <span className="text-gray-400">No teams</span>
                                )}
                            </div>
                        </div>


                        <div>
                            <h3 className="text-lg mb-2 opacity-80">Tournaments</h3>
                            <div className="flex flex-wrap gap-3">
                                {tournaments.length ? tournaments.map((tr) => <TournamentChip key={tr.id} tr={tr} />) : (
                                    <span className="text-gray-400">No tournaments</span>
                                )}
                            </div>
                        </div>
                    </section>


                    <section className="mb-12">
                        <h2 className="text-2xl font-semibold mb-4">Top for You</h2>
                        {preferred.length === 0 ? (
                            <p className="text-gray-400">No personalized news yet. Pick some favorites above.</p>
                        ) : (
                            <div className="grid md:grid-cols-3 gap-8">
                                {preferred.map((item) => <Card key={item.id} item={item} />)}
                            </div>
                        )}
                    </section>
                </>
            )}


            <section>
                <h2 className="text-2xl font-semibold mb-4">{role === "FAN" ? "More News" : "All News"}</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {(role === "FAN" ? others : newsData).map((item) => <Card key={item.id} item={item} />)}
                </div>
            </section>


            {/* Popup */}
            {/* Popup */}
            {popupOpen && selectedNews && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white text-black rounded-xl shadow-xl p-6 max-w-md w-full relative">
                        <button
                            onClick={closePopup}
                            className="absolute top-2 right-2 text-gray-600 hover:text-black"
                        >
                            ✖
                        </button>


                        {/* Image Container */}
                        <div className="w-full h-48 mb-4 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
                            {selectedNews.imageLink ? (
                                <img
                                    src={selectedNews.imageLink}
                                    alt={selectedNews.subject}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-gray-500">No Image</span>
                            )}
                        </div>


                        <h2 className="text-2xl font-bold mb-4">{selectedNews.subject}</h2>
                        <p className="mb-2">{selectedNews.summary}</p>
                        <p className="text-sm text-gray-700">
                            <strong>Team:</strong>{" "}
                            {selectedNews.teamName ? selectedNews.teamName : "N/A"}
                        </p>
                        <p className="text-sm text-gray-700">
                            <strong>Tournament:</strong>{" "}
                            {selectedNews.tournamentName ? selectedNews.tournamentName : "N/A"}
                        </p>
                    </div>
                </div>
            )}


        </div>
    );
};


export default NewsLetter;