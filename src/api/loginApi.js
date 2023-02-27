import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode"
import AuthService from "../auth/authService";
import { URL } from "./api";

// eslint-disable-next-line import/no-anonymous-default-export
export default async function LoginApi(data) {
    //room

    console.log(data)
    const result = await axios.post(URL + '/api/login', data);
    // const expireDate = new Date(result?.data.exp * 1000)
    
    // AuthService(result?.data?.token)
    console.log(result.data)
    // const USER_ROLE = 'ADMIN'
    // if (USER_ROLE === 'ADMIN') {
    //     console.log('here we go admin')
    //     navigate('/dashboard')
    // }
    // if (USER_ROLE === 'TEACHER' || USER_ROLE === 'STUDENT') {

    // }
    return result.data;
}


