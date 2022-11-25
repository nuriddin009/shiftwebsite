import React, {useEffect, useState} from 'react';
import section1 from "../../file/image/imageShift/section1.webp";
import "./index.scss";
import request from "../../utils/request";
import {toast} from "react-toastify";
import {useLocation, useNavigate} from "react-router-dom";
import {selectAboutTitle} from "../../utils/selectLang";
import {LazyLoadImage} from 'react-lazy-load-image-component';
import pSrc from "./section1.jpg";
import Fade from 'react-reveal/Fade';


function Index(props) {
    const [title, setTitle] = useState(null);
    const [role, setRole] = useState(null);
    const [doubleTitle, setDoubleTitle] = useState(null);
    const [doubleDesc, setDoubleDesc] = useState(null);

    let locationStateLocation = useLocation();
    let navigate = useNavigate();

    useEffect(() => {
        setTitle(selectAboutTitle(props?.title))
        let token = localStorage.getItem("token");
        if (token !== null) {
            request("/user/me").then(res => {
                setRole(res.data.roles[0].roleName)
            })
        }
    }, [props.title])

    function editTitle() {
        if (locationStateLocation.pathname !== "/") {
            if (role) {
                setDoubleTitle("double")
            }
        }
    }

    function handleInput(e, title1) {
        let a = {...title}
        if (title1 === "title") {
            a.title = e.target.value
        } else {
            a.description = e.target.value
        }
        setTitle(a)
    }


    function editDescription() {
        if (locationStateLocation.pathname !== "/") {

            if (role) {
                setDoubleDesc("gouble")
            }
        }
    }

    function clickSave() {
        let data;
        if (title.title !== "" && title.description !== "") {
            data = title
            request("/shift/title", "put", data).then(res => {
                setDoubleTitle(null)
                setDoubleDesc(null)
                toast.success("O'zgartirildi")
            })
        }
    }


    return (
        <div className={"title_"}>
            <div className="section-1">
                <div className="container">
                    <div className="left-side">
                        {
                            doubleTitle ?
                                <div className={"text-end"}>
                                    <button onClick={clickSave} className={"btn-save m-3"}>Save</button>
                                    <div className={"text-textarea"}>
                                <textarea cols="20" rows="2"
                                          autoFocus
                                          className={"form-control textarea-title"}
                                          onChange={e => handleInput(e, "title")}
                                          placeholder={"Title"} value={title?.title}/>
                                    </div>
                                </div>
                                :
                                <Fade left>
                                     <pre>
                                <h1 onDoubleClick={editTitle} className="title">
                                {title?.title ? title?.title : "Ready to change\nyour life?"}
                                </h1>
                                </pre>
                                </Fade>

                        }
                        {
                            doubleDesc ?

                                <div className={"div-seck-title"}>

                                    <button onClick={clickSave} className={"btn-save m-3"}>Save</button>
                                    <textarea cols="15" rows="4 "
                                              autoFocus
                                              className={"form-control textarea-desc"}
                                              onChange={e => handleInput(e, "description")}
                                              placeholder={"Description"} value={title?.description}/>
                                </div>
                                :

                                <Fade left>
                                    <p onDoubleClick={editDescription} className="desc">
                                        {title?.description ? title?.description : "Learn programming from international expert.\n" +
                                            "Do not miss your chance, just click button and\n" +
                                            "contact with us. "}
                                    </p>
                                </Fade>

                        }
                        <button onClick={() => navigate("/registerUser")} className="reg-btn">Register now</button>
                    </div>
                    <div className="right-side">
                        <LazyLoadImage
                            alt={"section-1"}
                            effect="blur"
                            src={section1}
                            placeholderSrc={pSrc}
                            width={window.innerWidth > 500 ? "603px"
                                : window.innerWidth > 320 ? "330px" : "300px"}
                            height={window.innerWidth > 500 ? "447px"
                                : window.innerWidth > 320 ? "245px" : "215px"}
                        />
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Index;