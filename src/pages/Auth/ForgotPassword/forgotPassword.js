import React, { useState } from 'react';
import './style.css';
import { useNavigate } from 'react-router-dom';
import CustomizedSnackbars from '../../../components/Snackbar';
import { Slide } from '@mui/material';
import { AlternateEmail } from '@mui/icons-material';
import usersApi from '../../../api/usersApi';
export const ForgotPassword = () => {
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

        if (!inputs.email) {
            setSnackBar({ isOpen: true, message: "No valid input", type: "info" })
            setIsValid(false);
            return;
        };
        try {
            setLoading(true);
            const req = {
                value: inputs.email,
                column: "user_id, email",
                subject: "Verify your email to create a new password"
            };
            // const result = await usersApi.forgotPass(inputs)
            const { data, message, success } = (await usersApi.forgotPassword(req)).data;
            const encode = window.btoa(JSON.stringify(
                {
                    user_id: data[0]?.user_id ?? '',
                    from_parent: 'forgot_password',
                    to_child: '/reset-password'
                }));
            if (success) {
                setSnackBar({ isOpen: true, message: message, type: "success" });
                navigate(`/code-verification?u=${encode}`);

            } else {
                setSnackBar({ isOpen: true, message: message, type: "success" });
                navigate(`/code-verification?u=${encode}`);

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
            <div className="forgot-password-container">
                <div className="img">
                    <img src="/assets/forgot_password.svg" />
                </div>
                <div className="forgot-password-content">
                    <form onSubmit={handleSubmit}>
                        <h2 className="title">Forgot <div>Password?</div></h2>
                        <h4>If you entered a correct email, we will send verification code to your email</h4>
                        <div className={`input-div one ${isFocused ? 'focus' : ''} ${!isValid ? 'invalid' : ''}`}>
                            <div className="i">
                                <AlternateEmail />
                            </div>
                            <div className="div">
                                <h5>Enter email</h5>
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
                        <input type="submit" className="btn" value="Submit" />
                    </form>
                </div>
            </div >
            <CustomizedSnackbars snackBar={snackBar} setSnackBar={setSnackBar} position={{ vertical: 'top', horizontal: 'right' }} />

        </div >
    );
}