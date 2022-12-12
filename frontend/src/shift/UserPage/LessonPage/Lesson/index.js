import React, {useEffect, useState} from 'react';
import {useLocation, useParams} from "react-router-dom";
import request from "../../../utils/request";
import "./index.scss"
import instance from "../../../utils/instance";

function Index() {
    // const {username} = useParams()
    const {pathname} = useLocation();
    const [lesson, setLesson] = useState([]);
    const [path, setPath] = useState("");


    const {id} = useParams()
    useEffect(() => {
        setPath("")

        instance.get("/UserLesson/lesson/" + id).then(res => {
                setLesson(res.data)
            })

    }, [pathname])




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
