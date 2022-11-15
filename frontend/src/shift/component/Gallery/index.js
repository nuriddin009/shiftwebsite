import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import "./index.scss"
import request from "../../utils/request";
import {useLocation, useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {Modal, Button} from 'react-bootstrap';
import upload from "./upload.webp";

function Index(props) {

    const [role, setRole] = useState(null);
    const [fileId, setFileId] = useState("");
    const [seeGallery, setSeeGallery] = useState([]);
    const [firstPhoto, setFirstPhoto] = useState(null);
    const [lastPhoto, setLastPhoto] = useState(null);
    const [drag, setDrag] = useState(null);
    const [url, setUrl] = useState("");
    let pathname = useLocation().pathname;
    let navigate = useNavigate();
    const [size, setSize] = useState([0, 0]);
    const [lang, setLang] = useState(false);

    useLayoutEffect(() => {
        function updateSize() {
            setSize([window.innerWidth, window.innerHeight]);
        }

        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    useEffect(() => {
        let token = localStorage.getItem("token");
        if (token !== null) {
            request("/user/me").then(res => {
                setRole(res.data.roles[0].roleName)
            })
        }
        getGallery()
        setLang(localStorage.getItem("lang"))

    }, [props.galleries])

    function getGallery() {

        if (size[0] > 992) {
            request("/gallery/see", "get").then(res => {
                setSeeGallery(res.data.content)

            })
        } else if (size[0] <= 992 && size[0] >= 768) {
            request("/gallery/see/four", "get").then(res => {
                setSeeGallery(res.data.content)

            })
        } else if (size[0] <= 768 && size[0] !== 0) {
            request("/gallery/see/two", "get").then(res => {

                setSeeGallery(res.data.content)

            })
        }
    }

    function clickImg(id) {
        setModalShow(true)
        setUrl(id)
    }

    function handleFile(e) {
        let data = new FormData();
        data.append("file", e.target.files[0])
        request("/img/newFile", "post", data).then(res => {
            setFileId(res.data)
        })
    }

    function saveGallery() {
        if (fileId) {
            request("/shift/gallery/" + fileId, "post").then(res => {
                props.getShift();
                setAddModalShow(false)
                setFileId(null);
            })
        } else {
            toast.error("Rasm tanglang")
        }
    }

    function linkSeeMore() {
        navigate("/gallery")
    }

    //dragdrob
    const dragItem = useRef();
    const dragOverItem = useRef();

    const dragStart = (e, position, id) => {
        if (pathname !== "/") {
            dragItem.current = position;
            setFirstPhoto(id)
        }
    };
    const dragEnter = (e, position, id) => {
        if (pathname !== "/") {
            setDrag(position)
            dragOverItem.current = position;
            setLastPhoto(id)
        }
    };

    const drop = (e) => {
        if (pathname !== "/") {
            request(`/gallery/dragdrob?first=${firstPhoto}&&last=${lastPhoto}`, "put").then(res => {
                getGallery()
            })
            const copyListItems = [...seeGallery];
            const dragItemContent = copyListItems[dragItem.current];
            copyListItems.splice(dragItem.current, 1);
            copyListItems.splice(dragOverItem.current, 0, dragItemContent);
            dragItem.current = null;
            dragOverItem.current = null;
            setSeeGallery(copyListItems);
            setDrag(null)
        }
    };
    const [modalShow, setModalShow] = useState(false);

    function MyVerticallyCenteredModal(props) {
        return (
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Body>
                    <div className={"rodaldiv text-center"}>
                        <img className={"imgrodal"} src={"/api/img/" + url}
                             width={(size[0] < 650 ? 300 : 450)} alt="asd"/>
                    </div>

                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={props.onHide}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
    }

    const [AddModalShow, setAddModalShow] = useState(false);

    function CloseModal() {
        setAddModalShow(false)
        if (fileId) {
            request("/img/" + fileId, "delete")
        }
        setFileId("")
    }


    function AddMyVerticallyCenteredModal(props) {
        return (
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header>
                    <h3>Rasmlarni qo'shishda 1:1 razmerdan foydalaning</h3>
                </Modal.Header>
                <Modal.Body>
                    <div className={"d-flex justify-content-center"} style={{height: "65vh", width: "100%"}}>
                        <label style={{height: "100%"}} className={"my-label"}>
                            {
                                fileId ? <img style={{height: "100%", width: "100%"}}
                                              src={"/api/img/" + fileId} alt={"rasmni tanlang"}/>
                                    : <img width={100} height={100} src={upload} alt="upload"/>
                            }

                            <input accept={"image/*"} style={{display: "none"}}
                                   onChange={e => handleFile(e)}
                                   type="file"/>
                        </label>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button className={"button-addButton"} onClick={saveGallery}>Save</Button>
                    <Button className={"button-addButton"} onClick={CloseModal}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
    }

    return (
        <div className={"gallery_"}>
            <div className="section-5" id={"gallery"}>
                <h3 className="section-title">  {lang === null || lang === "ENG" ? "Gallery" : lang === "UZB" ? "Rasmlar" : "Галерея"}</h3>
                {
                    pathname !== "/" ?

                        role ?
                            <div className={"div-addButton"}>
                                <button className={"button-addButton"} onClick={() => setAddModalShow(true)}>Add Foto
                                </button>
                            </div>
                            : ""

                        : ""
                }
                <div className="container">
                    {
                        seeGallery?.map((item, index) =>
                            <div draggable
                                 onDragStart={(e) => dragStart(e, index, item.id)}
                                 onDragEnter={(e) => dragEnter(e, index, item.id)}
                                 onDragEnd={drop}
                                 key={item.id} className="wrapper">
                                <img onClick={() => clickImg(item.attachment?.id)}
                                     style={{
                                         cursor: pathname.startsWith("/admin") ? "grab" : "",
                                         opacity: drag === index ? "0" : ""
                                     }}
                                     src={"/api/img/" + item.attachment?.id} alt="gallery"/>
                            </div>
                        )
                    }
                </div>
                <div className="see-more-wrapper">
                    <button onClick={linkSeeMore} className="see-more">See more</button>
                </div>
            </div>

            <MyVerticallyCenteredModal
                show={modalShow}
                onHide={() => setModalShow(false)}
            />
            <AddMyVerticallyCenteredModal
                show={AddModalShow}
                onHide={() => setAddModalShow(false)}
            />


        </div>
    );
}

export default Index;