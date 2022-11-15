import React, {useEffect, useState} from 'react';
import "./index.scss"
import request from "../shift/utils/request";
import {toast} from "react-toastify";
import {Modal} from "react-bootstrap";
import AsyncSelect from "react-select/async";
import Rodal from "rodal";
import InputMask from 'react-input-mask';
import {Controller, useForm} from "react-hook-form";
import {useLocation} from "react-router-dom";
import logo from "../shift/file/image/imageShift/logo2.svg";
// import PhoneInput, {isValidPhoneNumber} from "react-phone-number-input";
import PhoneInput from 'react-phone-input-2';

function Index(props) {
    const [groups, setGroups] = useState([])
    const [group, setGroup] = useState(null)
    const [timeTables, setTimeTables] = useState(null)
    const [timeTab, setTimeTab] = useState(null)
    const [timeTabUser, setTimeTabUser] = useState(null)
    const [users, setUsers] = useState(null)
    const [user, setUser] = useState(null)
    const [rodal, setRodal] = useState(false);
    const [input, setInput] = useState("")
    const [showPri, setShowPri] = useState(false)
    const [userId, setUserId] = useState("")
    const [searchGroup, setSearchGroup] = useState("")
    const [lessOrMore, setLessOrMore] = useState(false)
    const [currentNew, setCurrentNew] = useState(false)
    const [blockSave, setBlockSave] = useState(false)

    // create user
    const [rodalCreateUser, setRodalCreateUser] = useState(false);

    let {pathname} = useLocation();

    let primaryColor = "#023247";
    let {reset, register, handleSubmit, formState: {errors}, control} = useForm();
    let {reset: reset1, handleSubmit: handleSubmitCloseLesson, register: registerCloseLesson} = useForm()
    let {reset: reset2, handleSubmit: handleSubmitDeleteUser, register: registerDeleteUser} = useForm()
    let {reset: reset3, handleSubmit: handleSubmitStartMonth, register: registerStartMonth} = useForm()

    function getGroups(search) {
        request("/group?search=" + search, "get").then(res => {
            setGroups(res.data)
        })
    }

    useEffect(() => {
        getGroups(searchGroup)
        let groupId = localStorage.getItem("groupId");
        setGroup(groupId)

        let groupIndex = localStorage.getItem("groupIndex");
        let timeTableId = localStorage.getItem("timeTableId");
        let timeTableIndex = localStorage.getItem("timeTableIndex");
        let timeTableItem = JSON.parse(localStorage.getItem("timeTableItem"));
        // setLessOrMore(JSON.parse(localStorage.getItem("less")).less)
        request(`/studyCenter/timeTable/${timeTableId}/${true}`, "patch").then(res => {
            getTimeTab(timeTableId)
        })
        if (groupId != null) {
            getTimeTables(groupId)
            setGroupIndex(groupIndex)
            if (timeTableId != null) {
                setTimeTableIndex(timeTableIndex)
                clickTimeTable(timeTableItem, timeTableIndex)
            }

        }
    }, [])


    function rodalVisible() {
        setInput("")
        setRodal(p => !p)
    }

    const [add, setAddGroup] = useState(null)

    function addGroup() {
        if (add) {
            request("/group/" + input, "post").then(res => {
                getGroups(searchGroup)
                setAddGroup(null)
                setInput("")
            })
        } else {
            let b = window.confirm("Gruppa qo'shishni tasdiqlang");
            if (b) {
                setAddGroup("salom")
                setInput(null)
                setTimeout(() => {
                    let el = document.getElementById("content");
                    el.scroll({
                        top: 0,
                        left: el.scrollWidth,
                        behavior: "smooth"
                    })
                }, 200)
            }
        }
    }

    function getTimeTables(id) {
        localStorage.setItem("groupId", id);
        let groupIndex = localStorage.getItem("groupIndex");
        request("/studyCenter/timeTables/" + id, "get").then(res => {
            setTimeTables(res.data)
            setGroupIndex(groupIndex)
            setUsers(null)
        })
    }

    const [groupIndex, setGroupIndex] = useState(null)

    function clickGroup(item, index) {
        setGroup(item)
        setTimeTableIndex(null)
        setGroupIndex(index)
        localStorage.setItem("groupIndex", index);
        getTimeTables(item?.id);
    }


    function getTimeTab(id) {
        localStorage.setItem("timeTableId", id);
        request("/studyCenter/timeTableUsers/" + id, "get").then(res => {
            setUsers(res.data)
            setLessOrMore(res.data?.isMore)
        })
    }

    const [timeTableIndex, setTimeTableIndex] = useState(null)

    function clickTimeTable(item, index) {
        setTimeTableIndex(index)
        localStorage.setItem("timeTableIndex", index);
        localStorage.setItem("timeTableItem", JSON.stringify(item))
        setTimeTab(item)
        setInput(item?.price)
        getTimeTab(item?.id)
    }


    const [userItem, setUserItem] = useState(null);

    function loadUsers(inputValue, load) {
        request("/user/search?input=" + inputValue, "get").then(res => {
            load(res.data.content.map(item => {
                setUserItem(item)
                return user ? user : ({value: item?.id, label: item.firstName + " " + item.lastName})
            }))
        })
    }


    function selectUser(item) {
        setUser(item)
        request("/user/me/" + item?.value, "get").then(res => {
            console.log(res.data)
            setUserItem(res.data)
        })
    }

    function handleInputPrice(e) {
        if (timeTab?.price) {
            setTimeTab({...timeTab, price: e.target.value})
        } else {
            setInput(e.target.value)
        }
    }

    function addUsers() {
        let data = {userid: user.value, timetableId: timeTab?.id, price: input ? input : timeTab?.price}
        request("/studyCenter/timeTableUsers", "post", data).then(res => {
            if (res.data.success) {
                getTimeTab(timeTab?.id)
                rodalVisible()
                setInput("")
                setUser(null)
            } else {
                toast.error(res.data.message)
            }
        })

    }

    function lessonCheck(e, item1, item) {
        request("/studyCenter/timeTableUsersData/hasinlesson/" + item1?.id + "/" + e.target.checked, "patch")
    }

    const [isFree, setIsFree] = useState(false);

    function handleInput(e, item1, index, index1, lesson) {

        // if (lesson === "isFree") {
        //     setIsFree(e.target.checked)
        //     return;
        // }

        if (lesson === "addGroup") {
            setInput(e.target.value)
            return;
        }
        let a = [...users]
        if (lesson === "lesson") {
            a[index].lessonData[index1].lessonmark = e.target.value;
        } else if (lesson === "homework") {
            a[index].lessonData[index1].homeworkmark = e.target.value;
        }
        setUsers(a);
        if (item1.lessonmark >= 0 && item1.homeworkmark >= 0 && item1.lessonmark <= 5 && item1.homeworkmark <= 5) {
            request("/studyCenter/timeTableUsersData/lessonhomework/" + item1?.id + "/" + item1.lessonmark + "/" + item1.homeworkmark, "patch").then(res => {
            })
        } else {
            toast.error("Baholash tizimiga xatolik")
        }
    }

    const [rodal2, setRodal2] = useState(false);

    function startMonth() {
        setRodal2(p => !p)
        reset3({endDate: "", startDate: ""})
        setInput("")
    }

    function startedTimetable(item) {
        setInput("")
        let data = {...item, price: input}
        let groupId = localStorage.getItem("groupId");
        request("/studyCenter/timeTablesStart/" + timeTab?.id, "post", data).then(res => {
            getTimeTables(groupId);
            getTimeTab(res.data?.id)
            setTimeTab(res.data)
            startMonth()
        })
    }

    const [rodal3, setRodal3] = useState(false);

    function deleteUser(item) {
        setTimeTabUser(item)
        setUserId(item.userid)
        deleteuserRodal()
    }

    function deleteuserRodal() {
        setRodal3(p => !p)
        reset2({gotogroup: "", whytogroup: ""})
    }

    function deleteUserTimeTable(data) {

        if (data.gotogroup >= 1 && data.gotogroup <= 12) {
            request("/studyCenter/timeTableUsers/deleteUser/" + timeTabUser?.id + "/" + userId, "post", data).then(res => {

                if (res.data.success) {
                    reset2({gotogroup: "", whytogroup: ""})
                    getTimeTab(timeTab?.id)
                    deleteuserRodal()
                    toast.success(res.data.message)
                } else {

                }

            })
        } else {

        }
    }

    function rodalVisisble() {
        setCurrentNew(true)
        setRodalCreateUser(p => !p)
        reset({
            firstName: "",
            lastName: "",
            phoneNumber: "",
            userName: "",
            fatherPhoneNumber: "",
            address: "",
            username: "",
            age: "",
            password: "",
            password_repid: "",
            activ: false
        })
    }


    function mySubmit(data) {
        let timeTableId = localStorage.getItem("timeTableId");
        if (data.firstName === "" || data.lastName === "") {
            setInput(data.firstName + " " + data.lastName)
            setUser({value: data?.id})
            toast.error("Iltimos ism familiyasini to'liq kiriting")
            return;
        }

        let phone = data.phoneNumber.substring(data.phoneNumber.length - 4);

        data = {
            ...data,
            activ: true,
            username: data.firstName.toLocaleLowerCase() + data.lastName.toLocaleLowerCase() + phone,
            password: data.firstName.toLocaleLowerCase() + data.lastName.toLocaleLowerCase() + phone,
            password_repid: data.firstName.toLocaleLowerCase() + data.lastName.toLocaleLowerCase() + phone
        }


        if (blockSave) {
            request("/user/edit", "post", data).then(res => {
                rodalVisisble()
            })
        } else {
            request("/user", "post", data).then(res => {
                let customData = res.data.data;
                setUser({value: customData.id, label: customData.firstName + " " + customData.lastName})
                console.log(res.data)
                getTimeTab(timeTableId)
                if (res.data.success) {
                    setInput(data.firstName + data.lastName)
                    rodalVisisble()
                } else {
                    toast.error(res.data.message)
                }
            })
        }
    }


    const [rodalCloseLesson, setRodalCloseLesson] = useState(false)

    function closeLesson() {
        setRodalCloseLesson(p => !p)
        reset1({lessonId: "", telegramIsmessage: false})
    }

    function submit(e) {
        let a = "";
        let done = false;
        users.map(item => {
            item.lessonData.map(item2 => {
                if (item2.lessonorder == e.lessonId && (item2.homeworkmark === 0 || item2.lessonmark === 0) && item.gotogroup == 0) {
                    a += item.firstname + " " + item.lastname + "\n" + "Homework " + item2.homeworkmark + " Lesson " + item2.lessonmark + "\n"
                }
            })
        })
        users.map(item => item.lessonData.map(item2 => {
            if (item2.lessonorder == e.lessonId && item2.done) {
                done = true
            }
        }))
        if (done || !e.telegramIsmessage) {
            request(`/studyCenter/timeTableUsersData/lessondone?lessonId=${e.lessonId}&timeTableId=${timeTab?.id}&telegramIsmessage=false`, "patch").then(res => {
                getTimeTab(timeTab?.id)
                closeLesson();
            })
        } else {
            let b = window.confirm("Studentlarni darsdagi yoki uyga vazifadagi bahosi 0 ga teng bo'lganlar\n\n" + a + "\nTasdiqlang");
            if (b) {
                request(`/studyCenter/timeTableUsersData/lessondone?lessonId=${e.lessonId}&timeTableId=${timeTab?.id}&telegramIsmessage=${e.telegramIsmessage}`, "patch").then(res => {
                    getTimeTab(timeTab?.id)
                    closeLesson();
                })
            } else {
                closeLesson();
            }
        }
    }

    function exam(e, item) {
        request("/studyCenter/timeTableUsers/exam/" + e.target.checked + "/" + item.lessonorder + "/" + timeTab?.id, "post").then(res => {
            getTimeTab(timeTab?.id)
        })
    }


    function seeUser(item) {
        setBlockSave(true)
        request("/user/getoneUser/" + item.userid, "get").then(res => {
            rodalVisisble()
            reset(res.data.data)
        })
    }

    function isvideoallowedCheck(e, item, item1) {
        request("/studyCenter/timeTableUsersData/isvideoallowed/" + item?.id + "/" + e.target.checked, "patch").then(res => {
            if (res.data.success) {
                toast.success(res.data.message)
            } else {
                toast.error(res.data.message)
            }
        })
    }


    function deleteTTUD(id, item) {
        if (window.confirm("Are you sure? " + id)) {
            request("/UserLesson/deleteT?id=" + id, "delete").then(res => {

            })
        }
    }

    function getGroupsBySearch(e) {
        getGroups(e.target.value)
        setSearchGroup(e.target.value)
    }

    const [editGroupIndex, setEditGroupIndex] = useState(null);

    function editGroupName(item) {
        if (window.confirm(item.name + " guruh nomini tahrirlamoqchimisiz?")) {
            setInput(item.name)
            setEditGroupIndex(item?.id)
        }
    }


    function editGroupNameReq(item) {
        if (input !== "") {
            request("/group/edit/" + item?.id + "/" + input, "patch").then(res => {
                setInput("")
                setEditGroupIndex(null)
                getGroups(searchGroup)
            })
        } else {
            toast.error("Group name must not be empty!")
        }
    }

    function getLessOrMore(e) {
        setLessOrMore(!e.target.checked)
        let timeTableId = localStorage.getItem("timeTableId");
        request(`/studyCenter/timeTable/${timeTableId}/${!e.target.checked}`, "patch").then(res => {
            getTimeTab(timeTableId)
        })
    }

    const [editTimeTableIndex, setEditTimeTableIndex] = useState(null);
    const [timeTableName, setTimeTableName] = useState("");

    function addTimeTable() {
        if (window.confirm("Tasdilang grupaga yangi time-table qo'shishni")) {
            setEditTimeTableIndex("add time table time")
        }
    }

    function addTimeTableR() {
        if (timeTableName !== "") {
            let groupId = localStorage.getItem("groupId");
            request("/studyCenter/timeTables/" + groupId + "/" + timeTableName + "/" + isFree, "post").then(res => {
                getTimeTables(groupId);
                setTimeTableIndex(null)
                setTimeTableName("")
                setIsFree(false)
                setEditTimeTableIndex(null)
            })
        } else {
            toast.error("Please fill in the group name")
        }
    }

    const [editIndex, setEditIndex] = useState(null)

    function editTimeTable(item) {
        if (window.confirm("Do you want to edit " + item.tableName + " time table?")) {
            setEditIndex(item?.id)
            setTimeTableName(item.tableName)
        }
    }

    function editTimeTable1() {
        let groupId = localStorage.getItem("groupId");
        if (timeTableName !== "") {
            request("/studyCenter/edit/timeTableName/" + editIndex + "/" + timeTableName, "patch").then(res => {
                getTimeTables(groupId)
                getTimeTab(editIndex)
                setEditTimeTableIndex(null)
                setEditIndex(null)
                setTimeTableName("")
            })
        } else {
            toast.error("Please fill in the time table name")
        }
    }

    return (
        <div className={`studyCenter  ${pathname === "/Mentor" ? "mw-100" : ""}`}>
            <div className={"all-time"}>
                <input
                    type="search"
                    className={"form-control m-3 w-25"}
                    placeholder={"search group ..."}
                    onChange={getGroupsBySearch}
                    style={{minWidth: "350px"}}
                />

                <div className={"group-btn gap-1"} id={"content"}>
                    <div className={"group-btn-child"}>
                        {
                            groups?.map((item, index) => <div
                                className={"btnjon-father"}
                                key={item?.id}>
                                {
                                    editGroupIndex === item?.id ?
                                        <div style={{minWidth: "300px", position: "relative", top: "10px"}}
                                             className={"d-flex m-2 w-25"}>
                                            <input
                                                type="text"
                                                value={input}
                                                className={"form-control"}
                                                onChange={(e) => setInput(e.target.value)}
                                            />
                                            <button
                                                onClick={() => editGroupNameReq(item)}
                                                className={"btn btn-dark"}
                                            >edit
                                            </button>
                                        </div>
                                        : <button
                                            className={`btn  btnjon ${groupIndex == index ? 'bg-primary' : ''}`}
                                            onClick={() => clickGroup(item, index)}>{item.name}&nbsp;&nbsp;
                                            <i
                                                style={{fontSize: "20px"}}
                                                className="fa-solid fa-pen-to-square text-danger"
                                                onClick={() => editGroupName(item)}
                                            />
                                        </button>
                                }
                            </div>)
                        }
                        {
                            add && editIndex === null ?
                                <div className={"d-flex align-items-center"}>
                                    <input type="text" onChange={e => handleInput(e, null, null, null, "addGroup")}
                                           value={input} style={{width: "200px"}} placeholder={"Group Name"}
                                           className="form-control"/>
                                </div>
                                : ""
                        }

                        <button onClick={addGroup} className={"btn btnjon"}>{add ? "Save" : "Add group"}</button>

                    </div>
                </div>


                <div className={"time-table"}>
                    <div className={"time-table-child"}>
                        {
                            timeTables?.map((item, index) =>
                                <div key={item?.id} className={"d-flex flex-column"}>
                                    {
                                        editIndex === item?.id ? <div>
                                                <input
                                                    className={"form-control"}
                                                    placeholder={"Group name"}
                                                    type="text"
                                                    value={timeTableName}
                                                    onChange={(e) => setTimeTableName(e.target.value)}
                                                />
                                                <div className={"btn-group"}>
                                                    <button className={"btn btn-primary"}
                                                            onClick={() => editTimeTable1()}
                                                    >edit
                                                    </button>
                                                    <button
                                                        onClick={() => setEditIndex(null)}
                                                        className={"btn btn-danger"}>cancel
                                                    </button>
                                                </div>
                                            </div>
                                            : <button key={item?.id} onClick={() => clickTimeTable(item, index)}
                                                      className={`btnjon btn ${timeTableIndex == index ? 'bg-primary' : ""}`}>
                                <span className={"d-block"}>
                                    <i
                                        className="fa-solid fa-pencil"
                                        onClick={() => editTimeTable(item)}
                                    />
                                    <br/>
                                    {item.tableName ? item.tableName : index + "-month"}
                                </span>
                                                <span className={"d-block"}>
                                Price={(item?.price ? item?.price : 0)}
                                </span>
                                            </button>
                                    }
                                </div>
                            )
                        }
                        {
                            group && !editTimeTableIndex ?
                                <button onClick={addTimeTable} className={"btn btn-success btnjon"}>Add</button>
                                : editTimeTableIndex ?
                                    <div className={"d-flex align-items-center mx-3"}>
                                        <input
                                            type="text"
                                            className={"form-control mx-1"}
                                            placeholder={"Time table name"}
                                            value={timeTableName}
                                            onChange={(e) => setTimeTableName(e.target.value)}
                                        />
                                        <br/>
                                        <label>isFree
                                            <div className="form-check form-switch">
                                                <input
                                                    value={isFree}
                                                    onChange={(e) => setIsFree(e.target.checked)}
                                                    className="form-check-input d-inline-block" type="checkbox"
                                                    id="flexSwitchCheckChecked"/>
                                            </div>
                                        </label>
                                        <div className="btn-group mx-2">
                                            <button
                                                onClick={addTimeTableR}
                                                style={{height: "50px"}}
                                                className={"btn btn-success"}
                                            >Add
                                            </button>
                                            <button onClick={() => setEditTimeTableIndex(null)} style={{height: "50px"}}
                                                    className={"btn btn-danger"}>cancel
                                            </button>
                                        </div>
                                    </div>
                                    : ""
                        }

                    </div>
                </div>
                {
                    users ?
                        <div className={"d-flex align-items-end gap-2"}>
                            <button className={"btn btn-outline-dark mt-3"} onClick={rodalVisible}>Add Student</button>

                            {
                                users.length >= 1 && users && pathname !== "/Mentor" ?
                                    <label><h5>Show-Price</h5> <input type="checkbox"
                                                                      className="form-check-input "
                                                                      id="flexSwitchCheckChecked"
                                                                      onChange={() => setShowPri(p => !p)}/></label>
                                    : ""
                            }
                            {
                                !timeTab?.isStart ?
                                    <button className={"btn btn-outline-dark btn-start-time"}
                                            onClick={startMonth}>Start-Month</button>
                                    : ""
                            }
                            {
                                users.length > 0 ?
                                    <button className={"btn btn-outline-dark"} onClick={closeLesson}>Kunni
                                        yopish</button>
                                    : ""
                            }
                            {
                                users.length >= 1 ?
                                    <label
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            gap: "10px",
                                            marginLeft: "20px",
                                            transform: "scale(0.8)"
                                        }}>
                                        <div className="form-check form-switch">
                                            <input
                                                style={{width: "80px", height: "40px"}}
                                                onChange={getLessOrMore}
                                                value={lessOrMore}
                                                className="form-check-input d-inline-block" type="checkbox"
                                                id="flexSwitchCheckChecked"/>
                                        </div>
                                        <h1>Less&nbsp;data</h1>
                                    </label>

                                    : ""
                            }
                        </div>
                        : ""
                }

            </div>

            <div className="container-user-lesson">
                <div className="lesson-wrapper">
                    {users?.length > 0 ?
                        <div className="user_data">

                            <table className={"table  text-center"}>
                                <thead>
                                <th className={"user-colom"}>
                                    <h5>Students={users?.length >= 1 ? users?.filter(item => item.gotogroup == 0).length : ""}</h5>
                                </th>
                                {users[0].lessonData.map((item, index) => <th
                                    key={index}
                                    className={`headcol`}
                                >
                                    <div>
                                        <h5>Lesson-{index + 1}</h5>
                                        <label>Imtixon <input disabled={item.done}
                                                              defaultChecked={item.exam}
                                                              onChange={(e) => exam(e, item)}
                                                              type="checkbox" id="flexSwitchCheckChecked"
                                                              className={"form-check-input"}
                                        />
                                        </label>
                                    </div>
                                </th>)}
                                </thead>
                                <tbody>
                                {
                                    users?.map((item, index) =>
                                        <tr key={item?.id} className={`user-data-coloum `}>
                                            <td className={`user-colom ${item.gotogroup !== 0 ? "bg-secondary" : ""}`}>
                                                <button
                                                    className={"btn btnjon"}>
                                                    {

                                                        <span onClick={() => deleteUser(item)}
                                                              className={"spanDeleteUser text-white"}>X</span>

                                                    }
                                                    <p
                                                        style={{color: item.parentsData.length === 0 ? "red" : ""}}
                                                        onClick={() => seeUser(item)}>
                                                        {item.firstname + " " + item.lastname}
                                                        {
                                                            showPri ?
                                                                <div>
                                                                    {item.price} so'm{<br/>}
                                                                    {item.phone}
                                                                    <br/>
                                                                    {item.deletedate ? "Delete=" + item.deletedate : ""}
                                                                </div>
                                                                : ""
                                                        }

                                                    </p>
                                                </button>
                                            </td>
                                            {item.lessonData?.map((item1, index1) => <td key={item1?.id}
                                                                                         style={{
                                                                                             background: (item1.done ? primaryColor : ""),
                                                                                             color: (item1.done ? "white" : "")
                                                                                         }}
                                                                                         className={`row-user ${item.gotogroup >= item1.lessonorder ? "bg-secondary" : ""}`}>


                                                <div>
                                                    <p>
                                                        {/*<span*/}
                                                        {/*    onClick={() => alert(item1.id)}*/}
                                                        {/*    className={"text-danger"}*/}
                                                        {/*>*/}
                                                        {/*        <i*/}
                                                        {/*            className="fa-solid fa-xmark"*/}
                                                        {/*        /> Tegma*/}
                                                        {/*</span>*/}
                                                        {
                                                            item1.done && item1.exam ?
                                                                <div className={"mt-4"}>
                                                                    Imtixon={item1.lessonmark}
                                                                </div> : item1.exam ?
                                                                    <div className={"mt-4"}>
                                                                        Imtihon=
                                                                        <select
                                                                            style={{outline: "none"}}
                                                                            value={item1.lessonmark}
                                                                            onChange={e => handleInput(e, item1, index, index1, "lesson")}
                                                                            defaultValue={0}
                                                                        >
                                                                            <option value="0">0</option>
                                                                            <option value="1">1</option>
                                                                            <option value="2">2</option>
                                                                            <option value="3">3</option>
                                                                            <option value="4">4</option>
                                                                            <option value="5">5</option>
                                                                        </select>

                                                                    </div> :

                                                                    <div>
                                                                        {item1.done || item.gotogroup !== 0 ?
                                                                            <div className={"d-flex"}>
                                                                                Lesson&nbsp;grade={item1.lessonmark}
                                                                            </div>
                                                                            :
                                                                            <div className={"d-flex"}>
                                                                                Lesson&nbsp;grade=
                                                                                <select
                                                                                    style={{outline: "none"}}
                                                                                    value={item1.lessonmark}
                                                                                    onChange={e => handleInput(e, item1, index, index1, "lesson")}
                                                                                    defaultValue={0}
                                                                                >
                                                                                    <option value="0">0</option>
                                                                                    <option value="1">1</option>
                                                                                    <option value="2">2</option>
                                                                                    <option value="3">3</option>
                                                                                    <option value="4">4</option>
                                                                                    <option value="5">5</option>
                                                                                </select>
                                                                            </div>
                                                                        }
                                                                        <div>
                                                                            <p>
                                                                                {item1.done || item.gotogroup !== 0 ?
                                                                                    <div
                                                                                        className={"mt-3"}>homework={item1.homeworkmark}</div> :
                                                                                    <div>
                                                                                        homework=
                                                                                        <select
                                                                                            style={{outline: "none"}}
                                                                                            value={item1.homeworkmark}
                                                                                            onChange={e => handleInput(e, item1, index, index1, "homework")}
                                                                                            defaultValue={0}
                                                                                        >
                                                                                            <option value="0">0</option>
                                                                                            <option value="1">1</option>
                                                                                            <option value="2">2</option>
                                                                                            <option value="3">3</option>
                                                                                            <option value="4">4</option>
                                                                                            <option value="5">5</option>
                                                                                        </select>
                                                                                    </div>
                                                                                }
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                        }

                                                    </p>
                                                </div>
                                                <label>
                                                               <span>
                                                                Kelganmi &nbsp;
                                                               </span>
                                                    <input type="checkbox" id="flexSwitchCheckChecked"
                                                           disabled={item1.done || item.gotogroup !== 0}
                                                           className={"form-check-input lesson-check"}
                                                           onChange={(e) => lessonCheck(e, item1, item)}
                                                           defaultChecked={item1.hasinlesson}/>
                                                </label>
                                                {
                                                    timeTab?.isFree ?

                                                        <label className={"d-flex g-1"}>
                                                            Videoga ruxsat
                                                            <div className="form-check form-switch">
                                                                <input type="checkbox"
                                                                       id="flexSwitchCheckChecked"
                                                                       disabled={item1.done || item.gotogroup !== 0}
                                                                       className={"form-check-input "}
                                                                       onChange={(e) => isvideoallowedCheck(e, item1, item)}
                                                                       defaultChecked={item1.isvideoallowed}/>
                                                            </div>

                                                        </label>

                                                        : ""
                                                }
                                            </td>)
                                            }
                                        </tr>
                                    )
                                }
                                </tbody>

                            </table>

                        </div>
                        : ""
                    }
                </div>


            </div>
            {/*Add Student Rodal*/}
            <Rodal visible={rodal} onClose={rodalVisible}>
                <div className={"card-body my-2"}>
                    <div>
                        {
                            !userItem?.activ ? <h6>No active user
                                <i
                                    style={{fontSize: "25px"}}
                                    className="fa-solid fa-user-lock text-danger"
                                />
                            </h6> : ""
                        }

                        <div className={"d-flex"} style={{width: "100%"}}>

                            <AsyncSelect
                                loadOptions={loadUsers}
                                defaultOptions={true}
                                onChange={selectUser}
                                defaultInputValue={input}
                                styles={
                                    {
                                        container: (provided, state) => ({
                                            ...provided,
                                            width: '100%'
                                        }),
                                    }
                                }
                            />
                            <button className={"btn btn-primary"} onClick={rodalVisisble}>Create</button>
                        </div>

                        <InputMask mask="999 999" value={timeTab?.price ? timeTab?.price : input} maskChar=" "
                                   onChange={handleInputPrice}>
                            {(props) => <input placeholder={"Price"} className={'form-control my-1'}
                                               type="text"/>}
                        </InputMask>
                    </div>
                </div>
                <Modal.Footer>
                    <button className={"btn btn-dark"} onClick={addUsers}>Add student</button>
                    <button className={"btn btn-dark"} onClick={rodalVisible}>Close</button>
                </Modal.Footer>
            </Rodal>
            {/*Start TimeTable Rodal*/}
            <Rodal visible={rodal2} height={320} onClose={startMonth}>
                <h1>Started Table</h1>
                <div className={"card-body my-2"}>
                    <div>
                        <form id={"my-form-started"} onSubmit={handleSubmitStartMonth(startedTimetable)}>
                            <InputMask mask="999 999" value={input} maskChar={" "} onChange={handleInputPrice}>
                                {(props) => <input placeholder={"Price"} className={'form-control my-2'}
                                                   type="text"/>}
                            </InputMask>

                            <label>
                                <input type="date" className={"form-control"} {...registerStartMonth("startDate")}/>
                                <p>StartDate</p>
                            </label>
                            <label>
                                <input type="date" className={"form-control"} {...registerStartMonth("endDate")}/>
                                <p>EndDate</p>
                            </label>
                        </form>
                    </div>
                </div>
                <Modal.Footer>
                    <button className={"btn btn-outline-dark"} onClick={startMonth}>Close</button>
                    <button form={"my-form-started"} className={"btn btn-outline-dark"}>Start</button>
                </Modal.Footer>
            </Rodal>
            <Rodal visible={rodal3} height={550} onClose={deleteuserRodal}>
                <h1>Delete student</h1>
                <div className={"card-body my-2"}>
                    <div>
                        <form id={"my-form-deleteuser"} onSubmit={handleSubmitDeleteUser(deleteUserTimeTable)}>
                            <label>
                                <p>O'quvchini oxirgi darsini kiriritng</p>
                                <input type="number"{...registerDeleteUser("gotogroup")}
                                       className={"form-control w-75 my-3"}
                                       min={1} max={16}/>
                            </label>
                            <textarea placeholder={"Description..."}
                                      className={"form-control  "} {...registerDeleteUser("whytogroup")} cols="30"
                                      rows="10"/>
                        </form>
                    </div>
                </div>
                <Modal.Footer>
                    <button form={"my-form-deleteuser"} className={"btn btn-dark"}>delete</button>
                    <button className={"btn btn-dark"} onClick={deleteuserRodal}>Close</button>
                </Modal.Footer>
            </Rodal>

            {/*user rodal*/}

            <Rodal height={530} width={700} visible={rodalCreateUser} onClose={rodalVisisble}>
                <div className="card register-card">
                    <div className="card-header bgCollor"><img width={150} src={logo} alt="logo"/></div>
                    <div className="card-body card_body">
                        <form id={"my_form"} onSubmit={handleSubmit(mySubmit)}>

                            <div className="d-flex gap-3">
                                <div className={"w-50"}>
                                    <input className={"form-control my-1"} type="text"
                                           placeholder={"FirstName..."} {...register("firstName", {required: true})}/>
                                    {errors.firstName ? <p className={"text-danger"}>Ismni kiritish majburiy</p> : ""}
                                </div>

                                <div className={"w-50"}>
                                    <input className={"form-control my-1"} type="text"
                                           placeholder={"LastName..."} {...register("lastName", {required: true})}/>
                                    {errors.lastName ?
                                        <p className={"text-danger"}>Familyani kiritish majburiy</p> : ""}
                                </div>
                            </div>


                            <div className="d-flex gap-3">
                                <div className={"w-50"}>
                                    <label htmlFor="phoneNumber">Phone Number</label>
                                    <Controller
                                        name="phoneNumber"
                                        control={control}
                                        render={({field: {onChange, value}}) => (
                                            <PhoneInput
                                                country={"uz"}
                                                containerClass={"phone_input"}
                                                value={value}
                                                placeholder={"+998 99 123 45 67"}
                                                onChange={onChange}
                                                prefix={"+"}
                                            />
                                        )}
                                    />
                                    {errors["phoneNumber"] && (
                                        <p className="error-message text-danger">Invalid Phone</p>
                                    )}
                                </div>

                                <div className={"w-50"}>
                                    Masul shaxs
                                    <Controller
                                        name="fatherPhoneNumber"
                                        control={control}
                                        render={({field: {onChange, value}}) => (
                                            <PhoneInput
                                                country={"uz"}
                                                containerClass={"phone_input"}
                                                value={value}
                                                placeholder={"+998 99 123 45 67"}
                                                onChange={onChange}
                                                prefix={"+"}
                                            />
                                        )}
                                    />


                                    {errors["phoneNumber"] && (
                                        <p className="error-message text-danger">Invalid Phone</p>
                                    )}
                                </div>
                            </div>

                            <div className={"d-flex align-items-center"}>

                                <input style={{width: "100px"}} min={6} max={100} className={"form-control my-1"}
                                       type="number"
                                       placeholder={"Age"} {...register("age", {required: true, min: 7, max: 70})}/>

                                <label className={"d-flex align-items-start"}>
                                    <p className={"mx-2"}>
                                        isActive
                                    </p>
                                    <input className={"form-check-input my-1"} type="checkbox"
                                           id="flexSwitchCheckChecked" placeholder={"Age"} {...register("activ")}/>
                                </label>
                            </div>


                            <div className="d-flex gap-3">
                                <div className="w-50">
                                    <input className={"form-control my-1"} type="text" minLength={6}
                                           placeholder={"Login"} {...register("username", {
                                        minLength: 5
                                    })}/>
                                    {errors.username ?
                                        <p className={"text-danger"}>Username 6 ta harfdan kam bo'lmasligi
                                            kerak</p> : ""}
                                    <input className={"form-control my-1"} type="password" minLength={6}
                                           placeholder={"Password"} {...register("password")}/>
                                    <input className={"form-control my-1"} type="password" minLength={6}
                                           placeholder={"Password Repid"} {...register("password_repid")}/>
                                </div>
                                <div className={"w-50"}>
                                  <textarea className={"form-control my-1"} cols="30" rows="2"
                                            placeholder={"Address"} {...register("address", {required: true})}/>
                                    {errors.address ? <p className={"text-danger"}>Manzil kiritish majburiy</p> : ""}
                                </div>
                            </div>


                        </form>

                    </div>
                    <div className="card-footer  text-end bgCollor">
                        <button onClick={rodalVisisble} className={"btn btn-danger"}>cancel</button>
                        <button form={"my_form"} className={"btn btn-dark"}>{currentNew ? "save" : "edit"}</button>
                    </div>
                </div>
            </Rodal>

            {/*user rodal*/}

            {/*close lesson */}
            <Rodal visible={rodalCloseLesson} height={300} onClose={closeLesson}>
                <div className={"card-body my-2"}>
                    <div className="card-body">
                        <form id={"my-form-lesson"} onSubmit={handleSubmitCloseLesson(submit)}>

                            <input type="number" min={1} max={16} className={"form-control"}
                                   placeholder={"Darsni kiriting"} {...registerCloseLesson("lessonId")}/>
                            <div className="form-check form-switch">
                                <label className={"form-label d-flex m-3"}><h6 style={{margin: 0}}>Telegramga sms
                                    yuborish</h6>
                                    <input type="checkbox"
                                           id="flexSwitchCheckChecked"
                                           className={"form-check-input mx-3"} {...registerCloseLesson("telegramIsmessage")}/>
                                </label>
                            </div>
                        </form>
                    </div>
                    <div className="card-footer d-flex justify-content-end gap-4">
                        <button onClick={closeLesson} className={"btn btn-outline-dark"}>Close</button>
                        <button type={'submit'} form={"my-form-lesson"} className={"btn btn-outline-dark"}>Save</button>
                    </div>
                </div>
            </Rodal>
        </div>
    );
}

export default Index;