import React, { useState } from 'react';
import jwt_decode from 'jwt-decode';
import './style.css';
import { useLocation, useNavigate } from 'react-router-dom';
import CustomizedSnackbars from '../../../components/Snackbar';
import { Slide } from '@mui/material';
import { AlternateEmail, Lock, Password, Visibility, VisibilityOff } from '@mui/icons-material';
import LoginApi from '../../../api/loginApi';
import usersApi from '../../../api/usersApi';
export const ResetPassword = () => {
    const [isFocused, setIsFocused] = useState({
        password: false,
        confirm_password: false
    });
    const [isPasswordFocus, setIsPasswordFocus] = useState(false);
    const [isHide, setIsHide] = useState({ confirm_password: true, password: true });

    const handleFocus = (event) => {
        setIsFocused({
            ...isFocused,
            [event.target.name]: true,
        });
    }
    const handlePasswordFocus = () => {
        setIsPasswordFocus(true);
    }
    const handlePasswordBlur = () => {
        setIsPasswordFocus(false);
    }
    function handleBlur(event) {
        setIsFocused(false);
        console.log('Input field blurred!');
    }
    const toggleHidePassword = (event) => {
        if (event === 'password') setIsHide({ confirm_password: isHide.confirm_password, password: !isHide.password })
        else if (event === 'confirm_password') setIsHide({ confirm_password: !isHide.confirm_password, password: isHide.password });
    }

    const navigate = useNavigate();
    const location = useLocation();

    const [inputs, setInputs] = useState({});
    const [loading, setLoading] = useState(false);
    const [snackBar, setSnackBar] = useState({ isOpen: false, message: "", type: "", Transition: Slide });
    const [isValid, setIsValid] = useState(true);
    const handleChange = (event) => {
        console.log(inputs, 'sdf')
        const name = event.target.name;
        const value = event.target.value;
        setIsValid(true);
        setInputs(values => ({ ...values, [name]: value }))
    }
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!inputs.password || !inputs.confirm_password) {
            setSnackBar({ isOpen: true, message: "No valid input", type: "info" })
            setIsValid(false);
            return;
        };
        try {
            setLoading(true);
            const queryParams = new URLSearchParams(location.search);
            let queryValue = {
                user_id: 0,
            }
            if (queryParams.get('u')) {

                queryValue = JSON.parse(window.atob(queryParams.get('u')));
                console.log(queryValue, 'tt');

            }
            const req = {
                user_id: queryValue.user_id,
                password: inputs.password,
                confirm_password: inputs.confirm_password
            }
            const { message, success } = (await usersApi.resetPassword(req)).data;
            console.log(message, success, 'test123')
            if (success) {
                setSnackBar({ isOpen: true, message: message, type: "success" })
                setTimeout(() => {
                    navigate('/login2');
                }, 500)
            } else {
                setSnackBar({ isOpen: true, message: message, type: "warning" })
            }
        }
        catch (e) {
            setSnackBar({ isOpen: true, message: 'Something went wrong', type: "error" })
        }
        finally {
            setLoading(false);
        }
    }
    const handleRegister = () => {
        navigate('/register');
    }

    return (
        <div>
            <img className="wave" src={"/assets/wave.png"} />
            <div className="reset-password-container">
                <div className="img">
                    <img src={"/assets/forgot_password.svg"} />
                </div>
                <div className="reset-password-content">
                    <form onSubmit={handleSubmit}>
                        {/* <img src={"/assets/forgot_password_profile.svg"} /> */}
                        <h2 className="title">Reset <div>Password</div></h2>
                        <h4>Please enter a new password and confirm password</h4>
                        <div className={`input-div one ${isFocused.password ? 'focus' : ''} ${!isValid && !inputs.password ? 'invalid' : ''}`}>
                            <div className="i">
                                <Lock />
                            </div>
                            <div className="div">
                                <h5>Password</h5>
                                <input
                                    onBlur={!inputs.password ? handleBlur : handleFocus}
                                    onFocus={handleFocus}
                                    onChange={handleChange}
                                    value={inputs.password || ''}
                                    name="password"
                                    id="password"
                                    type={`${isHide.password ? 'password' : 'text'}`}
                                    className="input input-password"
                                    autoComplete="off"
                                />

                            </div>
                            {isFocused.password && inputs.password &&
                                <div className="after" onClick={() => toggleHidePassword('password')} name='password'>
                                    {isHide.password ? <VisibilityOff /> : <Visibility />}
                                </div>}
                        </div>
                        <div className={`input-div one ${isFocused.confirm_password ? 'focus' : ''} ${!isValid && !inputs.confirm_password || (inputs.confirm_password && inputs.confirm_password !== inputs.password) ? 'invalid' : ''} `}>

                            <div className="i">
                                <Lock />
                            </div>
                            <div className="div">
                                <h5>Confirm Password </h5>
                                <input
                                    onBlur={!inputs.confirm_password ? handleBlur : handleFocus}
                                    onFocus={handleFocus}
                                    onChange={handleChange}
                                    className={`input input-password ${!inputs.confirm_password && !isValid ? 'invalid' : ''} `}
                                    value={inputs.confirm_password || ''}
                                    type={`${isHide.confirm_password ? 'password' : 'text'}`}
                                    name="confirm_password"
                                />
                            </div>
                            {isFocused.confirm_password && inputs.confirm_password &&
                                <div className="after" onClick={() => toggleHidePassword('confirm_password')}>
                                    {isHide.confirm_password ? <VisibilityOff /> : <Visibility />}
                                </div>}

                        </div>
                        <input type="submit" className="btn" value="Submit" />
                    </form>
                </div>
            </div>
            <CustomizedSnackbars snackBar={snackBar} setSnackBar={setSnackBar} position={{ vertical: 'top', horizontal: 'right' }} />

        </div>
    );
}