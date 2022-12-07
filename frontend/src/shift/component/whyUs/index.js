import React, {useState} from 'react';
import Carousel from 'react-elastic-carousel';

import "./index.scss"
import {useEffect} from "react";
import request from "../../utils/request";
import {toast} from "react-toastify";
import AddWhyUsComponent from "./addWhyUsComponent";
import {useLocation} from "react-router-dom";
import {selectLAngWhyUs} from "../../utils/selectLang";
import Fade from 'react-reveal/Fade';
import instance from "../../utils/instance";


function Index({getShift, whyUses}) {
    const [whyUs, setWhyUs] = useState([]);
    const [role, setRole] = useState(null);
    const [doubleTitle, setDoubleTitle] = useState([]);
    const [doubleDesc, setDoubleDesc] = useState([])
    const [lang, setLang] = useState(false);

    let locationStateLocation = useLocation();

    useEffect(() => {
        setWhyUs(selectLAngWhyUs(whyUses))
        let a = [];
        whyUs?.map(item => {
            a.push(null)
        })
        setDoubleTitle(a)
        setDoubleDesc(a)
        let token = localStorage.getItem("token");
        if (token !== null) {
            instance.get("/user/me").then(res => {
                setRole(res.data.roles[0].roleName)
            })
        }
        setLang(localStorage.getItem("lang"))

    }, [whyUses])


    function editTitle(index) {
        if (locationStateLocation.pathname !== "/") {

            if (role) {
                let a = [...doubleTitle]
                a[index] = "salom"
                setDoubleTitle(a)
            }
        }
    }

    function editDescription(index) {
        if (locationStateLocation.pathname !== "/") {
            if (role) {
                let a = [...doubleDesc]
                a[index] = "salom"
                setDoubleDesc(a)
            }
        }
    }

    function handleInput(e, title1, index) {
        let a = [...whyUs]
        if (title1 === "title") {
            a[index].title = e.target.value
        } else {
            a[index].description = e.target.value
        }
        setWhyUs(a)
    }

    const breakPoints = [
        {width: 1, itemsToShow: 1},
        {width: 500, itemsToShow: 2},
        {width: 700, itemsToShow: 3},

    ];

    function enter(e, item, index, title) {
        let a = [...doubleTitle]
        if (e.key === "Enter") {
            if (title === "title") {
                if (item.title !== "") {
                    let data = {title: item.title, description: item.description};
                    instance.put("/shift/wyhus/" + item.id,  data).then(res => {
                        toast.success("O'zgartirildi")
                        a[index] = null;
                        setDoubleTitle(a)
                    })
                }
            }

        }
    }

    function saveDesc(item, index) {
        let data = {title: item.title, description: item.description};
        let c = [...doubleDesc]
        if (item.description !== "") {
            instance.put("/shift/wyhus/" + item.id,  data).then(res => {
                toast.success("O'zgartirildi")
                c[index] = null;
                setDoubleDesc(c)
            })
        }
    }

    function handleFile(e, item, index) {
        let a = item.attachment ? item.attachment : "b0f85a63-3c0b-4abd-9867-cc355d02c741"
        let data = new FormData();
        data.append("file", e.target.files[0])
        instance.put("/img/editFile/" + a + "/" + item.id + "/whyUs",  data).then(res => {
            getShift()
            // a[index].attachment = res.data
            // setWhyUs(a)
            toast.success("rasm o'zgardi")
        })
    }


    return (
        <div className={"whyUs_"}>
            <div className="section-3">
                <h1 className="section-title">{lang === null || lang === "ENG" ? "Why Us?" : lang === "UZB" ? "Nega biz?" : "Почему мы?"}</h1>

                {
                    role ? <AddWhyUsComponent whyUs={whyUs} getShift={getShift}/> : ""
                }
                <div className="container">
                    <Carousel
                        enableAutoPlay={(!role)}
                        autoPlaySpeed={3000}
                        breakPoints={breakPoints}
                        pagination={false}
                        showArrows={false}
                        disableArrowsOnEnd={false}

                    >
                        {
                            whyUs?.map((item, index) =>
                                <div className="article" key={item.id}>
                                    {
                                        locationStateLocation.pathname === "/" ?
                                            <img
                                                src={"http://localhost:81/api/img/" + item.attachment}
                                                alt="ua"
                                            />
                                            :
                                            <label className={"my-label"}>
                                                <img src={"http://localhost:81/api/img/" + item.attachment} alt="ua"/>
                                                <input accept={"image/*"} style={{display: "none"}}
                                                       onChange={e => handleFile(e, item, index)}
                                                       type="file"/>
                                            </label>
                                    }
                                    {
                                        doubleTitle[index] ?

                                            <input onKeyPress={(e) => enter(e, item, index, "title")}
                                                   className={"form-control h1-title"}
                                                   onChange={e => handleInput(e, "title", index)} type="text"
                                                   autoFocus
                                                   value={whyUs[index]?.title} placeholder={"Title"}/>
                                            :
                                            <Fade bottom>
                                                <h3 onDoubleClick={() => editTitle(index)} className="title">
                                                    {item.title}</h3>
                                            </Fade>

                                    }
                                    {
                                        doubleDesc[index] ?
                                            <div>
                                                <button onClick={() => saveDesc(item, index)}
                                                        className={"btn btn-dark btn-save"}>Save
                                                </button>

                                                <textarea style={{height: "100px"}} cols="25" rows="5"
                                                          onKeyPress={(e) => enter(e, item, index, "description")}
                                                          className={"form-control t1-desc"}
                                                          onChange={e => handleInput(e, "description", index)}
                                                          placeholder={"Description"}
                                                          autoFocus
                                                          value={whyUs[index]?.description}/>
                                            </div>
                                            :

                                            <Fade bottom>
                                                <p onDoubleClick={() => editDescription(index)} className="desc">
                                                    {item.description}
                                                </p>
                                            </Fade>

                                    }
                                </div>)
                        }
                    </Carousel>
                </div>
            </div>

        </div>
    );
}

export default Index;