import React from 'react';
import Title from "../../../component/title/index"
import NavBar from "../../../component/navBar";

function Index(props) {

    return (
        <div className={"AdminTitle w-100"}>
            <NavBar getShift={props?.getShift}/>
            <Title title={props?.title}/>
        </div>
    );
}

export default Index;