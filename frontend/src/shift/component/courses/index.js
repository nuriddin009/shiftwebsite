import React, {useEffect, useState} from 'react';

import "./index.scss"
import Carousel from "react-elastic-carousel";
import {useLocation} from "react-router-dom";
import request from "../../utils/request";
import {toast} from "react-toastify";
import AddWhyUsComponent from "../whyUs/addWhyUsComponent";
import {selectLAngWhyUs} from "../../utils/selectLang";
import load from "./load.png";
import {LazyLoadImage} from "react-lazy-load-image-component";

function Index(props) {
    const [courses, setCourses] = useState([]);
    const [role, setRole] = useState(null);
    const [doubleTitle, setDoubleTitle] = useState([]);
    const [doubleDesc, setDoubleDesc] = useState([])
    const [lang, setLang] = useState(false);

    let pathname = useLocation().pathname;

    useEffect(() => {
        setCourses(selectLAngWhyUs(props?.courses))
        let a = [];
        courses?.map(item => {
            a.push(null)
        })
        setDoubleTitle(a)
        setDoubleDesc(a)
        let token = localStorage.getItem("token");
        if (token !== null) {

            request("/user/me").then(res => {
                setRole(res.data.roles[0].roleName)
            })
        }
        setLang(localStorage.getItem("lang"))

    }, [props.courses])
    const breakPoints = [
        {width: 1, itemsToShow: 1},
        {width: 500, itemsToShow: 2},
        {width: 900, itemsToShow: 3},

    ];

    function editTitle(index) {
        if (pathname !== "/") {
            if (role) {
                let a = [...doubleTitle]
                a[index] = "salom"
                setDoubleTitle(a)
            }
        }
    }

    function editDescription(index) {
        if (pathname !== "/") {
            if (role) {
                let a = [...doubleDesc]
                a[index] = "salom"
                setDoubleDesc(a)
            }
        }
    }

    function handleInput(e, title1, index) {
        let a = [...courses]
        if (title1 === "title") {
            a[index].title = e.target.value
        } else {
            a[index].description = e.target.value
        }
        setCourses(a)
    }

    function enter(e, item, index, title) {
        let a = [...doubleTitle]
        if (e.key === "Enter") {
            if (title === "title") {
                if (item.title !== "") {
                    let data = item;
                    request("/shift/courses/" + item.id, "put", data).then(res => {
                        toast.success("O'zgartirildi")
                        a[index] = null;
                        setDoubleTitle(a)
                    })
                }
            } else {

            }

        }
    }

    function handleFile(e, item, index) {
        let a = [...courses]
        let data = new FormData();
        let b = item.attachment ? item.attachment : "b0f85a63-3c0b-4abd-9867-cc355d02c741"

        data.append("file", e.target.files[0])
        request("/img/editFile/" + b + "/" + item.id + "/courses", "put", data).then(res => {
            a[index].attachment = res.data
            toast.success("rasm o'zgardi")
            setCourses(a)
            props.getShift()
        })
    }

    function saveDesc(item, index) {
        let c = [...doubleDesc]

        if (item.description !== "") {
            let data = item;
            request("/shift/courses/" + item.id, "put", data).then(res => {
                toast.success("O'zgartirildi")
                c[index] = null;
                setDoubleDesc(c)
            })
        }
    }

    return (
        <div className={"courses_"}>
            <div className="section-4" id={"courses"}>
                <h1 className="section-title">{lang === null || lang === "ENG" ? "Courses" : lang === "UZB" ? "Kurslar" : "Курсы"}</h1>

                {
                    role === "ROLE_ADMIN" ? <AddWhyUsComponent courses={courses} getShift={props?.getShift}/> : ""
                }
                <div className="container">
                    <Carousel
                        breakPoints={breakPoints}
                        pagination={false}
                        disableArrowsOnEnd={false}
                        enableAutoPlay={(!role)}
                        autoPlaySpeed={3000}
                        showArrows={courses.length > 3}

                    >
                        {
                            courses?.map((item, index) => <div key={item.id} className="article">
                                {
                                    pathname !== "/" ?
                                        <label className={"my-label"}>
                                            <img
                                                src={"/api/img/" + item.attachment}
                                                width={100}
                                                alt="ua"
                                            />
                                            <input accept={"image/*"} style={{display: "none"}}
                                                   onChange={e => handleFile(e, item, index)}
                                                   type="file"/>
                                        </label>
                                        :
                                        <div className="img">
                                            <div>
                                                <LazyLoadImage
                                                    alt={"section-1"}
                                                    effect="blur"
                                                    src={"/api/img/" + item.attachment}
                                                    placeholderSrc={load}
                                                    width={window.innerWidth > 900 ? "70px"
                                                        : "51.09px"}
                                                    height={window.innerWidth > 900 ? "62px"
                                                        : "31.11px"}
                                                />
                                            </div>
                                        </div>
                                }
                                <div className="content">
                                    {
                                        doubleTitle[index] ?
                                            <input onKeyPress={(e) => enter(e, item, index, "title")}
                                                   className={"form-control h1-title"}
                                                   onChange={e => handleInput(e, "title", index)} type="text"
                                                   autoFocus
                                                   value={courses[index]?.title} placeholder={"Title"}/>
                                            :
                                            <pre>

                                                <h4 onDoubleClick={() => editTitle(index)}>{item.title ? item.title
                                                    : "Lorem ipsum dolor sit amet"}</h4>
                                            </pre>
                                    }
                                    {
                                        doubleDesc[index] ?
                                            <div>
                                                <button onClick={() => saveDesc(item, index)}
                                                        className={"btn btn-dark btn-save"}>Save
                                                </button>

                                                <textarea style={{height: "100px"}} cols="50" rows="10"
                                                          className={"form-control t1-desc"}
                                                          onChange={e => handleInput(e, "description", index)}
                                                          placeholder={"Description"}
                                                          value={courses[index]?.description}
                                                          autoFocus
                                                          onKeyPress={(e) => enter(e, item, index, "description")}/>
                                            </div>
                                            :
                                            <p onDoubleClick={() => editDescription(index)}>
                                                {item.description ? item.description
                                                    : "Lorem ipsum dolor sit amet, consectetur" +
                                                    " adipisicing elit. Dolor, similique."}
                                            </p>

                                    }
                                </div>
                            </div>)
                        }
                    </Carousel>
                </div>
            </div>
        </div>
    );
}

export default Index;