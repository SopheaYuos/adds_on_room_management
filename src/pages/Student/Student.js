import React, { useState } from "react";
import TeacherForm from "./StudentForm";
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

import Controls from "../../components/controls/Controls";
import { Search } from "@material-ui/icons";
import AddIcon from "@material-ui/icons/Add";
import Popup from "../../components/Popup";
import PersonIcon from "@mui/icons-material/Person";
import CloseIcon from "@material-ui/icons/Close";
import Notification from "../../components/Notification";
import ConfirmDialog from "../../components/ConfirmDialog";
import { makeStyles } from "@material-ui/core";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import usersApi from "../../api/usersApi";
import { useEffect } from "react";

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
  { id: "user_id", label: "Student ID" },
  { id: "name", label: "Student Name" },
  { id: "email", label: "Email Address (Personal)" },
  { id: "mobile", label: "Mobile Number" },
  { id: "department", label: "Department" },
  { id: "actions", label: "Actions", disableSorting: true },
];

export default function Student() {
  const label = { inputProps: { "aria-label": "Switch demo" } };
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [records, setRecords] = useState(usersApi.getAllUsers());
  const [status, setStatus] = useState(null);

  // call data
  const [items, setData] = useState([]);
  useEffect(() => {
    usersApi
      .getAllUsers()
      .then((res) => {
        setData(res.data.data);
        console.log(res.data.data);
      })
      .catch((err) => console.log(err));
  }, [recordForEdit, records]);
  //update data

  function updateSTATUS(data, status) {
    data.status = status;
    // console.log(data, "hello");

    usersApi.updateStatus(data).then((response) => {
      setStatus(response.data.data);
      console.log((response.data.data = "stat"), "Data");
    });
  }

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
    useTable(records, headCells, filterFn);

  const handleSearch = (e) => {
    let target = e.target;
    setFilterFn({
      fn: (items) => {
        if (target.value == "") return items;
        else
          return items.filter((x) =>
            x.fullName.toLowerCase().includes(target.value)
          );
      },
    });
  };

  const addOrEdit = (student, resetForm) => {
    console.log(student, "Created student");
    if (student.id == 0) usersApi.createNewUser(student);
    else usersApi.updateUser(student);
    resetForm();
    setRecordForEdit(null);
    setOpenPopup(false);
    setRecords(usersApi.getAllUsers());
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
    usersApi.deleteUser(id);
    setRecords(usersApi.getAllUsers());
    setNotify({
      isOpen: true,
      message: "Deleted Successfully",
      type: "error",
    });
  };

  return (
    <>
      <PageHeader
        title="Student"
        subTitle="Student Information"
        icon={<PersonIcon color="primary" fontSize="large" />}
      />

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
          {/* <Controls.Button
                        text="Export Data"
                        variant="outlined"
                        startIcon={<AddIcon />}
                        className={classes.newButton}
                        onClick={() => {  }}
                    /> */}
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
            {items.map((item) => (
              item.is_delete != 1 &&
              <TableRow key={item} id={item.user_id}>
                <TableCell>{item.user_id}</TableCell>

                <TableCell>{item.name}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>{item.mobile}</TableCell>
                <TableCell>{item.department}</TableCell>
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
        <TeacherForm recordForEdit={recordForEdit} addOrEdit={addOrEdit} />
      </Popup>
      <Notification notify={notify} setNotify={setNotify} />
      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
    </>
  );
}
