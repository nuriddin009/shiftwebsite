import React, {useEffect, useState} from 'react';
import {Nav, NavItem} from 'reactstrap';
import "./index.scss"
import {Outlet, NavLink} from "react-router-dom";
import logo from "../file/image/imageShift/logo2.svg";

function Index(props) {

    let activeStyle = {
        backgroundColor: "black",
        color: "#00C3FF"
    };
    let nowActive = {
        color: "#ffffff",
    };

    useEffect(() => {
        document.title = "SHIFT ACADEMY | ADMIN"
    }, [])

    return (
        <div className={"admin_"}>
            <div className={"navbarAdmin"}>
                <a href="/">
                    <img className={"mx-4"} src={logo} alt="logo"/>
                </a>
                <Nav vertical>
                    <NavItem>
                        <NavLink to={"/admin/title"} style={({isActive}) => isActive ? activeStyle : nowActive}><h4
                            className={"mt-5"}>Title</h4></NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink to={"/admin/about"} style={({isActive}) => isActive ? activeStyle : nowActive}>
                            <h4>About</h4>
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink to={"/admin/whyUs"} style={({isActive}) => isActive ? activeStyle : nowActive}>
                            <h4>Why Us</h4>
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink to={"/admin/courses"} style={({isActive}) => isActive ? activeStyle : nowActive}>
                            <h4>Courses</h4>
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink to={"/admin/gallery"} style={({isActive}) => isActive ? activeStyle : nowActive}>
                            <h4>Gallery</h4>
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink to={"/admin/ourTeam"} style={({isActive}) => isActive ? activeStyle : nowActive}>
                            <h4>Our Team</h4>
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink to={"/admin/address"} style={({isActive}) => isActive ? activeStyle : nowActive}>
                            <h4>Address</h4>
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink to={"/selectadmin/studyCenter"}
                                 style={({isActive}) => isActive ? activeStyle : nowActive}>
                            <h4>O'quv Markazi</h4>
                        </NavLink>
                    </NavItem>
                </Nav>
            </div>
            <Outlet/>
        </div>
    );
}

export default Index;
