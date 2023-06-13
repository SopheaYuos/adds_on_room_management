const { Buffer } = require('buffer');

function encodeURL(encodingObj){
    const encode = window.btoa(JSON.stringify(encodingObj));
    return encode;
}
 function decodeURL(decodeName){
    const queryParams = new URLSearchParams(window.location.search);
     if (queryParams.get(decodeName)){

         return JSON.parse(window.atob(queryParams.get(decodeName) ?? ''));
     }
}

function encodeBase64(object) {
    const jsonString = JSON.stringify(object);
    const buffer = Buffer.from(jsonString, 'utf8');
    return buffer.toString('base64');
}

function decodeBase64(encodedString) {
    const buffer = Buffer.from(encodedString, 'base64');
    const jsonString = buffer.toString('utf8');
    return JSON.parse(jsonString);
}


export default {encodeURL, decodeURL, encodeBase64, decodeBase64};