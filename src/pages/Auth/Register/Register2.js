import React, { useState } from 'react';
import jwt_decode from 'jwt-decode';
import './style.css';
import usersApi from '../../../api/usersApi';
import { useNavigate } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import CustomizedSnackbars from '../../../components/Snackbar';
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Slide } from '@mui/material';
import { isValidPassword, isValidEmail, isValidCambodiaPhone, passwordRuleMessages } from '../../../helper/validateFormatHelper';
import { AlternateEmail, Cancel, CheckBox, Lock, Person, Visibility, VisibilityOff } from '@mui/icons-material';
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
    const [isHide, setIsHide] = useState({ confirm_password: true, password: true });
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        if (name === 'confirm_password' || name === 'password') {
            if (inputs.confirm_password !== inputs.password) {
                console.log(inputs.password !== inputs.confirm_password, 'go')
                console.log(inputs.password, inputs.confirm_password, 'go2')
            }
        }
        setIsValid(true);
        setInputs(values => ({ ...values, [name]: value }))
    }
    const handleSubmit = async (event) => {

        console.log(inputs.password, inputs.confirm_password, inputs.password !== inputs.confirm_password)
        event.preventDefault();
        if (
            !inputs.user_id ||
            !inputs.password ||
            !inputs.name ||
            !inputs.email ||
            inputs.password !== inputs.confirm_password
        ) {
            setIsValid(false);

            console.log(inputs, 'validationdsf ');
            // console.log()
            return;
        }
        try {
            setLoading(true);
            console.log(inputs, 'input')

            inputs.role = 'STUDENT'
            const result = await usersApi.createNewUser(inputs);
            console.log(result.data.success, 'result');

            if (result.data.success) {
                console.log(result.data, 'result12323')
                setSnackBar({ isOpen: true, message: result.data.message, type: "success" })
                console.log(inputs.user_id, 'id')
                const sendEmailResponse = await sendmailApi.sendMail({
                    user_id: inputs.user_id,
                    subject: 'Email Verification'
                });
                console.log(sendEmailResponse, 'test')
                if (sendEmailResponse.data.success) {
                    const encode = window.btoa(JSON.stringify(
                        {
                            user_id: inputs.user_id,
                            from_parent: 'register',
                            to_child: '/login2'
                        }));
                    navigate(`/code-verification?u=${encode}`);

                } else {
                    console.log('dd')
                    setSnackBar({ isOpen: true, message: 'Email cannot be sent', type: "warning" })
                }
                console.log(sendEmailResponse, 'sxx')
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
    const handleRegister = () => {
        navigate('/register');
    }
    const handleForgotPassword = () => {
        navigate('/forgot-password')
    }
    const toggleHidePassword = (event) => {
        if (event === 'password') setIsHide({ confirm_password: isHide.confirm_password, password: !isHide.password })
        else if (event === 'confirm_password') setIsHide({ confirm_password: !isHide.confirm_password, password: isHide.password });
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
                        <div className={`input-div one ${isFocused.user_id ? 'focus' : ''} ${!isValid && !inputs.user_id ? 'invalid' : ''} `}>

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
                        <div className={`input-div one ${isFocused.name ? 'focus' : ''} ${!isValid && !inputs.name ? 'invalid' : ''} `}>

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
                        <div className={`input-div one ${isFocused.email ? 'focus' : ''} ${!isValid && !inputs.email ? 'invalid' : ''} `}>

                            <div className="i">
                                <AlternateEmail />
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
                        <div className={`input-div one ${isFocused.password ? 'focus' : ''} ${!isValid && !inputs.password ? 'invalid' : ''} `}>
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
                                    className={`input input-password ${!inputs.confirm_password && !isValid || (inputs.confirm_password && inputs.confirm_password !== inputs.password) ? 'invalid' : ''} `}
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
                        <input type="submit" className="btn" value="Register" />

                    </form>
                </div>
            </div>
            <CustomizedSnackbars snackBar={snackBar} setSnackBar={setSnackBar} position={{ vertical: 'top', horizontal: 'right' }} />

        </div>
    );
}