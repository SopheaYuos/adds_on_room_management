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
  Chip,
} from "@mui/material";
import useTable from "../../components/useTable";
import Controls from "../../components/controls/Controls";
import { Search, Visibility } from "@material-ui/icons";
import AddIcon from "@material-ui/icons/Add";
import Popup from "../../components/Popup";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import CloseIcon from "@material-ui/icons/Close";
import Notification from "../../components/Notification";
import ConfirmDialog from "../../components/ConfirmDialog";
import { makeStyles } from "@material-ui/core";
import MeetingRoomRoundedIcon from "@mui/icons-material/MeetingRoomRounded";
import "./style.css";
import roomsApi from "../../api/roomsApi";
import { useNavigate } from "react-router-dom";
import { groupBy } from "lodash-es";

const useStyles = makeStyles((theme) => ({
  pageContent: {
    // margin: theme.spacing(5),
    padding: theme.spacing(4),
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
  {id: "image", label: "Room image"},
  { id: "roomNumber", label: "Room Number" },
  { id: "roomtype", label: "Room Type" },
  { id: "HasSubRoom", label: "Has Sub Rooms" },
  { id: "actions", label: "Actions", disableSorting: true },
];

export default function Room() {
  const classes = useStyles();
  const navigate = useNavigate();

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
    type: "success",
  });
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });
  // let groupRoom = [];
  const [groupRoom, setGroupRoom] = useState([]);
  useEffect(() => {
    roomsApi.getAllRooms().then((res) => {
      setGroupRoom(Object.keys(groupBy(res.data.data, 'room_name')))
      console.log(groupRoom, 'sdf')

      setRecords(res.data.data);
      console.log(res);
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
    setRecords(records);
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
  const onViewRoomDetail = (item) =>{
    //redirect
    console.log(item, 'item')
    navigate('/room/view-room-detail')
    //show all rooms that includes subrooms and information
    
  }

  const onDelete = (id) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    roomsApi.deleteRoom(id);
    setRecords(records);
    setNotify({
      isOpen: true,
      message: "Deleted Successfully",
      type: "error",
    });
  };

  return (
    
    <div style={{ overflow: 'scroll' }}>
     
      <PageHeader
        title="Room"
        subTitle="Room Information"
        icon={<MeetingRoomRoundedIcon color="primary" fontSize="large" />}
      />
      <Paper className={classes.pageContent}>
        <Toolbar id="room__search-header-container">
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
          <TblHead  />
          

           <TableBody>
            {groupRoom.map((roomName) => {

                let counter = 0;
                    return (
                      
                        recordsAfterPagingAndSorting().map((item) =>{
                            if (roomName === item.room_name && counter === 0){
                              counter++;
                              return (
                               <TableRow key={roomName}>
                                 <TableCell style={{ textAlign: 'center' }}><img src={item.room_image_url || "assets/fall-back-image.png"} height={100} /></TableCell>
                                  <TableCell style={{ textAlign: 'center' }}>{item.room_name}</TableCell>
                                  <TableCell style={{ textAlign: 'center' }}>{item.room_type}</TableCell>
                                  <TableCell style={{ textAlign: 'center' }}>{item.sub_room_name ? <Chip label="Yes" style={{ backgroundColor: 'var(--primary-color)', color: '#fff' }} /> : <Chip label="No" style={{ backgroundColor: 'var(--primary-warning-color)', color: '#fff' }} />}</TableCell>
                                  <TableCell style={{ textAlign: 'center' }}>
                                    <Controls.ActionButton
                                      onClick={() => {
                                        openInPopup(item);
                                      }}
                                      >
                                      <EditOutlinedIcon fontSize="small" />
                                    </Controls.ActionButton>
                                    <Controls.ActionButton
                                      onClick={() => {
                                        onViewRoomDetail(item);
                                      }}
                                    >
                                      <Visibility fontSize="small" />
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
                                  
                              )
                            }
                                
                          }
                          // <div>{counter}</div>

                        )
                      ) 
                  })
                }
                </TableBody>

  
           
      
        </TblContainer>
        <TblPagination />
      </Paper>
      <Popup
        sx={{ height: "100px" }}
        title="Create new Room"
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
    </div>
  );
}
