import React, { useState, useEffect } from "react";
import axios from "axios";

function NewsLetter({ fanId }) {
    const [newsData, setNewsData] = useState([]);
    const [teams, setTeams] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [fanInfo, setFanInfo] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:8080/api/team/get")
        .then((res) => setTeams(res.data))
        .catch(() => setTeams([]));
    }, []);

    const fetchFanInfo = () => {
        if (fanId && teams.length > 0) {
        axios.get(`http://localhost:8080/api/fan/get/${fanId}`)
            .then((res) => {
            setFanInfo(res.data);
            const followedTeamIds = res.data.followedTeamIds || [];
            const favs = teams.filter(team => followedTeamIds.includes(team.id));
            setFavorites(favs);
            })
            .catch(() => {
            setFavorites([]);
            setFanInfo(null);
            });
        }
    };

    useEffect(() => {
        fetchFanInfo();
    }, [fanId, teams]);

    useEffect(() => {
        if (fanId) {
        axios.get(`http://localhost:8080/api/news/fan/${fanId}`)
            .then((res) => {
            const fanNews = res.data;
            axios.get("http://localhost:8080/api/news/get")
                .then((res2) => {
                const all = res2.data;
                const combined = [
                    ...fanNews,
                    ...all.filter((n) => !fanNews.some((f) => f.id === n.id))
                ];
                setNewsData(combined);
                });
            })
            .catch(() => setNewsData([]));
        } else {
        axios.get("http://localhost:8080/api/news/get")
            .then((res) => setNewsData(res.data))
            .catch(() => setNewsData([]));
        }
    }, [fanId]);

    const toggleFavorite = (team) => {
        const alreadyFav = favorites.some((f) => f.id === team.id);
        const updated = alreadyFav
        ? favorites.filter((f) => f.id !== team.id)
        : [...favorites, team];

        setFavorites(updated);

        if (fanId && fanInfo) {
        axios.put(`http://localhost:8080/api/fan/update/${fanId}`, {
            id: fanId,
            name: fanInfo.name,
            email: fanInfo.email,
            bookedMatchIds: fanInfo.bookedMatchIds || [],
            followedTeamIds: updated.map((t) => t.id),
        })
        .then(fetchFanInfo)
        .catch((e) => console.error("Failed to update fan teams", e));
        }
    };
    
    return (
        <div className="max-w-6xl mx-auto px-6 mt-24 text-white">
            {/* Favorite Picks */}
            <section className="mb-12">
                <h2 className="text-3xl font-bold border-b-2 border-gray-500 pb-2 mb-6">
                    Your Picks
                </h2>
                {favorites.length === 0 ? (
                    <p className="text-gray-400 italic">No teams selected</p>
                ) : (
                    <div className="flex space-x-6">
                        {favorites.map(({ id, teamName, logo }) => (
                            <div key={id} className="flex flex-col items-center">
                                <img
                                    src={logo}
                                    alt={teamName}
                                    className="w-16 h-16 object-cover rounded-full border-2 border-gray-500 bg-white"
                                />
                                <span className="mt-2 text-white font-medium">{teamName}</span>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* News and Scores */}
            <section>
                <h1 className="text-4xl mb-10 border-b-2 border-gray-500">
                    Cricket News & Scores
                </h1>
                <div className="grid md:grid-cols-3 gap-10">
                    {newsData.map((item) => (
                        <article
                            key={item.id}
                            className="bg-white text-black rounded-xl shadow-lg overflow-hidden transform transition hover:shadow-2xl hover:scale-105"
                        >
                            <img
                                src={item.imageLink}
                                alt={item.team && item.team.teamName}
                                className="w-full h-48 object-cover rounded-t-xl"
                                loading="lazy"
                            />
                            <div className="p-6">
                                <h2 className="text-2xl font-semibold mb-3 cursor-pointer hover:text-gray-700">
                                    {item.subject}
                                </h2>
                                <p className="mb-4 leading-relaxed">{item.summary}</p>
                                <p className="text-sm text-gray-500">
                                    {item.createdAt}
                                    {item.team && ` | ${item.team.teamName}`}
                                </p>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            {/* Select Your Teams */}
            <section className="mt-20">
                <h2 className="text-3xl font-bold border-b-2 border-gray-500 pb-2 mb-6">
                    Choose Your Teams
                </h2>
                <div className="flex space-x-8">
                    {teams.length === 0 ? (
                        <p className="text-gray-400">No team data</p>
                    ) : (
                        teams.map((team) => {
                            const isFav = favorites.some((f) => f.id === team.id);
                            return (
                                <div
                                    key={team.id}
                                    className="flex flex-col items-center cursor-pointer select-none relative group"
                                    onClick={() => toggleFavorite(team)}
                                >
                                    <div className="relative">
                                        <img
                                            src={team.logo}
                                            alt={team.teamName}
                                            className={`w-20 h-20 object-cover rounded-full border-2 ${isFav ? "border-gray-600" : "border-gray-400"
                                                } bg-white transition-transform duration-200 group-hover:scale-105`}
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 hover:bg-black hover:opacity-70 transition-opacity duration-300">
                                            <span className="text-white text-4xl font-bold drop-shadow-lg select-none">
                                                {isFav ? "−" : "+"}
                                            </span>
                                        </div>
                                    </div>
                                    <span className="mt-3 text-white font-medium text-center">{team.teamName}</span>
                                </div>
                            );
                        })
                    )}
                </div>
            </section>
        </div>
    );
}

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
