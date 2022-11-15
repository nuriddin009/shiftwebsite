import React, {useEffect, useState} from 'react';
import "./index.scss"
import {useLocation, useParams} from "react-router-dom";
import request from "../../../shift/utils/request";
import {useForm, Controller} from "react-hook-form";
import Rodal from "rodal";
import 'react-phone-number-input/style.css'
import {toast} from "react-toastify";
import {isValidPhoneNumber} from "react-phone-number-input";
import PhoneInput from 'react-phone-input-2';

import logo from "../../../shift/file/image/imageShift/logo2.svg";
import Select from 'react-select'

function Index(props) {

    const [rodal, setRodal] = useState(false);
    const [input, setInput] = useState("");
    const [active, setActive] = useState("");
    const [users, setUsers] = useState(null);
    const [modalUserEdit, setModalUserEdit] = useState(null);
    const [totalPages, setTotalPages] = useState([]);
    const [currentPageNumber, setCurrentPageNumber] = useState(false);
    const [edituser, setEdituser] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [page, setPage] = useState(0);
    const [roles, setRoles] = useState(null);
    const [filterRole, setFilterRole] = useState("");


    let {reset, register, handleSubmit, formState: {errors}, control} = useForm();
    let location = useLocation();

    function getUsers(input, active, page, role) {
        request("/user?page=" + page + "&input=" + input
            + "&active=" + active + "&role=" + role, "get").then(res => {
            setUsers(res.data.content)
            setTotalPages(res.data.totalPages);
            setCurrentPageNumber(res.data.number)
        })
    }

    function getRole() {
        request("/user/role", "get").then(res => {
            let a = [];
            res.data.map(item => a.push({value: item.id, label: item.roleName}))
            setRoles(a)
        })
    }

    useEffect(() => {
        getUsers("", "", 0, filterRole);
        getRole()
    }, [location.pathname])

    function rodalVisisble() {
        setRodal(p => !p)
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

    function goToPage(index) {
        setPage(index)
        getUsers("", "", index, filterRole);

    }

    function mySubmit(data) {

        if (data.firstName === "" || data.lastName === "") {
            toast.error("Iltimos ism familiyasini to'liq kiriting")
            return;
        }

        if (data.phoneNumber !== "" || data.fatherPhoneNumber !== "") {
            data = {
                ...data,
                phoneNumber: data.phoneNumber.startsWith("+") ? data.phoneNumber : "+" + data.phoneNumber,
                fatherPhoneNumber: data.fatherPhoneNumber.startsWith("+") ? data.fatherPhoneNumber : "+" + data.fatherPhoneNumber
            }
        } else {
            toast.error("Enter phone numbers")
        }
        if (data.username === "" && data.password === "" && data.password_repid === "") {
            let phone = data.phoneNumber.substring(data.phoneNumber.length - 4);
            data = {
                ...data,
                username: data.firstName.toLocaleLowerCase() + data.lastName.toLocaleLowerCase() + phone,
                password: data.firstName.toLocaleLowerCase() + data.lastName.toLocaleLowerCase() + phone,
                password_repid: data.firstName.toLocaleLowerCase() + data.lastName.toLocaleLowerCase() + phone
            }
        }
        if (modalUserEdit) {
            if (data.password === data.password_repid) {
                request("/user/edit", "post", data).then(res => {
                    rodalVisisble()
                    setModalUserEdit(null);
                    getUsers("", active, 0, filterRole);
                })
            } else {
                toast.error("Parol bir xil emas")
            }
            return;
        }
        if (data.password === data.password_repid) {
            request("/user", "post", data).then(res => {
                if (res.data.success) {
                    getUsers("", active, 0, filterRole);
                    rodalVisisble()
                } else {
                    toast.error(res.data.message)
                }
            })
        } else {
            toast.error("Parol bir xil emas")
        }
    }

    function editActive(e, id) {
        request("/user/editActive?id=" + id + "&activ=" + e.target.checked, "patch").then(res => {
            getUsers(input, active, page, filterRole)
        })
    }

    function handleInput(e) {
        getUsers(e.target.value, active, 0, filterRole)
        setInput(e.target.value)
    }

    function heandlecheck(e) {
        getUsers(input, e.target.checked, 0, filterRole)
        setActive(e.target.checked)
    }

    function resetI() {
        setActive("")
        setInput("")
        getUsers("", "", 0, "")
    }

    function editusers(item, index, user) {
        setEdituser({item, index})
        setCurrentUser(user);
    }

    function heandleInput(e, item, index) {
        users[index][item] = e.target.value;
        setUsers([...users])
    }

    function enter(e) {
        if (e.key === 'Enter') {
            request("/user/edit", "post", currentUser).then(res => {
                setEdituser(null)
            })
        }
    }

    function editRodal(item, index) {
        rodalVisisble()
        reset({...item, userName: item.username})
        setModalUserEdit(item);
        let a = []
        item.roles.map(item1 => a.push({value: item1.id + "", label: item1.roleName, color: '#00B8D9'}))
    }


    function selectRoles(e, item, index) {
        let a = []

        e.map(item => a.push({id: item.value, roleName: item.label}))
        let data = {userId: item.id, roles: a}
        request("/user/role", "post", data).then(res => {
            if (res.data.success) {
                toast.success(res.data.message)
                getUsers("", active, page, filterRole)
            } else {
                toast.error(res.data.message)
            }
        })
    }


    const styleSelect = {
        multiValueLabel: (provided, state) => ({
            ...provided,
            width: '185px'
        }),
    }

    function deleteUser(item, index) {

        if (window.confirm("Rostdan ham " + item.firstName + " " + item.lastName + " ni o'chirmoqchimisiz?")) {
            request("/deleteUser?userId=" + item.id, "delete").then(res => {
                getUsers("", "", 0, "")
                toast.success(item.firstName + " " + item.lastName + " user o'chirildi")
            })

        }

    }

    function filterByRole(e) {
        setFilterRole(e.target.value);
        getUsers(input, active, 0, e.target.value)
    }


    return (
        <div className={"UsersAdmin m-3 "}>
            <h1>Students</h1>
            <div>
                <div className={"d-flex gap-3"}>
                    <button className={"btn btn-dark"} onClick={rodalVisisble}>
                        AddUser
                    </button>
                    <input value={input} type="text" placeholder={"FirstName..."} className={"form-control w-50"}
                           onChange={handleInput}/>
                    <label className={"d-flex justify-content-start"}>
                        <p>
                            Active
                        </p>
                        <input checked={active} className="form-check-input mx-3 mb-3" type="checkbox"
                               id="flexSwitchCheckChecked " onChange={heandlecheck}/>
                    </label>
                    {
                        input !== "" || active !== "" ?
                            <button onClick={resetI} className={"btn btn-dark"}>Reset</button>
                            :
                            ""
                    }
                    <br/>
                    <select
                        onChange={filterByRole}
                        className={"form-select role_select"}
                        style={{width: "200px"}}
                    >
                        <option value="">ROLE FILTER</option>
                        <option value="ROLE_STUDENT">ROLE_STUDENT</option>
                        <option value="ROLE_ADMIN">ROLE_ADMIN</option>
                        <option value="ROLE_MENTOR">ROLE_MENTOR</option>
                        <option value="ROLE_SUPERADMIN">ROLE_SUPERADMIN</option>
                    </select>
                </div>
                <table className="table">
                    <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Login</th>
                        <th>Phone Number</th>
                        <th>ParentPhoneNumber</th>
                        <th>Age</th>
                        <th>Adrress</th>
                        <th>IsActive</th>
                        <th>Role</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        users?.map((item, index) => <tr key={index}>
                            {
                                edituser?.index === index && edituser?.item === "firstName" ?
                                    <td><input className={"form-control"} autoFocus
                                               style={{width: "150px", border: "none"}} onKeyUp={enter}
                                               type="text" value={item.firstName}
                                               onChange={e => heandleInput(e, "firstName", index)}/></td>
                                    :
                                    <td onDoubleClick={() => editusers("firstName", index, item)}>{item.firstName}</td>
                            }
                            {
                                edituser?.index === index && edituser?.item === "lastName" ?
                                    <td><input className={"form-control"} autoFocus
                                               style={{width: "150px", border: "none"}} onKeyUp={enter}
                                               type="text" value={item.lastName}
                                               onChange={e => heandleInput(e, "lastName", index)}/></td>
                                    :
                                    <td onDoubleClick={() => editusers("lastName", index, item)}>{item.lastName}</td>
                            }

                            <td>{item.username}</td>

                            {
                                edituser?.index === index && edituser?.item === "phoneNumber" ?
                                    <td><input className={"form-control"} autoFocus
                                               style={{width: "150px", border: "none"}} onKeyUp={enter}
                                               type="text" value={item.phoneNumber}
                                               onChange={e => heandleInput(e, "phoneNumber", index)}/></td>
                                    :
                                    <td onDoubleClick={() => editusers("phoneNumber", index, item)}>{item.phoneNumber}</td>
                            }
                            {
                                edituser?.index === index && edituser?.item === "fatherPhoneNumber" ?
                                    <td><input className={"form-control"} autoFocus onKeyUp={enter}
                                               style={{width: "150px", border: "none"}}
                                               type="text" value={item.fatherPhoneNumber}
                                               onChange={e => heandleInput(e, "fatherPhoneNumber", index)}/></td>
                                    :
                                    <td onDoubleClick={() => editusers("fatherPhoneNumber", index, item)}>{item.fatherPhoneNumber}</td>
                            }
                            {
                                edituser?.index === index && edituser?.item === "age" ?
                                    <td><input className={"form-control"} autoFocus
                                               style={{width: "40px", border: "none"}} onKeyUp={enter}
                                               type="number" value={item.age}
                                               onChange={e => heandleInput(e, "age", index)}/></td>
                                    :
                                    <td onDoubleClick={() => editusers("age", index, item)}>{item.age}</td>
                            }
                            {
                                edituser?.index === index && edituser?.item === "address" ?
                                    <td><textarea className={"form-control"} autoFocus onKeyUp={enter}
                                                  style={{width: "80px", border: "none"}}
                                                  type="text" value={item.address}
                                                  onChange={e => heandleInput(e, "address", index)}/></td>
                                    :
                                    <td onDoubleClick={() => editusers("address", index, item)}><pre>
                                {item.address}
                            </pre>
                                    </td>
                            }
                            <td><input style={{transform: 'scale(1.5)'}} className="form-check-input "
                                       id="flexSwitchCheckChecked"
                                       type="checkbox" checked={item.activ}
                                       onChange={(e) => editActive(e, item.id)}/>
                            </td>
                            <td>
                                <Select
                                    styles={styleSelect}
                                    isMulti
                                    name="colors"
                                    onChange={(e) => selectRoles(e, item, index)}
                                    options={roles}
                                    //(item.roles.map(item => ({value: item.id, label: item.roleName})))
                                    value={item.roles.map(item => ({value: item.id, label: item.roleName}))}
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    placeholder={"Roles..."}
                                />
                            </td>
                            <td>
                                <div className={"btn-group"}>
                                    <button className={"btn btn-outline-primary"}
                                            onClick={() => editRodal(item, index)}>edit
                                    </button>
                                    <button
                                        onClick={() => deleteUser(item, index)}
                                        className={"btn btn-outline-danger"}>
                                        delete
                                    </button>
                                </div>
                            </td>
                        </tr>)
                    }
                    </tbody>
                </table>
                {totalPages > 1 ?
                    new Array(totalPages).fill(0).map((item, index) => <button key={index}
                                                                               className={(currentPageNumber === index ? "btn btn-secondary" : "btn btn-dark")}
                                                                               onClick={() => goToPage(index)}>
                        {index + 1}

                    </button>) : ""
                }
            </div>
            <Rodal height={530} width={800} visible={rodal} onClose={rodalVisisble}>
                <div style={{overflowY: "auto"}} className="card register-card">
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
                        <button onClick={mySubmit} form={"my_form"} className={"btn btn-dark"}>Save</button>
                    </div>
                </div>
            </Rodal>

        </div>
    );
}

export default Index;
