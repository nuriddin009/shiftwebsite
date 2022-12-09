import React, {useEffect, useState} from 'react';
import "./index.scss"
import logo from "../file/image/imageShift/logo2.svg";
import {Link, Outlet, useLocation, useNavigate, useParams} from "react-router-dom";
import instance from "../utils/instance";
import {styled, useTheme} from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Image from 'mui-image'
import PersonOutlineSharpIcon from '@mui/icons-material/PersonOutlineSharp';
import OndemandVideoSharpIcon from '@mui/icons-material/OndemandVideoSharp';
import Avatar from '@mui/material/Avatar';
import userImg from "../file/image/imageShift/user.png";
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button';

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
    const {username} = useParams()
    const navigate = useNavigate()
    let {pathname} = useLocation()
    const [lessons, setLessons] = useState([])
    const [isAdmin, setIsAdmin] = useState(false)
    const [bar, setBar] = useState(false)

    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    useEffect(() => {

        document.title = "User page"

        instance.get("/UserLesson/" + username).then(res => {
            setLessons(res.data)
        })
        getMe()
    }, [pathname])


    //Mobile version

    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });

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
                width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250,
                height: "100vh",
                background: "#023247",
                color: "white"
            }}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >

        </Box>
    );


    //  Mobile v


    function logOut() {
        navigate("/")
        localStorage.removeItem("token")
        localStorage.removeItem("role")
    }

    function getMe() {
        instance.get("/user/me").then(({data}) => {
            if (data.roles.filter(item => item.roleName === "ROLE_ADMIN"
                || item.roleName === "ROLE_SUPERADMIN").length > 0) {
                setIsAdmin(true)
            }
        })
    }


    let activeStyle = {
        backgroundColor: "black",
        color: "#00C3FF"
    };
    let nowActive = {
        color: "#ffffff",
    };

    let backColor = pathname.endsWith("/user") ? "#fff" : ""
    let colorA = pathname.endsWith("/user") ? "#023247" : "#fff"

    return (
        <div className={"_userPage"}>


            {
                window.innerWidth > 600 ? <Box sx={{display: 'flex'}}>
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
                                />
                            </Toolbar>
                        </AppBar>
                        <Drawer variant="permanent" open={open}>
                            <DrawerHeader sx={{padding: "1rem", boxSizing: "border-box"}}>
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

                            {/*<TreeView*/}
                            {/*    aria-label="multi-select"*/}
                            {/*    defaultCollapseIcon={<ExpandMoreIcon />}*/}
                            {/*    defaultExpandIcon={<ChevronRightIcon />}*/}
                            {/*    multiSelect*/}
                            {/*    sx={{ height: 216, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}*/}
                            {/*>*/}
                            {/*    /!*<TreeItem nodeId="1" label="Applications">*!/*/}
                            {/*    /!*    <TreeItem nodeId="2" label="Calendar" />*!/*/}
                            {/*    /!*    <TreeItem nodeId="3" label="Chrome" />*!/*/}
                            {/*    /!*    <TreeItem nodeId="4" label="Webstorm" />*!/*/}
                            {/*    /!*</TreeItem>*!/*/}
                            {/*    /!*<TreeItem nodeId="5" label="Documents">*!/*/}
                            {/*    /!*    <TreeItem nodeId="6" label="MUI">*!/*/}
                            {/*    /!*        <TreeItem nodeId="7" label="src">*!/*/}
                            {/*    /!*            <TreeItem nodeId="8" label="index.js" />*!/*/}
                            {/*    /!*            <TreeItem nodeId="9" label="tree-view.js" />*!/*/}
                            {/*    /!*        </TreeItem>*!/*/}
                            {/*    /!*    </TreeItem>*!/*/}
                            {/*    /!*</TreeItem>*!/*/}
                            {/*</TreeView>*/}

                            <List>
                                <Link style={{textDecoration: "none"}} to={`/userPage/${username}/user`}>
                                    <ListItem disablePadding sx={{display: 'block', background: backColor, color: colorA}}>
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
                                                    color: colorA
                                                }}
                                            >
                                                <PersonOutlineSharpIcon sx={{transform: "scale(1.5)"}}/>
                                            </ListItemIcon>
                                            <ListItemText
                                                style={{textDecoration: "none", color: colorA}}
                                                sx={{fontWeight:"bolder"}}
                                                primary={"Profile"} sx={{opacity: open ? 1 : 0}}/>
                                        </ListItemButton>
                                    </ListItem>
                                </Link>
                                <Link style={{textDecoration: "none"}} to={`/userPage/${username}/lessons`}>
                                    <ListItem
                                        style={{background: pathname === `userPage/${username}/user` ? "white" : ""}}
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
                                                <OndemandVideoSharpIcon sx={{transform: "scale(1.5)"}}/>
                                            </ListItemIcon>
                                            <ListItemText
                                                style={{textDecoration: "none", color: "white"}}
                                                primary={"Lessons"} sx={{opacity: open ? 1 : 0}}
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                </Link>
                            </List>
                        </Drawer>
                        <Box component="main" sx={{flexGrow: 1, p: 3, background: "#F5F2F5"}}>
                            <Outlet/>
                        </Box>
                    </Box>
                    :
                    <React.Fragment>
                        <Button onClick={toggleDrawer("left", true)}>"left"</Button>
                        <SwipeableDrawer
                            anchor={"left"}
                            open={state["left"]}
                            onClose={toggleDrawer("left", false)}
                            onOpen={toggleDrawer("left", true)}
                        >
                            {list("left")}
                        </SwipeableDrawer>
                    </React.Fragment>
            }


            {/*<div className={`navbarAdmin ${bar ? "dis_bar" : ""}`}>*/}
            {/*    <i*/}
            {/*        onClick={() => setBar(p => !p)}*/}
            {/*        className="fa-solid fa-xmark close_bar"*/}
            {/*    />*/}
            {/*    <a href="/">*/}
            {/*        <img className={"mx-4"} src={logo} alt="logo"/>*/}
            {/*    </a>*/}
            {/*    <Nav vertical>*/}
            {/*        <NavItem>*/}
            {/*            <NavLink to={"/userPage/" + username + "/user"}*/}
            {/*                     style={({isActive}) => isActive ? activeStyle : nowActive}><h4*/}
            {/*                className={"mt-5"}>Profil</h4></NavLink>*/}
            {/*        </NavItem>*/}
            {/*        {*/}
            {/*            isAdmin ? <NavItem>*/}
            {/*                    <NavLink to={"/selectAdmin"}*/}
            {/*                             style={({isActive}) => isActive ? activeStyle : nowActive}><h4*/}
            {/*                        className={""}>Dashboard</h4></NavLink>*/}
            {/*                </NavItem>*/}
            {/*                : ""*/}
            {/*        }*/}
            {/*        {*/}
            {/*            lessons.length !== 0 ?*/}

            {/*                <NavItem>*/}
            {/*                    <NavLink to={"/userPage/" + username + "/lessons"}*/}
            {/*                             style={({isActive}) => isActive ? activeStyle : nowActive}>*/}
            {/*                        <h4>Lessons</h4>*/}
            {/*                    </NavLink>*/}
            {/*                </NavItem>*/}
            {/*                : ""*/}
            {/*        }*/}


            {/*    </Nav>*/}
            {/*    <button className={"btn btn-primary"} onClick={logOut}>Log-out</button>*/}

            {/*</div>*/}
            {/*<div className="content">*/}
            {/*    <i*/}
            {/*        onClick={() => setBar(p => !p)}*/}
            {/*        className="fa-solid fa-bars bar_menu"*/}
            {/*    />*/}
            {/*    <Outlet/>*/}
            {/*</div>*/}
        </div>
    );
}

export default Index;