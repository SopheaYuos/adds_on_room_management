import { Card, Grid } from "@mui/material";
import { Stack } from "@mui/system";

import * as React from 'react';
import Box from '@mui/material/Box';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Checkbox from '@mui/material/Checkbox';



export default function BookedRoom() {
  const [state, setState] = React.useState({
    gilad: true,
    jason: false,
    antoine: false,
  });

  const handleChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    });
  };

  const { Room101, Room102, Room103 } = state;
  const error = [Room101, Room102, Room103].filter((v) => v).length !== 2;

  return (
    <div>
      <Stack justifyContent="center" alignItems="center"><b>Booked Rooms</b></Stack>
      <Box sx={{ display: 'flex' }}>
        <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
          <Stack direction={"row"} sx={{marginTop:-3}}>
            <Card sx={{width:"360px"}}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox checked={Room101} onChange={handleChange} name="Room101" />
                  }
                  label="Room 101"
                />
                <FormHelperText sx={{ paddingLeft: '30px' }}>03 Sep 2022</FormHelperText>
                
                <FormControlLabel


                  control={
                    <Checkbox checked={Room102} onChange={handleChange} name="Room102" />
                  }
                  label="Room 102"

                />
                <FormHelperText sx={{ paddingLeft: '30px' }}>03 Sep 2022</FormHelperText>
                <Stack spacing={1}
                >

                  <FormControlLabel

                    control={
                      <Checkbox checked={Room103} onChange={handleChange} name="Room103" />
                    }

                    label="Room 103"

                  />
                </Stack>
                <FormHelperText sx={{ paddingLeft: '30px' }}>03 Sep 2022</FormHelperText>
              <FormControl
                component="fieldset"
                sx={{ m: 3 }}
                variant="standard"
              >
                <FormLabel sx={{ paddingLeft: '275px', paddingBottom: '40px', marginTop:-26.5 }} >5/5</FormLabel>
                <FormLabel sx={{ paddingLeft: '275px', paddingBottom: '40px' }} >5/5</FormLabel>
                <FormLabel sx={{  paddingLeft: '275px', paddingBottom: '40px' }} >5/5</FormLabel>

              </FormControl>
              </FormGroup>
              
            </Card>
            <Card sx={{width:"360px"}}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox checked={Room101} onChange={handleChange} name="Room101" />
                  }
                  label="Room 101"
                />
                <FormHelperText sx={{ paddingLeft: '30px' }}>03 Sep 2022</FormHelperText>
                <FormControlLabel


                  control={
                    <Checkbox checked={Room102} onChange={handleChange} name="Room102" />
                  }
                  label="Room 102"

                />
                <FormHelperText sx={{ paddingLeft: '30px' }}>03 Sep 2022</FormHelperText>
                <Stack spacing={1}
                >

                  <FormControlLabel

                    control={
                      <Checkbox checked={Room103} onChange={handleChange} name="Room103" />
                    }

                    label="Room 103"

                  />
                </Stack>
              </FormGroup>
              <FormHelperText sx={{ paddingLeft: '30px' }}>03 Sep 2022</FormHelperText>
              <FormControl


                component="fieldset"
                sx={{ m: 3 }}
                variant="standard"
              >

                <FormGroup>



                </FormGroup>

                <FormLabel sx={{ paddingLeft: '275px', paddingBottom: '40px', marginTop:-26.1}} >5/5</FormLabel>
               
                <FormLabel sx={{ paddingLeft: '275px', paddingBottom: '40px' }} >5/5</FormLabel>
                <FormLabel sx={{ paddingLeft: '275px', paddingBottom: '40px'}} >5/5</FormLabel>

              </FormControl>
            </Card>
          </Stack>
        </FormControl>



      </Box>
    </div>
  );
}




