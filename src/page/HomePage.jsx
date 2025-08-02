import React from "react";
import Header from "../components/Header";
import CricketDashboard from "../components/CricketDashboard";
import StadiumVideoCard from "../components/StadiumVideoCard";
import TournamentDisplay from "../components/TournamentDisplay";

const Home = () => {
    return (
        <div className="overflow-x-hidden">
            <Header />
            <CricketDashboard />
            <StadiumVideoCard />
            <TournamentDisplay/>
        </div>
    );
};

export default Home;
