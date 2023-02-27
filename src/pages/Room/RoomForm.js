import React, { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import Controls from "../../components/controls/Controls";
import { useForm, Form } from "../../components/useForm";
// import * as roomService from "../../services/roomService";
import roomApi from "../../api/roomsApi";

const initialFValues = {
  id: 0,
  roomNo: "",
  subroom: "",
  roomtype: "",
};

export default function RoomForm(props) {
  const { addOrEdit, recordForEdit } = props;

  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("roomNo" in fieldValues)
      temp.roomNo = fieldValues.roomNo ? "" : "This field is required.";
    if ("subroom" in fieldValues)
      temp.subroom = fieldValues.subroom ? "" : "This field is required.";
    if ("roomtype" in fieldValues)
      temp.roomtype = fieldValues.roomtype ? "" : "This field is required.";
    setErrors({
      ...temp,
    });

    if (fieldValues === values)
      return Object.values(temp).every((x) => x === "");
  };

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
    useForm(initialFValues, true, validate);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      addOrEdit(values, resetForm);
    }
  };

  useEffect(() => {
    if (recordForEdit != null)
      setValues({
        ...recordForEdit,
      });
  }, [recordForEdit]);

  return (
    <Form onSubmit={handleSubmit}>
      <Controls.Input
        name="roomNo"
        label="Room No"
        value={values.roomNo}
        onChange={handleInputChange}
        error={errors.roomNo}
      />
      {/* <Controls.Input
        name="subroom"
        label="Sub Room"
        value={values.subroom}
        onChange={handleInputChange}
        error={errors.subroom}
      /> */}
      <Controls.Input
        label="Room Type"
        name="roomtype"
        value={values.roomtype}
        onChange={handleInputChange}
        error={errors.roomtype}
      />

      <Grid sx={{ paddingRight: "15" }}>
        <Controls.Button type="submit" text="Submit" />
        <Controls.Button text="Reset" color="primary" onClick={resetForm} />
      </Grid>
    </Form>
  );
}
