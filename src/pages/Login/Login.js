import React, { useState } from 'react';
import jwt_decode from 'jwt-decode';
import './style.css';
import LoginApi from '../../api/loginApi';
import { useNavigate } from 'react-router-dom';
export const Login = (props) => {
    const navigate = useNavigate();
    const [inputs, setInputs] = useState({});
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value }))
    }
    function getCookie(name) {
        let cookie = {};
        document.cookie.split(';').forEach(function (el) {
            let [k, v] = el.split('=');
            cookie[k.trim()] = v;
        })
        return cookie[name];
    }
    const handleSubmit = async (event) => {
        event.preventDefault();
        // loginApi.login(inputs);
        const result = await LoginApi(inputs)
        const USER_ROLE = jwt_decode(result.token).user_role;
        // document.cookie = "token=" + result?.token + "expires= " + USER_ROLE.exp;
        document.cookie = "token=" + result?.token;
        // const decode = jwt_decode(result?.data?.token)
        // console.log(jwt_decode(result?.token))


        if (USER_ROLE === 'ADMIN') {
            navigate('/dashboard')
        }
        if (USER_ROLE === 'TEACHER' || USER_ROLE === 'STUDENT') {
            navigate('/user/book')
        }
        // console.log(api, "api");
        // navigate('/dashboard')
        // AuthService("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkI…I2MX0.uZ1zNHb4jsWbSgV65ilHEo_9X1kTFXATBpiwhLcP3PI")
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
                                <input onChange={handleChange} className="input_email" value={inputs.user_id} type="text" placeholder="Username" id="user_id" name="user_id"></input>
                                <input onChange={handleChange} className="input_password" value={inputs.password} type="password" placeholder="Password" id="password" name="password"></input>
                            </center>
                            <div>
                                <center>
                                    <button id="button-input" onClick={handleSubmit}>Log in</button>
                                </center>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="image">
                    <img src={'/assets/Welcome.svg'} alt="welcome" className="welcome"></img>
                </div>
            </div>
        </div>
    );
}