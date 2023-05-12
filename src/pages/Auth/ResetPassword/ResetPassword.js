import React, { useState } from 'react';
import jwt_decode from 'jwt-decode';
import './style.css';
import usersApi from '../../../api/usersApi';
import { useNavigate } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import CustomizedSnackbars from '../../../components/Snackbar';
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Slide } from '@mui/material';
import { isValidPassword, isValidEmail, isValidCambodiaPhone, passwordRuleMessages } from '../../../helper/validateFormatHelper';
import { Cancel, CheckBox, Lock, Person, AlternateEmail } from '@mui/icons-material';
import sendmailApi from '../../../api/sendmailApi';
import LoginApi from '../../../api/loginApi';
export const ResetPassword = () => {
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
        console.log('Input field blurred!');
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

    return (
        <div>
            <img className="wave" src={"/assets/wave.png"} />
            <div className="reset-password-container">
                <div className="img">
                    <img src={"/assets/reset_password.svg"} />
                </div>
                <div className="reset-password-content">
                    <form action="index.html">
                        {/* <img src={"/assets/forgot_password_profile.svg"} /> */}
                        <h2 className="title">Reset <div>Password</div></h2>
                        <h4>Please enter the email address associated with your account</h4>
                        <div className={isFocused ? 'input-div one focus' : 'input-div one'}>
                            <div className="i">
                                <AlternateEmail />
                            </div>
                            <div className="div">
                                <h5>Enter email</h5>
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
                        <input type="submit" className="btn" value="Submit" />
                    </form>
                </div>
            </div>
            <CustomizedSnackbars snackBar={snackBar} setSnackBar={setSnackBar} position={{ vertical: 'top', horizontal: 'right' }} />

        </div>
    );
}