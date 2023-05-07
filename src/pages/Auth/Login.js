import React, { useState } from 'react';
import jwt_decode from 'jwt-decode';
import './style.css';
import LoginApi from '../../api/loginApi';
import { useNavigate } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import CustomizedSnackbars from '../../components/Snackbar';
import { Box, Button, InputAdornment, Slide, TextField } from '@mui/material';
import { AccountCircle, Person } from '@mui/icons-material';
export const Login = () => {
    const navigate = useNavigate();
    const [inputs, setInputs] = useState({});
    const [loading, setLoading] = useState(false);
    const [snackBar, setSnackBar] = useState({ isOpen: false, message: "", type: "", Transition: Slide });
    const [isValid, setIsValid] = useState(true);
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
        <div className="login">
            <div className="app">
                <div className="auth-form-container">
                    <div className="container">
                        <center>
                            <div>
                                <img src={"/assets/logoitc.png"} alt="logoitc" className="logo"></img>
                            </div>
                            <div className="text-logo">
                                <h3>Log in to book a room</h3>
                            </div>
                        </center>
                    </div>
                    <div>
                        <form className="login-form">
                            <center>
                                <input
                                    required autoComplete='off' onChange={handleChange}
                                    className={`input_email ${!inputs.user_id && !isValid ? 'invalid' : ''}`}
                                    value={inputs.user_id || ''} type="text" placeholder="Student ID" id="user_id" name="user_id">
                                </input>
                                <div style={{ textAlign: 'left', margin: '-10px 0 0 32px', fontSize: 'smaller' }}>
                                    {!inputs.user_id && !isValid && (
                                        <div style={{ color: 'red' }}>Student ID is required</div>
                                    )}
                                </div>
                                <input required onChange={handleChange} className={`input_password ${!inputs.password && !isValid ? 'invalid' : ''}`} value={inputs.password || ''} type="password" placeholder="Password" id="password" name="password"></input>
                                <div style={{ textAlign: 'left', margin: '-10px 0 0 32px', fontSize: 'smaller' }}>
                                    {!inputs.password && !isValid && (
                                        <div style={{ color: 'red' }}>Password is required</div>
                                    )}
                                </div>
                            </center>

                            <div>
                                <div style={{ display: "flex", justifyContent: 'space-between', marginLeft: '20px' }}>
                                    <LoadingButton
                                        sx={{ borderRadius: '6px', margin: '10px 0 0 10px', padding: '10px 20px' }}
                                        loading={loading}
                                        variant="contained"
                                        onClick={handleSubmit}
                                    >
                                        Log in
                                    </LoadingButton>
                                    <Button
                                        style={{ borderRadius: '8px', margin: '10px 0 0 20px' }}
                                    >
                                        Forgot password?
                                    </Button>
                                </div>
                                <center>
                                    Don't have an Account?
                                    <Button
                                        onClick={handleRegister}
                                        color='primary'
                                        variant='text'>
                                        Register
                                    </Button>
                                </center>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="image">
                    <img style={{ marginLeft: '10%' }} src={'/assets/Welcome.svg'} alt="welcome" className="welcome"></img>
                </div>
            </div >
            <CustomizedSnackbars snackBar={snackBar} setSnackBar={setSnackBar} position={{ vertical: 'top', horizontal: 'right' }} />

        </div >
    );
}