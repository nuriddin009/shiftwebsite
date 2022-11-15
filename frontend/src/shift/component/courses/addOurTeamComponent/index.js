import React, {useEffect} from 'react';
import {useState} from "react";
import Rodal from "rodal";
import logo from "../../../file/image/imageShift/logo2.svg"
import "./index.scss"
import request from "../../../utils/request";
import {toast} from "react-toastify";
import {useLocation} from "react-router-dom";

function Index(props) {
    const [fileId, setFileId] = useState(null);
    const [rodal, setRodal] = useState(false);
    const [buttonIs, setButtonIs] = useState(false);
    const [input, setInput] = useState({name: "", description: "", description_UZB: "", description_RUS: ""})
    let locationStateLocation = useLocation();

    useEffect(() => {

    }, [props.ourTeam])

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
            if (input.name !== "" && input.description !== "") {
                let data = {...input}
                setFileId(true)
                    request("/shift/saveOurTeam/" + fileId, "post", data).then(res => {
                        rodalVisible()
                        setInput({name: "", description: "", description_UZB: "", description_RUS: ""})
                        props.getShift()
                        setButtonIs(false)
                    })

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
            <Rodal height={600} visible={rodal} onClose={rodalVisible}>
                <div className="card">
                    <div className="card-header c-h"><img className={"logo"} src={logo} alt="logo"/></div>
                    <div className="card-body   text-center">
                        <label className={"my-label"}>
                            <img className={"imgIcon"} style={{width: "80px", height: "80px"}}
                                 src={"/api/img/" + fileId} alt={"rasmni tanlang"}/>
                            <input accept={"image/*"} style={{display: "none"}}
                                   onChange={e => handleFile(e)}
                                   type="file"/>
                        </label>
                        <input value={input.name} onChange={e => handleSubmit(e, "name")} type="text"
                               placeholder={"Name..."} className={"form-control mt-3"}/>
                        <textarea value={input.description} onChange={e => handleSubmit(e, "description")} cols="10"
                                  rows="3" placeholder={"Description_ENG"} className={"form-control mt-3"}/>
                        <textarea value={input.description_UZB} onChange={e => handleSubmit(e, "description_UZB")} cols="10"
                                  rows="3" placeholder={"Description_UZB"} className={"form-control mt-3"}/>
                        <textarea value={input.description_RUS} onChange={e => handleSubmit(e, "description_RUS")} cols="10"
                                  rows="3" placeholder={"Description_RUS"} className={"form-control mt-3"}/>
                    </div>
                    <div className="card-footer justify-content-end gap-3 d-flex">
                        <button disabled={buttonIs} onClick={save} className={"btn-save"}>Save</button>
                        <button className={"btn-save"}>Cancel</button>
                    </div>
                </div>
            </Rodal>
        </div>
    );
}

export default Index;
