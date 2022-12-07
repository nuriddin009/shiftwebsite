import React, {useEffect, useState} from 'react';
import {useLocation, useParams} from "react-router-dom";
import "./index.scss";
import request from "../utils/request";
import instance from "../utils/instance";


function Index(props) {

    let {id} = useParams()

    let {pathname} = useLocation()
    const [found, setFound] = useState(false)

    useEffect(() => {
        instance.get("/certificate/check/" + id).then(res => {
            if (res.data.success) {
                setFound(true)
            }
        })
    }, [pathname])

    return (
        found ? <div className={"certificate-page"}>
                <img src={"http://localhost:81/api/certificate/get/one/" + id} alt=""/>
                {/*<img src={"http://localhost:81/api/certificate/test"} alt=""/>*/}
                <a target={'_blank'} href={"/api/certificate/download/" + id}>
                    <button className={"btn btn-success"}>Download <i
                        style={{fontSize: "24px"}}
                        className="fa-solid fa-download"/></button>
                </a>

            </div>
            : <h1 className={"text-center mt-5"}>¯\_(ツ)_/¯ Certificate not found!</h1>
    );
}

export default Index;