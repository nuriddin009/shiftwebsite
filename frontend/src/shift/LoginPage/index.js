import React, {useState} from 'react';
import {useForm} from "react-hook-form";
import {Link, useNavigate} from "react-router-dom"
import request from "../utils/request";
import logo from "../file/image/imageShift/logo2.svg"
import "./index.scss"
import {toast} from "react-toastify";
import PhoneInput from 'react-phone-input-2';
import app from "../../service/firebase.config";
import {getAuth, RecaptchaVerifier, signInWithPhoneNumber} from "firebase/auth";
import {BsBoxArrowLeft} from "react-icons/bs"
import startsWith from 'lodash.startswith';

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
        request("/login", "post", data).then(res => {
            if (res.data.success) {
                localStorage.setItem("token", res.data.token)
                if (res.data.roles.length <= 1) {
                    let a = [];
                    a.push(res.data.roles[0].roleName)
                    if (res.data.roles[0].roleName === "ROLE_STUDENT") {
                        localStorage.setItem("role", JSON.stringify(a))
                        navigate("/")
                    } else if (res.data.roles[0].roleName === "ROLE_ADMIN") {
                        localStorage.setItem("role", JSON.stringify(a))
                        navigate("/selectAdmin")
                        //    /admin/title
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
        request("/user/reset-password/" + username, "put", data).then(res => {
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
                return;
            } else {
                setCount(count => count - 1)
            }
        }, 1000)
    }


    function submitForm(data) {
        if (isValid) {
            if (data.password === data.password1) {
                request("/user/getUsername/" + phone, "get").then(res => {
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
                localStorage.getItem("token") ? <div className={"w-75 p-5"}>
                        <h1>Siz login qilgansiz. Agar qaytadan login qilmoqchi <br/>
                            bo'lsangiz iltimos avval logout qiling</h1>
                        <div className="d-flex w-100 justify-content-around">
                            <Link to={"/"}>
                                <button className={"btn btn-dark"}>
                                    <i className="fa-solid fa-house"/>&nbsp;Bosh sahifaga qaytish
                                </button>
                            </Link>

                            <button
                                onClick={() => logout()}
                                className="btn btn-danger">Logout qilish <i
                                className="fa-sharp fa-solid fa-person-from-portal"/></button>
                        </div>

                    </div>
                    : !forgot ? <div className={"col-md-4 offset-4 card-father"}>
                            <div className={"card  my-5"}>
                                <Link to={"/"}>
                                    <div className="card-header bgCollor">
                                        <div><img width={180} src={logo} alt="logo"/></div>
                                    </div>
                                </Link>
                                <div className={"card-body p-4"}>
                                    <form id={"my_form"} onSubmit={handleSubmit(mySubmit)}>
                                        <input className={"form-control my-3"} placeholder={"Login"} minLength={6}
                                               {...register("username", {required: true})}
                                               type="text"/>
                                        {errors.username ? <p className={"text-danger"}>username kiritish majburiy</p> : ""}
                                        <input className={"form-control my-3"}
                                               placeholder={"Password"} minLength={6}
                                               {...register("password", {required: true})}
                                               type="password"/>
                                        {errors.password ? <p className={"text-danger"}>parol kiritish majburiy</p> : ""}
                                    </form>

                                    <p
                                        onClick={() => setForgot(true)}
                                        style={{color: "#023247"}}
                                    >Parolni unitdingizmi?
                                    </p>
                                </div>

                                <div className={"card-footer bgCollor  d-flex justify-content-end"}>
                                    <button form={"my_form"} className={" btn-login"}>log in</button>
                                </div>

                            </div>
                        </div>
                        : !code1 ? <div className={"col-md-4 offset-4 card-father"}>
                                <div className="card my-5">
                                    <Link to={"/"}>
                                        <div className="card-header bgCollor">
                                            <div><img width={180} src={logo} alt="logo"/></div>
                                        </div>
                                    </Link>
                                    <div id="recaptcha-container">

                                    </div>
                                    <div className="card-body p-4 g-1">


                                        <form id={"phone_form"} onSubmit={handleSubmit1(submitForm)}>

                                            <PhoneInput
                                                country={"uz"}
                                                containerClass={"phone_input"}
                                                value={phone}
                                                placeholder={"+998 99 123 45 67"}
                                                onChange={(phone1) => setPhone(phone1)}
                                                inputProps={{
                                                    name: 'phone',
                                                    required: true
                                                }}
                                                isValid={(inputNumber, country, countries) => {
                                                    return countries.some((country) => {
                                                        if (startsWith(inputNumber, country.dialCode) || startsWith(country.dialCode, inputNumber)) {
                                                            setIsValid(true)
                                                            return true;
                                                        }
                                                        return false;
                                                    });
                                                }}
                                            />
                                            <input
                                                className={"form-control my-3"}
                                                placeholder={"Parol"}
                                                type="password"
                                                {...register1("password", {required: true})}
                                            />
                                            {
                                                errors1.password ? <p className={"text-danger"}>Password required</p> : ""
                                            }
                                            <input
                                                className={"form-control my-3"}
                                                placeholder={"Parol tasdig'ini kiriting"}
                                                type="password"
                                                {...register1("password1", {required: true})}
                                            />
                                            {
                                                errors1.password1 ? <p className={"text-danger"}>Password required</p> : ""
                                            }
                                        </form>
                                        <p
                                            onClick={() => setForgot(false)}
                                        ><i className="fa-solid fa-arrow-left"/>&nbsp;Orqaga</p>
                                    </div>
                                    <div className={"card-footer bgCollor  d-flex justify-content-end"}>
                                        <button form={"phone_form"} className={" btn-login"}>Kirish</button>
                                    </div>
                                </div>
                            </div>
                            : <div className={"col-md-4 offset-4 card-father"}>
                                <div className="card my-5">
                                    <Link to={"/"}>
                                        <div className="card-header bgCollor">
                                            <div><img width={180} src={logo} alt="logo"/></div>
                                        </div>
                                    </Link>
                                    <div id="recaptcha-container">

                                    </div>
                                    <div className="card-body p-4 g-1">
                                        <h6 className={"text-primary"}>Biz +{phone} reqamiga sms kod
                                            yubordik {count >= 0 ? count : 0}
                                        </h6>
                                        <input
                                            type="number"
                                            placeholder={"sms kodni kiriting..."}
                                            className={"form-control"}
                                            value={code}
                                            maxLength={6}
                                            onChange={(e) => setCode(e.target.value)}
                                        />
                                        {
                                            count <= 0 ? <p
                                                className={"text-primary text-center mt-1"}
                                                onClick={replyCode}
                                            >Sms qayta yuborish</p> : ""
                                        }

                                        <button
                                            onClick={() => validateOtp()}
                                            className={"btn btn-primary form-control my-3"}
                                        ><BsBoxArrowLeft/> Tasdiqlash
                                        </button>

                                    </div>

                                </div>
                            </div>

            }


        </div>
    );
}

export default Index;