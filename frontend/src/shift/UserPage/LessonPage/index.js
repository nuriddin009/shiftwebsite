import React from 'react';
import "./index.scss"
import {Link, NavLink, Outlet, useLocation, useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import request from "../../utils/request";
import logo from "../../file/image/imageShift/logo2.svg";
import {Nav, NavItem} from "reactstrap";
import {toast} from "react-toastify";

function Index(props) {
    const [user, setUser] = useState()
    const [bar, setBar] = useState(false)
    const [isMentor, setIsMentor] = useState(false)

    let activeStyle = {
        backgroundColor: "black",
        color: "#00C3FF"
    };
    let nowActive = {
        color: "#ffffff",
    };
    let activeClassName = "underline";
    const {username} = useParams()
    let navigate = useNavigate();
    let {pathname} = useLocation();

    const [lessons, setLesson] = useState([])

    useEffect(() => {
        request("/UserLesson/" + username, "get").then(res => {
            setLesson(res.data);
        })
    }, [pathname])


    function navigateclick(item) {
        if (item.isvideoallowed) {
            navigate(`/userPage/${username}/lessons/` + item.id)
        } else {
            toast.error("Videoni ko'rish uchun ruxsat berilmagan")
        }
    }


    // function getMe() {
    //     request("/user/me", "get").then(({data}) => {
    //         // console.log(data.roles.filter(item => item.roleName === "ROLE_MENTOR").length > 0)
    //         if (data.roles.filter(item => item.roleName === "ROLE_MENTOR").length > 0) {
    //             setIsMentor(true)
    //         }
    //     })
    // }


    return (
        <div className={"_Lessonpage navbar_lesson"}>
            {lessons.length === 0 ?
                <h1 className={"text-center"}>Bepul darslarga qo'shilmagansiz</h1>
                :
                <div className={`navbarAdmin ${!bar ? "active_bar" : "dis_bar"}`}>
                    <i
                        onClick={() => setBar(p => !p)}
                        className="fa-solid fa-xmark close_lesson"/>
                    <a href="/">
                        <img className={"mx-4"} src={logo} alt="logo"/>
                    </a>
                    <Nav vertical className={"mt-5"}>
                        {
                            lessons?.map((item, index) =>
                                <div key={index}>
                                    <button
                                        style={{cursor: item.isvideoallowed ? "" : "not-allowed"}}
                                        onClick={() => navigateclick(item)}
                                        to={`/userPage/${username}/lessons/` + item.id}
                                        className={`btn  ${item.isvideoallowed ? 'text-white' : 'text-secondary'}`}>
                                        <h4 className={"d-flex align-items-center"}>{item.isvideoallowed ?
                                            <i className="fa-solid fa-lock-open text-white"/> :
                                            <i className="fa-solid fa-lock text-danger"/>}&nbsp;Lesson={index + 1}</h4>
                                    </button>
                                </div>
                            )
                        }
                    </Nav>
                </div>

            }
            <div className={"content_lesson"} onClick={() => setBar(false)}>
                {
                    bar ? <i
                        onClick={() => setBar(p => !p)}
                        className="m-3 fa-solid fa-bars"/> : ""
                }
                <Outlet/>
            </div>

        </div>
    );
}

export default Index;