import React, {useEffect, useState} from 'react';
import "./index.scss"
import {useLocation, useNavigate} from "react-router-dom";
import instance from "../../../shift/utils/instance";

function Index(props) {
    const [user, setUser] = useState(null);
    const location = useLocation();
    let navigate = useNavigate();
    useEffect(() => {
        getMe();
    }, [])

    function getMe() {
        let token = localStorage.getItem("token");
        if (token !== null) {
            instance.get("/user/me").then(res => {
                setUser(res.data)
            })
        }
    }


    function clickBtn(item) {
        let a = [];
        a.push(item)
        if (item.roleName === "ROLE_ADMIN") {
            navigate("/selectAdmin/studyCenter")
            localStorage.setItem("role", JSON.stringify(a))
        } else if (item.roleName === "ROLE_SUPERADMIN") {
            navigate("/selectAdmin/studyCenter")
            localStorage.setItem("role", JSON.stringify(a))
        } else if (item.roleName === "ROLE_MENTOR") {
            localStorage.setItem("role", JSON.stringify(a))
            navigate("/Mentor")
        } else if (item.roleName === "ROLE_STUDENT") {
            localStorage.setItem("role", JSON.stringify(a))
            navigate(`/userPage/user`)
        }
    }

    return (
        <div className={"selectAdminPage"}>
            <h1 className={"text-center"}>Rolni tanglang</h1>
            <div className={"btnwrapper"}>

                {user?.roles?.map((item, index) => <div key={index}>
                    <button className={"btn btn-dark"}
                            onClick={() => clickBtn(item)}>{item.roleName.slice(5, item.roleName.length)}</button>
                </div>)}
            </div>
        </div>
    );
}

export default Index;