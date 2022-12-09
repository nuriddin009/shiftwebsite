import React, {useEffect, useState} from 'react';
import "./index.scss"
import logo from "../../file/image/imageShift/logo2.svg";
import {Nav, NavItem} from "reactstrap";
import {Link, NavLink, Outlet, useLocation, useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import verify from "./verified.png";
import instance from "../../utils/instance";
import {styled, useTheme} from "@mui/material/styles";
import MuiAppBar from "@mui/material/AppBar";
import MuiDrawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Avatar from "@mui/material/Avatar";
import userImg from "../../file/image/imageShift/user.png";
import Image from "mui-image";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import PersonOutlineSharpIcon from "@mui/icons-material/PersonOutlineSharp";
import ListItemText from "@mui/material/ListItemText";
import OndemandVideoSharpIcon from "@mui/icons-material/OndemandVideoSharp";
import Box from "@mui/material/Box";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import Button from "@mui/material/Button";
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import NoAccountsIcon from '@mui/icons-material/NoAccounts';
import GroupsIcon from '@mui/icons-material/Groups';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import BackupTableIcon from '@mui/icons-material/BackupTable';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';

const drawerWidth = 300;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
    background: "#023247", color: "white",
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
    background: "#023247", color: "white",
});

const DrawerHeader = styled('div')(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: "#023247",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({theme, open}) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    padding: "0.6rem",
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, {shouldForwardProp: (prop) => prop !== 'open'})(
    ({theme, open}) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            background: "#023247",
            color: "white",
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);


