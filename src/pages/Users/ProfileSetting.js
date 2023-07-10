import { Cancel, Edit, Save } from "@mui/icons-material";
import { useEffect, useState } from "react";
import usersApi from "../../api/usersApi";
import getUserFromCookie from "../../helper/cookieHelper";
import { format, parseISO } from "date-fns";
import { Slide } from "@mui/material";
import CustomizedSnackbars from "../../components/Snackbar";

export default function ProfileSettings (){
    const [userProfileInfo, setUserProfileInfo] = useState();
    const [isEdit, setIsEdit] = useState(true);
    const [inputs, setInputs] = useState({
        user_id: '',
        gender: '',
        department: '',
        email: '',
        mobile: '',
        name: ''
    });
    const [inputChange, setInputChange] = useState(false);
    const [snackBar, setSnackBar] = useState({ isOpen: false, message: "", type: "", Transition: Slide });

    const getUserProfileInfomation = async () => {
        const res = await usersApi.getOneUser(getUserFromCookie('token').user_id);
        const result = res.data.data[0];
        console.log(result, 'thsi is ')
        setUserProfileInfo(result);
        setInputs({
            user_id: result.user_id,
            gender: result.gender,
            department: result.department,
            email: result.email,
            mobile: result.mobile,
            name: result.name,
            });
    }
    useEffect(() => {
        getUserProfileInfomation();
    }, []);

    const onToggleSave = async() =>{
        console.log(inputs, 'final')
        // setIsEdit(!isEdit);
        const result = await usersApi.updateUserProfile(inputs);
        console.log(result, 'the result')
        if(result.data.message) {
            setSnackBar({ isOpen: true, message: "Update success", type: "success" });
            onToggleCancel();
        }else{
            setSnackBar({ isOpen: true, message: "Update failed", type: "error" })
        }
        // if(result)
        getUserProfileInfomation();
        
    }
    const onToggleCancel = ()=>{
        setIsEdit(!isEdit);
    }
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value }));
        setInputChange(true);
    }   

    return (
    <>
            <CustomizedSnackbars snackBar={snackBar} setSnackBar={setSnackBar} position={{ vertical: 'bottom', horizontal: 'right' }} />

        {isEdit ?
         <div>
                <section className="user_profile_detals">
                        <div className="edit--profile-icon" onClick={onToggleCancel}><Edit /><span>Edit profile</span> </div>
                </section>
                <section className="second-card-user-profile">
                    <div className="user-profile-img">
                        <img src={"/assets/avatar.svg"} />
                        <div className="user_profile_name">{userProfileInfo?.name}</div>
                    </div>
                    {userProfileInfo &&
                        <div className="user-profile-content">
                            <div>
                                <div>
                                    <h5>Student ID</h5>
                                    <h6>{userProfileInfo?.user_id}</h6>
                                </div>
                                <div>
                                    <h5>Gender</h5>
                                    <h6>{userProfileInfo?.gender ?? 'N/A'}</h6>
                                </div>
                                <div>
                                    <h5>Department</h5>
                                    <h6>{userProfileInfo?.department ?? 'N/A'}</h6>
                                </div>

                            </div>
                            <div>
                                <div>
                                    <h5>Phone Number</h5>
                                    <h6>{userProfileInfo?.mobile ?? 'N/A'}</h6>
                                </div>
                                <div>
                                    <h5>Email</h5>
                                    <h6>{userProfileInfo?.email ?? 'N/A'}</h6>
                                </div>
                                <div>
                                    <h5>Register Date</h5>
                                    <h6>{format(parseISO(userProfileInfo.modified), 'dd, MMM yyyy') ?? 'N/A'}</h6>
                                </div>
                            </div>
                        </div>}
                </section>
        </div>
        :
            <div>
                    <section className="user_profile_detals">
                        <div className={`edit--profile-icon save-btn ${inputChange ? '' : 'disabled-save'}`} onClick={inputChange ? onToggleSave : ''}><Save /><span>Save</span> </div>
                        <div className="edit--profile-icon save-btn cancel-btn" onClick={onToggleCancel}><Cancel /><span>Cancel</span> </div>
                    </section>
                    <section className="second-card-user-profile">
                        <div className="user-profile-img">
                            <img src={"/assets/avatar.svg"} />
                            <input
                                value={inputs.name}
                                onChange={handleChange}
                                name="name"
                                id="name"
                                type="text"
                                className="input"
                                autoComplete="off"
                            />
                        </div>
                        {userProfileInfo &&
                            <div className="user-profile-content">
                                <div>
                                    <div>
                                        <h5>Student ID</h5>
                                        <h6>{userProfileInfo?.user_id}</h6>
                                    </div>
                                    <div>
                                        <h5>Gender</h5>
                                        <input
                                            value={inputs.gender}
                                            onChange={handleChange}
                                            name="gender"
                                            id="gender"
                                            type="text"
                                            className="input"
                                            autoComplete="off"
                                        />
                                    </div>
                                    <div>
                                        <h5>Department</h5>
                                        <input
                                            value={inputs.department}
                                            onChange={handleChange}
                                            name="department"
                                            id="department"
                                            type="text"
                                            className="input"
                                            autoComplete="off"
                                        />
                                    </div>

                                </div>
                                <div>
                                    <div>
                                        <h5>Phone Number</h5>
                                        <input
                                            value={inputs.mobile}
                                            onChange={handleChange}
                                            name="mobile"
                                            id="mobile"
                                            type="text"
                                            className="input"
                                            autoComplete="off"
                                        />
                                    </div>
                                    <div>
                                        <h5>Email</h5>
                                        <input
                                            value={inputs.email}
                                            onChange={handleChange}
                                            name="email"
                                            id="email"
                                            type="text"
                                            className="input"
                                            autoComplete="off"
                                        />
                                    </div>
                                    <div>
                                        <h5>Register Date</h5>
                                        <h6>{format(parseISO(userProfileInfo.modified), 'dd, MMM yyyy') ?? 'N/A'}</h6>
                                    </div>
                                </div>
                            </div>}
                    </section>
            </div>
    }
    </>
    )
}