import React from 'react';
import WhyUs from "../../../component/whyUs";
import NavBar from "../../../component/navBar";

function Index(props) {

    return (
        <div className={"whyUs w-100"}>
            <NavBar getShift={props?.getShift}/>
            <WhyUs whyUses={props?.whyUses} getShift={props?.getShift}/>
        </div>
    );
}

export default Index;