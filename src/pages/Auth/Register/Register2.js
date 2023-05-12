import React, { useState } from 'react';
import jwt_decode from 'jwt-decode';
import './style.css';
import usersApi from '../../../api/usersApi';
import { useNavigate } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import CustomizedSnackbars from '../../../components/Snackbar';
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Slide } from '@mui/material';
import { isValidPassword, isValidEmail, isValidCambodiaPhone, passwordRuleMessages } from '../../../helper/validateFormatHelper';
import { Cancel, CheckBox, Lock, Person } from '@mui/icons-material';
import sendmailApi from '../../../api/sendmailApi';
import LoginApi from '../../../api/loginApi';
export const Register2 = () => {
    // const inputHTML = document.querySelectorAll(".input");


    // function addcl() {
    //     let parent = this.parentNode.parentNode;
    //     parent.classList.add("focus");
    // }

    // function remcl() {
    //     let parent = this.parentNode.parentNode;
    //     if (this.value == "") {
    //         parent.classList.remove("focus");
    //     }
    // }
    // inputHTML.forEach(input => {
    //     input.addEventListener("focus", addcl);
    //     input.addEventListener("blur", remcl);
    // });
    // const navigate = useNavigate();
    // const [inputs, setInputs] = useState({});
    // const [loading, setLoading] = useState(false);
    // const [snackBar, setSnackBar] = useState({ isOpen: false, message: "", type: "", Transition: Slide });
    // const [isValid, setIsValid] = useState(true);
    // const [validPasswordFormat, setValidPasswordFormat] = useState(passwordRuleMessages);
    // const [validEmailFormat, setValidEmailFormat] = useState();
    // const [validPhoneFormat, setvalidPhoneFormat] = useState();

    // const handleChange = (event) => {
    //     const name = event.target.name;
    //     const value = event.target.value;
    //     setIsValid(true);
    //     setInputs(values => ({ ...values, [name]: value }));

    //     if (name === 'email') {
    //         setValidEmailFormat(isValidEmail(value));
    //     }
    //     else if (name === 'mobile') {
    //         console.log(isValidCambodiaPhone(inputs.mobile), 'phone');
    //         setvalidPhoneFormat(isValidCambodiaPhone(value));
    //     }

    // }
    // const handleGenderChange = (event) => {
    //     console.log(event.target.value, 'gender');
    //     // setGender(event.target.value);
    //     setInputs(values => ({ ...values, gender: event.target.value }))
    // }
    // const handleValidPassword = (event) => {
    //     setValidPasswordFormat(isValidPassword(event.target.value));
    //     setInputs(values => ({ ...values, password: event.target.value }))
    // }
    const [isFocused, setIsFocused] = useState(
        {
            user_id: false,
            name: false,
            password: false,
            email: false,
            confirm_password: false
        });
    const [isPasswordFocus, setIsPasswordFocus] = useState(false);
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
        setIsFocused({
            ...isFocused,
            [event.target.name]: false,
        });
    }

    const navigate = useNavigate();
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
        console.log(inputs, 'inputasdf')
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

                document.cookie = "token=" + result?.token;
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
        navigate('/register');
    }
    const handleForgotPassword = () => {
        navigate('/forgot-password')
    }

    return (
        <div>
            <img className="wave" src={"/assets/wave.png"} />
            <div className="register-container">
                <div className="img">
                    <img src={"/assets/register.svg"} />
                </div>
                <div className="register-content">
                    <form onSubmit={handleSubmit}>
                        {/* <img src={"/assets/avatar.svg"} /> */}
                        <h2 className="title">Sign up</h2>
                        <div className={`input-div one ${isFocused.user_id ? 'focus' : ''} ${!isValid && !inputs.user_id ? 'invalid' : ''}`}>

                            <div className="i">
                                <Person />
                            </div>
                            <div className="div">
                                <h5>Student ID</h5>
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
                        <div className={`input-div one ${isFocused.name ? 'focus' : ''} ${!isValid && !inputs.name ? 'invalid' : ''}`}>

                            <div className="i">
                                <Person />
                            </div>
                            <div className="div">
                                <h5>Full Name</h5>
                                <input
                                    onBlur={!inputs.name ? handleBlur : handleFocus}
                                    onFocus={handleFocus}
                                    onChange={handleChange}
                                    value={inputs.name || ''}
                                    name="name"
                                    id="name"
                                    type="text"
                                    className="input"
                                    autoComplete="off"
                                />

                            </div>
                        </div>
                        <div className={`input-div one ${isFocused.email ? 'focus' : ''} ${!isValid && !inputs.email ? 'invalid' : ''}`}>

                            <div className="i">
                                <Person />
                            </div>
                            <div className="div">
                                <h5>Email</h5>
                                <input
                                    onBlur={!inputs.email ? handleBlur : handleFocus}
                                    onFocus={handleFocus}
                                    onChange={handleChange}
                                    value={inputs.email || ''}
                                    name="email"
                                    id="email"
                                    type="text"
                                    className="input"
                                    autoComplete="off"
                                />

                            </div>
                        </div>
                        <div className={`input-div one ${isFocused.password ? 'focus' : ''} ${!isValid && !inputs.password ? 'invalid' : ''}`}>
                            <div className="i">
                                <Person />
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
                                    type="text"
                                    className="input"
                                    autoComplete="off"
                                />

                            </div>
                        </div>
                        <div className={`input-div one ${isFocused.confirm_password ? 'focus' : ''} ${!isValid && !inputs.confirm_password ? 'invalid' : ''}`}>

                            <div className="i">
                                <Lock />
                            </div>
                            <div className="div">
                                <h5>Confirm Password </h5>
                                <input
                                    onBlur={!inputs.confirm_password ? handleBlur : handleFocus}
                                    onFocus={handleFocus}
                                    onChange={handleChange}
                                    className={`input ${!inputs.confirm_password && !isValid ? 'invalid' : ''}`}
                                    value={inputs.confirm_password || ''}
                                    type="password"
                                    name="confirm_password"
                                />
                            </div>

                        </div>
                        <input type="submit" className="btn" value="Register" />

                    </form>
                </div>
            </div>
            <CustomizedSnackbars snackBar={snackBar} setSnackBar={setSnackBar} position={{ vertical: 'top', horizontal: 'right' }} />

        </div>
    );
}