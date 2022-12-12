import React from 'react';
import {Button, Card, Grid, styled, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import ExpenseTable from "./components/ExpenseTable";


const MuiStyledButton = styled(Button, {
    shouldForwardProp: (prop) => prop !== 'isActive',
})
(({ theme, isActive, color }) => ({
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
    return <MuiStyledButton sx={props.style} disabled={props.disabled} color={props.color} onClick={props.onClick} fullWidth isActive={props.isActive}>
        <Typography noWrap>{props.children}</Typography>
    </MuiStyledButton>
};


function Index(props) {
   // const {tab}= useParams()
    const navigate= useNavigate()



    return (
        <div style={{width:"100%",padding:"60px 5px 0px 5px"}}>
        <Card sx elevation={0}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography>Expense</Typography>
                    <ExpenseTable/>
                </Grid>
            </Grid>
        </Card>
        </div>
    );
}

export default Index;
