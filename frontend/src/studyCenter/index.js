import React, {useEffect, useState} from 'react';
import "./index.scss"
import {toast} from "react-toastify";
import {Modal} from "react-bootstrap";
import AsyncSelect from "react-select/async";
import Rodal from "rodal";
import InputMask from 'react-input-mask';
import {Controller, useForm} from "react-hook-form";
import {useLocation} from "react-router-dom";
import logo from "../shift/file/image/imageShift/logo2.svg";
import PhoneInput from 'react-phone-input-2';
import instance from "../shift/utils/instance";
import Button from "@mui/material/Button";
import {
    ButtonGroup,
    Dialog,
    FormControl,
    Grid,
    Select as SelectMui,
    InputLabel,
    Switch,
    TextField
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Select from 'react-select'


function Index(props) {


    let {isSuper} = props

    const [groups, setGroups] = useState([])
    const [group, setGroup] = useState(null)
    const [timeTables, setTimeTables] = useState(null)
    const [timeTab, setTimeTab] = useState(null)
    const [timeTabUser, setTimeTabUser] = useState(null)
    const [users, setUsers] = useState(null)
    const [user, setUser] = useState(null)
    const [rodal, setRodal] = useState(false);
    const [con, setCon] = useState(false);
    const [input, setInput] = useState("")
    const [showPri, setShowPri] = useState(false)
    const [userId, setUserId] = useState("")
    const [searchGroup, setSearchGroup] = useState("")
    const [lessOrMore, setLessOrMore] = useState(false)
    const [currentNew, setCurrentNew] = useState(false)
    const [blockSave, setBlockSave] = useState(false)
    const [newPayment, setNewPayment] = useState(false)
    const [payment, isPayment] = useState(false)
    const [amount, setAmount] = useState('')
    const [desc, setDesc] = useState('')
    const [value, setValue] = React.useState(null);
    const [options, setOptions] = useState([])
    const [from, setFrom] = useState(0)

    const [archive, setArchive] = useState(false)
    const [archiveGroups, setArchiveGroups] = useState([])
    const [archiveOptions, setArchiveOptions] = useState([])

    const [groupIndex1, setGroupIndex1] = useState("")

    // create user
    const [rodalCreateUser, setRodalCreateUser] = useState(false);

    let {pathname} = useLocation();

    let primaryColor = "#023247";
    let {reset, register, handleSubmit, formState: {errors}, control} = useForm();
    let {reset: reset1, handleSubmit: handleSubmitCloseLesson, register: registerCloseLesson} = useForm()
    let {reset: reset2, handleSubmit: handleSubmitDeleteUser, register: registerDeleteUser} = useForm()
    let {reset: reset3, handleSubmit: handleSubmitStartMonth, register: registerStartMonth} = useForm()


    function getGroups(search) {
        instance.get("/group", {params: {search}}).then(res => {
            setGroups(res.data)
            let a = []
            res.data?.map(item => a.push({value: item?.id, label: item?.name}))
            setArchiveGroups(a)
        })
    }

    function archiveModal() {
        setArchive(!archive)
    }

    useEffect(() => {
        getGroups(searchGroup)
        getPayTypes()
        let groupId = localStorage.getItem("groupId");
        setGroup(groupId)

        getArchivedGroups()

        let groupIndex = localStorage.getItem("groupIndex");
        setGroupIndex1(groupIndex);
        let timeTableId = localStorage.getItem("timeTableId");
        let timeTableIndex = localStorage.getItem("timeTableIndex");
        let timeTableItem = JSON.parse(localStorage.getItem("timeTableItem"));

        if (groupId != null) {
            getTimeTables(groupId)
            setGroupIndex(groupIndex)
            if (timeTableId != null) {
                setTimeTableIndex(timeTableIndex)
                clickTimeTable(timeTableItem, timeTableIndex)
            }

        }
    }, [])


    function getArchivedGroups() {
        instance.get("/group/archive").then(res => {
            let a = []
            res.data?.map(item => a.push({value: item?.id, label: item?.name}))
            setArchiveOptions(a)
        })
    }

    function changeArchive(e) {
        console.log(e)
        instance.patch("/group/archive", e).then(res => {
            getGroups(searchGroup)
            getArchivedGroups()
        })
    }


    function rodalVisible() {
        setInput("")
        setRodal(p => !p)
    }

    function rodalVisibleCon() {
        setCon(p => !p)
    }


    const [add, setAddGroup] = useState(null)

    function addGroup() {
        if (add) {
            instance.post("/group/" + input).then(res => {
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
        instance.get(`/studyCenter/timeTables/${id}`).then(res => {
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
        setGroupIndex1(index)
    }


    function getTimeTab(id) {
        localStorage.setItem("timeTableId", id);
        instance.get(`/studyCenter/timeTableUsers/${id}`).then(res => {
            setUsers(res.data)
        })
    }

    const [timeTableIndex, setTimeTableIndex] = useState(null)

    function clickTimeTable(item, index) {
        setTimeTableIndex(index)
        console.log(item?.id)
        localStorage.setItem("timeTableIndex", index);
        localStorage.setItem("timeTableItem", JSON.stringify(item))
        setTimeTab(item)
        setInput(item?.price)
        getTimeTab(item?.id)
    }


    function getPayTypes() {
        instance.get("/pay_type").then(({data}) => {
            let a = data.data.map(item => ({label: item?.type, value: item?.id,}));
            setOptions(a)
        })
    }


    const [userItem, setUserItem] = useState(null);

    function loadUsers(inputValue, load) {
        instance.get(`/user/search`, {params: {input: inputValue}}).then(res => {
            load(res.data.content.map(item => {
                setUserItem(item)
                return user ? user : ({value: item?.id, label: item.firstName + " " + item.lastName})
            }))
        })
    }


    function selectUser(item) {
        setUser(item)
        instance.get(`/user/me/${item?.value}`).then(res => {
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
        instance.post("/studyCenter/timeTableUsers", data).then(res => {
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
        instance.patch(`/studyCenter/timeTableUsersData/hasinlesson/${item1?.id}/${e.target.checked}`)
    }

    const [isFree, setIsFree] = useState(false);

    function handleInput(e, item1, index, index1, lesson) {


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
            instance.patch(`/studyCenter/timeTableUsersData/lessonhomework/${item1?.id}/${item1.lessonmark}/${item1.homeworkmark}`).then(res => {
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
        instance.post("/studyCenter/timeTablesStart/" + timeTab?.id, data)
            .then(res => {
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
            instance.post("/studyCenter/timeTableUsers/deleteUser/" + timeTabUser?.id + "/" + userId, data).then(res => {

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
        setFrom("")
        setValue("")
        setAmount("")
        setDesc("")
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
            phoneNumber: data.phoneNumber.startsWith("+") ? data.phoneNumber : "+" + data.phoneNumber,
            fatherPhoneNumber: data.fatherPhoneNumber.startsWith("+") ? data.fatherPhoneNumber : "+" + data.fatherPhoneNumber,
            username: data.firstName.toLocaleLowerCase() + data.lastName.toLocaleLowerCase() + phone,
            password: data.firstName.toLocaleLowerCase() + data.lastName.toLocaleLowerCase() + phone,
            password_repid: data.firstName.toLocaleLowerCase() + data.lastName.toLocaleLowerCase() + phone
        }


        if (blockSave) {
            instance.post("/user/edit", data).then(res => {
                rodalVisisble()
            })
        } else {
            instance.post("/user", data).then(res => {
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
            instance.patch(`/studyCenter/timeTableUsersData/lessondone?lessonId=${e.lessonId}&timeTableId=${timeTab?.id}&telegramIsmessage=false`).then(res => {
                getTimeTab(timeTab?.id)
                closeLesson();
            })
        } else {
            let b = window.confirm("Studentlarni darsdagi yoki uyga vazifadagi bahosi 0 ga teng bo'lganlar\n\n" + a + "\nTasdiqlang");
            if (b) {
                instance.patch(`/studyCenter/timeTableUsersData/lessondone?lessonId=${e.lessonId}&timeTableId=${timeTab?.id}&telegramIsmessage=${e.telegramIsmessage}`).then(res => {
                    getTimeTab(timeTab?.id)
                    closeLesson();
                })
            } else {
                closeLesson();
            }
        }
    }

    function exam(e, item) {
        instance.post("/studyCenter/timeTableUsers/exam/" + e.target.checked + "/" + item.lessonorder + "/" + timeTab?.id).then(res => {
            getTimeTab(timeTab?.id)
        })
    }

    function makePayment() {
        if ((newPayment && (!value || !amount)) || (!newPayment && !amount)) toast.error("pay type and amount should be filled!")
        if (!newPayment && from?.balance < amount) toast.error("not enough money")
        else instance.post("/payment/" + from.timeTableId, {payType: value, amount, desc, newPayment}).then(res => {
            getTimeTab(from.timetable)
            rodalVisisble()
        })
    }

    function seeUser(item) {
        console.log(item)
        setBlockSave(true)
        instance.get("/user/getoneUser/" + item.userid).then(res => {
            rodalVisisble()
            console.log(item.id)
            setFrom({...res?.data?.data, timeTableId: item.id, paid: item.paid, timetable: item.timeTableId})
            reset(res.data.data)
        })
    }

    function isvideoallowedCheck(e, item, item1) {
        instance.patch("/studyCenter/timeTableUsersData/isvideoallowed/" + item?.id + "/" + e.target.checked).then(res => {
            if (res.data.success) {
                toast.success(res.data.message)
            } else {
                toast.error(res.data.message)
            }
        })
    }


    function deleteTTUD(id, item) {
        if (window.confirm("Are you sure? " + id)) {
            instance.delete("/UserLesson/deleteT?id=" + id).then(res => {

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
            instance.patch("/group/edit/" + item?.id + "/" + input).then(res => {
                setInput("")
                setEditGroupIndex(null)
                getGroups(searchGroup)
            })
        } else {
            toast.error("Group name must not be empty!")
        }
    }

    const styleSelect = {
        multiValueLabel: (provided, state) => ({
            ...provided,
            width: '100px'
        }),
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
            instance.post("/studyCenter/timeTables/" + groupId + "/" + timeTableName + "/" + isFree).then(res => {
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
            instance.patch("/studyCenter/edit/timeTableName/" + editIndex + "/" + timeTableName).then(res => {
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


            <Button
                onClick={archiveModal}
                style={{margin: "20px", marginRight: "auto"}}
                variant={"contained"} color={"primary"}>
                Archive groups
            </Button>

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
                                            {
                                                index == groupIndex1 ? <i
                                                    style={{fontSize: "20px"}}
                                                    className="fa-solid fa-pen-to-square text-danger"
                                                    onClick={() => editGroupName(item)}
                                                /> : ""
                                            }
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
                                    {
                                        timeTableIndex == index ? <i
                                            className="fa-solid fa-pencil"
                                            onClick={() => editTimeTable(item)}
                                        /> : ""
                                    }

                                    <br/>
                                    {item.tableName ? item.tableName : (index + 1) + "-month"}
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
                                                onChange={(e) => setLessOrMore(e.target.checked)}
                                                value={lessOrMore}
                                                className="form-check-input d-inline-block" type="checkbox"
                                                id="flexSwitchCheckChecked"/>
                                        </div>
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
                                        {
                                            !lessOrMore ? <label>Imtixon <input disabled={item.done}
                                                                                defaultChecked={item.exam}
                                                                                onChange={(e) => exam(e, item)}
                                                                                type="checkbox"
                                                                                id="flexSwitchCheckChecked"
                                                                                className={"form-check-input"}
                                            />
                                            </label> : ""
                                        }


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
                                                        style={{color: parseInt(item.price) > item.paid ? "red" : "green"}}
                                                        onClick={() => seeUser(item)}>
                                                        {item.firstname + " " + item.lastname}
                                                        <br/>
                                                        {item?.parentsData?.length === 0 &&
                                                            <i className="fa-solid fa-robot text-danger"/>}
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
                                                        {
                                                            item1.done && item1.exam && !lessOrMore ?
                                                                <div className={"mt-4"}>
                                                                    Imtixon={item1.lessonmark}
                                                                </div> :
                                                                item1.exam && !lessOrMore ?
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
                                                                        {(item1.done || item.gotogroup !== 0) && !lessOrMore ?
                                                                            <div className={"d-flex"}>
                                                                                Lesson&nbsp;grade={item1.lessonmark}
                                                                            </div>
                                                                            :
                                                                            !lessOrMore &&
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
                                                                                {(item1.done || item.gotogroup !== 0) && !lessOrMore ?
                                                                                    <div
                                                                                        className={"mt-3"}>homework={item1.homeworkmark}</div> :
                                                                                    !lessOrMore &&
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
                                                <label className={!lessOrMore ? "centerDiv" : ""}>
                                                               <span>
                                                               {!lessOrMore && <span>Kelganmi &nbsp;</span>}
                                                               </span>
                                                    <input type="checkbox" id="flexSwitchCheckChecked"
                                                           disabled={item1.done || item.gotogroup !== 0}
                                                           className={"form-check-input lesson-check"}
                                                           onChange={(e) => lessonCheck(e, item1, item)}
                                                           defaultChecked={item1.hasinlesson}/>
                                                </label>
                                                {
                                                    timeTab?.isFree && !lessOrMore ?

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

            <Dialog height={530} width={700} open={rodalCreateUser} onClose={rodalVisisble}>
                <div className="card register-card">
                    <div style={{background: primaryColor}} className="card-header bgCollor"><img width={150} src={logo}
                                                                                                  alt="logo"/></div>
                    <div className="card-body card_body">

                        {isSuper && (<ButtonGroup variant="contained" sx={{width: '100%', mb: 3}}
                                                  aria-label="outlined primary button group">
                            <Button variant={payment ? "text" : "contained"} sx={{width: '50%'}}
                                    onClick={() => isPayment(true)}>Payment</Button>
                            <Button variant={payment ? "contained" : "text"} sx={{width: '50%'}}
                                    onClick={() => isPayment(false)}>User Data</Button>
                        </ButtonGroup>)}


                        {payment && isSuper ? <div style={{display: "flex", flexDirection: "column", gap: 5}}>

                                <div style={{display: "flex", width: "400px"}}>
                                    <Grid sx={{width: "100%"}}>
                                        <FormControl sx={{m: 1, mb: 5, height: 30, width: "95%"}}>
                                            <TextField style={{height: 30}}
                                                       id="outlined-basic"
                                                       fullWidth
                                                       label="Amount"
                                                       value={amount}
                                                // error={errorText.amount}
                                                       onChange={(e) => setAmount(e.target.value)}
                                                       variant="outlined" type={'number'}/>
                                        </FormControl>
                                    </Grid>

                                    {newPayment && <Grid sx={{width: "50%"}}>
                                        <FormControl sx={{m: 1, minWidth: 200, width: "95%"}}>
                                            <InputLabel id="-label" sx={{backgroundColor: "white"}}> Pay Type</InputLabel>
                                            <SelectMui
                                                labelId="demo-simple-select-helper-label"
                                                id="demo-simple-select-helper"
                                                value={value}
                                                label="pay_type"
                                                onChange={(e) => setValue(e.target.value)}
                                            >
                                                {options.map((item, index) => <MenuItem
                                                    key={item.value}
                                                    value={item.value}>{item?.label}</MenuItem>)}

                                            </SelectMui>
                                        </FormControl>

                                    </Grid>
                                    }
                                </div>
                                {newPayment && <div>
                                    <TextField
                                        multiline
                                        rows={3}
                                        sx={{m: 1, width: "100%"}}
                                        id="outlined-multiline-static"
                                        label="Description"
                                        variant="outlined"
                                        value={desc}
                                        onChange={(e) => setDesc(e.target.value)}
                                    />
                                </div>}
                                <div>
                                    New Payment: <Switch onClick={() => {
                                    setNewPayment(!newPayment)
                                }} checked={newPayment}/>
                                </div>
                                <div style={{display: "flex", justifyContent: "space-between", width: "95%"}}>
                                    <div>
                                        <p>Balance: {from?.balance} so'm</p>
                                        <p>Paid: {from?.paid} so'm</p>
                                    </div>
                                    <Button sx={{height: "30px"}} onClick={makePayment} variant={"contained"}>Add</Button>

                                </div>
                            </div>


                            : <form id={"my_form"} onSubmit={handleSubmit(mySubmit)}>

                                <div className="d-flex gap-3">
                                    <div className={"w-50"}>
                                        <input className={"form-control my-1"} type="text"
                                               placeholder={"FirstName..."} {...register("firstName", {required: true})}/>
                                        {errors.firstName ?
                                            <p className={"text-danger"}>Ismni kiritish majburiy</p> : ""}
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
                                        {errors.address ?
                                            <p className={"text-danger"}>Manzil kiritish majburiy</p> : ""}
                                    </div>
                                </div>


                            </form>
                        }
                    </div>
                    <div className="card-footer  text-end bgCollor"
                         style={{display: "flex", gap: "1rem", justifyContent: "flex-end"}}>
                        <Button onClick={rodalVisisble} variant={"contained"} sx={{marginLeft: "-20px"}}
                                color={"error"}>cancel</Button>
                        {!payment &&
                            <Button type={"submit"} form={"my_form"}
                                    variant={"contained"}>{currentNew ? "save" : "edit"}</Button>}
                    </div>
                </div>
            </Dialog>

            {/*user rodal*/}

            {/*close lesson */}
            <Dialog open={rodalCloseLesson} height={300} onClose={closeLesson}>
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
            </Dialog>
            <Rodal visible={con} height={300} onClose={rodalVisibleCon}>
                <h1>Hello</h1>
            </Rodal>

            <Dialog open={archive} onClose={archiveModal}>
                <div style={{minWidth: "500px", minHeight: "400px", padding: "1rem"}}>
                    <h1>Archived groups</h1>
                    <Select
                        styles={styleSelect}
                        isMulti
                        name="colors"
                        onChange={(e) => changeArchive(e)}
                        options={archiveGroups}
                        value={archiveOptions}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        placeholder={"Archive groups"}
                    />
                </div>

                <div className="card-footer" style={{display: "flex", justifyContent: "flex-end"}}>
                    <Button sx={{width: "10%"}} onClick={archiveModal} variant={"outlined"}
                            color={"error"}>Close</Button>
                </div>

            </Dialog>

        </div>
    );
}

export default Index;