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


const drawerWidth = window.innerWidth > 660 ? 300 : 200;

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
        instance.get("/UserLesson").then(res => {
            setLessons(res.data)
        })
        getMe()
    }, [pathname])


    function colorFunction(path) {
        return pathname === "/userPage/" + path ?
            {
                background: "#fff",
                color: "#023247"
            } : {background: "#023247", color: "#fff"}
    }

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
        >
            <DrawerHeader sx={{padding: "1rem", boxSizing: "border-box"}}>
                <Link to={"/"}>
                    <Image
                        style={{transform: "scale(0.6)"}}
                        src={logo}
                        height={50}
                        width={200}
                        duration={3000}
                        showLoading={false}
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
                <Link style={{textDecoration: "none"}} to={`/userPage/user`}>
                    <ListItem
                        onClick={toggleDrawer(anchor, false)}
                        disablePadding sx={{display: 'block', ...colorFunction("user")}}>
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
                                style={colorFunction("user")}
                            >
                                <PersonOutlineSharpIcon sx={{transform: "scale(1.5)"}}/>
                            </ListItemIcon>
                            <ListItemText
                                style={{textDecoration: "none", ...colorFunction("user")}}
                                primary={"Profile"}/>
                        </ListItemButton>
                    </ListItem>
                </Link>
                {
                    lessons.length !== 0 ? <Link style={{textDecoration: "none"}} to={`/userPage/lessons`}>
                            <ListItem
                                onClick={toggleDrawer(anchor, false)}
                                disablePadding sx={{display: 'block', ...colorFunction("lessons")}}>
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
                                        style={colorFunction("lessons")}
                                    >
                                        <OndemandVideoSharpIcon sx={{transform: "scale(1.5)"}}/>
                                    </ListItemIcon>
                                    <ListItemText
                                        style={{textDecoration: "none", ...colorFunction("lessons")}}
                                        primary={"Lessons"}
                                    />
                                </ListItemButton>
                            </ListItem>
                        </Link>
                        : ""
                }
            </List>
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


    let width = window.innerWidth > 660


    return (
        <div className={"_userPage"}>


            {
                window.innerWidth > 660 ? <Box sx={{display: 'flex'}}>
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

                            <List>
                                <Link style={{textDecoration: "none"}} to={`/userPage/user`}>
                                    <ListItem disablePadding sx={{display: 'block', ...colorFunction("user")}}>
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
                                                }}
                                                style={colorFunction("user")}
                                            >
                                                <PersonOutlineSharpIcon sx={{transform: "scale(1.5)"}}/>
                                            </ListItemIcon>
                                            <ListItemText
                                                style={{textDecoration: "none", ...colorFunction("user")}}
                                                primary={"Profile"} sx={{opacity: open ? 1 : 0}}/>
                                        </ListItemButton>
                                    </ListItem>
                                </Link>
                                <Link style={{textDecoration: "none"}} to={`/userPage/lessons`}>
                                    <ListItem
                                        style={{background: pathname === `userPage/user` ? "white" : ""}}
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
                                                }}
                                                style={colorFunction("lesson")}
                                            >
                                                <OndemandVideoSharpIcon sx={{transform: "scale(1.5)"}}/>
                                            </ListItemIcon>
                                            <ListItemText
                                                style={{textDecoration: "none", ...colorFunction("lesson")}}
                                                primary={"Lessons"} sx={{opacity: open ? 1 : 0}}
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                </Link>
                            </List>
                        </Drawer>
                        <Box component="main"
                             sx={{
                                 flexGrow: 1, p: 3, background: "#F5F2F5"
                             }}>
                            <Outlet/>
                        </Box>
                    </Box>
                    :
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
            }
        </div>
    );
}

export default Index;