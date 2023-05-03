import React, { useState } from 'react';
import axios from 'axios';

const api_key = "972192476287928";
const cloud_name = "duexsnrij";
const api = axios.create({
    baseURL: 'http://localhost:4000'
});
function ImageUploader() {
    const [progress, setProgress] = useState(0);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // get signature. In reality you could store this in localstorage or some other cache mechanism, it's good for 1 hour
        const signatureResponse = await api.get("/get-signature");
        console.log(signatureResponse, 'sign');
        const data = new FormData();
        data.append("file", e.target.elements.file.files[0]);
        data.append("api_key", api_key);
        data.append("signature", signatureResponse.data.signature);
        data.append("timestamp", signatureResponse.data.timestamp);
        console.log(data, 'this is data');
        const cloudinaryResponse = await api.post(`https://api.cloudinary.com/v1_1/${cloud_name}/auto/upload`, data, {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: function (e) {
                setProgress(Math.round((e.loaded * 100) / e.total));
            }
        });

        console.log(cloudinaryResponse.data);

        // send the image info back to our server
        const photoData = {
            public_id: cloudinaryResponse.data.public_id,
            version: cloudinaryResponse.data.version,
            signature: cloudinaryResponse.data.signature
        };

        // await axios.post("/do-something-with-photo", photoData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="file-field">Choose a file:</label>
            <input type="file" id="file-field" name="file" />
            <button type="submit">Upload</button>
            {progress > 0 && <p>Upload progress: {progress}%</p>}
        </form>
    );
}

export default ImageUploader;