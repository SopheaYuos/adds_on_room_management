import React, { useState, useEffect } from 'react'
import { Paper, TableBody, TableRow, TableCell, Toolbar, InputAdornment, Tab } from '@mui/material';
import useTable from "../../components/useTable";
import * as allbookingService from "../../services/allbookingService";
import { makeStyles } from '@material-ui/core';
import bookingApi from "../../api/bookingApi";
import Controls from "../../components/controls/Controls";
import moment from "moment";
// import CloseIcon from '@material-ui/icons/Close';
// import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import dayjs from 'dayjs';

const useStyles = makeStyles(theme => ({
    pageContent: {
        margin: theme.spacing(5),
        padding: theme.spacing(3)
    },
    searchInput: {
        width: '75%'
    },
    newButton: {
        position: 'absolute',
        right: '10px'
    },

}))

const headCells = [
    { id: 'name', label: 'Name' },
    { id: 'room', label: 'Room No' },
    { id: 'subroom', label: 'Sub Room' },
    { id: 'event', label: 'Event Type' },
    { id: 'startdate', label: 'Start Date' },
    { id: 'enddate', label: 'End Date' },
    { id: 'starttime', label: 'Start Time' },
    { id: 'endtime', label: 'End Time' },
    { id: 'person', label: 'Person' },
    { id: 'status', label: 'Status' },
    { id: 'action', label: 'Action' },
]

export default function Allbooking() {
    // call data 
    const [items, setData] = useState([]);
    const [status, setStatus] = useState(null);
    useEffect(() => {
        const getAllBooking = async () => {
            try {
                const response = await bookingApi.getAllBooking();
                setData(response.data.data);
            } catch (error) {
                console.log(error);
            }
        };

        getAllBooking();
    }, [status]);
    //update data


    function updateSTATUS(data, status) {
        data.status = status;
        bookingApi.updateStatus(data).then((response) => {
            setStatus(response.data.data);
            bookingApi.getAllBooking().then((res) => {
                setData(res.data.data);
                // console.log(res.data.data);
            }).catch((err) => console.log(err));
            console.log(response.data.data = "stat", "Data");
        });
    }
    //onSubmit handler 

    const classes = useStyles();
    const [recordForEdit, setRecordForEdit] = useState(null)
    const [records, setRecords] = useState(allbookingService.getAllEmployees())
    const [filterFn, setFilterFn] = useState({ fn: items => { return items; } })
    const [openPopup, setOpenPopup] = useState(false)
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' })

    const {
        TblContainer,
        TblHead,
        TblPagination,
        recordsAfterPagingAndSorting
    } = useTable(records, headCells, filterFn);

    console.log(items, 'this si titems')
    return (
        <>
            <Paper className={classes.pageContent}>
                <TblContainer>
                    <TblHead />
                    <TableBody>
                        {
                            items.map((item, index) =>

                            (
                                item.status === "Approved" && <TableRow key={item}>


                                    <TableCell>{item.responsibler.name}</TableCell>
                                    <TableCell>{item.room_id.room_name}</TableCell>
                                    {item.sub_room_id === null && <TableCell>N/A</TableCell>} {/* cheack condition */}
                                    {item.sub_room_id != null && <TableCell>{item?.sub_room_id?.room_name}</TableCell>}
                                    <TableCell>{item.event_type}</TableCell>
                                    <TableCell>{moment(item.start_date).format('DD MMM YYYY')}</TableCell>
                                    <TableCell>{moment(item.end_date).format('DD MMM YYYY')}</TableCell>
                                    <TableCell>{dayjs(item.start_date).format('hh:mm A')}</TableCell>
                                    <TableCell>{dayjs(item.end_date).format('hh:mm A')}</TableCell>
                                    <TableCell>{item.number_of_people}</TableCell>

                                    {/* <TableCell>{item.action}</TableCell> */}
                                    {/* {item.status === "Approved" && <TableCell><Chip label="Approved" color="success" /></TableCell>} */}
                                    {/* {item.status === "Rejected" && <TableCell><Chip label="Rejected" color="error" /></TableCell>} */}
                                    {item.status === "Pending" && <TableCell><Chip label="Pending" color="warning" /></TableCell>}
                                    <TableCell>

                                        <Controls.ActionButton

                                            onClick={() => { updateSTATUS(item, "Approved") }}
                                        >
                                            <CheckBoxIcon color="success" />

                                        </Controls.ActionButton>
                                        <Controls.ActionButton
                                            onClick={() => { updateSTATUS(item, "Rejected") }}
                                        >
                                            <DisabledByDefaultIcon color="error" />
                                        </Controls.ActionButton>
                                    </TableCell>
                                </TableRow>

                            )
                            )
                        }
                    </TableBody>
                </TblContainer>
                <TblPagination />
            </Paper >
        </>
    )
}

