import { Typography } from '@mui/material';



const FormInputLabel = (props) => {
  return (
    <Typography
      // noWrap
      variant='h6'
      sx={{
        fontSize: '16px',
        lineHeight: 1.2,
        paddingRight: '6px',
        paddingBlock: '6px'
      }}
    >
      {props.text}
    </Typography>
  );
};

export default FormInputLabel;
