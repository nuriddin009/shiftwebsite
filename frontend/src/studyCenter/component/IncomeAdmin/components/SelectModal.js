import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@mui/material'
import React from 'react'


function SelectAddModal({
    open,
    handleClose,
    handleSubmit,
    title,
    contentText,
    children
}) {

    // console.log(children[0].props.value)

  return (
    <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {contentText}
                </DialogContentText>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    {children}
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button 
                    variant="contained"
                    disabled={!children[0].props.value || !children[1].props.value} 
                    type="submit"
                >
                    Add
                </Button>
            </DialogActions>
        </form>
    </Dialog>
  )
}

export default SelectAddModal