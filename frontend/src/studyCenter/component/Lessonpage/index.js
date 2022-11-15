import React, {useState, useEffect} from 'react';
import request from "../../../shift/utils/request";
import Rodal from "rodal";
import {useForm} from "react-hook-form";
import {toast} from "react-toastify";
import "./index.scss"

function Index(props) {
    const [lesson, setLesson] = useState([])
    const [urls, setUrls] = useState([])
    const [rodalUrl, setRodalUrl] = useState(false)
    
    useEffect(() => {
        getLessons()
    }, [])

    function getLessons() {
        request("/lessons", "get").then(res => {
            setLesson(res.data)
        })
    }

    
    function handle(id) {
        request(`/lessons?id=${id}`, "Delete")

    }

    const [oneLes, setOneLes] = useState(null)

    function addVideo(item, index) {
        setOneLes(item);
        request("/lessons/urls/" + item.id, "get").then(res => {
            setUrls(res.data)
            setRodalUrl(p => !p)
        })
    }

    function rodalEditUrl() {
        setRodalUrl(p => !p)
        setUrls([])

    }

    function addUrl() {
        request("/lessons/urls/" + oneLes.id, "post").then(res => {
            request("/lessons/urls/" + oneLes.id, "get").then(res => {
                setUrls(res.data)
            })
        })
    }

    function handleInputUrl(e, item, index) {
        let data = {id: item.id, url: e.target.value}
        request("/lessons/urls/url", "put", data).then(res => {
            request("/lessons/urls/" + oneLes.id, "get").then(res => {
                setUrls(res.data)
            })
        })
    }

    function deleteUrl(id) {
        request("/lessons/urls/" + id, "delete").then(res => {
            request("/lessons/urls/" + oneLes.id, "get").then(res => {
                setUrls(res.data)
            })
        })
    }

    function addLesson() {
        if (window.confirm("Rostdan ham yangi dars qo'shmoqchimisiz?")) {
            request("/lessons/addNewLesson", "get").then(res => {
                getLessons()
                toast.success("Yangi dars qo'shildi")
            })
        }
    }

    function deleteLesson(item, index) {

        if (window.confirm("Rostdan ham " + index + " chi darsni o'chirmoqchimisiz?")){
            request("/lessons/deleteLesson/" + item.id, "delete")
                .then(r => {
                    getLessons()
                    toast.success("Dars o'chirildi")
                })
        }


    }

    return (
        <div className={"_lesson"}>
            <div className="d-flex m-3">
                <h1 className={"text-centre"}>Lessons</h1>
                <button
                    style={{transform: "scale(0.8)"}}
                    className={"btn btn-dark"}
                    onClick={addLesson}
                >Add lesson
                </button>
            </div>


            <div className={"container"}>

                <table className={"table text-center"}>
                    <thead>
                    <tr>
                        <th>lesson_order</th>
                        <th>AddVidel</th>
                        <th>isactive</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        lesson?.map((item, index) => <tr key={index}>


                            <td><h3>{index + 1}</h3></td>

                            <td>
                                <button className="btn btn-primary" onClick={() => addVideo(item, index)}>Edit</button>
                            </td>
                            <td>
                                <div className="form-check form-switch">
                                    <input className="form-check-input " type="checkbox" id="flexSwitchCheckChecked"
                                           defaultChecked={item.isactive} onChange={() => handle(item.id)}/>

                                </div>
                            </td>
                            <td>
                                <button
                                    onClick={() => deleteLesson(item, index + 1)}
                                    className="btn btn-danger"
                                >delete
                                </button>
                            </td>


                        </tr>)
                    }
                    </tbody>
                </table>
            </div>
            <Rodal height={300} visible={rodalUrl} onClose={rodalEditUrl}>
                {
                    urls?.map((item, index) => <div>
                        <div className={"d-flex gap-2 mt-3"}>
                            <input className={"form-control"} type="text" value={item.url_video ? item.url_video : ""}
                                   onChange={(e) => handleInputUrl(e, item, index)}/>
                            <button className={"btn btn-danger"} onClick={() => deleteUrl(item.id)}>delete</button>
                        </div>
                    </div>)
                }
                <div>
                    <button className={"btn btn-success w-100 mt-3"} onClick={addUrl}>Add</button>
                </div>
            </Rodal>

        </div>
    );
}

export default Index;