import axios from "axios";
import { useState } from "react";

export default async function uploadImageHelper(e){
    // const [progress, setProgress] = useState(0);

    const api_key = "693276158941217";
    const cloud_name = "dpszrbvez";
    const api = axios.create({
        baseURL: 'http://localhost:4000'
    });
    const file = e.target.elements.file.files[0];
    if (file.size > 2 * 1024 * 1024) {
        alert("File size exceeds 2MB limit");
        return;
    }

    const signatureResponse = await api.get("/get-signature");
    const data = new FormData();
    data.append("file", file);
    data.append("api_key", api_key);
    data.append("signature", signatureResponse.data.signature);
    data.append("timestamp", signatureResponse.data.timestamp);
    const cloudinaryResponse = await api.post(
        `https://api.cloudinary.com/v1_1/${cloud_name}/auto/upload`,
        data,
        {
            headers: { "Content-Type": "multipart/form-data" },
            // onUploadProgress: function (e) {
            //     setProgress(Math.round((e.loaded * 100) / e.total));
            // },
        }
    );

    console.log(cloudinaryResponse.data);
     const{ public_id, version, signature } = cloudinaryResponse.data;
    return public_id, version, signature;
   
}