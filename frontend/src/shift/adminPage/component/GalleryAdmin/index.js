import React from 'react';
import Gallery from "../../../component/Gallery";
import NavBar from "../../../component/navBar";

function Index(props) {

    return (
        <div className={"w-100"}>
            <NavBar getShift={props?.getShift}/>
            <Gallery galleries={props?.gallery} getShift={props?.getShift}/>
        </div>
    );
}

export default Index;
