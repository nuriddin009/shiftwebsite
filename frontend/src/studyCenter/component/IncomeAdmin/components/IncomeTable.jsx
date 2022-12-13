import * as React from 'react'
import {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom';
import {StyledTableCell, StyledTableRow} from '../../common/TableJobReq';
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import DataTablePagination from "./DataTablePagination";
import {
    Box,
    Button,
    Card,
    Dialog,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography
} from "@mui/material";
import myStyles from "./index.module.css"
import dayjs from "dayjs";
import {DatePicker} from "@mui/x-date-pickers";
import FormAsyncSelectInput from "./FormAsyncSelectInput";
import Autocomplete, {createFilterOptions} from "@mui/material/Autocomplete";
import instance from "../../../../shift/utils/instance";
import Stack from "@mui/material/Stack";
import InboxIcon from '@mui/icons-material/Inbox';
import Pagination from "@mui/material/Pagination";

const filter = createFilterOptions();

const options1 = ['Option 1', 'Option 2'];

function IncomeTable() {
    const params = useParams()
    const [open, setOpen] = useState(false)
    const [age, setAge] = React.useState('');
    const [startDate, setStartDate] = useState(1659312000000);
    const [value, setValue] = React.useState("");
    const [currentUser, setCurrentUser] = React.useState(null);
    const [incomes, setIncomes] = React.useState([]);
    const [options, setOptions] = useState([])
    const [users, setUsers] = useState([])
    const [payType, setPayType] = useState("")
    const [incomeType, setIncomeType] = useState("")

    const [description, setDescription] = React.useState("");
    const [amount, setAmount] = React.useState("");

    const [inputValue, setInputValue] = React.useState('');
    const [incomeOptions, setIncomeOptions] = React.useState([]);
    const [incomeValue, setIncomeValue] = React.useState("");
    const [isAll, setIsAll] = React.useState(false);
    const [today, setToday] = React.useState(true);
    const [totalPages, setTotalPages] = React.useState(0);
    // const [totalElements, setTotalElements] = React.useState(0);
    const [currentPage, setCurrentPage] = React.useState(1);

    const [timeFilter, setTimeFilter] = React.useState(null);


    const handleChange = (event) => {
        setPayType(event.target.value);
        getIncomes(event.target.value, incomeType, today, currentPage, timeFilter)
    };


    const handleIncomeTypeChange = (event) => {
        setIncomeType(event.target.value)
        getIncomes(payType, event.target.value, today, currentPage, timeFilter)
    }

    useEffect(() => {
        getPayTypes();
        getIncomes(payType, incomeType, today, currentPage, timeFilter);
        getIncomeTypes();
    }, [])

    function getAll() {
        setIsAll(true)
        setIncomeType("")
        setPayType("")
        setToday(false)
        setTimeFilter(null)
        getIncomes("", "", false, 1, "")
    }


    function getIncomes(payType, incomeType, today, page, time) {
        instance.get("/income", {
            params:
                {incomeType, payType, today, page, time}
        }).then(res => {
            setTotalPages(res.data?.data?.totalPages)
            setIncomes(res.data.data.content)
        })
    }

    function getPayTypes() {
        instance.get("/pay_type").then(({data}) => {
            let a = data.data.map(item => ({label: item?.type, value: item?.id,}));
            setOptions(a)
        })
    }


    function getUsers(inputValue) {
        instance.get("/user/search?input=" + inputValue).then(({data}) => {
            let a = data.content.map(item => ({value: item.id, label: item.firstName + " " + item.lastName}))
            setUsers(a)
        })
    }

    function postPayType(label) {
        instance.post("/pay_type?type=" + label,).then(({data}) => {
            getPayTypes()
            setValue({label: data.data.type, value: data?.data?.id})
        })
    }

    function postIncomeType(label) {
        instance.post("/income_type?type=" + label).then(({data}) => {
            getIncomeTypes()
            setValue({label: data.data.type, value: data?.data?.id})
        })
    }

    function getIncomeTypes() {
        instance.get("/income_type").then(({data}) => {
            let a = data.data.map(item => ({label: item?.type, value: item?.id}));
            setIncomeOptions(a)
        })
    }


    const cols = [
        {
            id: 'num',
            label: 'No',
            maxWidth: 20
        }, {
            id: 'name',
            label: 'FullName',
        },
        {
            id: 'phone',
            label: 'Phone',
        },
        {
            id: 'date',
            label: 'Date',
        },
        {
            id: 'pay_type',
            label: 'Pay Type',
        },
        {
            id: 'amount',
            label: 'Amount',
        },
        {
            id: 'income_type',
            label: 'Income Type',
        },
    ]


    function toggleModal() {
        setOpen(!open)
    }


    function addNewIncome() {
        if (currentUser && amount && incomeValue && value) {
            let data = {
                amount,
                payTypeId: value.value,
                incomeTypeId: incomeValue.value,
                userId: currentUser.value,
                description
            }
            toggleModal()
            instance.post("/income", data).then(res => {
                setCurrentUser(null)
                setAmount("")
                setValue("")
                setIncomeValue("")
                setDescription("")
                getIncomes(payType, incomeType, today, currentPage, timeFilter)
            })
        } else {

        }
    }

    function goToPage(event, page) {
        setCurrentPage(page)
        getIncomes(payType, incomeType, today, page, timeFilter)
    }


    return (
        <div style={{marginTop: '30px'}}>


            <div className={myStyles.between_}>
                <div style={{display: "flex", alignItems: "center"}}>
                    <Button onClick={() => {
                        getIncomes(payType, incomeType, true, 1, timeFilter)
                        setToday(true)
                        setIsAll(false)
                        setTimeFilter(null)
                    }} sx={{mx: 1}}
                            color={today ? "secondary" : "primary"}
                            variant={today ? "outlined" : "contained"}>Today</Button>
                    <DatePicker
                        sx={{height: 60}}
                        views={['year', 'month']}
                        label="Year and Month"
                        minDate={dayjs('2012-03-01')}
                        // maxDate={dayjs('2030-06-01')}
                        value={timeFilter}
                        disableFuture
                        onChange={(newValue) => {
                            let date = new Date(newValue)
                            let month = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)
                            setTimeFilter(date.getFullYear() + "-" + month + "-01")
                            setToday(false);
                            getIncomes(payType, incomeType, false, currentPage, date.getFullYear() + "-" + month + "-01")
                        }}
                        renderInput={(params) => <TextField {...params} helperText={null}/>}
                    />
                    <Button onClick={getAll} sx={{mx: 1}}
                            color={isAll ? "secondary" : "primary"}
                            variant={isAll ? "outlined" : "contained"}>{"All"}</Button>
                </div>

                <Button
                    onClick={toggleModal}
                    sx={{mr: 4}}
                    variant={"contained"}
                >+ Add New</Button>

            </div>

            {/*// filters*/}
            <div className={myStyles.align_right}>

                <div className={myStyles.flex_}>
                    {/*// payType filer*/}
                    <FormControl sx={{m: 1, minWidth: 250}}>
                        <Box sx={{minWidth: 250}}>
                            <InputLabel style={{background: "white"}} id="demo-simple-select-label">PayType</InputLabel>
                            <Select
                                sx={{minWidth: 200, height: 45}}
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={payType}
                                label="Age"
                                onChange={handleChange}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {
                                    options?.map((item, index) => <MenuItem key={index}
                                                                            value={item.label}>{item.label}</MenuItem>)
                                }
                            </Select>
                        </Box>
                    </FormControl>

                    {/*// income filter*/}
                    <FormControl sx={{m: 1, minWidth: 200}}>
                        <Box sx={{minWidth: 220}}>
                            <InputLabel style={{background: "white"}}
                                        id="demo-simple-select-label">IncomeType</InputLabel>
                            <Select
                                sx={{minWidth: 200, height: 45}}
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={incomeType}
                                label="IncomeType"
                                onChange={handleIncomeTypeChange}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {
                                    incomeOptions?.map((item, index) => <MenuItem key={index}
                                                                                  value={item.label}>{item.label}</MenuItem>)
                                }
                            </Select>
                        </Box>
                    </FormControl>

                </div>
            </div>

            <Paper sx={{width: '100%', overflow: 'hidden'}}>
                <TableContainer component={Paper} sx={{borderRadius: 4}}>
                    <Table stickyHeader sx={{minWidth: 700}} aria-label="customized table">
                        <TableHead>
                            <TableRow>

                                {cols?.map(col => <StyledTableCell align={col?.align ? col.align : "left"}
                                                                   col={col?.maxWidth}
                                                                   key={col.id}>{col.label}</StyledTableCell>)}
                                {
                                    incomes.length < 1 ? new Array(2).fill(0).map((item) =>
                                        <StyledTableCell></StyledTableCell>) : ""
                                }
                            </TableRow>
                        </TableHead>
                        {
                            incomes.length >= 1 ? <TableBody>
                                    {
                                        incomes?.map((income, index) => <StyledTableRow key={index}>
                                            <StyledTableCell component="th" scope="row">{index + 1}</StyledTableCell>
                                            <StyledTableCell component="th"
                                                             scope="row">{income?.user?.firstName + " " + income?.user?.lastName}</StyledTableCell>
                                            <StyledTableCell>{income?.user?.phoneNumber}</StyledTableCell>
                                            <StyledTableCell>{new Date(income?.created).toLocaleString()}</StyledTableCell>
                                            <StyledTableCell>{income?.payType?.type}</StyledTableCell>
                                            <StyledTableCell>{income?.amount}</StyledTableCell>
                                            <StyledTableCell>{income?.incomeType?.type}</StyledTableCell>
                                        </StyledTableRow>)
                                    }

                                </TableBody> :
                                <TableBody>
                                    <TableRow>
                                        <StyledTableCell></StyledTableCell>
                                        <StyledTableCell></StyledTableCell>
                                        <StyledTableCell></StyledTableCell>
                                        <StyledTableCell></StyledTableCell>
                                        <StyledTableCell>
                                            <div style={{
                                                width: "150px",
                                                height: "150px",
                                                padding: "1rem",
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: "0.5rem",
                                                justifyContent: "center",
                                                alignItems: "center"
                                            }}>
                                                <InboxIcon sx={{transform: "scale(3)", color: "#023247"}}
                                                           viewBox={"Empty"}/>
                                                <h6 style={{marginTop: "10px"}}>Empty data</h6>
                                            </div>
                                        </StyledTableCell>
                                        <StyledTableCell></StyledTableCell>
                                        <StyledTableCell></StyledTableCell>
                                        <StyledTableCell></StyledTableCell>
                                    </TableRow>

                                </TableBody>

                        }

                    </Table>
                    <Box>
                        {
                            // totalPages > 1 ?
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
                                        page={currentPage}
                                        onChange={goToPage}
                                    />
                                </Stack>
                            </Box>
                            // : ""
                        }
                    </Box>
                </TableContainer>
                {/*{paging?.totalPages>1 && (*/}
                {/*    <div style={{display: 'flex', justifyContent: 'center', marginTop: '10px'}}>*/}
                {/*        <Pagination*/}
                {/*            page={paging?.pageable?.pageNumber+1 ?? 1}*/}
                {/*            onChange={handleChange}*/}
                {/*            count={paging?.totalPages}*/}
                {/*            color="primary"*/}
                {/*        />*/}
                {/*    </div>*/}
                {/*)}*/}

            </Paper>


            <Dialog open={open} onClose={toggleModal}>
                <div className={myStyles.modalSt} style={{padding: "1rem"}}>
                    <div className={myStyles.modalSt2}>
                        <div className={myStyles.flex_}>
                            <Grid sx={{width: "50%"}}>

                                <FormControl sx={{m: 1, minWidth: 200, width: "95%"}}>
                                    <Box sx={{minWidth: 220}}>
                                        <Autocomplete
                                            value={currentUser}
                                            onChange={(event, newValue) => {
                                                setCurrentUser(newValue);
                                            }}
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
                                            defaultValue={users[0]}
                                            inputValue={inputValue}
                                            selectOnFocus
                                            handleHomeEndKeys

                                            onInputChange={(event, newInputValue) => {
                                                setInputValue(newInputValue);
                                                getUsers(newInputValue)
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
                                            // id="controllable-states-demo"
                                            options={users}
                                            sx={{width: "100%"}}
                                            renderOption={(props, option) => <li {...props}>{option.label}</li>}
                                            renderInput={(params) => <TextField {...params} label="Users"/>}
                                        />
                                    </Box>
                                </FormControl>

                            </Grid>
                            <Grid xs={6} sx={{width: "40%"}}>
                                <TextField style={{height: 30}} sx={{m: 1, height: 30, width: "95%"}}
                                           id="outlined-basic"
                                           label="Amount"
                                           value={amount}
                                           onChange={(e) => setAmount(e.target.value)}
                                           variant="outlined" type={'number'}/>
                            </Grid>

                        </div>
                        <div className={myStyles.flex_}>

                            <Grid sx={{width: "50%"}}>
                                <FormControl sx={{m: 1, minWidth: 200, width: "95%"}}>
                                    <Box sx={{minWidth: 220}}>
                                        <Autocomplete
                                            sx={{minWidth: 200, width: "100%"}}
                                            value={value}
                                            onChange={(event, newValue) => {
                                                if (typeof newValue === 'string') {
                                                    postPayType(newValue)
                                                } else if (newValue?.label.startsWith('Add')) {
                                                    postPayType(newValue?.inputValue)
                                                } else {
                                                    setValue(newValue);
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
                                            options={options}
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
                                                <TextField {...params} label="Pay Type"/>
                                            )}
                                        />
                                    </Box>
                                </FormControl>
                            </Grid>

                            <Grid sx={{width: "50%"}}>
                                <FormControl sx={{m: 1, minWidth: 200, width: "95%"}}>
                                    <Box sx={{minWidth: 220}}>
                                        <Autocomplete
                                            sx={{minWidth: 200, width: "100%"}}
                                            value={incomeValue}
                                            onChange={(event, newValue) => {
                                                if (typeof newValue === 'string') {
                                                    postIncomeType(newValue)
                                                } else if (newValue?.label.startsWith('Add')) {
                                                    postIncomeType(newValue?.inputValue)
                                                } else {
                                                    setIncomeValue(newValue);
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
                                            options={incomeOptions}
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
                                                <TextField {...params} label="Income Type"/>
                                            )}
                                        />
                                    </Box>
                                </FormControl>
                            </Grid>


                        </div>
                        <TextField
                            multiline
                            rows={4}
                            sx={{height: 40, m: 1, width: "97.5%"}}
                            id="outlined-multiline-static"
                            label="Description"
                            variant="outlined"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                </div>
                <Stack
                    direction={"row"}
                    spacing={2}
                    sx={{
                        position: "absolute",
                        right: "20px",
                        bottom: "20px"
                    }}
                >
                    <Button
                        onClick={addNewIncome}
                        variant={"outlined"}
                        color={"success"}
                    >save</Button>
                    <Button
                        onClick={toggleModal}
                        variant={"outlined"}
                        color={"error"}
                    >cancel</Button>
                </Stack>
            </Dialog>
        </div>
    )
}

export default IncomeTable