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
import './userBookinStyle.css'

import jwt_decode from 'jwt-decode';
import CustomizedSnackbars from '../../../components/Snackbar';
import io from 'socket.io-client';
import { format, formatISO, parse, parseISO } from 'date-fns';

const socket = io.connect("http://localhost:4000");
export default function Book() {

    const [open, setOpen] = React.useState(false);
    const [roomsData, setRoomData] = useState([]);
    const [bigRoomHasSubRoom, setBigRoomHasSubRoom] = useState();
    const [subRoomsData, setSubRoomData] = useState();
    const [filterTime, setFilterTime] = useState();
    const [filterDate, setFilterDate] = useState();
    const [value, setValue] = React.useState();
    const [selectedDateRange, setSelectedDateRange] = useState({ start_date: "", end_date: "" });
    const [input, setInput] = useState({});
    const [userId, setUserId] = useState();
    const [roomObj, setRoomObj] = useState({});
    const [snackBar, setSnackBar] = useState({ isOpen: false, message: "", type: "", Transition: Slide });
    const [loading, setLoading] = useState(false)
    const [allBookedRooms, setAllBookedRooms] = useState([]);
    const handleClickOpen = (e) => {
        setRoomObj(e);
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
                start_date: selectedDateRange.start_date,
                end_date: selectedDateRange.end_date,
                room_id: roomObj.room_id,
                sub_room_id: roomObj.id,
                responsibler: userId,
            }
        } else {
            bookingObj = {
                ...input,
                status: "Pending",
                start_date: selectedDateRange.start_date,
                end_date: selectedDateRange.end_date,
                room_id: roomObj.id,
                sub_room_id: null,
                responsibler: userId,
            }
        }

        try {

            const { success, message } = (await bookingApi.createNewBooking(bookingObj)).data;
            if (success) setSnackBar({ isOpen: true, message, type: "success" })
            else{
                setSnackBar({ isOpen: true, message, type: "warning" })
            }
            setLoading(false)
            setOpen(false)


        }
        catch (err) {
            setSnackBar({ isOpen: true, message: "Server Error", type: "error" })
            setLoading(false)

        }

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
    const setupSocketListener = () => {
        socket.on('bookingApprovalSocket', (bookingData) => {            
            setAllBookedRooms((arr) => [...arr, bookingData]);
        });
    };

    useEffect(() => {
        setupSocketListener();

        const fetchData = async () => {
            setLoading(true);
            setAllBookedRooms([]);
            try {
                let DateTimeFilter;
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
           
                const [roomRes, subRoomRes] = await Promise.all([roomsApi.getFreeRoomToBook(DateTimeFilter), roomsApi.getFreeSubRoomToBook(DateTimeFilter)])


                //subroom
                let bigRoomWithSubRoom = subRoomRes.data.data
                    .map(item => item.room_id)
                    .filter((value, index, self) => self.indexOf(value) === index);
                let obj = [];
                bigRoomWithSubRoom.forEach((item, index) => {
                    subRoomRes.data.data.forEach(val => {
                        if (val.room_id === item) {
                            obj[index] = val
                        }
                    })
                })


                setRoomData(roomRes.data.data);
                setBigRoomHasSubRoom(obj);
                setSubRoomData(subRoomRes.data.data);
                setSelectedDateRange(DateTimeFilter);
                setUserId(jwt_decode(getCookie("token")).user_id);
                setLoading(false)


                // setSnackBar({ isOpen: true, message: "Filter Successfully", type: "success" })


            } catch (error) {
                console.error(error.message, 'here');
            }
        }

        fetchData();

        return () => {
            socket.off('bookingApprovalSocket');
        };
    }, [filterDate, filterTime]);


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


    const CardForBooking = React.memo((roomProps) => {
        const { id, room_name, room_type, room_image_url, is_free } = roomProps;

        const isRoomBooked = () => {
            
            return allBookedRooms.some((booking) => {
                if (booking.approval_status === "Approved") {
                    return (
                        booking.room_id === id &&
                        format(parseISO(booking.start_date), "yyyy-MM-dd HH:mm:ss") === selectedDateRange.start_date &&
                        format(parseISO(booking.end_date), "yyyy-MM-dd HH:mm:ss") === selectedDateRange.end_date
                    );
                }
                return false;
            });

        };

        const renderButton = () => {
            if (isRoomBooked()) {
                return (
                    <button className="btn disabled">Booked</button>
                );
            }

            return (
                <button className="btn" onClick={() => handleClickOpen(roomProps)}>
                    Book
                </button>
            );
        };

        return (
            <article key={id} className="card">
                <div className="card__img"></div>
                <div  className="card_link">
                    <div
                        className="card__img--hover"
                        style={{ backgroundImage: `url(${room_image_url || '/assets/fall-back-image.png'})` }}
                    ></div>
                </div>
                <div className="card__info">
                    <span className="card__category">{room_type}</span>
                    <h3 className="card__title">{room_name}</h3>
                    {is_free ? (
                        <div>{renderButton()}</div>
                    ) : (
                        <div>
                            <button className="btn disabled" disabled={!is_free}>
                                Booked
                            </button>
                        </div>
                    )}
                </div>
            </article>
        );
    });

    const CardForSubRoomsBooking = React.memo((roomProps) => {
        const { room_id, room, room_type, room_image_url } = roomProps;
       
        const renderSubRoomButton = (subroom) => {
            // const x = format(allBookedRooms[0].start_date, 'dd MMMM yyyy hh:mm:a');
            // console.log(x, 'xnxnxxx')

            const isSubRoomBooked = allBookedRooms.some(
                (booking) =>{
                    if (booking.approval_status === "Approved"){
                        return (
                            booking.room_id === subroom.room_id &&
                            booking.sub_room_id === subroom.id &&
                            format(parseISO(booking.start_date), "yyyy-MM-dd HH:mm:ss") === selectedDateRange.start_date &&
                            format(parseISO(booking.end_date), "yyyy-MM-dd HH:mm:ss") === selectedDateRange.end_date

                    )}
                    return false;
                    } 
            );

            if (subroom.is_free) {
                return (
                    <button className={`btn ${isSubRoomBooked ? 'disabled' : ''}`} onClick={() => handleClickOpen(subroom)}>
                        {subroom.sub_room}
                    </button>
                );
            }

            return (
                <button className="btn disabled">
                    {subroom.sub_room}
                </button>
            );
        };


        return (
            <article key={room_id} className="card">
                <div className="card__img"></div>
                <div className="card_link">
                    <div
                        className="card__img--hover"
                        style={{ backgroundImage: `url(${room_image_url || '/assets/fall-back-image.png'})` }}
                    ></div>
                </div>
                <div className="card__info">
                    <span className="card__category">{room_type}</span>
                    <h3 className="card__title">{room}</h3>
                    <div className="sub_room__content">
                        {subRoomsData.map((subroom) =>
                            subroom.room_id === room_id && (
                                <React.Fragment key={subroom.id}>
                                    {renderSubRoomButton(subroom)}
                                </React.Fragment>
                            )
                        )}
                    </div>
                </div>
            </article>
        );
    });

    return (
        <>

            <Stack sx={{ margin: 5, paddingBottom: 2 }}>

                <Grid sx={{ margin:2, paddingTop: 3, textAlign: 'center' }}><h2>Room Availabilty and Booking</h2></Grid>
                <Grid>
                    <TextField
                        sx={{ width: "200px", mr: 2, ml: 7 }}
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
                            <Grid
                        container
                        direction="row"
                        justifyContent="flex-end"
                        alignItems="flex-end"
                        spacing={5}
                    >
                        <Stack direction={'row'} spacing={2} sx={{ mr: 7 }}>
                            <Chip label="Available" color="primary" />

                            <Chip label="Booked" sx={{ color: "#000" }} />
                        </Stack>
                    </Grid>
                </Grid>
            </Stack>

            <article className='card__container-main'>
                <div className='top-left__indicator'>Rooms</div>
                {
                    loading === true
                        ?
                        <Box height={300} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <CircularProgress />
                        </Box>
                        :
                        <section className='cards'>
                            {roomsData?.map((room) =>
                                // CardForBooking(room)
                                <CardForBooking key={ room.id } {...room } />
                            )}
                        </section>
                }
            </article>
            <article className='card__container-main' id="sub-room__container">
                <div className='top-left__indicator'>SubRooms</div>
                {
                    loading === true
                        ?
                        <Box height={300} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <CircularProgress />
                        </Box>
                        :
                        <section className='cards'>
                            {bigRoomHasSubRoom?.map((item) =>
                             <CardForSubRoomsBooking {...item} />
                            )}

                        </section>
                }
            </article>

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
                                    <TextField name="start_date" value={selectedDateRange.start_date} sx={{ width: "400px", margin: 1 }} id="outlined-basic" label="Start Date" variant="outlined" InputLabelProps={{ shrink: true, readonly: true }} />
                                </Grid>
                                <Grid>
                                    <TextField name="end_date" value={selectedDateRange.end_date} sx={{ width: "400px", margin: 1 }} id="outlined-basic" label="End Date" variant="outlined" InputLabelProps={{ shrink: true, readonly: true }} />
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