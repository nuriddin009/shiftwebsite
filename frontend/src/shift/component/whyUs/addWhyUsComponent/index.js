import React, {useEffect} from 'react';
import {useState} from "react";
import Rodal from "rodal";
import logo from "../../../file/image/imageShift/logo2.svg"
import "./index.scss"
import request from "../../../utils/request";
import {toast} from "react-toastify";
import {useLocation} from "react-router-dom";
import upload from "../upload.png";

function Index(props) {
    const [buttonIs, setButtonIs] = useState(false);
    const [fileId, setFileId] = useState(null);
    const [rodal, setRodal] = useState(false);
    const [input, setInput] = useState({
        title: "",
        description: "",
        title_UZB: "",
        description_UZB: "",
        title_RUS: "",
        description_RUS: ""
    })
    let locationStateLocation = useLocation();

    useEffect(() => {

    }, [props.whyUs])

    function rodalVisible() {
        setRodal(p => !p)
    }

    function handleFile(e) {
        let data = new FormData();
        data.append("file", e.target.files[0])
        request("/img/newFile", "post", data).then(res => {
            setFileId(res.data)
        })
    }

    function save() {
        if (fileId) {
            if (input.title !== "" && input.description !== "") {
                setButtonIs(true)
                let data = {...input}
                if (locationStateLocation.pathname === "/admin/whyUs") {
                    request("/shift/saveWhyUs/" + fileId, "post", data).then(res => {
                        rodalVisible()
                        props.getShift()
                        setInput({
                            title: "",
                            description: "",
                            title_UZB: "",
                            description_UZB: "",
                            title_RUS: "",
                            description_RUS: ""
                        })
                        setButtonIs(false)
                    })
                } else if (locationStateLocation.pathname === "/admin/courses") {
                    request("/shift/saveCourses/" + fileId, "post", data).then(res => {
                        rodalVisible()
                        props.getShift()
                        setInput({
                            title: "",
                            description: "",
                            title_UZB: "",
                            description_UZB: "",
                            title_RUS: "",
                            description_RUS: ""
                        })
                        setButtonIs(false)
                    })
                } else {

                }
            } else {
                toast.error("Malumotlarni to'liq to'ldiring")
            }
        } else {
            toast.error("Iltimos rasm kiriting")
        }
    }

    function handleSubmit(e, item) {
        let a = {...input, [item]: e.target.value}
        setInput(a)
    }

    return (
        <div className={"addWhyUs"}>
            <div className={"text-end"}>
                {
                    locationStateLocation.pathname === "/" ? "" :
                        <button onClick={rodalVisible} className={"btn-save mx-4"}>Add</button>
                }
            </div>
            <Rodal height={600} width={1000} visible={rodal} onClose={rodalVisible}>
                <div className="card">

                    <div className="card-header c-h"><img className={"logo"} src={logo} alt="logo"/></div>
                    <div className="card-body   text-center">
                        <label className={"my-label"}>
                            {
                                fileId ? <img className={"imgIcon"} style={{width: "80px", height: "80px"}}
                                              src={"/api/img/" + fileId} alt={"rasmni tanlang"}/>
                                    : <img
                                        width={100}
                                        height={100}
                                        src={upload}
                                        alt="upload"
                                    />
                            }


                            <input accept={"image/*"} style={{display: "none"}}
                                   onChange={e => handleFile(e)}
                                   type="file"/>
                        </label>
                       <div className="d-flex align-items-start">
                           <input value={input.title} onChange={e => handleSubmit(e, "title")} type="text"
                                  placeholder={"Title_ENG"} className={"form-control mt-3"}/>
                           <textarea value={input.description} onChange={e => handleSubmit(e, "description")} cols="10"
                                     rows="3" placeholder={"Description_ENG"} className={"form-control mt-3"}/>
                       </div>

                        <div className="d-flex align-items-start">
                            <input value={input.title_UZB} onChange={e => handleSubmit(e, "title_UZB")} type="text"
                                   placeholder={"Title_UZB"} className={"form-control mt-3"}/>
                            <textarea value={input.description_UZB} onChange={e => handleSubmit(e, "description_UZB")}
                                      cols="10"
                                      rows="3" placeholder={"Description_RUS"} className={"form-control mt-3"}/>
                        </div>
                        
                        <div className="d-flex align-items-start">
                            <input value={input.title_RUS} onChange={e => handleSubmit(e, "title_RUS")} type="text"
                                   placeholder={"Title_RUS"} className={"form-control mt-3"}/>
                            <textarea value={input.description_RUS} onChange={e => handleSubmit(e, "description_RUS")}
                                      cols="10"
                                      rows="3" placeholder={"Description_RUS"} className={"form-control mt-3"}/>
                        </div>
                    </div>
                    <div className="card-footer justify-content-end gap-3 d-flex">
                        <button disabled={buttonIs} onClick={save} className={"btn-save"}>Save</button>
                        <button onClick={rodalVisible} className={"btn-save"}>Cancel</button>
                    </div>
                </div>
            </Rodal>
        </div>
    );
}

export default Index;
