import React, {useState} from 'react';
import "./index.scss"
import {useLocation} from "react-router-dom";
import {useEffect} from "react";
import request from "../../utils/request";
import {toast} from "react-toastify";
import Carousel from "react-elastic-carousel";
import AddOurTeamComponent from "../courses/addOurTeamComponent";
import {selectLangOurTeamDesc} from "../../utils/selectLang";
import instance from "../../utils/instance";

function Index(props) {
    const [ourTeam, setOurTeam] = useState([]);
    const [role, setRole] = useState(null);
    const [doubleName, SetdoubleName] = useState([]);
    const [doubleDesc, setDoupleDesc] = useState([])
    const [lang, setLang] = useState(false);

    let pathname = useLocation().pathname;
    const breakPoints = [
        {width: 1, itemsToShow: 1},
        {width: 600, itemsToShow: 2},
        {width: 900, itemsToShow: 3},

    ];
    useEffect(() => {
        setOurTeam(selectLangOurTeamDesc(props.ourTeams))
        let a = [];
        ourTeam?.map(item => {
            a.push(null)
        })
        SetdoubleName(a)
        setDoupleDesc(a)
        let token = localStorage.getItem("token");
        if (token !== null) {
            instance.get("/user/me").then(res => {
                setRole(res.data.roles[0].roleName)
            })
        }
        setLang(localStorage.getItem("lang"))

    }, [props.ourTeams])

    function editName(index) {
        if (pathname !== "/") {
            if (role) {
                let a = [...doubleName]
                a[index] = "salom"
                SetdoubleName(a)
            }
        }
    }

    function editDescrition(index) {
        if (pathname !== "/") {
            if (role) {
                let a = [...doubleDesc]
                a[index] = "salom"
                setDoupleDesc(a)
            }
        }
    }

    function heandleInput(e, name1, index) {
        let a = [...ourTeam]
        if (name1 === "name") {
            a[index].name = e.target.value
        } else {
            a[index].description = e.target.value
        }
        setOurTeam(a)
    }

    function enter(e, item, index, name) {
        let a = [...doubleName]
        let c = [...doubleDesc]
        if (e.key === "Enter") {

            if (item.name !== "" && item.description !== "") {
                let data = {name: item.name, description: item.description};
                instance.put("/shift/ourTeam/" + item.id, data).then(res => {
                    toast.success("O'zgartirildi")
                    a[index] = null;
                    SetdoubleName(a)
                    c[index] = null;
                    setDoupleDesc(a)
                })
            }

        }
    }

    function handleFile(e, item, index) {
        let a = [...ourTeam]
        let b = item.attachment ? item.attachment : "b0f85a63-3c0b-4abd-9867-cc355d02c741"

        let data = new FormData();
        data.append("file", e.target.files[0])
        instance.put("/img/editFile/" + b + "/" + item.id + "/ourteam", data).then(res => {
            a[index].attachment = res.data
            toast.success("rasm o'zgardi")
            props.getShift()
            setOurTeam(a)
        })
    }


    function deleteTeam(id) {
        // eslint-disable-next-line no-restricted-globals
        if (confirm("Tasdiqlang o'chirishni")) {
            instance.delete("/shift/ourTeam/" + id).then(res => {
                props.getShift()
            })
        }
    }

    return (
        <div className={"ourTeam_"}>
            <div className="section-6">
                <h3 className="section-title">   {lang === null || lang === "ENG" ? "Our team " : lang === "UZB" ? "Bizning jamoamiz" : "Наша команда"}</h3>

                {role === "ROLE_ADMIN" ? <AddOurTeamComponent ourTeam={ourTeam} getShift={props?.getShift}/> : ""}
                <div className="container">
                    <Carousel
                        breakPoints={breakPoints}
                        pagination={false}
                        disableArrowsOnEnd={false}
                        enableAutoPlay={(!role)}
                        autoPlaySpeed={3000}
                        showArrows={ourTeam.length > 3}
                    >
                        {
                            ourTeam?.map((item, index) =>
                                <div className={`article p-4`}
                                     key={item.id}>
                                    {
                                        pathname === "/admin/ourTeam" ?
                                            <button onClick={() => deleteTeam(item.id)}
                                                    className="btn btn-dark btn-delete">X</button>
                                            : ""
                                    }
                                    <div className="wrapper">
                                        {
                                            pathname !== "/" ?
                                                <label className={"wrapper"}>
                                                    <img src={"/api/img/" + item.attachment}
                                                         alt="mentor"/>
                                                    <input accept={"image/*"} style={{display: "none"}}
                                                           onChange={e => handleFile(e, item, index)}
                                                           type="file"/>
                                                </label>
                                                :
                                                <img src={"/api/img/" + item.attachment}
                                                     alt="mentor"/>
                                        }
                                        <div className="bg"/>
                                    </div>
                                    {
                                        doubleName[index] ?
                                            <input onKeyPress={(e) => enter(e, item, index, "name")}
                                                   className={"form-control t1-name"}
                                                   onChange={e => heandleInput(e, "name", index)} type="text"
                                                   value={ourTeam[index]?.name} placeholder={"Title"}
                                                   autoFocus
                                            />

                                            :
                                            <pre>

                                <h3 onDoubleClick={() => editName(index)}>{item.name}</h3>
                                        </pre>
                                    }
                                    {
                                        doubleDesc[index] ? <input
                                                className={"form-control t1-desc"}
                                                onChange={e => heandleInput(e, "description", index)}
                                                placeholder={"Description"}
                                                value={ourTeam[index]?.description}
                                                onKeyPress={(e) => enter(e, item, index, "description")}
                                                autoFocus
                                            />
                                            :


                                            <p onDoubleClick={() => editDescrition(index)}>{item.description}</p>

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