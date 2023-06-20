import React, { useState, useEffect, useRef } from "react";
import {  CircularProgress, Grid, Switch } from "@mui/material";
import Controls from "../../components/controls/Controls";
import { useForm, Form } from "../../components/useForm";
// import * as roomService from "../../services/roomService";
import roomApi from "../../api/roomsApi";
import CustomInput from "../../components/inputComponent/inputComponent";
import { Category, MeetingRoom, Badge, Add, Remove } from "@mui/icons-material";
import ToggleNew from "../../components/toggleNew";
import ImageUploader from "../../components/uploadImage/uploadImage";
import uploadImageHelper from "../../helper/uploadImageHelper";
import roomsApi from "../../api/roomsApi";

const initialFValues = {
  id: 0,
  roomNo: "",
  subroom: "",
  roomtype: "",
};

export default function RoomForm(props) {
  const { addOrEdit, recordForEdit} = props;
  const [isFocused, setIsFocused] = useState({});
  const [inputs, setInputs] = useState({});
  const [validInput, setValidInput] = useState(true);
  const [hasSubRoom, setHasSubRoom] = useState(false);
  const [toggle, setToggle]  = useState(true);
  const [returnedData, setReturnedData] = useState(null);
  const [choosedImageFileChanged, setChoosedImageFileChanged] = useState(false);
  const [removedSubRoomIndex, setRemovedSubRoomIndex] = useState([]);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(e.target.elements.file.files[0], 'here we go ');
    console.log(inputValues, 'the here')
    if (!inputs.room_name || !inputs.room_type || (hasSubRoom && inputValues[0] === '') ) {
      setValidInput(false);
      return;
    };

    console.log(inputs, 'd');
    // fomat object 
    const req = {
      room_name: inputs.room_name,
      room_type: inputs.room_type,
      has_sub_room: hasSubRoom,
      image_url: returnedData?.secure_url ? returnedData.secure_url : recordForEdit[0].room_image_url,
      sub_room_name: inputValues,
      room_id: recordForEdit[0].id
    }
    const result = await (recordForEdit ? roomsApi.updateRoomV2(req) :  roomsApi.createNewRoom(req));
    // console.log(props.onFormSubmitSuccess(true), 'hello sophea')
    props.onFormSubmitSuccess(result.data.success || false);
  };
  useEffect(() => {
    if (recordForEdit != null){
      let temp = [];
      recordForEdit.forEach((item) => {
        temp.push(item.sub_room_name);
      })
      setInputs(recordForEdit[0]);
      setInputValues(temp);
      setHasSubRoom(recordForEdit[0]?.sub_room_name ? true : false);
    }
  }, []);


  const onToggle = (event) => {
    setIsFocused({
      ...isFocused,
      [event.target.name]: event.type === 'focus',
    });
  }
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    // setIsValid(true);
    setInputs(values => ({ ...values, [name]: value }))
  }
  const onHasSubRoomChange = (event) =>{
    setHasSubRoom(event.target.checked);
    console.log(hasSubRoom, 'sdfadf')
  }
  
  const [inputValues, setInputValues] = useState(['']);
  const handleAddInput = () => {
    setInputValues(prevValues => [...prevValues, '']);
  };

  const handleRemoveInput = (index) => {
    console.log(index, ' new vaues');
    setRemovedSubRoomIndex(index);
    console.log(removedSubRoomIndex, 'stateeindex')
    setInputValues(prevValues => {
      const newValues = [...prevValues];
      newValues.splice(index, 1);
      return newValues;
    });
  };

  const handleInputChange2 = (event, index) => {
    const { value } = event.target;
    const name = event.target.name;
    // const value = event.target.value;
    // setIsValid(true);
    setInputs(values => ({ ...values, [name]: value })) 
    setInputValues(prevValues => {
      const newValues = [...prevValues];
      newValues[index] = value;
      return newValues;
    });
    
  };
  const hanldeDataFromChild = (dataFromChild)=>{
    setReturnedData(dataFromChild);
  }
  const handleFileUploadChange = (isChanged)=>{
    setChoosedImageFileChanged(isChanged);
  }

  return (
    <Form onSubmit={handleSubmit}>
      <ImageUploader onData={hanldeDataFromChild} onFileUploadChange={handleFileUploadChange}/>
      {(recordForEdit && !choosedImageFileChanged) &&
        <img height={'100%'} width={'100%'} src={recordForEdit[0].room_image_url} alt="Preview" />
        
      }
      <CustomInput
        name="room_name"
        label="Room Name (I-103)"
        value={inputs.room_name || ''}
        onChange={handleChange}
        onFocus={onToggle}
        onBlur={!inputs.room_name ? onToggle : null}
        isFocused={isFocused.room_name || recordForEdit !== null}
        isValid={inputs.room_name || validInput ? true : false}
        icon={<Badge/>}
      />
      <CustomInput
        name="room_type"
        label="Room Type (Symposium)"
        value={inputs.room_type || ''}
        onChange={handleChange}
        onFocus={onToggle}
        onBlur={!inputs.room_type ? onToggle : null}
        isFocused={isFocused.room_type || recordForEdit !==null}
        isValid={inputs.room_type || validInput ? true : false}
        icon={<Category />}
      />

      <div style={{display: 'flex', alignItems: 'center'}}>
        <h5 style={{ color: "#555" }}>Has Sub-Room {hasSubRoom}</h5>
        <Switch disableRipple checked={hasSubRoom} onChange={onHasSubRoomChange}/>
      </div>
      {(hasSubRoom)
        && 
        <div>
          {inputValues.map((value, index) => {
            const inputName = `sub_room_name_${index}`;
            return (
                  <div key={index} className="roomform__popup-container">
                    <CustomInput
                      name={inputName}
                      label="Sub-Room Name (A)"
                      onFocus={onToggle}
                      onBlur={!inputs[inputName] ? onToggle : null}
                      isFocused={isFocused[inputName] || recordForEdit !== null}
                      isValid={inputs[inputName] || validInput ? true : false}
                      icon={<Badge />}
                    value={value} onChange={event => handleInputChange2(event, index)} />
                    {index === inputValues.length - 1
                  ? <span className="popup__add-new-sub_room-icon"  onClick={handleAddInput}><Add/></span>
                  : <span className="popup__add-new-sub_room-icon" onClick={() => handleRemoveInput(index)}><Remove/></span>
                    }
                  </div>
            )
          })
        }
        </div>
      }
      <Grid sx={{ paddingRight: "15" }}>
        <input type="submit" className='btn'/>
      </Grid>
    </Form>
  );
}
