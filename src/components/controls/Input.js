import React from 'react'
import { TextField } from '@mui/material';

export default function Input(props) {

    const { name, label, value, error = null, onChange, ...other } = props;
    return (
        <TextField
            className='input__component-dialog'
            variant="outlined"
            label={label}
            name={name}
            value={value}
            onChange={onChange}
            {...other}
            {...(error && { error: true, helperText: error })}
        />
    )
}
