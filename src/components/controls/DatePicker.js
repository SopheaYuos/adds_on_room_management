import React from 'react'
// import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@mui/material";
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TextField } from '@mui/material';

export default function DatePickerTest(props) {

    const { name, label, value, onChange } = props


    const convertToDefEventPara = (name, value) => ({
        target: {
            name, value
        }
    })

    return (
        <LocalizationProvider dateAdapter={ AdapterDateFns }>
        <DatePicker
              label={label}
              value={value}
              inputFormat="dd/MMM/yyyy"
              renderInput={(params) => (
                <TextField {...params} />
              )}
              onChange={date =>onChange(convertToDefEventPara(name,date))}
              
        />
    </LocalizationProvider>
    )
}
// import * as React from 'react';
// import dayjs from 'dayjs';
// import TextField from '@mui/material/TextField';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';

// export default function StaticDatePickerDemo() {
//   const [value, setValue] = React.useState(dayjs("mm/dd/yyyy"));

//   return (
//     <LocalizationProvider dateAdapter={AdapterDayjs}>
//       <StaticDatePicker disableToolbar variant="inline" inputVariant="outlined"
//         // displayStaticWrapperAs="desktop"
//         openTo="year"
       
//         value={value}
//         onChange={(newValue) => {
//           setValue(newValue);
//         }}
//         renderInput={(params) => <TextField {...params} />}
//       />
//     </LocalizationProvider>
//   );
// }