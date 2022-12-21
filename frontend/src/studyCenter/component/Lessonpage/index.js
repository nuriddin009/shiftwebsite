import React, {useEffect, useState} from 'react';
import Rodal from "rodal";
import {toast} from "react-toastify";
import "./index.scss"
import instance from "../../../shift/utils/instance";

function Index(props) {
    const [lesson, setLesson] = useState([])
    const [urls, setUrls] = useState([])
    const [rodalUrl, setRodalUrl] = useState(false)
    
    useEffect(() => {
        getLessons()
    }, [])

    function getLessons() {
        instance.get("/lessons").then(res => {
            setLesson(res.data)
        })
    }

    
    function handle(id) {
        instance.delete(`/lessons?id=${id}`)
    }

    const [oneLes, setOneLes] = useState(null)

    function addVideo(item, index) {
        setOneLes(item);
        instance.get("/lessons/urls/" + item.id).then(res => {
            setUrls(res.data)
            setRodalUrl(p => !p)
        })
    }

    function rodalEditUrl() {
        setRodalUrl(p => !p)
        setUrls([])

    }

    function addUrl() {
        instance.post("/lessons/urls/" + oneLes.id).then(res => {
            instance.get("/lessons/urls/" + oneLes.id).then(res => {
                setUrls(res.data)
            })
        })
    }

    function handleInputUrl(e, item, index) {
        let data = {id: item.id, url: e.target.value}
        instance.put("/lessons/urls/url",  data).then(res => {
            instance.get("/lessons/urls/" + oneLes.id).then(res => {
                setUrls(res.data)
            })
        })
    }

    function deleteUrl(id) {
        instance.delete("/lessons/urls/" + id).then(res => {
            instance.get("/lessons/urls/" + oneLes.id).then(res => {
                setUrls(res.data)
            })
        })
    }

    function addLesson() {
        if (window.confirm("Rostdan ham yangi dars qo'shmoqchimisiz?")) {
            instance.get("/lessons/addNewLesson").then(res => {
                getLessons()
                toast.success("Yangi dars qo'shildi")
            })
        }
    }

    function deleteLesson(item, index) {

        if (window.confirm("Rostdan ham " + index + " chi darsni o'chirmoqchimisiz?")){
            instance.delete("/lessons/deleteLesson/" + item.id)
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