function Index(props) {
    let activeStyle = {
        backgroundColor: "black",
        color: "#00C3FF"
    };
    let nowActive = {
        color: "#ffffff",
    };

    useEffect(() => {
        getMe()
    }, [])

    const {pathname} = useLocation()

    const [username, setUsername] = useState("")

    const navigate = useNavigate()

    function getMe() {
        instance.get("/user/me").then(({data}) => {
            setUsername(data.username)
        })
    }


    const [anchorEl, setAnchorEl] = React.useState(null);
    const open1 = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const theme = useTheme();
    const [open, setOpen] = React.useState(true);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
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


    function backgroundFunction(path) {
        return pathname === "/selectAdmin/" + path ? {
            background: "white",
            borderRight: "6px solid red",
        } : {}
    }

    function colorFunction(path) {
        return pathname === "/selectAdmin/" + path ? "#023247"
            : "white"
    }


    return (

        <Box sx={{display: 'flex'}}>
            <CssBaseline/>
            <AppBar sx={{background: "#023247", color: "white"}} open={open}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{
                            marginRight: 5,
                            ...(open && {display: 'none'}),
                        }}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Avatar
                        alt="Trevor Henderson"
                        src={userImg}
                        sx={{position: "fixed", right: "20px"}}
                        onClick={handleClick}
                    />

                    <Menu
                        id="fade-menu"
                        sx={{marginTop: "10px"}}
                        MenuListProps={{
                            'aria-labelledby': 'fade-button',
                        }}
                        anchorEl={anchorEl}
                        open={open1}
                        onClose={handleClose}
                        // TransitionComponent={Fade}
                    >
                        <MenuItem onClick={handleClose}>
                            <Link style={{textDecoration: "none", display: "flex", alignItems: "center", color: "blue"}}
                                  to={`/userPage/${username}/user`}>
                                <AccountCircleOutlinedIcon/>&nbsp;<h6 className={"mt-2"}>Profile</h6>
                            </Link>
                        </MenuItem>
                        <MenuItem onClick={handleClose}>
                            <Link style={{textDecoration: "none", display: "flex", alignItems: "center", color: "blue"}}
                                  to={"/"}><HomeOutlinedIcon/>&nbsp;<h6 className={"mt-2"}>Home</h6></Link>
                        </MenuItem>
                        <MenuItem sx={{display: "flex", alignItems: "center", color: "red"}}
                                  onClick={() => {
                                      localStorage.clear()
                                      navigate("/")
                                  }}><LogoutIcon/>&nbsp;<h6 className={"mt-2"}>Logout</h6></MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={open}>
                <DrawerHeader sx={{position: "sticky", padding: "1rem", boxSizing: "border-box"}}>
                    <Link to={"/"}>
                        <Image
                            style={{marginLeft: "-50px", transform: "scale(0.8)"}}
                            src={logo}
                            height={50}
                            width={200}
                            duration={3000}
                            showLoading={false}
                            errorIcon={true}
                            distance="150px"
                            // shiftDuration={90}
                            bgColor="inherit"
                        />
                    </Link>

                    <IconButton sx={{color: "white"}} onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon/> : <ChevronLeftIcon/>}
                    </IconButton>
                </DrawerHeader>

                <Divider/>
                <List>

                    <Link to={"/selectAdmin/studyCenter"} style={{textDecoration: "none"}}>
                        <ListItem
                            style={backgroundFunction("studyCenter")}
                            disablePadding sx={{display: 'block'}}>
                            <ListItemButton
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                        color: colorFunction("studyCenter")
                                    }}

                                >
                                    <GroupsIcon sx={{transform: "scale(1.5)"}}/>
                                </ListItemIcon>
                                <ListItemText
                                    style={{
                                        textDecoration: "none",
                                        color: colorFunction("studyCenter"),
                                        fontWeight: "bold"
                                    }}
                                    primary={"Groups"} sx={{opacity: open ? 1 : 0}}
                                />
                            </ListItemButton>
                        </ListItem>
                    </Link>
                    <Link to={"/selectAdmin/users"} style={{textDecoration: "none"}}>
                        <ListItem
                            style={backgroundFunction("users")}
                            disablePadding sx={{display: 'block'}}>
                            <ListItemButton
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                        color: colorFunction("users")
                                    }}
                                >
                                    <AccountCircleIcon sx={{transform: "scale(1.5)"}}/>
                                </ListItemIcon>
                                <ListItemText
                                    style={{textDecoration: "none", color: colorFunction("users")}}
                                    primary={"Users"} sx={{opacity: open ? 1 : 0}}
                                />
                            </ListItemButton>
                        </ListItem>
                    </Link>
                    <Link to={"/selectAdmin/delete/users"} style={{textDecoration: "none"}}>
                        <ListItem
                            style={backgroundFunction("delete/users")}
                            disablePadding sx={{display: 'block'}}>
                            <ListItemButton
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                        color: colorFunction("delete/users")
                                    }}
                                >
                                    <NoAccountsIcon sx={{transform: "scale(1.5)"}}/>
                                </ListItemIcon>
                                <ListItemText
                                    style={{textDecoration: "none", color: colorFunction("delete/users")}}
                                    primary={"Shiftdan haydalganlar"} sx={{opacity: open ? 1 : 0}}
                                />
                            </ListItemButton>
                        </ListItem>
                    </Link>
                    <Link to={"/selectAdmin/certificate"} style={{textDecoration: "none"}}>
                        <ListItem
                            style={backgroundFunction("certificate")}
                            disablePadding sx={{display: 'block'}}>
                            <ListItemButton
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                        color: colorFunction("certificate")
                                    }}
                                >
                                    <WorkspacePremiumIcon sx={{transform: "scale(1.5)"}}/>
                                </ListItemIcon>
                                <ListItemText
                                    style={{textDecoration: "none", color: colorFunction("certificate")}}
                                    primary={"Certificate"} sx={{opacity: open ? 1 : 0}}
                                />
                            </ListItemButton>
                        </ListItem>
                    </Link>
                    <Link to={"/selectAdmin/lesson"} style={{textDecoration: "none"}}>
                        <ListItem
                            style={backgroundFunction("lesson")}
                            disablePadding sx={{display: 'block'}}>
                            <ListItemButton
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                        color: colorFunction("lesson")
                                    }}
                                >
                                    <OndemandVideoSharpIcon sx={{transform: "scale(1.5)"}}/>
                                </ListItemIcon>
                                <ListItemText
                                    style={{textDecoration: "none", color: colorFunction("lesson")}}
                                    primary={"Lessons"} sx={{opacity: open ? 1 : 0}}
                                />
                            </ListItemButton>
                        </ListItem>
                    </Link>
                    <Link to={"/selectAdmin/rooms"} style={{textDecoration: "none"}}>
                        <ListItem
                            style={backgroundFunction("rooms")}
                            disablePadding sx={{display: 'block'}}>
                            <ListItemButton
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                        color: colorFunction("rooms")
                                    }}
                                >
                                    <BackupTableIcon sx={{transform: "scale(1.5)"}}/>
                                </ListItemIcon>
                                <ListItemText
                                    style={{textDecoration: "none", color: colorFunction("rooms")}}
                                    primary={"Rooms"} sx={{opacity: open ? 1 : 0}}
                                />
                            </ListItemButton>
                        </ListItem>
                    </Link>
                    <ListItem
                        disablePadding sx={{display: 'block'}}>
                        <ListItemButton
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : 'auto',
                                    justifyContent: 'center',
                                    color: "white"
                                }}
                            >
                                <PersonRemoveIcon sx={{transform: "scale(1.5)"}}/>
                                {/*<OndemandVideoSharpIcon/>*/}
                            </ListItemIcon>
                            <ListItemText
                                style={{textDecoration: "none", color: "white"}}
                                primary={"Unclock users"} sx={{opacity: open ? 1 : 0}}
                            />
                        </ListItemButton>
                    </ListItem>

                </List>
            </Drawer>
            <Box component="main" sx={{flexGrow: 1, p: 3}}>
                <Outlet/>
            </Box>
        </Box>

        // <div className={"selectadmin_ "}>
        //
        //
        //
        //     <div className={"navbarAdmin"}>
        //         <Link to="/">
        //             <img className={"mx-4"} src={logo} alt="logo"/>
        //         </Link>
        //
        //
        //
        //         <Nav vertical>
        //             <NavItem>
        //                 <NavLink to={"/admin/title"} style={({isActive}) => isActive ? activeStyle : nowActive}><h4
        //                     className={"mt-5"}>Admin Shift</h4></NavLink>
        //             </NavItem>
        //             <NavItem>
        //                 <NavLink to={"/selectadmin/studyCenter"}
        //                          style={({isActive}) => isActive ? activeStyle : nowActive}>
        //                     <h4>O'quv Markazi</h4>
        //                 </NavLink>
        //             </NavItem>
        //             <NavItem>
        //                 <NavLink to={"/selectadmin/users"} style={({isActive}) => isActive ? activeStyle : nowActive}>
        //                     <h4>Users</h4>
        //                 </NavLink>
        //             </NavItem>
        //             <NavItem>
        //                 <NavLink to={"/selectadmin/delete/users"}
        //                          style={({isActive}) => isActive ? activeStyle : nowActive}>
        //                     <h4>Shiftdan haydalganlar</h4>
        //                 </NavLink>
        //             </NavItem>
        //
        //             {/*<NavItem>*/}
        //             {/*    <NavLink to={"/Mentor"} style={({isActive}) => isActive ? activeStyle : nowActive}>*/}
        //             {/*        <h4>Mentor</h4>*/}
        //             {/*    </NavLink>*/}
        //             {/*</NavItem>*/}
        //             <NavItem>
        //                 <NavLink to={"/selectadmin/lesson"} style={({isActive}) => isActive ? activeStyle : nowActive}>
        //                     <h4>Lesson</h4>
        //                 </NavLink>
        //             </NavItem>
        //             <NavItem>
        //                 <NavLink to={"/selectadmin/rooms"}
        //                          style={({isActive}) => isActive ? activeStyle : nowActive}>
        //                     <h4>Rooms</h4>
        //                 </NavLink>
        //             </NavItem>
        //             <NavItem>
        //                 <NavLink to={"/selectadmin/certificate"}
        //                          style={({isActive}) => isActive ? activeStyle : nowActive}>
        //                     <h4
        //                         style={{display: "flex", alignItems: "center"}}
        //                     >Certificate <img
        //                         style={{marginLeft: "5px"}}
        //                         width={20} height={20}
        //                         src={verify} alt="verify"/></h4>
        //                 </NavLink>
        //             </NavItem>
        //         </Nav>
        //         <li className={"text-danger"} onClick={unlockUsers}>
        //             <h4> Unlock users</h4>
        //         </li>
        //     </div>
        //     <Outlet />
        // </div>
    )
        ;
}

export default Index;