import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { Slide } from '@mui/material';

function SlideTransition(props) {
    return <Slide {...props} direction="up" />;
}


const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function CustomizedSnackbars({ snackBar, setSnackBar }) {
    const [open, setOpen] = React.useState(false);
    const [transition, setTransition] = React.useState(undefined);
    // alert(message)
    // const { isOpen, message } = props;
    // setOpen(isOpen);
    const handleClick = (Transition) => () => {
        setTransition(() => Transition);
        setOpen(true)

    };
    const handleSnackBarClose = () => {
        setTransition(() => SlideTransition);
        setSnackBar({ ...snackBar, isOpen: false });
    }
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    return (
        <Stack spacing={2} sx={{ width: '100%' }}>
            {/* <Button variant="contained" onClick={handleClick(SlideTransition)}>
                Open success snackbar
            </Button> */}
            <Snackbar
                open={snackBar.isOpen}
                TransitionComponent={snackBar.Transition}
                key={snackBar.Transition}
                autoHideDuration={5000}
                onClose={handleSnackBarClose} >
                <Alert onClose={handleSnackBarClose} severity={snackBar.type} sx={{ width: '100%' }}>
                    {snackBar.message}
                </Alert>
            </Snackbar>
            {/* <Alert severity="error">This is an error message!</Alert>
            <Alert severity="warning">This is a warning message!</Alert>
            <Alert severity="info">This is an information message!</Alert>
            <Alert severity="success">This is a success message!</Alert> */}
        </Stack >
    );
}