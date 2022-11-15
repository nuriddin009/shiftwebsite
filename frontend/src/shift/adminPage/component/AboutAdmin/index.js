import React from 'react';
import About from "../../../component/aboutUs/index"
import NavBar from "../../../component/navBar";

function Index(props) {
    return (
        <div>
            <NavBar getShift={props?.getShift}/>
            <About about={props?.about} getShift={props?.getShift}/>
        </div>
    );
}

export default Index;