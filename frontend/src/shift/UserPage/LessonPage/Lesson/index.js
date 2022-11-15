import React, {useEffect, useState} from 'react';
import {useLocation, useParams} from "react-router-dom";
import request from "../../../utils/request";
import "./index.scss"

function Index() {
    const {username} = useParams()
    const {pathname} = useLocation();
    const [lesson, setLesson] = useState([]);
    const [hash, setHash] = useState(null);
    const [path, setPath] = useState("");
    const [userId, setUserId] = useState("");
    const [isMentor, setIsMentor] = useState(false)

    const {id} = useParams()
    useEffect(() => {
        setPath("")
        // getMe()
        // getUserId()
        // if (!isMentor) {
            request("/UserLesson/lesson/" + id + "/" + username, "get").then(res => {
                setLesson(res.data)
            })
        // }
        // else {
        //     request("/UserLesson/mentor/lessons?userId=" + userId, "get").then(res => {
        //         setLesson(res.data)
        //     })
        // }
    }, [pathname])

    // function getMe() {
    //     request("/user/me", "get").then(({data}) => {
    //         console.log(data.roles.filter(item => item.roleName === "ROLE_MENTOR").length > 0)
    //         if (data.roles.filter(item => item.roleName === "ROLE_MENTOR").length > 0) {
    //             setIsMentor(true)
    //         }
    //     })
    // }
    //
    // function getUserId() {
    //     request("/user/myId", "get").then(res => {
    //         setUserId(res.data)
    //         localStorage.setItem("userId", JSON.stringify(res.data))
    //     })
    // }


    function clickVideo(item) {
        setPath(`https://play.boomstream.com/${item.url_video}?id_recovery=${item.hash}`)
    }


    return (
        <div className={"lesson_page"}>
            <div className={"d-flex"}>
                {
                    lesson?.map((item, index) => <div key={index}>
                        <button className={"btn btn-primary"} onClick={() => clickVideo(item)}>Qism-{index + 1}</button>
                    </div>)
                }
            </div>
            {path === "" ? <h1>Darsni qismini tanlang</h1> :
                <iframe height={"550px"} width={"500px"} src={path} frameBorder="0"
                        scrolling="no" allowFullScreen={true} className="w-100 mt-3"/>
            }
        </div>
    );
}

export default Index;
