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
import {Box, Button, Card, Dialog, FormControl, Grid, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import myStyles from "./index.module.css"
import dayjs from "dayjs";
import {DatePicker} from "@mui/x-date-pickers";
import FormAsyncSelectInput from "./FormAsyncSelectInput";
import Autocomplete, {createFilterOptions} from "@mui/material/Autocomplete";
import instance from "../../../../shift/utils/instance";

const filter = createFilterOptions();

function IncomeTable() {
    const params = useParams()
    const [open, setOpen] = useState(false)
    const [age, setAge] = React.useState('');
    const [startDate, setStartDate] = useState(1659312000000);
    const [value, setValue] = React.useState("");
    const [positionTypes, setPositionTypes] = React.useState([]);
    const [options, setOptions] = useState([    ])

    const handleChange = (event) => {
        setAge(event.target.value);
    };
    useEffect(() => {
        getPayTypes();
    }, [])

    function getPayTypes() {
        instance.get("/pay_type").then(({data}) => {
            console.log(data.data)
            let a = data.data.map(item => ({label: item?.type, value: item?.id,}));
            setOptions(a)
        })
    }

    function postPayType(label) {
        instance.post("/pay_type?type=" + label,).then(({data}) => {
            getPayTypes()
            setValue({label:data.data.type, value: data?.data?.id})
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
        // {
        //     id: "",
        //     label: 'Action',
        //     align:"center"
        // }
    ]


    return (
        <div style={{marginTop: '30px'}}>
            <div className={myStyles.between_}>
                <div>
                    <Button sx={{mx: 1}} variant={"contained"}>Today</Button>
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
                    <Button sx={{mx: 1}} variant={"contained"}>All</Button>
                </div>

                <Button sx={{mr: 4}} variant={"contained"}>+ Add New</Button>

            </div>
            <div className={myStyles.align_right}>
                <div className={myStyles.flex_}>
                    <FormControl sx={{m: 1, minWidth: 250}}>
                        <Box sx={{minWidth: 250}}>
                            <InputLabel style={{background: "white"}} id="demo-simple-select-label">PayType</InputLabel>
                            <Select
                                sx={{minWidth: 200, height: 45}}
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
                    <FormControl sx={{m: 1, minWidth: 200}}>
                        <Box sx={{minWidth: 220}}>
                            <InputLabel style={{background: "white"}}
                                        id="demo-simple-select-label">IncomeType</InputLabel>
                            <Select
                                sx={{minWidth: 200, height: 45}}
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
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <StyledTableRow key={1}>
                                <StyledTableCell component="th" scope="row">{"1"}</StyledTableCell>
                                <StyledTableCell component="th"
                                                 scope="row">{"Nematov Shohrux Yorqin o'g'li"}</StyledTableCell>
                                <StyledTableCell>{"+998931424356"}</StyledTableCell>
                                <StyledTableCell> 11-07-1996 09:00 </StyledTableCell>
                                <StyledTableCell> 500000 </StyledTableCell>
                                <StyledTableCell> 300000 </StyledTableCell>
                                <StyledTableCell> 800000</StyledTableCell>
                                {/*<StyledTableCell>*/}
                                {/*    <div style={{display: "flex"}}><Button>del</Button><Button>del</Button></div>*/}
                                {/*</StyledTableCell>*/}
                            </StyledTableRow>
                            <StyledTableRow key={2}>
                                <StyledTableCell component="th" scope="row">{"1"}</StyledTableCell>
                                <StyledTableCell component="th"
                                                 scope="row">{"Nematov Shohrux Yorqin o'g'li"}</StyledTableCell>
                                <StyledTableCell>{"+998931424356"}</StyledTableCell>
                                <StyledTableCell> 11-07-1996 </StyledTableCell>
                                <StyledTableCell> 500000 </StyledTableCell>
                                <StyledTableCell> 300000 </StyledTableCell>
                                <StyledTableCell> 800000</StyledTableCell>
                                {/*<StyledTableCell>*/}
                                {/*    <div style={{display: "flex"}}><Button>del</Button><Button>del</Button></div>*/}
                                {/*</StyledTableCell>*/}
                            </StyledTableRow>
                            <StyledTableRow key={3}>
                                <StyledTableCell component="th" scope="row">{"1"}</StyledTableCell>
                                <StyledTableCell component="th"
                                                 scope="row">{"Nematov Shohrux Yorqin o'g'li"}</StyledTableCell>
                                <StyledTableCell>{"+998931424356"}</StyledTableCell>
                                <StyledTableCell> 11-07-1996 </StyledTableCell>
                                <StyledTableCell> 500000 </StyledTableCell>
                                <StyledTableCell> 300000 </StyledTableCell>
                                <StyledTableCell> 800000</StyledTableCell>
                                {/*<StyledTableCell>*/}
                                {/*    <div style={{display: "flex"}}><Button>del</Button><Button>del</Button></div>*/}
                                {/*</StyledTableCell>*/}
                            </StyledTableRow>
                            <StyledTableRow key={4}>
                                <StyledTableCell component="th" scope="row">{"1"}</StyledTableCell>
                                <StyledTableCell component="th"
                                                 scope="row">{"Nematov Shohrux Yorqin o'g'li"}</StyledTableCell>
                                <StyledTableCell>{"+998931424356"}</StyledTableCell>
                                <StyledTableCell> 11-07-1996 </StyledTableCell>
                                <StyledTableCell> 500000 </StyledTableCell>
                                <StyledTableCell> 300000 </StyledTableCell>
                                <StyledTableCell> Student to'lovi</StyledTableCell>
                                {/*<StyledTableCell>*/}
                                {/*    <div style={{display: "flex"}}><Button>del</Button><Button>del</Button></div>*/}
                                {/*</StyledTableCell>*/}
                            </StyledTableRow>
                        </TableBody>
                    </Table>
                    <Box>
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
            <Dialog open={true}>
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
                                        {/*<InputLabel style={{background: "white"}}*/}
                                        {/*            id="demo-simple-select-label">IncomeType</InputLabel>*/}
                                        <Autocomplete
                                            sx={{minWidth: 200, width: "100%"}}
                                            value={value}
                                            onChange={(event, newValue) => {
                                                console.log(newValue)
                                                console.log(event)
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
                                                <TextField {...params} label="Income Type"/>
                                            )}
                                        />
                                        {/*    <MenuItem value="">*/}
                                        {/*        <em>None</em>*/}
                                        {/*    </MenuItem>*/}
                                        {/*    <MenuItem value={10}>Ten</MenuItem>*/}
                                        {/*    <MenuItem value={20}>Twenty</MenuItem>*/}
                                        {/*    <MenuItem value={30}>Thirty</MenuItem>*/}
                                        {/*</Autocomplete>*/}
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