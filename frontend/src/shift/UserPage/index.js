import React, {useEffect, useState} from 'react';
import "./index.scss"
import logo from "../file/image/imageShift/logo2.svg";
import {Nav, NavItem} from "reactstrap";
import {NavLink, Outlet, useLocation, useNavigate, useParams} from "react-router-dom";
import request from "../utils/request";
import instance from "../utils/instance";

function Index(props) {
    const {username} = useParams()
    const navigate = useNavigate()
    let {pathname} = useLocation()
    const [lessons, setLessons] = useState([])
    const [isAdmin, setIsAdmin] = useState(false)
    const [bar, setBar] = useState(false)

    useEffect(() => {

        document.title = "User page"

        instance.get("/UserLesson/" + username).then(res => {
            setLessons(res.data)
        })
        getMe()
    }, [pathname])


    function logOut() {
        navigate("/")
        localStorage.removeItem("token")
        localStorage.removeItem("role")
    }

    function getMe() {
        instance.get("/user/me").then(({data}) => {
            if (data.roles.filter(item => item.roleName === "ROLE_ADMIN"
                || item.roleName === "ROLE_SUPERADMIN").length > 0) {
                setIsAdmin(true)
            }
        })
    }


    let activeStyle = {
        backgroundColor: "black",
        color: "#00C3FF"
    };
    let nowActive = {
        color: "#ffffff",
    };

    return (
        <div className={"_userPage"}>
            <div className={`navbarAdmin ${bar ? "dis_bar" : ""}`}>
                <i
                    onClick={() => setBar(p => !p)}
                    className="fa-solid fa-xmark close_bar"
                />
                <a href="/">
                    <img className={"mx-4"} src={logo} alt="logo"/>
                </a>
                <Nav vertical>
                    <NavItem>
                        <NavLink to={"/userPage/" + username + "/user"}
                                 style={({isActive}) => isActive ? activeStyle : nowActive}><h4
                            className={"mt-5"}>Profil</h4></NavLink>
                    </NavItem>
                    {
                        isAdmin ? <NavItem>
                                <NavLink to={"/selectAdmin"}
                                         style={({isActive}) => isActive ? activeStyle : nowActive}><h4
                                    className={""}>Dashboard</h4></NavLink>
                            </NavItem>
                            : ""
                    }
                    {
                        lessons.length !== 0 ?

                            <NavItem>
                                <NavLink to={"/userPage/" + username + "/lessons"}
                                         style={({isActive}) => isActive ? activeStyle : nowActive}>
                                    <h4>Lessons</h4>
                                </NavLink>
                            </NavItem>
                            : ""
                    }


                </Nav>
                <button className={"btn btn-primary"} onClick={logOut}>Log-out</button>

            </div>
            <div className="content">
                <i
                    onClick={() => setBar(p => !p)}
                    className="fa-solid fa-bars bar_menu"
                />
                <Outlet/>
            </div>
        </div>
    );
}

export default Index;