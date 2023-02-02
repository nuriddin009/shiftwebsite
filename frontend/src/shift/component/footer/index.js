import React, {useEffect, useState} from 'react';

import iconLogo from "../../file/image/imageShift/logo2.svg"
import "./index.scss"
import {selectLangAddress} from "../../utils/selectLang";

function Index(props) {
    const [address, setAddress] = useState(null);

    const [lang, setLang] = useState(false);

    useEffect(() => {
        setAddress(selectLangAddress(props?.address))
        setLang(localStorage.getItem("lang"))

    }, [props.address])
    return (
        <div className={"footer_"}>
            <div className="footer" id={"footer"}>
                <div className="container">
                    <div className="part-1">
                        <img src={iconLogo} alt="logo"/>
                        <pre>
                        <p>
                            {address?.address}
                        </p>
                        </pre>
                        <pre>
                        <p>
                            {props.address?.number}
                        </p>
                        </pre>
                    </div>
                    <div className="part-2">
                        <h3> Services </h3>
                        <ul>
                            <li>Frontend</li>
                            <li>Backend</li>
                            <li>Database</li>
                            <li>Practice</li>
                        </ul>
                    </div>
                    <div className="part-2">
                        <h3> Categories </h3>
                        <ul>
                            <li><a href={"#/"}>
                                {lang === null || lang === "ENG" ? "Home" : lang === "UZB" ? "Bosh sahifa" : "Домашняя страница"}</a>
                            </li>
                            <li><a href={"#about"}>
                                {lang === null || lang === "ENG" ? "About Us" : lang === "UZB" ? "Biz haqimizda" : "О нас"}
                            </a></li>
                            <li><a href={"#courses"}>
                                {lang === null || lang === "ENG" ? "Courses" : lang === "UZB" ? "Kurslar" : "Курсы"}
                            </a></li>
                            <li><a href={"#gallery"}>
                                {lang === null || lang === "ENG" ? "Gallery" : lang === "UZB" ? "Rasmlar" : "Галерея"}
                            </a></li>
                        </ul>
                    </div>
                    <div className="part-4">
                        <h3> Follow us </h3>

                        <div className="wrapper">
                            {
                                props.followUses?.map(item =>
                                    <div key={item.id}>
                                        <a target="_blank" href={item.url}>
                                            <img className={"logoIcon"}
                                                 src={"/api/img/" + item.attachment?.id}
                                                 alt={item.id}/>
                                        </a>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
                <div className="container c1">
                    <p>
                        © 2022. ShiftAcademy. All Rights Reserved
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Index;