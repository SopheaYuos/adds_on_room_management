import React, { useState, useEffect } from 'react'
import { Paper, TableBody, TableRow, TableCell } from '@mui/material';
import useTable from "../../components/useTable";
import { makeStyles } from '@material-ui/core';
import Chip from '@mui/material/Chip';
import roomsApi from '../../api/roomsApi';
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
    }
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
];

export default function Approved() {

    const classes = useStyles();
    const [recordForEdit, setRecordForEdit] = useState(null)
    const [records, setRecords] = useState();
    const [filterFn, setFilterFn] = useState({ fn: items => { return items; } })
    const [openPopup, setOpenPopup] = useState(false)
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' })
    const [items, setData] = useState([]);
    useEffect(async () => {
        const result = await roomsApi.getAllRooms();
        setRecords(result?.data?.data)
        alert('fuck you')
        console.log('data ===>', result.data.data);
        // roomsApi.getAllRooms().then((res) => {
        //     setRecords(res.data.data);
        // });
    }, []);
    //update data
    const [status, setStatus] = useState(null);
    const {
        TblContainer,
        TblHead,
        TblPagination } = useTable(records, headCells, filterFn);
    return (
        <>
            <Paper className={classes.pageContent}>
                <TblContainer>
                    <TblHead />
                    <TableBody>
                        {
                            items.map(item =>
                            (
                                <TableRow key={item}>
                                    {(item.status) === "Approved" &&
                                        <>
                                            <TableCell>{item.responsibler.name}</TableCell>
                                            <TableCell>{item.room_id.room_name}</TableCell>
                                            {item.sub_room_id === null && <TableCell>N/A</TableCell>}
                                            {item.sub_room_id != null && <TableCell>{item?.sub_room_id?.room_name}</TableCell>}
                                            <TableCell>{item.event_type}</TableCell>
                                            {/* <TableCell>{moment(item.start_date).format('DD MMM YYYY')}</TableCell>
                                            <TableCell>{moment(item.end_date).format('DD MMM YYYY')}</TableCell>
                                            <TableCell>{dayjs(item.start_date).format('hh:mm A')}</TableCell>
                                            <TableCell>{dayjs(item.end_date).format('hh:mm A')}</TableCell> */}
                                            <TableCell>{item.number_of_people}</TableCell>

                                            {item.status === "Approved" && <TableCell><Chip label="Approved" color="success" /></TableCell>}
                                        </>
                                    }

                                </TableRow>)
                            )
                        }
                    </TableBody>
                </TblContainer>
                <TblPagination />
            </Paper>
        </>
    )
}

