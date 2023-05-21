import React, { useState } from 'react';
import './style.css';
import { useLocation, useNavigate } from 'react-router-dom';
import CustomizedSnackbars from '../../../components/Snackbar';
import { Slide } from '@mui/material';
import { PinOutlined } from '@mui/icons-material';
import valideOtpApi from '../../../api/otpApi'
import { Clock } from '../../../components/LiveClock';
export const CodeVerification = () => {
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
        // console.log('helo')
        if (!inputs.otp_code) {
            setIsValid(false)
            return;
        }
        const queryParams = new URLSearchParams(location.search);
        let queryValue = {
            user_id: 0,
            from_parent: '',
            to_child: '',
        }
        if (queryParams.get('u')) {

            queryValue = JSON.parse(window.atob(queryParams.get('u')));
            console.log(queryValue, 'tt');

        }

        const result = await valideOtpApi.validateOtp({ user_id: queryValue.user_id, code: inputs.otp_code });
        if (result.data.success) {
            setSnackBar({ isOpen: true, message: result.data.message, type: "success" });

            if (queryValue.from_parent === 'forgot_password') {
                const encode = window.btoa(JSON.stringify(
                    {
                        user_id: queryValue.user_id,
                    }));
                window.location.href = `${queryValue.to_child}?u=${encode}`;
                return;
            }
            window.location.href = queryValue.to_child;

            // userid = decode.user_id;

            // console.log(userid, 'test12323')

        }
        else setSnackBar({ isOpen: true, message: result.data.message, type: "warning" })

    }

    return (
        <div>
            {/* <Clock timeTillDate="05 26 2019, 6:00 am" */}
            {/* timeFormat="MM DD YYYY, h:mm a" /> */}
            {/* <img className="wave" src={"/assets/wave.png"} /> */}
            <div className="code-verification-container">
                <div className="img">
                    <img src={"/assets/reset_password.svg"} />
                </div>
                <div className="code-verification-content">
                    <form onSubmit={handleSubmit}>

                        {/* <img src={"/assets/forgot_password_profile.svg"} /> */}
                        <h2 className="title">Code <div>Verification</div></h2>
                        <h4>Go to your email and input 6-digit verification code</h4>
                        <div className={`input-div one ${isFocused ? 'input-div one focus' : ''} ${!isValid ? 'invalid' : ''}`}>
                            <div className="i">
                                <PinOutlined />
                            </div>
                            <div className="div">
                                <h5>Enter code</h5>
                                <input
                                    onBlur={!inputs.otp_code ? handleBlur : handleFocus}
                                    onFocus={handleFocus}
                                    onChange={handleChange}
                                    value={inputs.otp_code || ''}
                                    name="otp_code"
                                    id="otp_code"
                                    type="text"
                                    className="input"
                                    autoComplete="off"
                                    // inputMode="numeric"
                                    onKeyDown={(e) => {
                                        // Allow control keys and backspace
                                        if (e.ctrlKey || e.altKey || e.metaKey || e.key === 'Backspace' || e.key === 'Enter') {
                                            return;
                                        }
                                        // Disallow non-numeric keys
                                        if (!/^\d$/.test(e.key)) {
                                            e.preventDefault();
                                        }
                                    }}

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