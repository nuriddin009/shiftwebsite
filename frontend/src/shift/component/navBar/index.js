import React, {useEffect, useState, useRef} from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import "./index.scss";
import logo from "../../file/image/imageShift/logo2.svg";
import menu from "../../file/image/imageShift/menu-icon.png";
import request from "../../utils/request";
import userImg from "../../file/image/imageShift/user.png";
import instance from "../../utils/instance";


function Index(props) {

    const myRef = useRef()
    const myRef2 = useRef()

    const [lang, setLang] = useState(false);
    const [user, setUser] = useState("");
    const navigate = useNavigate();
    const [btnVisible, setBtnVisible] = useState(false);

    let locationStateLocation = useLocation();
    useEffect(() => {
        let token = localStorage.getItem("token");
        if (token !== null) {
            instance.get("/user/me").then(res => {
                setUser(res.data)
            })
        }


    }, [])


    useEffect(() => {
        setLang(localStorage.getItem("lang"))
    }, [])

    window.onclick = function (e) {

        if (e.target === myRef2.current) {
            setBtnVisible(prev => !prev)
            return;
        }
        if (e.target !== myRef.current) {
            setBtnVisible(false)
        }

    }


    function changeLang(lang) {
        clickLangBtn()
        setLang(lang)
        localStorage.setItem("lang", lang)
        props.getShift()
    }

    function clickLangBtn() {
        setBtnVisible(p => !p)
    }


    function clickBtn() {
        if (user) {
            navigate(`selectRole`)
        } else {
            navigate("/login")
        }
    }


    return (
        <header className="header">
            <div className="top-bar" id={"/"}>
                <div className="container"
                     style={{justifyContent: locationStateLocation.pathname !== "/" ? "end" : ""}}>
                    {
                        locationStateLocation.pathname === "/" ?
                            <img
                                width={123}
                                height={31}
                                src={logo}
                                alt="logo"
                                className="logo"
                            /> : ""
                    }
                    <div className="nav gap-5 d-flex">
                        <input type="checkbox" id="toggle"/>
                        <ul className="menus">
                            <li className="first-item">Menu</li>
                            <li>
                                <a href={"#/"}>
                                    <p>{lang === null || lang === "ENG" ? "Home" : lang === "UZB" ? "Bosh sahifa" : "Домашняя страница"}</p>
                                </a>
                            </li>

                            <li>
                                <a href={"#about"}>
                                    <p>{lang === null || lang === "ENG" ? "About Us" : lang === "UZB" ? "Biz haqimizda" : "О нас"}</p>
                                </a>
                            </li>

                            <li>
                                <a href={"#courses"}>
                                    <p>{lang === null || lang === "ENG" ? "Courses" : lang === "UZB" ? "Kurslar" : "Курсы"}</p>
                                </a>
                            </li>


                            <li>
                                <a href={"#gallery"}>
                                    <p>{lang === null || lang === "ENG" ? "Gallery" : lang === "UZB" ? "Rasmlar" : "Галерея"}</p>
                                </a>
                            </li>

                            <li>
                                <a href={"#footer"}>
                                    <p>{lang === null || lang === "ENG" ? "Contact" : lang === "UZB" ? "Aloqa" : "Контакт"}</p>
                                </a>
                            </li>


                        </ul>
                        <div className={"lang-userbtn d-flex align-items-center"}>

                            <div onClick={clickLangBtn} ref={myRef} className={"lang-btn"} style={{cursor: "pointer"}}>
                                {lang ? lang : "ENG"}

                                <span onClick={() => setBtnVisible(prev => !prev)} ref={myRef2}>></span>

                                <div>
                                </div>

                                <div onClick={clickLangBtn} style={{display: btnVisible ? "block" : "none"}}
                                     className={"lang-btn-wrapper"}>
                                    <div onClick={clickLangBtn} className={"triangle"}>
                                        <h6 onClick={() => changeLang("ENG")}>English</h6>
                                        <h6 onClick={() => changeLang("UZB")}>Uzbek</h6>
                                        <h6 onClick={() => changeLang("RUS")}>Russian</h6>
                                    </div>
                                </div>

                            </div>
                            {
                                user ? <div>
                                    {
                                        user.attachmentid === null ?
                                            <label className={"my-label mx-3"} style={{cursor: "pointer"}}>
                                                <div onClick={clickBtn} className={"userImageNavbar"}>
                                                    <img className={"userimage rounded-circle"} src={userImg}
                                                         alt="user"/></div>

                                            </label>
                                            :
                                            <label className={"my-label mx-3"} style={{cursor: "pointer"}}>
                                                <div onClick={clickBtn} className={"userImageNavbar"}>
                                                    <img className={"userimage rounded-circle"}
                                                         src={"http://localhost:81/api/img/" + user?.attachmentid}
                                                         alt="kelmadi"/>
                                                </div>
                                            </label>
                                    }
                                </div> : <button className={"btn text-white"} onClick={clickBtn}>
                                    <p className={"sign-in"}
                                       style={{margin: 0}}>{lang === null || lang === "ENG" ? "Sign-in" : lang === "UZB" ? "Kirish" : "Войти"}</p>


                                </button>

                            }


                            <label className="menu-icon" htmlFor="toggle">
                                <img
                                    width={23}
                                    height={16}
                                    src={menu}
                                    alt="menus"
                                    className="menus-icon"
                                />
                            </label>
                        </div>

                    </div>
                </div>
            </div>
        </header>
    );
}

export default Index;