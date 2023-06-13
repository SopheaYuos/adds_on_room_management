import React from 'react'
import './customInputStyle.css'
export default function CustomInput(props) {

    const { name, label, value, icon, onChange, onBlur, onFocus, isFocused, isValid} = props;

    
    return (
        <div className='custom__input-content'>
            <div className={`input-div one ${isFocused ? 'focus' : ''} ${!isValid ? 'invalid' : ''}`}>
                <div className="i">
                   {icon}
                </div>
                <div className="div">
                    <h5>{label}</h5>
                    <input
                        onBlur={onBlur} 
                        onFocus={onFocus}
                        onChange={onChange}
                        value={value}
                        name={name}
                        label={label}
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
