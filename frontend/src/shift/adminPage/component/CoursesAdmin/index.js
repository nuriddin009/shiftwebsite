import React from 'react';
import Courses from "../../../component/courses";
import NavBar from "../../../component/navBar";

function Index(props) {
    return (
        <div className={"w-100"}>
            <NavBar getShift={props?.getShift}/>
            <Courses courses={props?.courses} getShift={props?.getShift}/>/>
        </div>
    );
}

export default Index;
