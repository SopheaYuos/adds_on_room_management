import React, { useState } from 'react';
import CustomInput from './inputComponent/inputComponent';
import { Add, Remove } from '@mui/icons-material';

export default function ToggleNew(props) {
    const [inputValues, setInputValues] = useState(['']);

    const handleAddInput = () => {
        setInputValues(prevValues => [...prevValues, '']);
    };

    const handleRemoveInput = (index) => {
        setInputValues(prevValues => {
            const newValues = [...prevValues];
            newValues.splice(index, 1);
            return newValues;
        });
    };

    const handleInputChange = (event, index) => {
        const { value } = event.target;
        setInputValues(prevValues => {
            const newValues = [...prevValues];
            newValues[index] = value;
            return newValues;
        });
        props.onChange && props.onChange(inputValues);
    };

    return (
        <div>
            {inputValues.map((value, index) => (
                <div key={index}>
                    <CustomInput
                        name={props.name}
                        label={props.label}
                        value={value}
                        icon={props.icon}
                        onChange={event => handleInputChange(event, index)}
                        onBlur={props.onBlur}
                        onFocus={props.onFocus}
                        isFocused={props.isFocused}
                        isValid={props.isValid}
                    />
                    {index === inputValues.length - 1
                        ? <div className='popup__add-new-sub_room-icon' onClick={handleAddInput}><Add/></div>
                        : <div  onClick={() => handleRemoveInput(index)}><Remove/></div>
                    }
                </div>
            ))}
        </div>
    );
}

