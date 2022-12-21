import React, {useState} from 'react';
import {useForm} from "react-hook-form";
import {Link, useNavigate} from "react-router-dom"
import logo from "../file/image/imageShift/logo2.svg"
import "./index.scss"
import {toast} from "react-toastify";
import PhoneInput from 'react-phone-input-2';
import app from "../../service/firebase.config";
import {getAuth, RecaptchaVerifier, signInWithPhoneNumber} from "firebase/auth";
import {BsBoxArrowLeft} from "react-icons/bs"
import startsWith from 'lodash.startswith';
import instance from "../utils/instance";
import {AUTH_TOKEN, REFRESH_TOKEN} from "../utils/Config";
import Button from "@mui/material/Button";
import {TextField} from "@mui/material";

function Index(props) {
    const {register, reset, handleSubmit, formState: {errors}} = useForm()
    const {register: register1, reset: reset1, handleSubmit: handleSubmit1, formState: {errors: errors1}} = useForm()
    const navigate = useNavigate();

    const [forgot, setForgot] = useState(false)
    const [code1, setCode1] = useState(false)
    const [code, setCode] = useState("")
    const [count, setCount] = useState(60)
    const [result, setResult] = useState(null)
    const [data, setData] = useState(null)
    const [username, setUsername] = useState("")
    const [isValid, setIsValid] = useState(false)


    const [phone, setPhone] = useState("")
    const auth = getAuth(app);

    function mySubmit(data) {

        console.log(data)

        instance.post("/login", data).then(res => {
            console.log(res)
            if (res.data.success) {
                localStorage.setItem(AUTH_TOKEN, res.data.token)
                localStorage.setItem(REFRESH_TOKEN, res.data.refreshToken)
                if (res.data.roles.length <= 1) {
                    let a = [];
                    a.push(res.data.roles[0].roleName)
                    if (res.data.roles[0].roleName === "ROLE_STUDENT") {
                        localStorage.setItem("role", JSON.stringify(a))
                        navigate("/")
                    } else if (res.data.roles[0].roleName === "ROLE_ADMIN") {
                        localStorage.setItem("role", JSON.stringify(a))
                        navigate("/selectAdmin")
                    } else if (res.data.roles[0].roleName === "ROLE_MENTOR") {
                        localStorage.setItem("role", JSON.stringify(a))
                        navigate("/Mentor")
                    }
                } else {
                    navigate("/selectRole")
                }
            } else {
                toast.error(res.data.username)
            }

        })
    }

    function setupRecaptcha() {
        window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
            'size': 'invisible',
            'callback': (response) => {
                onSignInSubmit();
            }
        }, auth);
    }

    function onSignInSubmit() {
        setupRecaptcha()
        const appVerifier = window.recaptchaVerifier;
        signInWithPhoneNumber(auth, "+" + phone, appVerifier)
            .then((confirmationResult) => {
                window.confirmationResult = confirmationResult;
                setResult(confirmationResult);
            }).catch((error) => {

        });

    }

    function submitNewForm(data) {
        instance.put("/user/reset-password/" + username, data).then(res => {
            if (res.data.success) {
                toast.success(res.data.message + "\nQaytadan login qiling")
                navigate("/")
            }
        })
    }

    function validateOtp() {
        if (code === "" || result === null) return;
        result.confirm(code).then((result) => {
            // const user = result.user;
            submitNewForm(data)
        })
            .catch((error) => {
                toast.error("Xato kod!")
            });
    }

    function counter() {
        setInterval(() => {
            if (count <= 0) {

            } else {
                setCount(count => count - 1)
            }
        }, 1000)
    }


    function submitForm(data) {
        if (isValid) {
            if (data.password === data.password1) {
                instance.get("/user/getUsername/" + phone).then(res => {
                    if (res.data.success) {
                        onSignInSubmit()
                        setCode1(true)
                        setData(data)
                        setUsername(res.data.message)
                    } else {
                        toast.warn(res.data.message)
                    }
                })
                counter()
            } else {
                toast.error("Parollar bir xil emas!")
            }
        } else {
            toast.error("invalid")
        }

    }


    function replyCode() {
        onSignInSubmit()
        setCode1(60)
        counter()
    }

    function logout() {
        localStorage.clear()
        window.location.reload()
    }

    return (
        <div className={"login-page"}>
            {
                localStorage.getItem("token") ? navigate("/userPage/user")
                    : <div className={"col-md-4 offset-4 card-father"}>
                        <div className={"card  my-5"}>
                            <Link to={"/"}>
                                <div className="card-header bgCollor">
                                    <div><img width={180} src={logo} alt="logo"/></div>
                                </div>
                            </Link>
                            <div className={"card-body p-4"}>
                                <form id={"my_form"} onSubmit={handleSubmit(mySubmit)}>
                                    <TextField
                                        id="outlined-basic"
                                        label="Username"
                                        fullWidth
                                        variant="outlined"
                                        {...register("username")}
                                    />

                                    {errors.username ? <p className={"text-danger"}>username kiritish majburiy</p> : ""}
                                    <TextField
                                        id="outlined-basic"
                                        label="Password"
                                        fullWidth
                                        sx={{margin: "10px 0"}}
                                        variant="outlined"
                                        type={"password"}
                                        {...register("password")}
                                    />

                                    <p>Heven't yet account? <Link to={"/registerUser"}>Create your Account</Link></p>

                                    {errors.password ? <p className={"text-danger"}>parol kiritish majburiy</p> : ""}
                                </form>

                            </div>

                            <div className={"card-footer bgCollor  d-flex justify-content-end"}>
                                <Button type={"submit"} form={"my_form"} variant={"contained"}>log in</Button>
                            </div>

                        </div>
                    </div>


            }


        </div>
    );
}

export default Index;