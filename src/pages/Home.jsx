import React from "react";
import Header from "../components/Header";
import CricketDashboard from "../components/CricketDashboard";
import StadiumVideoCard from "../components/StadiumVideoCard";
const Home = () =>{
    return(
        <div className="bg-black">
            <Header/>
            <StadiumVideoCard/>
            <CricketDashboard/>
        </div>
    )
}
export default Home;