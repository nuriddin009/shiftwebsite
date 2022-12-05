import {Button, Pagination, Slider, Switch} from '@mui/material';
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

function IncomeTable() {

    const params = useParams()


    const [open, setOpen] = useState(false)

    useEffect(() => {

    }, [])


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
            id: 'card',
            label: 'Card/Click',
        },
        {
            id: 'cash',
            label: 'Cash',
        },
        {
            id: 'total',
            label: 'Total',
        },
        {
            id: "",
            label: 'Action',
            align:"center"
        }
    ]


    return (
        <div style={{marginTop: '30px'}}>
            <Paper sx={{width: '100%', overflow: 'hidden'}}>
                <TableContainer component={Paper} sx={{borderRadius: 4}}>
                    <Table stickyHeader sx={{minWidth: 700}} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                {cols?.map(col => <StyledTableCell align={col?.align ? col.align : "left"} col={col?.maxWidth}
                                                                   key={col.id}>{col.label}</StyledTableCell>)}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <StyledTableRow key={1}>
                                <StyledTableCell component="th" scope="row">{"1"}</StyledTableCell>
                                <StyledTableCell component="th"
                                                 scope="row">{"Nematov Shohrux Yorqin o'g'li"}</StyledTableCell>
                                <StyledTableCell>{"+998931424356"}</StyledTableCell>
                                <StyledTableCell> 11-07-1996 </StyledTableCell>
                                <StyledTableCell> 500000 </StyledTableCell>
                                <StyledTableCell> 300000 </StyledTableCell>
                                <StyledTableCell> 800000</StyledTableCell>
                                <StyledTableCell>
                                    <div style={{display: "flex"}}><Button>del</Button><Button>del</Button></div>
                                </StyledTableCell>
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
                                <StyledTableCell>
                                    <div style={{display: "flex"}}><Button>del</Button><Button>del</Button></div>
                                </StyledTableCell>
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
                                <StyledTableCell>
                                    <div style={{display: "flex"}}><Button>del</Button><Button>del</Button></div>
                                </StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow key={4}>
                                <StyledTableCell component="th" scope="row">{"1"}</StyledTableCell>
                                <StyledTableCell component="th"
                                                 scope="row">{"Nematov Shohrux Yorqin o'g'li"}</StyledTableCell>
                                <StyledTableCell>{"+998931424356"}</StyledTableCell>
                                <StyledTableCell> 11-07-1996 </StyledTableCell>
                                <StyledTableCell> 500000 </StyledTableCell>
                                <StyledTableCell> 300000 </StyledTableCell>
                                <StyledTableCell> 800000</StyledTableCell>
                                <StyledTableCell>
                                    <div style={{display: "flex"}}><Button>del</Button><Button>del</Button></div>
                                </StyledTableCell>
                            </StyledTableRow>
                        </TableBody>
                    </Table>
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

        </div>
    )
}

export default IncomeTable