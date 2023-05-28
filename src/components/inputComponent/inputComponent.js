import React, { useState } from 'react'
import { TextField } from '@mui/material';
import './customInputStyle.css'
import { Person } from '@mui/icons-material';
export default function CustomInput(props) {

    const { name, label, value, error = null, onChange, ...other } = props;
    const [inputs, setInputs] = useState({});
    const [isFocused, setIsFocused] = useState(
        {
            customInput: false,
        }
        );
    const [isValid, setIsValid] = useState(true);

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setIsValid(true);
        setInputs(values => ({ ...values, [name]: value }))
    }
    function handleBlur(event) {
        setIsFocused({
            ...isFocused,
            [event.target.name]: false,
        });
    }
    const handleFocus = (event) => {
        setIsFocused({
            ...isFocused,
            [event.target.name]: true,
        });
    }
    return (
        <div className='custom__input-content'>
            <div className={`input-div one ${isFocused.customInput ? 'focus' : ''}${!isValid && !inputs.customInput ? 'invalid' : ''}`}>
                <div className="i">
                    <Person />
                </div>
                <div className="div">
                    <h5>Username</h5>
                    <input
                        onBlur={!inputs.customInput ? handleBlur : handleFocus}
                        onFocus={handleFocus}
                        onChange={handleChange}
                        value={inputs.customInput || ''}
                        name="customInput"
                        id="customInput"
                        type="text"
                        className="input"
                        autoComplete="off"
                    />

                </div>
            </div>
        </div>
        

    )
}
