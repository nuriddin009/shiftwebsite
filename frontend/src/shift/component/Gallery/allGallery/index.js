import React, {useEffect, useLayoutEffect, useState} from 'react';
import "./index.scss"
import request from "../../../utils/request";
import {Button, Modal} from "react-bootstrap";


function Index(props) {
    const [role, setRole] = useState(null);
    const [imgId, setUrl] = useState("");
    const [currentImgId, setCurrentImgId] = useState("");
    const [allGallery, setAllGallery] = useState([])
    const [size, setSize] = useState([0, 0]);


    useLayoutEffect(() => {
        function updateSize() {
            setSize([window.innerWidth, window.innerHeight]);
        }

        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    function getAllGallery() {
        request("/gallery", "get").then(res => {
            setAllGallery(res.data)
        })
    }

    useEffect(() => {
        getAllGallery()
        let token = localStorage.getItem("token");
        if (token !== null) {
            request("/user/me").then(res => {
                // setRole(res.data.roles[0].roleName)
                if (res.data.roles.filter(item => item.roleName === "ROLE_ADMIN").length > 0) {
                    setRole("ROLE_ADMIN")
                }
            })
        }
    }, [])


    function clickImg(item) {
        setModalShow(true)
        setUrl(item)
        setCurrentImgId(item.attachment?.id)
    }

    function editImg(e) {
        let data = new FormData();
        data.append("file", e.target.files[0])
        request("/img/editFile/" + imgId.attachment.id + "/" + imgId.id + "/gallery", "put", data).then(res => {
            getAllGallery()
            setCurrentImgId(res.data)
        })
    }

    function editCheck(e, item) {
        let data = {...item, see: e.target.checked}

        request("/gallery/check", "patch", data).then(res => {

        })

    }

    function deletePhoto(item) {
        let b = window.confirm("Tasdiqlang");
        if (b) {
            request("/gallery/" + item.id, "delete").then(res => {
                getAllGallery()
            })
        }
    }

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
                    {
                        role === "ROLE_ADMIN" ?
                            <div className={"d-flex justify-content-center"}>
                                <label>
                                    <img
                                        src={"/api/img/" + currentImgId}
                                        alt={"rasmni tanlang"}
                                        width={(size[0] < 350 ? 250 : size[0] < 650 ? 350 : 450)}/>
                                    <input accept={"image/*"} style={{display: "none"}}
                                           onChange={e => editImg(e)}
                                           type="file"/>
                                </label>
                            </div>
                            :
                            <div className={"text-center"}>
                                <img
                                    width={(size[0] < 350 ? 250 : size[0] < 650 ? 350 : 450)}
                                    src={"//api/img/" + imgId?.attachment?.id} alt={"rasmni tanlang"}
                                    style={{height: "100%"}}/>
                            </div>
                    }

                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={props.onHide}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
    }

    return (
        <div className={"All-gallery"}>
            <div className="container">
                {
                    allGallery?.map((item, index) => <div key={item.id} className="wrapper">
                            <div className={"d-flex flex-column align-items-end "}>

                                <img onClick={() => clickImg(item)}
                                     src={"/api/img/" + item.attachment?.id}
                                     alt="gallery"/>
                                {
                                    role === "ROLE_ADMIN" ?
                                        <div>

                                            <input onChange={(e) => editCheck(e, item)}
                                                   type="checkbox" id="flexSwitchCheckChecked"
                                                   className={"check-img form-check-input"}
                                                   defaultChecked={item.see}/>
                                            <button className={" btn btn-danger mx-4"}
                                                    onClick={() => deletePhoto(item)}>delete
                                            </button>
                                        </div>
                                        :
                                        ""
                                }
                            </div>
                        </div>
                    )
                }
            </div>
            <MyVerticallyCenteredModal
                show={modalShow}
                onHide={() => setModalShow(false)}
            />
        </div>
    );
}

export default Index;