import React from 'react';
import {useNavigate} from "react-router-dom";

function Index(props) {
    let navigate = useNavigate();
    return (
        <div>
            <h1 className={"my-5 text-center"}>Ro'yxatdan o'tganiz uchun biz xursandmiz... Tez orada siz bilan bog'lanamiz</h1>
            <div className={"mx-5 pe-5 w-75"}>
            <button onClick={()=>navigate("/")} className={"btn btn-primary float-end mx-5 "}>Ok</button>
            </div>
        </div>
    );
}

export default Index;
