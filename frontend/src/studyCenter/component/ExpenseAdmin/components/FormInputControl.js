import React from 'react';
import {Grid} from '@mui/material';
import FormInputLabel from './FormInputLabel';


const FormInputControl = (props) => {
  return (
    <Grid container spacing={1} sx={{ margin: '0 0 0 0px' }}>
      <Grid item xs={12} sm={props.labelSize ?? 3} sx={{alignItems: props?.labelPosition ?? 'center', display: 'flex'}}>
        <FormInputLabel text={props.label} />
      </Grid>
      <Grid item xs={12} sm={true} md={7} lg={6}>
        {props.children}
      </Grid>
    </Grid>
  );
};

export default FormInputControl;
