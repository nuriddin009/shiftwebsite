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

function Index(props) {

    const [rooms, setRooms] = useState([])
    const [classTimes, setClassTimes] = useState([])
    const [datas, setDatas] = useState([])
    const [value, setValue] = React.useState("");
    const [times, setTimes] = React.useState([]);
    const [edit, setEdit] = React.useState(false);

    useEffect(() => {
        getRooms()
        getClassTimes()
        getDatas()
    }, [])

    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });


    function getClassTimes() {
        instance.get("/classTimeTable").then(res => {
            setClassTimes(res.data?.data)
            console.log(res.data?.data)
        })
    }


    function getRooms() {
        instance.get("/classTimeTable/rooms").then(res => {
            setRooms(res.data?.data)
            console.log(res.data?.data)
        })
    }

    function getDatas() {
        instance.get("/classTimeTable/timeTableData").then(res => {
            setDatas(res.data?.data)
            console.log(res.data?.data)
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

    const list = (anchor) => (
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


            <table>
                <thead>
                <tr>
                    <td rowSpan={2}><h3>Weekday</h3></td>
                    {
                        rooms.map(room => <td key={room?.id} colSpan={room?.timesCount}><h1>{room?.roomName}</h1></td>)
                    }

                </tr>


                <tr>
                    {
                        classTimes?.map(classTime => <td key={classTime.id}>
                            <h1>{classTime?.startTime}-</h1>
                            <h1>{classTime?.endTime}</h1>
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
                                <h1>{timeTableData?.groupName}</h1>
                                <h3>{timeTableData?.teacher}</h3>
                            </td>)
                        }
                    </tr>)
                }
                </tbody>
            </table>

            <br/><br/><br/><br/>

        </div>
    );
}

export default Index;