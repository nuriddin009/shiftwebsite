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
                                            <TableCell >{historyRow.amount}</TableCell>
                                            <TableCell >
                                               Cash
                                            </TableCell>
                                            <TableCell >
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


function IncomeTable() {
    const params = useParams()
    const [open, setOpen] = useState(false)
    const [age, setAge] = React.useState('');
    const [startDate, setStartDate] = useState(1659312000000);
    const [value, setValue] = React.useState("");
    const [positionTypes, setPositionTypes] = React.useState([]);

    const handleChange = (event) => {
        setAge(event.target.value);
    };
    useEffect(() => {

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

                <Button sx={{mr: 4}} variant={"contained"}>+ Add New</Button>

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
                <TableContainer component={Paper} sx={{borderRadius: 4,mb:4}}>
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
            <Dialog open={false}>
                <div className={myStyles.modalSt} style={{padding: "1rem"}}>
                    <div className={myStyles.modalSt2}>
                        <div className={myStyles.flex_}>
                            <Grid sx={{width: "50%"}}>
                                <FormControl sx={{m: 1, minWidth: 200, width: "95%"}}>
                                    <Box sx={{minWidth: 220}}>
                                        <InputLabel style={{background: "white"}}
                                                    id="demo-simple-select-label">User</InputLabel>
                                        <Select
                                            sx={{minWidth: 200, width: "100%"}}
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={age}
                                            label="Age"
                                            onChange={handleChange}
                                        >
                                            <MenuItem value="">
                                                <em>None</em>
                                            </MenuItem>
                                            <MenuItem value={10}>Ten</MenuItem>
                                            <MenuItem value={20}>Twenty</MenuItem>
                                            <MenuItem value={30}>Thirty</MenuItem>
                                        </Select>
                                    </Box>
                                </FormControl>

                            </Grid>
                            <Grid xs={6} sx={{width: "40%"}}>
                                <TextField style={{height: 30}} sx={{m: 1, height: 30, width: "95%"}}
                                           id="outlined-basic"
                                           label="Amount"
                                           variant="outlined" type={'number'}/>
                            </Grid>

                        </div>
                        <div className={myStyles.flex_}>
                            <Grid sx={{width: "50%"}}>
                                <FormControl sx={{m: 1, minWidth: 200, width: "95%"}}>
                                    <Box sx={{minWidth: 220}}>
                                        <InputLabel style={{background: "white"}}
                                                    id="demo-simple-select-label">PayType</InputLabel>
                                        <Select
                                            sx={{minWidth: 200, width: "100%"}}
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={age}
                                            label="Age"
                                            onChange={handleChange}
                                        >
                                            <MenuItem value="">
                                                <em>None</em>
                                            </MenuItem>
                                            <MenuItem value={10}>Ten</MenuItem>
                                            <MenuItem value={20}>Twenty</MenuItem>
                                            <MenuItem value={30}>Thirty</MenuItem>
                                        </Select>
                                    </Box>
                                </FormControl>
                            </Grid>
                            <Grid sx={{width: "50%"}}>
                                <FormControl sx={{m: 1, minWidth: 200, width: "95%"}}>
                                    <Box sx={{minWidth: 220}}>
                                        <InputLabel style={{background: "white"}}
                                                    id="demo-simple-select-label">IncomeType</InputLabel>
                                        <Select
                                            sx={{minWidth: 200, width: "100%"}}
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={age}
                                            label="Age"
                                            onChange={handleChange}
                                        >
                                            <MenuItem value="">
                                                <em>None</em>
                                            </MenuItem>
                                            <MenuItem value={10}>Ten</MenuItem>
                                            <MenuItem value={20}>Twenty</MenuItem>
                                            <MenuItem value={30}>Thirty</MenuItem>
                                        </Select>
                                    </Box>
                                </FormControl>
                            </Grid>
                        </div>
                        <TextField
                            multiline
                            rows={4}
                            sx={{height: 40, m: 1, width: "98%"}}
                            id="outlined-multiline-static"
                            label="Description"
                            variant="outlined"
                        />
                    </div>
                </div>
            </Dialog>
        </div>
    )
}

export default IncomeTable