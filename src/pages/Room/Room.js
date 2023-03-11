import React, { useState, useEffect } from "react";
import EmployeeForm from "./RoomForm";
import PageHeader from "../../components/PageHeader";
import {
  Paper,
  TableBody,
  TableRow,
  TableCell,
  Toolbar,
  InputAdornment,
} from "@mui/material";
import useTable from "../../components/useTable";
// import * as roomService from "../../services/roomService";
import roomService from "../../api/roomsApi";
import Controls from "../../components/controls/Controls";
import { Search } from "@material-ui/icons";
import AddIcon from "@material-ui/icons/Add";
import Popup from "../../components/Popup";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import CloseIcon from "@material-ui/icons/Close";
import Notification from "../../components/Notification";
import ConfirmDialog from "../../components/ConfirmDialog";
import { makeStyles } from "@material-ui/core";
import MeetingRoomRoundedIcon from "@mui/icons-material/MeetingRoomRounded";
import style from "./style.css";
import roomsApi from "../../api/roomsApi";

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
  { id: "roomNo", label: "Room No" },
  // { id: "subroom", label: "Sub Room" },
  { id: "roomtype", label: "Room Type" },
  { id: "actions", label: "Actions", disableSorting: true },
];

export default function Room() {
  const classes = useStyles();
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [records, setRecords] = useState([]);
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

  useEffect(() => {
    roomsApi.getAllRooms().then((res) => {
      setRecords(res.data.data);
      console.log(res.data.data);
    });
  }, []);
  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } =
    useTable(records, headCells, filterFn);

  const handleSearch = (e) => {
    let target = e.target;
    console.log(target.value);
    setFilterFn({
      fn: (items) => {
        if (target.value === "") return items;
        else {
          console.log(items, "ROOM");
          return items.filter(
            (x) =>
              x.room_name.toLowerCase().indexOf(target.value.toLowerCase()) !==
              -1
          );
        }
      },
    });
  };

  const addOrEdit = (room, resetForm) => {
    if (room.id === 0) roomsApi.createNewRoom(room);
    else roomsApi.updateRoom(room);
    resetForm();
    setRecordForEdit(null);
    setOpenPopup(false);
    setRecords(roomsApi.getAllRooms());
    setNotify({
      isOpen: true,
      message: "Submitted Successfully",
      type: "success",
    });
  };

  const openInPopup = (item) => {
    setRecordForEdit(item);
    setOpenPopup(true);
  };

  const onDelete = (id) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    roomsApi.deleteRoom(id);
    setRecords(roomsApi.getAllRooms());
    setNotify({
      isOpen: true,
      message: "Deleted Successfully",
      type: "error",
    });
  };

  return (
    <>
      <PageHeader
        title="Room"
        subTitle="Room Information"
        icon={<MeetingRoomRoundedIcon color="primary" fontSize="large" />}
      />
      <Paper className={classes.pageContent}>
        <Toolbar>
          <Controls.Input
            label="Search Room"
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
          <div id="addbutton">
            <Controls.Button
              text="Add New"
              variant="outlined"
              startIcon={<AddIcon />}
              className={classes.newButton}
              onClick={() => {
                setOpenPopup(true);
                setRecordForEdit(null);
              }}
            />
          </div>
        </Toolbar>
        <TblContainer>
          <TblHead />
          <TableBody>
            {recordsAfterPagingAndSorting().map((item) => (
              <TableRow key={item.id}>

                <TableCell>{item.room_name}</TableCell>
                <TableCell>{item.room_type}</TableCell>
                <TableCell>
                  <Controls.ActionButton
                    onClick={() => {
                      openInPopup(item);
                    }}
                  >
                    <EditOutlinedIcon fontSize="small" />
                  </Controls.ActionButton>
                  <Controls.ActionButton
                    onClick={() => {
                      setConfirmDialog({
                        isOpen: true,
                        title: "Are you sure to delete this record?",
                        subTitle: "You can't undo this operation",
                        onConfirm: () => {
                          onDelete(item.room_name);
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
        title="Room Form"
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <EmployeeForm recordForEdit={recordForEdit} addOrEdit={addOrEdit} />
      </Popup>
      <Notification notify={notify} setNotify={setNotify} />
      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
    </>
  );
}
