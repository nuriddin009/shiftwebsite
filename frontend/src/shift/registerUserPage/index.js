import React, {useState} from 'react';
import "./index.scss"
import logo from "../file/image/imageShift/logo2.svg";
import {Controller, useForm} from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import instance from "../utils/instance";
import {FormHelperText, TextField} from "@mui/material";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

function Index(props) {
    const {register, reset, handleSubmit, formState: {errors}, control} = useForm()
    const navigate = useNavigate();

    const [errorText, setErrorText] = useState({
        firstName: false,
        lastName: false,
        address: false,
        phoneNumber: false,
        age: false,
        username: false,
        password: false,
        confirmPassword: false
    })


    function mySubmit(item) {

        if (item.firstName !== "" && item.lastName && item.address !== ""
            && item.age > 0 && item.age !== "") {
            let phone = item.phoneNumber.substring(item.phoneNumber.length - 4);
            if (item.username === "" && item.password === "" && item.password_repid === "") {
                item = {
                    ...item,
                    username: item.firstName + item.lastName + phone,
                    password: item.firstName + item.lastName + phone,
                    password_repid: item.firstName + item.lastName + phone
                }
            }

            let data = {...item, activ: false, phoneNumber: "+" + item.phoneNumber}
            if (data.password === data.password_repid) {
                instance.post("/user", data).then(res => {
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
                        navigate("/successUser")
                        setErrorText({
                            ...errorText,
                            firstName: false,
                            lastName: false,
                            phoneNumber: false,
                            username: false,
                            password: false,
                            confirmPassword: false,
                        })
                    } else {
                        toast.error(res.data.message)
                    }
                })
            } else {
                toast.error("Parol bir xil emas")
            }

        } else {
            setErrorText({
                ...errorText,
                firstName: item.firstName === "",
                lastName: item.lastName === "",
                phoneNumber: item.phoneNumber === "",
                address: item.address === "",
                age: item.age < 0 || item.age === "",
                username: item.username === "",
                password: item.password === "",
                confirmPassword: item.confirmPassword === "",
            })
        }

    }


    return (
        <div className={"registerUser"}>
            {
                localStorage.getItem("token") ? navigate("/userPage/user")
                    : <div className={"registerCard "}>
                        <div className={"card my-5 "}>
                            <div className="card-header bgCollor">
                                <div><img width={180} src={logo} alt="logo"/></div>
                            </div>
                            <div className="card-body p-4">
                                <form id={"my_formR"} onSubmit={handleSubmit(mySubmit)}>

                                    <Stack spacing={2} direction={"row"}>
                                        <TextField
                                            id="outlined-basic"
                                            label="FirstName"
                                            fullWidth
                                            error={errorText.firstName}
                                            helperText={errorText.firstName && "FirstName required"}
                                            variant="outlined"
                                            {...register("firstName")}
                                        />


                                        <TextField
                                            id="outlined-basic"
                                            label="LastName"
                                            fullWidth
                                            error={errorText.lastName}
                                            variant="outlined"
                                            helperText={errorText.lastName && "LastName required"}
                                            {...register("lastName")}
                                        />
                                    </Stack>

                                    <Stack sx={{marginTop: "15px"}}>

                                        <TextField
                                            id="outlined-basic"
                                            label="Address"
                                            fullWidth
                                            rows={4}
                                            helperText={errorText.address && "Address required"}
                                            error={errorText.address}
                                            variant="outlined"
                                            {...register("address")}
                                        />
                                    </Stack>


                                    <div className="mt-3">
                                        <Controller
                                            name="phoneNumber"
                                            control={control}
                                            render={({field: {onChange, value}}) => (
                                                <PhoneInput
                                                    country={"uz"}
                                                    containerClass={"phone_input"}
                                                    inputClass={"userPage_phone"}
                                                    value={value}
                                                    placeholder={"+998 99 123 45 67"}
                                                    onChange={onChange}
                                                    prefix={"+"}
                                                />
                                            )}
                                        />

                                        <FormHelperText error
                                                        id="my-helper-text">{errorText.phoneNumber ? "Phone Number required" : ""}</FormHelperText>
                                    </div>

                                    <Stack sx={{marginTop: "15px"}} direction={"row"} spacing={2}>
                                        <TextField
                                            id="outlined-basic"
                                            label="Age"
                                            error={errorText.age}
                                            fullWidth
                                            type={"number"}
                                            helperText={errorText.age && "Age required"}
                                            variant="outlined"
                                            {...register("age")}
                                        />

                                        <TextField
                                            id="outlined-basic"
                                            label="Username"
                                            fullWidth
                                            error={errorText.username}
                                            helperText={errorText.username && "Username required"}
                                            variant="outlined"
                                            {...register("username")}
                                        />

                                    </Stack>


                                    <Stack sx={{marginTop: "15px"}} direction={"row"} spacing={2}>

                                        <TextField
                                            id="outlined-basic"
                                            label="Password"
                                            fullWidth
                                            error={errorText.password}
                                            type="password"
                                            helperText={errorText.password && "Password required"}
                                            variant="outlined"
                                            {...register("password")}
                                        />
                                        <TextField
                                            id="outlined-basic"
                                            label="Confirm password"
                                            fullWidth
                                            error={errorText.confirmPassword}
                                            type="password"
                                            helperText={errorText.confirmPassword && "Confirm password required"}
                                            variant="outlined"
                                            {...register("password_repid")}
                                        />
                                    </Stack>

                                </form>
                            </div>
                            <div className="card-footer bgCollor  d-flex justify-content-end">
                                <Button variant={"contained"} color={"primary"} type={"submit"}
                                        form={"my_formR"}>Register</Button>
                                <Button sx={{marginLeft: "10px"}} variant={"contained"} color={"error"}
                                        onClick={() => navigate(-1)}>Cancel</Button>
                            </div>
                        </div>
                    </div>
            }

        </div>
    );
}

export default Index;