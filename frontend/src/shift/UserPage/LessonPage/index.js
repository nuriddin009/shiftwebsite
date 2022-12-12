import React, {useEffect, useState} from 'react';
import "./index.scss"
import {Link, Outlet, useLocation, useNavigate} from "react-router-dom";
import logo from "../../file/image/imageShift/logo2.svg";
import {toast} from "react-toastify";
import instance from "../../utils/instance";
import Box from "@mui/material/Box";
import Image from "mui-image";
import IconButton from "@mui/material/IconButton";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import {styled, useTheme} from "@mui/material/styles";
import Button from "@mui/material/Button";
import MenuIcon from "@mui/icons-material/Menu";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";

function Index(props) {

    let width = window.innerWidth > 600

    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });


    const theme = useTheme();
    const [open, setOpen] = useState(false);


    const DrawerHeader = styled('div')(({theme}) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        backgroundColor: "#023247",
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    }));


    const toggleDrawer = (anchor, open) => (event) => {
        if (
            event &&
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return;
        }

        setState({...state, [anchor]: open});
    };


    const list = (anchor) => (
        <Box

            sx={{
                width: width ? 350 : 250,
                background: "#023247",
                height: "100vh",
                overflowY: "auto",
                color: "white"
            }}
            role="presentation"
        >
            <DrawerHeader sx={{padding: "1rem", boxSizing: "border-box"}}>
                <Link to={"/"}>
                    <Image
                        style={{transform: `scale(${width ? 1 : 0.6})`, marginLeft: width ? "-80px" : 0}}
                        src={logo}
                        height={50}
                        width={200}
                        duration={2000}
                        showLoading={true}
                        errorIcon={true}
                        distance="150px"
                        bgColor="inherit"
                    />
                </Link>

                <IconButton sx={{color: "white"}} onClick={toggleDrawer(anchor, false)}>
                    {theme.direction === 'rtl' ? <ChevronRightIcon/> : <ChevronLeftIcon/>}
                </IconButton>
            </DrawerHeader>

            <Divider/>

            <List>
                {
                    lessons.map((item, index) => <Link key={index} style={{textDecoration: "none"}}
                                                       to={`/userPage/user`}>
                        <ListItem
                            onClick={toggleDrawer(anchor, false)}
                            disablePadding sx={{display: 'block'}}>
                            <ListItemButton
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    px: 2.5,
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center'
                                    }}
                                >
                                    {!item.isvideoallowed ? <i className="fa-solid fa-lock-open text-white"/>
                                        : <i className="fa-solid fa-lock text-danger"/>}
                                </ListItemIcon>
                                <ListItemText
                                    style={{textDecoration: "none",}}
                                    primary={"Lesson - " + (index + 1)}/>
                            </ListItemButton>
                        </ListItem>
                    </Link>)
                }

            </List>
        </Box>
    );


    let navigate = useNavigate();
    let {pathname} = useLocation();

    const [lessons, setLesson] = useState([])

    useEffect(() => {
        instance.get("/UserLesson").then(res => {
            setLesson(res.data);
        })
    }, [pathname])


    function navigateClick(item) {
        if (item.isvideoallowed) {
            navigate(`/userPage/lessons/` + item.id)
        } else {
            toast.error("Videoni ko'rish uchun ruxsat berilmagan")
        }
    }


    return (

        <React.Fragment>
            <Button sx={{margin: width ? "20px" : "10px"}} onClick={toggleDrawer("left", true)}>
                <MenuIcon sx={{transform: `scale(${width ? 2 : 1.3})`}}/>
            </Button>
            <SwipeableDrawer
                anchor={"left"}
                open={state["left"]}
                onClose={toggleDrawer("left", false)}
                onOpen={toggleDrawer("left", true)}
            >
                {list("left")}
            </SwipeableDrawer>
            <Box component="main"
                 sx={{flexGrow: 1, p: 3, background: "#F5F2F5"}}>
                <Outlet/>
            </Box>
        </React.Fragment>

        // <div className={"_Lessonpage navbar_lesson"}>
        //     {lessons.length === 0 ?
        //         <h1 className={"text-center"}>Bepul darslarga qo'shilmagansiz</h1>
        //         :
        //         <div className={`navbarAdmin ${!bar ? "active_bar" : "dis_bar"}`}>
        //             <i
        //                 onClick={() => setBar(p => !p)}
        //                 className="fa-solid fa-xmark close_lesson"/>
        //             <a href="/">
        //                 <img className={"mx-4"} src={logo} alt="logo"/>
        //             </a>
        //             <Nav vertical className={"mt-5"}>
        //                 {
        //                     lessons?.map((item, index) =>
        //                         <div key={index}>
        //                             <button
        //                                 style={{cursor: item.isvideoallowed ? "" : "not-allowed"}}
        //                                 onClick={() => navigateClick(item)}
        //                                 to={`/userPage/lessons/` + item.id}
        //                                 className={`btn  ${item.isvideoallowed ? 'text-white' : 'text-secondary'}`}>
        //                                 <h4 className={"d-flex align-items-center"}>{item.isvideoallowed ?
        //                                     <i className="fa-solid fa-lock-open text-white"/> :
        //                                     <i className="fa-solid fa-lock text-danger"/>}&nbsp;Lesson={index + 1}</h4>
        //                             </button>
        //                         </div>
        //                     )
        //                 }
        //             </Nav>
        //         </div>
        //
        //     }
        //     <div className={"content_lesson"} onClick={() => setBar(false)}>
        //         {
        //             bar ? <i
        //                 onClick={() => setBar(p => !p)}
        //                 className="m-3 fa-solid fa-bars"/> : ""
        //         }
        //         <Outlet/>
        //    </div>*/

        // {/*</div>*/}
    );
}

export default Index;