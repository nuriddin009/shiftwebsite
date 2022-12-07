import React, {useEffect, useState} from 'react';
import AsyncSelect from "react-select/async";
import request from "../../../shift/utils/request";
import "./index.scss"
import CreatableSelect from "react-select/creatable";
import verify from "./verified.png";
import upload from "./upload.png";
import {useForm} from "react-hook-form";
import {toast} from "react-toastify";
import Rodal from "rodal";
import Cropper from "react-easy-crop";
import getCroppedImg from "./cropImage";
import instance from "../../../shift/utils/instance";


function Certificate(props) {

    const [studyType, setStudyType] = useState("")
    const [studyTypes, setStudyTypes] = useState([])
    const [iUser, setIUser] = useState([])
    const [usersC, setUsersC] = useState([])
    const [user, setUser] = useState(null)
    const [firstNameI, setFirstNameI] = useState("")
    const [lastNameI, setLastNameI] = useState("")
    const [attachmentId, setAttachmentId] = useState("")
    const [username, setUsername] = useState("")
    const [userId, setUserId] = useState("")
    const [isNewStudyType, setIsNewStudyType] = useState(false)
    const [desc, setDesc] = useState("")
    const [study, setStudy] = useState(null)
    const [type, setType] = useState(null)
    const [forgot, setForgot] = useState(false)
    const [menu1, setMenu1] = useState(true)
    const [isDisable, setIsDisable] = useState(false)
    const [rodal, setRodal] = useState(false)
    const [img, setImg] = useState(null)
    const [crop, setCrop] = useState({x: 0, y: 0})
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState({height: 0, width: 0, x: 0, y: 0});
    const [page, setPage] = useState(0);
    const [search, setSearch] = useState("");
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);


    const {
        register,
        handleSubmit,
        reset
    } = useForm()

    useEffect(() => {
        getUsers()
        getUsersC(page, search)
    }, [])


    function loadUsers(inputValue, load) {
        instance.get("/user/search?input=" + inputValue).then(res => {
            load(res.data.content.map(item => {
                return {value: item.id, label: item.firstName + " " + item.lastName}
            }))
        })
    }


    function getUsers() {
        instance.get("/certificate/allUsers")
            .then(res => {
                setIUser(res.data)
            })
    }


    function selectUser(item) {
        setLoading(true)
        setType(null)
        setUser(item)
        setIsNewStudyType(false)
        setDesc("")
        getUsers()
        let a = iUser.filter(i => item.value === i.id)[0]
        setFirstNameI(a.firstName)
        setLastNameI(a.lastName)
        setUsername(a.username)
        setUserId(a.id)
        if (a.attachment !== null) {
            setAttachmentId(a.attachment.id)
            setLoading(false)
        } else {
            setAttachmentId("")
            setLoading(false)
        }
    }


    function handleChangeStudyType(item) {
        if (item?.__isNew__) {
            if (window.confirm("Rostdan ham : \n" + item.label.toUpperCase()
                + "\nstudyTypeni qo'shmoqchimisiz?")) {
                setIsNewStudyType(true)
                let obj = {studyType: item.label.toUpperCase()}
                instance.post("/certificate/create/studyType", obj)
                    .then(res => {
                        setType(res.data)
                        setDesc(res.data.description)
                    })
                setIsNewStudyType(true)
            }
        } else {
            instance.get("/certificate/get/" + item.value)
                .then(({data}) => {
                    setStudy(data)
                    setType({studyType: data.studyType, description: data.description})
                })
        }
    }

    function handleInputChangeStudyType(item) {
        instance.get("/certificate/get/studyTypes?search=" + item)
            .then(res => {
                let a = [];
                res.data.content.map(item =>
                    a.push({value: item.id, label: item.studyType})
                )
                setStudyTypes(a)
            })
        setStudyType(item.toUpperCase())
    }

    function checkingCertificateDescription(e) {
        setForgot(true)
        setDesc(e.target.value)
    }


    function handleFile(e) {
        let data = new FormData()
        data.append("file", e.target.files[0])
        setImg(URL.createObjectURL(e.target.files[0]))
        setRodal(true)
    }

    function editDescription() {
        let obj = {description: desc}
        instance.patch("/certificate/edit/description?studyTypeId=" + study?.id, obj)
            .then(res => {
                    setStudy(res.data)
                    setDesc(res.data.description)
                    setForgot(false)
                }
            )
    }

    function submitForm(data) {
        if (!forgot || !firstNameI || !lastNameI
            || study?.studyType || study?.description) {
            setIsDisable(true)
            setForgot(false)
            setStudy(null)
            setDesc("")
            setUser(null)
            setIsNewStudyType(false)

            let dataC = {...data, studyType: study?.studyType, description: study?.description}
            toast.success("Birozdan so'ng tayyor bo'ladi!")
            instance.post("/certificate/create/" + user.value, dataC)
                .then(res => {
                    reset({
                        firstName: "",
                        lastName: "",
                        studyType: "",
                        description: ""
                    })
                    setIsDisable(false)
                    setUser(null)
                    setStudy(null)
                    toast.success("Sertifikat yaratildi!")
                })
        } else {

        }
    }

    function getUsersC(page, search) {
        instance.get("/certificate/users?page=" + page + "&search=" + search)
            .then(res => {
                setUsersC(res.data.content)
                setTotalPages(res.data.totalPages)
            })
    }

    function deleteC(item) {
        if (window.confirm("Rostdan ham "
            + item.firstName + " " + item.lastName + " userning sertifikatini o'chirmoqchimisiz?")) {
            instance.delete("/certificate/delete/" + item.certificateId)
                .then(r => {
                    getUsersC(page, search)
                })
        }
    }

    function onCropChange(crop) {
        setCrop(crop)
    }

    function onZoomChange(zoom) {
        setZoom(zoom)
    }

    function toggleRodal() {
        setRodal(p => !p)
        setCrop({x: 0, y: 0})
        setImg(null)
        setCroppedAreaPixels({height: 0, width: 0, x: 0, y: 0})
    }

    function onCropComplete(croppedArea, croppedAreaPixels) {
        setCroppedAreaPixels(croppedAreaPixels)
    }


    async function onCrop() {
        toggleRodal()
        setCroppedAreaPixels({height: 0, width: 0, x: 0, y: 0})
        setLoading(true)
        getCroppedImg(img, croppedAreaPixels).then((res) => {
            getCropped(res)
        })
    }

    async function getCropped(res) {
        let response = await fetch(res);
        let data1 = await response.blob();
        let metadata = {
            type: 'image/jpeg'
        };
        let file = new File([data1], "test.jpg", metadata);
        let data = new FormData()
        data.append("file", file)
        instance.put("/user/addPhoto/" + userId, data)
            .then(res => {
                instance.get("/user/" + username).then(res => {
                    if (res.data.success) {
                        setAttachmentId(res.data.data.attachment.id)
                        setLoading(false)
                        setCrop({x: 0, y: 0})
                        setCroppedAreaPixels({height: 0, width: 0, x: 0, y: 0})
                    }
                })
                toast.success("User avatar updated!")
            })
    }


    function getUserCertificates(e) {
        getUsersC(page, e.target.value);
        setSearch(e.target.value)
    }


    function gotoPage(index) {
        getUsersC(index, search)
        setPage(index)
    }

    return (
        <div className={"certificate"}>

            <select
                onChange={() => {
                    setMenu1(p => !p)
                    getUsersC(page, search)
                }}
                className={"form-select my-3 w-25"}
                style={{width: "400px"}}
            >
                <option value="">Create certificate</option>
                <option value="">Certificates</option>
            </select>

            {
                menu1 ? <div className="container-top">
                        <div className="left">
                            <div className="filters">
                                <AsyncSelect
                                    loadOptions={loadUsers}
                                    defaultOptions={true}
                                    value={user}
                                    onChange={selectUser}
                                    placeholder={"Search user..."}
                                    defaultInputValue={""}
                                />

                                {
                                    user ?
                                        <div>
                                            <CreatableSelect
                                                placeholder={"StudyType"}
                                                isClearable
                                                onChange={handleChangeStudyType}
                                                onInputChange={handleInputChangeStudyType}
                                                options={studyTypes}
                                            />
                                            {
                                                !study?.studyType ?
                                                    <p className={"text-danger text-start"}>
                                                        StudyType required</p> : ""
                                            }
                                        </div>
                                        : ""
                                }

                                {
                                    study || isNewStudyType ? <label>
                                <textarea
                                    className={"form-control"}
                                    placeholder={"Enter study type description"}
                                    value={!forgot ? study?.description : desc}
                                    onChange={(e) => checkingCertificateDescription(e)}
                                />

                                        {
                                            forgot ? <p
                                                className={"text-danger"}
                                            >Description o'zgartirilgandan keyin edit tugmasini bosing!</p> : ""
                                        }
                                        <button
                                            onClick={editDescription}
                                            className={`btn float-end mt-2 ${forgot ? "btn-danger" : "btn-primary"}`}
                                        >edit description
                                        </button>
                                    </label> : ""
                                }

                            </div>

                            {
                                user ? <form onSubmit={handleSubmit(submitForm)}>

                                    <label>
                                        {
                                            loading ? <img
                                                    src={"https://i.gifer.com/H0bj.gif"}
                                                    width={100} height={100}
                                                    style={{
                                                        borderRadius: "50%",
                                                    }}
                                                    alt=""/> :
                                                attachmentId ? <img
                                                        style={{border: "3px solid blue", borderRadius: "50%"}}
                                                        width={100} height={100}
                                                        src={"http://localhost:81/api/img/" + attachmentId} alt="upload"
                                                    />
                                                    : <img
                                                        width={100} height={100}
                                                        src={upload} alt="upload"/>
                                        }

                                        <input
                                            onChange={handleFile}
                                            type="file"
                                            style={{display: "none"}}
                                            accept={"image/*"}
                                        />

                                    </label>

                                    <input
                                        type="text"
                                        className={"form-control"}
                                        placeholder={"FirstName"}
                                        {...register("firstName")}
                                        onChange={(e) => setFirstNameI(e.target.value)}
                                        value={firstNameI}
                                    />
                                    {
                                        firstNameI === "" ?
                                            <p className={"text-danger text-start"}>FirstName required</p> : ""
                                    }

                                    <input
                                        type="text"
                                        className={"form-control"}
                                        placeholder={"LastName"}
                                        {...register("lastName")}
                                        onChange={(e) => setLastNameI(e.target.value)}
                                        value={lastNameI}
                                    />
                                    {
                                        lastNameI === null ?
                                            <p className={"text-danger text-start"}>LastName required</p> : ""
                                    }
                                    <textarea
                                        placeholder={"StudyType"}
                                        className={"form-control"}
                                        value={type ? type.studyType : studyType}
                                        {...register("studyType")}
                                        readOnly={true}
                                    />
                                    {
                                        !study?.studyType ?
                                            <p className={"text-danger text-start"}>StudyType required</p> : ""
                                    }
                                    <textarea
                                        placeholder={"Certificate description"}
                                        className={"form-control"}
                                        value={desc ? desc : study ? study.description : ""}
                                        {...register("description")}
                                        readOnly={true}
                                    />
                                    {
                                        !study?.description ?
                                            <p className={"text-danger text-start"}>Description required</p> : ""
                                    }
                                    <button
                                        disabled={isDisable}
                                        className={"btn btn-dark form-control"}
                                    >Generate <img
                                        width={20} height={20}
                                        src={verify} alt="verify"
                                    />
                                    </button>
                                </form> : ""
                            }


                        </div>

                        {
                            img ? <div className="right">
                                <div className="crop-container">
                                    <Cropper
                                        image={img}
                                        crop={crop}
                                        zoom={zoom}
                                        aspect={1}
                                        onCropChange={onCropChange}
                                        onCropComplete={onCropComplete}
                                        onZoomChange={onZoomChange}
                                        cropSize={{width: 350, height: 350}}
                                    />
                                </div>
                                <div className="controls">
                                    <div className="control-upper-area">
                                        <input
                                            type="range"
                                            min={1}
                                            max={3}
                                            step={0.1}
                                            value={zoom}
                                            onInput={(e) => onZoomChange(e.target.value)}
                                            className={"slider"}
                                        />
                                    </div>

                                    <div className="buttons-area">
                                        <button className="btn btn-primary"
                                                onClick={() => toggleRodal()}
                                        >reset <i className="fa-solid fa-arrows-rotate"/></button>
                                        <button
                                            onClick={onCrop}
                                            className="btn btn-success"
                                        >crop <i className="fa-solid fa-crop-simple"/></button>

                                    </div>
                                </div>
                            </div> : ""
                        }

                    </div>
                    : <div>

                        <input
                            className={"form-control w-25"}
                            type="search"
                            placeholder={"search user..."}
                            onChange={getUserCertificates}
                        />

                        <table className={"table"}>
                            <thead>
                            <tr>
                                <th>Tr</th>
                                <th>QrCode</th>
                                <th>FullName</th>
                                <th>Certificate</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                usersC.length > 0 ? usersC.map((item, index) => <tr key={item.certificateId}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <img
                                                width={100} height={100}
                                                src={"http://localhost:81/api/certificate/qrCode/" + item.certificateId}
                                                alt={item.firstName + " " + item.lastName}
                                            />
                                        </td>
                                        <td>{item.firstName + " " + item.lastName}</td>
                                        <td>
                                            <img
                                                width={100} height={100}
                                                src={"http://localhost:81/api/certificate/image/" + item.certificateId}
                                                alt={item.firstName + " " + item.lastName}
                                            />
                                        </td>
                                        <td>

                                            <a target={'_blank'}
                                               href={"/api/certificate/download/" + item.certificateId}>
                                                <button className={"btn btn-success"}>
                                                    <i className="fa-solid fa-cloud-arrow-down"/>
                                                </button>
                                            </a>
                                            <button
                                                onClick={() => deleteC(item)}
                                                className="btn btn-danger"
                                            ><i className="fa-solid fa-trash"/>
                                            </button>
                                        </td>
                                    </tr>)
                                    : <tr>
                                        <td/>
                                        <td/>
                                        <td style={{
                                            color: "red",
                                            fontWeight: "bolder",
                                            fontSize: "30px"
                                        }}>404 not found ¯\_(ツ)_/¯
                                        </td>
                                        <td/>
                                        <td/>

                                    </tr>
                            }
                            </tbody>
                        </table>

                        {
                            totalPages > 1 ? <div className="pagination">
                                {
                                    new Array(totalPages).fill(0).map((item, index) => <button
                                        onClick={() => gotoPage(index)}
                                        className={page === index ? "btn btn-secondary m-1" : "btn btn-dark m-1"}
                                    >{index + 1}</button>)
                                }
                            </div> : ""
                        }
                    </div>
            }


        </div>
    );
}

export default Certificate;