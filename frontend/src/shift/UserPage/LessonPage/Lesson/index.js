import React, {useEffect, useState} from 'react';
import {useLocation, useParams} from "react-router-dom";
import request from "../../../utils/request";
import "./index.scss"
import instance from "../../../utils/instance";
import Button from "@mui/material/Button";

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

    let width = window.innerWidth > 600

    return (
        <div className={"lesson_page"}>
            <div className={"d-flex w-100 flex-wrap"}>
                {
                    lesson?.map((item, index) => <div key={index}>
                        <Button variant={"contained"} onClick={() => clickVideo(item)}>{index + 1}-Qism</Button>
                    </div>)
                }
            </div>
            {path === "" ? <h1>Darsni qismini tanlang</h1> :
                <iframe style={{margin: "40px auto", width: width ? "50%" : "100%"}} height={"550px"} width={"500px"}
                        src={path}
                        frameBorder="0"
                        scrolling="no" allowFullScreen={true}/>
            }
        </div>
    );
}

export default Index;
