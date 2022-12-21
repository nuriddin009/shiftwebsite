import React, {useEffect, useState} from 'react';
import "./index.scss"
import {useLocation} from "react-router-dom";
import {Controller, useForm} from "react-hook-form";
import 'react-phone-number-input/style.css'
import {toast} from "react-toastify";
import PhoneInput from 'react-phone-input-2';
import logo from "../../../shift/file/image/imageShift/logo2.svg";
import Select from 'react-select'
import instance from "../../../shift/utils/instance";
import {styled} from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, {tableCellClasses} from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import SelectMui from '@mui/material/Select';
import Pagination from '@mui/material/Pagination';
import Box from '@mui/material/Box';
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {Dialog, InputLabel} from "@mui/material";

function Index(props) {

    let {isSuper} = props

    const [rodal, setRodal] = useState(false);
    const [input, setInput] = useState("");
    const [active, setActive] = useState(false);
    const [users, setUsers] = useState(null);
    const [modalUserEdit, setModalUserEdit] = useState(null);
    const [totalPages, setTotalPages] = useState([]);
    const [currentPageNumber, setCurrentPageNumber] = useState(false);
    const [edituser, setEdituser] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [page, setPage] = useState(0);
    const [roles, setRoles] = useState(null);
    const [filterRole, setFilterRole] = useState("");


    let {reset, register, handleSubmit, formState: {errors}, control} = useForm();
    let location = useLocation();

    function getUsers(input, active, page, role) {
        instance.get(`/user`, {params: {input, active, page, role}}).then(res => {
            setUsers(res.data.content)
            setTotalPages(res.data.totalPages);
            setCurrentPageNumber(res.data.number)
        })
    }

    function getRole() {
        instance.get("/user/role").then(res => {
            let a = [];
            res.data.map(item => a.push({value: item.id, label: item.roleName}))
            setRoles(a)
        })
    }

    useEffect(() => {
        getUsers("", "", 0, filterRole);
        getRole()
    }, [location.pathname])

    function rodalVisisble() {
        setRodal(p => !p)
        reset({
            firstName: "",
            lastName: "",
            phoneNumber: "",
            userName: "",
            fatherPhoneNumber: "",
            address: "",
            username: "",
            age: "",
            password: "",
            password_repid: "",
            activ: false
        })
    }

    function goToPage(event, page) {
        setPage(page - 1)
        getUsers("", "", page - 1, filterRole);
    }

    function mySubmit(data) {

        if (data.firstName === "" || data.lastName === "") {
            toast.error("Iltimos ism familiyasini to'liq kiriting")
            return;
        }

        if (data.phoneNumber !== "" || data.fatherPhoneNumber !== "") {
            data = {
                ...data,
                phoneNumber: data.phoneNumber.startsWith("+") ? data.phoneNumber : "+" + data.phoneNumber,
                fatherPhoneNumber: data.fatherPhoneNumber.startsWith("+") ? data.fatherPhoneNumber : "+" + data.fatherPhoneNumber
            }
        } else {
            toast.error("Enter phone numbers")
        }
        if (data.username === "" && data.password === "" && data.password_repid === "") {
            let phone = data.phoneNumber.substring(data.phoneNumber.length - 4);
            data = {
                ...data,
                username: data.firstName.toLocaleLowerCase() + data.lastName.toLocaleLowerCase() + phone,
                password: data.firstName.toLocaleLowerCase() + data.lastName.toLocaleLowerCase() + phone,
                password_repid: data.firstName.toLocaleLowerCase() + data.lastName.toLocaleLowerCase() + phone
            }
        }
        if (modalUserEdit) {
            if (data.password === data.password_repid) {
                instance.post("/user/edit", data).then(res => {
                    rodalVisisble()
                    setModalUserEdit(null);
                    getUsers("", "", 0, filterRole);
                })
            } else {
                toast.error("Parol bir xil emas")
            }
            return;
        } else {
            if (data.password === data.password_repid) {
                instance.post("/user", data).then(res => {
                    if (res.data.success) {
                        getUsers("", "", 0, filterRole);
                        rodalVisisble()
                    } else {
                        toast.error(res.data.message)
                    }
                })
            } else {
                toast.error("Parol bir xil emas")
            }
        }

    }

    function editActive(e, id) {
        instance.patch(`/user/editActive?id=${id}&activ=${e.target.checked}`).then(res => {
            getUsers(input, "", page, filterRole)
        })
    }

    function handleInput(e) {
        getUsers(e.target.value, "", 0, filterRole)
        setInput(e.target.value)
    }

    function handleCheck(e) {
        getUsers(input, e.target.checked, 0, filterRole)
        setActive(e.target.checked)
    }

    function resetI() {
        setActive("")
        setInput("")
        getUsers("", "", 0, "")
    }

    function editusers(item, index, user) {
        setEdituser({item, index})
        setCurrentUser(user);
    }


    function editRodal(item, index) {
        rodalVisisble()
        reset({...item, userName: item.username})
        setModalUserEdit(item);
        let a = []
        item.roles.map(item1 => a.push({value: item1.id + "", label: item1.roleName, color: '#00B8D9'}))
    }


    function selectRoles(e, item, index) {
        let a = []

        e.map(item => a.push({id: item.value, roleName: item.label}))
        let data = {userId: item.id, roles: a}
        instance.post("/user/role", data).then(res => {
            if (res.data.success) {
                toast.success(res.data.message)
                getUsers("", "", page, filterRole)
            } else {
                toast.error(res.data.message)
            }
        })
    }


    const styleSelect = {
        multiValueLabel: (provided, state) => ({
            ...provided,
            width: '185px'
        }),
    }

    function deleteUser(item, index) {

        if (window.confirm("Rostdan ham " + item.firstName + " " + item.lastName + " ni o'chirmoqchimisiz?")) {
            instance.delete("/deleteUser", {params: {userId: item.id}}).then(res => {
                getUsers("", "", 0, "")
                toast.success(item.firstName + " " + item.lastName + " user o'chirildi")
            })
        }

    }

    function filterByRole(e) {
        let selectRoleValue = e.target.value !== "ROLE FILTER" ? e.target.value : "";
        setFilterRole(selectRoleValue);
        getUsers(input, "", 0, selectRoleValue)
    }

    const StyledTableCell = styled(TableCell)(({theme}) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
        },
    }));

    const StyledTableRow = styled(TableRow)(({theme}) => ({
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
        // hide last border
        '&:last-child td, &:last-child th': {
            border: 0,
        },
    }));


    const IOSSwitch = styled((props) => (
        <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
    ))(({theme}) => ({
        width: 42,
        height: 26,
        padding: 0,
        '& .MuiSwitch-switchBase': {
            padding: 0,
            margin: 2,
            transitionDuration: '300ms',
            '&.Mui-checked': {
                transform: 'translateX(16px)',
                color: '#fff',
                '& + .MuiSwitch-track': {
                    backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#65C466',
                    opacity: 1,
                    border: 0,
                },
                '&.Mui-disabled + .MuiSwitch-track': {
                    opacity: 0.5,
                },
            },
            '&.Mui-focusVisible .MuiSwitch-thumb': {
                color: '#33cf4d',
                border: '6px solid #fff',
            },
            '&.Mui-disabled .MuiSwitch-thumb': {
                color:
                    theme.palette.mode === 'light'
                        ? theme.palette.grey[100]
                        : theme.palette.grey[600],
            },
            '&.Mui-disabled + .MuiSwitch-track': {
                opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
            },
        },
        '& .MuiSwitch-thumb': {
            boxSizing: 'border-box',
            width: 22,
            height: 22,
        },
        '& .MuiSwitch-track': {
            borderRadius: 26 / 2,
            backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
            opacity: 1,
            transition: theme.transitions.create(['background-color'], {
                duration: 500,
            }),
        },
    }));

    return (
        <div className={"UsersAdmin m-3 "}>
            <h1>Users</h1>
            <div>
                <div className={"filters"}>

                    <div className="filter-child">
                        <Button
                            onClick={rodalVisisble}
                            variant="contained"
                            color="primary"
                        >Add&nbsp;user</Button>

                        <TextField
                            value={input}
                            onChange={handleInput}
                            id="outlined-search"
                            label="Search users"
                            type="search"
                        />
                    </div>


                    <div className="filter-child">

                        <FormControlLabel
                            label="Active"
                            control={<IOSSwitch
                                sx={{m: 1}}
                                checked={active}
                                onChange={handleCheck}
                            />}
                        />

                        {
                            input !== "" || active !== false ?
                                <Button
                                    onClick={resetI}
                                    variant="contained"
                                    color="error"
                                >Reset</Button>
                                :
                                ""
                        }
                    </div>

                    <FormControl sx={{minWidth: 160}}>
                        <InputLabel style={{background: "white"}}
                                    id="demo-simple-select-label">ROLE FILTER</InputLabel>
                        <SelectMui
                            value={filterRole}
                            onChange={filterByRole}
                            label={"ROLE FILTER"}
                        >
                            <MenuItem value="">
                                <em>ROLE FILTER</em>
                            </MenuItem>
                            <MenuItem value={"ROLE_STUDENT"}>ROLE_STUDENT</MenuItem>
                            <MenuItem value={"ROLE_ADMIN"}>ROLE_ADMIN</MenuItem>
                            <MenuItem value={"ROLE_MENTOR"}>ROLE_MENTOR</MenuItem>
                            <MenuItem value={"ROLE_SUPERADMIN"}>ROLE_SUPERADMIN</MenuItem>
                        </SelectMui>
                    </FormControl>
                </div>


                <TableContainer component={Paper}>
                    <Table sx={{minWidth: 700}} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>FirstName</StyledTableCell>
                                <StyledTableCell align="left">LastName</StyledTableCell>
                                <StyledTableCell align="left">Username</StyledTableCell>
                                <StyledTableCell align="left">Phone number</StyledTableCell>
                                <StyledTableCell align="left">Parent number</StyledTableCell>
                                <StyledTableCell align="left">Age</StyledTableCell>
                                <StyledTableCell align="left">Address</StyledTableCell>
                                <StyledTableCell align="left">Active</StyledTableCell>
                                {isSuper && (<StyledTableCell align="left">Roles</StyledTableCell>)}
                                <StyledTableCell align="left">Action</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users?.map((user, index) => (
                                <StyledTableRow key={user.id}>
                                    <StyledTableCell component="th" scope="row">
                                        {user.firstName}
                                    </StyledTableCell>
                                    <StyledTableCell align="left">{user.lastName}</StyledTableCell>
                                    <StyledTableCell align="left">{user.username}</StyledTableCell>
                                    <StyledTableCell align="left">{user.phoneNumber}</StyledTableCell>
                                    <StyledTableCell align="left">{user.fatherPhoneNumber}</StyledTableCell>
                                    <StyledTableCell align="left">{user.age}</StyledTableCell>
                                    <StyledTableCell align="left">{user.address}</StyledTableCell>
                                    <StyledTableCell align="left">
                                        <FormControlLabel
                                            control={<IOSSwitch sx={{m: 1}} checked={user.activ}
                                                                onChange={(e) => editActive(e, user.id)}
                                            />}
                                        />
                                    </StyledTableCell>
                                    {isSuper && (<StyledTableCell align="left">
                                        <Select
                                            styles={styleSelect}
                                            isMulti
                                            name="colors"
                                            onChange={(e) => selectRoles(e, user, index)}
                                            options={roles}
                                            value={user.roles.map(item => ({value: item.id, label: item.roleName}))}
                                            className="basic-multi-select"
                                            classNamePrefix="select"
                                            placeholder={"Roles..."}
                                        />
                                    </StyledTableCell>)}
                                    <StyledTableCell align="left">
                                        <Stack direction="row" spacing={2}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                startIcon={<EditIcon/>}
                                                onClick={() => editRodal(user, index)}
                                            >
                                                edit
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="error"
                                                startIcon={<DeleteIcon/>}
                                                onClick={() => deleteUser(user, index)}
                                            >
                                                delete
                                            </Button>
                                        </Stack>
                                    </StyledTableCell>

                                </StyledTableRow>
                            ))}
                            <StyledTableRow></StyledTableRow>
                            <StyledTableRow></StyledTableRow>
                            <StyledTableRow></StyledTableRow>
                        </TableBody>
                    </Table>
                </TableContainer>


                {
                    totalPages > 1 ?
                        <Box
                            sx={{
                                width: "100%",
                                height: "80px",
                                display: "flex", alignItems: "center"
                            }}
                        >
                            <Stack>
                                <Pagination
                                    count={totalPages}
                                    color="primary"
                                    size="large"
                                    onChange={goToPage}
                                />
                            </Stack>
                        </Box>
                        : ""
                }


            </div>
            <Dialog height={530} width={800} open={rodal} onClose={rodalVisisble}>
                <div style={{overflowY: "auto"}} className="card register-card">
                    <div style={{background: "#023247"}} className="card-header bgCollor"><img width={150} src={logo}
                                                                                               alt="logo"/></div>
                    <div className="card-body card_body">
                        <form id={"my_form"} onSubmit={handleSubmit(mySubmit)}>

                            <div className="d-flex gap-3">
                                <div className={"w-50"}>
                                    <input className={"form-control my-1"} type="text"
                                           placeholder={"FirstName..."} {...register("firstName", {required: true})}/>
                                    {errors.firstName ? <p className={"text-danger"}>Ismni kiritish majburiy</p> : ""}
                                </div>

                                <div className={"w-50"}>
                                    <input className={"form-control my-1"} type="text"
                                           placeholder={"LastName..."} {...register("lastName", {required: true})}/>
                                    {errors.lastName ?
                                        <p className={"text-danger"}>Familyani kiritish majburiy</p> : ""}
                                </div>
                            </div>


                            <div className="d-flex gap-3">
                                <div className={"w-50"}>
                                    <label htmlFor="phoneNumber">Phone Number</label>
                                    <Controller
                                        name="phoneNumber"
                                        control={control}
                                        render={({field: {onChange, value}}) => (
                                            <PhoneInput
                                                country={"uz"}
                                                containerClass={"phone_input"}
                                                value={value}
                                                placeholder={"+998 99 123 45 67"}
                                                onChange={onChange}
                                                prefix={"+"}
                                            />
                                        )}
                                    />
                                    {errors["phoneNumber"] && (
                                        <p className="error-message text-danger">Invalid Phone</p>
                                    )}
                                </div>

                                <div className={"w-50"}>
                                    Masul shaxs
                                    <Controller
                                        name="fatherPhoneNumber"
                                        control={control}
                                        render={({field: {onChange, value}}) => (
                                            <PhoneInput
                                                country={"uz"}
                                                containerClass={"phone_input"}
                                                value={value}
                                                placeholder={"+998 99 123 45 67"}
                                                onChange={onChange}
                                                prefix={"+"}
                                            />
                                        )}
                                    />


                                    {errors["phoneNumber"] && (
                                        <p className="error-message text-danger">Invalid Phone</p>
                                    )}
                                </div>
                            </div>

                            <div className={"d-flex align-items-center"}>

                                <input style={{width: "100px"}} min={6} max={100} className={"form-control my-1"}
                                       type="number"
                                       placeholder={"Age"} {...register("age", {required: true, min: 7, max: 70})}/>

                                <label className={"d-flex align-items-start"}>
                                    <p className={"mx-2"}>
                                        isActive
                                    </p>
                                    <input className={"form-check-input my-1"} type="checkbox"
                                           id="flexSwitchCheckChecked" placeholder={"Age"} {...register("activ")}/>
                                </label>
                            </div>


                            <div className="d-flex gap-3">
                                <div className="w-50">
                                    <input className={"form-control my-1"} type="text" minLength={6}
                                           placeholder={"Login"} {...register("username", {
                                        minLength: 5
                                    })}/>
                                    {errors.username ?
                                        <p className={"text-danger"}>Username 6 ta harfdan kam bo'lmasligi
                                            kerak</p> : ""}
                                    <input className={"form-control my-1"} type="password" minLength={6}
                                           placeholder={"Password"} {...register("password")}/>
                                    <input className={"form-control my-1"} type="password" minLength={6}
                                           placeholder={"Password Repid"} {...register("password_repid")}/>
                                </div>
                                <div className={"w-50"}>
                                  <textarea className={"form-control my-1"} cols="30" rows="2"
                                            placeholder={"Address"} {...register("address", {required: true})}/>
                                    {errors.address ? <p className={"text-danger"}>Manzil kiritish majburiy</p> : ""}
                                </div>
                            </div>


                        </form>

                    </div>
                    <div style={{background: "#023247"}} className="card-footer  text-end bgCollor">
                        <button onClick={rodalVisisble} className={"btn btn-danger"}>cancel</button>
                        <button onClick={mySubmit} form={"my_form"} className={"btn btn-dark"}>Save</button>
                    </div>
                </div>
            </Dialog>

        </div>
    );
}

export default Index;
