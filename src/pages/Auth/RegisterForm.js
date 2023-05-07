import React, { useState } from 'react';
import jwt_decode from 'jwt-decode';
import './style.css';
import usersApi from '../../api/usersApi';
import { useNavigate } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import CustomizedSnackbars from '../../components/Snackbar';
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Slide } from '@mui/material';
import { isValidPassword, isValidEmail, isValidCambodiaPhone, passwordRuleMessages } from '../../helper/validateFormatHelper';
import { Cancel, CheckBox } from '@mui/icons-material';
import sendmailApi from '../../api/sendmailApi';
export const RegisterForm = () => {
    const navigate = useNavigate();
    const [inputs, setInputs] = useState({});
    const [loading, setLoading] = useState(false);
    const [snackBar, setSnackBar] = useState({ isOpen: false, message: "", type: "", Transition: Slide });
    const [isValid, setIsValid] = useState(true);
    const [validPasswordFormat, setValidPasswordFormat] = useState(passwordRuleMessages);
    const [validEmailFormat, setValidEmailFormat] = useState();
    const [validPhoneFormat, setvalidPhoneFormat] = useState();

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setIsValid(true);
        setInputs(values => ({ ...values, [name]: value }));

        if (name === 'email') {
            setValidEmailFormat(isValidEmail(value));
        }
        else if (name === 'mobile') {
            console.log(isValidCambodiaPhone(inputs.mobile), 'phone');
            setvalidPhoneFormat(isValidCambodiaPhone(value));
        }

    }
    const handleGenderChange = (event) => {
        console.log(event.target.value, 'gender');
        // setGender(event.target.value);
        setInputs(values => ({ ...values, gender: event.target.value }))
    }
    const handleValidPassword = (event) => {
        setValidPasswordFormat(isValidPassword(event.target.value));
        setInputs(values => ({ ...values, password: event.target.value }))
    }
    const handleSubmit = async (event) => {
        event.preventDefault();

        console.log(inputs, 'validation ')
        if (!inputs.name || !inputs.password || !inputs.confirm_password || !inputs.gender || !inputs.mobile || !inputs.email) {
            setSnackBar({ isOpen: true, message: "No valid input", type: "warning" });
            setIsValid(false);
            return;
        };
        console.log(validPasswordFormat, ' password')
        console.log(validEmailFormat, ' password')
        console.log(validPhoneFormat, ' password')
        console.log(isValid, ' password');

        const isValidPasswordFormat = validPasswordFormat.every((val) => val.error === false);
        console.log(isValidPasswordFormat, 'erro')
        if (!isValidPasswordFormat || !validEmailFormat || !validPhoneFormat || !isValid || inputs.password !== inputs.confirm_password) {
            console.log(inputs, 'validationdsf ')
            // console.log()
            return;
        }

        try {
            setLoading(true);
            console.log(inputs, 'input')
            const result = await usersApi.createNewUser(inputs);
            console.log(result.data.success, 'result')
            if (result.data.success) {
                console.log(result.data, 'result12323')
                setSnackBar({ isOpen: true, message: result.data.message, type: "success" })
                console.log(inputs.user_id, 'id')
                const sendEmailResponse = await sendmailApi.sendMail({
                    user_id: inputs.user_id
                });
                console.log(sendEmailResponse, 'sxx')
                // if (sendEmailResponse.data.success) {
                //     console.log('send')
                // } else {
                //     console.log('eror')
                // }
                // navigate('/login')
            } else {
                setSnackBar({ isOpen: true, message: result.data.message, type: "warning" })
            }
        }
        catch (e) {
            setSnackBar({ isOpen: true, message: 'Something went wrong', type: "error" })
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <div className="login register">
            <div style={{ marginLeft: 0, paddingLeft: 0 }}>
                <form className="login-form" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '70vw' }}>
                    <section style={{ marginBottom: '-13vh', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', height: '80vh', justifyContent: 'flex-start', alignSelf: 'center', marginTop: '10vh' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', width: '50%' }}>
                            <input

                                required autoComplete='off' onChange={handleChange}
                                className={`input_email ${!inputs.user_id && !isValid ? 'invalid' : ''}`}
                                value={inputs.user_id || ''} type="text" placeholder="Student ID" id="user_id" name="user_id">
                            </input>
                            <div style={{ textAlign: 'left', marginLeft: '32px' }}>
                                {!inputs.user_id && !isValid && (
                                    <div className='register__validation-error' style={{ color: 'red' }}>Student ID is required</div>
                                )}


                            </div>
                            <input
                                required autoComplete='off' onChange={handleChange}
                                className={`input_email ${!inputs.user_id && !isValid ? 'invalid' : ''}`}
                                value={inputs.name || ''} type="text" placeholder="Full Name" id="name" name="name">
                            </input>
                            <div style={{ textAlign: 'left', marginLeft: '32px' }}>
                                {!inputs.name && !isValid && (
                                    <div className='register__validation-error' style={{ color: 'red' }}>Full Name is required</div>
                                )}
                            </div>
                            <input
                                required autoComplete='off' onChange={handleChange}
                                className={`input_email ${!inputs.user_id && !isValid ? 'invalid' : ''}`}
                                value={inputs.mobile || ''} type="text" placeholder="Tel" id="mobile" name="mobile">
                            </input>
                            <div style={{ textAlign: 'left', marginLeft: '32px' }}>
                                {!inputs.mobile && !isValid && (
                                    <div className='register__validation-error' style={{ color: 'red' }}>Phone Number is required</div>
                                )}

                            </div>
                            <div style={{ textAlign: 'left', marginLeft: '32px' }}>
                                {inputs.mobile && !validPhoneFormat && (
                                    <div className='register__validation-error' style={{ color: 'red' }}>Invalid Phone number</div>
                                )}

                            </div>
                            <FormControl style={{ marginLeft: '10%', marginTop: '3%' }}>
                                <FormLabel style={{ textAlign: 'left', }}>Gender</FormLabel>
                                <RadioGroup
                                    aria-labelledby="demo-radio-buttons-group-label"
                                    name="gender"
                                    style={{ display: 'flex', flexDirection: 'row' }}
                                    onChange={handleGenderChange}
                                    id="gender"
                                >
                                    <FormControlLabel value="F" control={<Radio />} label="Female" />
                                    <FormControlLabel value="M" control={<Radio />} label="Male" />
                                </RadioGroup>
                            </FormControl>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', width: '50%' }}>

                            <input
                                required autoComplete='off' onChange={handleChange}
                                className={`input_email ${!inputs.email && !isValid ? 'invalid' : ''}`}
                                value={inputs.email || ''} type="text" placeholder="Email" id="email" name="email">
                            </input>

                            <div style={{ textAlign: 'left', marginLeft: '32px' }}>
                                {!inputs.email && !isValid && (
                                    <div className='register__validation-error' style={{ color: 'red' }}>Email is required</div>
                                )}
                                {inputs.email && !validEmailFormat && (
                                    <span className='register__validation-error' style={{ color: 'red' }}>Invalid Email</span>
                                )}

                            </div>
                            <input onChange={handleValidPassword} className={`input_password ${!inputs.password && !isValid ? 'invalid' : ''} `} value={inputs.password || ''} type="password" placeholder="Password" id="password" name="password"></input>
                            <div style={{ textAlign: 'left', marginLeft: '32px' }}>
                                {!inputs.password && !isValid && (
                                    <div className='register__validation-error' style={{ color: 'red' }}>Password is required</div>
                                )}
                            </div>

                            <input onChange={handleChange} className={`input_password ${!inputs.confirm_password && !isValid ? 'invalid' : ''} `} value={inputs.confirm_password || ''} type="password" placeholder="Confirm Password" id="confirm_password" name="confirm_password"></input>
                            <div style={{ textAlign: 'left', marginLeft: '32px' }}>
                                {!inputs.confirm_password && !isValid && (
                                    <div className='register__validation-error' style={{ color: 'red' }}>Confirm password is required</div>
                                )}
                            </div>
                            <div style={{ textAlign: 'left', marginLeft: '32px' }}>
                                {inputs.confirm_password && inputs.confirm_password !== inputs.password && isValid && (
                                    <div className='register__validation-error' style={{ color: 'red' }}>Confirm password does not match </div>
                                )}

                            </div>

                            <div style={{ textAlign: 'left', marginLeft: '32px', paddingTop: '10px' }}>

                                <div>
                                    {validPasswordFormat.map((e) => {
                                        if (!e.error) {
                                            return (
                                                <div key={e.key} style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', color: 'green', fontSize: 'smaller' }}>
                                                    <CheckBox />  <span style={{ paddingLeft: '5px', color: 'black' }}> {e.message}</span>
                                                </div>
                                            );
                                        } else {
                                            return (
                                                <div key={e.key} style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', color: '#eb3023', fontSize: 'smaller' }}>
                                                    <Cancel />  <span style={{ paddingLeft: '5px', color: 'black' }}> {e.message}</span>
                                                </div>
                                            );
                                        }
                                    })}
                                </div>

                            </div>
                        </div>

                    </section>

                    <div>
                        <div style={{ display: "flex", justifyContent: 'space-between', marginLeft: '20px' }} className='flex content-center ml-5'>
                            <LoadingButton
                                sx={{ borderRadius: '6px', margin: '10px 0 0 20px', padding: '10px 30px', textTransform: 'none', }}
                                loading={loading}
                                variant="contained"
                                onClick={handleSubmit}
                            >
                                Sign Up
                            </LoadingButton>
                        </div>

                    </div>
                </form >
            </div >
            <CustomizedSnackbars snackBar={snackBar} setSnackBar={setSnackBar} position={{ vertical: 'top', horizontal: 'right' }} />

        </div >
    );
}