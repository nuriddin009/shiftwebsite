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
    Button, Collapse,
    Dialog,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    TextField, Typography
} from "@mui/material";
import myStyles from "./index.module.css"
import dayjs from "dayjs";
import {DatePicker} from "@mui/x-date-pickers";
import TableCell from "@mui/material/TableCell";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import PropTypes from "prop-types";
import Autocomplete, {createFilterOptions} from "@mui/material/Autocomplete";
import Stack from "@mui/material/Stack";
import instance from "../../../../shift/utils/instance";


function createData(num, date_year, amount) {
    return {
        num,
        date_year,
        amount,
        history: [
            {
                customerId: 'tok',
                date: '2020-01-05',
                amount: 300000,
            },
            {
                date: '2020-01-02',
                customerId: 'arenda',
                amount: 19000,
            },
        ],
    };
}

function Row(props) {
    const {row} = props;
    const [open, setOpen] = React.useState(false);

    return (
        <React.Fragment>
            <TableRow sx={{'& > *': {borderBottom: 'unset'}}}>

                <TableCell component="th" scope="row">
                    {row.num}
                </TableCell>
                <TableCell>{row.date_year}</TableCell>
                <TableCell>{row.amount}</TableCell>

                <TableCell align={'right'}>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                    </IconButton>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{margin: 1}}>
                            <Typography variant="h6" gutterBottom component="div">
                                History
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Title</TableCell>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Amount</TableCell>
                                        <TableCell>Pay Type</TableCell>
                                        <TableCell>Made by</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row.history.map((historyRow) => (
                                        <TableRow key={historyRow.date}>
                                            <TableCell>{historyRow.customerId}</TableCell>
                                            <TableCell component="th" scope="row">
                                                {historyRow.date}
                                            </TableCell>
                                            <TableCell>{historyRow.amount}</TableCell>
                                            <TableCell>
                                                Cash
                                            </TableCell>
                                            <TableCell>
                                                Bahodirov B
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

Row.propTypes = {
    row: PropTypes.shape({
        num: PropTypes.number.isRequired,
        date_year: PropTypes.string.isRequired,
        amount: PropTypes.number.isRequired,
        history: PropTypes.arrayOf(
            PropTypes.shape({
                amount: PropTypes.number.isRequired,
                customerId: PropTypes.string.isRequired,
                date: PropTypes.string.isRequired,
            }),
        ).isRequired,
    }).isRequired,
};

const rows = [
    createData(1, "Dekabr 2022", 400000),
    createData(2, "Oktyabr 2022", 500000),
    createData(3, "Noyabr 2022", 200000),

];

const filter = createFilterOptions();


function ExpenseTable() {
    const params = useParams()
    const [open, setOpen] = useState(false)
    const [age, setAge] = React.useState('');
    const [startDate, setStartDate] = useState(1659312000000);
    const [value, setValue] = React.useState("");
    const [positionTypes, setPositionTypes] = React.useState([]);
    const [currentUser, setCurrentUser] = React.useState(null);
    const [inputValue, setInputValue] = React.useState('');
    const [users, setUsers] = useState([])
    const [options, setOptions] = useState([])
    const [incomeValue, setIncomeValue] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [amount, setAmount] = React.useState("");
    const [payType, setPayType] = useState("")
    const [incomeType, setIncomeType] = useState("")
    const [today, setToday] = React.useState(false);

    const handleChange = (event) => {
        setAge(event.target.value);
    };
    useEffect(() => {
        getPayTypes();
    }, [])


    const cols = [
        {
            id: 'num',
            label: 'No',
            maxWidth: 20
        },
        {
            id: 'date',
            label: 'Date',
        }, {
            id: 'amount',
            label: 'Amount',
        }, {
            id: "",
            label: 'Action',
            align: "right"
        }
    ]

    function toggleModal() {
        setOpen(!open)
    }

    function getUsers(inputValue) {
        instance.get("/user/search?input=" + inputValue).then(({data}) => {
            let a = data.content.map(item => ({value: item.id, label: item.firstName + " " + item.lastName}))
            setUsers(a)
        })
    }

    function getPayTypes() {
        instance.get("/pay_type").then(({data}) => {
            let a = data.data.map(item => ({label: item?.type, value: item?.id,}));
            setOptions(a)
        })
    }



    function postPayType(label) {
        instance.post("/pay_type?type=" + label,).then(({data}) => {
            getPayTypes()
            setValue({label: data.data.type, value: data?.data?.id})
        })
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
                // getIncomes(payType, incomeType, today)
            })
        } else {

        }
    }



    return (
        <div style={{marginTop: '30px'}}>
            <div className={myStyles.between_}>
                <div>
                    <Button sx={{mx: 1}} variant={"contained"}>All</Button>
                    <DatePicker
                        sx={{height: 60}}
                        views={['year', 'month']}
                        label="Year and Month"
                        minDate={dayjs('2012-03-01')}
                        maxDate={dayjs('2023-06-01')}
                        value={value}
                        onChange={(newValue) => {
                            setValue(newValue);
                        }}
                        renderInput={(params) => <TextField {...params} helperText={null}/>}
                    />
                </div>

                <Button
                    onClick={toggleModal}
                    sx={{mr: 4}}
                    variant={"contained"}
                >+ Add New</Button>

            </div>
            <div className={myStyles.align_right}>
                <div className={myStyles.flex_}>
                    {/*<FormControl sx={{m: 1, minWidth: 250}}>*/}
                    {/*    <Box sx={{minWidth: 250}}>*/}
                    {/*        <InputLabel style={{background: "white"}} id="demo-simple-select-label">PayType</InputLabel>*/}
                    {/*        <Select*/}
                    {/*            sx={{minWidth: 200, height: 45}}*/}
                    {/*            labelId="demo-simple-select-label"*/}
                    {/*            id="demo-simple-select"*/}
                    {/*            value={age}*/}
                    {/*            label="Age"*/}
                    {/*            onChange={handleChange}*/}
                    {/*        >*/}
                    {/*            <MenuItem value="">*/}
                    {/*                <em>None</em>*/}
                    {/*            </MenuItem>*/}
                    {/*            <MenuItem value={10}>Ten</MenuItem>*/}
                    {/*            <MenuItem value={20}>Twenty</MenuItem>*/}
                    {/*            <MenuItem value={30}>Thirty</MenuItem>*/}
                    {/*        </Select>*/}
                    {/*    </Box>*/}
                    {/*</FormControl>*/}
                </div>
            </div>

            <Paper sx={{width: '100%', overflow: 'hidden'}}>
                <TableContainer component={Paper} sx={{borderRadius: 4, mb: 4}}>
                    <Table stickyHeader sx={{minWidth: 600, px: 3}} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                {cols?.map(col => <StyledTableCell align={col?.align ? col.align : "left"}
                                                                   col={col?.maxWidth}
                                                                   key={col.id}>{col.label}</StyledTableCell>)}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <Row key={row.num} row={row}/>
                            ))}
                        </TableBody>
                    </Table>
                    <Box sx={{minWidth: 600, px: 3}}>
                        <DataTablePagination
                            page={1}
                            pageLimit={6}
                            total={20}
                            baseTotal={2}
                            onChangePage={() => {
                            }}
                        />
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

            {/*Modal*/}

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
                                            inputValue={inputValue}
                                            onInputChange={(event, newInputValue) => {
                                                setInputValue(newInputValue);
                                                getUsers(newInputValue)
                                            }}
                                            id="controllable-states-demo"
                                            options={users}
                                            sx={{width: "100%"}}
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

                            <Grid sx={{width: "100%"}}>
                                <FormControl sx={{m: 1, minWidth: 200, width: "97.5%"}}>
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

export default ExpenseTable