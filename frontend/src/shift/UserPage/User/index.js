import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {useForm} from "react-hook-form";
import "./index.scss"
import request from "../../utils/request";
import {toast} from "react-toastify";
import userImg from "../../file/image/imageShift/user.png"

function Index(props) {
    const {handleSubmit, register, reset} = useForm()
    const {username} = useParams()
    const [user, setUser] = useState()
    useEffect(() => {
        document.title = "Profile : " + username;
        request("/user/" + username, "get").then(res => {
            if (res.data.success) {
                setUser(res.data.data)
            }
        })
    }, [])

    function handleInput(e, type) {
        let a = {...user}
        a[type] = e.target.value
        setUser(a)

    }

    function submit() {
        if (user.username === "" || user.firstName === "" || user.lastName === "" || user.age === "" || user.phoneNumber === "") {
            toast.error("Iltimos malumotlarni to'liq kiriting")
        }
        let data = {
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            age: user.age,
            phoneNumber: user.phoneNumber
        }
        request("/user/oneUser", "post", data).then(res => {
            if (res.data.success) {
                toast.success(res.data.message)
            } else {
                toast.error("Error")
            }
        })
    }

    function forPassword(data) {

        request("/user/edit_password/" + username, "put", data).then(res => {
            if (res.data.success) {
                toast.success(res.data.message)
                reset({confirmPassword: "", newPassword: "", oldPassword: ""})
            } else {
                toast.error(res.data.message)
            }
        })

    }

    function handleFile(e) {
        let data = new FormData();
        data.append("file", e.target.files[0])
        request("/user/addphoto/" + username, "put", data).then(res => {
            request("/user/" + username, "get").then(res => {
                if (res.data.success) {
                    setUser(res.data.data)
                }
            })
            toast.success(res.data.message)
        })

    }

    return (
        <div className={"containerr"}>
            <div className={"w-25"}>
                <div className={"div-img"}>
                    {
                        user?.attachment === null ?
                            <label className={"my-label"}>
                                <img src={userImg} alt="user"/>
                                <input accept={"image/*"} style={{display: "none"}}
                                       onChange={e => handleFile(e)}
                                       type="file"/>
                            </label>
                            :
                            <label className={"my-label"}>
                                <img src={"http://localhost:81/api/img/" + user?.attachment?.id} alt="ua"/>
                                <input accept={"image/*"} style={{display: "none"}}
                                       onChange={e => handleFile(e)}
                                       type="file"/>
                            </label>
                    }
                </div>

                <div className={"card"}>
                    <form onSubmit={handleSubmit(submit)}>
                        <div className={"card-body"}>
                            <div className={"form-floating"}>

                                <input id={"floatingInputValue"}
                                       value={user ? user.username : ""}
                                       disabled={true}
                                       type="text"
                                       className={"form-control my"}/>
                                <label htmlFor="floatingInputValue" className={"mb-2"}><b>username</b></label>
                            </div>
                            <div className={"my-4 form-floating"}>

                                <input id={"firstname"} value={user ? user.firstName : ""}
                                       onChange={(e) => handleInput(e, "firstName")}
                                       type="text" className={"form-control"}/>
                                <label htmlFor="firstname" className={"mb-2"}><b>firstname</b></label>
                            </div>
                            <div className={"my-4 form-floating"}>


                                <input id={"lastname"} value={user ? user.lastName : ""}
                                       onChange={(e) => handleInput(e, "lastName")}
                                       type="text" className={"form-control  "}/>
                                <label htmlFor="lastname" className={"mb-2"}><b>lastname</b></label>
                            </div>
                            <div className={"my-4 form-floating"}>


                                <input id={"age"} value={user ? user.age : ""} onChange={(e) => handleInput(e, "age")}
                                       type="number"
                                       className={"form-control"}/>
                                <label htmlFor="age" className={"mb-2"}><b>Age</b></label>
                            </div>

                            <div className={"my-4 form-floating"}>

                                <input id={"phone"} value={user ? user.phoneNumber : ""}
                                       onChange={(e) => handleInput(e, "phoneNumber")}
                                       type="text" className={"form-control  "}/>
                                <label htmlFor="phone" className={"mb-2"}><b>PhoneNumber</b></label>

                            </div>

                            <div className={"my-4 form-floating"}>

                                <input id={"phonenumber"} value={user ? user.fatherPhoneNumber : ""} disabled={true}
                                       type="text"
                                       className={"form-control "}/>
                                <label htmlFor="phonenumber" className={"mb-2"}><b>FatherPhoneNumber</b></label>
                            </div>


                        </div>
                        <div className={"card-footer"}>
                            <button className={"btn btn-primary float-end "}>save</button>
                        </div>
                    </form>


                    <div className={"section-2 my-5 border p-4"}>
                        <form onSubmit={handleSubmit(forPassword)}>
                            <div className={"my-4 form-floating"}>
                                <input id={"oldPassword"} {...register("oldPassword")} type={"password"}
                                       className={"form-control "} placeholder={"oldPassword"}/>

                                <label htmlFor="oldPassword" className={"mb-2"}><b>oldPassword...</b></label>
                            </div>
                            <div className={"my-4 form-floating"}>

                                <input id={"newPassword"} {...register("newPassword")} type={"password"}
                                       className={"form-control "} placeholder={"newPassword"}/>
                                <label htmlFor={"newPassword"} className={"mb-2"}><b>NewPassword...</b></label>
                            </div>
                            <div className={"my-4 form-floating"}>

                                <input id={"confirmPassword"} {...register("confirmPassword")} type={"password"}
                                       className={"form-control "} placeholder={"confirmPassword"}/>
                                <label htmlFor={"confirmPassword"} className={"mb-2"}><b>Again Password</b></label>

                            </div>
                            <div>
                                <button className={"btn btn-primary float-end"}>save</button>
                            </div>
                        </form>

                    </div>
                </div>
            </div>

        </div>
    );
}

export default Index;