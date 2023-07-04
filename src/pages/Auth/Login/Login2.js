import React, { useState } from 'react';
import jwt_decode from 'jwt-decode';
import './style.css';
import { useNavigate } from 'react-router-dom';
import CustomizedSnackbars from '../../../components/Snackbar';
import { Slide } from '@mui/material';
import { Lock, Person, Visibility, VisibilityOff } from '@mui/icons-material';
import LoginApi from '../../../api/loginApi';
import { setCookie } from '../../../helper/cookieHelper';
export const Login2 = () => {
    const [isFocused, setIsFocused] = useState(false);
    const [isPasswordFocus, setIsPasswordFocus] = useState(false);
    function handleFocus() {
        setIsFocused(true);
    }
    const handlePasswordFocus = () => {
        setIsPasswordFocus(true);
    }
    const handlePasswordBlur = () => {
        setIsPasswordFocus(false);
    }
    function handleBlur(event) {
        setIsFocused(false);
    }

    const navigate = useNavigate();
    const [inputs, setInputs] = useState({});
    const [loading, setLoading] = useState(false);
    const [snackBar, setSnackBar] = useState({ isOpen: false, message: "", type: "", Transition: Slide });
    const [isValid, setIsValid] = useState(true);
    const [isHide, setIsHide] = useState(true);
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setIsValid(true);
        setInputs(values => ({ ...values, [name]: value }))
    }
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!inputs.user_id || !inputs.password) {
            setSnackBar({ isOpen: true, message: "No valid input", type: "info" })
            setIsValid(false);
            return;
        };
        try {
            setLoading(true);
            const result = await LoginApi(inputs)
            if (result.success) {
                setSnackBar({ isOpen: true, message: result.message, type: "success" })

                setCookie('token', result?.token, 7);

                const USER_ROLE = jwt_decode(result.token).user_role;
                if (USER_ROLE === 'ADMIN') {
                    navigate('/dashboard')
                }
                if (USER_ROLE === 'TEACHER' || USER_ROLE === 'STUDENT') {
                    navigate('/user/book')
                }
            } else {
                setSnackBar({ isOpen: true, message: result.message, type: "warning" })
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
        navigate('/register2');
    }
    const handleForgotPassword = () => {
        navigate('/forgot-password')
    }
    const toggleHidePassword = () => {
        setIsHide(!isHide);
    }

    return (
        <div style={{ overflow: 'scroll' }}>
            <img className="wave" src={"/assets/wave.png"} />
            <div className="container">
                <div className="img">
                    <img src={"/assets/bg.svg"} />
                </div>
                <div className="login-content">
                    <form onSubmit={handleSubmit}>
                        <img src={"/assets/avatar.svg"} />
                        <h2 className="title">Welcome</h2>
                        <div className={`input-div one ${isFocused ? 'focus' : ''} ${!isValid && !inputs.user_id ? 'invalid' : ''}`}>
                            <div className="i">
                                <Person />
                            </div>
                            <div className="div">
                                <h5>Username</h5>
                                <input
                                    onBlur={!inputs.user_id ? handleBlur : handleFocus}
                                    onFocus={handleFocus}
                                    onChange={handleChange}
                                    value={inputs.user_id || ''}
                                    name="user_id"
                                    id="user_id"
                                    type="text"
                                    className="input"
                                    autoComplete="off"
                                />

                            </div>
                        </div>
                        <div className={`${isPasswordFocus ? 'input-div pass focus' : 'input-div pass'} ${!isValid && !inputs.password ? 'invalid' : ''}`} >
                            <div className="i">
                                <Lock />
                            </div>

                            <div className="div">
                                <h5>Password </h5>
                                <input
                                    onBlur={!inputs.password ? handlePasswordBlur : handlePasswordFocus}
                                    onFocus={handlePasswordFocus}
                                    onChange={handleChange}
                                    className='input'
                                    value={inputs.password || ''}
                                    type={isHide ? 'password' : 'text'}
                                    name="password"
                                    id="password"
                                />
                            </div>
                            {isPasswordFocus && inputs.password &&
                                <div className="after" onClick={toggleHidePassword}>
                                    {isHide ? <VisibilityOff /> : <Visibility />}
                                </div>}

                        </div>
                        <div className="forgot-password" onClick={handleForgotPassword}>Forgot Password?</div>
                        <input type="submit" className="btn" value="Login" />
                        <div className="register-account" >
                            <span>Need an Account? </span>
                            <span onClick={handleRegister} className='content'>Register</span>
                        </div>

                    </form>
                </div>
            </div >
            <CustomizedSnackbars snackBar={snackBar} setSnackBar={setSnackBar} position={{ vertical: 'top', horizontal: 'right' }} />

        </div >
    );
}