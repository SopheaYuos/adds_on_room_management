import React from 'react'
import { makeStyles } from '@material-ui/core';
import { Button } from '@mui/material';


const useStyles = makeStyles(theme => ({
    root: {
        minWidth: 0,
        margin: theme.spacing(0.5)
    },
    secondary: {
        backgroundColor: theme.palette.secondary.light,
        backgroundColor: 'red',
        '& .MuiButton-label': {
            color: theme.palette.secondary.main,
            color: 'white'

        }
    },
    primary: {
        backgroundColor: theme.palette.primary.main,
        backgroundColor: 'blue',

        '& .MuiButton-label': {
            color: theme.palette.primary.main,
            color: 'white'
        }
    },
}))

export default function ActionButton(props) {

    const { color, children, onClick } = props;
    const classes = useStyles();

    return (
        <Button
            className={`${classes.root} ${classes[color]}`}
            onClick={onClick}>
            {children}
        </Button>
    )
}
