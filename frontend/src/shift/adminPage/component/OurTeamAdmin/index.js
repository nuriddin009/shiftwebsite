import React from 'react';
import OurTeam from "../../../component/ourTeam";
import NavBar from "../../../component/navBar";

function Index(props) {
    return (
        <div className={"w-100"}>
            <NavBar getShift={props?.getShift}/>
            <OurTeam ourTeams={props?.ourTeams} getShift={props?.getShift}/>
        </div>
    );
}

export default Index;