import jwt_decode from "jwt-decode";

function getCookie(name) {
    let cookie = {};
    document.cookie.split(';').forEach(function (el) {
        let [k, v] = el.split('=');
        cookie[k.trim()] = v;
    })
    return cookie[name];
}
export default function getUserFromCookie(tokenName) {
    return jwt_decode(getCookie(tokenName));
}