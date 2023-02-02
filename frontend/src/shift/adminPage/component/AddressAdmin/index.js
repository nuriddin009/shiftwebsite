import React from 'react';
import "./index.scss"
import {useState} from "react";
import request from "../../../utils/request";
import {toast} from "react-toastify";
import {useEffect} from "react";
import {useLocation} from "react-router-dom";
import NavBar from "../../../component/navBar";
import instance from "../../../utils/instance";

function Index(props) {

    const [input, setInput] = useState({address: "", number: ""})
    const [follow, setFollow] = useState([])
    const [doubleAddress, setDoubleAddress] = useState(null);
    const [doubleNumber, setDoubleNumber] = useState(null);
    let locationStateLocation = useLocation();
    const [role, setRole] = useState(null);
    useEffect(() => {
        let number = [];
        props.followUses?.map(item => {
            number.push({input: ""});
        })
        setFollow(props.followUses)
        setInput(selectLangAddress(props.address))
        let token = localStorage.getItem("token");
        if (token !== null) {
            instance.get("/user/me").then(res => {
                setRole(res.data.roles[0].roleName)
            })
        }
    }, [props.followUses, props.address])

    function selectLangAddress(item) {
        let lang = localStorage.getItem("lang");
        if (lang === "ENG" || lang === null) {
            return item;
        } else if (lang === "UZB") {
            return {id: item?.id, address: item?.address_UZB, number: item?.number}
        } else if (lang === "RUS") {
            return {id: item?.id, address: item?.address_RUS, number: item?.number}
        }
    }

    function handleInput(e, address) {
        setInput(o => ({...o, [address]: e.target.value}))
    }

    function save() {
        if (input.address !== "" && input.number !== "") {
            let data = input;
            instance.put("/shift/address", data).then(res => {
                setInput({address: "", number: ""})
                toast.success("O'zgartirildi")
                setDoubleAddress(null)
                setDoubleNumber(null)
                props.getShift();

            })
        }
    }

    function handleURL(e, index) {
        let a = [...follow]
        a[index].url = e.target.value
        setFollow(a)
    }

    function handleFile(e, index, id) {
        if (e.target.files[0]) {
            let a = [...follow]
            let data = new FormData();
            data.append("file", e.target.files[0])
            instance.post("/img/followUs/" + id,  data).then(res => {
                a[index].attachment.id = res.data
            })
            setFollow(a)
        }
    }

    function saveFollow(item, index) {
        if (follow[index].url !== "") {
            let data = item
            instance.put("/shift/followUs/" + item.id,  data).then(res => {
                toast.success("O'zgartirildi")

                props.getShift();
            })
        }
    }

    function editAddress() {
        if (locationStateLocation.pathname !== "/") {
            if (role) {
                setDoubleAddress("double")
            }
        }
    }

    function editNumber() {
        if (locationStateLocation.pathname !== "/") {
            if (role) {
                setDoubleNumber("double")
            }
        }
    }

    function enter(e) {
        if (e.key === "Enter") {
            save()
        }
    }

    function enterURl(e, item, index) {
        if (e.key === "Enter") {
            saveFollow(item, index)
        }
    }

    return (
        <div style={{width: "100%", height: "100vh"}}>
            <NavBar getShift={props?.getShift}/>
            <div className={"AdminAbout col-md-7 offset-1 d-flex gap-2 flex-column p-3 pb-3"}>
                <div className={"address"}>
                    <div className={"w-75 m-5"}>
                        {
                            doubleAddress ?
                                <div>
                                    <button onClick={save} className={"btn btn-success m-3 btn-save"}>Save</button>
                                    <textarea cols="20" rows="5" className={"form-control my-3 te-address"} type="text"
                                              placeholder={"Address..."} value={input?.address}
                                              autoFocus
                                              onChange={e => handleInput(e, "address")}/>
                                </div>
                                :
                                <pre>
                    <h6 onDoubleClick={editAddress} className="address">
                        {input?.address}
                    </h6>
                    </pre>

                        }
                        {
                            doubleNumber ?
                                <input className={"form-control my-3 i-number"} type="text" placeholder={"Number..."}
                                       value={input.number}
                                       autoFocus
                                       onChange={e => handleInput(e, "number")}
                                       onKeyPress={(e) => enter(e)}
                                />
                                :

                                <p onDoubleClick={editNumber} className={"desc"}>
                                    {input?.number}
                                </p>
                        }
                    </div>
                </div>
                <div className={"d-flex  flex-wrap gap-4 justify-content-center"}>
                    {props.followUses?.map((item, index) => <div key={item.id} className={"card d-flex text-center"}>
                        <div className={"card-header"} style={{height: "100%"}}>
                            <label className={"my-label"} style={{cursor: "pointer"}}>
                                <img style={{width: "50px", height: "50px"}}
                                     src={"/api/img/" + item.attachment?.id} alt={"img"}/>
                                <input accept={"image/*"} style={{display: "none"}}
                                       onChange={e => handleFile(e, index, item.id)}
                                       type="file"/>
                            </label>
                            <h6>{item.name}</h6>
                        </div>
                        <div className={"d-flex "} style={{height: "35px"}}>
                            <input className={"form-control input-url"} placeholder={"URL"} value={item.url}
                                   onChange={e => handleURL(e, index)}
                                   onKeyPress={(e) => enterURl(e, item, index)}
                                   type="text"
                            />
                        </div>
                    </div>)}
                </div>
            </div>
        </div>
    );
}

export default Index;