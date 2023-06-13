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

// // Set a cookie with a value and expiration date
// function setCookie(name, value, expirationDate) {
//     const expires = `expires=${expirationDate.toUTCString()}`;
//     document.cookie = `${name}=${encodeURIComponent(value)}; ${expires}; path=/`;
// }

// // Get the value of a cookie
// function getCookie(name) {
//     const cookieName = `${name}=`;
//     const decodedCookies = decodeURIComponent(document.cookie);
//     const cookies = decodedCookies.split(';');

//     for (let i = 0; i < cookies.length; i++) {
//         let cookie = cookies[i];
//         while (cookie.charAt(0) === ' ') {
//             cookie = cookie.substring(1);
//         }
//         if (cookie.indexOf(cookieName) === 0) {
//             return cookie.substring(cookieName.length, cookie.length);
//         }
//     }
//     return null;
// }

// // Remove a cookie by setting its expiration date to the past
// function removeCookie(name) {
//     document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
// }
