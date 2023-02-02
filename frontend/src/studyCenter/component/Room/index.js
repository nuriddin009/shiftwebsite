import React, {useEffect, useState} from 'react';
import "./index.scss";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import TextField from '@mui/material/TextField';
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import SaveIcon from '@mui/icons-material/Save';
import ReplySharpIcon from '@mui/icons-material/ReplySharp';
import DeleteIcon from '@mui/icons-material/Delete';
import instance from "../../../shift/utils/instance";
import CreateIcon from '@mui/icons-material/Create';
import Dialog from "@mui/material/Dialog";
import {useForm} from "react-hook-form";
import {FormControl} from "@mui/material";
import Autocomplete, {createFilterOptions} from "@mui/material/Autocomplete";
import {toast} from "react-toastify";

const filter = createFilterOptions();


function Index(props) {

    const [rooms, setRooms] = useState([])
    const [classTimes, setClassTimes] = useState([])
    const [datas, setDatas] = useState([])
    const [value, setValue] = React.useState("");
    const [times, setTimes] = React.useState([]);
    const [edit, setEdit] = React.useState(false);
    const [room, setRoom] = React.useState(null);
    const [classTime, setClassTime] = React.useState([]);
    const [mentor, setMentor] = React.useState("");
    const [mentors, setMentors] = React.useState([]);
    const [groups, setGroups] = useState([])
    const [group, setGroup] = useState("")


    const {register, handleSubmit, reset} = useForm()

    useEffect(() => {
        getRooms()
        getClassTimes()
        getDatas()
        getMentor()
        getGroups("")
    }, [])

    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });

    const [open, setOpen] = useState(false)
    const [timeTableData, setTimeTableData] = useState(null)


    function toggleDia() {
        setOpen(!open)
    }

    function getClassTimes() {
        instance.get("/classTimeTable").then(res => {
            setClassTimes(res.data?.data)
        })
    }


    function getRooms() {
        instance.get("/classTimeTable/rooms").then(res => {
            setRooms(res.data?.data)
        })
    }

    function getDatas() {
        instance.get("/classTimeTable/timeTableData").then(res => {
            setDatas(res.data?.data)
        })
    }


    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setState({...state, [anchor]: open});
    };

    function handleTime(e, type, index) {
        if (type === "startTime") {
            times[index].startTime = e.target.value
            setTimes([...times])
        } else {
            times[index].endTime = e.target.value
            setTimes([...times])
        }
    }


    function addRoom() {
        let data = {
            roomName: value,
            classTimeTables: times
        }
        instance.post("/classTimeTable/addRoom", data).then(res => {
            getDatas()
            getRooms()
            getClassTimes()
            setValue("")
            setTimes([])
            setState({right: false})
        })
    }

    function deleteTime(index) {
        times.splice(index, 1)
        setTimes([...times])
    }


    function changeRoomName(e, id) {
        setRoom({...room, roomName: e.target.value, id: id})
        instance.get("/classTimeTable/change/room/name",
            {params: {id, roomName: e.target.value}}).then(res => {
            getRooms()
        })
    }

    function deleteClassTime(id) {
        if (window.confirm("O'chirishni tasdiqlang")) {
            instance.delete("/classTimeTable/roomTime/" + id).then(res => {
                instance.get("/classTimeTable/roomTime/" + room?.id).then(res => {
                    setClassTime(res.data?.data)
                    getClassTimes()
                    getRooms()
                    getDatas()
                })
            })
        }
    }

    function addClassTime(id) {
        instance.get("/classTimeTable/add/roomTime/" + id).then(res => {
            instance.get("/classTimeTable/roomTime/" + room?.id).then(res => {
                setClassTime(res.data?.data)
                getRooms()
                getClassTimes()
                getDatas()
            })
        })
    }

    const list = (anchor) => (
        edit ? <Box
                sx={{width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 500, padding: "1rem"}}
                role="presentation">
                <Button
                    variant="outlined"
                    startIcon={<ReplySharpIcon/>}
                    color="error"
                    sx={{marginBottom: "10px"}}
                    onClick={() => {
                        setState({right: false})
                        setEdit(false)
                        setRoom(null)
                        setClassTime([])
                    }}
                >
                </Button>
                <TextField
                    sx={{width: "100%"}}
                    id="outlined-basic"
                    label="Room name"
                    variant="outlined"
                    value={room?.roomName}
                    onChange={(e) => changeRoomName(e, room?.id)}
                />
                <div style={{display: "flex", justifyContent: "space-between", marginTop: "10px"}}>
                    <h3>Start time</h3>
                    <h3>End time</h3>
                </div>

                {
                    classTime.map((item, index) => <div key={index} className={"m-2 d-flex gap-2"}>
                        <input
                            type="time"
                            className={"form-control"}
                            value={item.startTime}
                            onChange={(e) => changeTime(e, "start", item?.id)}
                        />
                        <input
                            type="time"
                            className={"form-control"}
                            value={item.endTime}
                            onChange={(e) => changeTime(e, "end", item?.id)}
                        />
                        <Button
                            onClick={() => deleteClassTime(item?.id)}
                            variant={"outlined"}
                            color={"error"}
                        ><DeleteIcon/></Button>
                    </div>)
                }

                <Stack direction={"row"} spacing={2}>
                    <Button
                        startIcon={<MoreTimeIcon/>}
                        variant={"contained"}
                        onClick={() => addClassTime(room?.id)}
                        sx={{width: "100%", marginTop: "5px"}}>Add Time</Button>
                    <Button
                        startIcon={<SaveIcon/>}
                        variant={"contained"}
                        color={"success"}
                        sx={{width: "100%", marginTop: "5px"}}
                        onClick={() => {
                            setEdit(false)
                            setRoom(null)
                            setClassTime([])
                            setState({...state, ["right"]: false});
                        }}
                    >
                        save
                    </Button>
                </Stack>

            </Box>
            :
            <Box
                sx={{width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 500, padding: "1rem"}}
                role="presentation"
            >
                <Button
                    variant="outlined"
                    startIcon={<ReplySharpIcon/>}
                    color="error"
                    sx={{marginBottom: "10px"}}
                    onClick={() => setState({right: false})}
                >
                </Button>
                <TextField
                    sx={{width: "100%"}}
                    id="outlined-basic"
                    label="Room name"
                    variant="outlined"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />

                <div style={{display: "flex", justifyContent: "space-between", marginTop: "10px"}}>
                    <h3>Start time</h3>
                    <h3>End time</h3>
                </div>
                {
                    times.map((item, index) => <div key={index} className={"mt-2 d-flex gap-2"}>
                            <input
                                type="time"
                                className={"form-control"}
                                value={item.startTime}
                                onChange={(e) => handleTime(e, "startTime", index)}
                            />
                            <input
                                type="time"
                                className={"form-control"}
                                value={item.endTime}
                                onChange={(e) => handleTime(e, "endTime", index)}
                            />
                            <Button
                                onClick={() => deleteTime(index)}
                                variant={"outlined"}
                                color={"error"}
                            ><DeleteIcon/></Button>
                        </div>
                    )
                }


                <br/>


                <Stack direction={"row"} spacing={2}>
                    <Button
                        startIcon={<MoreTimeIcon/>}
                        variant={"contained"}
                        onClick={() => {
                            times.push({
                                id: times.length + 1,
                                startTime: '',
                                endTime: ''
                            })
                            setTimes([...times])
                        }}
                        sx={{width: "100%", marginTop: "5px"}}>Add Time</Button>
                    <Button
                        startIcon={<SaveIcon/>}
                        variant={"contained"}
                        color={"success"}
                        sx={{width: "100%", marginTop: "5px"}}
                        onClick={() => addRoom()}
                    >
                        save
                    </Button>
                </Stack>


            </Box>
    );


    function weekDayToUzbek(weekDay) {
        switch (weekDay) {
            case "MONDAY":
                return "Dushanba";
            case "TUESDAY":
                return "Seshanba";
            case "WEDNESDAY":
                return "Chorshanba";
            case "THURSDAY":
                return "Payshanba";
            case "FRIDAY":
                return "Juma";
            case "SATURDAY":
                return "Shanba";
        }
    }


    function changeTime(e, typeTime, id) {

        instance.get("/classTimeTable/change/time",
            {params: {id, typeTime, timeValue: e.target.value}}).then(res => {
            instance.get("/classTimeTable/roomTime/" + room?.id).then(res => {
                setClassTime(res.data?.data)
            })
            getClassTimes()
            getDatas()
            getRooms()
            getClassTimes()
        })

    }


    function editTimeData(timeTableData) {
        setTimeTableData(timeTableData)
        let teacher = timeTableData?.table_mentor
        let groupData = timeTableData?.group
        setMentor({value: teacher?.id ? teacher?.id : "1", label: teacher?.teacher ? teacher?.teacher : " "})
        setGroup({value: groupData?.id ? groupData?.id : "2", label: groupData?.name ? groupData?.name : " "})
        toggleDia()
    }


    function submit() {
        if (mentor && group) {
            let data = {
                id: timeTableData?.id,
                mentorId: mentor?.value,
                groupId: group?.value
            }
            instance.put("/classTimeTable/change/timeData", data).then(res => {
                getDatas()
                toggleDia()
                setTimeTableData(null)
                setMentor("")
                setGroup("")
            })
        } else {
            toast.error("Please enter complete information")
        }

    }

    function editRoom(room) {
        setRoom(room)

        instance.get("/classTimeTable/roomTime/" + room?.id).then(res => {
            setClassTime(res.data?.data)
            setState({...state, ["right"]: true});
        })
    }


    function postMentor(mentorName) {
        instance.get("/mentor/post", {params: {mentorName}}).then(res => {
            let data = res.data.data
            setMentor({value: data?.id, label: data?.teacher})
            getMentor()
        })
    }

    function getMentor() {
        instance.get("/mentor").then(res => {
            let a = []
            let data = res.data.data
            data?.map(item => a.push({value: item?.id, label: item?.teacher}));
            setMentors(a)
        })
    }


    function getGroups(search) {
        instance.get("/group", {params: {search}}).then(res => {
            let data = res.data
            let a = []
            data.map(item => a.push({value: item?.id, label: item?.name}))
            setGroups(a)
        })
    }


    return (
        <div className={"room"}>
            <h1>Rooms Control</h1>


            <Stack direction="row" spacing={2} position={"fixed"} right={40} top={10}>
                <React.Fragment>
                    <div style={{zIndex: 111, display: "flex", gap: "1rem"}}>
                        <Button variant="contained"
                                color={"success"}
                                onClick={toggleDrawer("right", true)}
                        >Add&nbsp;Room</Button>
                        <Button
                            variant={edit ? "outlined" : "contained"}
                            color="primary"
                            onClick={() => setEdit(!edit)}
                        >Edit</Button>
                    </div>

                    <Drawer
                        anchor={"right"}
                        open={state["right"]}
                        onClose={toggleDrawer("right", false)}
                    >
                        {list("right")}
                    </Drawer>


                </React.Fragment>

            </Stack>


            <table className={edit ? "editTable" : ""}>
                <thead>
                <tr>
                    <td rowSpan={2}><h3>Weekday</h3></td>
                    {
                        rooms.map(room => <td key={room?.id} colSpan={room?.timesCount}>

                            {
                                edit ? <div style={{
                                        width: "100%", display: "flex",
                                        padding: "1rem", alignItems: "center", gap: "0.5rem"
                                    }}>
                                        <input
                                            type="text"
                                            value={room?.roomName}
                                            className={"form-control"}
                                            onChange={(e) => changeRoomName(e, room?.id)}
                                            style={{height: "50px", width: "100%", fontSize: "40px"}}
                                        />
                                        <CreateIcon style={{transform: "scale(2)"}} onClick={() => editRoom(room)}/>
                                    </div>
                                    : <h1>{room?.roomName}</h1>
                            }
                        </td>)
                    }

                </tr>


                <tr>
                    {
                        classTimes?.map(classTime => <td key={classTime.id}>
                            {
                                edit ?
                                    <input
                                        type="time"
                                        value={classTime?.startTime}
                                        onChange={(e) => changeTime(e, 'start', classTime.id)}
                                        style={{minWidth: "200px", height: "70px", fontSize: "40px"}}
                                    /> :
                                    <h1>{classTime?.startTime}-</h1>
                            }
                            {
                                edit ?
                                    <input
                                        type="time"
                                        value={classTime?.endTime}
                                        onChange={(e) => changeTime(e, 'end', classTime.id)}
                                        style={{minWidth: "200px", height: "70px", fontSize: "40px"}}
                                    /> :
                                    <h1>{classTime?.endTime}</h1>
                            }

                        </td>)
                    }
                </tr>


                </thead>
                <tbody>
                {
                    datas?.map(data => <tr key={data?.weekOrder}>
                        <td><h1>{weekDayToUzbek(data?.weekDay)}</h1></td>
                        {
                            data?.timeTableDatas?.map(timeTableData => <td key={timeTableData?.id}>
                                {edit && <CreateIcon onClick={() => editTimeData(timeTableData?.custom)}/>}
                                <h3>{timeTableData?.custom?.group?.name}</h3>
                                <h6>{timeTableData?.custom?.table_mentor?.teacher}</h6></td>)
                        }
                    </tr>)
                }
                </tbody>
            </table>


            <Dialog open={open} onClose={toggleDia}>
                <div style={{
                    width: 500, height: 220,
                    padding: "1rem"
                }}>
                    <FormControl sx={{m: 1, minWidth: 200, width: "100%"}}>
                        <Box sx={{minWidth: 220}}>
                            <Autocomplete
                                sx={{minWidth: 200, width: "100%"}}
                                value={group}
                                onChange={(event, newValue) => {
                                    setGroup(newValue);
                                }}
                                filterOptions={(options, params) => {
                                    const filtered = filter(options, params);

                                    const {inputValue} = params;
                                    // Suggest the creation of a new value
                                    const isExisting = options.some((option) => inputValue === option.label);
                                    if (inputValue !== '' && !isExisting) {
                                        filtered.push({
                                            inputValue,
                                        });
                                    }

                                    return filtered;
                                }}
                                selectOnFocus
                                clearOnBlur
                                handleHomeEndKeys
                                options={groups}
                                getOptionLabel={(option) => {
                                    // Value selected with enter, right from the input
                                    if (typeof option === 'string') {
                                        return option;
                                    }
                                    // Add "xxx" option created dynamically
                                    if (option.inputValue) {
                                        return option.inputValue;
                                    }
                                    // Regular option
                                    return option.label;
                                }}
                                renderOption={(props, option) => <li {...props}>{option.label}</li>}
                                freeSolo
                                renderInput={(params) => (
                                    <TextField  {...params} label="Group"/>
                                )}
                            />
                        </Box>
                    </FormControl>


                    <FormControl sx={{m: 1, minWidth: 200, width: "100%"}}>
                        <Box sx={{minWidth: 220}}>
                            <Autocomplete
                                sx={{minWidth: 200, width: "100%"}}
                                value={mentor}
                                onChange={(event, newValue) => {
                                    if (typeof newValue === 'string') {
                                        postMentor(newValue)
                                    } else if (newValue?.label.startsWith('Add')) {
                                        postMentor(newValue?.inputValue)
                                    } else {
                                        setMentor(newValue);
                                    }
                                }}
                                filterOptions={(options, params) => {
                                    const filtered = filter(options, params);

                                    const {inputValue} = params;
                                    // Suggest the creation of a new value
                                    const isExisting = options.some((option) => inputValue === option.label);
                                    if (inputValue !== '' && !isExisting) {
                                        filtered.push({
                                            inputValue,
                                            label: `Add "${inputValue}"`,
                                        });
                                    }

                                    return filtered;
                                }}
                                selectOnFocus
                                clearOnBlur
                                handleHomeEndKeys
                                options={mentors}
                                getOptionLabel={(option) => {
                                    // Value selected with enter, right from the input
                                    if (typeof option === 'string') {
                                        return option;
                                    }
                                    // Add "xxx" option created dynamically
                                    if (option.inputValue) {
                                        return option.inputValue;
                                    }
                                    // Regular option
                                    return option.label;
                                }}
                                renderOption={(props, option) => <li {...props}>{option.label}</li>}
                                freeSolo
                                renderInput={(params) => (
                                    <TextField  {...params} label="Mentor"/>
                                )}
                            />
                        </Box>
                    </FormControl>

                    <div style={{
                        display: "flex",
                        width: "100%",
                        gap: "1rem",
                        justifyContent: "flex-end"
                    }}>
                        <Button onClick={submit} variant={"contained"}>save</Button>
                        <Button
                            type={"button"}
                            color={"error"}
                            variant={"contained"}
                            onClick={toggleDia}
                        >cancel</Button>
                    </div>
                </div>
            </Dialog>

            <br/><br/><br/><br/>

        </div>
    );
}

export default Index;