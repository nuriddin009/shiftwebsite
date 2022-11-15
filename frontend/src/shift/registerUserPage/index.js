import React, {useState} from 'react';
import "./index.scss"
import logo from "../file/image/imageShift/logo2.svg";
import {Controller, useForm} from "react-hook-form";
import PhoneInput, {isValidPhoneNumber} from "react-phone-number-input";
import {Link, useLocation, useNavigate} from "react-router-dom";
import request from "../utils/request";
import {toast} from "react-toastify";

function Index(props) {
    const {register, reset, handleSubmit, formState: {errors}, control} = useForm()
    const navigate = useNavigate();
    let {pathname} = useLocation();
    const [p1, setP1] = useState("")
    const [p2, setP2] = useState("")
    const [age, setAge] = useState("")
    const [un, setUN] = useState("")



    function mySubmit(item) {

        if (item.firstName === "" || item.lastName === "") {
            toast.error("Iltimos ism familiyasini to'liq kiriting")
            return;
        }
        if (item.username === "" && item.password === "" && item.password_repid === "") {
            item = {
                ...item,
                username: item.firstName + item.lastName + item.age,
                password: item.firstName + item.lastName + item.age,
                password_repid: item.firstName + item.lastName + item.age
            }
        }
        let data = {...item, activ: false}
        if (data.password === data.password_repid) {
            request("/user", "post", data).then(res => {
                if (res.data.success) {
                    reset({
                        firstName: "",
                        lastName: "",
                        phoneNumber: "",
                        userName: "",
                        address: "",
                        username: "",
                        age: "",
                        password: "",
                        password_repid: "",
                    })
                    navigate("/succesUser")
                } else {
                    toast.error(res.data.message)
                }
            })
        } else {
            toast.error("Parol bir xil emas")
        }


    }

    function checkPassword(e, type) {
        if (type === "p1") {
            setP1(e.target.value)
        } else {
            setP2(e.target.value)
        }
    }


    // function logout() {
    //     localStorage.clear()
    //     window.location.reload()
    // }

    return (
        <div className={"registerUser"}>
            {
                localStorage.getItem("token") ? <center className={"w-100 p-5 text-center"}>
                        <h1>Siz ro'yxatdan o'tgansiz.</h1>
                        <div className="d-flex w-100 justify-content-around">
                            <Link to={"/"}>
                                <button className={"btn btn-dark"}>
                                    <i className="fa-solid fa-house"/>&nbsp;Bosh sahifaga qaytish
                                </button>
                            </Link>

                        </div>

                    </center>
                    : <div className={"registerCard "}>
                        <div className={"card my-5 "}>
                            <div className="card-header bgCollor">
                                <div><img width={180} src={logo} alt="logo"/></div>
                            </div>
                            <div className="card-body p-4">
                                <form id={"my_formR"} onSubmit={handleSubmit(mySubmit)}>
                                    <input
                                        className={"form-control my-1"}
                                        type="text"
                                        placeholder={"FirstName..."}
                                        {...register("firstName", {required: true})}
                                    />
                                    {errors.firstName ? <p className={"text-danger"}>Ismni kiritish majburiy</p> : ""}
                                    <input
                                        className={"form-control my-1"}
                                        type="text"
                                        placeholder={"LastName..."}
                                        {...register("lastName", {required: true})}
                                    />
                                    {errors.lastName ? <p className={"text-danger"}>Familyani kiritish majburiy</p> : ""}
                                    <textarea className={"form-control my-1"} cols="30" rows="2"
                                              placeholder={"Address"} {...register("address", {required: true})}/>
                                    {errors.address ? <p className={"text-danger"}>Manzil kiritish majburiy</p> : ""}
                                    <label htmlFor="phoneNumber">Phone Number</label>

                                    <div className={"phoneAge d-flex  justify-content-around"}>
                                        <Controller
                                            name="phoneNumber"
                                            control={control}
                                            rules={{
                                                validate: (value) => isValidPhoneNumber(value)
                                            }}
                                            render={({field: {onChange, value}}) => (
                                                <PhoneInput
                                                    value={value}
                                                    onChange={onChange}
                                                    defaultCountry="UZ"
                                                    id="phoneNumber"
                                                />
                                            )}
                                        />
                                        <div className={"d-flex align-items-center "}>
                                            <input
                                                style={{width: "100px"}}
                                                min={7} max={70}
                                                className={"form-control my-1"}
                                                type="number"
                                                placeholder={"Age"}
                                                {...register("age", {required: true})}
                                                maxLength={2}
                                                onChange={(e) => setAge(e.target.value)}
                                            />
                                        </div>

                                    </div>

                                    {errors["phoneNumber"] && (
                                        <p className="error-message text-danger">Invalid Phone</p>
                                    )}
                                    {errors.age ? <p className={"text-danger float-end"}>Yosh chegarasi 7 va 70</p> : ""}

                                    <input
                                        className={"form-control my-1"}
                                        type="text"
                                        placeholder={"Login"}
                                        {...register("username", {required: true, minLength: 5})}
                                        onChange={(e) => setUN(e.target.value)}
                                    />
                                    {errors.username || (un.length < 6 && un !== "") ?
                                        <p className={"text-danger"}>username kamida 6 ta harfdan iborat bo'lishi
                                            kerak</p> : ""}
                                    <input
                                        className={"form-control my-1"}
                                        type="password"
                                        placeholder={"Password"}
                                        {...register("password", {required: true})}
                                        onChange={(e) => checkPassword(e, "p1")}
                                    />
                                    {errors.password ? <p className={"text-danger"}>Parol kiritish majburiy</p> : ""}
                                    <input
                                        className={"form-control my-1"}
                                        type="password"
                                        placeholder={"Password Repid"}
                                        {...register("password_repid", {required: true})}
                                        onChange={(e) => checkPassword(e, "p2")}
                                    />
                                    {
                                        errors.password_repid ? <p className={"text-danger"}>Parol kiritish majburiy</p> :
                                            p1 && p2 && p1 !== p2 ?
                                                <p className={"text-danger"}>Parollar bir xil emas</p> : ""
                                    }
                                </form>
                            </div>
                            <div className="card-footer bgCollor  d-flex justify-content-end">
                                <button form={"my_formR"} className={"btn-login"}>Save</button>
                                <button className={" btn-login"} onClick={() => navigate(-1)}>Cancel</button>
                            </div>
                        </div>
                    </div>
            }

        </div>
    );
}

export default Index;