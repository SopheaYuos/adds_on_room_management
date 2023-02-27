import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import { Box, Stack } from "@mui/system";
import { Avatar, Button, Card, CircularProgress, Grid, MenuItem, Paper, Slide, Switch } from "@mui/material";
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Chip from '@mui/material/Chip';
import roomsApi from '../../../api/roomsApi';
import bookingApi from '../../../api/bookingApi';
import dayjs from 'dayjs';
import { DatePicker, DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LoadingButton, TimePicker } from '@mui/lab';


import jwt_decode from 'jwt-decode';
import CustomizedSnackbars from '../../../components/Snackbar';


function BasicChips() {
    return (
        <Stack direction="row" spacing={1}>
            <Chip label="Chip Filled" />
            <Chip label="Chip Outlined" variant="outlined" />
        </Stack>
    );
}


export default function Book() {

    const [open, setOpen] = React.useState(false);
    const [roomsData, setRoomData] = useState([]);
    const [bigRoomHasSubRoom, setBigRoomHasSubRoom] = useState();
    const [subRoomsData, setSubRoomData] = useState();
    const [filterTime, setFilterTime] = useState();
    const [filterDate, setFilterDate] = useState();
    const [value, setValue] = React.useState();
    const [startDate, setStartDate] = useState({ start_date: "", end_date: "" });
    const [input, setInput] = useState({});
    const [userId, setUserId] = useState();
    const [roomObj, setRoomObj] = useState({});
    const [snackBar, setSnackBar] = useState({ isOpen: false, message: "", type: "", Transition: Slide });
    const [loading, setLoading] = useState(false)
    const handleClickOpen = (e) => {
        console.log(e);
        setRoomObj(e);
        console.log(roomObj, "roomojb")
        // setRoomId(e.target.id)
        setOpen(true);
    };
    const handleBooking = async () => {
        setLoading(true)

        //check wether it is subroom or big room
        let bookingObj;
        if (roomObj?.sub_room) {
            bookingObj = {
                ...input,
                status: "Pending",
                start_date: startDate.start_date,
                end_date: startDate.end_date,
                room_id: roomObj.room_id,
                sub_room_id: roomObj.id,
                responsibler: userId,
            }
        } else {
            bookingObj = {
                ...input,
                status: "Pending",
                start_date: startDate.start_date,
                end_date: startDate.end_date,
                room_id: roomObj.id,
                sub_room_id: null,
                responsibler: userId,
            }
        }

        try {

            const result = await bookingApi.createNewBooking(bookingObj);
            setSnackBar({ isOpen: true, message: "Booked Sucessfully", type: "success" })
            setLoading(false)
            // console.log(result, "reuslt ")
            setOpen(false)


        }
        catch (err) {
            setSnackBar({ isOpen: true, message: "Server Error", type: "error" })
            setLoading(false)

        }
        console.log(bookingObj, "input")
        console.log(value, "values")
    }

    const handleClose = () => {
        setOpen(false);
        setSnackBar(true)
    };
    const handleChangeInputForm = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setInput(values => ({ ...values, [name]: value }));
    }


    const handleChangeDate = (newValue) => {
        setValue(newValue);
        setFilterDate(newValue.$d)
    };
    const handleSelectTime = (e) => {
        setFilterTime(e.target.value);
    }

    function getCookie(cname) {
        let name = cname + "=";
        let ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                let DateTimeFilter;
                console.log(filterDate, filterTime, 'sss')
                if (!filterTime && !filterDate) {
                    DateTimeFilter = {
                        "start_date": dayjs(new Date).format('YYYY-MM-DD') + " 08:30:00",
                        "end_date": dayjs(new Date).format('YYYY-MM-DD') + " 12:30:00"
                    }
                }
                else if (!filterTime && filterDate) {

                    DateTimeFilter = {
                        "start_date": dayjs(filterDate).format('YYYY-MM-DD') + " 08:30:00",
                        "end_date": dayjs(filterDate).format('YYYY-MM-DD') + " 12:30:00"
                    }
                }
                else if (filterTime && !filterDate) {
                    DateTimeFilter = {
                        "start_date": dayjs(new Date()).format('YYYY-MM-DD') + " " + filterTime.substring(0, 8),
                        "end_date": dayjs(new Date()).format('YYYY-MM-DD') + " " + filterTime.substring(9, 17)
                    }

                } else if (filterTime && filterDate) {
                    DateTimeFilter = {
                        "start_date": dayjs(filterDate).format('YYYY-MM-DD') + " " + filterTime.substring(0, 8),
                        "end_date": dayjs(filterDate).format('YYYY-MM-DD') + " " + filterTime.substring(9, 17)
                    }
                }

                console.log(DateTimeFilter, 'sophea');

                const [roomRes, subRoomRes] = await Promise.all([roomsApi.getFreeRoomToBook(DateTimeFilter), roomsApi.getFreeSubRoomToBook(DateTimeFilter)])


                //subroom
                let bigRoomWithSubRoom = subRoomRes.data.data
                    .map(item => item.room_id)
                    .filter((value, index, self) => self.indexOf(value) === index);
                let obj = [];
                bigRoomWithSubRoom.forEach((item, index) => {
                    subRoomRes.data.data.forEach(val => {
                        console.log(index, "index")
                        if (val.room_id == item) {
                            obj[index] = val
                        }
                    })
                })


                setRoomData(roomRes.data.data);
                setBigRoomHasSubRoom(obj);
                setSubRoomData(subRoomRes.data.data);
                setStartDate(DateTimeFilter);
                setUserId(jwt_decode(getCookie("token")).user_id);
                setLoading(false)


                setSnackBar({ isOpen: true, message: "Filter Successfully", type: "success" })


            } catch (error) {
                console.error(error.message, 'here');
            }
        }

        fetchData();

    }, [filterDate, filterTime]);


    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(4),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));
    const time = [
        {
            value: '08:30:00-12:30:00',
            label: '8:30AM - 12:30AM',
        },
        {
            value: '12:30:00-16:30:00',
            label: '12:30AM - 4:30PM',
        },
    ];

    //Booking handling
    // const [checked, setChecked] = React.useState(false);

    // const handleChange = (event) => {

    //     console.log(!checked)
    //     if (checked === true) setChecked(true)
    //     else setChecked(true)
    // };


    return (
        <>

            <Stack sx={{ margin: 5, paddingBottom: 5 }}>

                <Grid sx={{ paddingTop: 3, textAlign: 'center' }}><h2>Booking Room</h2></Grid>
                <Grid>
                    {/* {<Switch
                        checked={checked}
                        onChange={handleChange}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />} */}
                    <TextField
                        sx={{ width: "200px", mr: 2, ml: 3 }}
                        select
                        label="Filter By Time"
                        defaultValue={time[0].value}
                        onChange={handleSelectTime}
                    >
                        {time.map((option) => (
                            <MenuItem key={option.value} value={option.value} >
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                    <LocalizationProvider dateAdapter={AdapterDayjs} >
                        <DatePicker
                            label="Filter by Date"
                            inputFormat="DD/MMM/YYYY"
                            // minDate={new Date()}
                            value={value}
                            onChange={handleChangeDate}
                            disableMaskedInput
                            renderInput={(params) => <TextField sx={{ width: "200px" }}   {...params} />}
                        />

                    </LocalizationProvider>

                    {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DesktopDatePicker
                            label="Date desktop"
                            inputFormat="MM/DD/YYYY"
                            value={value}
                            onChange={handleChange}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider> */}


                    <Grid
                        container
                        direction="row"
                        justifyContent="flex-end"
                        alignItems="flex-end"
                        spacing={5}
                    >
                        <Stack direction={'row'} spacing={2} sx={{ mr: 6 }}>
                            <Chip label="Available" color="primary" />

                            <Chip label="Booked" sx={{ color: "#000" }} />
                        </Stack>
                    </Grid>
                </Grid>
            </Stack>

            <Stack spacing={1} sx={{ width: "92%", padding: 8, marginTop: "-100px" }}  >
                <Card elevation={2} sx={{ height: "auto", width: "100%" }} >
                    <Grid sx={{ margin: 0 }}><Item elevation={0} sx={{ padding: 2.5, width: 120, background: "#0d47a1", color: "white", fontSize: 20, borderRadius: "10px 0 10px 0" }}><b>Rooms</b></Item></Grid>
                    {
                        loading === true
                            ?
                            <Box height={300} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <CircularProgress />
                            </Box>
                            :
                            <Stack alignItems={"center"} direction={"row"} sx={{ padding: 3, paddingLeft: 25 }}>
                                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>

                                    {roomsData?.map((room) =>

                                        <Grid key={room.id} item xs={6}>
                                            <img src={`/assets/${room.room_name}.jpg`} width="315" height="250" style={{ objectFit: 'cover' }} ></img>
                                            <Item sx={{ height: "auto", width: "250px", paddingTop: 1, fontSize: 20 }}><b> {room.room_name}</b><hr />
                                                <Grid>
                                                    {/* If room is free  */}
                                                    {room.is_free === 1 ?
                                                        <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 1, color: '#fff' }} justifyContent="center">
                                                            <Grid item xs={6}>
                                                                <Button id={room.id} onClick={() => handleClickOpen(room)} label="Book" variant="contained">Book</Button>
                                                            </Grid>
                                                        </Grid>
                                                        :
                                                        /* if not */
                                                        <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 1, color: '#fff' }} justifyContent="center">
                                                            <Grid item xs={6}>
                                                                <Button disabled label="Book" variant="contained" color="error">Book</Button>
                                                            </Grid>
                                                        </Grid>
                                                    }
                                                </Grid>
                                            </Item>
                                        </Grid>
                                    )}
                                </Grid>
                            </Stack>
                    }
                </Card>
                <Card elevation={4} sx={{ height: "auto", borderRadius: "10px" }}>
                    <Grid justifyContent="center"
                        alignItems="center"
                        sx={{ margin: 0 }}>
                        <Item sx={{ padding: 2.5, width: 120, background: "#FF365F", color: "white", fontSize: 20, borderRadius: "10px 0 10px 0" }}>
                            <b>Subrooms</b>
                        </Item>
                    </Grid>
                    {
                        loading === true
                            ?
                            <Box height={300} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <CircularProgress />
                            </Box>
                            :
                            <Grid container spacing={7}
                                sx={{ padding: 2 }}>



                                {
                                    bigRoomHasSubRoom?.map(item =>
                                        <Grid Grid item xs="auto" >


                                            <img src={`/assets/${item.room}.jpg`} width="363" height="250" />
                                            <Item sx={{ height: "auto", width: "300px", fontSize: 16, paddingTop: 1, fontSize: 20 }}><b>{item.room}</b><hr />


                                                <Grid>

                                                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 1, backgroundColor: "blue", color: '#fff' }}>
                                                        {subRoomsData.map(subroom =>
                                                            <Grid item xs={2.3}>
                                                                {subroom.room_id === item.room_id &&
                                                                    <>
                                                                        {subroom.is_free === 1 &&
                                                                            <Button onClick={() => handleClickOpen(subroom)} sx={{ borderRadius: 10 }} >
                                                                                <Avatar id={subroom.id} sx={{ height: "40px", width: "50px", fontSize: 16, backgroundColor: "#1565c0" }}>
                                                                                    {subroom.sub_room}
                                                                                </Avatar>
                                                                            </Button>
                                                                        }
                                                                        {subroom.is_free === 0 &&
                                                                            <Button disabled>
                                                                                <Avatar sx={{ height: "40px", width: "50px", fontSize: 16 }}>
                                                                                    {subroom.sub_room}
                                                                                </Avatar>
                                                                            </Button>
                                                                        }
                                                                    </>
                                                                }
                                                            </Grid>

                                                        )}
                                                    </Grid>
                                                </Grid>

                                            </Item>

                                        </Grid >
                                    )}
                            </Grid >
                    }
                </Card >
            </Stack >
            <Stack >
                <CustomizedSnackbars snackBar={snackBar} setSnackBar={setSnackBar} />
                <Dialog
                    open={open}
                    keepMounted
                    onClose={handleClose}
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle sx={{ textAlign: 'center' }}>{"Request Room"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            <Grid>
                                <Grid>
                                    <TextField name="responsibler" value={userId} sx={{ width: "400px", margin: 1 }} id="outlined-basic" label="ID" InputLabelProps={{ shrink: true, readonly: true }} variant="outlined" />
                                </Grid>

                                <Grid>
                                    <TextField name="start_date" value={startDate.start_date} sx={{ width: "400px", margin: 1 }} id="outlined-basic" label="Start Date" variant="outlined" InputLabelProps={{ shrink: true, readonly: true }} />
                                </Grid>
                                <Grid>
                                    <TextField name="end_date" value={startDate.end_date} sx={{ width: "400px", margin: 1 }} id="outlined-basic" label="End Date" variant="outlined" InputLabelProps={{ shrink: true, readonly: true }} />
                                </Grid>

                                <Grid >

                                    <TextField required name="event_type" onChange={handleChangeInputForm} value={input.event_type} sx={{ width: "400px", margin: 1 }} id="outlined-basic" label="Topic" variant="outlined" />
                                </Grid>
                                <Grid>
                                    <TextField
                                        required
                                        type={"number"} name="number_of_people" onChange={handleChangeInputForm} value={input.number_of_people} sx={{ width: "400px", margin: 1 }} id="outlined-basic" label="Number of People" variant="outlined" />
                                </Grid>
                                <Grid>
                                    <TextField required type="number" name="description" value={input.description} onChange={handleChangeInputForm} sx={{ width: "400px", margin: 1 }} id="outlined-basic" label="Phone Number" variant="outlined" />
                                </Grid>

                                <DialogActions >
                                    <Button variant='outlined' onClick={handleClose} >Cancel</Button>
                                    {
                                        (/^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{3,4})$/.test(input.description)
                                            && input.number_of_people >= 2 && input.event_type.length >= 1)
                                            ?
                                            <LoadingButton variant="contained" onClick={handleBooking} loading={loading} >Book</LoadingButton >
                                            : <Button variant="contained" disabled >Book</Button >
                                    }
                                </DialogActions>
                            </Grid>
                        </DialogContentText>
                    </DialogContent>
                </Dialog>
            </Stack>

        </ >
    );
}