import React, {useEffect, useState} from 'react';
import {useForm} from "react-hook-form";
import "./index.scss"
import {toast} from "react-toastify";
import instance from "../../utils/instance";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import SaveIcon from '@mui/icons-material/Save';
import Avatar from '@mui/material/Avatar';
import userImg from "../../file/image/imageShift/user.png"
import Stack from "@mui/material/Stack";
import PhoneInput from "react-phone-input-2";
import {FormHelperText} from "@mui/material";

function Index(props) {
    const {handleSubmit, register, reset} = useForm()

    const [phone, setPhone] = useState("")


    const [errorText, setErrorText] = useState({
        firstName: false,
        lastName: false,
        username: false,
        phoneNumber: false,
        fatherPhoneNumber: false,
        age: false,
        oldPassword: false,
        newPassword: false,
        confirmPassword: false
    })


    const [user, setUser] = useState()
    useEffect(() => {
        document.title = "Profile page";
        instance.get("/user/myData").then(res => {
            if (res.data.success) {
                setUser(res.data.data)
                setPhone(res.data.data.phoneNumber)
            }
        })
    }, [])

    function handleInput(e, type) {
        let a = {...user}
        a[type] = e.target.value
        setUser(a)
    }


    function submit() {
        if (user?.username === "" ||
            user?.firstName === "" ||
            user?.lastName === "" ||
            user?.age === "" ||
            phone === "" ||
            phone.length < 9
        ) {
            toast.error("Please enter complete information")
            setErrorText({
                ...errorText,
                firstName: user?.firstName === "",
                lastName: user?.lastName === "",
                age: user?.age === "",
                phoneNumber: phone === "" && phone.length > 9,
                fatherPhoneNumber: user?.fatherPhoneNumber === "",
                username: user?.username === "",
                oldPassword: false,
                newPassword: false,
                confirmPassword: false
            })
            return;
        } else {
            let data = {
                username: user?.username,
                firstName: user?.firstName,
                lastName: user?.lastName,
                age: user?.age,
                phoneNumber: phone,
                fatherPhoneNumber: user?.fatherPhoneNumber
            }

            instance.post("/user/oneUser", data).then(res => {
                if (res.data.success) {
                    toast.success(res.data.message)
                    setErrorText({
                        ...errorText,
                        firstName: false,
                        lastName: false,
                        username: false,
                        phoneNumber: false,
                        fatherPhoneNumber: false,
                        age: false,
                        oldPassword: false,
                        newPassword: false,
                        confirmPassword: false
                    })
                } else {
                    toast.error("Error")
                }
            })
        }

    }

    function forPassword(data) {
        if (data.newPassword === data.confirmPassword
            && data.oldPassword && data.newPassword && data.confirmPassword) {
            instance.put("/user/edit_password", data).then(res => {
                if (res.data.success) {
                    toast.success(res.data.message)
                    reset({confirmPassword: "", newPassword: "", oldPassword: ""})
                    setErrorText({
                        ...errorText,
                        firstName: false,
                        lastName: false,
                        username: false,
                        phoneNumber: false,
                        fatherPhoneNumber: false,
                        age: false,
                        oldPassword: false,
                        newPassword: false,
                        confirmPassword: false
                    })
                } else {
                    toast.error(res.data.message)
                }
            })
        } else {
            if (data.newPassword === data.confirmPassword) {
                setErrorText({
                    ...errorText,
                    firstName: false,
                    lastName: false,
                    username: false,
                    phoneNumber: false,
                    fatherPhoneNumber: false,
                    age: false,
                    oldPassword: data.oldPassword === "",
                    newPassword: data.newPassword === "",
                    confirmPassword: data.confirmPassword === ""
                })
            } else {
                setErrorText({
                    ...errorText,
                    firstName: false,
                    lastName: false,
                    username: false,
                    phoneNumber: false,
                    fatherPhoneNumber: false,
                    age: false,
                    oldPassword: data.oldPassword === "",
                    newPassword: true,
                    confirmPassword: true
                })
            }
        }
    }

    function handleFile(e) {
        let data = new FormData();
        data.append("file", e.target.files[0])
        instance.put("/user/addPhoto", data).then(res => {
            instance.get("/user/myData").then(res => {
                if (res.data.success) {
                    setUser(res.data.data)
                }
            })
            toast.success(res.data.message)
        })

    }

    let width = window.innerWidth > 660


    return (
        <Box sx={{width: "100%"}}>


            <Box sx={{
                width: "100%",
                // height: "55vh",
                background: "white",
                marginTop: "100px",
                padding: "1rem",
                display: "grid",
                gap: "2rem",
                flexGrow: 1,
                boxShadow: "0 0 28px rgba(27, 27, 27, 0.15)"
            }}>

                <Stack direction="row" alignItems={"center"} spacing={2}>
                    <Avatar
                        alt="Remy Sharp"
                        src={user?.attachment === null ? userImg : "/api/img/" + user?.attachment?.id}
                        sx={{width: width ? 100 : 65, height: width ? 100 : 65, border: "3px solid"}}
                    />


                    <Stack sx={{height: "40px", transform: `scale(${width ? 1 : 0.7})`}} direction="row"
                           alignItems="center" spacing={2}>
                        <Button variant="contained" component="label">
                            Upload
                            <input
                                onChange={handleFile}
                                hidden accept="image/*" type="file"/>
                        </Button>
                    </Stack>

                </Stack>

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={6}
                    >
                        <TextField
                            error={errorText.firstName}
                            fullWidth
                            id="outlined-error-helper-text"
                            label="FirstName"
                            value={user?.firstName}
                            onChange={(e) => handleInput(e, "firstName")}
                            helperText={errorText.firstName ? "FirstName required" : ""}
                            InputLabelProps={{shrink: true}}
                        />

                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                        <TextField
                            error={errorText.lastName}
                            fullWidth
                            id="outlined-error-helper-text"
                            label="LastName"
                            value={user?.lastName}
                            onChange={(e) => handleInput(e, "lastName")}
                            InputLabelProps={{shrink: true}}
                            helperText={errorText.lastName ? "LastName required" : ""}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={6}>
                        <TextField
                            error={errorText.username}
                            fullWidth
                            id="outlined-error-helper-text"
                            label="Username"
                            value={user?.username}
                            disabled
                            onChange={(e) => handleInput(e, "username")}
                            InputLabelProps={{shrink: true}}
                            helperText={errorText.username ? "Username required" : ""}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                        <TextField
                            error={errorText.age}
                            fullWidth
                            id="outlined-error-helper-text"
                            label="Age"
                            value={user?.age}
                            type={"number"}
                            onChange={(e) => handleInput(e, "age")}
                            inputProps={{inputMode: 'numeric', pattern: '[0-9]*'}}
                            InputLabelProps={{shrink: true}}
                            helperText={errorText.age ? "Age required" : ""}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={6}>
                        <PhoneInput
                            country={"uz"}
                            containerClass={"phone_input_user"}
                            inputClass={"userPage_phone"}
                            placeholder={"+998 99 123 45 67"}
                            value={user?.phoneNumber}
                            onChange={(phone) => setPhone(phone)}
                            InputLabelProps={{shrink: true}}
                            inputStyle={{
                                height: "56px",
                                boxShadow: "none",
                                border: "none"
                            }}
                        />
                        <FormHelperText error id="my-helper-text">
                            {errorText.phoneNumber ? "Phone number required" : ""}</FormHelperText>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                        <PhoneInput
                            country={"uz"}
                            containerClass={"phone_input_parent"}
                            inputClass={"userPage_phone"}
                            placeholder={"+998 99 123 45 67"}
                            value={user?.fatherPhoneNumber}
                            disabled
                            onChange={(phone) => handleInput(phone, "fatherPhoneNumber")}
                            inputStyle={{
                                height: "56px",
                                boxShadow: "none",
                                border: "none"
                            }}
                        />
                        <FormHelperText error id="my-helper-text">
                            {errorText.fatherPhoneNumber ? "Father phone number required" : ""}</FormHelperText>
                    </Grid>
                </Grid>

                <Button
                    onClick={() => submit()}
                    variant="contained"
                    sx={{width: window.innerWidth > 600 ? "20%" : "40%"}}
                >save</Button>


            </Box>

            <Box sx={{
                width: "100%",
                background: "white",
                marginTop: "100px",
                padding: "1rem",
                display: "grid",
                gap: "2rem",
                flexGrow: 1,
                boxShadow: "0 0 28px rgba(27, 27, 27, 0.15)"
            }}>
                <form onSubmit={handleSubmit(forPassword)}>
                    <Grid container spacing={4}>
                        <Grid item xs={12} sm={3} md={3}>
                            <TextField
                                error={errorText.newPassword}
                                fullWidth
                                id="outlined-error-helper-text"
                                label="Old password"
                                name={"oldPassword"}
                                {...register("oldPassword")}
                                type="password"
                                helperText={errorText.oldPassword ? "Old password required" : ""}
                            />
                        </Grid>
                        <Grid item xs={12} sm={3} md={3}>
                            <TextField
                                error={errorText.newPassword}
                                fullWidth
                                id="outlined-error-helper-text"
                                label="New password"
                                type="password"
                                name={"newPassword"}
                                {...register("newPassword")}
                                helperText={errorText.newPassword ? "New password required" : ""}
                            />
                        </Grid>
                        <Grid item xs={12} sm={3} md={3}>
                            <TextField
                                error={errorText.confirmPassword}
                                fullWidth
                                id="outlined-error-helper-text"
                                label="Confirm password"
                                name={"confirmPassword"}
                                {...register("confirmPassword")}
                                type="password"
                                helperText={errorText.confirmPassword ? "Confirm password required" : ""}
                            />
                        </Grid>
                        <Grid item xs={12} sm={3} md={3}>
                            <Button
                                type={"submit"}
                                sx={{marginTop: "10px"}}
                                variant="contained"
                                startIcon={<SaveIcon/>}
                            >change</Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>

        </Box>
    );
}

export default Index;