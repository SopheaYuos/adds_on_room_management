import React from 'react'
import { makeStyles } from "@material-ui/core";
import { Button as MuiButton } from '@mui/material';
import { Padding } from '@mui/icons-material';


const useStyles = makeStyles(theme => ({
    // root: {
    //     margin: theme.spacing(0.5),
    // },
    label: {
        textTransform: 'none'
    }
}))

export default function Button(props) {

    const { text, size, color, variant, onClick, ...other } = props
    const classes = useStyles();

    return (
        <MuiButton
            disableRipple
            variant={variant || "contained"}
            size={size || "large"}
            color={color || "primary"}
            onClick={onClick}
            {...other}
            classes={{ root: classes.root, label: classes.label }}>
            {text}
        </MuiButton>
    )
}
