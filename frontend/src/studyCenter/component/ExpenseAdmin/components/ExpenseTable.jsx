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
import {FormHelperText} from "@mui/material";
import {

    Box,
    Button, Collapse,
    Dialog,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem, Pagination,
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
import InboxIcon from "@mui/icons-material/Inbox";


function Row(props) {
    const {row, index} = props;
    const [open, setOpen] = React.useState(false);

    return (
        <React.Fragment>
            <TableRow sx={{'& > *': {borderBottom: 'unset'}}}>

                <TableCell component="th" scope="row">
                    {index + 1}
                </TableCell>
                <TableCell>{new Date(row?.month).toLocaleString('en-us', {month: 'long', year: 'numeric'})}</TableCell>
                <TableCell>{row.amount + " so'm"}</TableCell>

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
                                <TableHead sx={{background: "black", color: "white"}}>
                                    <TableRow>
                                        <TableCell sx={{color: "white"}}>Sarlavha</TableCell>
                                        <TableCell sx={{color: "white"}}>Sana</TableCell>
                                        <TableCell sx={{color: "white"}}>Qiymati</TableCell>
                                        <TableCell sx={{color: "white"}}>To'lov turi</TableCell>
                                        <TableCell sx={{color: "white"}}>Kim qo'shdi?</TableCell>
                                    </TableRow>
                                </TableHead>
                                {
                                    row?.expenses?.length >= 1 ? <TableBody>
                                            {row?.expenses?.map((historyRow) => (
                                                <TableRow key={historyRow?.created}>
                                                    <TableCell>{historyRow?.title}</TableCell>
                                                    <TableCell component="th" scope="row">
                                                        {new Date(historyRow?.created).toLocaleString()}
                                                    </TableCell>
                                                    <TableCell>{historyRow.amount}</TableCell>
                                                    <TableCell>{historyRow?.payType}</TableCell>
                                                    <TableCell>{historyRow?.madeBy}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                        : <TableBody>
                                            <StyledTableRow>
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
                                                        <h6 style={{marginTop: "10px"}}>Bo'sh&nbsp;malumot</h6>
                                                    </div>
                                                </StyledTableCell>
                                                <StyledTableCell></StyledTableCell>
                                                <StyledTableCell></StyledTableCell>
                                                <StyledTableCell></StyledTableCell>
                                            </StyledTableRow>
                                        </TableBody>
                                }

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


const filter = createFilterOptions();


function ExpenseTable() {
    const [open, setOpen] = useState(false)
    const [value, setValue] = React.useState("");
    const [options, setOptions] = useState([])
    const [expenses, setExpenses] = useState([])
    const [description, setDescription] = React.useState("");
    const [amount, setAmount] = React.useState("");
    const [title, setTitle] = React.useState("");
    const [totalPages, setTotalPages] = React.useState(0);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [timeFilter, setTimeFilter] = React.useState(null);
    const [isAll, setIsAll] = React.useState(false);
    const [errorText, setErrorText] = useState({
        title: false,
        amount: false,
        value: false,
    })


    useEffect(() => {
        getPayTypes();
        getExpenses(currentPage, timeFilter)
    }, [])


    const cols = [
        {
            id: 'num',
            label: 'No',
            maxWidth: 20
        },
        {
            id: 'date',
            label: 'Sana',
        }, {
            id: 'amount',
            label: 'Miqdor',
        }, {
            id: "",
            label: 'Action',
            align: "right"
        }
    ]

    function toggleModal() {
        setOpen(!open)
    }

    function getExpenses(page, startDate) {
        instance.get("/expense", {params: {page, startDate}}).then(res => {
            setExpenses(res.data.data.content)
            setTotalPages(res.data?.data?.totalPages)
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


    function addNewExpense() {
        if (title && amount && value) {
            let data = {
                title,
                amount,
                payTypeId: value.value,
                description
            }
            toggleModal()
            instance.post("/expense", data).then(res => {
                setAmount("")
                setValue("")
                setTitle("")
                setDescription("")
                setErrorText({
                    ...errorText,
                    title: false,
                    value: false,
                    amount: false
                })
                getExpenses(currentPage, timeFilter)
            })
        } else {
            setErrorText({
                ...errorText,
                title: title === "",
                value: value === "",
                amount: amount === ""
            })
        }
    }

    function goToPage(event, page) {
        setCurrentPage(page)
        getExpenses(page, timeFilter)
    }

    function getAll() {
        setIsAll(true)
        setTimeFilter(null)
        getExpenses(1, null)
    }


    return (
        <div style={{marginTop: '30px'}}>
            <div style={{marginBottom: "20px"}} className={myStyles.between_}>
                <div>
                    <Button onClick={getAll} sx={{mx: 1}}
                            color={isAll ? "secondary" : "primary"}
                            variant={isAll ? "outlined" : "contained"}>{"Hammasi"}</Button>
                    <DatePicker
                        sx={{height: 60}}
                        views={['year', 'month']}
                        label="Yil va oy"
                        minDate={dayjs('2012-03-01')}
                        // maxDate={dayjs('2030-06-01')}
                        value={timeFilter}
                        disableFuture
                        onChange={(newValue) => {
                            let date = new Date(newValue)
                            let month = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)
                            setTimeFilter(date.getFullYear() + "-" + month + "-01")
                            getExpenses(currentPage, date.getFullYear() + "-" + month + "-01")
                        }}
                        renderInput={(params) => <TextField {...params} helperText={null}/>}
                    />
                </div>

                <Button
                    onClick={toggleModal}
                    sx={{mr: 4}}
                    variant={"contained"}
                >+ Yangi chiqim qo'shish</Button>

            </div>

            <Paper sx={{width: '100%', overflow: 'hidden'}}>
                <TableContainer component={Paper} sx={{borderRadius: 4, mb: 4}}>
                    <Table stickyHeader sx={{minWidth: 600, px: 3}} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                {cols?.map(col => <StyledTableCell align={col?.align ? col.align : "left"}
                                                                   col={col?.maxWidth}
                                                                   key={col.id}>{col.label}</StyledTableCell>)}
                                {expenses.length < 1 && (new Array(3).fill(0).map((item, index) =>
                                    <StyledTableCell key={index}></StyledTableCell>))}
                            </TableRow>
                        </TableHead>
                        {
                            expenses.length >= 1 ? <TableBody>
                                {expenses?.map((row, index) => (
                                    <Row key={row.id} row={row} index={index}/>
                                ))}
                            </TableBody> : <TableBody>
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
                                        <h6 style={{marginTop: "10px"}}>Bo'sh&nbsp;malumot</h6>
                                    </div>
                                </StyledTableCell>
                                <StyledTableCell></StyledTableCell>
                            </TableBody>
                        }

                    </Table>
                </TableContainer>
                {totalPages > 1 && (
                    <div style={{display: 'flex', justifyContent: 'center', marginTop: '10px'}}>
                        <Pagination
                            page={currentPage}
                            onChange={goToPage}
                            count={totalPages}
                            color="primary"
                            size="large"
                        />
                    </div>
                )}

            </Paper>

            {/*Modal*/}

            <Dialog open={open} onClose={toggleModal}>
                <div className={myStyles.modalSt} style={{padding: "1rem"}}>
                    <div className={myStyles.modalSt2}>
                        <div className={myStyles.flex_}>
                            <Grid sx={{width: "50%"}}>

                                <FormControl xs={6} sx={{m: 1, minWidth: 200, marginLeft: "-1px", width: "100%"}}>
                                    <Box sx={{minWidth: 220}}>
                                        <TextField sx={{m: 1, width: "95%"}}
                                                   id="outlined-basic"
                                                   label="Kirim sarlavhasi"
                                                   error={errorText.title}
                                                   helperText={errorText.title ? "Sarlavha majburiy" : ""}
                                                   value={title}
                                                   onChange={(e) => {
                                                       setTitle(e.target.value)
                                                   }}
                                                   variant="outlined"/>
                                    </Box>
                                </FormControl>

                            </Grid>
                            <Grid xs={6} sx={{width: "40%"}}>
                                <TextField style={{height: 30}}
                                           sx={{m: 1, height: 30, marginTop: "16.5px", width: "95%"}}
                                           id="outlined-basic"
                                           label="Miqdor"
                                           error={errorText.amount}
                                           helperText={errorText.amount ? "Miqdor majburiy" : ""}
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
                                                <TextField error={errorText.value} {...params} label="To'lov turi"/>
                                            )}
                                        />
                                    </Box>
                                </FormControl>
                                <FormHelperText sx={{marginLeft: "20px"}} error id="my-helper-text">
                                    {errorText.value ? "To'lov turi majburiy" : ""}
                                </FormHelperText>
                            </Grid>


                        </div>
                        <FormControl sx={{m: 1, minWidth: 200, width: "97.5%"}}>
                            <TextField
                                multiline
                                rows={3}
                                sx={{height: 40,  width: "100%"}}
                                id="outlined-multiline-static"
                                label="Qayd"
                                variant="outlined"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </FormControl>

                    </div>
                </div>
                <Stack
                    direction={"row"}
                    spacing={2}
                    sx={{
                        position: "absolute",
                        right: "20px",
                        bottom: "10px",

                    }}
                >
                    <Button
                        onClick={addNewExpense}
                        variant={"outlined"}
                        color={"success"}
                    >Qo'shish</Button>
                    <Button
                        onClick={toggleModal}
                        variant={"outlined"}
                        color={"error"}
                    >Bekor qilish</Button>
                </Stack>
            </Dialog>
        </div>
    )
}

export default ExpenseTable