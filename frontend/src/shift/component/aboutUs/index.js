import React, {useEffect, useState} from 'react';
import section2 from "../../file/image/imageShift/section2.webp";
import "./index.scss";
import request from "../../utils/request";
import {toast} from "react-toastify";
import {useLocation} from "react-router-dom";
import {selectAboutTitle} from "../../utils/selectLang";
import {LazyLoadImage} from 'react-lazy-load-image-component';
import sec2 from "./section2.jpg";

function Index(props) {
    const [about, setAbout] = useState(null);
    const [role, setRole] = useState(null);
    const [doubleTitle, setDoubleTitle] = useState(null);
    const [doubleDesc, setDoubleDesc] = useState(null)
    let locationStateLocation = useLocation();

    useEffect(() => {
        setAbout(selectAboutTitle(props?.about))
        let token = localStorage.getItem("token");
        if (token !== null) {
            request("/user/me").then(res => {
                setRole(res.data.roles[0].roleName)
            })
        }
    }, [props.about])


    function handleInput(e, title1) {
        let a = {...about}
        if (title1 === "title") {
            a.title = e.target.value
        } else {
            a.description = e.target.value
        }
        setAbout(a)
    }

    function editTitle() {
        if (locationStateLocation.pathname !== "/") {
            if (role) {
                setDoubleTitle("double")
            }
        }
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
        if (about.title !== "" && about.description !== "") {
            data = about;
            request("/shift/about", "put", data).then(res => {
                setDoubleTitle(null)
                setDoubleDesc(null)
                toast.success("O'zgartirildi")
                props.getShift();
            })
        }
    }

    return (
        <div className={"about_"}>
            <div className="section-2" id={"about"}>
                <div className="container">
                    <div className="left-side">
                        <LazyLoadImage
                            alt={"section-1"}
                            effect="blur"
                            src={section2}
                            placeholderSrc={sec2}
                            width={window.innerWidth > 500 ? "567px"
                                : "330px"}
                            height={window.innerWidth > 500 ? "365px"
                                : "212px"}
                        />
                    </div>
                    <div className="right-side">
                        {
                            doubleTitle ?
                                <div className={"text-end"}>
                                    <button onClick={clickSave} className={"btn-save m-3"}>Save</button>
                                    <textarea cols="15" rows="1"
                                              autoFocus
                                              className={"form-control textarea-title"}
                                              onChange={e => handleInput(e, "title")}
                                              type="text" placeholder={"Title"} value={about?.title}/>
                                </div>
                                :
                                <pre>
                                <h2 onDoubleClick={editTitle} className="title">
                                    {about?.title ? about?.title
                                        : "About"}
                                </h2>
                                    </pre>
                        }
                        {
                            doubleDesc ?
                                <div className={"text-end"}>
                                    <button onClick={clickSave} className={"btn-save btn-save2 m-3"}>Save</button>
                                    <textarea cols="62" rows="7"
                                              autoFocus
                                              className={"form-control textarea-desc"}
                                              onChange={e => handleInput(e, "description")}
                                              type="text" placeholder={"Description"} value={about
                                        ?.description}/>
                                </div>
                                :

                                <p onDoubleClick={editDescription} className="desc">
                                    {about?.description ? about?.description : "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consectetur " +
                                        "cum delectus esse fugit illo in minus repudiandae suscipit tenetur totam.\n"}
                                </p>

                        }
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Index;