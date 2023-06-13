import React, { useRef, useState } from 'react';
import axios from 'axios';
import uploadImageHelper from '../../helper/uploadImageHelper';
import { Clear, CloudUpload, NoteAdd, Remove, Task } from '@mui/icons-material';
import { Button, IconButton, LinearProgress } from '@mui/material';
import './uploadImageStyle.css'
const api_key = "693276158941217";
const cloud_name = "dpszrbvez";
const api = axios.create({
    baseURL: 'http://localhost:4000'
});
function ImageUploader(props) {
    const [progress, setProgress] = useState(0);
    const [uploadFile, setUploadFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);
    const handleSubmit = async (e) => {
        e.preventDefault();
        // uploadImageHelper(e);
        console.log('hello')
        const file = uploadFile;
        console.log(file, 'file')
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
                onUploadProgress: function (e) {
                    setProgress(Math.round((e.loaded * 100) / e.total));
                },
            }
        );

        console.log(cloudinaryResponse.data);
        props.onData(cloudinaryResponse.data);

        const photoData = {
            public_id: cloudinaryResponse.data.public_id,
            version: cloudinaryResponse.data.version,
            signature: cloudinaryResponse.data.signature,
        };

        // await axios.post("/do-something-with-photo", photoData);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setUploadFile(file);
        console.log(file, 'file');
        props.onFileUploadChange(true);
        if (file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const imagePreview = event.target.result;
                setImagePreview(imagePreview);
            };
            reader.readAsDataURL(file);
        }
        if (!file.type.startsWith("image/")) {
            alert("Please select a jpeg, jpg, or png image.");
            return;
        }
    };
    const onClearImagePreview = () =>{
        setImagePreview(null);
        setUploadFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.form.reset();
        }
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label htmlFor="file-field">
                    <span>Choose File</span>
                    <IconButton disableRipple component="span">
                        <NoteAdd color='primary' />
                    </IconButton>
                </label>
                <input
                    type="file"
                    id="file-field"
                    name="file"
                    ref={fileInputRef}
                    accept='.jpg, .png, .jpeg'
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                />
                <div >
                    <span>Upload</span>
                    <IconButton color='primary' onClick={handleSubmit} disabled={!uploadFile} disableRipple component="span">
                        <CloudUpload />
                    </IconButton></div>
           </div>
            {progress > 0 && progress !== 100 && imagePreview &&
                 <p>Upload progress: {progress}%
                <LinearProgress variant="determinate" value={progress} />
                 </p>
            }
            {imagePreview && (
                <div style={{marginTop: '8px', position: 'relative'}} className='uploadimage__container'>
                    <img height={'100%'} width={'100%'} src={imagePreview} alt="Preview" />
                    <IconButton disabled={progress > 0} size='small' onClick={onClearImagePreview} className='clear-icon-button'>
                        <Clear/>
                    </IconButton>
                </div>
            )}
        </div>
    );
}
export default ImageUploader;