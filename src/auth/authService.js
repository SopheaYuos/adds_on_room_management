import React from "react";
import jwt_decode from "jwt-decode";
import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
// import jwt_decode from "jwt-decode";

export default function AuthService(token) {
    const decode = jwt_decode(token)
    console.log(decode, 'decode');

    const USER_ROLE = decode?.user_role;
    console.log(USER_ROLE, "HEE");
    if (USER_ROLE === 'ADMIN') {
        console.log('here we go admin')
        return true;
    }
    if (USER_ROLE === 'TEACHER' || USER_ROLE === 'STUDENT') {

    }


}
