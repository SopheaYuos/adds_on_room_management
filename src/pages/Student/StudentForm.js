import React, { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import Controls from "../../components/controls/Controls";
import { useForm, Form } from "../../components/useForm";
import usersApi from "../../api/usersApi";

const genderItems = [
    { id: 'male', title: 'Male' },
    { id: 'female', title: 'Female' },
    { id: 'other', title: 'Other' },
]

const initialFValues = {
  id: 0,
  name: "",
  email: "",
  mobile: "",
  gender: "",
  department: "",
  position: "",
  role: "",
  Date: Date(),
  isPermanent: false,
};

export default function StudentForm(props) {
  const { addOrEdit, recordForEdit } = props;

  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("name" in fieldValues)
      temp.name = fieldValues.name ? "" : "This field is required.";
    if ("email" in fieldValues)
      temp.email = /$^|.+@.+..+/.test(fieldValues.email)
        ? ""
        : "Email is not valid.";
    if ("mobile" in fieldValues)
      temp.mobile =
        fieldValues.mobile.length > 8 ? "" : "Minimum 9 numbers required.";
    if ("departmentId" in fieldValues)
      temp.departmentId =
        fieldValues.departmentId.length != 0 ? "" : "This field is required.";
    setErrors({
      ...temp,
    });

    if (fieldValues == values) return Object.values(temp).every((x) => x == "");
  };

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
    useForm(initialFValues, true, validate);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log(values, "Data");
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
      <Grid container>
        <Grid item xs={6}>
          <Controls.Input
            name="studentid"
            label="Student ID"
            value={values.user_id}
            onChange={handleInputChange}
            error={errors.studentid}
          />
          <Controls.Input
            name="name"
            label="Full Name"
            value={values.name}
            onChange={handleInputChange}
            error={errors.name}
          />
          <Controls.Input
            label="Email"
            name="email"
            value={values.email}
            onChange={handleInputChange}
            error={errors.email}
          />
          <Controls.Input
            label="Mobile"
            name="mobile"
            value={values.mobile}
            onChange={handleInputChange}
            error={errors.mobile}
          />
        
         
        </Grid>
        
        <Grid item xs={6}>
          {/* <Controls.RadioGroup
                        name="gender"
                        label="Gender"
                        value={values.gender}
                        onChange={handleInputChange}
                        items={genderItems}
                    /> */}
                    <Controls.Input
            label="Gender"
            name="gender"
            value={values.gender}
            onChange={handleInputChange}
            error={errors.gender}
          />
                     <Controls.Input
            label="Department"
            name="department"
            value={values.department}
            onChange={handleInputChange}
            error={errors.department}
          />
           <Controls.Input
            label="Position"
            name="position"
            value={values.position}
            onChange={handleInputChange}
            error={errors.position}
          />
            <Controls.Input
            label="Role"
            name="role"
            value={values.role}
            onChange={handleInputChange}
            error={errors.role}
          />
          {/* <Controls.Select
            name="departmentId"
            label="Department"
            value={values.departmentId}
            onChange={handleInputChange}
            options={StudentService.getDepartmentCollection()}
            error={errors.departmentId}
          /> */}
          {/* <Controls.DatePickerTest
            name="hireDate"
            label="Date of Birth"
            value={values.Date}
            onChange={handleInputChange}
          /> */}

          {/* <Controls.Checkbox
                        name="isPermanent"
                        label="Permanent Employee"
                        value={values.isPermanent}
                        onChange={handleInputChange}
                    /> */}

          <div id="subbutton">
            <Controls.Button type="submit" text="Submit" />
            <Controls.Button text="Reset" color="primary" onClick={resetForm} />
          </div>
        </Grid>
      </Grid>
    </Form>
  );
}
