import React, {useEffect} from 'react';
import "./index.scss"
import logo from "../../file/image/imageShift/logo2.svg";
import {Nav, NavItem} from "reactstrap";
import {Link, NavLink, Outlet} from "react-router-dom";
import {toast} from "react-toastify";
import verify from "./verified.png";
import instance from "../../utils/instance";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";


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

    function unlockUsers() {
        if (window.confirm("Rostdan ham userlarni unlock qilmoqchimisiz?")) {
            instance.post("/user/unlockUsers").then(res => {
                toast.success("Userlar unlock qilindi !")
            })
        }
    }



    return (
        <div className={"selectadmin_ "}>



            <div className={"navbarAdmin"}>
                <Link to="/">
                    <img className={"mx-4"} src={logo} alt="logo"/>
                </Link>



                <Nav vertical>
                    <NavItem>
                        <NavLink to={"/admin/title"} style={({isActive}) => isActive ? activeStyle : nowActive}><h4
                            className={"mt-5"}>Admin Shift</h4></NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink to={"/selectadmin/studyCenter"}
                                 style={({isActive}) => isActive ? activeStyle : nowActive}>
                            <h4>O'quv Markazi</h4>
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink to={"/selectadmin/users"} style={({isActive}) => isActive ? activeStyle : nowActive}>
                            <h4>Users</h4>
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink to={"/selectadmin/delete/users"}
                                 style={({isActive}) => isActive ? activeStyle : nowActive}>
                            <h4>Shiftdan haydalganlar</h4>
                        </NavLink>
                    </NavItem>

                    {/*<NavItem>*/}
                    {/*    <NavLink to={"/Mentor"} style={({isActive}) => isActive ? activeStyle : nowActive}>*/}
                    {/*        <h4>Mentor</h4>*/}
                    {/*    </NavLink>*/}
                    {/*</NavItem>*/}
                    <NavItem>
                        <NavLink to={"/selectadmin/lesson"} style={({isActive}) => isActive ? activeStyle : nowActive}>
                            <h4>Lesson</h4>
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink to={"/selectadmin/rooms"}
                                 style={({isActive}) => isActive ? activeStyle : nowActive}>
                            <h4>Rooms</h4>
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink to={"/selectadmin/certificate"}
                                 style={({isActive}) => isActive ? activeStyle : nowActive}>
                            <h4
                                style={{display: "flex", alignItems: "center"}}
                            >Certificate <img
                                style={{marginLeft: "5px"}}
                                width={20} height={20}
                                src={verify} alt="verify"/></h4>
                        </NavLink>
                    </NavItem>
                </Nav>
                <li className={"text-danger"} onClick={unlockUsers}>
                    <h4> Unlock users</h4>
                </li>
            </div>
            <Outlet />
        </div>
    );
}

export default Index;