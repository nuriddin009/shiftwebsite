import React, {useEffect, useState} from 'react';
import {Button, ButtonGroup, Card, Grid, Stack, styled, Typography} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import IncomeTable from "./components/IncomeTable";
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
    const {tab} = useParams()
    const [balance,setBalance]=useState(null)
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

    return (
        <div style={{width: "100%", padding: "70px 5px 0px 5px"}}>
            <Card sx elevation={0}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Typography sx={{textAlign: "center", fontSize: 30}}>Expense</Typography>
                        <Typography sx={{fontSize: 20}}>Balance: {balance?.income - balance?.expense}</Typography>
                        <Typography sx={{fontSize: 20}}>Income: {balance?.income}</Typography>
                        <IncomeTable/>
                    </Grid>

                </Grid>
            </Card>
        </div>
    );
}

export default Index;
