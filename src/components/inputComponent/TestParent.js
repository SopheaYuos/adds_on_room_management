import { useState } from "react";
import CustomInput from "./inputComponent";

export default function TestParent(){

        //  const [inputData, setInputData] = useState({});

        const [inputs, setInputs] = useState({});
    function handleSubmit() {
        console.log(inputs);
        // Do something with the input data
    }

    const [isFocused, setIsFocused] = useState({});
     const onToggle = (event) => {
         console.log(event.type, 'this is type')
        setIsFocused({
            ...isFocused,
            [event.target.name]: event.type === 'focus',
        });
    }
    const [isValid, setIsValid] = useState(true);

    const handleChange2 = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setIsValid(true);
        setInputs(values => ({ ...values, [name]: value }))
        console.log( inputs, 'sdf')
    }

    return (
        <div>
            <CustomInput
                name="test1"
                label="user"
                value={inputs.test1 || ''}
                onChange={handleChange2}
                onFocus={onToggle}
                onBlur={!inputs.test1 ? onToggle : null}
                isFocused={isFocused.test1}
            />
             <CustomInput
                name="test2"
                label="user"
                value={inputs.test2 || ''}
                onChange={handleChange2}
                onFocus={onToggle}
                onBlur={!inputs.test2 ? onToggle : null}
                isFocused={isFocused.test2}

            />
            <button onClick={handleSubmit}>Submit</button>
        </div>
    );

}