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
        axios.get("http://localhost:8080/api/team/all")
            .then((r) => setTeams(r.data))
            .catch(() => setTeams([]));

        axios.get("http://localhost:8080/api/tournaments/get")
            .then((r) => setTournaments(r.data))
            .catch(() => setTournaments([]));

        axios.get("http://localhost:8080/api/newsletter/all")
            .then((r) => setNewsData(r.data))
            .catch(() => setNewsData([]));
    }, []);

    // Resolve fan by userId if needed
    useEffect(() => {
        const needs = role === "FAN" && !user?.fanId && user?.id;
        if (!needs) return;
        (async () => {
            try {
                const res = await fetch(`http://localhost:8080/api/fan/by-user/${user.id}`);
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
                const res = await fetch(`http://localhost:8080/api/fan/${fanId}`);
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
            const res = await fetch(`http://localhost:8080/api/fan/${fan.id}/follow-teams`, {
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
            const res = await fetch(`http://localhost:8080/api/fan/${fan.id}/follow-tournaments`, {
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

// import React, { useState } from "react";

// import team1 from "../assets/pic-6.jpg";
// import team2 from "../assets/pic-7.jpg";
// import team3 from "../assets/pic-8.jpg";

// const newsData = [
// {
//     id: 1,
//     team: "Warriors",
//     teamImg: team1,
//     headline: "Warriors clinch thrilling win against Titans",
//     summary:
//     "In a nail-biting finish, Warriors secured victory with a last-over six.",
//     score: "Warriors 245/7 - Titans 243/9",
//     date: "Aug 10, 2025",
// },
// {
//     id: 2,
//     team: "Strikers",
//     teamImg: team2,
//     headline: "Strikers announce new captain for the season",
//     summary:
//     "Experienced batsman Rohit Sharma to lead Strikers for the upcoming tournaments.",
//     score: null,
//     date: "Aug 9, 2025",
// },
// {
//     id: 3,
//     team: "Titans",
//     teamImg: team3,
//     headline: "Titans sign promising young bowler",
//     summary:
//     "The Titans welcome 19-year-old fast bowler, aiming to boost their bowling attack.",
//     score: null,
//     date: "Aug 8, 2025",
// },
// ];

// const teams = [
// { id: 1, name: "Warriors", img: team1 },
// { id: 2, name: "Strikers", img: team2 },
// { id: 3, name: "Titans", img: team3 },
// ];

// const NewsLetter = () => {
// const [favorites, setFavorites] = useState([]);

// const toggleFavorite = (team) => {
//     setFavorites((prev) =>
//     prev.find((f) => f.id === team.id)
//         ? prev.filter((f) => f.id !== team.id)
//         : [...prev, team]
//     );
// };

// return (
//     <div className="max-w-6xl mx-auto px-6 mt-24 text-white">
//     <section className="mb-12">
//         <h2 className="text-3xl font-bold border-b-2 border-gray-500 pb-2 mb-6">
//         Your Picks
//         </h2>
//         {favorites.length === 0 ? (
//         <p className="text-gray-400 italic">No teams selected</p>
//         ) : (
//         <div className="flex space-x-6">
//             {favorites.map(({ id, name, img }) => (
//             <div key={id} className="flex flex-col items-center">
//                 <img
//                 src={img}
//                 alt={name}
//                 className="w-16 h-16 object-cover rounded-full border-2 border-gray-500 bg-white"
//                 />
//                 <span className="mt-2 text-white font-medium">{name}</span>
//             </div>
//             ))}
//         </div>
//         )}
//     </section>

//     <section>
//         <h1 className="text-4xl font-bold mb-10 border-b-2 border-gray-500 pb-2">
//         Cricket News & Scores
//         </h1>

//         <div className="grid md:grid-cols-3 gap-10">
//         {newsData.map(
//             ({ id, team, teamImg, headline, summary, score, date }) => (
//             <article
//                 key={id}
//                 className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:shadow-2xl hover:scale-[1.02] text-gray-900"
//             >
//                 <img
//                 src={teamImg}
//                 alt={team}
//                 className="w-full h-48 object-cover rounded-t-xl"
//                 loading="lazy"
//                 />
//                 <div className="p-6">
//                 <h2 className="text-2xl font-semibold mb-3 hover:text-gray-700 cursor-pointer">
//                     {headline}
//                 </h2>
//                 <p className="mb-4 leading-relaxed">{summary}</p>
//                 {score && (
//                     <p className="inline-block bg-gray-200 text-gray-800 font-semibold text-sm px-3 py-1 rounded-lg mb-4">
//                     Score: {score}
//                     </p>
//                 )}
//                 <p className="text-sm text-gray-500">{date}</p>
//                 </div>
//             </article>
//             )
//         )}
//         </div>
//     </section>

//     <section className="mt-20">
//     <h2 className="text-3xl font-bold border-b-2 border-gray-500 pb-2 mb-6">
//         Choose Your Teams
//     </h2>
//     <div className="flex space-x-8">
//         {teams.map((team) => {
//         const isFav = favorites.some((f) => f.id === team.id);
//         return (
//             <div
//             key={team.id}
//             className="flex flex-col items-center cursor-pointer select-none relative group"
//             onClick={() => toggleFavorite(team)}
//             >
//             <div className="relative">
//                 <img
//                 src={team.img}
//                 alt={team.name}
//                 className={`w-20 h-20 object-cover rounded-full border-2 bg-white transition-transform duration-200 
//                 ${isFav ? "border-gray-600" : "border-gray-400"} group-hover:scale-105`}
//                 />

//                 <div className="absolute inset-0 flex items-center justify-center 
//                     rounded-full opacity-0 group-hover:opacity-100 hover:bg-black hover:opacity-70
//                     transition-opacity duration-300">
//                 <span className="text-white text-4xl font-bold drop-shadow-lg select-none">
//                     {isFav ? "−" : "+"}
//                 </span>
//                 </div>

//             </div>

//             <span className="mt-3 text-white font-medium text-center">
//                 {team.name}
//             </span>
//             </div>
//         );
//         })}
//     </div>
//     </section>

//     </div>
// );
// };

// export default NewsLetter;
