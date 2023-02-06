import React, {useEffect, useState} from 'react';
import {Button, Card, Dialog, Divider, Grid, styled, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import ExpenseTable from "./components/ExpenseTable";
import instance from "../../../shift/utils/instance";


const MuiStyledButton = styled(Button, {
    shouldForwardProp: (prop) => prop !== 'isActive',
})
(({theme, isActive, color}) => ({
    background: color || '#f5f5f5',
    color: color ? '#fff' : '#606060',
    padding: '12px',
    '&:hover': {
        background: color || '#f5f5f5',
    },
    ...(isActive && {
        background: '#023247',
        color: '#ffffff',
        '&:hover': {
            background: color ? '#991111dd' : '#3498db',
        },
    }),
    '.MuiTypography-root': {
        fontWeight: '600',
        fontSize: '0.75rem',
    },
}));

const StyledButton = (props) => {
    return <MuiStyledButton sx={props.style} disabled={props.disabled} color={props.color} onClick={props.onClick}
                            fullWidth isActive={props.isActive}>
        <Typography noWrap>{props.children}</Typography>
    </MuiStyledButton>
};


function Index(props) {
    // const {tab}= useParams()
    const [balance,setBalance]=useState(null)
    const [open,isOpen]=useState(false)
    const navigate = useNavigate()


    useEffect(() => {
        getBalance()
    }, [])


    function getBalance() {
        instance.get(`/payment/balance`).then(({data}) => {
            setBalance(data.data)
            console.log(data.data)
        })
    }


        function getStatistics() {
            instance.get(`/income/statistics`).then(({data}) => {
                isOpen(data.data)
                console.log(data.data)
            })
        }


    return (
        <div style={{width: "100%", padding: "60px 5px 0px 5px"}}>
            <Card sx elevation={0}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Typography sx={{textAlign:"center", fontSize:30}}>Expense</Typography>
                        <div className={"d-flex justify-content-between pr-4 align-items-lg-start"}>
                            <div>
                                <Typography sx={{ fontSize:20}}>Balance: {(balance?.income-balance?.expense).toLocaleString()} (${balance?.incomeUsd})</Typography>
                                <Typography sx={{ fontSize:20}}>Expense: {balance?.expense?.toLocaleString()}  (${balance?.expenseUsd})</Typography>
                            </div>
                            <Button onClick={getStatistics} variant={"contained"} sx={{marginRight:5}}>Bugungi statistika</Button>
                        </div>

                        <ExpenseTable getBalance={getBalance}/>
                    </Grid>
                </Grid>
            </Card>
            <Dialog open={!!open}>
                <div  style={{width:"500px"}} className={"bg-white m-3"}>
                    <Typography>Balance: {open?.currentBalance?.reduce((a, b) => a + ((b.income||0)-(b.expense||0)), 0)?.toLocaleString()}</Typography>
                    {open?.currentBalance?.map(item=>
                        <Typography key={item.id}>{item?.type}: {((item.income||0)-(item.expense||0))?.toLocaleString()} (${((item.incomeUsd||0)-(item.expenseUsd||0))?.toLocaleString()})</Typography>)}
                    <Divider/>
                    <Typography className={"my-3"}>Kirim: {open.todayIncome?.toLocaleString()} {open.todayIncomeUsd?`$${open.todayIncomeUsd?.toLocaleString()}`:""}</Typography>
                    <Divider/>
                    <Typography>Chiqim: {open?.todayExpense?.filter(i=>!i.usd).reduce((a, b) => a + b.amount, 0)?.toLocaleString()} so'm (${open?.todayExpense?.filter(i=>i.usd).reduce((a, b) => a + b.amount, 0)?.toLocaleString()})</Typography>
                    {open?.todayExpense?.map(item=>
                        <Typography key={item.id}>{item?.title}: {item.usd?"$":""}{item.amount?.toLocaleString()} {item.payType}</Typography>)}
                    <Divider/>
                    <div className={"text-end"}>
                        <Button variant={"contained"} className={"mt-2"} onClick={()=>isOpen(false)}>Ok</Button>
                    </div>
                </div>
            </Dialog>
        </div>
    );
}

export default Index;
