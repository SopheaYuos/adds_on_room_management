import React, { useState } from "react";
import {
    Paper,
    TableBody,
    TableRow,
    TableCell,
    Toolbar,
    InputAdornment,
    Chip,
} from "@mui/material";
import useTable from "../../../components/useTable";
import Controls from "../../../components/controls/Controls";
import { Search } from "@material-ui/icons";
import Popup from "../../../components/Popup";
import CloseIcon from "@material-ui/icons/Close";
import Notification from "../../../components/Notification";
import ConfirmDialog from "../../../components/ConfirmDialog";
import { makeStyles } from "@material-ui/core";
import { useEffect } from "react";
import bookingApi from "../../../api/bookingApi";
import { format } from "date-fns";

const useStyles = makeStyles((theme) => ({
    pageContent: {
        margin: theme.spacing(5),
        padding: theme.spacing(3),
    },
    searchInput: {
        width: "75%",
    },
    newButton: {
        position: "absolute",
        right: "10px",
    },
}));

const headCells = [
    { id: "no", label: "No" },
    { id: "room_name", label: "Room Name " },
    { id: "sub_room_name", label: "Sub Room Name" },
    { id: "start_date", label: "Start Date" },
    { id: "end_date", label: "End Date" },
    { id: "took_key", label: "Took Key" },
    { id: "returned_key", label: "Returned Key" },
    { id: "topic", label: "Topic" },
    { id: "status", label: "Status" },
    { id: "actions", label: "Actions", disableSorting: true },
];

export default function Student() {
    const label = { inputProps: { "aria-label": "Switch demo" } };
    const [recordForEdit, setRecordForEdit] = useState(null);
    const [records, setRecords] = useState();
    const [status, setStatus] = useState(null);

    // call data
    const [items, setData] = useState([]);
    useEffect(() => {
        bookingApi.getAllBookingOneUser("e20181297")
            .then((res) => {
                setData(res.data.data);
                console.log(res.data.data);
            })
            .catch((err) => console.log(err));
    }, [recordForEdit, records]);
    //update data
    const classes = useStyles();


    const [filterFn, setFilterFn] = useState({
        fn: (items) => {
            return items;
        },
    });
    const [openPopup, setOpenPopup] = useState(false);
    const [notify, setNotify] = useState({
        isOpen: false,
        message: "",
        type: "",
    });
    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        title: "",
        subTitle: "",
    });

    const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } =
        useTable(items, headCells, filterFn);
    const handleSearch = (e) => {
        let target = e.target;
        console.log(target.value, items);
        setFilterFn({
            fn: (items) => {
                console.log('here it is')
                if (target.value === "") return items;
                else {
                    console.log(items, "ROOM");
                    return items.filter(
                        (x) =>
                            x.event_type.toLowerCase().indexOf(target.value.toLowerCase()) !==
                            -1
                    );
                }
            },
        });
        console.log('here it goes');
    };


    const onDelete = (id) => {
        setConfirmDialog({
            ...confirmDialog,
            isOpen: false,
        });
        // usersApi.deleteUser(id);
        setRecords(bookingApi.getAllBookingOneUser("e20181297"));
        setNotify({
            isOpen: true,
            message: "Deleted Successfully",
            type: "error",
        });
    };

    return (
        <>

            <Paper className={classes.pageContent}>
                <Toolbar>
                    <Controls.Input
                        label="Search Students"
                        className={classes.searchInput}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search />
                                </InputAdornment>
                            ),
                        }}
                        onChange={handleSearch}
                    />

                </Toolbar>
                <TblContainer>
                    <TblHead />

                    <TableBody>
                        {recordsAfterPagingAndSorting().map((item, row) => (
                            <TableRow key={item.id} id={item.id}>
                                <TableCell>{row + 1}</TableCell>
                                <TableCell>{item.room_id.room_name}</TableCell>
                                <TableCell>{item.sub_room_id === null ? 'N/A' : item?.sub_room_id?.room_name}</TableCell>
                                <TableCell>{format(new Date(item.start_date), 'dd MMMM yyyy hh:mm:a')}</TableCell>
                                <TableCell>{format(new Date(item.end_date), 'dd MMMM yyyy hh:mm:a')}</TableCell>
                                <TableCell>{item?.took_key === 1 ? <Chip color="success" label="Yes" /> : <Chip label="No" />}</TableCell>
                                <TableCell>{item?.return_key === 1 ? <Chip color="success" label="Yes" /> : <Chip label="No" />}</TableCell>
                                <TableCell>{item.event_type}</TableCell>
                                <TableCell>
                                    {item.status === "Approved" && <Chip color='success' label="Approved" />}
                                    {item.status === "Rejected" && <Chip color='error' label="Rejected" />}
                                    {item.status === "Pending" && <Chip color='warning' label="Pending" />}
                                </TableCell>
                                <TableCell>
                                    <Controls.ActionButton
                                        onClick={() => {
                                            setConfirmDialog({
                                                isOpen: true,
                                                title: "Are you sure to delete this record?",
                                                subTitle: "You can't undo this operation",
                                                onConfirm: () => {
                                                    onDelete(item.user_id);
                                                },
                                            });
                                        }}
                                    >
                                        <CloseIcon color="error" fontSize="small" />
                                    </Controls.ActionButton>
                                </TableCell>
                            </TableRow>

                        ))}
                    </TableBody>
                </TblContainer>
                <TblPagination />
            </Paper>
            <Popup
                sx={{ height: "100px" }}
                title="Student Form"
                openPopup={openPopup}
                setOpenPopup={setOpenPopup}
            >
            </Popup>
            <Notification notify={notify} setNotify={setNotify} />
            <ConfirmDialog
                confirmDialog={confirmDialog}
                setConfirmDialog={setConfirmDialog}
            />
        </>
    );
}
